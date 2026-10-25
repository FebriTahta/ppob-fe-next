"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { api } from "@/lib/api/client";
import { formatRupiah } from "@/lib/format";

export type FlashItemDraft = { product_id: number; product_name: string; discount_type: "percent" | "fixed"; discount_value: number; quota: number; sold?: number };
type ProductHit = { id: number; name: string; sell_price: number; category_id: number };

/** Picks products for a flash sale and sets each discount & quota. */
export function FlashItemsEditor({ value, onChange }: { value: unknown; onChange: (v: FlashItemDraft[]) => void }) {
  const items = (Array.isArray(value) ? value : []) as FlashItemDraft[];
  const [q, setQ] = useState("");
  const term = useDebounce(q, 300);
  const { data } = useQuery({
    queryKey: ["admin", "/admin/products", "flash-search", term],
    queryFn: () => api.paginated<ProductHit>("/admin/products", { q: term, per_page: 8 }),
    enabled: term.length >= 2,
  });
  const update = (i: number, patch: Partial<FlashItemDraft>) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari produk untuk ditambahkan (min. 2 huruf)…" className="h-9" />
        {term.length >= 2 && !!data?.data.length && (
          <ul className="absolute inset-x-0 top-10 z-10 max-h-56 overflow-auto rounded-xl border bg-popover p-1 shadow-xl">
            {data.data.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  disabled={items.some((i) => i.product_id === p.id)}
                  onClick={() => {
                    onChange([...items, { product_id: p.id, product_name: p.name, discount_type: "percent", discount_value: 10, quota: 0 }]);
                    setQ("");
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm hover:bg-muted disabled:opacity-40"
                >
                  <span>{p.name}</span>
                  <span className="text-xs text-muted-foreground">{formatRupiah(p.sell_price)}</span>
                  <Plus className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {items.length === 0 && <p className="text-sm text-muted-foreground">Belum ada produk.</p>}
      {items.map((it, i) => (
        <div key={it.product_id} className="grid items-center gap-2 rounded-xl border p-3 sm:grid-cols-[1fr_130px_110px_100px_auto]">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{it.product_name}</p>
            {it.sold !== undefined && <p className="text-xs text-muted-foreground">Terjual {it.sold}</p>}
          </div>
          <Select value={it.discount_type} onValueChange={(v) => update(i, { discount_type: v as FlashItemDraft["discount_type"] })}>
            <SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="percent">Persen</SelectItem>
              <SelectItem value="fixed">Nominal</SelectItem>
            </SelectContent>
          </Select>
          <Input type="number" value={it.discount_value} onChange={(e) => update(i, { discount_value: Number(e.target.value) })} className="h-8" aria-label="Nilai diskon" />
          <Input type="number" value={it.quota} onChange={(e) => update(i, { quota: Number(e.target.value) })} className="h-8" aria-label="Kuota" placeholder="Kuota" />
          <Button type="button" variant="ghost" size="icon-sm" className="text-destructive" onClick={() => onChange(items.filter((_, idx) => idx !== i))} aria-label="Hapus">
            <Trash2 />
          </Button>
        </div>
      ))}
      {items.length > 0 && <p className="text-xs text-muted-foreground">Kolom: tipe diskon · nilai · kuota (0 = tanpa batas)</p>}
    </div>
  );
}
