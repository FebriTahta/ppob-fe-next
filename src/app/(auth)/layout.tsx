import { SiteBackground } from "@/components/layout/site-background";
import { BrandLogo } from "@/components/shared/brand-logo";
import { getSettings } from "@/lib/api/server";

export default async function AuthLayout({ children }: LayoutProps<"/">) {
  const { site, theme } = await getSettings();
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10">
      <SiteBackground theme={theme} />
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <BrandLogo site={site} className="text-2xl [&>span:last-child]:inline" />
        </div>
        {children}
      </div>
    </div>
  );
}
