import { Zap } from "lucide-react";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import type { FlashSale } from "@/lib/types";
import { FlashCard } from "./flash-card";

export function FlashSaleSection({ sale }: { sale: FlashSale }) {
  // An item whose flash price hits the cost floor has no real discount, so it is not a flash deal.
  const items = sale.items.filter((it) => it.price < it.regular_price);
  if (items.length === 0) return null;

  // Repeat short lists so one half of the track is wider than the viewport, then double it for the loop.
  let base = items;
  while (base.length < 6) base = base.concat(items);
  const track = base.concat(base);

  return (
    <section id="flash-sale" className="glass scroll-mt-24 overflow-hidden rounded-3xl">
      <div className="relative flex flex-wrap items-center justify-between gap-3 overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 px-4 py-3 text-white sm:px-6">
        <Zap aria-hidden className="pointer-events-none absolute -top-6 right-1/3 size-28 rotate-12 fill-current opacity-10" />
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-white/20 shadow-inner">
            <Zap className="size-5 animate-pulse fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-wide italic sm:text-2xl">FLASH SALE</h2>
            <p className="text-xs text-white/85">{sale.name} · kuota terbatas</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-white/90">
          <span className="hidden sm:inline">Berakhir dalam</span>
          <CountdownTimer endsAt={sale.ends_at} labeled />
        </div>
      </div>
      {/* Auto-scrolls left; pauses on hover/focus. With reduced motion it becomes a normal swipeable row. */}
      <div className="overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,#000_3%,#000_97%,transparent)] motion-reduce:overflow-x-auto sm:py-6">
        <div className="marquee-track flex w-max" style={{ "--marquee-duration": `${base.length * 6}s` } as React.CSSProperties}>
          {track.map((it, k) => (
            <div key={k} className="pl-4">
              <FlashCard item={it} decorative={k >= items.length} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
