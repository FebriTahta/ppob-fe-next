import { Gamepad2, HelpCircle, Home, Crown, ReceiptText, ShoppingCart, User } from "lucide-react";

export const MAIN_NAV = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/games", label: "Semua Produk", icon: Gamepad2 },
  { href: "/track", label: "Lacak Pesanan", icon: ReceiptText },
  { href: "/membership", label: "Membership", icon: Crown },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
] as const;

export const MOBILE_NAV = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/games", label: "Produk", icon: Gamepad2 },
  { href: "/track", label: "Lacak", icon: ReceiptText },
  { href: "/cart", label: "Keranjang", icon: ShoppingCart },
  { href: "/account", label: "Akun", icon: User },
] as const;
