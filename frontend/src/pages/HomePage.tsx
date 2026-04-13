import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";

const FEATURES = [
  { icon: "📸", title: "스크린샷 업로드", desc: "카카오톡 대화를 캡처해서 올려주세요" },
  { icon: "🤖", title: "AI 분석", desc: "관심도, 감정 흐름, 위험 신호를 분석해요" },
  { icon: "💬", title: "맞춤 답장", desc: "3가지 톤으로 최적의 답장을 제안해요" },
  { icon: "📊", title: "전략 코칭", desc: "D-day 기반 연애 전략을 세워드려요" },
];

const STEPS = [
  { num: "1", text: "카카오톡 대화를 스크린샷으로 찍어요" },
  { num: "2", text: "하트라인에 업로드하면 AI가 분석해요" },
  { num: "3", text: "관심도 점수와 맞춤 답장을 받아보세요" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex min-h-[70dvh] flex-col items-center justify-center px-6 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            🫀 하트라인
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            카카오톡 대화를 AI가 분석해
            <br />
            연애 코칭을 해드려요
          </p>
          <p className="text-sm text-muted-foreground">
            상대방의 관심도부터 최적 답장 타이밍까지
          </p>
        </div>
        <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
          <Button size="lg" onClick={() => navigate(isAuthenticated ? "/upload" : "/register")}>
            {isAuthenticated ? "대화 분석하기" : "무료로 시작하기"}
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/demo")}>
            먼저 체험해보기
          </Button>
        </div>
      </section>

      {/* 기능 소개 */}
      <section className="px-6 py-12">
        <h2 className="text-center text-xl font-bold">이런 걸 알 수 있어요</h2>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl">{f.icon}</p>
                <p className="mt-2 text-sm font-semibold">{f.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 사용법 */}
      <section className="bg-muted/30 px-6 py-12">
        <h2 className="text-center text-xl font-bold">3단계로 간단하게</h2>
        <div className="mt-6 space-y-4">
          {STEPS.map((step) => (
            <div key={step.num} className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {step.num}
              </div>
              <p className="text-sm">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-12 text-center">
        <p className="text-lg font-semibold">지금 바로 시작해보세요</p>
        <p className="mt-1 text-sm text-muted-foreground">무료로 대화 분석을 체험할 수 있어요</p>
        <Button className="mt-4" size="lg" onClick={() => navigate("/demo")}>
          샘플 분석 체험하기
        </Button>
      </section>
    </div>
  );
}
