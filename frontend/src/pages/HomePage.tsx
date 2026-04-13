import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { PixelCharacter } from "@/components/pixel/PixelCharacter";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { GameFrame } from "@/components/pixel/GameFrame";
import { BubbleTitle } from "@/components/pixel/BubbleTitle";

const FEATURES = [
  { icon: "camera" as const, char: "happy" as const, title: "UPLOAD", desc: "카톡 대화를 캡처해서 올려줘!" },
  { icon: "robot" as const, char: "think" as const, title: "ANALYZE", desc: "AI가 관심도를 분석해줌!" },
  { icon: "chat" as const, char: "love" as const, title: "REPLY", desc: "3가지 톤으로 답장 추천!" },
  { icon: "chart" as const, char: "cool" as const, title: "STRATEGY", desc: "D-day 전략 세워줌!" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[60dvh] flex-col items-center justify-center px-6 py-10 text-center dot-pattern overflow-hidden">
        {/* 떠다니는 아이콘들 */}
        <div className="absolute top-8 left-6 sparkle"><PixelIcon name="heart" size={3} /></div>
        <div className="absolute top-16 right-8 sparkle" style={{ animationDelay: "0.5s" }}><PixelIcon name="star" size={2} /></div>
        <div className="absolute bottom-24 left-10 sparkle" style={{ animationDelay: "1s" }}><PixelIcon name="sparkle" size={2} /></div>

        <div className="space-y-3">
          <div className="flex items-end justify-center gap-4 mb-2">
            <PixelCharacter type="love" size={5} bounce />
            <PixelIcon name="heart" size={4} className="sparkle" />
            <PixelCharacter type="happy" size={5} bounce />
          </div>

          <BubbleTitle text="HEARTLINE" size="lg" />
          <p className="text-sm mt-2" style={{ color: "var(--neon-purple)" }}>
            - 카톡 대화 AI 분석 연애 코칭 -
          </p>
        </div>

        <div className="mt-8 w-full max-w-xs space-y-3">
          <GameFrame variant="select">
            <Button
              size="lg"
              className="w-full pixel-border text-base font-bold"
              style={{ backgroundColor: "var(--neon-pink)", color: "white", borderColor: "var(--pixel-dark)" }}
              onClick={() => navigate(isAuthenticated ? "/upload" : "/register")}
            >
              {isAuthenticated ? "CONTINUE" : "NEW GAME"}
            </Button>
          </GameFrame>
          <button
            className="w-full text-sm py-2 font-bold"
            style={{ color: "var(--neon-purple)" }}
            onClick={() => navigate("/demo")}
          >
            [ DEMO PLAY ]
          </button>
        </div>
      </section>

      {/* 기능 소개 — 고전게임 캐릭터 셀렉트 */}
      <section className="px-4 py-10 scanlines relative" style={{ backgroundColor: "var(--pixel-dark)" }}>
        <p className="text-center text-xs font-bold mb-1" style={{ color: "var(--neon-blue)" }}>
          PLAYER SELECT
        </p>
        <h2 className="text-center text-lg font-bold mb-6" style={{ color: "var(--neon-yellow)" }}>
          - CHOOSE YOUR POWER -
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <GameFrame key={f.title} variant="default" title={f.title}>
              <div className="flex flex-col items-center gap-2 py-1">
                <PixelCharacter type={f.char} size={4} />
                <PixelIcon name={f.icon} size={2} />
                <p className="text-xs" style={{ color: "var(--neon-blue)" }}>
                  {f.desc}
                </p>
              </div>
            </GameFrame>
          ))}
        </div>
      </section>

      {/* 사용법 */}
      <section className="px-6 py-10 dot-pattern">
        <h2 className="text-center text-lg font-bold mb-6" style={{ color: "var(--pixel-dark)" }}>
          ~ HOW TO PLAY ~
        </h2>
        <div className="space-y-4">
          {[
            { step: "STAGE 1", char: "wink" as const, icon: "camera" as const, text: "카톡 대화를 스크린샷으로 찍어!" },
            { step: "STAGE 2", char: "think" as const, icon: "robot" as const, text: "하트라인에 업로드하면 AI가 분석!" },
            { step: "STAGE 3", char: "love" as const, icon: "trophy" as const, text: "관심도 점수랑 맞춤 답장 GET!" },
          ].map((s) => (
            <GameFrame key={s.step} variant="info" title={s.step}>
              <div className="flex items-center gap-3">
                <PixelCharacter type={s.char} size={4} />
                <div className="flex-1">
                  <p className="text-sm" style={{ color: "var(--neon-blue)" }}>{s.text}</p>
                </div>
                <PixelIcon name={s.icon} size={2} />
              </div>
            </GameFrame>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-10 text-center" style={{ backgroundColor: "var(--cyworld-pink)" }}>
        <PixelCharacter type="love" size={6} className="mx-auto mb-3" bounce />
        <div className="flex justify-center gap-2 mb-3">
          <PixelIcon name="heart" size={2} className="sparkle" />
          <PixelIcon name="heart" size={2} className="sparkle" style={{ animationDelay: "0.3s" }} />
          <PixelIcon name="heart" size={2} className="sparkle" style={{ animationDelay: "0.6s" }} />
        </div>
        <p className="text-lg font-bold" style={{ color: "var(--pixel-dark)" }}>
          지금 바로 시작해봐!
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--pixel-dark)" }}>
          무료로 대화 분석 체험 가능
        </p>
        <Button
          className="mt-4 pixel-shadow pixel-border text-base font-bold"
          size="lg"
          style={{ backgroundColor: "var(--pixel-dark)", color: "var(--neon-yellow)", borderColor: "var(--neon-yellow)" }}
          onClick={() => navigate("/demo")}
        >
          {">> DEMO PLAY <<"}
        </Button>
      </section>
    </div>
  );
}
