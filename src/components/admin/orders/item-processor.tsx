"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CopyButton } from "@/components/shared/copy-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api/client";
import { formatRupiah } from "@/lib/format";
import type { OrderItem } from "@/lib/types";

export type AdminItem = OrderItem & { sku: string; provider_id: number | null; base_price: number };

/** Manual fulfilment controls for one order line (status, SN/code, note, retry). */
export function ItemProcessor({ item, canProcess, onDone }: { item: AdminItem; canProcess: boolean; onDone: () => void }) {
  const [status, setStatus] = useState(item.status === "pending" ? "processing" : item.status);
  const [sn, setSn] = useState(item.serial_number);
  const [msg, setMsg] = useState(item.message);

  const save = useMutation({
    mutationFn: () => api.message(`/admin/order-items/${item.id}`, { status, serial_number: sn, message: msg }, "PUT"),
    onSuccess: (m) => {
      toast.success(m);
      onDone();
    },
    onError: (e) => toast.error(e.message),
  });
  const retry = useMutation({
    mutationFn: () => api.message(`/admin/order-items/${item.id}/retry`),
    onSuccess: (m) => {
      toast.success(m);
      onDone();
    },
    onError: (e) => toast.error(e.message),
  });

  const data = Object.entries(item.customer_data).filter(([k]) => k !== "_target");
  return (
    <div className="space-y-3 rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">
            {item.category_name} · {item.sku || "tanpa SKU"} · {item.provider_id ? `provider #${item.provider_id}` : "manual"}
          </p>
          <p className="font-semibold">
            {item.product_name} ×{item.qty}
          </p>
          <p className="text-xs text-muted-foreground">
            Modal {formatRupiah(item.base_price * item.qty)} · Jual {formatRupiah(item.subtotal)}
          </p>
        </div>
        <StatusBadge status={item.status} kind="item" />
      </div>
      {data.length > 0 && (
        <dl className="grid gap-1 rounded-lg bg-muted/50 p-3 text-sm sm:grid-cols-2">
          {data.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="flex items-center gap-1 font-mono text-xs font-semibold">
                {v}
                <CopyButton value={v} />
              </dd>
            </div>
          ))}
        </dl>
      )}
      {item.provider_ref && (
        <p className="text-xs text-muted-foreground">
          Ref provider: <span className="font-mono">{item.provider_ref}</span>
        </p>
      )}
      {canProcess && (
        <div className="grid gap-2 sm:grid-cols-[140px_1fr]">
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="processing">Diproses</SelectItem>
              <SelectItem value="success">Sukses</SelectItem>
              <SelectItem value="failed">Gagal</SelectItem>
            </SelectContent>
          </Select>
          <Input value={sn} onChange={(e) => setSn(e.target.value)} placeholder="Serial number / kode voucher / resi" className="h-9" />
          <Input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Catatan untuk pembeli" className="h-9 sm:col-span-2" />
          <div className="flex gap-2 sm:col-span-2">
            <Button size="sm" onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Simpan
            </Button>
            {item.status !== "success" && (
              <Button size="sm" variant="outline" onClick={() => retry.mutate()} disabled={retry.isPending}>
                <RotateCcw /> Proses ulang
              </Button>
            )}
          </div>
        </div>
      )}
      {!canProcess && item.message && <p className="text-xs text-muted-foreground">{item.message}</p>}
    </div>
  );
}
