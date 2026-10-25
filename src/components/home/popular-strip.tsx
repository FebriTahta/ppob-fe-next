import Link from "next/link";
import { Flame } from "lucide-react";
import { GameArt } from "@/components/shared/game-art";
import { SectionHeader } from "@/components/shared/section-header";
import type { Category } from "@/lib/types";

/** Horizontal list of popular games with wide artwork. */
export function PopularStrip({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;
  return (
    <section>
      <SectionHeader title="Lagi Populer" subtitle="Paling banyak dibeli minggu ini" icon={<Flame className="size-5" />} />
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
        {categories.map((c, i) => (
          <Link
            key={c.id}
            href={`/game/${c.slug}`}
            className="glass group flex w-64 shrink-0 snap-start items-center gap-3 rounded-2xl p-2.5 transition-all stagger-in hover:glow"
            style={{ "--i": i } as React.CSSProperties}
          >
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
              <GameArt name={c.name} src={c.image_url} textClassName="text-lg" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{c.name}</p>
              <p className="truncate text-xs text-muted-foreground">{c.publisher}</p>
            </div>
            <span className="font-heading text-3xl font-bold text-foreground/10 group-hover:text-primary/40">{i + 1}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
