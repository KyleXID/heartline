import { cn } from "@/lib/utils";

type CharacterType = "happy" | "love" | "think" | "sad" | "cool" | "heart";

interface PixelCharacterProps {
  type?: CharacterType;
  size?: number;
  className?: string;
  bounce?: boolean;
}

const CHARACTERS: Record<CharacterType, string[][]> = {
  happy: [
    ["", "", "P", "P", "P", "", ""],
    ["", "P", "S", "S", "S", "P", ""],
    ["P", "S", "E", "S", "E", "S", "P"],
    ["P", "S", "S", "S", "S", "S", "P"],
    ["P", "S", "M", "S", "M", "S", "P"],
    ["", "P", "S", "S", "S", "P", ""],
    ["", "", "P", "P", "P", "", ""],
    ["", "B", "B", "B", "B", "B", ""],
    ["B", "B", "H", "B", "H", "B", "B"],
    ["", "", "B", "B", "B", "", ""],
    ["", "", "L", "", "L", "", ""],
    ["", "L", "L", "", "L", "L", ""],
  ],
  love: [
    ["", "", "P", "P", "P", "", ""],
    ["", "P", "S", "S", "S", "P", ""],
    ["P", "S", "R", "S", "R", "S", "P"],
    ["P", "S", "S", "S", "S", "S", "P"],
    ["P", "C", "S", "S", "S", "C", "P"],
    ["", "P", "S", "U", "S", "P", ""],
    ["", "", "P", "P", "P", "", ""],
    ["", "B", "B", "B", "B", "B", ""],
    ["B", "B", "H", "B", "H", "B", "B"],
    ["", "", "B", "B", "B", "", ""],
    ["", "", "L", "", "L", "", ""],
    ["", "L", "L", "", "L", "L", ""],
  ],
  think: [
    ["", "", "P", "P", "P", "", ""],
    ["", "P", "S", "S", "S", "P", ""],
    ["P", "S", "E", "S", "S", "S", "P"],
    ["P", "S", "S", "S", "E", "S", "P"],
    ["P", "S", "S", "O", "S", "S", "P"],
    ["", "P", "S", "S", "S", "P", ""],
    ["", "", "P", "P", "P", "", ""],
    ["", "B", "B", "B", "B", "B", ""],
    ["B", "B", "H", "B", "H", "B", "B"],
    ["", "", "B", "B", "B", "", ""],
    ["", "", "L", "", "L", "", ""],
    ["", "L", "L", "", "L", "L", ""],
  ],
  sad: [
    ["", "", "P", "P", "P", "", ""],
    ["", "P", "S", "S", "S", "P", ""],
    ["P", "S", "E", "S", "E", "S", "P"],
    ["P", "S", "S", "S", "S", "S", "P"],
    ["P", "S", "S", "D", "S", "S", "P"],
    ["", "P", "T", "S", "T", "P", ""],
    ["", "", "P", "P", "P", "", ""],
    ["", "B", "B", "B", "B", "B", ""],
    ["B", "B", "H", "B", "H", "B", "B"],
    ["", "", "B", "B", "B", "", ""],
    ["", "", "L", "", "L", "", ""],
    ["", "L", "L", "", "L", "L", ""],
  ],
  cool: [
    ["", "", "P", "P", "P", "", ""],
    ["", "P", "S", "S", "S", "P", ""],
    ["P", "G", "G", "S", "G", "G", "P"],
    ["P", "S", "S", "S", "S", "S", "P"],
    ["P", "S", "S", "W", "S", "S", "P"],
    ["", "P", "S", "S", "S", "P", ""],
    ["", "", "P", "P", "P", "", ""],
    ["", "B", "B", "B", "B", "B", ""],
    ["B", "B", "H", "B", "H", "B", "B"],
    ["", "", "B", "B", "B", "", ""],
    ["", "", "L", "", "L", "", ""],
    ["", "L", "L", "", "L", "L", ""],
  ],
  heart: [
    ["", "R", "R", "", "R", "R", ""],
    ["R", "R", "R", "R", "R", "R", "R"],
    ["R", "R", "R", "R", "R", "R", "R"],
    ["R", "R", "R", "R", "R", "R", "R"],
    ["", "R", "R", "R", "R", "R", ""],
    ["", "", "R", "R", "R", "", ""],
    ["", "", "", "R", "", "", ""],
  ],
};

const COLOR_MAP: Record<string, string> = {
  P: "#2d1b69", // 아웃라인 (진보라)
  S: "#ffe4c4", // 피부
  E: "#2d1b69", // 눈
  M: "#ff6b9d", // 입 (웃는)
  U: "#ff6b9d", // 입 (사랑)
  D: "#2d1b69", // 입 (슬픈)
  O: "#2d1b69", // 입 (생각)
  W: "#2d1b69", // 입 (쿨)
  R: "#ff6b9d", // 빨간색 (볼/하트)
  C: "#ffb3c6", // 볼터치
  T: "#87ceeb", // 눈물
  G: "#1a1a2e", // 선글라스
  B: "#9b59b6", // 몸통 (보라)
  H: "#ffe4c4", // 손
  L: "#2d1b69", // 다리
};

export function PixelCharacter({
  type = "happy",
  size = 6,
  className,
  bounce = false,
}: PixelCharacterProps) {
  const grid = CHARACTERS[type];

  return (
    <div
      className={cn(
        "inline-block",
        bounce && "animate-bounce",
        className,
      )}
      style={{
        imageRendering: "pixelated",
      }}
    >
      {grid.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              style={{
                width: size,
                height: size,
                backgroundColor: cell ? COLOR_MAP[cell] : "transparent",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
