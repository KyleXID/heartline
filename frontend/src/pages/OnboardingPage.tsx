import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PixelCharacter, type CharacterType } from "@/components/pixel/PixelCharacter";
import { PixelIcon, type IconName } from "@/components/pixel/PixelIcon";

const STEPS: { char: CharacterType; icon: IconName; title: string; desc: string }[] = [
  { char: "wink", icon: "camera", title: "STAGE 1: CAPTURE", desc: "카카오톡에서 분석하고 싶은 대화를\n스크린샷으로 캡처해줘!" },
  { char: "think", icon: "robot", title: "STAGE 2: ANALYZE", desc: "상대방의 관심도, 감정 흐름,\n위험 신호를 AI가 자동 분석!" },
  { char: "love", icon: "trophy", title: "STAGE 3: COACHING", desc: "최적의 답장 타이밍과 문구,\n단계별 연애 전략을 제안해줄게!" },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
    else navigate("/register");
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-between px-6 py-12" style={{ backgroundColor: "var(--pixel-dark)" }}>
      <button className="self-end text-[10px] font-bold" style={{ color: "var(--neon-blue)" }} onClick={() => navigate("/register")}>
        SKIP {">>"}
      </button>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <PixelCharacter type={current.char} size={7} bounce />
        <PixelIcon name={current.icon} size={3} className="mt-4" />
        <h2 className="mt-4 text-lg font-bold" style={{ color: "var(--neon-yellow)" }}>{current.title}</h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed" style={{ color: "var(--neon-blue)" }}>
          {current.desc}
        </p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <div className="flex justify-center gap-3">
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 8,
              height: 8,
              backgroundColor: i === step ? "var(--neon-yellow)" : "var(--neon-purple)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>
        <Button className="w-full pixel-border pixel-shadow font-bold text-base" size="lg" style={{ backgroundColor: "var(--neon-pink)", color: "white" }} onClick={next}>
          {step < STEPS.length - 1 ? "NEXT >>" : ">> START <<"}
        </Button>
      </div>
    </div>
  );
}
