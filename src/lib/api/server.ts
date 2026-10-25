import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Banner, Category, CategoryDetail, FAQ, FlashSale, MembershipLevel, PaymentMethod, PublicSettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/defaults";

import { API_URL, TAGS } from "@/lib/tags";

async function fetchData<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1${path}`, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data ?? null) as T | null;
  } catch {
    // Backend unreachable (e.g. during build). Callers fall back to safe defaults.
    return null;
  }
}

export async function getSettings(): Promise<PublicSettings> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAGS.settings);
  const data = await fetchData<PublicSettings>("/settings");
  return {
    site: { ...DEFAULT_SETTINGS.site, ...data?.site },
    theme: { ...DEFAULT_SETTINGS.theme, ...data?.theme },
    contact: { ...DEFAULT_SETTINGS.contact, ...data?.contact },
    carousel: { ...DEFAULT_SETTINGS.carousel, ...data?.carousel },
  };
}

export async function getCategories(params: { type?: string; popular?: boolean } = {}): Promise<Category[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAGS.catalog);
  const qs = new URLSearchParams();
  if (params.type) qs.set("type", params.type);
  if (params.popular) qs.set("popular", "true");
  return (await fetchData<Category[]>(`/categories?${qs}`)) ?? [];
}

/** Category with public (guest) prices. Logged-in viewers re-fetch member prices on the client. */
export async function getCategoryDetail(slug: string): Promise<CategoryDetail | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAGS.catalog, `category:${slug}`);
  return fetchData<CategoryDetail>(`/categories/${encodeURIComponent(slug)}`);
}

export async function getBanners(): Promise<Banner[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAGS.banners);
  return (await fetchData<Banner[]>("/banners")) ?? [];
}

export async function getFlashSales(): Promise<FlashSale[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAGS.flash, TAGS.catalog);
  return (await fetchData<FlashSale[]>("/flash-sales")) ?? [];
}

export async function getFaqs(): Promise<FAQ[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.faqs);
  return (await fetchData<FAQ[]>("/faqs")) ?? [];
}

export async function getMembershipLevels(): Promise<MembershipLevel[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.levels);
  return (await fetchData<MembershipLevel[]>("/membership-levels")) ?? [];
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAGS.payments);
  return (await fetchData<PaymentMethod[]>("/payment-methods")) ?? [];
}
