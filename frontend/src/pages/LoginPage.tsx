import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">로그인</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            하트라인에 오신 것을 환영합니다
          </p>
        </div>
        <div className="space-y-3">
          <Button className="w-full bg-[#FEE500] text-[#191919] hover:bg-[#FDD835]" size="lg">
            카카오로 시작하기
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full"
            onClick={() => navigate("/")}
          >
            돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}
