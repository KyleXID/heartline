import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { PixelCharacter } from "@/components/pixel/PixelCharacter";
import { PixelBorder } from "@/components/pixel/PixelBorder";

const FEATURES = [
  { icon: "happy" as const, title: "스크린샷 업로드", desc: "카톡 대화를 캡처해서 올려줘!" },
  { icon: "think" as const, title: "AI가 분석해줌", desc: "관심도, 감정, 위험신호 분석!" },
  { icon: "love" as const, title: "맞춤 답장 추천", desc: "3가지 톤으로 답장 제안!" },
  { icon: "cool" as const, title: "전략 코칭", desc: "D-day 연애 전략 세워줌!" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="flex flex-col">
      {/* Hero — 싸이월드 미니홈피 느낌 */}
      <section className="relative flex min-h-[75dvh] flex-col items-center justify-center px-6 text-center dot-pattern">
        <div className="space-y-2">
          <div className="flex items-end justify-center gap-3 mb-4">
            <PixelCharacter type="love" size={7} bounce />
            <PixelCharacter type="heart" size={5} className="sparkle" />
            <PixelCharacter type="happy" size={7} bounce />
          </div>

          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--pixel-dark)" }}>
            HEARTLINE
          </h1>
          <p className="text-base" style={{ color: "var(--neon-purple)" }}>
            카톡 대화 AI 분석 연애 코칭
          </p>
          <p className="text-sm text-muted-foreground">
            * 상대방 관심도부터 최적 답장까지 *
          </p>
        </div>

        <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
          <Button
            size="lg"
            className="pixel-shadow pixel-border text-base"
            style={{ backgroundColor: "var(--neon-pink)", color: "white" }}
            onClick={() => navigate(isAuthenticated ? "/upload" : "/register")}
          >
            {isAuthenticated ? ">> 대화 분석하기 <<" : ">> START <<"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="pixel-shadow-sm pixel-border text-base"
            onClick={() => navigate("/demo")}
          >
            먼저 체험해보기
          </Button>
        </div>

        <div className="absolute bottom-4 right-4 opacity-50">
          <PixelCharacter type="cool" size={5} />
        </div>
      </section>

      {/* 기능 소개 — 오락실 셀렉트 화면 */}
      <section className="px-6 py-10" style={{ backgroundColor: "var(--pixel-dark)" }}>
        <h2 className="text-center text-lg font-bold" style={{ color: "var(--neon-yellow)" }}>
          - SELECT YOUR POWER -
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <PixelBorder key={f.title} color="var(--neon-purple)" className="bg-[#1a1a3e] text-center">
              <PixelCharacter type={f.icon} size={5} className="mx-auto" />
              <p className="mt-2 text-sm font-bold" style={{ color: "var(--neon-pink)" }}>
                {f.title}
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--neon-blue)" }}>
                {f.desc}
              </p>
            </PixelBorder>
          ))}
        </div>
      </section>

      {/* 사용법 — 싸이월드 방명록 스타일 */}
      <section className="px-6 py-10 dot-pattern">
        <h2 className="text-center text-lg font-bold" style={{ color: "var(--pixel-dark)" }}>
          ~ HOW TO PLAY ~
        </h2>
        <div className="mt-6 space-y-4">
          {[
            { num: "1P", char: "happy" as const, text: "카톡 대화를 스크린샷으로 찍어!" },
            { num: "2P", char: "think" as const, text: "하트라인에 업로드하면 AI가 분석!" },
            { num: "3P", char: "love" as const, text: "관심도 점수랑 맞춤 답장 GET!" },
          ].map((step) => (
            <div key={step.num} className="flex items-center gap-4">
              <PixelBorder
                color="var(--neon-purple)"
                className="flex h-10 w-12 shrink-0 items-center justify-center text-sm font-bold"
                style={{ backgroundColor: "var(--pixel-dark)", color: "var(--neon-yellow)" }}
              >
                {step.num}
              </PixelBorder>
              <PixelCharacter type={step.char} size={5} />
              <p className="flex-1 text-sm">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-10 text-center" style={{ backgroundColor: "var(--cyworld-pink)", color: "var(--pixel-dark)" }}>
        <PixelCharacter type="love" size={8} className="mx-auto mb-4" bounce />
        <p className="text-lg font-bold">지금 바로 시작해봐!</p>
        <p className="mt-1 text-sm">무료로 대화 분석 체험 가능 ♥</p>
        <Button
          className="mt-4 pixel-shadow pixel-border text-base"
          size="lg"
          style={{ backgroundColor: "var(--pixel-dark)", color: "var(--neon-yellow)" }}
          onClick={() => navigate("/demo")}
        >
          {">> DEMO PLAY <<"}
        </Button>
      </section>
    </div>
  );
}
