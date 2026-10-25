import { Clock, Flame } from "lucide-react";
import { CustomerDataList } from "@/components/cart/customer-data-list";
import { GameArt } from "@/components/shared/game-art";
import { formatRupiah } from "@/lib/format";
import type { QuoteLine } from "@/lib/types";

export function CheckoutLines({ lines, labels }: { lines: QuoteLine[]; labels: Record<string, string> }) {
  return (
    <ul className="divide-y divide-border/60">
      {lines.map((l, i) => (
        <li key={i} className="flex gap-3 py-3 first:pt-0 last:pb-0">
          <div className="size-12 shrink-0 overflow-hidden rounded-lg">
            <GameArt name={l.category_name} src={l.image_url} textClassName="text-sm" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">{l.category_name}</p>
                <p className="text-sm font-semibold">
                  {l.name} {l.qty > 1 && <span className="text-muted-foreground">×{l.qty}</span>}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums">{formatRupiah(l.subtotal)}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {l.is_flash_sale && (
                <span className="inline-flex items-center gap-1 rounded bg-red-500/15 px-1.5 text-[10px] font-semibold text-red-500">
                  <Flame className="size-3" /> Flash Sale
                </span>
              )}
              {l.is_preorder && (
                <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-1.5 text-[10px] font-semibold text-amber-500">
                  <Clock className="size-3" /> Pre-Order
                </span>
              )}
            </div>
            <CustomerDataList data={l.customer_data} labels={labels} />
          </div>
        </li>
      ))}
    </ul>
  );
}
