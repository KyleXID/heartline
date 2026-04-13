import { cn } from "@/lib/utils";
import type { RedFlag } from "@/services/analysis";

const SEVERITY_STYLES = {
  high: "border-destructive/30 bg-destructive/5",
  medium: "border-warning/30 bg-warning/5",
  low: "border-muted bg-muted/30",
};

const SEVERITY_LABEL = {
  high: "🔴 위험",
  medium: "🟡 주의",
  low: "🟢 참고",
};

export function RedFlagCard({ flag }: { flag: RedFlag }) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        SEVERITY_STYLES[flag.severity],
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{flag.type}</span>
        <span className="text-xs">{SEVERITY_LABEL[flag.severity]}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{flag.description}</p>
    </div>
  );
}
