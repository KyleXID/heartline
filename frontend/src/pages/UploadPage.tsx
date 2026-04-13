import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ImageDropzone } from "@/components/upload/ImageDropzone";

export default function UploadPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  async function handleAnalyze() {
    if (files.length === 0) return;
    setUploading(true);
    // TODO: 실제 업로드 API 연동 (HL-10 API 사용)
    // 현재는 UI만 구현
    setTimeout(() => {
      setUploading(false);
      navigate("/");
    }, 1500);
  }

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-6 pt-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">대화 업로드</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          카카오톡 대화 스크린샷을 순서대로 업로드하세요
        </p>
      </div>

      <div className="flex-1">
        <ImageDropzone
          files={files}
          onFilesChange={setFiles}
          disabled={uploading}
        />
      </div>

      <div className="mt-6 space-y-3">
        <Button
          className="w-full"
          size="lg"
          onClick={handleAnalyze}
          disabled={files.length === 0 || uploading}
        >
          {uploading
            ? "분석 요청 중..."
            : `분석하기 (${files.length}장)`}
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          size="lg"
          onClick={() => navigate(-1)}
          disabled={uploading}
        >
          돌아가기
        </Button>
      </div>
    </div>
  );
}
