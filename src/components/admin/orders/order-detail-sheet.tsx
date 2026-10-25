"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban, CheckCheck, ExternalLink, Undo2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api/client";
import { formatDateTime, formatRupiah } from "@/lib/format";
import type { Order } from "@/lib/types";
import { type AdminItem, ItemProcessor } from "./item-processor";

type AdminOrder = Omit<Order, "items"> & { items: AdminItem[] };

export function OrderDetailSheet({ id, onClose }: { id: number | null; onClose: () => void }) {
  const qc = useQueryClient();
  const { data: o, isLoading } = useQuery({
    queryKey: ["admin", "order", id],
    queryFn: () => api.get<AdminOrder>(`/admin/orders/${id}`),
    enabled: !!id,
    refetchInterval: (q) => (q.state.data && ["paid", "processing"].includes(q.state.data.status) ? 5000 : false),
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin", "order", id] });
    qc.invalidateQueries({ queryKey: ["admin", "/admin/orders"] });
  };
  const action = useMutation({
    mutationFn: (a: "mark-paid" | "cancel" | "refund") => api.message(`/admin/orders/${id}/${a}`),
    onSuccess: (m) => {
      toast.success(m);
      refresh();
    },
    onError: (e) => toast.error(e.message),
  });

  const cost = o?.items.reduce((n, i) => n + i.base_price * i.qty, 0) ?? 0;
  const profit = o ? o.total - o.fee - cost : 0;

  return (
    <Sheet open={!!id} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full gap-0 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="font-mono">{o?.invoice ?? "Memuat…"}</SheetTitle>
          <SheetDescription>{o && formatDateTime(o.created_at)}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-5rem)] px-4 pb-8">
          {isLoading || !o ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={o.status} />
                <Button asChild size="xs" variant="ghost">
                  <Link href={`/invoice/${o.invoice}`} target="_blank">
                    <ExternalLink /> Invoice publik
                  </Link>
                </Button>
              </div>
              <dl className="grid grid-cols-2 gap-3 rounded-xl border p-4 text-sm">
                <Info
                  label="Kontak"
                  value={
                    <>
                      {o.phone || "-"}
                      <br />
                      {o.email}
                    </>
                  }
                />
                <Info label="Pembayaran" value={`${o.payment_method} (${o.gateway_code})`} />
                <Info label="Total" value={formatRupiah(o.total)} />
                <Info label="Diskon / Biaya" value={`${formatRupiah(o.discount)} / ${formatRupiah(o.fee)}`} />
                <Info label="Dibayar" value={formatDateTime(o.paid_at)} />
                <Info label="Estimasi profit" value={<span className="text-emerald-500">{formatRupiah(profit)}</span>} />
                {o.coupon_code && <Info label="Kupon" value={o.coupon_code} />}
                {o.notes && <Info label="Catatan" value={o.notes} />}
              </dl>
              <div className="flex flex-wrap gap-2">
                {o.status === "pending" && (
                  <>
                    <Button size="sm" onClick={() => action.mutate("mark-paid")} disabled={action.isPending}>
                      <CheckCheck /> Tandai Lunas
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => action.mutate("cancel")} disabled={action.isPending}>
                      <Ban /> Batalkan
                    </Button>
                  </>
                )}
                {["failed", "partial"].includes(o.status) && (
                  <Button size="sm" variant="outline" onClick={() => action.mutate("refund")} disabled={action.isPending}>
                    <Undo2 /> Tandai Refund
                  </Button>
                )}
              </div>
              <h3 className="pt-2 font-semibold">Item ({o.items.length})</h3>
              {o.items.map((it) => (
                <ItemProcessor
                  key={`${it.id}-${it.updated_at}`}
                  item={it}
                  canProcess={["paid", "processing", "partial", "failed", "success"].includes(o.status)}
                  onDone={refresh}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
