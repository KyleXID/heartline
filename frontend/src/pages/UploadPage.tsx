import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ImageDropzone } from "@/components/upload/ImageDropzone";
import { PixelCharacter } from "@/components/pixel/PixelCharacter";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { GameFrame } from "@/components/pixel/GameFrame";

export default function UploadPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  async function handleAnalyze() {
    if (files.length === 0) return;
    setUploading(true);
    setTimeout(() => { setUploading(false); navigate("/"); }, 1500);
  }

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-20 pt-8">
      <div className="flex items-center gap-3 mb-6">
        <PixelCharacter type="think" size={4} />
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--pixel-dark)" }}>UPLOAD</h1>
          <p className="text-xs text-muted-foreground">카톡 대화 스크린샷을 순서대로 올려줘!</p>
        </div>
      </div>

      <GameFrame variant="info" title="SCREENSHOTS" className="flex-1">
        <ImageDropzone files={files} onFilesChange={setFiles} disabled={uploading} />
      </GameFrame>

      <div className="mt-6 space-y-3">
        <Button
          className="w-full pixel-border pixel-shadow font-bold text-base"
          size="lg"
          style={{ backgroundColor: files.length > 0 ? "var(--neon-pink)" : "var(--pixel-dark)", color: files.length > 0 ? "white" : "var(--neon-blue)" }}
          onClick={handleAnalyze}
          disabled={files.length === 0 || uploading}
        >
          <PixelIcon name="robot" size={2} className="mr-2" />
          {uploading ? "ANALYZING..." : `>> ANALYZE (${files.length}) <<`}
        </Button>
        <button className="w-full text-xs py-2 font-bold" style={{ color: "var(--neon-purple)" }} onClick={() => navigate(-1)} disabled={uploading}>
          [ BACK ]
        </button>
      </div>
    </div>
  );
}
