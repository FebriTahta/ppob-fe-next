"use client";

import { ActiveDot, Pill } from "@/components/admin/cells";
import { CrudPage } from "@/components/admin/crud-page";
import { type FlashItemDraft, FlashItemsEditor } from "@/components/admin/flash-items-editor";
import { formatDateTime } from "@/lib/format";
import { TAGS } from "@/lib/tags";

type FlashSaleRow = {
  id: number; name: string; starts_at: string; ends_at: string; is_active: boolean;
  items: { product_id: number; product_name: string; discount_type: "percent" | "fixed"; discount_value: number; quota: number; sold: number }[];
};

function statusOf(f: FlashSaleRow) {
  const now = Date.now();
  if (!f.is_active) return { label: "Nonaktif", cls: "" };
  if (now < new Date(f.starts_at).getTime()) return { label: "Terjadwal", cls: "bg-sky-500/15 text-sky-500" };
  if (now > new Date(f.ends_at).getTime()) return { label: "Selesai", cls: "" };
  return { label: "Berjalan", cls: "bg-emerald-500/15 text-emerald-500" };
}

export default function FlashSalesPage() {
  return (
    <CrudPage<FlashSaleRow>
      title="Flash Sale"
      description="Diskon berbatas waktu & kuota. Harga flash dihitung dari harga publik; pembeli selalu mendapat harga terendah."
      singular="Flash Sale"
      endpoint="/admin/flash-sales"
      revalidate={[TAGS.flash, TAGS.catalog]}
      wideForm
      defaults={() => {
        const now = Date.now();
        return { name: "", starts_at: new Date(now).toISOString(), ends_at: new Date(now + 86_400_000).toISOString(), is_active: true, items: [] };
      }}
      toForm={(f) => ({ ...f, items: f.items.map((i) => ({ ...i })) as FlashItemDraft[] })}
      toPayload={(v) => ({
        ...v,
        items: ((v.items as FlashItemDraft[]) ?? []).map(({ product_id, discount_type, discount_value, quota }) => ({ product_id, discount_type, discount_value, quota })),
      })}
      fields={[
        { name: "name", label: "Nama kampanye", type: "text", required: true, span: 2 },
        { name: "starts_at", label: "Mulai", type: "datetime", required: true },
        { name: "ends_at", label: "Berakhir", type: "datetime", required: true },
        { name: "items", label: "Produk flash sale", type: "custom", render: (v, onChange) => <FlashItemsEditor value={v} onChange={onChange} /> },
        { name: "is_active", label: "Aktif", type: "switch" },
      ]}
      nameOf={(f) => f.name}
      columns={[
        { header: "Kampanye", cell: (f) => <span className="font-semibold">{f.name}</span> },
        { header: "Periode", cell: (f) => <span className="text-xs">{formatDateTime(f.starts_at)} → {formatDateTime(f.ends_at)}</span> },
        { header: "Produk", cell: (f) => `${f.items.length} item · terjual ${f.items.reduce((n, i) => n + i.sold, 0)}` },
        { header: "Status", cell: (f) => { const s = statusOf(f); return s.label === "Nonaktif" ? <ActiveDot active={false} /> : <Pill className={s.cls}>{s.label}</Pill>; } },
      ]}
    />
  );
}
