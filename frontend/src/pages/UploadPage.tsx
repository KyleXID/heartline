export default function UploadPage() {
  return (
    <div className="flex min-h-dvh flex-col px-6 pt-12">
      <h1 className="text-2xl font-bold">대화 업로드</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        카카오톡 대화 스크린샷을 업로드하세요
      </p>
      <div className="mt-8 flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 p-12">
        <p className="text-sm text-muted-foreground">
          이미지를 드래그하거나 클릭하여 업로드
        </p>
      </div>
    </div>
  );
}
