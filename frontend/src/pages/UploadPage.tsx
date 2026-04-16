import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ImageDropzone } from "@/components/upload/ImageDropzone";
import { PixelCharacter } from "@/components/pixel/PixelCharacter";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { GameFrame } from "@/components/pixel/GameFrame";
import { analysisService } from "@/services/analysis";
import { conversationService } from "@/services/conversation";
import { targetService, type Target } from "@/services/target";
import { ApiError } from "@/services/api";

type UploadStep = "idle" | "uploading" | "ocr" | "analyzing" | "done";

const STEP_LABELS: Record<UploadStep, string> = {
  idle: "READY",
  uploading: "UPLOADING...",
  ocr: "OCR PROCESSING...",
  analyzing: "AI ANALYZING...",
  done: "COMPLETE!",
};

const STEP_CHARACTERS: Record<UploadStep, "think" | "cool" | "love" | "happy" | "wink"> = {
  idle: "think",
  uploading: "cool",
  ocr: "think",
  analyzing: "love",
  done: "happy",
};

const STEP_PROGRESS: Record<UploadStep, number> = {
  idle: 0,
  uploading: 25,
  ocr: 50,
  analyzing: 75,
  done: 100,
};

const POLL_INTERVAL = 2000;
const POLL_TIMEOUT = 60000;

export default function UploadPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetIdFromUrl = searchParams.get("target");

  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState<UploadStep>("idle");
  const [error, setError] = useState("");

  // Target selection state
  const [targets, setTargets] = useState<Target[]>([]);
  const [selectedTargetId, setSelectedTargetId] = useState(targetIdFromUrl ?? "");
  const [loadingTargets, setLoadingTargets] = useState(!targetIdFromUrl);

  const abortRef = useRef(false);

  // Fetch targets if no target param in URL
  useEffect(() => {
    if (targetIdFromUrl) {
      setSelectedTargetId(targetIdFromUrl);
      return;
    }
    setLoadingTargets(true);
    targetService
      .list()
      .then((list) => {
        setTargets(list);
        if (list.length === 1) setSelectedTargetId(list[0].id);
      })
      .catch(() => {
        setError("대상 목록을 불러오는데 실패했습니다.");
      })
      .finally(() => setLoadingTargets(false));
  }, [targetIdFromUrl]);

  const isProcessing = step !== "idle" && step !== "done";
  const targetId = selectedTargetId;

  const pollForOcrComplete = useCallback(
    async (conversationId: string): Promise<void> => {
      const start = Date.now();

      while (Date.now() - start < POLL_TIMEOUT) {
        if (abortRef.current) throw new Error("aborted");

        const conversation = await conversationService.getStatus(conversationId);
        if (
          conversation.status === "ocr_complete" ||
          conversation.status === "analyzed"
        ) {
          return;
        }
        if (conversation.status === "failed") {
          throw new Error("OCR 처리에 실패했습니다. 이미지를 확인해주세요.");
        }
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
      }

      throw new Error("OCR 처리 시간이 초과되었습니다. 다시 시도해주세요.");
    },
    [],
  );

  async function handleAnalyze() {
    if (files.length === 0 || !targetId) return;

    abortRef.current = false;
    setError("");

    try {
      // Step 1: Create conversation
      setStep("uploading");
      const conversation = await conversationService.create(targetId);

      // Step 2: Upload images
      await conversationService.uploadImages(conversation.id, files);

      // Step 3: Poll for OCR completion
      setStep("ocr");
      await pollForOcrComplete(conversation.id);

      if (abortRef.current) return;

      // Step 4: Run AI analysis
      setStep("analyzing");
      await analysisService.analyze(conversation.id);

      // Step 5: Navigate to report
      setStep("done");
      setTimeout(() => {
        navigate(`/report/${conversation.id}`);
      }, 500);
    } catch (err) {
      if (abortRef.current) return;

      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
      setStep("idle");
    }
  }

  function handleRetry() {
    setError("");
    handleAnalyze();
  }

  function handleCancel() {
    abortRef.current = true;
    setStep("idle");
    setError("");
  }

  return (
    <div className="flex flex-1 flex-col px-6 pt-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <PixelCharacter type={STEP_CHARACTERS[step]} size={4} />
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--pixel-dark)" }}
          >
            UPLOAD
          </h1>
          <p className="text-xs text-muted-foreground">
            {step === "idle"
              ? "카톡 대화 스크린샷을 순서대로 올려줘!"
              : STEP_LABELS[step]}
          </p>
        </div>
      </div>

      {/* Target selector (only shown when no target in URL) */}
      {!targetIdFromUrl && (
        <GameFrame variant="default" title="TARGET" className="mb-4">
          {loadingTargets ? (
            <p
              className="text-center text-xs"
              style={{ color: "var(--neon-blue)" }}
            >
              LOADING...
            </p>
          ) : targets.length === 0 ? (
            <div className="text-center">
              <p
                className="text-xs"
                style={{ color: "var(--neon-purple)" }}
              >
                분석할 상대방이 없습니다.
              </p>
              <Button
                className="mt-2 pixel-border font-bold"
                size="sm"
                style={{
                  backgroundColor: "var(--neon-pink)",
                  color: "white",
                }}
                onClick={() => navigate("/targets")}
              >
                + ADD TARGET
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {targets.map((t) => (
                <Button
                  key={t.id}
                  type="button"
                  size="sm"
                  className="pixel-border font-bold"
                  style={{
                    backgroundColor:
                      selectedTargetId === t.id
                        ? "var(--neon-pink)"
                        : "transparent",
                    color:
                      selectedTargetId === t.id
                        ? "white"
                        : "var(--neon-blue)",
                    borderColor: "var(--neon-purple)",
                  }}
                  onClick={() => setSelectedTargetId(t.id)}
                  disabled={isProcessing}
                >
                  <PixelIcon name="heart" size={1.5} className="mr-1" />
                  {t.nickname}
                </Button>
              ))}
            </div>
          )}
        </GameFrame>
      )}

      {/* Progress indicator (during processing) */}
      {isProcessing && (
        <ProgressPanel step={step} onCancel={handleCancel} />
      )}

      {/* Error display */}
      {error && (
        <GameFrame variant="danger" title="ERROR" className="mb-4">
          <div className="space-y-2 text-center">
            <PixelCharacter type="sad" size={4} className="mx-auto" />
            <p
              className="text-xs font-bold"
              style={{ color: "var(--neon-pink)" }}
            >
              {error}
            </p>
            <Button
              className="pixel-border font-bold"
              size="sm"
              style={{
                backgroundColor: "var(--neon-pink)",
                color: "white",
              }}
              onClick={handleRetry}
              disabled={files.length === 0 || !targetId}
            >
              <PixelIcon name="lightning" size={1.5} className="mr-1" />
              RETRY
            </Button>
          </div>
        </GameFrame>
      )}

      {/* Image dropzone */}
      <GameFrame
        variant="info"
        title="SCREENSHOTS"
        className="flex-1"
      >
        <ImageDropzone
          files={files}
          onFilesChange={setFiles}
          disabled={isProcessing}
        />
      </GameFrame>

      {/* Bottom buttons */}
      <div className="mt-6 space-y-3">
        <Button
          className="w-full pixel-border pixel-shadow font-bold text-base"
          size="lg"
          style={{
            backgroundColor:
              files.length > 0 && targetId
                ? "var(--neon-pink)"
                : "var(--pixel-dark)",
            color:
              files.length > 0 && targetId
                ? "white"
                : "var(--neon-blue)",
          }}
          onClick={handleAnalyze}
          disabled={files.length === 0 || !targetId || isProcessing}
        >
          <PixelIcon name="robot" size={2} className="mr-2" />
          {isProcessing
            ? STEP_LABELS[step]
            : `>> ANALYZE (${files.length}) <<`}
        </Button>
        <button
          className="w-full text-xs py-2 font-bold"
          style={{ color: "var(--neon-purple)" }}
          onClick={() => navigate(-1)}
          disabled={isProcessing}
        >
          [ BACK ]
        </button>
      </div>
    </div>
  );
}

