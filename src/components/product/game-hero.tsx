import { BadgeCheck, Clock3, ShieldCheck } from "lucide-react";
import { GameArt } from "@/components/shared/game-art";
import { categoryTypeLabel } from "@/lib/constants";
import type { Category } from "@/lib/types";

const MANUAL_TYPES = ["game_login", "pb_character", "tcg"];

export function GameHero({ category }: { category: Category }) {
  const manual = MANUAL_TYPES.includes(category.type);
  return (
    <section className="relative overflow-hidden rounded-3xl">
      <div className="absolute inset-0 opacity-60 blur-2xl">
        <GameArt name={category.name} src={category.banner_url || category.image_url} textClassName="hidden" />
      </div>
      <div className="relative flex flex-col gap-5 bg-gradient-to-t from-background via-background/70 to-background/20 p-5 sm:flex-row sm:items-end sm:p-8">
        <div className="size-28 shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/10 sm:size-36">
          <GameArt name={category.name} src={category.image_url} />
        </div>
        <div className="space-y-2">
          <span className="inline-block rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {categoryTypeLabel(category.type)}
          </span>
          <h1 className="text-3xl font-bold sm:text-4xl">{category.name}</h1>
          <p className="text-sm text-muted-foreground">{category.publisher}</p>
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            <Chip icon={<Clock3 className="size-3.5" />}>{manual ? "Diproses admin" : "Proses instan"}</Chip>
            <Chip icon={<ShieldCheck className="size-3.5" />}>Pembayaran aman</Chip>
            <Chip icon={<BadgeCheck className="size-3.5" />}>Resmi & legal</Chip>
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
