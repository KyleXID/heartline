import { cn } from "@/lib/utils";

interface PixelBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}

export function PixelBorder({
  children,
  className,
  color = "var(--primary)",
  style,
}: PixelBorderProps) {
  return (
    <div
      className={cn("relative p-4", className)}
      style={{
        border: `3px solid ${color}`,
        boxShadow: `
          3px 3px 0 0 ${color},
          -1px -1px 0 0 ${color},
          inset 2px 2px 0 0 rgba(255,255,255,0.1)
        `,
        imageRendering: "pixelated",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
