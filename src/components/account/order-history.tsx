"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ReceiptText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { SimplePagination } from "@/components/shared/simple-pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api/client";
import { formatDateTime, formatRupiah } from "@/lib/format";
import type { Order } from "@/lib/types";

export function OrderHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["my-orders", page],
    queryFn: () => api.paginated<Order>("/me/orders", { page, per_page: 10 }),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <Skeleton className="h-64 rounded-2xl" />;
  if (!data?.data.length) {
    return (
      <EmptyState
        icon={<ReceiptText />}
        title="Belum ada transaksi"
        description="Transaksi yang kamu lakukan saat login akan muncul di sini."
        action={
          <Button asChild>
            <Link href="/games">Mulai Belanja</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {data.data.map((o) => (
          <li key={o.id}>
            <Link href={`/invoice/${o.invoice}`} className="glass flex flex-col gap-2 rounded-2xl p-4 transition-all hover:glow sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold">{o.invoice}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {o.items.map((i) => `${i.category_name} ${i.product_name}${i.qty > 1 ? ` ×${i.qty}` : ""}`).join(", ")}
                </p>
                <p className="text-xs text-muted-foreground">{formatDateTime(o.created_at)}</p>
              </div>
              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <StatusBadge status={o.status} />
                <span className="font-heading font-bold">{formatRupiah(o.total)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <SimplePagination meta={data.meta} onPage={setPage} />
    </div>
  );
}
