"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

type Props = { endsAt: string; className?: string; compact?: boolean; onDone?: React.ReactNode };

/** Segmented countdown (HH:MM:SS, with days when needed). */
export function CountdownTimer({ endsAt, className, compact, onDone }: Props) {
  const c = useCountdown(endsAt);
  if (c?.done && onDone) return <>{onDone}</>;
  const parts = c
    ? [...(c.days > 0 ? [{ v: c.days, l: "Hari" }] : []), { v: c.hours, l: "Jam" }, { v: c.minutes, l: "Mnt" }, { v: c.seconds, l: "Dtk" }]
    : [{ v: 0, l: "Jam" }, { v: 0, l: "Mnt" }, { v: 0, l: "Dtk" }];

  if (compact) {
    return <span className={cn("font-mono tabular-nums", className)}>{c ? parts.map((p) => pad(p.v)).join(":") : "--:--:--"}</span>;
  }
  return (
    <div className={cn("flex items-center gap-1", className)} role="timer" aria-live="off">
      {parts.map((p, i) => (
        <div key={p.l} className="flex items-center gap-1">
          <div className="grid min-w-9 place-items-center rounded-md bg-foreground px-1.5 py-1 font-mono text-sm font-bold text-background tabular-nums">
            {c ? pad(p.v) : "--"}
          </div>
          {i < parts.length - 1 && <span className="font-bold text-foreground/60">:</span>}
        </div>
      ))}
    </div>
  );
}
