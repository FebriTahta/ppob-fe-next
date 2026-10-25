"use client";

import { CrudPage } from "@/components/admin/crud-page";
import { RankIcon } from "@/components/shared/rank-icon";
import { TAGS } from "@/lib/tags";
import type { PBRank } from "@/lib/types";

export default function PBRanksPage() {
  return (
    <CrudPage<PBRank>
      title="Pangkat Point Blank"
      description="Daftar pangkat beserta ikonnya. Pangkat dipilih di setiap karakter dan ikonnya tampil langsung di toko."
      singular="Pangkat"
      endpoint="/admin/pb-ranks"
      revalidate={[TAGS.catalog]}
      defaults={{ name: "", image_url: "", sort_order: 0 }}
      fields={[
        { name: "name", label: "Nama pangkat", type: "text", required: true, placeholder: "Contoh: Bintang 5 / Mayor / Jenderal" },
        { name: "sort_order", label: "Urutan", type: "number", description: "Urut dari pangkat terendah ke tertinggi" },
        { name: "image_url", label: "Ikon pangkat", type: "image", span: 2 },
      ]}
      nameOf={(k) => k.name}
      columns={[
        {
          header: "Pangkat",
          cell: (k) => (
            <div className="flex items-center gap-3">
              <RankIcon rank={k} className="size-10" />
              <p className="font-semibold">{k.name}</p>
            </div>
          ),
        },
        { header: "Urutan", cell: (k) => <span className="tabular-nums">{k.sort_order}</span> },
        { header: "Dipakai", cell: (k) => <span className="tabular-nums">{k.character_count} karakter</span> },
      ]}
    />
  );
}
