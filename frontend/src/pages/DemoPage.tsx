import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { CoachChat } from "@/components/chat/CoachChat";
import { PixelCharacter } from "@/components/pixel/PixelCharacter";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { GameFrame } from "@/components/pixel/GameFrame";
import { StrategyTimeline } from "@/components/report/StrategyTimeline";
import type { AnalysisResult } from "@/services/analysis";

const DEMO_RESULT: AnalysisResult = {
  id: "demo",
  conversation_id: "demo",
  interest_score: 72,
  temperature: 68.5,
  emotion_timeline: [
    { phase: "초반", emotion: "호기심", intensity: 6 },
    { phase: "중반", emotion: "설렘", intensity: 8 },
    { phase: "후반", emotion: "기대감", intensity: 7 },
  ],
  reply_timing_advice: { recommendation: "30분 후", reason: "상대방이 적극적으로 대화에 참여하고 있지만, 너무 빠른 답장은 부담을 줄 수 있어" },
  suggested_replies: [
    { tone: "가벼운", message: "ㅋㅋ 나도 거기 가보고 싶었어! 이번 주말 어때?", explanation: "상대방의 제안에 자연스럽게 호응" },
    { tone: "진지한", message: "좋은 곳 알고 있구나. 같이 가면 더 좋을 것 같아", explanation: "관심을 직접적으로 표현" },
    { tone: "재치있는", message: "오 거기 맛집이라던데? 네가 사는 거지?", explanation: "장난스럽게 만남의 구실 만들기" },
  ],
  red_flags: [
    { type: "답장 간격 불규칙", description: "상대방의 답장 간격이 점점 벌어지고 있어", severity: "low" },
  ],
  created_at: new Date().toISOString(),
};

export default function DemoPage() {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  function handleAnalyze() {
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setShowResult(true); }, 2000);
  }

  if (analyzing) return <Loading text="ANALYZING..." />;

  if (!showResult) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6">
        <PixelCharacter type="wink" size={6} className="mb-4" bounce />
        <h1 className="text-xl font-bold" style={{ color: "var(--pixel-dark)" }}>DEMO PLAY</h1>
        <p className="text-xs text-muted-foreground mt-1 mb-6">샘플 대화로 미리 체험해봐!</p>

        <GameFrame variant="info" title="SAMPLE CHAT" className="w-full max-w-sm">
          <div className="space-y-2">
            <ChatBubble sender="other" name="민지">오늘 뭐해?</ChatBubble>
            <ChatBubble sender="me">아직 미정! 왜?</ChatBubble>
            <ChatBubble sender="other" name="민지">같이 카페 갈래? 새로 생긴 데 있는데</ChatBubble>
            <ChatBubble sender="me">오 좋아 몇시에?</ChatBubble>
            <ChatBubble sender="other" name="민지">5시쯤 어때?</ChatBubble>
          </div>
        </GameFrame>

        <Button className="mt-6 w-full max-w-sm pixel-border pixel-shadow font-bold text-base" size="lg" style={{ backgroundColor: "var(--neon-pink)", color: "white" }} onClick={handleAnalyze}>
          <PixelIcon name="robot" size={2} className="mr-2" />
          {">> START ANALYSIS <<"}
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 pb-20 pt-6">
      <GameFrame variant="select" title="DEMO RESULT">
        <div className="text-center text-xs" style={{ color: "var(--neon-yellow)" }}>
          샘플 분석 결과! 실제 대화로 해봐~
        </div>
      </GameFrame>

      <div className="mt-6">
        <CoachChat result={DEMO_RESULT} />
      </div>

      <GameFrame variant="info" title="STRATEGY" className="mt-6">
        <StrategyTimeline interestScore={DEMO_RESULT.interest_score} />
      </GameFrame>

      <div className="mt-8 space-y-3">
        <Button className="w-full pixel-border pixel-shadow font-bold" size="lg" style={{ backgroundColor: "var(--neon-pink)", color: "white" }} onClick={() => navigate("/register")}>
          {">> NEW GAME <<"}
        </Button>
        <button className="w-full text-xs py-2 font-bold" style={{ color: "var(--neon-purple)" }} onClick={() => navigate("/")}>[ HOME ]</button>
      </div>
    </div>
  );
}
