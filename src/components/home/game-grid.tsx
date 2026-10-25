import type { Category } from "@/lib/types";
import { GameCard } from "./game-card";

export function GameGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      {categories.map((c) => (
        <GameCard key={c.id} category={c} />
      ))}
    </div>
  );
}
