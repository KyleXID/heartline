import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PixelCharacter } from "@/components/pixel/PixelCharacter";
import { GameFrame } from "@/components/pixel/GameFrame";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <PixelCharacter type="sad" size={7} />
      <GameFrame variant="danger" className="mt-6 text-center">
        <p className="text-2xl font-bold" style={{ color: "var(--neon-pink)" }}>404</p>
        <p className="text-xs mt-1" style={{ color: "var(--neon-blue)" }}>PAGE NOT FOUND</p>
      </GameFrame>
      <Button className="mt-6 pixel-border font-bold" style={{ backgroundColor: "var(--neon-pink)", color: "white" }} onClick={() => navigate("/")}>
        {">> GO HOME <<"}
      </Button>
    </div>
  );
}
