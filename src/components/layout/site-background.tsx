import type { ThemeSettings } from "@/lib/types";

/** Page background: admin image with overlay, or a lightweight CSS effect when no image is set. */
export function SiteBackground({ theme }: { theme: ThemeSettings }) {
  if (theme.background_image) {
    const overlay = Math.min(Math.max(theme.background_overlay ?? 0.7, 0), 1);
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={theme.background_image}
          alt=""
          className="size-full object-cover"
          style={{ filter: theme.background_blur ? `blur(${theme.background_blur}px)` : undefined }}
          fetchPriority="low"
        />
        <div className="absolute inset-0 bg-background" style={{ opacity: overlay }} />
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {theme.background_effect !== "none" && (
        <>
          <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand/25 blur-[120px] animate-float-slow" />
          <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full bg-brand-2/20 blur-[120px] animate-float-slow [animation-delay:-6s]" />
          {theme.background_effect === "aurora" && (
            <div className="absolute bottom-0 -left-32 h-[380px] w-[520px] rounded-full bg-brand/15 blur-[110px] animate-float-slow [animation-delay:-3s]" />
          )}
        </>
      )}
      {theme.background_effect === "grid" && <div className="absolute inset-0 bg-grid" />}
    </div>
  );
}
