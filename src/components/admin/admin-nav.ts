import {
  BadgePercent, Braces, Crosshair, Crown, Medal, FileQuestion, Gauge, Images, LayoutGrid, Package, Palette, ReceiptText, Settings, Truck, Users, Wallet, Zap,
} from "lucide-react";

export const ADMIN_NAV = [
  { group: "Ringkasan", items: [{ href: "/admin", label: "Dashboard", icon: Gauge }, { href: "/admin/orders", label: "Pesanan", icon: ReceiptText }] },
  {
    group: "Katalog",
    items: [
      { href: "/admin/categories", label: "Kategori / Game", icon: LayoutGrid },
      { href: "/admin/products", label: "Produk & Harga", icon: Package },
      { href: "/admin/pb-characters", label: "Karakter Point Blank", icon: Crosshair },
      { href: "/admin/pb-ranks", label: "Pangkat Point Blank", icon: Medal },
    ],
  },
  {
    group: "Promosi",
    items: [
      { href: "/admin/flash-sales", label: "Flash Sale", icon: Zap },
      { href: "/admin/coupons", label: "Kupon", icon: BadgePercent },
      { href: "/admin/banners", label: "Banner Carousel", icon: Images },
    ],
  },
  {
    group: "Pengguna",
    items: [
      { href: "/admin/users", label: "Pengguna", icon: Users },
      { href: "/admin/membership", label: "Membership & Reseller", icon: Crown },
    ],
  },
  {
    group: "Integrasi",
    items: [
      { href: "/admin/payments", label: "Payment Gateway", icon: Wallet },
      { href: "/admin/providers", label: "Provider PPOB", icon: Truck },
      { href: "/admin/api-explorer", label: "API Explorer", icon: Braces },
    ],
  },
  {
    group: "Website",
    items: [
      { href: "/admin/settings", label: "Pengaturan", icon: Settings },
      { href: "/admin/appearance", label: "Tampilan & Tema", icon: Palette },
      { href: "/admin/faqs", label: "FAQ", icon: FileQuestion },
    ],
  },
] as const;
