"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageCircle, SearchX } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api/client";
import { ACTIVE_ORDER_STATUSES } from "@/lib/constants";
import { formatDateTime, whatsappLink } from "@/lib/format";
import type { ContactSettings, Order } from "@/lib/types";
import { OrderItemsCard } from "./order-items-card";
import { PaymentPanel } from "./payment-panel";
import { StatusTimeline } from "./status-timeline";

/** Live invoice: polls while the order is still moving through payment/fulfilment. */
export function InvoiceView({ invoice, contact }: { invoice: string; contact: ContactSettings }) {
  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["order", invoice],
    queryFn: () => api.get<Order>(`/orders/${invoice}`),
    refetchInterval: (q) => (q.state.data && ACTIVE_ORDER_STATUSES.includes(q.state.data.status) ? 5000 : false),
    retry: false,
  });

  if (isLoading) return <Skeleton className="h-96 rounded-2xl" />;
  if (isError || !order) {
    return (
      <EmptyState
        icon={<SearchX />}
        title="Pesanan tidak ditemukan"
        description={`Invoice ${invoice} tidak ditemukan. Periksa kembali nomor invoice kamu.`}
        action={
          <Button asChild variant="outline">
            <Link href="/track">Lacak Pesanan Lain</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <section className="glass space-y-5 rounded-2xl p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Nomor Invoice</p>
            <div className="flex items-center gap-1">
              <h1 className="font-mono text-xl font-bold">{order.invoice}</h1>
              <CopyButton value={order.invoice} label="Invoice disalin" />
            </div>
            <p className="text-xs text-muted-foreground">{formatDateTime(order.created_at)}</p>
          </div>
          <StatusBadge status={order.status} className="text-sm" />
        </div>
        <StatusTimeline status={order.status} />
      </section>

      {order.status === "pending" && <PaymentPanel order={order} />}
      <OrderItemsCard order={order} />

      {contact.whatsapp_number && (
        <section className="glass flex flex-col items-start justify-between gap-3 rounded-2xl p-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold">Butuh bantuan dengan pesanan ini?</p>
            <p className="text-sm text-muted-foreground">Tim kami siap membantu {contact.operational_hours && `(${contact.operational_hours})`}</p>
          </div>
          <Button asChild variant="outline">
            <a href={whatsappLink(contact.whatsapp_number, `Halo admin, saya butuh bantuan untuk pesanan ${order.invoice}`)} target="_blank" rel="noopener noreferrer">
              <MessageCircle /> Hubungi Admin
            </a>
          </Button>
        </section>
      )}
    </div>
  );
}
