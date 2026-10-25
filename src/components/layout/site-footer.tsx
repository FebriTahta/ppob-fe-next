import Link from "next/link";
import { Camera, Clock, Mail, MapPin, Music2, Play } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import type { ContactSettings, SiteSettings } from "@/lib/types";
import { MAIN_NAV } from "./nav-config";

type Props = { site: SiteSettings; contact: ContactSettings; year: number };

export function SiteFooter({ site, contact, year }: Props) {
  return (
    <footer className="liquid-glass mt-20 rounded-t-[2rem] border-b-0 pb-28 sm:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <BrandLogo site={site} className="[&>span:last-child]:inline" />
          <p className="max-w-sm text-sm text-muted-foreground">{site.description}</p>
          <div className="flex gap-2">
            {site.instagram && (
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid size-9 place-items-center rounded-lg bg-muted hover:bg-primary/15">
                <Camera className="size-4" />
              </a>
            )}
            {site.tiktok && (
              <a href={site.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="grid size-9 place-items-center rounded-lg bg-muted hover:bg-primary/15">
                <Music2 className="size-4" />
              </a>
            )}
            {site.youtube && (
              <a href={site.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="grid size-9 place-items-center rounded-lg bg-muted hover:bg-primary/15">
                <Play className="size-4" />
              </a>
            )}
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Navigasi</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {MAIN_NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-foreground">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Kontak</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {contact.email && (
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-primary" /> {contact.email}
              </li>
            )}
            {contact.operational_hours && (
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-primary" /> {contact.operational_hours}
              </li>
            )}
            {contact.address && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> {contact.address}
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {year} {site.name}. {site.footer_text}
      </div>
    </footer>
  );
}
