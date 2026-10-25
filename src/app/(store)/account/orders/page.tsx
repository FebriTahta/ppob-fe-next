import type { Metadata } from "next";
import { OrderHistory } from "@/components/account/order-history";

export const metadata: Metadata = { title: "Riwayat Transaksi", robots: { index: false } };

export default function OrdersPage() {
  return <OrderHistory />;
}
