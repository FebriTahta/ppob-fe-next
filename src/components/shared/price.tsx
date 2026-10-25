import { discountPercent, formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = { price: number; regular?: number; strike?: number; className?: string; size?: "sm" | "md" | "lg" };

/** Price with optional crossed-out regular price and discount chip. */
export function Price({ price, regular = 0, strike = 0, className, size = "md" }: Props) {
  const crossed = Math.max(regular, strike);
  const pct = discountPercent(price, crossed);
  return (
    <div className={cn("flex flex-col", className)}>
      {pct > 0 && (
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-muted-foreground line-through">{formatRupiah(crossed)}</span>
          <span className="rounded bg-red-500/15 px-1 font-semibold text-red-500">-{pct}%</span>
        </div>
      )}
      <span
        className={cn(
          "font-heading font-bold tabular-nums",
          size === "sm" && "text-sm",
          size === "md" && "text-base",
          size === "lg" && "text-2xl",
        )}
      >
        {formatRupiah(price)}
      </span>
    </div>
  );
}
