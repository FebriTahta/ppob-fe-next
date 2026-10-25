"use client";

import { ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";
import type { PublicProduct } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  product: PublicProduct | null;
  qty: number;
  memberLabel?: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
  variant: "card" | "bar";
};

/** Selected product summary with CTAs — a sticky card on desktop, a bottom bar on mobile. */
export function PurchaseSummary({ product, qty, memberLabel, onAddToCart, onBuyNow, variant }: Props) {
  const total = product ? product.price * qty : 0;
  // flex-1/flex-[2] only share width in the bar's row; in the card's column they would set a 0 height basis.
  const row = variant === "bar";
  const actions = (
    <div className={cn("flex gap-2", !row && "flex-col gap-2.5")}>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className={cn("h-12 rounded-xl text-base font-semibold [&_svg:not([class*='size-'])]:size-5", row && "flex-1")}
        disabled={!product}
        onClick={onAddToCart}
      >
        <ShoppingCart /> <span className={cn(row && "sr-only sm:not-sr-only")}>Keranjang</span>
      </Button>
      <Button
        type="button"
        size="lg"
        className={cn("h-12 rounded-xl bg-brand-gradient text-base font-semibold text-white glow [&_svg:not([class*='size-'])]:size-5", row && "flex-[2]")}
        disabled={!product}
        onClick={onBuyNow}
      >
        <Zap className="fill-current" /> Beli Sekarang
      </Button>
    </div>
  );

  if (variant === "bar") {
    return (
      <div data-purchase-bar className="glass fixed inset-x-3 bottom-24 z-30 rounded-2xl p-3 shadow-2xl lg:hidden">
        <div className="mb-2 flex items-center justify-between gap-2 text-sm">
          <span className="truncate text-muted-foreground">{product ? `${product.name}${qty > 1 ? ` ×${qty}` : ""}` : "Pilih produk"}</span>
          <span className="font-heading font-bold">{formatRupiah(total)}</span>
        </div>
        {actions}
      </div>
    );
  }

  return (
    <div className="glass space-y-4 rounded-2xl p-5">
      <h2 className="font-semibold">Ringkasan</h2>
      {product ? (
        <dl className="space-y-2 text-sm">
          <Row label="Item" value={product.name} />
          <Row label="Harga satuan" value={formatRupiah(product.price)} />
          {qty > 1 && <Row label="Jumlah" value={`×${qty}`} />}
          {memberLabel && <Row label="Harga" value={<span className="text-primary">{memberLabel}</span>} />}
          <div className="flex items-center justify-between border-t pt-3">
            <dt className="text-muted-foreground">Total</dt>
            <dd className="font-heading text-xl font-bold tabular-nums">{formatRupiah(total)}</dd>
          </div>
        </dl>
      ) : (
        <p className="text-sm text-muted-foreground">Pilih nominal terlebih dahulu.</p>
      )}
      {actions}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
