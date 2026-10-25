const idr = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("id-ID");

export const formatRupiah = (v: number) => idr.format(v).replace(/\s/g, "");
export const formatNumber = (v: number) => num.format(v);

const dateTime = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

export const formatDateTime = (iso: string | null | undefined) => (iso ? dateTime.format(new Date(iso)) : "-");

export const discountPercent = (price: number, regular: number) =>
  regular > price && regular > 0 ? Math.round(((regular - price) / regular) * 100) : 0;

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function whatsappLink(number: string, message: string) {
  const n = number.replace(/\D/g, "").replace(/^0/, "62");
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}
