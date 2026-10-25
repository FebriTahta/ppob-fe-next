"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { selectCartCount, useCart } from "@/stores/cart-store";
import { MOBILE_NAV } from "./nav-config";

/** App-like bottom navigation for small screens. */
export function MobileBottomNav() {
  const pathname = usePathname();
  const count = useCart(selectCartCount);
  const mounted = useMounted();
  if (pathname.startsWith("/checkout")) return null;

  return (
    <nav
      className="glass fixed inset-x-3 bottom-3 z-40 rounded-2xl px-2 py-1.5 shadow-2xl shadow-black/20 sm:hidden"
      aria-label="Navigasi bawah"
    >
      <ul className="grid grid-cols-5">
        {MOBILE_NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium text-muted-foreground transition-colors",
                  active && "text-primary",
                )}
              >
                {active && <span className="absolute inset-x-3 -top-1.5 h-0.5 rounded-full bg-brand-gradient" />}
                <Icon className="size-5" />
                {label}
                {href === "/cart" && mounted && count > 0 && (
                  <span className="absolute top-0 right-3 grid min-w-4 place-items-center rounded-full bg-brand-gradient px-1 text-[9px] font-bold text-white">
                    {count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
