import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GameHero } from "@/components/product/game-hero";
import { GameInfo } from "@/components/product/game-info";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategories, getCategoryDetail } from "@/lib/api/server";

export async function generateStaticParams() {
  const popular = await getCategories({ popular: true });
  return popular.length ? popular.map((c) => ({ slug: c.slug })) : [{ slug: "mobile-legends" }];
}

export async function generateMetadata({ params }: PageProps<"/game/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCategoryDetail(slug);
  if (!c) return { title: "Produk tidak ditemukan" };
  return { title: `Top Up ${c.name}`, description: c.description };
}

export default function GamePage({ params }: PageProps<"/game/[slug]">) {
  return (
    <Suspense fallback={<GameSkeleton />}>
      <GameContent params={params} />
    </Suspense>
  );
}

async function GameContent({ params }: Pick<PageProps<"/game/[slug]">, "params">) {
  const { slug } = await params;
  const category = await getCategoryDetail(slug);
  if (!category) notFound();

  return (
    <div className="space-y-5">
      <GameHero category={category} />
      <Suspense fallback={<PanelSkeleton />}>
        <PurchasePanel initial={category} />
      </Suspense>
      <GameInfo category={category} />
    </div>
  );
}

function PanelSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <Skeleton className="h-96 rounded-2xl" />
      <Skeleton className="hidden h-64 rounded-2xl lg:block" />
    </div>
  );
}

function GameSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-48 rounded-3xl" />
      <PanelSkeleton />
    </div>
  );
}
