import { CustomerDataList } from "@/components/cart/customer-data-list";
import { CopyButton } from "@/components/shared/copy-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatRupiah } from "@/lib/format";
import type { Order } from "@/lib/types";

export function OrderItemsCard({ order }: { order: Order }) {
  return (
    <section className="glass rounded-2xl p-5">
      <h2 className="mb-3 font-semibold">Item Pesanan</h2>
      <ul className="divide-y divide-border/60">
        {order.items.map((it) => (
          <li key={it.id} className="space-y-2 py-3 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{it.category_name}</p>
                <p className="font-semibold">
                  {it.product_name} {it.qty > 1 && <span className="text-muted-foreground">×{it.qty}</span>}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <StatusBadge status={it.status} kind="item" />
                <span className="text-sm tabular-nums">{formatRupiah(it.subtotal)}</span>
              </div>
            </div>
            <CustomerDataList data={it.customer_data} />
            {it.serial_number && (
              <div className="flex items-center justify-between gap-2 rounded-lg bg-emerald-500/10 px-3 py-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-emerald-500 uppercase">Serial Number / Kode</p>
                  <p className="truncate font-mono text-sm font-semibold">{it.serial_number}</p>
                </div>
                <CopyButton value={it.serial_number} />
              </div>
            )}
            {it.message && it.status !== "success" && <p className="text-xs text-muted-foreground">{it.message}</p>}
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-1.5 border-t pt-4 text-sm">
        <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatRupiah(order.subtotal)}</dd></div>
        {order.discount > 0 && (
          <div className="flex justify-between text-emerald-500"><dt>Diskon {order.coupon_code}</dt><dd>-{formatRupiah(order.discount)}</dd></div>
        )}
        <div className="flex justify-between"><dt className="text-muted-foreground">Biaya</dt><dd>{formatRupiah(order.fee)}</dd></div>
        <div className="flex justify-between font-semibold"><dt>Total</dt><dd>{formatRupiah(order.total)}</dd></div>
      </dl>
    </section>
  );
}
