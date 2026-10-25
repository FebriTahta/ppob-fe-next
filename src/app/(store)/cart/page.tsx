import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = { title: "Keranjang" };

export default function CartPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold sm:text-3xl">Keranjang</h1>
      <CartView />
    </div>
  );
}
