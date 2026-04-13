import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { ScoreRing } from "@/components/report/ScoreRing";
import { InterestChart } from "@/components/report/InterestChart";
import { RedFlagCard } from "@/components/report/RedFlagCard";
import { ReplyCard } from "@/components/report/ReplyCard";
import { analysisService, type AnalysisResult } from "@/services/analysis";
import { ApiError } from "@/services/api";

export default function ReportPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    analysisService
      .getResult(conversationId)
      .then(setResult)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setError("분석 결과가 아직 없습니다.");
        } else {
          setError("결과를 불러오는 중 오류가 발생했습니다.");
        }
      })
      .finally(() => setLoading(false));
  }, [conversationId]);

  if (loading) return <Loading text="분석 결과 불러오는 중..." />;

  if (error || !result) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6">
        <p className="text-muted-foreground">{error || "결과를 찾을 수 없습니다."}</p>
        <Button className="mt-4" onClick={() => navigate("/upload")}>
          새 대화 분석하기
        </Button>
      </div>
    );
  }

  return (
    <div className="px-6 pb-12 pt-8">
      {/* 헤더 */}
      <h1 className="text-2xl font-bold">분석 리포트</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        AI가 대화를 분석한 결과입니다
      </p>

      {/* 관심도 + 온도 */}
      <div className="mt-8 flex justify-center gap-8">
        <ScoreRing score={result.interest_score} label="관심도" />
        <ScoreRing score={Math.round(result.temperature)} label="대화 온도" />
      </div>

      <Separator className="my-8" />

      {/* 답장 타이밍 */}
      <section>
        <h2 className="text-lg font-semibold">답장 타이밍</h2>
        <div className="mt-3 rounded-lg bg-primary/5 p-4">
          <p className="text-lg font-bold text-primary">
            {result.reply_timing_advice.recommendation}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {result.reply_timing_advice.reason}
          </p>
        </div>
      </section>

      <Separator className="my-8" />

      {/* 추천 답장 */}
      <section>
        <h2 className="text-lg font-semibold">추천 답장</h2>
        <div className="mt-3 space-y-3">
          {result.suggested_replies.map((reply, i) => (
            <ReplyCard key={i} reply={reply} />
          ))}
        </div>
      </section>

      {/* Red Flags */}
      {result.red_flags.length > 0 && (
        <>
          <Separator className="my-8" />
          <section>
            <h2 className="text-lg font-semibold">위험 신호</h2>
            <div className="mt-3 space-y-2">
              {result.red_flags.map((flag, i) => (
                <RedFlagCard key={i} flag={flag} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* 감정 흐름 차트 */}
      {result.emotion_timeline.length > 0 && (
        <>
          <Separator className="my-8" />
          <section>
            <h2 className="text-lg font-semibold">감정 흐름</h2>
            <InterestChart emotionTimeline={result.emotion_timeline} className="mt-4" />
          </section>
        </>
      )}

      {/* 하단 버튼 */}
      <div className="mt-10 space-y-3">
        <Button className="w-full" size="lg" onClick={() => navigate("/upload")}>
          새 대화 분석하기
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          size="lg"
          onClick={() => navigate("/")}
        >
          홈으로
        </Button>
      </div>
    </div>
  );
}
