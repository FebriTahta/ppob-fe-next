import { isHexColor, readableOn } from "@/lib/color";
import type { ThemeSettings } from "@/lib/types";

/** Injects admin-configured brand colors & radius as CSS variables (server-rendered, no flash). */
export function ThemeStyle({ theme }: { theme: ThemeSettings }) {
  const primary = isHexColor(theme.primary_color) ? theme.primary_color : "#7c3aed";
  const accent = isHexColor(theme.accent_color) ? theme.accent_color : "#06b6d4";
  const radius = Math.min(Math.max(Number(theme.radius) || 0.9, 0), 2);
  const css = `:root{--brand:${primary};--brand-2:${accent};--brand-foreground:${readableOn(primary)};--radius:${radius}rem}`;
  return <style id="theme-vars" dangerouslySetInnerHTML={{ __html: css }} />;
}
