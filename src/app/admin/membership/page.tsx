"use client";

import { ActiveDot, Pill } from "@/components/admin/cells";
import { CrudPage } from "@/components/admin/crud-page";
import { formatRupiah } from "@/lib/format";
import { TAGS } from "@/lib/tags";
import type { MembershipLevel } from "@/lib/types";

export default function MembershipAdminPage() {
  return (
    <CrudPage<MembershipLevel>
      title="Membership & Reseller"
      description="Setiap level memakai margin keuntungannya sendiri (persentase). Harga member = harga modal + margin level, tidak pernah lebih mahal dari harga publik."
      singular="Level"
      endpoint="/admin/membership-levels"
      revalidate={[TAGS.levels, TAGS.catalog]}
      defaults={{ name: "", slug: "", kind: "member", description: "", price: 0, margin_percent: 3, benefits: [], badge_color: "#8b5cf6", sort_order: 0, is_active: true }}
      fields={[
        { name: "name", label: "Nama level", type: "text", required: true },
        { name: "kind", label: "Jenis", type: "select", options: [{ value: "member", label: "Member" }, { value: "reseller", label: "Reseller" }] },
        { name: "margin_percent", label: "Margin keuntungan", type: "number", step: 0.01, suffix: "%", description: "Margin yang diambil dari harga modal untuk level ini" },
        { name: "price", label: "Harga upgrade (Rp)", type: "number" },
        { name: "badge_color", label: "Warna badge", type: "color" },
        { name: "sort_order", label: "Urutan", type: "number" },
        { name: "description", label: "Deskripsi", type: "textarea" },
        { name: "benefits", label: "Benefit (satu per baris)", type: "tags" },
        { name: "is_active", label: "Aktif", type: "switch" },
      ]}
      nameOf={(l) => l.name}
      columns={[
        { header: "Level", cell: (l) => <span className="inline-flex items-center gap-2 font-semibold"><span className="size-3 rounded-full" style={{ backgroundColor: l.badge_color }} />{l.name}</span> },
        { header: "Jenis", cell: (l) => <Pill className="capitalize">{l.kind}</Pill> },
        { header: "Margin", cell: (l) => `${l.margin_percent}%` },
        { header: "Harga upgrade", cell: (l) => formatRupiah(l.price) },
        { header: "Status", cell: (l) => <ActiveDot active={l.is_active} /> },
      ]}
    />
  );
}
