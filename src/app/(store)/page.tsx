import { Suspense } from "react";
import { CategoryShowcaseSkeleton, PopularStripSkeleton } from "@/components/home/catalog-skeletons";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { FlashSaleSection } from "@/components/home/flash-sale-section";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { HowItWorks } from "@/components/home/how-it-works";
import { MembershipCta } from "@/components/home/membership-cta";
import { PopularStrip } from "@/components/home/popular-strip";
import { TrustFeatures } from "@/components/home/trust-features";
import { getBanners, getCategories, getFlashSales, getSettings } from "@/lib/api/server";

export default async function HomePage() {
  const [settings, banners, flashSales] = await Promise.all([getSettings(), getBanners(), getFlashSales()]);

  return (
    <div className="space-y-10 sm:space-y-14">
      <HeroCarousel banners={banners} settings={settings.carousel} />
      <TrustFeatures />
      {flashSales.map((s) => (
        <FlashSaleSection key={s.id} sale={s} />
      ))}
      {/* Catalog streams in behind skeletons; both sections share one cached getCategories() call. */}
      <Suspense fallback={<PopularStripSkeleton />}>
        <PopularSection />
      </Suspense>
      <Suspense fallback={<CategoryShowcaseSkeleton />}>
        <CatalogSection />
      </Suspense>
      <HowItWorks />
      <MembershipCta />
    </div>
  );
}

async function PopularSection() {
  const categories = await getCategories();
  return <PopularStrip categories={categories.filter((c) => c.is_popular)} />;
}

async function CatalogSection() {
  return <CategoryShowcase categories={await getCategories()} />;
}
