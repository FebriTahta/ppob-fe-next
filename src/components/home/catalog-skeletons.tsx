import { Flame, LayoutGrid } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for PopularStrip while categories load; same footprint so nothing jumps. */
export function PopularStripSkeleton() {
  return (
    <section aria-busy aria-label="Memuat game populer">
      <SectionHeader title="Lagi Populer" subtitle="Paling banyak dibeli minggu ini" icon={<Flame className="size-5" />} />
      <div className="-mx-4 flex gap-3 overflow-hidden px-4 pb-2">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="glass flex w-64 shrink-0 items-center gap-3 rounded-2xl p-2.5">
            <Skeleton className="size-14 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Placeholder for CategoryShowcase: tab pills plus a grid of tiles. */
export function CategoryShowcaseSkeleton() {
  return (
    <section aria-busy aria-label="Memuat produk">
      <SectionHeader title="Pilih Produk" subtitle="Top up game, voucher, karakter & lainnya" icon={<LayoutGrid className="size-5" />} />
      <div className="-mx-4 mb-4 flex gap-2 overflow-hidden px-4">
        {[88, 72, 96, 80, 64].map((w, i) => (
          <Skeleton key={i} className="h-8 shrink-0 rounded-full" style={{ width: w }} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {Array.from({ length: 12 }, (_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
        ))}
      </div>
    </section>
  );
}
