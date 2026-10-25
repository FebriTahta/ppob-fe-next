import { GameArt } from "@/components/shared/game-art";
import { cn } from "@/lib/utils";

export function ActiveDot({ active }: { active: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", active ? "text-emerald-500" : "text-muted-foreground")}>
      <span className={cn("size-2 rounded-full", active ? "bg-emerald-500" : "bg-muted-foreground/40")} />
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}

export function Thumb({ name, src, wide }: { name: string; src?: string; wide?: boolean }) {
  return (
    <div className={cn("shrink-0 overflow-hidden rounded-lg", wide ? "h-10 w-20" : "size-10")}>
      <GameArt name={name} src={src} textClassName="text-xs" />
    </div>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex w-fit rounded-full bg-muted px-2 py-0.5 text-xs font-medium", className)}>{children}</span>;
}
