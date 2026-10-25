import { formatRupiah } from "@/lib/format";
import type { Quote } from "@/lib/types";

export function OrderTotals({ quote }: { quote?: Quote }) {
  if (!quote) return null;
  return (
    <dl className="space-y-2 text-sm">
      <Row label="Subtotal" value={formatRupiah(quote.subtotal)} />
      {quote.discount > 0 && <Row label={`Diskon (${quote.coupon_code})`} value={`-${formatRupiah(quote.discount)}`} className="text-emerald-500" />}
      <Row label="Biaya pembayaran" value={quote.payment_method ? formatRupiah(quote.fee) : "-"} />
      <div className="flex items-center justify-between border-t pt-3">
        <dt className="font-medium">Total Bayar</dt>
        <dd className="font-heading text-2xl font-bold text-gradient">{formatRupiah(quote.total)}</dd>
      </div>
    </dl>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex justify-between gap-4 ${className ?? ""}`}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}
