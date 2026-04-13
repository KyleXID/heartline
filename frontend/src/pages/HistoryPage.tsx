import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { PixelCharacter } from "@/components/pixel/PixelCharacter";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { GameFrame } from "@/components/pixel/GameFrame";
import { api } from "@/services/api";

interface HistoryItem {
  id: string;
  target_nickname: string;
  status: string;
  created_at: string;
  image_count: number;
  interest_score: number | null;
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<HistoryItem[]>("/conversations/").then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="LOADING..." />;

  return (
    <div className="px-4 pb-20 pt-8">
      <div className="flex items-center gap-2 mb-6">
        <PixelCharacter type="cool" size={4} />
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--pixel-dark)" }}>BATTLE LOG</h1>
          <p className="text-[10px] text-muted-foreground">지금까지 분석한 대화 목록</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-12 text-center">
          <PixelCharacter type="think" size={6} className="mx-auto" />
          <p className="mt-4 text-sm" style={{ color: "var(--neon-purple)" }}>아직 분석한 대화가 없어!</p>
          <Button className="mt-4 pixel-border font-bold" style={{ backgroundColor: "var(--neon-pink)", color: "white" }} onClick={() => navigate("/upload")}>
            FIRST SCAN
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <GameFrame key={item.id} variant={item.interest_score && item.interest_score >= 70 ? "select" : "default"} className="cursor-pointer" onClick={() => navigate(`/report/${item.id}`)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PixelIcon name={item.interest_score && item.interest_score >= 70 ? "fire" : item.interest_score && item.interest_score >= 40 ? "star" : "search"} size={2} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--neon-yellow)" }}>{item.target_nickname}</p>
                    <p className="text-[10px]" style={{ color: "var(--neon-blue)" }}>
                      {new Date(item.created_at).toLocaleDateString("ko-KR")} · {item.image_count}장
                    </p>
                  </div>
                </div>
                {item.interest_score !== null && (
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: "var(--neon-pink)" }}>{item.interest_score}</p>
                    <p className="text-[9px]" style={{ color: "var(--neon-blue)" }}>SCORE</p>
                  </div>
                )}
              </div>
            </GameFrame>
          ))}
        </div>
      )}
    </div>
  );
}
