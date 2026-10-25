"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { OrderDetailSheet } from "@/components/admin/orders/order-detail-sheet";
import { PageHeader } from "@/components/admin/page-header";
import { SimplePagination } from "@/components/shared/simple-pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { api } from "@/lib/api/client";
import { ORDER_STATUS } from "@/lib/constants";
import { formatDateTime, formatRupiah } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTERS: (OrderStatus | "")[] = ["", "pending", "paid", "processing", "success", "partial", "failed", "expired"];

export default function AdminOrdersPage() {
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<number | null>(null);
  const search = useDebounce(q);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "/admin/orders", status, search, page],
    queryFn: () => api.paginated<Order>("/admin/orders", { status, q: search, page, per_page: 20 }),
    placeholderData: keepPreviousData,
    refetchInterval: 15_000,
  });

  return (
    <div>
      <PageHeader title="Pesanan" description="Pantau pembayaran & proses item manual (via login, karakter PB, TCG/pre-order)." />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Cari invoice, email, HP…" className="h-9 w-64" />
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((s) => (
            <button
              key={s || "all"}
              onClick={() => { setStatus(s); setPage(1); }}
              className={cn("rounded-full border px-3 py-1 text-xs font-medium", status === s ? "border-transparent bg-brand-gradient text-white" : "text-muted-foreground hover:text-foreground")}
            >
              {s ? ORDER_STATUS[s].label : "Semua"}
            </button>
          ))}
        </div>
      </div>
      <DataTable
        rows={data?.data}
        loading={isLoading}
        rowKey={(o) => o.id}
        onRowClick={(o) => setOpenId(o.id)}
        columns={[
          { header: "Invoice", cell: (o) => <div><p className="font-mono text-sm font-semibold">{o.invoice}</p><p className="text-xs text-muted-foreground">{formatDateTime(o.created_at)}</p></div> },
          { header: "Item", cell: (o) => <p className="max-w-xs truncate text-sm">{o.items.map((i) => `${i.category_name} ${i.product_name}${i.qty > 1 ? ` ×${i.qty}` : ""}`).join(", ")}</p> },
          { header: "Kontak", cell: (o) => <span className="text-xs">{o.phone || o.email}</span> },
          { header: "Total", cell: (o) => <span className="font-semibold tabular-nums">{formatRupiah(o.total)}</span> },
          { header: "Bayar", cell: (o) => <span className="text-xs">{o.payment_method}</span> },
          { header: "Status", cell: (o) => <StatusBadge status={o.status} /> },
        ]}
      />
      <div className="mt-4"><SimplePagination meta={data?.meta} onPage={setPage} /></div>
      <OrderDetailSheet id={openId} onClose={() => setOpenId(null)} />
    </div>
  );
}
