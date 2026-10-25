import { Info } from "lucide-react";
import type { Category } from "@/lib/types";

export function GameInfo({ category }: { category: Category }) {
  if (!category.description && !category.instructions) return null;
  return (
    <section className="glass space-y-3 rounded-2xl p-5 text-sm">
      <h2 className="flex items-center gap-2 font-semibold">
        <Info className="size-4 text-primary" /> Tentang {category.name}
      </h2>
      {category.description && <p className="text-muted-foreground">{category.description}</p>}
      {category.instructions && (
        <div>
          <p className="mb-1 font-medium">Cara pembelian</p>
          <p className="whitespace-pre-line text-muted-foreground">{category.instructions}</p>
        </div>
      )}
    </section>
  );
}
