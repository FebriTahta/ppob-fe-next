import type { CategoryType, ItemStatus, OrderStatus, PaymentGroup } from "./types";

export const CATEGORY_TYPES: { value: CategoryType; label: string; short: string }[] = [
  { value: "game_topup", label: "Top Up Game", short: "Top Up" },
  { value: "voucher", label: "Voucher", short: "Voucher" },
  { value: "game_login", label: "Top Up via Login", short: "Via Login" },
  { value: "pb_character", label: "Karakter Point Blank", short: "Point Blank" },
  { value: "tcg", label: "TCG & Pre-Order", short: "TCG" },
  { value: "ppob", label: "Pulsa & PPOB", short: "PPOB" },
];

export const categoryTypeLabel = (t: string) => CATEGORY_TYPES.find((c) => c.value === t)?.label ?? t;

/** Categories where the same product can be bought in multiple quantities. */
export const MULTI_QTY_TYPES: CategoryType[] = ["tcg"];

/** Categories whose products are one-of-a-kind listings, sold once (Point Blank characters). */
export const UNIQUE_LISTING_TYPES: CategoryType[] = ["pb_character"];

export const PAYMENT_GROUPS: Record<PaymentGroup, string> = {
  qris: "QRIS",
  ewallet: "E-Wallet",
  virtual_account: "Virtual Account",
  retail: "Gerai Retail",
  card: "Kartu Kredit",
  other: "Lainnya",
};

type Tone = "neutral" | "info" | "warning" | "success" | "danger";

export const ORDER_STATUS: Record<OrderStatus, { label: string; tone: Tone }> = {
  pending: { label: "Menunggu Pembayaran", tone: "warning" },
  paid: { label: "Dibayar", tone: "info" },
  processing: { label: "Diproses", tone: "info" },
  success: { label: "Berhasil", tone: "success" },
  partial: { label: "Sebagian Berhasil", tone: "warning" },
  failed: { label: "Gagal", tone: "danger" },
  expired: { label: "Kedaluwarsa", tone: "neutral" },
  cancelled: { label: "Dibatalkan", tone: "neutral" },
  refunded: { label: "Dikembalikan", tone: "neutral" },
};

export const ITEM_STATUS: Record<ItemStatus, { label: string; tone: Tone }> = {
  pending: { label: "Menunggu", tone: "neutral" },
  processing: { label: "Diproses", tone: "info" },
  success: { label: "Sukses", tone: "success" },
  failed: { label: "Gagal", tone: "danger" },
  cancelled: { label: "Dibatalkan", tone: "neutral" },
};

export const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  info: "bg-sky-500/15 text-sky-500 border-sky-500/30",
  warning: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  success: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  danger: "bg-red-500/15 text-red-500 border-red-500/30",
};

export const ACTIVE_ORDER_STATUSES: OrderStatus[] = ["pending", "paid", "processing"];
