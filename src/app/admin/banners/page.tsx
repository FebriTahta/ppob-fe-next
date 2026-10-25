"use client";

import { ActiveDot, Thumb } from "@/components/admin/cells";
import { CrudPage } from "@/components/admin/crud-page";
import type { FieldDef } from "@/components/admin/schema-form";
import { TAGS } from "@/lib/tags";
import type { Banner } from "@/lib/types";

const fields: FieldDef[] = [
  { name: "image_url", label: "Gambar (rasio 16:6 disarankan)", type: "image", aspect: "wide", required: true },
  { name: "title", label: "Judul", type: "text" },
  { name: "cta_label", label: "Label tombol", type: "text", placeholder: "Top Up Sekarang" },
  { name: "subtitle", label: "Subjudul", type: "textarea" },
  { name: "link_url", label: "Link tujuan", type: "text", placeholder: "/game/mobile-legends" },
  { name: "sort_order", label: "Urutan", type: "number" },
  { name: "is_active", label: "Aktif", type: "switch" },
];

export default function BannersPage() {
  return (
    <CrudPage<Banner>
      title="Banner Carousel"
      description="Banner yang tampil di carousel beranda. Gaya carousel diatur di menu Tampilan & Tema."
      singular="Banner"
      endpoint="/admin/banners"
      revalidate={[TAGS.banners]}
      defaults={{ title: "", subtitle: "", image_url: "", link_url: "", cta_label: "", sort_order: 0, is_active: true }}
      fields={fields}
      nameOf={(b) => b.title || "banner"}
      columns={[
        { header: "Banner", cell: (b) => <div className="flex items-center gap-3"><Thumb name={b.title || "Banner"} src={b.image_url} wide /><div><p className="font-medium">{b.title || "(tanpa judul)"}</p><p className="max-w-xs truncate text-xs text-muted-foreground">{b.subtitle}</p></div></div> },
        { header: "Link", cell: (b) => <span className="text-xs text-muted-foreground">{b.link_url || "-"}</span> },
        { header: "Urutan", cell: (b) => b.sort_order },
        { header: "Status", cell: (b) => <ActiveDot active={b.is_active} /> },
      ]}
    />
  );
}
