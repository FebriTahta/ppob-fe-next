import { FloatingContact } from "@/components/layout/floating-contact";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SiteBackground } from "@/components/layout/site-background";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSettings } from "@/lib/api/server";
import { Suspense } from "react";

export default async function StoreLayout({ children }: LayoutProps<"/">) {
  "use cache";
  const { site, theme, contact } = await getSettings();
  return (
    <>
      <SiteBackground theme={theme} />
      <SiteHeader site={site} />
      {/* Middle track = the old max-w-7xl/px-4 content box; side tracks let a page opt into full width
          (see the game page) without 100vw, which would include the scrollbar. */}
      <main className="grid grid-cols-[minmax(0,1fr)_min(78rem,calc(100%-2rem))_minmax(0,1fr)] content-start pt-4 *:col-start-2 *:min-w-0">
        {children}
      </main>
      <SiteFooter site={site} contact={contact} year={new Date().getFullYear()} />
      <FloatingContact contact={contact} />
      <Suspense>
        <MobileBottomNav />
      </Suspense>
    </>
  );
}
