/**
 * AI 코치가 분석 결과를 채팅 대화체로 알려주는 컴포넌트.
 * 분석 결과를 마치 친구처럼 대화하듯 전달합니다.
 */

import { useState, useEffect } from "react";
import { ChatBubble } from "./ChatBubble";
import { PixelCharacter } from "@/components/pixel/PixelCharacter";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import type { AnalysisResult } from "@/services/analysis";

interface CoachChatProps {
  result: AnalysisResult;
}

interface ChatMessage {
  sender: "coach" | "me";
  name?: string;
  content: React.ReactNode;
  delay: number;
}

function getScoreEmoji(score: number): React.ReactNode {
  if (score >= 70) return <PixelIcon name="fire" size={2} className="inline-block align-middle" />;
  if (score >= 40) return <PixelIcon name="star" size={2} className="inline-block align-middle" />;
  return <PixelIcon name="search" size={2} className="inline-block align-middle" />;
}

function buildMessages(result: AnalysisResult): ChatMessage[] {
  const msgs: ChatMessage[] = [];
  let delay = 0;

  // 인사
  msgs.push({
    sender: "coach",
    name: "하트봇",
    content: "분석 완료! 결과 알려줄게~ 준비됐어? 🎮",
    delay: delay += 200,
  });

  // 관심도
  const scoreLevel = result.interest_score >= 70 ? "꽤 높아!!" : result.interest_score >= 40 ? "나쁘지 않아!" : "음... 좀 낮은 편이야";
  msgs.push({
    sender: "coach",
    name: "하트봇",
    content: (
      <div>
        <p>상대방 관심도: <strong className="text-[var(--neon-pink)]">{result.interest_score}점</strong> {getScoreEmoji(result.interest_score)}</p>
        <p className="mt-1">{scoreLevel}</p>
      </div>
    ),
    delay: delay += 400,
  });

  // 온도
  msgs.push({
    sender: "coach",
    name: "하트봇",
    content: (
      <p>대화 온도는 <strong className="text-[var(--neon-pink)]">{Math.round(result.temperature)}도</strong>야. {result.temperature >= 60 ? "분위기 따뜻한 편!" : "좀 더 분위기를 올려볼까?"}</p>
    ),
    delay: delay += 300,
  });

  // 내 반응
  msgs.push({
    sender: "me",
    content: "오... 그래서 답장은 어떻게 하면 좋을까?",
    delay: delay += 500,
  });

  // 답장 타이밍
  msgs.push({
    sender: "coach",
    name: "하트봇",
    content: (
      <div>
        <p><PixelIcon name="clock" size={2} className="inline-block align-middle mr-1" /> 답장 타이밍:</p>
        <p className="mt-1 text-[var(--neon-yellow)] font-bold">{result.reply_timing_advice.recommendation}</p>
        <p className="mt-1 text-xs opacity-80">{result.reply_timing_advice.reason}</p>
      </div>
    ),
    delay: delay += 400,
  });

  // 추천 답장
  if (result.suggested_replies.length > 0) {
    msgs.push({
      sender: "coach",
      name: "하트봇",
      content: "이런 답장은 어때? 3가지 톤으로 준비했어!",
      delay: delay += 300,
    });

    result.suggested_replies.forEach((reply) => {
      const toneEmoji = reply.tone === "가벼운" ? "😊" : reply.tone === "진지한" ? "🤔" : "😏";
      msgs.push({
        sender: "coach",
        name: "하트봇",
        content: (
          <div>
            <p className="text-xs opacity-70">{toneEmoji} {reply.tone} ver.</p>
            <p className="mt-1 font-bold text-[var(--neon-yellow)]">"{reply.message}"</p>
            <p className="mt-1 text-xs opacity-60">{reply.explanation}</p>
          </div>
        ),
        delay: delay += 300,
      });
    });
  }

  // Red Flags
  if (result.red_flags.length > 0) {
    msgs.push({
      sender: "me",
      content: "혹시 위험한 신호 같은 거 있어...?",
      delay: delay += 500,
    });

    result.red_flags.forEach((flag) => {
      const severity = flag.severity === "high" ? "위험" : flag.severity === "medium" ? "주의" : "참고";
      msgs.push({
        sender: "coach",
        name: "하트봇",
        content: (
          <div>
            <p><PixelIcon name="flag" size={2} className="inline-block align-middle mr-1" /> [{severity}] {flag.type}</p>
            <p className="mt-1 text-xs opacity-80">{flag.description}</p>
          </div>
        ),
        delay: delay += 300,
      });
    });
  }

  // 마무리
  msgs.push({
    sender: "coach",
    name: "하트봇",
    content: (
      <div>
        <p>화이팅! 다음에 또 분석해줄게~ <PixelIcon name="heart" size={2} className="inline-block align-middle" /></p>
      </div>
    ),
    delay: delay += 400,
  });

  return msgs;
}

export function CoachChat({ result }: CoachChatProps) {
  const allMessages = buildMessages(result);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= allMessages.length) return;
    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1);
    }, allMessages[visibleCount]?.delay ?? 300);
    return () => clearTimeout(timer);
  }, [visibleCount, allMessages.length]);

  return (
    <div className="space-y-3">
      {/* 코치 프로필 */}
      <div className="flex items-center gap-2 mb-4">
        <PixelCharacter type="wink" size={4} />
        <div>
          <p className="text-sm font-bold" style={{ color: "var(--neon-purple)" }}>하트봇</p>
          <p className="text-[10px] text-muted-foreground">AI 연애 코치</p>
        </div>
      </div>

      {allMessages.slice(0, visibleCount).map((msg, i) => (
        <ChatBubble key={i} sender={msg.sender} name={msg.name}>
          {msg.content}
        </ChatBubble>
      ))}

      {visibleCount < allMessages.length && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="sparkle">...</span>
          <span>하트봇이 입력 중</span>
        </div>
      )}
    </div>
  );
}
