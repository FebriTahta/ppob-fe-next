"use client";

import { ActiveDot, Pill } from "@/components/admin/cells";
import { CrudPage } from "@/components/admin/crud-page";
import { TAGS } from "@/lib/tags";
import type { FAQ } from "@/lib/types";

export default function FaqsPage() {
  return (
    <CrudPage<FAQ>
      title="FAQ"
      description="Pertanyaan yang tampil di halaman FAQ, dikelompokkan per kategori."
      singular="FAQ"
      endpoint="/admin/faqs"
      revalidate={[TAGS.faqs]}
      defaults={{ question: "", answer: "", category: "Umum", sort_order: 0, is_active: true }}
      fields={[
        { name: "question", label: "Pertanyaan", type: "text", required: true, span: 2 },
        { name: "answer", label: "Jawaban", type: "textarea", required: true },
        { name: "category", label: "Kategori", type: "text" },
        { name: "sort_order", label: "Urutan", type: "number" },
        { name: "is_active", label: "Aktif", type: "switch" },
      ]}
      nameOf={() => "FAQ ini"}
      columns={[
        { header: "Pertanyaan", cell: (f) => <span className="font-medium">{f.question}</span> },
        { header: "Kategori", cell: (f) => <Pill>{f.category}</Pill> },
        { header: "Status", cell: (f) => <ActiveDot active={f.is_active} /> },
      ]}
    />
  );
}
