import { BadgeCheck, Clock3, ShieldCheck } from "lucide-react";
import { GameArt } from "@/components/shared/game-art";
import { categoryTypeLabel } from "@/lib/constants";
import type { Category } from "@/lib/types";

const MANUAL_TYPES = ["game_login", "pb_character", "tcg"];

/** Edge-to-edge banner with a liquid-glass info strip; the tilted cover art overlaps both. */
export function GameHero({ category }: { category: Category }) {
  const manual = MANUAL_TYPES.includes(category.type);
  return (
    // Spans every track of the page's full-bleed grid (see the game page and the store layout).
    <section className="relative col-span-full! -mt-4">
      <div className="relative h-44 overflow-hidden sm:h-64 lg:h-50">
        <GameArt
          name={category.name}
          src={category.banner_url || category.image_url}
          textClassName="hidden"
          // Without a banner the square cover would be a giant crop, so it becomes a blurred backdrop.
          className={category.banner_url ? "" : "scale-125 blur-2xl saturate-150"}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
        {!category.banner_url && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent,var(--background)_95%)] opacity-60" />}
      </div>

      <div className="liquid-glass border-x-0 border-b-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_56px,color-mix(in_oklch,var(--foreground)_5%,transparent)_56px_112px)] [mask-image:linear-gradient(to_right,#000,transparent_85%)]"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 pb-5 sm:flex-row sm:items-end sm:gap-8 sm:pb-6 lg:px-8">
          <div className="-mt-16 w-fit shrink-0 [perspective:900px] sm:-mt-24">
            <div className="size-28 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/25 transition-transform duration-500 [transform:rotateY(16deg)_rotateZ(-4deg)] hover:[transform:rotateY(0deg)_rotateZ(0deg)] sm:size-40 lg:size-48">
              <GameArt name={category.name} src={category.image_url} />
            </div>
          </div>
          <div className="min-w-0 space-y-2 sm:pb-1">
            <span className="inline-block rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {categoryTypeLabel(category.type)}
            </span>
            <h1 className="text-2xl font-bold tracking-wide uppercase sm:text-4xl">{category.name}</h1>
            <p className="text-sm text-muted-foreground">{category.publisher}</p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <Chip icon={<Clock3 className="size-3.5" />}>{manual ? "Diproses admin" : "Proses instan"}</Chip>
              <Chip icon={<ShieldCheck className="size-3.5" />}>Pembayaran aman</Chip>
              <Chip icon={<BadgeCheck className="size-3.5" />}>Resmi & legal</Chip>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium">
      <span className="text-primary">{icon}</span>
      {children}
    </span>
  );
}
