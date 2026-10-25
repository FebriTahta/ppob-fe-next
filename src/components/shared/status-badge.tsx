import { ITEM_STATUS, ORDER_STATUS, TONE_CLASS } from "@/lib/constants";
import type { ItemStatus, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = { status: OrderStatus | ItemStatus; kind?: "order" | "item"; className?: string };

export function StatusBadge({ status, kind = "order", className }: Props) {
  const meta = kind === "order" ? ORDER_STATUS[status as OrderStatus] : ITEM_STATUS[status as ItemStatus];
  const tone = meta?.tone ?? "neutral";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold", TONE_CLASS[tone], className)}>
      <span className={cn("size-1.5 rounded-full bg-current", (status === "processing" || status === "pending") && "animate-pulse")} />
      {meta?.label ?? status}
    </span>
  );
}
