"use client";

import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { useEffect, useMemo, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import type { Banner, CarouselSettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BannerSlide } from "./banner-slide";
import { CarouselDots } from "./carousel-dots";

const HEIGHT = { sm: "h-44 sm:h-60", md: "h-52 sm:h-80", lg: "h-64 sm:h-[26rem]" } as const;

/** Home hero carousel; the visual style is selected in admin settings (slide | fade | cards | split). */
export function HeroCarousel({ banners, settings }: { banners: Banner[]; settings: CarouselSettings }) {
  const [api, setApi] = useState<CarouselApi>();
  const [index, setIndex] = useState(0);
  const style = settings.style;

  const plugins = useMemo(() => {
    const list = [];
    if (settings.autoplay) list.push(Autoplay({ delay: Math.max(settings.interval_ms, 2000), stopOnInteraction: false, stopOnMouseEnter: true }));
    if (style === "fade") list.push(Fade());
    return list;
  }, [settings.autoplay, settings.interval_ms, style]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (banners.length === 0) return null;
  const cards = style === "cards";

  return (
    <section aria-label="Promo" className="relative">
      <Carousel setApi={setApi} plugins={plugins} opts={{ loop: banners.length > 1, align: "center" }}>
        <CarouselContent className={cn(cards && "-ml-3 sm:-ml-5")}>
          {banners.map((b, i) => (
            <CarouselItem key={b.id} className={cn(cards && "basis-[88%] pl-3 sm:basis-[78%] sm:pl-5 lg:basis-[68%]")}>
              <div
                className={cn(
                  HEIGHT[settings.height] ?? HEIGHT.md,
                  "transition-all duration-500",
                  cards && i !== index && "scale-[0.92] opacity-50",
                  cards && i === index && "glow",
                  "rounded-2xl",
                )}
              >
                <BannerSlide banner={b} layout={style === "split" ? "split" : "overlay"} priority={i === 0} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {settings.show_arrows && banners.length > 1 && (
          <>
            <CarouselPrevious className="left-4 hidden border-white/20 bg-black/40 text-white backdrop-blur hover:bg-black/60 sm:flex" />
            <CarouselNext className="right-4 hidden border-white/20 bg-black/40 text-white backdrop-blur hover:bg-black/60 sm:flex" />
          </>
        )}
      </Carousel>
      {settings.show_indicators && banners.length > 1 && (
        <CarouselDots className="mt-3" count={banners.length} active={index} onSelect={(i) => api?.scrollTo(i)} />
      )}
    </section>
  );
}
