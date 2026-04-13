import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ONBOARDING_STEPS = [
  {
    emoji: "📸",
    title: "대화 스크린샷을 찍어주세요",
    description: "카카오톡에서 분석하고 싶은 대화를\n스크린샷으로 캡처해주세요",
  },
  {
    emoji: "🤖",
    title: "AI가 대화를 분석해요",
    description: "상대방의 관심도, 감정 흐름,\n위험 신호를 자동으로 분석합니다",
  },
  {
    emoji: "💕",
    title: "맞춤 연애 코칭을 받으세요",
    description: "최적의 답장 타이밍과 문구,\n단계별 연애 전략을 제안해드려요",
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const current = ONBOARDING_STEPS[step];

  function next() {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/register");
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-between px-6 py-12">
      <button
        className="self-end text-sm text-muted-foreground"
        onClick={() => navigate("/register")}
      >
        건너뛰기
      </button>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-6xl">{current.emoji}</p>
        <h2 className="mt-6 text-xl font-bold">{current.title}</h2>
        <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
          {current.description}
        </p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        {/* 인디케이터 */}
        <div className="flex justify-center gap-2">
          {ONBOARDING_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? "w-6 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <Button className="w-full" size="lg" onClick={next}>
          {step < ONBOARDING_STEPS.length - 1 ? "다음" : "시작하기"}
        </Button>
      </div>
    </div>
  );
}
