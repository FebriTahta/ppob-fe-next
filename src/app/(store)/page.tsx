import { CategoryShowcase } from "@/components/home/category-showcase";
import { FlashSaleSection } from "@/components/home/flash-sale-section";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { HowItWorks } from "@/components/home/how-it-works";
import { MembershipCta } from "@/components/home/membership-cta";
import { PopularStrip } from "@/components/home/popular-strip";
import { TrustFeatures } from "@/components/home/trust-features";
import { getBanners, getCategories, getFlashSales, getSettings } from "@/lib/api/server";

export default async function HomePage() {
  const [settings, banners, flashSales, categories] = await Promise.all([
    getSettings(),
    getBanners(),
    getFlashSales(),
    getCategories(),
  ]);
  const popular = categories.filter((c) => c.is_popular);

  return (
    <div className="space-y-10 sm:space-y-14">
      <HeroCarousel banners={banners} settings={settings.carousel} />
      <TrustFeatures />
      {flashSales.map((s) => (
        <FlashSaleSection key={s.id} sale={s} />
      ))}
      <PopularStrip categories={popular} />
      <CategoryShowcase categories={categories} />
      <HowItWorks />
      <MembershipCta />
    </div>
  );
}
