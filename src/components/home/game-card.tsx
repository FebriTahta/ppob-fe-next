import Link from "next/link";
import { GameArt } from "@/components/shared/game-art";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Square game tile with name & publisher. */
export function GameCard({ category, className }: { category: Category; className?: string }) {
  return (
    <Link
      href={`/game/${category.slug}`}
      className={cn("group relative block overflow-hidden rounded-2xl bg-muted transition-all duration-300 hover:-translate-y-1 hover:glow", className)}
    >
      <div className="aspect-[3/4] overflow-hidden">
        <GameArt name={category.name} src={category.image_url} className="transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-10">
        <p className="line-clamp-2 text-sm font-semibold leading-tight text-white">{category.name}</p>
        <p className="truncate text-[11px] text-white/70">{category.publisher}</p>
      </div>
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:animate-shimmer" />
    </Link>
  );
}
