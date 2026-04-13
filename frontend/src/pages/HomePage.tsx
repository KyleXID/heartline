import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">🫀 하트라인</h1>
        <p className="text-lg text-muted-foreground">
          카카오톡 대화를 AI가 분석해
          <br />
          연애 코칭을 해드려요
        </p>
        <div className="flex flex-col gap-3 pt-4">
          <Button size="lg" onClick={() => navigate("/login")}>
            시작하기
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate("/upload")}
          >
            먼저 체험해보기
          </Button>
        </div>
      </div>
    </div>
  );
}
