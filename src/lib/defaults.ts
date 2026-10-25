import type { PublicSettings } from "@/lib/types";

/** Fallback settings used when the API is unreachable. Mirrors domain.DefaultSettings in the backend. */
export const DEFAULT_SETTINGS: PublicSettings = {
  site: {
    name: "NeoTopup",
    tagline: "Top up game & voucher tercepat, termurah, 24/7",
    description: "Platform top up game, voucher digital, dan PPOB terpercaya.",
    logo_url: "",
    favicon_url: "",
    footer_text: "",
    keywords: "",
    instagram: "",
    tiktok: "",
    youtube: "",
  },
  theme: {
    preset: "cyber",
    mode: "dark",
    primary_color: "#7c3aed",
    accent_color: "#06b6d4",
    radius: 0.9,
    background_image: "",
    background_overlay: 0.7,
    background_blur: 0,
    background_effect: "grid",
  },
  contact: {
    whatsapp_number: "",
    whatsapp_message: "",
    floating_enabled: false,
    floating_icon: "whatsapp",
    floating_icon_url: "",
    floating_label: "",
    floating_position: "right",
    floating_color: "#22c55e",
    email: "",
    address: "",
    operational_hours: "",
  },
  carousel: { style: "cards", autoplay: true, interval_ms: 5000, show_indicators: true, show_arrows: true, height: "md" },
};
