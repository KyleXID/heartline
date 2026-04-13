import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { targetService, type Target } from "@/services/target";

const GOALS = ["썸→고백", "재회", "관계발전", "유지", "기타"];

export default function TargetsPage() {
  const navigate = useNavigate();
  const [targets, setTargets] = useState<Target[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [nickname, setNickname] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    targetService.list().then(setTargets).catch(() => {});
  }, []);

  async function handleCreate() {
    if (!nickname.trim()) return;
    setLoading(true);
    try {
      const target = await targetService.create({
        nickname: nickname.trim(),
        relationship_goal: goal || undefined,
      });
      setTargets((prev) => [target, ...prev]);
      setNickname("");
      setGoal("");
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    await targetService.remove(id);
    setTargets((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="px-6 pb-12 pt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">상대방 관리</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "취소" : "+ 추가"}
        </Button>
      </div>

      {showForm && (
        <Card className="mt-4">
          <CardContent className="space-y-3 pt-4">
            <Input
              placeholder="상대방 닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              autoFocus
            />
            <div>
              <p className="mb-2 text-xs text-muted-foreground">관계 목표</p>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((g) => (
                  <Button
                    key={g}
                    type="button"
                    variant={goal === g ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGoal(goal === g ? "" : g)}
                  >
                    {g}
                  </Button>
                ))}
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handleCreate}
              disabled={!nickname.trim() || loading}
            >
              {loading ? "추가 중..." : "추가하기"}
            </Button>
          </CardContent>
        </Card>
      )}

      {targets.length === 0 && !showForm ? (
        <div className="mt-16 text-center">
          <p className="text-4xl">💕</p>
          <p className="mt-3 text-sm text-muted-foreground">
            분석할 상대방을 추가해보세요
          </p>
          <Button className="mt-4" onClick={() => setShowForm(true)}>
            첫 상대 추가하기
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {targets.map((target) => (
            <Card
              key={target.id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => navigate(`/upload?target=${target.id}`)}
            >
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <div>
                  <CardTitle className="text-base">{target.nickname}</CardTitle>
                  {target.relationship_goal && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {target.relationship_goal}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(target.id);
                  }}
                >
                  삭제
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Button
        variant="ghost"
        className="mt-6 w-full"
        onClick={() => navigate(-1)}
      >
        돌아가기
      </Button>
    </div>
  );
}
