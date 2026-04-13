import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  label?: string;
  className?: string;
}

export function ScoreBadge({ score, label, className }: ScoreBadgeProps) {
  const color =
    score >= 70
      ? "bg-heart text-white"
      : score >= 40
        ? "bg-warning text-warning-foreground"
        : "bg-muted text-muted-foreground";

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
          color,
        )}
      >
        {score}
      </span>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}
