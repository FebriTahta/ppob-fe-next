"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PageMeta } from "@/lib/types";

export function SimplePagination({ meta, onPage }: { meta?: PageMeta; onPage: (p: number) => void }) {
  if (!meta || meta.total_pages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-muted-foreground">
        Halaman {meta.page} dari {meta.total_pages} · {meta.total} data
      </span>
      <div className="flex gap-1">
        <Button variant="outline" size="icon-sm" disabled={meta.page <= 1} onClick={() => onPage(meta.page - 1)} aria-label="Sebelumnya">
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="icon-sm" disabled={meta.page >= meta.total_pages} onClick={() => onPage(meta.page + 1)} aria-label="Berikutnya">
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
