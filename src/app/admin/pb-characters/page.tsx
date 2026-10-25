"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActiveDot, Pill, Thumb } from "@/components/admin/cells";
import { CrudPage } from "@/components/admin/crud-page";
import type { Values } from "@/components/admin/schema-form";
import { useAdminSettings } from "@/components/admin/settings/use-settings";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { api } from "@/lib/api/client";
import { RankIcon } from "@/components/shared/rank-icon";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { TAGS } from "@/lib/tags";
import type { Category, PBRank } from "@/lib/types";

/** A Point Blank character listing: one unique item, sold once. Stored as a product of a pb_character category. */
type Character = {
  id: number;
  category_id: number;
  name: string;
  image_url: string;
  base_price: number;
  strike_price: number;
  sell_price: number;
  stock: number | null;
  character_detail: string;
  rank_id: number | null;
  description: string;
  is_active: boolean;
  is_sold: boolean;
  sold_at: string | null;
};

const ALL = "all";

/**
 * The form edits "harga normal" + "diskon %"; they are stored as strike_price (crossed-out price)
 * and base_price (price after discount, the selling price since listings use margin 0).
 */
const afterDiscount = (normal: number, pct: number) => Math.max(0, Math.round(normal * (1 - Math.min(Math.max(pct, 0), 99) / 100)));

/** Same rounding the backend applies to selling prices (Pengaturan → Harga & Transaksi). */
const roundUp = (v: number, step: number) => (step > 1 && v % step !== 0 ? v + step - (v % step) : v);

function toForm(c: Character): Values {
  const hasDiscount = c.strike_price > c.base_price;
  return {
    ...c,
    normal_price: hasDiscount ? c.strike_price : c.base_price,
    discount_percent: hasDiscount ? Math.round(((c.strike_price - c.base_price) / c.strike_price) * 10000) / 100 : 0,
  };
}

function toPayload({ normal_price, discount_percent, ...v }: Values): Values {
  const normal = Number(normal_price) || 0;
  const pct = Number(discount_percent) || 0;
  const price = afterDiscount(normal, pct);
  return { ...v, base_price: price, strike_price: pct > 0 && price < normal ? normal : 0 };
}

function PricePreview({ values, roundTo }: { values: Values; roundTo: number }) {
  const normal = Number(values.normal_price) || 0;
  const pct = Number(values.discount_percent) || 0;
  const final = roundUp(afterDiscount(normal, pct), roundTo);
  const shownPct = normal > 0 && final < normal ? Math.round(((normal - final) / normal) * 100) : 0;
  if (normal <= 0) return <p className="text-sm text-muted-foreground">Isi harga normal untuk melihat preview.</p>;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border bg-muted/30 px-4 py-3">
      <div>
        <p className="text-[11px] text-muted-foreground">Sebelum diskon</p>
        <p className={shownPct > 0 ? "text-sm text-muted-foreground line-through tabular-nums" : "text-sm font-semibold tabular-nums"}>{formatRupiah(normal)}</p>
      </div>
      <span className="text-muted-foreground">→</span>
      <div>
        <p className="text-[11px] text-muted-foreground">Setelah diskon (dibayar pembeli)</p>
        <p className="font-heading text-lg font-bold text-primary tabular-nums">{formatRupiah(final)}</p>
      </div>
      {shownPct > 0 && <Pill className="bg-red-500/15 text-red-600 dark:text-red-400">-{shownPct}%</Pill>}
      {shownPct > 0 && <p className="w-full text-[11px] text-muted-foreground">Hemat {formatRupiah(normal - final)}{roundTo > 1 && ` · dibulatkan ke atas per Rp${roundTo}`}</p>}
    </div>
  );
}

