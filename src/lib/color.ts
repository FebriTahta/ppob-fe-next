/** Returns black or white text for readable contrast on the given hex background. */
export function readableOn(hex: string) {
  const h = hex.replace("#", "");
  if (h.length < 6) return "#ffffff";
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.45 ? "#0b0b14" : "#ffffff";
}

export const isHexColor = (v: string) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v);

export const THEME_PRESETS: { key: string; name: string; primary: string; accent: string }[] = [
  { key: "cyber", name: "Cyber Violet", primary: "#7c3aed", accent: "#06b6d4" },
  { key: "aurora", name: "Aurora", primary: "#10b981", accent: "#3b82f6" },
  { key: "sunset", name: "Sunset", primary: "#f97316", accent: "#ec4899" },
  { key: "neon", name: "Neon Pink", primary: "#ec4899", accent: "#8b5cf6" },
  { key: "ocean", name: "Ocean", primary: "#0ea5e9", accent: "#22d3ee" },
  { key: "gold", name: "Royal Gold", primary: "#eab308", accent: "#f97316" },
];
