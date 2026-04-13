import { cn } from "@/lib/utils";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn("text-2xl font-bold tracking-tight", className)}>
      {children}
    </h1>
  );
}

export function H2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn("text-xl font-semibold tracking-tight", className)}>
      {children}
    </h2>
  );
}

export function H3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>
  );
}

export function Caption({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>{children}</p>
  );
}
