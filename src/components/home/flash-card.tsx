import Link from "next/link";
import { Zap } from "lucide-react";
import { GameArt } from "@/components/shared/game-art";
import { formatRupiah } from "@/lib/format";
import type { CategoryType, FlashItem } from "@/lib/types";
import { cn } from "@/lib/utils";

// Same set the API fulfils automatically through the provider (service/checkout.go autoFulfilTypes).
const INSTANT: CategoryType[] = ["game_topup", "voucher", "ppob"];

/** Flash deal ticket: name, art + price, quota bar, and a footer with the saving and delivery badge. */
export function FlashCard({ item, decorative }: { item: FlashItem; decorative?: boolean }) {
  const soldOut = item.quota > 0 && item.sold >= item.quota;
  const pct = item.quota > 0 ? Math.min(100, Math.round((item.sold / item.quota) * 100)) : 0;
  const instant = item.category_type && INSTANT.includes(item.category_type);
  return (
    <Link
      href={`/game/${item.category_slug}?product=${item.product_id}`}
      // Copies that only exist to make the marquee loop stay out of the tab order and accessibility tree.
      tabIndex={decorative ? -1 : undefined}
      aria-hidden={decorative || undefined}
      className={cn(
        "group flex h-full w-72 flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 sm:w-80",
        soldOut && "opacity-60 grayscale",
      )}
    >
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <p className="line-clamp-1 font-semibold">{item.product_name}</p>
          <p className="truncate text-sm text-muted-foreground">{item.category_name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="size-16 shrink-0 overflow-hidden rounded-xl">
            <GameArt name={item.category_name} src={item.product_image || item.category_image} textClassName="text-lg" className="transition-transform duration-500 group-hover:scale-110" />
          </div>
          <div className="min-w-0">
            <p className="font-heading text-xl leading-tight font-bold text-orange-500 tabular-nums">{formatRupiah(item.price)}</p>
            <p className="text-sm text-red-500/80 italic line-through tabular-nums">{formatRupiah(item.regular_price)}</p>
          </div>
        </div>
        <div className="mt-auto space-y-1.5">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-orange-500 transition-[width]" style={{ width: `${item.quota > 0 ? pct : 100}%` }} />
          </div>
          <p className="text-right text-xs font-semibold text-muted-foreground">
            {soldOut ? "Stok habis" : item.quota > 0 ? `${item.sold} / ${item.quota} terjual` : "Tanpa batas kuota"}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 border-t bg-muted/50 px-4 py-2.5">
        <span className={cn("rounded-lg px-2.5 py-1.5 text-sm font-bold text-white tabular-nums", soldOut ? "bg-muted-foreground/60" : "bg-orange-500")}>
          - {formatRupiah(item.regular_price - item.price)}
        </span>
        {instant && (
          <span className="flex items-center gap-1.5 rounded-lg border bg-white px-2.5 py-1 text-emerald-800">
            <Zap className="size-4 fill-current" />
            <span className="flex flex-col leading-none">
              <span className="text-[9px] italic">Pengiriman</span>
              <span className="text-xs font-extrabold">INSTAN</span>
            </span>
          </span>
        )}
      </div>
    </Link>
  );
}
