import { Zap } from "lucide-react";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import type { FlashSale } from "@/lib/types";
import { FlashCard } from "./flash-card";

export function FlashSaleSection({ sale }: { sale: FlashSale }) {
  if (sale.items.length === 0) return null;
  return (
    <section id="flash-sale" className="scroll-mt-24 overflow-hidden rounded-3xl border-gradient p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
            <Zap className="size-5 fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              <span className="text-gradient">Flash Sale</span> · {sale.name}
            </h2>
            <p className="text-xs text-muted-foreground">Harga spesial, kuota terbatas</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          Berakhir dalam <CountdownTimer endsAt={sale.ends_at} />
        </div>
      </div>
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 scrollbar-none sm:-mx-6 sm:px-6">
        {sale.items.map((it) => (
          <FlashCard key={it.item_id} item={it} />
        ))}
      </div>
    </section>
  );
}
