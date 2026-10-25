import type { Metadata } from "next";
import { GameBrowser } from "@/components/home/game-browser";
import { getCategories } from "@/lib/api/server";

export const metadata: Metadata = { title: "Semua Produk" };

export default async function GamesPage() {
  const categories = await getCategories();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Semua Produk</h1>
        <p className="text-sm text-muted-foreground">{categories.length} game & layanan tersedia</p>
      </div>
      <GameBrowser categories={categories} />
    </div>
  );
}
