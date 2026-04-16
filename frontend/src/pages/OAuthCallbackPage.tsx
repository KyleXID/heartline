import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loading } from "@/components/ui/loading";
import { PixelCharacter } from "@/components/pixel/PixelCharacter";
import { GameFrame } from "@/components/pixel/GameFrame";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const code = searchParams.get("code");

  useEffect(() => {
    if (!code) {
      setError("인증 코드가 없습니다.");
      return;
    }
    // Agent B가 실제 로직을 구현할 예정
    // 이 파일은 라우터 통합을 위한 임시 버전
    setError("OAuth 처리 준비 중...");
  }, [code]);

  if (!error) return <Loading text="카카오 로그인 처리 중..." />;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <PixelCharacter type="sad" size={6} />
      <GameFrame variant="danger" className="mt-4 max-w-sm w-full">
        <p
          className="text-center text-sm"
          style={{ color: "var(--neon-pink)" }}
        >
          {error}
        </p>
      </GameFrame>
      <button
        className="mt-4 text-xs font-bold"
        style={{ color: "var(--neon-purple)" }}
        onClick={() => navigate("/login")}
      >
        [ LOGIN ]
      </button>
    </div>
  );
}
