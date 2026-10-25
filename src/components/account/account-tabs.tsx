"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/account", label: "Profil" },
  { href: "/account/orders", label: "Riwayat Transaksi" },
];

export function AccountTabs() {
  const pathname = usePathname();
  return (
    <nav className="glass inline-flex rounded-xl p-1">
      {TABS.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={cn("rounded-lg px-4 py-1.5 text-sm font-medium text-muted-foreground", pathname === t.href && "bg-brand-gradient text-white")}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
