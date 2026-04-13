import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="mt-4 text-muted-foreground">페이지를 찾을 수 없습니다</p>
      <Button className="mt-6" onClick={() => navigate("/")}>
        홈으로 돌아가기
      </Button>
    </div>
  );
}
