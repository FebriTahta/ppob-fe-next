"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, FlaskConical, Loader2, TimerReset } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { CopyButton } from "@/components/shared/copy-button";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/client";
import { formatRupiah } from "@/lib/format";
import type { Order } from "@/lib/types";

/** Payment instructions for a pending order: QR, VA number, retail code or the gateway's hosted page. */
export function PaymentPanel({ order }: { order: Order }) {
  const qc = useQueryClient();
  const pd = order.payment_data ?? {};
  const external = order.payment_url && !order.payment_url.includes(`/invoice/${order.invoice}`);

  const simulate = useMutation({
    mutationFn: () => api.message(`/orders/${order.invoice}/simulate-payment`),
    onSuccess: (msg) => {
      toast.success(msg);
      qc.invalidateQueries({ queryKey: ["order", order.invoice] });
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <section className="glass space-y-5 rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Total pembayaran</p>
          <div className="flex items-center gap-1">
            <p className="font-heading text-3xl font-bold tabular-nums">{formatRupiah(order.total)}</p>
            <CopyButton value={String(order.total)} label="Nominal disalin" />
          </div>
          <p className="text-xs text-muted-foreground">via {order.payment_method}</p>
        </div>
        <div className="text-right">
          <p className="mb-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
            <TimerReset className="size-3.5" /> Bayar sebelum
          </p>
          <CountdownTimer endsAt={order.expires_at} onDone={<span className="text-sm font-semibold text-destructive">Waktu habis</span>} />
        </div>
      </div>

      {pd.qr_string && (
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-2xl bg-white p-4 shadow-lg">
            <QRCodeSVG value={pd.qr_string} size={208} level="M" />
          </div>
          <p className="text-xs text-muted-foreground">Scan QR menggunakan aplikasi e-wallet / m-banking apa pun</p>
        </div>
      )}
      {pd.va_number && <CodeBox label="Nomor Virtual Account" value={pd.va_number} />}
      {pd.payment_code && <CodeBox label="Kode Pembayaran" value={pd.payment_code} />}

      <div className="flex flex-col gap-2 sm:flex-row">
        {external && (
          <Button asChild size="lg" className="h-11 flex-1 bg-brand-gradient text-white">
            <a href={order.payment_url} target="_blank" rel="noopener noreferrer">
              Lanjutkan Pembayaran <ExternalLink />
            </a>
          </Button>
        )}
        {pd.simulated && (
          <Button size="lg" variant="outline" className="h-11 flex-1 border-dashed" onClick={() => simulate.mutate()} disabled={simulate.isPending}>
            {simulate.isPending ? <Loader2 className="animate-spin" /> : <FlaskConical />} Simulasikan Pembayaran (Demo)
          </Button>
        )}
      </div>
    </section>
  );
}

function CodeBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-dashed p-4 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-center justify-center gap-1">
        <p className="font-mono text-2xl font-bold tracking-widest">{value}</p>
        <CopyButton value={value} />
      </div>
    </div>
  );
}
