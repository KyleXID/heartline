import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { SuggestedReply } from "@/services/analysis";

const TONE_EMOJI: Record<string, string> = {
  "가벼운": "😊",
  "진지한": "🤔",
  "재치있는": "😏",
};

export function ReplyCard({ reply }: { reply: SuggestedReply }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(reply.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2">
        <span>{TONE_EMOJI[reply.tone] ?? "💬"}</span>
        <span className="text-sm font-medium">{reply.tone}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed">{reply.message}</p>
      <p className="mt-2 text-xs text-muted-foreground">{reply.explanation}</p>
      <Button
        variant="outline"
        size="sm"
        className="mt-3 w-full"
        onClick={handleCopy}
      >
        {copied ? "복사됨!" : "복사하기"}
      </Button>
    </div>
  );
}
