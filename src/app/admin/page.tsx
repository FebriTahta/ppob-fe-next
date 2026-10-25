"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock, Coins, ReceiptText, TrendingUp, Users, Wallet } from "lucide-react";
import Link from "next/link";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { StatCard } from "@/components/admin/dashboard/stat-card";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api/client";
import { formatDateTime, formatNumber, formatRupiah } from "@/lib/format";
import type { Order } from "@/lib/types";

type Dashboard = {
  stats: {
    revenue_today: number; profit_today: number; orders_today: number; revenue_month: number; profit_month: number;
    orders_month: number; pending_orders: number; processing_orders: number; total_users: number;
  };
  series: { date: string; revenue: number; profit: number; orders: number }[];
  top_products: { name: string; qty: number; revenue: number }[];
  recent_orders: Order[];
};

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ["admin", "dashboard"], queryFn: () => api.get<Dashboard>("/admin/dashboard"), refetchInterval: 30_000 });
  if (isLoading || !data) return <Skeleton className="h-[70vh] rounded-2xl" />;
  const s = data.stats;

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Ringkasan performa toko hari ini & bulan ini." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Pendapatan hari ini" value={formatRupiah(s.revenue_today)} hint={`${s.orders_today} pesanan`} icon={<Wallet className="size-4" />} />
        <StatCard label="Profit hari ini" value={formatRupiah(s.profit_today)} icon={<TrendingUp className="size-4" />} accent="from-emerald-500 to-teal-400" />
        <StatCard label="Pendapatan bulan ini" value={formatRupiah(s.revenue_month)} hint={`Profit ${formatRupiah(s.profit_month)}`} icon={<Coins className="size-4" />} accent="from-amber-500 to-orange-400" />
        <StatCard label="Perlu tindakan" value={formatNumber(s.processing_orders)} hint={`${s.pending_orders} menunggu bayar · ${s.total_users} pengguna`} icon={<Clock className="size-4" />} accent="from-pink-500 to-rose-400" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="glass rounded-2xl p-5">
          <h2 className="mb-4 font-semibold">Pendapatan & profit 14 hari</h2>
          <RevenueChart data={data.series} />
        </section>
        <section className="glass rounded-2xl p-5">
          <h2 className="mb-4 font-semibold">Produk terlaris (30 hari)</h2>
          {data.top_products.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada penjualan.</p>
          ) : (
            <ol className="space-y-3">
              {data.top_products.map((p, i) => (
                <li key={p.name} className="flex items-center gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/15 text-xs font-bold text-primary">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.qty} terjual</p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{formatRupiah(p.revenue)}</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
      <section className="glass rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Pesanan terbaru</h2>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">Semua pesanan</Link>
        </div>
        <ul className="divide-y divide-border/60">
          {data.recent_orders.map((o) => (
            <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="flex min-w-0 items-center gap-3">
                <ReceiptText className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold">{o.invoice}</p>
                  <p className="truncate text-xs text-muted-foreground">{formatDateTime(o.created_at)} · {o.items.map((i) => i.product_name).join(", ")}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden text-sm font-semibold sm:inline">{formatRupiah(o.total)}</span>
                <StatusBadge status={o.status} />
              </div>
            </li>
          ))}
          {data.recent_orders.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground"><Users className="mx-auto mb-2" />Belum ada pesanan.</li>}
        </ul>
      </section>
    </div>
  );
}
