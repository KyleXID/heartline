import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScoreRing } from "@/components/report/ScoreRing";
import { RedFlagCard } from "@/components/report/RedFlagCard";
import { ReplyCard } from "@/components/report/ReplyCard";
import { StrategyTimeline } from "@/components/report/StrategyTimeline";
import { Loading } from "@/components/ui/loading";

const DEMO_RESULT = {
  interest_score: 72,
  temperature: 68.5,
  reply_timing: { recommendation: "30분 후", reason: "상대방이 적극적으로 대화에 참여하고 있지만, 너무 빠른 답장은 부담을 줄 수 있습니다" },
  suggested_replies: [
    { tone: "가벼운", message: "ㅋㅋ 나도 거기 가보고 싶었어! 이번 주말 어때?", explanation: "상대방의 제안에 자연스럽게 호응" },
    { tone: "진지한", message: "좋은 곳 알고 있구나. 같이 가면 더 좋을 것 같아", explanation: "관심을 직접적으로 표현" },
    { tone: "재치있는", message: "오 거기 맛집이라던데? 네가 사는 거지? 😏", explanation: "장난스럽게 만남의 구실 만들기" },
  ],
  red_flags: [
    { type: "답장 간격 불규칙", description: "상대방의 답장 간격이 점점 벌어지고 있습니다", severity: "low" as const },
  ],
};

export default function DemoPage() {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  function handleAnalyze() {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setShowResult(true);
    }, 2000);
  }

  if (analyzing) {
    return <Loading text="AI가 대화를 분석하고 있어요..." />;
  }

  if (!showResult) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6">
        <div className="text-center">
          <p className="text-4xl">🔍</p>
          <h1 className="mt-4 text-2xl font-bold">샘플 분석 체험</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            실제 분석 결과가 어떻게 나오는지
            <br />
            샘플 대화로 미리 체험해보세요
          </p>
        </div>
        <div className="mt-8 w-full max-w-xs space-y-3">
          <div className="rounded-xl bg-muted/50 p-4 text-sm">
            <p className="font-medium">샘플 대화 미리보기</p>
            <div className="mt-3 space-y-2 text-xs text-muted-foreground">
              <p>[상대] 오늘 뭐해?</p>
              <p>[나] 아직 미정! 왜?</p>
              <p>[상대] 같이 카페 갈래? 새로 생긴 데 있는데</p>
              <p>[나] 오 좋아 몇시에?</p>
              <p>[상대] 5시쯤 어때?</p>
            </div>
          </div>
          <Button className="w-full" size="lg" onClick={handleAnalyze}>
            샘플 분석하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-12 pt-8">
      <div className="rounded-lg bg-primary/5 p-3 text-center text-sm text-primary">
        샘플 분석 결과입니다. 실제 대화로 분석해보세요!
      </div>

      <div className="mt-6 flex justify-center gap-8">
        <ScoreRing score={DEMO_RESULT.interest_score} label="관심도" />
        <ScoreRing score={Math.round(DEMO_RESULT.temperature)} label="대화 온도" />
      </div>

      <Separator className="my-8" />

      <section>
        <h2 className="text-lg font-semibold">답장 타이밍</h2>
        <div className="mt-3 rounded-lg bg-primary/5 p-4">
          <p className="text-lg font-bold text-primary">{DEMO_RESULT.reply_timing.recommendation}</p>
          <p className="mt-1 text-sm text-muted-foreground">{DEMO_RESULT.reply_timing.reason}</p>
        </div>
      </section>

      <Separator className="my-8" />

      <section>
        <h2 className="text-lg font-semibold">추천 답장</h2>
        <div className="mt-3 space-y-3">
          {DEMO_RESULT.suggested_replies.map((reply, i) => (
            <ReplyCard key={i} reply={reply} />
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      <section>
        <h2 className="text-lg font-semibold">위험 신호</h2>
        <div className="mt-3 space-y-2">
          {DEMO_RESULT.red_flags.map((flag, i) => (
            <RedFlagCard key={i} flag={flag} />
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      <section>
        <h2 className="text-lg font-semibold">연애 전략 타임라인</h2>
        <StrategyTimeline interestScore={DEMO_RESULT.interest_score} className="mt-4" />
      </section>

      <div className="mt-10 space-y-3">
        <Button className="w-full" size="lg" onClick={() => navigate("/register")}>
          무료로 시작하기
        </Button>
        <Button variant="ghost" className="w-full" size="lg" onClick={() => navigate("/")}>
          홈으로
        </Button>
      </div>
    </div>
  );
}