/** Progress panel — receives step as the full union so TS doesn't narrow it */
function ProgressPanel({
  step,
  onCancel,
}: {
  step: UploadStep;
  onCancel: () => void;
}) {
  const STEP_ORDER: UploadStep[] = ["uploading", "ocr", "analyzing", "done"];

  function isStepDone(current: UploadStep, target: UploadStep): boolean {
    return STEP_ORDER.indexOf(current) > STEP_ORDER.indexOf(target);
  }

  return (
    <GameFrame variant="select" title="PROGRESS" className="mb-4">
      <div className="space-y-3">
        {/* Progress bar */}
        <div
          className="h-4 w-full overflow-hidden"
          style={{
            border: "2px solid var(--pixel-dark)",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${STEP_PROGRESS[step]}%`,
              backgroundColor: "var(--neon-yellow)",
              boxShadow: "0 0 8px var(--neon-yellow)",
            }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex justify-between text-[10px] font-bold">
          <StepIndicator
            label="UPLOAD"
            icon="camera"
            active={step === "uploading"}
            done={isStepDone(step, "uploading")}
          />
          <StepIndicator
            label="OCR"
            icon="search"
            active={step === "ocr"}
            done={isStepDone(step, "ocr")}
          />
          <StepIndicator
            label="AI"
            icon="robot"
            active={step === "analyzing"}
            done={isStepDone(step, "analyzing")}
          />
          <StepIndicator
            label="DONE"
            icon="sparkle"
            active={false}
            done={step === "done"}
          />
        </div>

        {/* Cancel button */}
        <button
          className="w-full text-[10px] py-1 font-bold"
          style={{ color: "var(--neon-pink)" }}
          onClick={onCancel}
        >
          [ CANCEL ]
        </button>
      </div>
    </GameFrame>
  );
}

/** Step indicator dot used in the progress bar area */
function StepIndicator({
  label,
  icon,
  active,
  done,
}: {
  label: string;
  icon: "camera" | "search" | "robot" | "sparkle";
  active: boolean;
  done: boolean;
}) {
  const color = done
    ? "var(--neon-green)"
    : active
      ? "var(--neon-yellow)"
      : "var(--neon-blue)";

  return (
    <div className="flex flex-col items-center gap-1" style={{ color }}>
      <PixelIcon
        name={icon}
        size={1.5}
        style={{ opacity: done || active ? 1 : 0.4 }}
      />
      <span
        style={{
          color,
          opacity: done || active ? 1 : 0.4,
        }}
      >
        {label}
      </span>
    </div>
  );
}
