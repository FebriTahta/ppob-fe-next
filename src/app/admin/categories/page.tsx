"use client";

import { useState } from "react";
import { ActiveDot, Pill, Thumb } from "@/components/admin/cells";
import { CrudPage } from "@/components/admin/crud-page";
import { InputFieldsEditor } from "@/components/admin/input-fields-editor";
import { useOptions } from "@/components/admin/use-options";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { CATEGORY_TYPES, categoryTypeLabel } from "@/lib/constants";
import { TAGS } from "@/lib/tags";
import type { Category } from "@/lib/types";

export default function CategoriesPage() {
  const providers = useOptions<{ id: number; name: string }>("/admin/providers", (s) => s.name);
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const search = useDebounce(q);

  return (
    <CrudPage<Category>
      title="Kategori / Game"
      description="Setiap kategori menentukan alur pembelian (top up ID, voucher, via login, karakter PB, TCG, PPOB) dan data yang diminta dari pembeli."
      singular="Kategori"
      endpoint="/admin/categories"
      query={{ q: search, type: type === "all" ? undefined : type, status: status === "all" ? undefined : status }}
      revalidate={[TAGS.catalog]}
      wideForm
      toolbar={
        <>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari kategori…" className="h-9 w-56" />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-9 w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua tipe</SelectItem>
              {CATEGORY_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
      defaults={{ name: "", slug: "", type: "game_topup", publisher: "", description: "", instructions: "", image_url: "", banner_url: "", input_fields: [], provider_id: null, margin_percent: null, is_popular: false, sort_order: 0, is_active: true }}
      fields={[
        { name: "name", label: "Nama", type: "text", required: true },
        { name: "slug", label: "Slug URL", type: "text", description: "Kosongkan untuk otomatis" },
        { name: "type", label: "Tipe", type: "select", options: CATEGORY_TYPES.map((t) => ({ value: t.value, label: t.label })) },
        { name: "publisher", label: "Publisher", type: "text" },
        { name: "provider_id", label: "Provider", type: "select", options: providers, numeric: true, nullable: true, placeholder: "Default otomatis", description: "Top up/voucher/PPOB memakai provider default jika kosong; tipe lain diproses manual" },
        { name: "margin_percent", label: "Margin kategori", type: "number", step: 0.01, nullable: true, suffix: "%", description: "Kosongkan untuk memakai margin default" },
        { name: "image_url", label: "Ikon / gambar", type: "image" },
        { name: "banner_url", label: "Banner halaman", type: "image", aspect: "wide" },
        { name: "description", label: "Deskripsi", type: "textarea" },
        { name: "instructions", label: "Cara pembelian", type: "textarea" },
        { name: "input_fields", label: "Data yang diminta dari pembeli", type: "custom", render: (v, onChange) => <InputFieldsEditor value={v} onChange={onChange} /> },
        { name: "sort_order", label: "Urutan", type: "number" },
        { name: "is_popular", label: "Tampilkan di Populer", type: "switch" },
        { name: "is_active", label: "Aktif", type: "switch" },
      ]}
      nameOf={(c) => c.name}
      columns={[
        { header: "Kategori", cell: (c) => <div className="flex items-center gap-3"><Thumb name={c.name} src={c.image_url} /><div><p className="font-semibold">{c.name}</p><p className="text-xs text-muted-foreground">/{c.slug}</p></div></div> },
        { header: "Tipe", cell: (c) => <Pill>{categoryTypeLabel(c.type)}</Pill> },
        { header: "Produk", cell: (c) => c.product_count ?? 0 },
        { header: "Margin", cell: (c) => (c.margin_percent === null ? <span className="text-muted-foreground">default</span> : `${c.margin_percent}%`) },
        { header: "Status", cell: (c) => <div className="flex flex-col gap-1"><ActiveDot active={c.is_active} />{c.is_popular && <Pill className="bg-amber-500/15 text-amber-500">Populer</Pill>}</div> },
      ]}
    />
  );
}
