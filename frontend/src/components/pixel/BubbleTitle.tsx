/**
 * 퍼즐보글보글 / 게임보이 스타일 둥글둥글 버블 타이틀
 * 각 글자가 통통하고 둥근 픽셀 버블 형태
 */

import { cn } from "@/lib/utils";

interface BubbleTitleProps {
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const COLORS = [
  { bg: "#ff6b9d", shadow: "#cc4477", highlight: "#ffadc4" }, // 핑크
  { bg: "#ffd93d", shadow: "#ccaa00", highlight: "#ffec8a" }, // 노랑
  { bg: "#87ceeb", shadow: "#5da4c4", highlight: "#b8e4f7" }, // 하늘
  { bg: "#9b59b6", shadow: "#7a3d96", highlight: "#c49ddb" }, // 보라
  { bg: "#6bcb77", shadow: "#4da35c", highlight: "#9ee0a5" }, // 초록
  { bg: "#ff9f43", shadow: "#cc7a2a", highlight: "#ffca8a" }, // 오렌지
  { bg: "#ff6b9d", shadow: "#cc4477", highlight: "#ffadc4" }, // 핑크
  { bg: "#ffd93d", shadow: "#ccaa00", highlight: "#ffec8a" }, // 노랑
  { bg: "#87ceeb", shadow: "#5da4c4", highlight: "#b8e4f7" }, // 하늘
];

const SIZES = {
  sm: { fontSize: 24, padding: "4px 8px", borderWidth: 3, shadowOffset: 3, radius: 10 },
  md: { fontSize: 36, padding: "6px 10px", borderWidth: 4, shadowOffset: 4, radius: 14 },
  lg: { fontSize: 48, padding: "8px 14px", borderWidth: 5, shadowOffset: 5, radius: 18 },
};

export function BubbleTitle({ text, className, size = "md" }: BubbleTitleProps) {
  const s = SIZES[size];
  const chars = text.split("");

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-1", className)}>
      {chars.map((char, i) => {
        if (char === " ") {
          return <div key={i} style={{ width: s.fontSize * 0.3 }} />;
        }

        const color = COLORS[i % COLORS.length];

        return (
          <div
            key={i}
            className="inline-flex select-none items-center justify-center font-bold"
            style={{
              fontSize: s.fontSize,
              padding: s.padding,
              backgroundColor: color.bg,
              color: "#ffffff",
              border: `${s.borderWidth}px solid ${color.shadow}`,
              borderRadius: s.radius,
              boxShadow: `
                ${s.shadowOffset}px ${s.shadowOffset}px 0 0 ${color.shadow},
                inset -${s.borderWidth}px -${s.borderWidth}px 0 0 ${color.shadow}88,
                inset ${s.borderWidth}px ${s.borderWidth}px 0 0 ${color.highlight}
              `,
              textShadow: `
                1px 1px 0 ${color.shadow},
                2px 2px 0 ${color.shadow}88
              `,
              transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (Math.random() * 3 + 1)}deg)`,
              lineHeight: 1,
              WebkitTextStroke: `1px ${color.shadow}`,
              animation: `bubbleBounce 2s ease-in-out ${i * 0.1}s infinite`,
            }}
          >
            {char}
          </div>
        );
      })}
    </div>
  );
}
