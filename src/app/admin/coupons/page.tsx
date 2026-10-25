"use client";

import { ActiveDot, Pill } from "@/components/admin/cells";
import { CrudPage } from "@/components/admin/crud-page";
import { useOptions } from "@/components/admin/use-options";
import { formatDateTime, formatRupiah } from "@/lib/format";
import type { Category } from "@/lib/types";

type Coupon = {
  id: number; code: string; description: string; discount_type: "percent" | "fixed"; discount_value: number; max_discount: number;
  min_purchase: number; quota: number; used: number; per_user_limit: number; category_id: number | null; starts_at: string | null;
  ends_at: string | null; is_active: boolean;
};

export default function CouponsPage() {
  const categories = useOptions<Category>("/admin/categories", (c) => c.name);
  return (
    <CrudPage<Coupon>
      title="Kupon Promo"
      description="Kode diskon yang bisa dipakai pelanggan saat checkout."
      singular="Kupon"
      endpoint="/admin/coupons"
      defaults={{ code: "", description: "", discount_type: "percent", discount_value: 10, max_discount: 0, min_purchase: 0, quota: 0, per_user_limit: 0, category_id: null, starts_at: null, ends_at: null, is_active: true }}
      fields={[
        { name: "code", label: "Kode", type: "text", required: true, placeholder: "HEMAT10" },
        { name: "discount_type", label: "Tipe diskon", type: "select", options: [{ value: "percent", label: "Persen (%)" }, { value: "fixed", label: "Nominal (Rp)" }] },
        { name: "discount_value", label: "Nilai diskon", type: "number", step: 0.01, required: true },
        { name: "max_discount", label: "Maks. potongan (Rp)", type: "number", description: "0 = tanpa batas" },
        { name: "min_purchase", label: "Min. pembelian (Rp)", type: "number" },
        { name: "category_id", label: "Khusus kategori", type: "select", options: categories, numeric: true, nullable: true, placeholder: "Semua kategori" },
        { name: "quota", label: "Kuota total", type: "number", description: "0 = tanpa batas" },
        { name: "per_user_limit", label: "Batas per pengguna", type: "number", description: "0 = tanpa batas" },
        { name: "starts_at", label: "Mulai", type: "datetime", nullable: true },
        { name: "ends_at", label: "Berakhir", type: "datetime", nullable: true },
        { name: "description", label: "Deskripsi", type: "textarea" },
        { name: "is_active", label: "Aktif", type: "switch" },
      ]}
      nameOf={(c) => c.code}
      columns={[
        { header: "Kode", cell: (c) => <div><p className="font-mono font-semibold">{c.code}</p><p className="text-xs text-muted-foreground">{c.description}</p></div> },
        { header: "Diskon", cell: (c) => <Pill>{c.discount_type === "percent" ? `${c.discount_value}%` : formatRupiah(c.discount_value)}</Pill> },
        { header: "Pemakaian", cell: (c) => `${c.used}/${c.quota || "∞"}` },
        { header: "Periode", cell: (c) => <span className="text-xs">{c.starts_at ? formatDateTime(c.starts_at) : "—"} → {c.ends_at ? formatDateTime(c.ends_at) : "—"}</span> },
        { header: "Status", cell: (c) => <ActiveDot active={c.is_active} /> },
      ]}
    />
  );
}
