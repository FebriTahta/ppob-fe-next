"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { formatRupiah } from "@/lib/format";
import { useCart } from "@/stores/cart-store";
import { CartLine } from "./cart-line";

export function CartView() {
  const mounted = useMounted();
  const { items, setQty, remove, clear } = useCart();
  if (!mounted) return <Skeleton className="h-64 rounded-2xl" />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart />}
        title="Keranjang masih kosong"
        description="Tambahkan beberapa produk untuk checkout sekaligus dalam satu pembayaran."
        action={
          <Button asChild className="bg-brand-gradient text-white">
            <Link href="/games">Jelajahi Produk</Link>
          </Button>
        }
      />
    );
  }

  const total = items.reduce((n, i) => n + i.unitPrice * i.qty, 0);
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{items.length} item</p>
          <Button variant="ghost" size="sm" onClick={clear} className="text-muted-foreground">
            Kosongkan
          </Button>
        </div>
        <ul className="space-y-3">
          {items.map((it) => (
            <CartLine key={it.key} item={it} onQty={(q) => setQty(it.key, q)} onRemove={() => remove(it.key)} />
          ))}
        </ul>
      </div>
      <aside>
        <div className="glass sticky top-20 space-y-4 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Estimasi total</span>
            <span className="font-heading text-xl font-bold text-gradient">{formatRupiah(total)}</span>
          </div>
          <p className="text-xs text-muted-foreground">Harga final, diskon kupon & biaya pembayaran dihitung di halaman checkout.</p>
          <Button asChild size="lg" className="h-11 w-full bg-brand-gradient text-white glow">
            <Link href="/checkout">Checkout</Link>
          </Button>
        </div>
      </aside>
    </div>
  );
}
