import { Check, CreditCard, PackageCheck, Receipt, Settings2 } from "lucide-react";
import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "created", label: "Dibuat", icon: Receipt },
  { key: "paid", label: "Dibayar", icon: CreditCard },
  { key: "processing", label: "Diproses", icon: Settings2 },
  { key: "done", label: "Selesai", icon: PackageCheck },
];

const LEVEL: Record<OrderStatus, number> = {
  pending: 0, expired: 0, cancelled: 0, paid: 1, processing: 2, success: 3, partial: 3, failed: 3, refunded: 3,
};

export function StatusTimeline({ status }: { status: OrderStatus }) {
  const level = LEVEL[status];
  const failed = status === "failed" || status === "expired" || status === "cancelled";
  return (
    <ol className="flex items-center">
      {STEPS.map((s, i) => {
        const done = i <= level;
        const Icon = done && i < level ? Check : s.icon;
        return (
          <li key={s.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full border-2 transition-colors",
                  done ? "border-transparent bg-brand-gradient text-white" : "border-border text-muted-foreground",
                  done && i === level && failed && "bg-none bg-red-500",
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className={cn("text-[11px] font-medium", done ? "text-foreground" : "text-muted-foreground")}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <span className={cn("mx-1 mb-5 h-0.5 flex-1 rounded-full", i < level ? "bg-brand-gradient" : "bg-border")} />}
          </li>
        );
      })}
    </ol>
  );
}
