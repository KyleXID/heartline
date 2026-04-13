import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  sender: "me" | "other" | "coach";
  name?: string;
  children: React.ReactNode;
  className?: string;
}

const SENDER_STYLES = {
  me: {
    align: "items-end",
    bubble: "bg-[var(--neon-yellow)] text-[var(--pixel-dark)]",
    border: "border-[var(--pixel-dark)]",
    name: "text-right",
  },
  other: {
    align: "items-start",
    bubble: "bg-white text-[var(--pixel-dark)]",
    border: "border-[var(--pixel-dark)]",
    name: "text-left",
  },
  coach: {
    align: "items-start",
    bubble: "bg-[var(--pixel-dark)] text-[var(--neon-blue)]",
    border: "border-[var(--neon-purple)]",
    name: "text-left",
  },
};

export function ChatBubble({ sender, name, children, className }: ChatBubbleProps) {
  const style = SENDER_STYLES[sender];

  return (
    <div className={cn("flex flex-col gap-1", style.align, className)}>
      {name && (
        <span className={cn("text-[10px] text-muted-foreground px-1", style.name)}>
          {name}
        </span>
      )}
      <div
        className={cn(
          "max-w-[80%] border-2 px-3 py-2 text-sm",
          style.bubble,
          style.border,
        )}
        style={{
          boxShadow: "2px 2px 0 0 rgba(0,0,0,0.2)",
          imageRendering: "pixelated",
        }}
      >
        {children}
      </div>
    </div>
  );
}
