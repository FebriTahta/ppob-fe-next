/** Cache tags shared by server fetchers and admin revalidation. */
export const TAGS = {
  settings: "settings",
  catalog: "catalog",
  banners: "banners",
  flash: "flash-sales",
  faqs: "faqs",
  payments: "payment-methods",
  levels: "membership-levels",
} as const;

export type CacheTagName = (typeof TAGS)[keyof typeof TAGS];

export const API_URL = process.env.API_URL ?? "http://localhost:8080";
