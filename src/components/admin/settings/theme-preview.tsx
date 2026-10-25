import { readableOn } from "@/lib/color";
import type { Values } from "../schema-form";

/** Mini live preview of brand colors, radius and background. */
export function ThemePreview({ v }: { v: Values }) {
  const primary = String(v.primary_color || "#7c3aed");
  const accent = String(v.accent_color || "#06b6d4");
  const radius = `${Number(v.radius ?? 0.9)}rem`;
  const bg = String(v.background_image || "");
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-zinc-950 p-5 text-white" style={{ borderRadius: radius }}>
      {bg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bg} alt="" className="absolute inset-0 size-full object-cover" style={{ filter: `blur(${Number(v.background_blur) || 0}px)` }} />
      ) : (
        <div className="absolute -top-10 left-10 size-40 rounded-full blur-3xl" style={{ background: primary, opacity: 0.5 }} />
      )}
      <div className="absolute inset-0 bg-zinc-950" style={{ opacity: bg ? Number(v.background_overlay ?? 0.7) : 0.4 }} />
      <div className="relative space-y-3">
        <p className="text-xs text-white/60">Pratinjau</p>
        <p className="text-xl font-bold" style={{ backgroundImage: `linear-gradient(100deg, ${primary}, ${accent})`, WebkitBackgroundClip: "text", color: "transparent" }}>
          Top Up Instan 24/7
        </p>
        <div className="flex gap-2">
          <span className="px-4 py-2 text-sm font-semibold" style={{ background: `linear-gradient(120deg, ${primary}, ${accent})`, color: readableOn(primary), borderRadius: radius }}>
            Beli Sekarang
          </span>
          <span className="border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur" style={{ borderRadius: radius }}>
            Keranjang
          </span>
        </div>
      </div>
    </div>
  );
}
