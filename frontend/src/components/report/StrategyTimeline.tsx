import { cn } from "@/lib/utils";
import { PixelIcon } from "@/components/pixel/PixelIcon";

interface TimelineStep {
  day: string;
  title: string;
  description: string;
  status: "done" | "current" | "upcoming";
}

interface StrategyTimelineProps {
  interestScore: number;
  relationshipGoal?: string;
  className?: string;
}

function getStrategySteps(score: number, _goal?: string): TimelineStep[] {
  if (score >= 70) {
    return [
      { day: "D-0", title: "관심 확인 완료", description: "상대방의 관심도가 높습니다", status: "done" },
      { day: "D+1", title: "자연스러운 약속 잡기", description: "가벼운 만남을 제안해보세요", status: "current" },
      { day: "D+3", title: "감정 표현 시작", description: "호감을 간접적으로 전달하세요", status: "upcoming" },
      { day: "D+7", title: "고백 타이밍", description: "분위기가 무르익으면 진심을 전하세요", status: "upcoming" },
    ];
  }
  if (score >= 40) {
    return [
      { day: "D-0", title: "현재 상태 파악", description: "관심은 있지만 확신은 없는 단계", status: "done" },
      { day: "D+1", title: "대화 빈도 높이기", description: "자연스럽게 연락 횟수를 늘려보세요", status: "current" },
      { day: "D+5", title: "공통 관심사 발굴", description: "함께 즐길 수 있는 활동을 찾으세요", status: "upcoming" },
      { day: "D+10", title: "만남 제안", description: "부담 없는 만남을 제안하세요", status: "upcoming" },
      { day: "D+14", title: "관계 재평가", description: "상대방의 반응을 종합적으로 판단하세요", status: "upcoming" },
    ];
  }
  return [
    { day: "D-0", title: "냉정한 현실 파악", description: "상대방의 관심이 낮은 상태입니다", status: "done" },
    { day: "D+1", title: "거리두기", description: "무리한 연락은 역효과입니다", status: "current" },
    { day: "D+3", title: "자기 매력 업그레이드", description: "자신의 매력을 키우는 시간을 가지세요", status: "upcoming" },
    { day: "D+7", title: "가벼운 리마인드", description: "자연스럽게 존재감을 어필하세요", status: "upcoming" },
    { day: "D+14", title: "최종 판단", description: "진전이 없다면 새로운 인연을 찾아보세요", status: "upcoming" },
  ];
}

const STATUS_COLORS = {
  done: { bg: "var(--neon-green)", text: "#ffffff" },
  current: { bg: "var(--neon-yellow)", text: "var(--pixel-dark)" },
  upcoming: { bg: "var(--neon-purple)", text: "#ffffff" },
};

const STATUS_ICON = {
  done: "shield" as const,
  current: "lightning" as const,
  upcoming: "star" as const,
};

export function StrategyTimeline({ interestScore, relationshipGoal, className }: StrategyTimelineProps) {
  const steps = getStrategySteps(interestScore, relationshipGoal);

  return (
    <div className={cn("relative", className)}>
      {steps.map((step, i) => {
        const colors = STATUS_COLORS[step.status];
        return (
          <div key={i} className="flex gap-3 pb-5 last:pb-0">
            <div className="flex flex-col items-center">
              <div
                className="flex h-8 w-8 items-center justify-center"
                style={{
                  backgroundColor: colors.bg,
                  border: "2px solid var(--pixel-dark)",
                  boxShadow: "2px 2px 0 0 rgba(0,0,0,0.3)",
                }}
              >
                <PixelIcon name={STATUS_ICON[step.status]} size={1} />
              </div>
              {i < steps.length - 1 && (
                <div className="mt-1 h-full w-0.5" style={{ backgroundColor: "var(--neon-purple)" }} />
              )}
            </div>

            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold" style={{ color: "var(--neon-yellow)" }}>{step.day}</span>
                <span className="text-sm font-bold" style={{ color: "#e0e0e0" }}>{step.title}</span>
              </div>
              <p className="mt-0.5 text-xs" style={{ color: "var(--neon-blue)" }}>{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
