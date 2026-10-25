"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = { value: number; min?: number; max: number; onChange: (v: number) => void; className?: string; size?: "sm" | "md" };

export function QuantityStepper({ value, min = 1, max, onChange, className, size = "md" }: Props) {
  const clamp = (v: number) => Math.max(min, Math.min(max, Number.isFinite(v) ? v : min));
  const btn = size === "sm" ? "icon-sm" : "icon";
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-xl border bg-background/50 p-1", className)}>
      <Button type="button" variant="ghost" size={btn} onClick={() => onChange(clamp(value - 1))} disabled={value <= min} aria-label="Kurangi">
        <Minus />
      </Button>
      <input
        value={value}
        onChange={(e) => onChange(clamp(parseInt(e.target.value.replace(/\D/g, "") || "0", 10)))}
        inputMode="numeric"
        aria-label="Jumlah"
        className={cn("w-10 bg-transparent text-center font-semibold tabular-nums outline-none", size === "sm" && "w-8 text-sm")}
      />
      <Button type="button" variant="ghost" size={btn} onClick={() => onChange(clamp(value + 1))} disabled={value >= max} aria-label="Tambah">
        <Plus />
      </Button>
    </div>
  );
}
