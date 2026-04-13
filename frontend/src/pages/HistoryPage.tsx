import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { ScoreBadge } from "@/components/ui/score-badge";
import { api } from "@/services/api";

interface HistoryItem {
  id: string;
  target_nickname: string;
  status: string;
  created_at: string;
  image_count: number;
  interest_score: number | null;
  temperature: number | null;
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<HistoryItem[]>("/conversations/")
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="px-6 pb-12 pt-8">
      <h1 className="text-2xl font-bold">분석 이력</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        지금까지 분석한 대화 목록입니다
      </p>

      {items.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-4xl">📊</p>
          <p className="mt-3 text-sm text-muted-foreground">
            아직 분석한 대화가 없습니다
          </p>
          <Button className="mt-4" onClick={() => navigate("/upload")}>
            첫 대화 분석하기
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => navigate(`/report/${item.id}`)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{item.target_nickname}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString("ko-KR")} · {item.image_count}장
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.status === "analyzed" ? "분석 완료" : item.status}
                  </p>
                </div>
                {item.interest_score !== null && (
                  <ScoreBadge score={item.interest_score} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
