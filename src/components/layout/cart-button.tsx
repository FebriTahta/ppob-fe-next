"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { selectCartCount, useCart } from "@/stores/cart-store";

export function CartButton() {
  const count = useCart(selectCartCount);
  const mounted = useMounted();
  return (
    <Button asChild variant="ghost" size="icon" className="relative hidden sm:inline-flex" aria-label="Keranjang">
      <Link href="/cart">
        <ShoppingCart />
        {mounted && count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 grid min-w-4 place-items-center rounded-full bg-brand-gradient px-1 text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </Link>
    </Button>
  );
}
