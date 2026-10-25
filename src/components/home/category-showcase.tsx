"use client";

import { LayoutGrid } from "lucide-react";
import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/shared/section-header";
import { CATEGORY_TYPES } from "@/lib/constants";
import type { Category, CategoryType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GameGrid } from "./game-grid";

/** Product catalogue with type tabs (top up first), filtered client-side from the cached list. */
export function CategoryShowcase({ categories }: { categories: Category[] }) {
  const tabs = useMemo(
    () => CATEGORY_TYPES.filter((t) => categories.some((c) => c.type === t.value)),
    [categories],
  );
  const [picked, setPicked] = useState<CategoryType>("game_topup");
  // Top up is the default; fall back to the first type that has categories when there is no top up.
  const tab = tabs.some((t) => t.value === picked) ? picked : (tabs[0]?.value ?? picked);
  const shown = categories.filter((c) => c.type === tab);

  return (
    <section>
      <SectionHeader title="Pilih Produk" subtitle="Top up game, voucher, karakter & lainnya" icon={<LayoutGrid className="size-5" />} href="/games" />
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 scrollbar-none" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => setPicked(t.value)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
              tab === t.value ? "border-transparent bg-brand-gradient text-white shadow-lg glow" : "glass text-muted-foreground hover:text-foreground",
            )}
          >
            {t.short}
          </button>
        ))}
      </div>
      <GameGrid key={tab} categories={shown} />
    </section>
  );
}
