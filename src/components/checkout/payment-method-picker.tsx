"use client";

import { Building2, CreditCard, QrCode, Store, Wallet } from "lucide-react";
import { PAYMENT_GROUPS } from "@/lib/constants";
import { formatRupiah } from "@/lib/format";
import type { PaymentGroup, PaymentMethod } from "@/lib/types";
import { cn } from "@/lib/utils";

const GROUP_ICON: Record<PaymentGroup, React.ComponentType<{ className?: string }>> = {
  qris: QrCode,
  ewallet: Wallet,
  virtual_account: Building2,
  retail: Store,
  card: CreditCard,
  other: CreditCard,
};

type Props = { methods: PaymentMethod[]; amount: number; value: number | null; onChange: (id: number) => void };

const feeOf = (m: PaymentMethod, amount: number) => m.fee_flat + Math.round((amount * m.fee_percent) / 100);

export function PaymentMethodPicker({ methods, amount, value, onChange }: Props) {
  const groups = Object.keys(PAYMENT_GROUPS) as PaymentGroup[];
  return (
    <div className="space-y-4" role="radiogroup" aria-label="Metode pembayaran">
      {groups.map((g) => {
        const list = methods.filter((m) => m.group_name === g);
        if (list.length === 0) return null;
        const Icon = GROUP_ICON[g];
        return (
          <div key={g}>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <Icon className="size-3.5" /> {PAYMENT_GROUPS[g]}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {list.map((m) => {
                const disabled = (m.min_amount > 0 && amount < m.min_amount) || (m.max_amount > 0 && amount > m.max_amount);
                const selected = value === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={disabled}
                    onClick={() => onChange(m.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border bg-card/50 p-3 text-left transition-all hover:border-primary/60 disabled:opacity-40",
                      selected && "border-transparent bg-primary/10 ring-2 ring-primary",
                    )}
                  >
                    <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-white">
                      {m.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.image_url} alt={m.name} className="size-full object-contain p-1" />
                      ) : (
                        <Icon className="size-5 text-zinc-700" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {disabled ? "Tidak tersedia untuk nominal ini" : `Biaya ${formatRupiah(feeOf(m, amount))}`}
                      </p>
                    </div>
                    <span className={cn("size-4 shrink-0 rounded-full border-2", selected ? "border-primary bg-primary shadow-[inset_0_0_0_3px_var(--background)]" : "border-muted-foreground/40")} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
