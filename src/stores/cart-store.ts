"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CategoryType } from "@/lib/types";

export type CartItem = {
  key: string;
  productId: number;
  productName: string;
  categoryName: string;
  categorySlug: string;
  categoryType: CategoryType;
  image: string;
  unitPrice: number; // snapshot for display, re-priced by the server at checkout
  qty: number;
  maxQty: number;
  isPreorder: boolean;
  customerData: Record<string, string>;
  customerLabels: Record<string, string>;
};

type AddResult = "added" | "updated" | "limit";

type CartState = {
  items: CartItem[];
  buyNow: CartItem | null;
  add: (item: Omit<CartItem, "key">) => AddResult;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setBuyNow: (item: Omit<CartItem, "key"> | null) => void;
};

export const cartKey = (productId: number, data: Record<string, string>) =>
  `${productId}:${Object.keys(data)
    .sort()
    .map((k) => `${k}=${data[k]}`)
    .join("&")}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      buyNow: null,
      add: (item) => {
        const key = cartKey(item.productId, item.customerData);
        const existing = get().items.find((i) => i.key === key);
        if (existing) {
          const qty = Math.min(existing.qty + item.qty, item.maxQty);
          if (qty === existing.qty) return "limit";
          set({ items: get().items.map((i) => (i.key === key ? { ...i, qty, unitPrice: item.unitPrice } : i)) });
          return "updated";
        }
        set({ items: [...get().items, { ...item, key }].slice(-20) });
        return "added";
      },
      setQty: (key, qty) =>
        set({ items: get().items.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(qty, i.maxQty)) } : i)) }),
      remove: (key) => set({ items: get().items.filter((i) => i.key !== key) }),
      clear: () => set({ items: [] }),
      setBuyNow: (item) => set({ buyNow: item ? { ...item, key: cartKey(item.productId, item.customerData) } : null }),
    }),
    { name: "ppob-cart", storage: createJSONStorage(() => localStorage), version: 1 },
  ),
);

export const selectCartCount = (s: CartState) => s.items.reduce((n, i) => n + i.qty, 0);
