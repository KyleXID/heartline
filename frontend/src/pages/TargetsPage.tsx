import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { targetService, type Target } from "@/services/target";
import { PixelCharacter } from "@/components/pixel/PixelCharacter";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { GameFrame } from "@/components/pixel/GameFrame";

const GOALS = ["썸→고백", "재회", "관계발전", "유지", "기타"];

export default function TargetsPage() {
  const navigate = useNavigate();
  const [targets, setTargets] = useState<Target[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [nickname, setNickname] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { targetService.list().then(setTargets).catch(() => {}); }, []);

  async function handleCreate() {
    if (!nickname.trim()) return;
    setLoading(true);
    try {
      const target = await targetService.create({ nickname: nickname.trim(), relationship_goal: goal || undefined });
      setTargets((prev) => [target, ...prev]);
      setNickname(""); setGoal(""); setShowForm(false);
    } finally { setLoading(false); }
  }

  async function handleDelete(id: string) {
    await targetService.remove(id);
    setTargets((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="px-4 pb-20 pt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <PixelCharacter type="love" size={4} />
          <h1 className="text-xl font-bold" style={{ color: "var(--pixel-dark)" }}>TARGETS</h1>
        </div>
        <Button size="sm" className="pixel-border font-bold" style={{ backgroundColor: showForm ? "var(--pixel-dark)" : "var(--neon-pink)", color: showForm ? "var(--neon-blue)" : "white" }} onClick={() => setShowForm(!showForm)}>
          {showForm ? "CANCEL" : "+ ADD"}
        </Button>
      </div>

      {showForm && (
        <GameFrame variant="default" title="NEW TARGET" className="mb-4">
          <div className="space-y-3">
            <Input placeholder="NICKNAME" value={nickname} onChange={(e) => setNickname(e.target.value)} autoFocus className="pixel-border" />
            <div>
              <p className="text-[10px] mb-2" style={{ color: "var(--neon-blue)" }}>GOAL</p>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((g) => (
                  <Button key={g} type="button" size="sm" className="pixel-border font-bold"
                    style={{ backgroundColor: goal === g ? "var(--neon-pink)" : "transparent", color: goal === g ? "white" : "var(--neon-blue)", borderColor: "var(--neon-purple)" }}
                    onClick={() => setGoal(goal === g ? "" : g)}>{g}</Button>
                ))}
              </div>
            </div>
            <Button className="w-full pixel-border font-bold" style={{ backgroundColor: "var(--neon-pink)", color: "white" }} onClick={handleCreate} disabled={!nickname.trim() || loading}>
              {loading ? "ADDING..." : ">> ADD TARGET <<"}
            </Button>
          </div>
        </GameFrame>
      )}

      {targets.length === 0 && !showForm ? (
        <div className="mt-12 text-center">
          <PixelCharacter type="sad" size={6} className="mx-auto" />
          <p className="mt-4 text-sm" style={{ color: "var(--neon-purple)" }}>분석할 상대방을 추가해봐!</p>
          <Button className="mt-4 pixel-border font-bold" style={{ backgroundColor: "var(--neon-pink)", color: "white" }} onClick={() => setShowForm(true)}>
            FIRST TARGET
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {targets.map((target) => (
            <GameFrame key={target.id} variant="default" className="cursor-pointer" onClick={() => navigate(`/upload?target=${target.id}`)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PixelIcon name="heart" size={2} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--neon-yellow)" }}>{target.nickname}</p>
                    {target.relationship_goal && <p className="text-[10px]" style={{ color: "var(--neon-blue)" }}>{target.relationship_goal}</p>}
                  </div>
                </div>
                <button className="text-[10px] font-bold" style={{ color: "var(--neon-pink)" }}
                  onClick={(e) => { e.stopPropagation(); handleDelete(target.id); }}>DEL</button>
              </div>
            </GameFrame>
          ))}
        </div>
      )}
    </div>
  );
}
