import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth";
import { ApiError } from "@/services/api";
import { PixelCharacter } from "@/components/pixel/PixelCharacter";
import { GameFrame } from "@/components/pixel/GameFrame";

const GENDER_OPTIONS = [
  { value: "M", label: "BOY" },
  { value: "F", label: "GIRL" },
];
const AGE_OPTIONS = [
  { value: "10s", label: "10s" },
  { value: "20s", label: "20s" },
  { value: "30s", label: "30s" },
  { value: "40s", label: "40+" },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", passwordConfirm: "", nickname: "", gender: "", age_range: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.passwordConfirm) { setError("비밀번호가 일치하지 않습니다."); return; }
    setLoading(true);
    try {
      await authService.register({ email: form.email, password: form.password, nickname: form.nickname, gender: form.gender || undefined, age_range: form.age_range || undefined });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "회원가입 중 오류가 발생했습니다.");
    } finally { setLoading(false); }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12 dot-pattern">
      <PixelCharacter type="love" size={5} className="mb-4" bounce />
      <h1 className="text-xl font-bold mb-1" style={{ color: "var(--pixel-dark)" }}>NEW PLAYER</h1>
      <p className="text-xs text-muted-foreground mb-6">하트라인과 함께 연애 코칭을 시작하세요</p>

      <GameFrame variant="default" className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input type="email" placeholder="EMAIL" value={form.email} onChange={(e) => update("email", e.target.value)} required className="pixel-border" />
          <Input placeholder="NICKNAME" value={form.nickname} onChange={(e) => update("nickname", e.target.value)} required className="pixel-border" />
          <Input type="password" placeholder="PASSWORD (8+)" value={form.password} onChange={(e) => update("password", e.target.value)} required minLength={8} className="pixel-border" />
          <Input type="password" placeholder="CONFIRM PASSWORD" value={form.passwordConfirm} onChange={(e) => update("passwordConfirm", e.target.value)} required minLength={8} className="pixel-border" />

          <div>
            <p className="text-[10px] mb-2" style={{ color: "var(--neon-blue)" }}>GENDER (optional)</p>
            <div className="flex gap-2">
              {GENDER_OPTIONS.map((opt) => (
                <Button key={opt.value} type="button" size="sm" className="flex-1 pixel-border font-bold"
                  style={{ backgroundColor: form.gender === opt.value ? "var(--neon-pink)" : "transparent", color: form.gender === opt.value ? "white" : "var(--neon-blue)", borderColor: "var(--neon-purple)" }}
                  onClick={() => update("gender", form.gender === opt.value ? "" : opt.value)}>
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] mb-2" style={{ color: "var(--neon-blue)" }}>AGE (optional)</p>
            <div className="flex gap-2">
              {AGE_OPTIONS.map((opt) => (
                <Button key={opt.value} type="button" size="sm" className="flex-1 pixel-border font-bold"
                  style={{ backgroundColor: form.age_range === opt.value ? "var(--neon-pink)" : "transparent", color: form.age_range === opt.value ? "white" : "var(--neon-blue)", borderColor: "var(--neon-purple)" }}
                  onClick={() => update("age_range", form.age_range === opt.value ? "" : opt.value)}>
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs" style={{ color: "var(--neon-pink)" }}>{error}</p>}
          <Button type="submit" className="w-full pixel-border font-bold" style={{ backgroundColor: "var(--neon-pink)", color: "white" }} disabled={loading}>
            {loading ? "CREATING..." : ">> CREATE PLAYER <<"}
          </Button>
        </form>
      </GameFrame>

      <p className="mt-6 text-xs text-muted-foreground">
        이미 계정이 있으신가요? <Link to="/login" style={{ color: "var(--neon-purple)" }} className="font-bold">LOGIN</Link>
      </p>
    </div>
  );
}
