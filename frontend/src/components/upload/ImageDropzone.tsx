import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { PixelIcon } from "@/components/pixel/PixelIcon";

interface ImageDropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function ImageDropzone({
  files,
  onFilesChange,
  maxFiles = 20,
  disabled = false,
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const valid = Array.from(newFiles).filter((f) => {
        if (!ACCEPTED_TYPES.includes(f.type)) return false;
        if (f.size > MAX_FILE_SIZE) return false;
        return true;
      });
      const combined = [...files, ...valid].slice(0, maxFiles);
      onFilesChange(combined);
    },
    [files, maxFiles, onFilesChange],
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) addFiles(e.dataTransfer.files);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }

  function removeFile(index: number) {
    onFilesChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <div className="text-center">
          <PixelIcon name="camera" size={4} className="mx-auto" />
          <p className="mt-3 text-sm font-medium">
            카카오톡 대화 스크린샷을 올려주세요
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            드래그하거나 클릭하여 업로드 (최대 {maxFiles}장)
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            JPG, PNG, WebP · 10MB 이하
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          disabled={disabled}
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} className="group relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`스크린샷 ${i + 1}`}
                className="aspect-[9/16] w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
              <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
