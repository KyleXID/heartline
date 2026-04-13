import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth";
import { authService } from "@/services/auth";
import { ApiError } from "@/services/api";
import { PixelCharacter } from "@/components/pixel/PixelCharacter";
import { GameFrame } from "@/components/pixel/GameFrame";

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.login({ email, password });
      const user = await authService.getMe();
      setUser(user);
      navigate("/upload");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 dot-pattern">
      <PixelCharacter type="happy" size={5} className="mb-4" bounce />
      <h1 className="text-xl font-bold mb-1" style={{ color: "var(--pixel-dark)" }}>LOGIN</h1>
      <p className="text-xs text-muted-foreground mb-6">하트라인에 오신 것을 환영합니다</p>

      <GameFrame variant="default" className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input type="email" placeholder="EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} required className="pixel-border" />
          <Input type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="pixel-border" />
          {error && <p className="text-xs" style={{ color: "var(--neon-pink)" }}>{error}</p>}
          <Button type="submit" className="w-full pixel-border font-bold" style={{ backgroundColor: "var(--neon-pink)", color: "white" }} disabled={loading}>
            {loading ? "LOADING..." : ">> LOGIN <<"}
          </Button>
        </form>
      </GameFrame>

      <div className="mt-4 w-full max-w-sm">
        <Button className="w-full pixel-border font-bold" style={{ backgroundColor: "#FEE500", color: "#191919" }} size="lg">
          KAKAO LOGIN
        </Button>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        계정이 없으신가요?{" "}
        <Link to="/register" style={{ color: "var(--neon-purple)" }} className="font-bold">REGISTER</Link>
      </p>
    </div>
  );
}
