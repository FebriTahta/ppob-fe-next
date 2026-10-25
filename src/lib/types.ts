// Shared API contracts mirrored from the Go backend (internal/domain).

export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: PageMeta;
  errors?: Record<string, string>;
};

export type PageMeta = { page: number; per_page: number; total: number; total_pages: number };
export type Paginated<T> = { data: T[]; meta: PageMeta };

export type CategoryType = "game_topup" | "voucher" | "game_login" | "pb_character" | "tcg" | "ppob";

export type InputField = {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "password" | "select" | "email";
  required: boolean;
  options?: string[];
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  type: CategoryType;
  publisher: string;
  description: string;
  instructions: string;
  image_url: string;
  banner_url: string;
  input_fields: InputField[];
  provider_id: number | null;
  margin_percent: number | null;
  is_popular: boolean;
  sort_order: number;
  is_active: boolean;
  product_count?: number;
};

export type FlashInfo = { item_id: number; ends_at: string; quota: number; sold: number; remaining: number };

export type PublicProduct = {
  id: number;
  category_id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
  regular_price: number;
  strike_price: number;
  stock: number | null;
  max_qty: number;
  is_preorder: boolean;
  preorder_note: string;
  badge: string;
  rank?: { name: string; image_url: string };
  flash_sale?: FlashInfo;
};

export type CategoryDetail = Category & { products: PublicProduct[] };

export type FlashItem = {
  item_id: number;
  product_id: number;
  product_name: string;
  category_name: string;
  category_slug: string;
  category_image: string;
  /** Optional until every API instance serves them. */
  category_type?: CategoryType;
  product_image?: string;
  price: number;
  regular_price: number;
  quota: number;
  sold: number;
  ends_at: string;
};

export type FlashSale = { id: number; name: string; starts_at: string; ends_at: string; items: FlashItem[] };

export type Banner = {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  cta_label: string;
  sort_order: number;
  is_active: boolean;
};

export type FAQ = { id: number; question: string; answer: string; category: string; sort_order: number; is_active: boolean };

export type MembershipLevel = {
  id: number;
  name: string;
  slug: string;
  kind: "member" | "reseller";
  description: string;
  price: number;
  margin_percent: number;
  benefits: string[];
  badge_color: string;
  sort_order: number;
  is_active: boolean;
};

export type PaymentGroup = "qris" | "ewallet" | "virtual_account" | "retail" | "card" | "other";

export type PaymentMethod = {
  id: number;
  gateway_id: number;
  code: string;
  name: string;
  group_name: PaymentGroup;
  image_url: string;
  fee_flat: number;
  fee_percent: number;
  min_amount: number;
  max_amount: number;
  sort_order: number;
  is_active: boolean;
  gateway_code: string;
  gateway_driver: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  membership_level_id: number | null;
  is_active: boolean;
  created_at: string;
  membership?: MembershipLevel;
};

export type OrderStatus =
  | "pending" | "paid" | "processing" | "success" | "partial" | "failed" | "expired" | "cancelled" | "refunded";
export type ItemStatus = "pending" | "processing" | "success" | "failed" | "cancelled";

export type OrderItem = {
  id: number;
  order_id: number;
  kind: "product" | "membership";
  product_id: number | null;
  category_type: string;
  category_name: string;
  product_name: string;
  qty: number;
  unit_price: number;
  subtotal: number;
  customer_data: Record<string, string>;
  status: ItemStatus;
  provider_ref: string;
  serial_number: string;
  message: string;
  is_preorder: boolean;
  created_at: string;
  updated_at: string;
};

export type PaymentData = {
  simulated?: boolean;
  va_number?: string;
  qr_string?: string;
  payment_code?: string;
  snap_token?: string;
};

export type Order = {
  id: number;
  invoice: string;
  user_id: number | null;
  email: string;
  phone: string;
  subtotal: number;
  discount: number;
  fee: number;
  total: number;
  coupon_code: string;
  status: OrderStatus;
  payment_method: string;
  gateway_code: string;
  payment_url: string;
  payment_data: PaymentData;
  expires_at: string;
  paid_at: string | null;
  completed_at: string | null;
  notes: string;
  created_at: string;
  items: OrderItem[];
};

export type QuoteLine = {
  product_id: number | null;
  membership_level_id?: number | null;
  name: string;
  category_name: string;
  category_type: string;
  image_url: string;
  qty: number;
  unit_price: number;
  regular_price: number;
  subtotal: number;
  is_flash_sale: boolean;
  is_preorder: boolean;
  customer_data: Record<string, string>;
};

export type Quote = {
  lines: QuoteLine[];
  subtotal: number;
  discount: number;
  fee: number;
  total: number;
  coupon_code?: string;
  coupon_error?: string;
  payment_method?: PaymentMethod;
};

export type CheckoutPayload = {
  items: { product_id: number; qty: number; customer_data: Record<string, string> }[];
  membership_level_id?: number | null;
  payment_method_id?: number;
  coupon_code?: string;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
};

// ---------- Settings ----------

export type SiteSettings = {
  name: string;
  tagline: string;
  description: string;
  logo_url: string;
  favicon_url: string;
  footer_text: string;
  keywords: string;
  instagram: string;
  tiktok: string;
  youtube: string;
};

export type ThemeSettings = {
  preset: string;
  mode: "dark" | "light" | "system";
  primary_color: string;
  accent_color: string;
  radius: number;
  background_image: string;
  background_overlay: number;
  background_blur: number;
  background_effect: "grid" | "aurora" | "none";
};

export type ContactSettings = {
  whatsapp_number: string;
  whatsapp_message: string;
  floating_enabled: boolean;
  floating_icon: string;
  floating_icon_url: string;
  floating_label: string;
  floating_position: "left" | "right";
  floating_color: string;
  email: string;
  address: string;
  operational_hours: string;
};

export type CarouselSettings = {
  style: "slide" | "fade" | "cards" | "split";
  autoplay: boolean;
  interval_ms: number;
  show_indicators: boolean;
  show_arrows: boolean;
  height: "sm" | "md" | "lg";
};

export type PricingSettings = {
  default_margin_percent: number;
  round_to: number;
  payment_expiry_minutes: number;
  invoice_prefix: string;
};

export type NotificationSettings = {
  notify_on_created: boolean;
  notify_on_paid: boolean;
  notify_on_completed: boolean;
  email_enabled: boolean;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  smtp_from: string;
  whatsapp_enabled: boolean;
  whatsapp_api_url: string;
  whatsapp_token: string;
  admin_whatsapp: string;
};

export type PublicSettings = {
  site: SiteSettings;
  theme: ThemeSettings;
  contact: ContactSettings;
  carousel: CarouselSettings;
};

export type AllSettings = PublicSettings & { pricing: PricingSettings; notification: NotificationSettings };

/** Point Blank rank (pangkat) with icon, attached to character listings. */
export type PBRank = { id: number; name: string; image_url: string; sort_order: number; character_count: number };
