import Link from "next/link";
import { Flame } from "lucide-react";
import { GameArt } from "@/components/shared/game-art";
import { Price } from "@/components/shared/price";
import { Progress } from "@/components/ui/progress";
import type { FlashItem } from "@/lib/types";

export function FlashCard({ item }: { item: FlashItem }) {
  const pct = item.quota > 0 ? Math.min(100, Math.round((item.sold / item.quota) * 100)) : 0;
  return (
    <Link
      href={`/game/${item.category_slug}?product=${item.product_id}`}
      className="glass group flex w-44 shrink-0 snap-start flex-col overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:glow sm:w-52"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <GameArt name={item.category_name} src={item.category_image} className="transition-transform duration-500 group-hover:scale-110" />
        <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
          <Flame className="size-3 fill-current" /> FLASH
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="truncate text-xs text-muted-foreground">{item.category_name}</p>
          <p className="line-clamp-1 text-sm font-semibold">{item.product_name}</p>
        </div>
        <Price price={item.price} regular={item.regular_price} size="sm" className="mt-auto" />
        {item.quota > 0 ? (
          <div className="space-y-1">
            <Progress value={pct} className="h-1.5 [&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-red-500" />
            <p className="text-[10px] text-muted-foreground">{pct >= 80 ? "Hampir habis!" : `Terjual ${item.sold}/${item.quota}`}</p>
          </div>
        ) : (
          <p className="text-[10px] text-muted-foreground">Stok tersedia</p>
        )}
      </div>
    </Link>
  );
}