export default function PBCharactersPage() {
  const { data: categories = [] } = useQuery({
    queryKey: ["admin", "/admin/categories", { type: "pb_character" }, 0, "options"],
    queryFn: () => api.get<Category[]>("/admin/categories", { type: "pb_character" }),
    staleTime: 60_000,
  });
  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));
  const { data: ranks = [] } = useQuery({
    queryKey: ["admin", "/admin/pb-ranks", {}, 0, "options"],
    queryFn: () => api.get<PBRank[]>("/admin/pb-ranks"),
    staleTime: 60_000,
  });
  const rankById = new Map(ranks.map((k) => [k.id, k]));
  const rankOptions = ranks.map((k) => ({ value: String(k.id), label: k.name, icon: <RankIcon rank={k} className="size-5" /> }));
  const [q, setQ] = useState("");
  const [sold, setSold] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const search = useDebounce(q);
  const roundTo = useAdminSettings().data?.pricing?.round_to ?? 1;

  return (
    <CrudPage<Character>
      title="Karakter Point Blank"
      description="Setiap pembelian mengurangi stok (1 karakter per pesanan). Saat stok habis dan pesanan dibayar, karakter otomatis ditandai terjual dan hilang dari toko."
      singular="Karakter"
      endpoint="/admin/products"
      paginated
      wideForm
      query={{ type: "pb_character", q: search, sold: sold === ALL ? undefined : sold, status: status === ALL ? undefined : status }}
      revalidate={[TAGS.catalog]}
      toForm={toForm}
      toPayload={toPayload}
      toolbar={
        <>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama / detail karakter…" className="h-9 w-64" />
          <Select value={sold} onValueChange={setSold}>
            <SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Semua penjualan</SelectItem>
              <SelectItem value="no">Belum terjual</SelectItem>
              <SelectItem value="yes">Terjual</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Semua status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
      defaults={() => ({
        category_id: categories[0]?.id ?? null,
        name: "",
        normal_price: 0,
        discount_percent: 0,
        image_url: "",
        character_detail: "",
        rank_id: null,
        description: "",
        is_active: true,
        is_sold: false,
        // Fixed for unique listings (the backend enforces these too).
        provider_id: null,
        sku: "",
        margin_percent: 0,
        strike_price: 0,
        stock: 1,
        max_qty: 1,
        is_preorder: false,
        preorder_note: "",
        badge: "",
        sort_order: 0,
      })}
      fields={[
        { name: "category_id", label: "Kategori", type: "select", options: categoryOptions, numeric: true, required: true, description: "Kategori bertipe Karakter Point Blank" },
        { name: "normal_price", label: "Harga normal (Rp)", type: "number", required: true, description: "Harga sebelum diskon" },
        { name: "discount_percent", label: "Diskon", type: "number", step: 0.01, suffix: "%", description: "0 = tanpa diskon (maks. 99%)" },
        { name: "price_preview", label: "Preview harga", type: "custom", span: 2, render: (_v, _onChange, values) => <PricePreview values={values} roundTo={roundTo} /> },
        { name: "stock", label: "Stok", type: "number", required: true, description: "Jumlah karakter yang tersedia" },
        {
          name: "rank_id",
          label: "Pangkat",
          type: "select",
          options: rankOptions,
          numeric: true,
          required: true,
          searchable: true,
          placeholder: "Pilih pangkat",
          description: ranks.length
            ? "Karakter ditampilkan dengan ikon & nama pangkat ini (dipakai juga sebagai nama di invoice)"
            : "Tambahkan pangkat dulu di menu Pangkat Point Blank",
        },
        { name: "image_url", label: "Gambar", type: "image" },
        { name: "character_detail", label: "Detail karakter", type: "textarea", required: true, span: 2, description: "Rank, karakter/senjata yang dimiliki, item permanen, dll." },
        { name: "description", label: "Detail produk", type: "textarea", span: 2, description: "Garansi, cara pengiriman, syarat & ketentuan, dll." },
        { name: "is_active", label: "Aktif", type: "switch", description: "Nonaktif = disembunyikan dari toko" },
        { name: "is_sold", label: "Terjual", type: "switch", description: "Otomatis menyala saat stok habis terjual. Menyalakan = stok jadi 0; isi stok > 0 untuk menjual lagi" },
      ]}
      nameOf={(c) => (c.rank_id && rankById.get(c.rank_id)?.name) || c.name}
      columns={[
        {
          header: "Karakter",
          cell: (c) => (
            <div className="flex max-w-md items-center gap-3">
              {(() => {
                const rank = c.rank_id ? rankById.get(c.rank_id) : undefined;
                return rank ? <RankIcon rank={rank} className="size-10" /> : <Thumb name={c.name} src={c.image_url} />;
              })()}
              <div className="min-w-0">
                <p className="font-semibold">
                  {(c.rank_id && rankById.get(c.rank_id)?.name) || <span className="text-amber-600 dark:text-amber-400">Belum ada pangkat · {c.name}</span>}
                </p>
                <p className="line-clamp-2 text-xs whitespace-pre-line text-muted-foreground">{c.character_detail || "-"}</p>
              </div>
            </div>
          ),
        },
        {
          header: "Harga",
          cell: (c) => {
            const pct = c.strike_price > c.sell_price ? Math.round(((c.strike_price - c.sell_price) / c.strike_price) * 100) : 0;
            return (
              <div className="flex flex-col">
                {pct > 0 && (
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    <span className="line-through">{formatRupiah(c.strike_price)}</span> <span className="text-red-500">-{pct}%</span>
                  </span>
                )}
                <span className="font-semibold tabular-nums">{formatRupiah(c.sell_price)}</span>
              </div>
            );
          },
        },
        {
          header: "Stok",
          cell: (c) => <span className={(c.stock ?? 0) > 0 ? "tabular-nums" : "text-muted-foreground tabular-nums"}>{c.stock ?? 0}</span>,
        },
        { header: "Status", cell: (c) => <ActiveDot active={c.is_active} /> },
        {
          header: "Penjualan",
          cell: (c) =>
            c.is_sold ? (
              <div className="flex flex-col gap-0.5">
                <Pill className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">Terjual</Pill>
                {c.sold_at && <span className="text-[11px] text-muted-foreground">{formatDateTime(c.sold_at)}</span>}
              </div>
            ) : (
              <Pill>Belum terjual</Pill>
            ),
        },
      ]}
    />
  );
}
