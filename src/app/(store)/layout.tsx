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
      <main className="mx-auto w-full max-w-7xl px-4 pt-4">{children}</main>
      <SiteFooter site={site} contact={contact} year={new Date().getFullYear()} />
      <FloatingContact contact={contact} />
      <Suspense>
        <MobileBottomNav />
      </Suspense>
    </>
  );
}
