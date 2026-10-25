import { Check, Zap } from "lucide-react";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { discountPercent, formatRupiah } from "@/lib/format";
import type { PublicProduct } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = { products: PublicProduct[]; selectedId: number | null; onSelect: (p: PublicProduct) => void };

/** Flash-sale products of this category, pulled above the purchase steps so they are seen first. */
export function FlashDeals({ products, selectedId, onSelect }: Props) {
  const deals = products.filter((p) => p.flash_sale && p.price < Math.max(p.regular_price, p.strike_price));
  if (deals.length === 0) return null;
  const endsAt = deals.map((p) => p.flash_sale!.ends_at).sort()[0];

  return (
    <section className="glass overflow-hidden rounded-2xl" aria-labelledby="flash-deals-title">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 px-4 py-3 text-white sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-white/20">
            <Zap className="size-4 fill-current" />
          </span>
          <div>
            <h2 id="flash-deals-title" className="font-extrabold tracking-wide italic">FLASH SALE</h2>
            <p className="text-xs text-white/85">{deals.length} produk sedang diskon</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-white/90">
          <span className="hidden sm:inline">Berakhir dalam</span>
          <CountdownTimer endsAt={endsAt} labeled />
        </div>
      </header>
      <div className="grid gap-2.5 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
        {deals.map((p) => (
          <Deal key={p.id} product={p} selected={selectedId === p.id} onSelect={() => onSelect(p)} />
        ))}
      </div>
    </section>
  );
}

function Deal({ product: p, selected, onSelect }: { product: PublicProduct; selected: boolean; onSelect: () => void }) {
  const fs = p.flash_sale!;
  const regular = Math.max(p.regular_price, p.strike_price);
  const off = discountPercent(p.price, regular);
  const soldOut = (fs.quota > 0 && fs.remaining <= 0) || (p.stock !== null && p.stock <= 0);
  const sold = fs.quota > 0 ? Math.min(100, Math.round((fs.sold / fs.quota) * 100)) : 0;

  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "relative flex flex-col gap-2 overflow-hidden rounded-xl border bg-card p-3 text-left transition-all",
        "hover:border-orange-500/60 hover:bg-orange-500/5 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale",
        selected && "border-transparent bg-orange-500/10 ring-2 ring-orange-500",
      )}
    >
      <span className="absolute top-0 right-0 rounded-bl-lg bg-orange-500 px-2 py-0.5 text-xs font-extrabold text-white">-{off}%</span>
      <span className="pr-12 text-sm leading-tight font-semibold">{p.name}</span>
      <div>
        <p className="font-heading text-lg leading-tight font-bold text-orange-500 tabular-nums">{formatRupiah(p.price)}</p>
        <p className="flex flex-wrap items-center gap-x-1.5 text-[11px]">
          <span className="text-red-500/80 italic line-through">{formatRupiah(regular)}</span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400">Hemat {formatRupiah(regular - p.price)}</span>
        </p>
      </div>
      <div className="mt-auto space-y-1">
        {fs.quota > 0 && (
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-orange-500" style={{ width: `${sold}%` }} />
          </div>
        )}
        <p className="flex justify-between text-[10px] text-muted-foreground">
          <span>{soldOut ? "Kuota habis" : fs.quota > 0 ? `Sisa ${fs.remaining}` : "Tanpa batas kuota"}</span>
          {selected && (
            <span className="flex items-center gap-0.5 font-semibold text-orange-500">
              <Check className="size-3" /> Dipilih
            </span>
          )}
        </p>
      </div>
    </button>
  );
}
