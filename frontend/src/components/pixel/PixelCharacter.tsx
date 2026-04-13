import { cn } from "@/lib/utils";

/**
 * 16x20 귀여운 도트 캐릭터 — 싸이월드 미니미 스타일
 * 머리가 크고, 몸이 작은 2등신 비율
 */

const _ = "transparent";
const K = "#2d1b69"; // 아웃라인
const S = "#ffe4c4"; // 피부
const H = "#5c3317"; // 머리카락 (갈색)
const W = "#ffffff"; // 화이트
const E = "#1a1a2e"; // 눈동자
const P = "#ff6b9d"; // 핑크
const C = "#ffb3c6"; // 볼터치
const V = "#9b59b6"; // 보라 (옷)
const B = "#87ceeb"; // 하늘색
const T = "#5dade2"; // 눈물
const G = "#1a1a2e"; // 선글라스
const R = "#ff4757"; // 빨강
const Y = "#ffd93d"; // 노랑

type CharacterType = "happy" | "love" | "think" | "sad" | "cool" | "wink";

const CHARACTERS: Record<CharacterType, string[][]> = {
  happy: [
    [_, _, _, _, H, H, H, H, H, H, _, _, _, _, _, _],
    [_, _, _, H, H, H, H, H, H, H, H, _, _, _, _, _],
    [_, _, H, H, H, H, H, H, H, H, H, H, _, _, _, _],
    [_, _, H, H, S, S, S, S, S, S, H, H, _, _, _, _],
    [_, _, K, S, S, S, S, S, S, S, S, K, _, _, _, _],
    [_, _, K, S, E, W, S, S, E, W, S, K, _, _, _, _],
    [_, _, K, S, E, E, S, S, E, E, S, K, _, _, _, _],
    [_, _, K, S, S, S, S, S, S, S, S, K, _, _, _, _],
    [_, _, K, S, C, S, S, S, S, C, S, K, _, _, _, _],
    [_, _, K, S, S, S, P, P, S, S, S, K, _, _, _, _],
    [_, _, _, K, S, S, S, S, S, S, K, _, _, _, _, _],
    [_, _, _, _, K, K, K, K, K, K, _, _, _, _, _, _],
    [_, _, _, _, K, V, V, V, V, K, _, _, _, _, _, _],
    [_, _, _, K, V, V, V, V, V, V, K, _, _, _, _, _],
    [_, _, _, K, S, K, V, V, K, S, K, _, _, _, _, _],
    [_, _, _, _, _, K, V, V, K, _, _, _, _, _, _, _],
    [_, _, _, _, _, K, V, V, K, _, _, _, _, _, _, _],
    [_, _, _, _, K, K, _, _, K, K, _, _, _, _, _, _],
    [_, _, _, _, K, K, _, _, K, K, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ],
  love: [
    [_, _, _, _, H, H, H, H, H, H, _, _, _, _, _, _],
    [_, _, _, H, H, H, H, H, H, H, H, _, _, _, _, _],
    [_, _, H, H, H, H, H, H, H, H, H, H, _, _, _, _],
    [_, _, H, H, S, S, S, S, S, S, H, H, _, _, _, _],
    [_, _, K, S, S, S, S, S, S, S, S, K, _, _, _, _],
    [_, _, K, S, R, P, S, S, R, P, S, K, _, _, _, _],
    [_, _, K, S, P, R, S, S, P, R, S, K, _, _, _, _],
    [_, _, K, S, S, S, S, S, S, S, S, K, _, _, _, _],
    [_, _, K, S, C, S, S, S, S, C, S, K, _, _, _, _],
    [_, _, K, S, S, P, P, P, P, S, S, K, _, _, _, _],
    [_, _, _, K, S, S, S, S, S, S, K, _, _, _, _, _],
    [_, _, _, _, K, K, K, K, K, K, _, _, _, _, _, _],
    [_, _, _, _, K, P, P, P, P, K, _, _, _, _, _, _],
    [_, _, _, K, P, P, P, P, P, P, K, _, _, _, _, _],
    [_, _, _, K, S, K, P, P, K, S, K, _, _, _, _, _],
    [_, _, _, _, _, K, P, P, K, _, _, _, _, _, _, _],
    [_, _, _, _, _, K, P, P, K, _, _, _, _, _, _, _],
    [_, _, _, _, K, K, _, _, K, K, _, _, _, _, _, _],
    [_, _, _, _, K, K, _, _, K, K, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ],
  think: [
    [_, _, _, _, H, H, H, H, H, H, _, _, _, _, _, _],
    [_, _, _, H, H, H, H, H, H, H, H, _, _, _, _, _],
    [_, _, H, H, H, H, H, H, H, H, H, H, _, _, _, _],
    [_, _, H, H, S, S, S, S, S, S, H, H, _, _, _, _],
    [_, _, K, S, S, S, S, S, S, S, S, K, _, _, _, _],
    [_, _, K, S, S, E, S, S, S, S, S, K, _, _, _, _],
    [_, _, K, S, E, E, S, S, E, E, S, K, _, _, _, _],
    [_, _, K, S, S, S, S, S, S, S, S, K, _, _, _, _],
    [_, _, K, S, S, S, S, S, S, S, S, K, _, _, _, _],
    [_, _, K, S, S, S, K, K, S, S, S, K, _, _, _, _],
    [_, _, _, K, S, S, S, S, S, S, K, _, _, _, _, _],
    [_, _, _, _, K, K, K, K, K, K, _, _, W, W, _, _],
    [_, _, _, _, K, V, V, V, V, K, _, W, Y, W, _, _],
    [_, _, _, K, V, V, V, V, V, V, K, _, W, _, _, _],
    [_, _, _, K, S, K, V, V, K, S, K, _, _, _, _, _],
    [_, _, _, _, _, K, V, V, K, _, _, _, _, _, _, _],
    [_, _, _, _, _, K, V, V, K, _, _, _, _, _, _, _],
    [_, _, _, _, K, K, _, _, K, K, _, _, _, _, _, _],
    [_, _, _, _, K, K, _, _, K, K, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ],
  sad: [
    [_, _, _, _, H, H, H, H, H, H, _, _, _, _, _, _],
    [_, _, _, H, H, H, H, H, H, H, H, _, _, _, _, _],
    [_, _, H, H, H, H, H, H, H, H, H, H, _, _, _, _],
    [_, _, H, H, S, S, S, S, S, S, H, H, _, _, _, _],
    [_, _, K, S, S, S, S, S, S, S, S, K, _, _, _, _],
    [_, _, K, S, E, W, S, S, E, W, S, K, _, _, _, _],
    [_, _, K, S, E, E, S, S, E, E, S, K, _, _, _, _],
    [_, _, K, S, S, T, S, S, S, T, S, K, _, _, _, _],
    [_, _, K, S, S, T, S, S, S, T, S, K, _, _, _, _],
    [_, _, K, S, S, S, K, K, S, S, S, K, _, _, _, _],
    [_, _, _, K, S, S, S, S, S, S, K, _, _, _, _, _],
    [_, _, _, _, K, K, K, K, K, K, _, _, _, _, _, _],
    [_, _, _, _, K, B, B, B, B, K, _, _, _, _, _, _],
    [_, _, _, K, B, B, B, B, B, B, K, _, _, _, _, _],
    [_, _, _, K, S, K, B, B, K, S, K, _, _, _, _, _],
    [_, _, _, _, _, K, B, B, K, _, _, _, _, _, _, _],
    [_, _, _, _, _, K, B, B, K, _, _, _, _, _, _, _],
    [_, _, _, _, K, K, _, _, K, K, _, _, _, _, _, _],
    [_, _, _, _, K, K, _, _, K, K, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ],
  cool: [
    [_, _, _, _, H, H, H, H, H, H, _, _, _, _, _, _],
    [_, _, _, H, H, H, H, H, H, H, H, _, _, _, _, _],
    [_, _, H, H, H, H, H, H, H, H, H, H, _, _, _, _],
    [_, _, H, H, S, S, S, S, S, S, H, H, _, _, _, _],
    [_, _, K, S, S, S, S, S, S, S, S, K, _, _, _, _],
    [_, _, K, G, G, G, G, G, G, G, G, K, _, _, _, _],
    [_, _, K, G, W, G, K, G, W, G, G, K, _, _, _, _],
    [_, _, K, S, S, S, S, S, S, S, S, K, _, _, _, _],
    [_, _, K, S, S, S, S, S, S, S, S, K, _, _, _, _],
    [_, _, K, S, S, S, P, P, S, S, S, K, _, _, _, _],
    [_, _, _, K, S, S, S, S, S, S, K, _, _, _, _, _],
    [_, _, _, _, K, K, K, K, K, K, _, _, _, _, _, _],
    [_, _, _, _, K, K, K, K, K, K, _, _, _, _, _, _],
    [_, _, _, K, K, K, K, K, K, K, K, _, _, _, _, _],
    [_, _, _, K, S, K, K, K, K, S, K, _, _, _, _, _],
    [_, _, _, _, _, K, K, K, K, _, _, _, _, _, _, _],
    [_, _, _, _, _, K, K, K, K, _, _, _, _, _, _, _],
    [_, _, _, _, K, K, _, _, K, K, _, _, _, _, _, _],
    [_, _, _, _, K, K, _, _, K, K, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ],
  wink: [
    [_, _, _, _, H, H, H, H, H, H, _, _, _, _, _, _],
    [_, _, _, H, H, H, H, H, H, H, H, _, _, _, _, _],
    [_, _, H, H, H, H, H, H, H, H, H, H, _, _, _, _],
    [_, _, H, H, S, S, S, S, S, S, H, H, _, _, _, _],
    [_, _, K, S, S, S, S, S, S, S, S, K, _, _, _, _],
    [_, _, K, S, E, W, S, S, K, K, S, K, _, _, _, _],
    [_, _, K, S, E, E, S, S, S, S, S, K, _, _, _, _],
    [_, _, K, S, S, S, S, S, S, S, S, K, _, _, _, _],
    [_, _, K, S, C, S, S, S, S, C, S, K, _, _, _, _],
    [_, _, K, S, S, S, P, P, S, S, S, K, _, _, _, _],
    [_, _, _, K, S, S, S, S, S, S, K, _, _, _, _, _],
    [_, _, _, _, K, K, K, K, K, K, _, _, _, _, _, _],
    [_, _, _, _, K, Y, Y, Y, Y, K, _, _, _, _, _, _],
    [_, _, _, K, Y, Y, Y, Y, Y, Y, K, _, _, _, _, _],
    [_, _, _, K, S, K, Y, Y, K, S, K, _, _, _, _, _],
    [_, _, _, _, _, K, Y, Y, K, _, _, _, _, _, _, _],
    [_, _, _, _, _, K, Y, Y, K, _, _, _, _, _, _, _],
    [_, _, _, _, K, K, _, _, K, K, _, _, _, _, _, _],
    [_, _, _, _, K, K, _, _, K, K, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ],
};

interface PixelCharacterProps {
  type?: CharacterType;
  size?: number;
  className?: string;
  bounce?: boolean;
}

export function PixelCharacter({
  type = "happy",
  size = 4,
  className,
  bounce = false,
}: PixelCharacterProps) {
  const grid = CHARACTERS[type];

  return (
    <div
      className={cn("inline-block", bounce && "pixel-bounce", className)}
      style={{ imageRendering: "pixelated", lineHeight: 0 }}
    >
      {grid.map((row, y) => (
        <div key={y} style={{ display: "flex", height: size }}>
          {row.map((color, x) => (
            <div
              key={x}
              style={{
                width: size,
                height: size,
                backgroundColor: color,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export type { CharacterType };
