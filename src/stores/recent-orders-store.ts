"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Recent = { invoice: string; total: number; createdAt: string };

type State = {
  orders: Recent[];
  contact: { name: string; phone: string; email: string };
  push: (o: Recent) => void;
  setContact: (c: State["contact"]) => void;
};

/** Guest convenience: remembers recent invoices and last contact details on this device. */
export const useRecentOrders = create<State>()(
  persist(
    (set, get) => ({
      orders: [],
      contact: { name: "", phone: "", email: "" },
      push: (o) => set({ orders: [o, ...get().orders.filter((x) => x.invoice !== o.invoice)].slice(0, 10) }),
      setContact: (contact) => set({ contact }),
    }),
    { name: "ppob-recent" },
  ),
);
