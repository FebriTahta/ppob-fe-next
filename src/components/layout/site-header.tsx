"use client";

import { Suspense, useEffect, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import type { SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CartButton } from "./cart-button";
import { NavLinks, NavLinksFallback } from "./nav-links";
import { SearchCommand } from "./search-command";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function SiteHeader({ site }: { site: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled ? "glass border-x-0 border-t-0 shadow-lg shadow-black/5" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <BrandLogo site={site} />
        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          <Suspense fallback={<NavLinksFallback />}>
            <NavLinks />
          </Suspense>
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <SearchCommand />
          <ThemeToggle />
          <CartButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
