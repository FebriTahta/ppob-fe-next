"use client";

import { useState } from "react";
import { BulkMarginDialog } from "@/components/admin/bulk-margin-dialog";
import { ActiveDot, Pill } from "@/components/admin/cells";
import { CrudPage } from "@/components/admin/crud-page";
import { useOptions } from "@/components/admin/use-options";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { formatRupiah } from "@/lib/format";
import { TAGS } from "@/lib/tags";
import type { Category } from "@/lib/types";

type AdminProduct = {
  id: number; category_id: number; provider_id: number | null; name: string; sku: string; description: string; image_url: string;
  base_price: number; margin_percent: number | null; strike_price: number; stock: number | null; max_qty: number; is_preorder: boolean;
  preorder_note: string; badge: string; sort_order: number; is_active: boolean; sell_price: number; effective_margin: number; profit: number;
};

export default function ProductsPage() {
  const categories = useOptions<Category>("/admin/categories", (c) => c.name);
  const providers = useOptions<{ id: number; name: string }>("/admin/providers", (s) => s.name);
  const catName = (id: number) => categories.find((c) => c.value === String(id))?.label ?? "-";
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const search = useDebounce(q);

  return (
    <CrudPage<AdminProduct>
      title="Produk & Harga"
      description="Harga jual = harga modal + margin (produk → kategori → default), dibulatkan sesuai pengaturan harga."
      singular="Produk"
      endpoint="/admin/products"
      paginated
      query={{ q: search, category_id: cat === "all" ? undefined : cat }}
      revalidate={[TAGS.catalog, TAGS.flash]}
      toolbar={
        <>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama / SKU…" className="h-9 w-56" />
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="h-9 w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua kategori</SelectItem>
              {categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <BulkMarginDialog categories={categories} />
        </>
      }
      defaults={{ category_id: cat === "all" ? null : Number(cat), provider_id: null, name: "", sku: "", description: "", image_url: "", base_price: 0, margin_percent: null, strike_price: 0, stock: null, max_qty: 1, is_preorder: false, preorder_note: "", badge: "", sort_order: 0, is_active: true }}
      fields={[
        { name: "category_id", label: "Kategori", type: "select", options: categories, numeric: true, required: true, searchable: true },
        { name: "name", label: "Nama produk", type: "text", required: true },
        { name: "sku", label: "SKU provider", type: "text", description: "Kode produk di provider (buyer_sku_code)" },
        { name: "provider_id", label: "Provider khusus", type: "select", options: providers, numeric: true, nullable: true, placeholder: "Ikuti kategori" },
        { name: "base_price", label: "Harga modal (Rp)", type: "number", required: true },
        { name: "margin_percent", label: "Margin produk", type: "number", step: 0.01, nullable: true, suffix: "%" },
        { name: "strike_price", label: "Harga coret (Rp)", type: "number", description: "Opsional, untuk tampilan" },
        { name: "badge", label: "Badge", type: "text", placeholder: "Terlaris / Hemat" },
        { name: "stock", label: "Stok", type: "number", nullable: true, description: "Kosongkan = tidak terbatas" },
        { name: "max_qty", label: "Maks. jumlah per order", type: "number", description: "Untuk TCG bisa > 1 (karakter PB selalu 1)" },
        { name: "is_preorder", label: "Pre-order", type: "switch" },
        { name: "preorder_note", label: "Catatan pre-order", type: "text", hidden: (v) => !v.is_preorder },
        { name: "image_url", label: "Gambar", type: "image" },
        { name: "description", label: "Deskripsi", type: "textarea" },
        { name: "sort_order", label: "Urutan", type: "number" },
        { name: "is_active", label: "Aktif", type: "switch" },
      ]}
      nameOf={(p) => p.name}
      columns={[
        { header: "Produk", cell: (p) => <div><p className="font-semibold">{p.name}</p><p className="text-xs text-muted-foreground">{catName(p.category_id)} · {p.sku || "tanpa SKU"}</p></div> },
        { header: "Modal", cell: (p) => <span className="tabular-nums">{formatRupiah(p.base_price)}</span> },
        { header: "Margin", cell: (p) => <Pill className={p.margin_percent === null ? "" : "bg-primary/15 text-primary"}>{p.effective_margin}%</Pill> },
        { header: "Harga jual", cell: (p) => <span className="font-semibold tabular-nums">{formatRupiah(p.sell_price)}</span> },
        { header: "Profit", cell: (p) => <span className="text-emerald-500 tabular-nums">{formatRupiah(p.profit)}</span> },
        { header: "Stok", cell: (p) => (p.stock === null ? "∞" : p.stock) },
        { header: "Status", cell: (p) => <div className="flex flex-col gap-1"><ActiveDot active={p.is_active} />{p.is_preorder && <Pill className="bg-amber-500/15 text-amber-500">PO</Pill>}</div> },
      ]}
    />
  );
}
