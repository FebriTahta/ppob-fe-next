"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { GameArt } from "@/components/shared/game-art";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";
import type { CartItem } from "@/stores/cart-store";
import { CustomerDataList } from "./customer-data-list";

type Props = { item: CartItem; onQty: (q: number) => void; onRemove: () => void };

export function CartLine({ item, onQty, onRemove }: Props) {
  return (
    <li className="glass flex gap-3 rounded-2xl p-3 sm:p-4">
      <Link href={`/game/${item.categorySlug}`} className="size-16 shrink-0 overflow-hidden rounded-xl sm:size-20">
        <GameArt name={item.categoryName} src={item.image} textClassName="text-base" />
      </Link>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">{item.categoryName}</p>
            <p className="font-semibold leading-tight">{item.productName}</p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onRemove} aria-label="Hapus item" className="text-muted-foreground hover:text-destructive">
            <Trash2 />
          </Button>
        </div>
        <CustomerDataList data={item.customerData} labels={item.customerLabels} />
        <div className="flex items-center justify-between gap-2 pt-1">
          {item.maxQty > 1 ? <QuantityStepper size="sm" value={item.qty} max={item.maxQty} onChange={onQty} /> : <span className="text-xs text-muted-foreground">×{item.qty}</span>}
          <span className="font-heading font-bold">{formatRupiah(item.unitPrice * item.qty)}</span>
        </div>
      </div>
    </li>
  );
}
