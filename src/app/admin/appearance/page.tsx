"use client";

import { PageHeader } from "@/components/admin/page-header";
import { SettingsSection } from "@/components/admin/settings/settings-section";
import { ThemePreview } from "@/components/admin/settings/theme-preview";
import { useAdminSettings } from "@/components/admin/settings/use-settings";
import { Skeleton } from "@/components/ui/skeleton";
import { THEME_PRESETS } from "@/lib/color";
import { cn } from "@/lib/utils";

export default function AppearancePage() {
  const { data, isLoading } = useAdminSettings();
  if (isLoading || !data) return <Skeleton className="h-96 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Tampilan & Tema" description="Warna brand, mode, latar belakang, dan gaya carousel beranda." />
      <SettingsSection
        settingKey="theme"
        initial={data.theme}
        title="Tema website"
        description="Jika gambar latar kosong, website memakai efek tema (grid/aurora) yang ringan."
        fields={[
          { name: "mode", label: "Mode default", type: "select", options: [{ value: "dark", label: "Gelap" }, { value: "light", label: "Terang" }, { value: "system", label: "Ikuti perangkat" }] },
          { name: "radius", label: "Kelengkungan sudut", type: "number", step: 0.05, suffix: "rem" },
          { name: "primary_color", label: "Warna utama", type: "color" },
          { name: "accent_color", label: "Warna aksen", type: "color" },
          { name: "background_effect", label: "Efek latar (tanpa gambar)", type: "select", options: [{ value: "grid", label: "Grid futuristik + glow" }, { value: "aurora", label: "Aurora glow" }, { value: "none", label: "Polos" }] },
          { name: "background_image", label: "Gambar latar (opsional)", type: "image", aspect: "wide" },
          { name: "background_overlay", label: "Kegelapan overlay (0-1)", type: "number", step: 0.05, hidden: (v) => !v.background_image },
          { name: "background_blur", label: "Blur latar", type: "number", suffix: "px", hidden: (v) => !v.background_image },
        ]}
      >
        {(v, set) => (
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium">Preset warna</p>
              <div className="grid grid-cols-3 gap-2">
                {THEME_PRESETS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => {
                      set("preset", p.key);
                      set("primary_color", p.primary);
                      set("accent_color", p.accent);
                    }}
                    className={cn("rounded-xl border p-2 text-left text-xs transition-all hover:border-primary", v.preset === p.key && "ring-2 ring-primary")}
                  >
                    <span className="mb-1.5 block h-6 rounded-md" style={{ background: `linear-gradient(120deg, ${p.primary}, ${p.accent})` }} />
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            <ThemePreview v={v} />
          </div>
        )}
      </SettingsSection>

      <SettingsSection
        settingKey="carousel"
        initial={data.carousel}
        title="Carousel beranda"
        description="Pilih jenis tampilan carousel banner."
        fields={[
          {
            name: "style",
            label: "Jenis carousel",
            type: "select",
            options: [
              { value: "cards", label: "Cards (kartu tengah, samping mengintip)" },
              { value: "slide", label: "Slide penuh" },
              { value: "fade", label: "Fade (memudar)" },
              { value: "split", label: "Split (teks + gambar)" },
            ],
          },
          { name: "height", label: "Tinggi", type: "select", options: [{ value: "sm", label: "Kecil" }, { value: "md", label: "Sedang" }, { value: "lg", label: "Besar" }] },
          { name: "autoplay", label: "Putar otomatis", type: "switch" },
          { name: "interval_ms", label: "Interval", type: "number", suffix: "ms" },
          { name: "show_indicators", label: "Tampilkan indikator", type: "switch" },
          { name: "show_arrows", label: "Tampilkan panah", type: "switch" },
        ]}
      />
    </div>
  );
}
