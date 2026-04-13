import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth";
import { ApiError } from "@/services/api";

const GENDER_OPTIONS = [
  { value: "M", label: "남성" },
  { value: "F", label: "여성" },
];

const AGE_OPTIONS = [
  { value: "10s", label: "10대" },
  { value: "20s", label: "20대" },
  { value: "30s", label: "30대" },
  { value: "40s", label: "40대 이상" },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    gender: "",
    age_range: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        email: form.email,
        password: form.password,
        nickname: form.nickname,
        gender: form.gender || undefined,
        age_range: form.age_range || undefined,
      });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">회원가입</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            하트라인과 함께 연애 코칭을 시작하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="이메일"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            placeholder="닉네임"
            value={form.nickname}
            onChange={(e) => update("nickname", e.target.value)}
            required
            maxLength={50}
          />
          <Input
            type="password"
            placeholder="비밀번호 (8자 이상)"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <Input
            type="password"
            placeholder="비밀번호 확인"
            value={form.passwordConfirm}
            onChange={(e) => update("passwordConfirm", e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">성별 (선택)</p>
            <div className="flex gap-2">
              {GENDER_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={form.gender === opt.value ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => update("gender", form.gender === opt.value ? "" : opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">연령대 (선택)</p>
            <div className="flex gap-2">
              {AGE_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={form.age_range === opt.value ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => update("age_range", form.age_range === opt.value ? "" : opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? "가입 중..." : "가입하기"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="text-primary hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
