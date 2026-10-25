import { Clock, Flame, PackageCheck } from "lucide-react";
import { formatRupiah, discountPercent } from "@/lib/format";
import type { PublicProduct } from "@/lib/types";
import { cn } from "@/lib/utils";
import { RankIcon } from "@/components/shared/rank-icon";

type Props = { product: PublicProduct; selected: boolean; onSelect: () => void; unique?: boolean };

/** Selectable product tile (nominal / item). Point Blank character listings also show the character's full description. */
export function ProductOption({ product: p, selected, onSelect, unique }: Props) {
  const soldOut = p.stock !== null && p.stock <= 0;
  const crossed = Math.max(p.regular_price, p.strike_price);
  const pct = discountPercent(p.price, crossed);

  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "relative flex min-h-24 flex-col items-start gap-1 overflow-hidden rounded-xl border bg-card/50 p-3 text-left transition-all",
        "hover:border-primary/60 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50",
        selected && "border-transparent glow ring-2 ring-primary bg-primary/10",
      )}
    >
      {unique ? (
        // Point Blank characters: the discount % is the only badge.
        pct > 0 && (
          <span className="absolute top-0 right-0 rounded-bl-lg bg-gradient-to-r from-orange-500 to-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
            -{pct}%
          </span>
        )
      ) : (
        (p.flash_sale || p.badge) && (
          <span
            className={cn(
              "absolute top-0 right-0 flex items-center gap-1 rounded-bl-lg px-2 py-0.5 text-[10px] font-bold text-white",
              p.flash_sale ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-brand-gradient",
            )}
          >
            {p.flash_sale && <Flame className="size-3 fill-current" />}
            {p.flash_sale ? "Flash" : p.badge}
          </span>
        )
      )}
      {unique && p.rank ? (
        // Point Blank characters are represented by their rank: icon + rank name instead of a product name.
        <span className="flex items-center gap-2 pr-10">
          <RankIcon rank={p.rank} className="size-9" />
          <span className="text-sm font-semibold leading-tight">{p.rank.name}</span>
        </span>
      ) : (
        <span className="pr-10 text-sm font-semibold leading-tight">{p.name}</span>
      )}
      {unique && p.description && (
        <p className="text-xs leading-relaxed whitespace-pre-line text-muted-foreground">{p.description}</p>
      )}
      <div className="mt-auto">
        {pct > 0 && (
          <span className="text-[11px] text-muted-foreground line-through">{formatRupiah(crossed)}</span>
        )}
        <div className="font-heading text-base font-bold text-primary">{formatRupiah(p.price)}</div>
      </div>
      <div className="flex flex-wrap gap-x-2 text-[10px] text-muted-foreground">
        {p.is_preorder && (
          <span className="flex items-center gap-1 text-amber-500">
            <Clock className="size-3" /> Pre-Order
          </span>
        )}
        {p.stock !== null && (
          <span className="flex items-center gap-1">
            <PackageCheck className="size-3" /> {soldOut ? "Habis" : `Stok ${p.stock}`}
          </span>
        )}
      </div>
    </button>
  );
}
