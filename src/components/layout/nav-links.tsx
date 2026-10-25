"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MAIN_NAV } from "./nav-config";

const base = "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

/** Plain links used as the static-shell fallback before the pathname is known. */
export function NavLinksFallback() {
  return (
    <>
      {MAIN_NAV.map((n) => (
        <Link key={n.href} href={n.href} className={base}>
          {n.label}
        </Link>
      ))}
    </>
  );
}

export function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {MAIN_NAV.map((n) => {
        const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
        return (
          <Link key={n.href} href={n.href} className={cn(base, active && "bg-primary/10 text-foreground")}>
            {n.label}
          </Link>
        );
      })}
    </>
  );
}
