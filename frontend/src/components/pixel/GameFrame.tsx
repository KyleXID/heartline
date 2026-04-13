import { cn } from "@/lib/utils";

interface GameFrameProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  variant?: "default" | "select" | "info" | "danger";
  onClick?: () => void;
}

const VARIANT_STYLES = {
  default: {
    outer: "#2d1b69",
    inner: "#9b59b6",
    bg: "#1a1a3e",
    title: "#ffd93d",
    glow: "rgba(155, 89, 182, 0.3)",
  },
  select: {
    outer: "#ffd93d",
    inner: "#ff9f43",
    bg: "#1a1a3e",
    title: "#ffd93d",
    glow: "rgba(255, 217, 61, 0.3)",
  },
  info: {
    outer: "#87ceeb",
    inner: "#5dade2",
    bg: "#0d1b3e",
    title: "#87ceeb",
    glow: "rgba(135, 206, 235, 0.3)",
  },
  danger: {
    outer: "#ff4757",
    inner: "#ff6b9d",
    bg: "#2d0a1e",
    title: "#ff6b9d",
    glow: "rgba(255, 71, 87, 0.3)",
  },
};

export function GameFrame({
  children,
  title,
  className,
  variant = "default",
  onClick,
}: GameFrameProps) {
  const style = VARIANT_STYLES[variant];

  return (
    <div
      className={cn("relative", className)}
      onClick={onClick}
      style={{
        border: `4px solid ${style.outer}`,
        boxShadow: `
          inset 0 0 0 2px ${style.inner},
          inset 0 0 0 4px ${style.bg},
          0 0 15px ${style.glow},
          4px 4px 0 0 rgba(0,0,0,0.5)
        `,
        backgroundColor: style.bg,
        color: "#e0e0e0",
        imageRendering: "pixelated",
      }}
    >
      {title && (
        <div
          className="absolute -top-3.5 left-3 px-2 text-xs font-bold"
          style={{
            backgroundColor: style.bg,
            color: style.title,
            border: `2px solid ${style.outer}`,
            letterSpacing: "0.1em",
          }}
        >
          {title}
        </div>
      )}
      <div className="p-4 pt-3">{children}</div>

      {/* 코너 장식 */}
      <div className="absolute -left-1 -top-1 h-2 w-2" style={{ backgroundColor: style.inner }} />
      <div className="absolute -right-1 -top-1 h-2 w-2" style={{ backgroundColor: style.inner }} />
      <div className="absolute -bottom-1 -left-1 h-2 w-2" style={{ backgroundColor: style.inner }} />
      <div className="absolute -bottom-1 -right-1 h-2 w-2" style={{ backgroundColor: style.inner }} />
    </div>
  );
}
