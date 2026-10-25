"use client";

import { Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { CATEGORY_TYPES } from "@/lib/constants";
import type { Category, CategoryType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GameGrid } from "./game-grid";

/** Full catalogue with instant search and type filter. */
export function GameBrowser({ categories }: { categories: Category[] }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState<CategoryType | "all">("all");

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return categories.filter(
      (c) =>
        (type === "all" || c.type === type) &&
        (!term || c.name.toLowerCase().includes(term) || c.publisher.toLowerCase().includes(term)),
    );
  }, [categories, q, type]);

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari game, voucher, atau publisher..." className="glass h-12 rounded-2xl pl-12 text-base" aria-label="Cari" />
      </div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-none">
        {[{ value: "all" as const, short: "Semua" }, ...CATEGORY_TYPES].map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
              type === t.value ? "border-transparent bg-brand-gradient text-white" : "glass text-muted-foreground hover:text-foreground",
            )}
          >
            {t.short}
          </button>
        ))}
      </div>
      {shown.length ? (
        <GameGrid categories={shown} />
      ) : (
        <EmptyState icon={<SearchX />} title="Tidak ditemukan" description="Coba kata kunci lain atau ubah filter kategori." />
      )}
    </div>
  );
}
