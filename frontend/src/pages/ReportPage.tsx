import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { CoachChat } from "@/components/chat/CoachChat";
import { PixelCharacter } from "@/components/pixel/PixelCharacter";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { GameFrame } from "@/components/pixel/GameFrame";
import { StrategyTimeline } from "@/components/report/StrategyTimeline";
import { analysisService, type AnalysisResult } from "@/services/analysis";
import { ApiError } from "@/services/api";
import { conversationService } from "@/services/conversation";

export default function ReportPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    analysisService
      .getResult(conversationId)
      .then(setResult)
      .catch((err) => {
        setError(err instanceof ApiError && err.status === 404 ? "분석 결과가 아직 없습니다." : "결과를 불러오는 중 오류가 발생했습니다.");
      })
      .finally(() => setLoading(false));
  }, [conversationId]);

  if (loading) return <Loading text="LOADING REPORT..." />;

  if (error || !result) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <PixelCharacter type="sad" size={6} />
        <p className="mt-4 text-sm" style={{ color: "var(--neon-pink)" }}>{error || "결과를 찾을 수 없습니다."}</p>
        <Button className="mt-4 pixel-border font-bold" style={{ backgroundColor: "var(--neon-pink)", color: "white" }} onClick={() => navigate("/upload")}>
          NEW SCAN
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 pb-20 pt-6">
      <GameFrame variant="select" title="ANALYSIS REPORT">
        <div className="text-center text-xs mb-2" style={{ color: "var(--neon-yellow)" }}>
          <PixelIcon name="sparkle" size={2} className="inline-block mr-1" />
          AI 분석 리포트
          <PixelIcon name="sparkle" size={2} className="inline-block ml-1" />
        </div>
      </GameFrame>

      {/* 채팅 대화체 분석 결과 */}
      <div className="mt-6">
        <CoachChat result={result} />
      </div>

      {/* 전략 타임라인 */}
      <GameFrame variant="info" title="STRATEGY" className="mt-6">
        <StrategyTimeline interestScore={result.interest_score} />
      </GameFrame>

      {/* 하단 버튼 */}
      <div className="mt-8 space-y-3">
        <Button className="w-full pixel-border pixel-shadow font-bold" size="lg" style={{ backgroundColor: "var(--neon-pink)", color: "white" }} onClick={() => navigate("/upload")}>
          {">> NEW SCAN <<"}
        </Button>
        <button className="w-full text-xs py-2 font-bold" style={{ color: "var(--neon-purple)" }} onClick={() => navigate("/")}>
          [ HOME ]
        </button>
        <button
          className="w-full text-xs py-2 font-bold pixel-border"
          style={{
            color: isDeleted ? "var(--pixel-dark)" : "var(--neon-pink)",
            borderColor: isDeleted ? "var(--pixel-dark)" : "var(--neon-pink)",
            opacity: isDeleted || isDeleting ? 0.5 : 1,
          }}
          disabled={isDeleted || isDeleting}
          onClick={async () => {
            if (!conversationId) return;
            const confirmed = window.confirm(
              "이미지를 삭제하면 복구할 수 없습니다. 삭제하시겠습니까?",
            );
            if (!confirmed) return;
            setIsDeleting(true);
            try {
              await conversationService.deleteImages(conversationId);
              setIsDeleted(true);
              alert("이미지가 삭제되었습니다.");
            } catch {
              alert("이미지 삭제에 실패했습니다.");
            } finally {
              setIsDeleting(false);
            }
          }}
        >
          {isDeleted ? "[ IMAGES DELETED ]" : isDeleting ? "[ DELETING... ]" : "[ DELETE IMAGES ]"}
        </button>
      </div>
    </div>
  );
}
