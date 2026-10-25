import Link from "next/link";
import { Zap } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

export function BrandLogo({ site, className }: { site: Pick<SiteSettings, "name" | "logo_url">; className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 font-heading text-lg font-bold", className)} aria-label={site.name}>
      {site.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={site.logo_url} alt={site.name} className="h-8 w-auto" />
      ) : (
        <span className="grid size-8 place-items-center rounded-lg bg-brand-gradient text-white glow">
          <Zap className="size-4 fill-current" />
        </span>
      )}
      <span className="hidden sm:inline">{site.name}</span>
    </Link>
  );
}
