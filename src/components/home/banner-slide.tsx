import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Banner } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = { banner: Banner; layout?: "overlay" | "split"; priority?: boolean; className?: string };

/** One banner slide. "overlay" puts text over the image; "split" shows a text panel beside it. */
export function BannerSlide({ banner, layout = "overlay", priority, className }: Props) {
  const content = (
    <div className={cn("flex max-w-xl flex-col items-start gap-3", layout === "split" && "max-w-none")}>
      {banner.title && <h2 className="text-2xl font-bold text-white drop-shadow sm:text-4xl lg:text-5xl">{banner.title}</h2>}
      {banner.subtitle && <p className="text-sm text-white/85 sm:text-base">{banner.subtitle}</p>}
      {banner.cta_label && banner.link_url && (
        <span className="mt-1 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-lg transition-transform group-hover:translate-x-1">
          {banner.cta_label} <ArrowRight className="size-4" />
        </span>
      )}
    </div>
  );

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={banner.image_url}
      alt={banner.title || "Banner promo"}
      className="absolute inset-0 size-full object-cover"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );

  const inner =
    layout === "split" ? (
      <div className="grid size-full md:grid-cols-[1fr_1.4fr]">
        <div className="relative z-10 flex items-center bg-gradient-to-br from-zinc-950 to-zinc-900 p-6 sm:p-10">{content}</div>
        <div className="relative hidden md:block">{img}</div>
        <div className="absolute inset-0 -z-0 md:hidden">{img}</div>
      </div>
    ) : (
      <>
        {img}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
        <div className="relative z-10 flex size-full items-end p-6 sm:items-center sm:p-12">{content}</div>
      </>
    );

  const cls = cn("group relative block size-full overflow-hidden rounded-2xl", className);
  return banner.link_url ? (
    <Link href={banner.link_url} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
