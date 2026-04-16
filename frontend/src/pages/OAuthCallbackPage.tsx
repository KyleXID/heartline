import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { oauthService } from "@/services/oauth";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/stores/auth";
import { PixelCharacter } from "@/components/pixel/PixelCharacter";
import { GameFrame } from "@/components/pixel/GameFrame";
import { Button } from "@/components/ui/button";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setError("카카오 인증 코드가 없습니다. 다시 로그인해 주세요.");
      return;
    }

    let cancelled = false;

    async function handleCallback(authCode: string) {
      try {
        await oauthService.kakaoCallback(authCode);
        const user = await authService.getMe();
        if (cancelled) return;
        setUser(user);
        navigate("/upload", { replace: true });
      } catch {
        if (cancelled) return;
        setError("카카오 로그인 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    }

    handleCallback(code);

    return () => {
      cancelled = true;
    };
  }, [searchParams, navigate, setUser]);

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 dot-pattern">
        <PixelCharacter type="sad" size={5} className="mb-4" />
        <h1
          className="text-xl font-bold mb-1"
          style={{ color: "var(--neon-pink)" }}
        >
          LOGIN FAILED
        </h1>
        <p className="text-xs text-muted-foreground mb-6">{error}</p>

        <GameFrame variant="danger" className="w-full max-w-sm">
          <div className="flex flex-col items-center gap-3">
            <p
              className="text-xs text-center"
              style={{ color: "var(--neon-pink)" }}
            >
              로그인에 실패했습니다
            </p>
            <Link to="/login" className="w-full">
              <Button
                className="w-full pixel-border font-bold"
                style={{
                  backgroundColor: "var(--neon-purple)",
                  color: "white",
                }}
              >
                {"<< LOGIN >>"}
              </Button>
            </Link>
          </div>
        </GameFrame>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 dot-pattern">
      <PixelCharacter type="happy" size={5} className="mb-4" bounce />
      <h1
        className="text-xl font-bold mb-1"
        style={{ color: "var(--pixel-dark)" }}
      >
        LOADING...
      </h1>
      <p className="text-xs text-muted-foreground mb-6">
        카카오 로그인 처리 중...
      </p>

      <GameFrame variant="default" className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
          <p className="text-xs text-muted-foreground">
            잠시만 기다려 주세요
          </p>
        </div>
      </GameFrame>
    </div>
  );
}
