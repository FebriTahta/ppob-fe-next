"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, CheckCircle2, ChevronDown, Download, PackageSearch, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";
import { Pill } from "@/components/admin/cells";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useDebounce } from "@/hooks/use-debounce";
import { useMounted } from "@/hooks/use-mounted";
import { revalidateStorefront } from "@/lib/actions";
import { api } from "@/lib/api/client";
import { CATEGORY_TYPES } from "@/lib/constants";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { TAGS } from "@/lib/tags";
import type { CategoryType } from "@/lib/types";
import { cn } from "@/lib/utils";

type Item = {
  sku: string;
  name: string;
  brand: string;
  category: string;
  type: string;
  seller: string;
  description: string;
  price: number;
  available: boolean;
  unlimited_stock: boolean;
  stock: number;
  cut_off?: string;
  product_id: number | null;
  category_id: number | null;
};
type Catalog = { items: Item[]; fetched_at: string; cached: boolean; warning?: string };
type CategoryRow = { id: number; name: string; slug: string; type: CategoryType };
type Provider = { id: number; name: string };
type ImportResult = {
  categories_created: number;
  products_created: number;
  products_updated: number;
  skipped: number;
  categories: { id: number; name: string; new: boolean }[];
};

/** Where a group's products go: a new category (created on import) or an existing one. */
type Target = { mode: "new"; name: string; type: CategoryType } | { mode: "existing"; categoryId: string };

type Group = { key: string; brand: string; category: string; items: Item[] };

const ALL = "__all";
const NEW = "__new";

const groupKey = (it: Pick<Item, "category" | "brand">) => `${it.category}::${it.brand}`;

/** Same mapping the backend uses: Games → top up, Voucher → voucher, everything else → PPOB. */
function guessType(category: string): CategoryType {
  const c = category.trim().toLowerCase();
  if (c === "games") return "game_topup";
  if (c === "voucher") return "voucher";
  return "ppob";
}

/** Same rule as the backend slug package, used to match a new category name to an existing category. */
const slugify = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** "TELKOMSEL" → "Telkomsel"; mixed-case names are kept as they are. */
function prettyBrand(brand: string) {
  if (brand !== brand.toUpperCase()) return brand;
  return brand.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}

const PageSkeleton = () => <Skeleton className="h-96 rounded-2xl" />;

export default function ProviderImportPage() {
  // useParams() is runtime URL data; it must sit inside Suspense so the static shell can prerender.
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProviderImport />
    </Suspense>
  );
}

function ProviderImport() {
  const mounted = useMounted();
  const params = useParams<{ id: string }>();
  if (!mounted || !params?.id) return <PageSkeleton />;
  return <ImportScreen providerId={Number(params.id)} />;
}

function ImportScreen({ providerId }: { providerId: number }) {
  const qc = useQueryClient();
  const [refresh, setRefresh] = useState(0);
  const [q, setQ] = useState("");
  const search = useDebounce(q);
  const [category, setCategory] = useState(ALL);
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [hideImported, setHideImported] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [targets, setTargets] = useState<Record<string, Target>>({});
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [updateExisting, setUpdateExisting] = useState(false);
  const [activate, setActivate] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const providers = useQuery({
    queryKey: ["admin", "/admin/providers", {}, 0, "options"],
    queryFn: () => api.get<Provider[]>("/admin/providers"),
    staleTime: 60_000,
  });
  const provider = providers.data?.find((p) => p.id === providerId);

  const catalog = useQuery({
    queryKey: ["admin", "provider-catalog", providerId, refresh],
    queryFn: () => api.get<Catalog>(`/admin/providers/${providerId}/price-list`, { refresh: refresh > 0 ? 1 : undefined }),
    staleTime: Infinity,
    retry: false,
  });

  const categories = useQuery({
    queryKey: ["admin", "/admin/categories", {}, 0, "import"],
    queryFn: () => api.get<CategoryRow[]>("/admin/categories"),
  });
  const categoryName = useMemo(() => new Map((categories.data ?? []).map((c) => [c.id, c.name])), [categories.data]);
  const categoryBySlug = useMemo(() => new Map((categories.data ?? []).map((c) => [c.slug, c])), [categories.data]);

  const items = useMemo(() => catalog.data?.items ?? [], [catalog.data]);
  const bySku = useMemo(() => new Map(items.map((it) => [it.sku, it])), [items]);
  const providerCategories = useMemo(() => [...new Set(items.map((it) => it.category))].sort(), [items]);
  /** Brands sold under several provider categories (e.g. Telkomsel pulsa & data) get the category in their default name. */
  const multiCategoryBrands = useMemo(() => {
    const cats = new Map<string, Set<string>>();
    for (const it of items) cats.set(it.brand, (cats.get(it.brand) ?? new Set()).add(it.category));
    return new Set([...cats].filter(([, s]) => s.size > 1).map(([b]) => b));
  }, [items]);

  const groups = useMemo(() => {
    const s = search.trim().toLowerCase();
    const map = new Map<string, Group>();
    for (const it of items) {
      if (category !== ALL && it.category !== category) continue;
      if (onlyAvailable && !it.available) continue;
      if (hideImported && it.product_id) continue;
      if (s && !`${it.name} ${it.sku} ${it.brand}`.toLowerCase().includes(s)) continue;
      const key = groupKey(it);
      const g = map.get(key) ?? { key, brand: it.brand, category: it.category, items: [] };
      g.items.push(it);
      map.set(key, g);
    }
    for (const g of map.values()) g.items.sort((a, b) => a.price - b.price);
    return [...map.values()].sort((a, b) => a.category.localeCompare(b.category) || a.brand.localeCompare(b.brand));
  }, [items, search, category, onlyAvailable, hideImported]);

  const defaultTarget = (key: string): Target => {
    const [cat, brand] = key.split("::");
    // Brands already imported before default to the category their products live in.
    const existing = items.find((it) => groupKey(it) === key && it.category_id)?.category_id;
    if (existing && categoryName.has(existing)) return { mode: "existing", categoryId: String(existing) };
    const name = multiCategoryBrands.has(brand) ? `${prettyBrand(brand)} ${cat}` : prettyBrand(brand);
    // A category with the same name already exists (e.g. created by hand): import into it, don't duplicate.
    const sameName = categoryBySlug.get(slugify(name));
    if (sameName) return { mode: "existing", categoryId: String(sameName.id) };
    return { mode: "new", name, type: guessType(cat) };
  };
  const targetOf = (key: string) => targets[key] ?? defaultTarget(key);

  const toggle = (skus: string[], on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      for (const sku of skus) {
        if (on) next.add(sku);
        else next.delete(sku);
      }
      return next;
    });

  const selectedGroups = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const sku of selected) {
      const it = bySku.get(sku);
      if (!it) continue;
      const key = groupKey(it);
      map.set(key, [...(map.get(key) ?? []), sku]);
    }
    return map;
  }, [selected, bySku]);
  const selectedExisting = [...selected].filter((sku) => bySku.get(sku)?.product_id).length;

  const visibleSkus = groups.flatMap((g) => g.items.map((it) => it.sku));
  const allVisibleSelected = visibleSkus.length > 0 && visibleSkus.every((sku) => selected.has(sku));

  const runImport = useMutation({
    mutationFn: () => {
      const payload = [...selectedGroups].map(([key, skus]) => {
        const t = targetOf(key);
        return t.mode === "new"
          ? { new_category: { name: t.name.trim(), type: t.type }, skus }
          : { category_id: Number(t.categoryId), skus };
      });
      const invalid = [...selectedGroups.keys()].find((key) => {
        const t = targetOf(key);
        return t.mode === "new" ? !t.name.trim() : !t.categoryId;
      });
      if (invalid) throw new Error(`Lengkapi kategori tujuan untuk ${invalid.split("::")[1]}`);
      return api.post<ImportResult>(`/admin/providers/${providerId}/import`, {
        groups: payload,
        update_existing: updateExisting,
        activate,
      });
    },
    onSuccess: async (r) => {
      setResult(r);
      setSelected(new Set());
      setTargets({});
      toast.success(`${r.products_created} produk baru, ${r.products_updated} diperbarui`);
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["admin", "provider-catalog", providerId] }),
        qc.invalidateQueries({ queryKey: ["admin", "/admin/categories"] }),
        qc.invalidateQueries({ queryKey: ["admin", "/admin/products"] }),
      ]);
      await revalidateStorefront([TAGS.catalog]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (e) => toast.error(e.message),
  });

  const reload = () => setRefresh((n) => n + 1);

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Import Produk${provider ? ` · ${provider.name}` : ""}`}
        description="Pilih produk dari price list provider. Kategori dibuat otomatis per brand, produk dibuat lengkap dengan SKU dan harga modal."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/admin/providers">
                <ArrowLeft /> Provider
              </Link>
            </Button>
            <Button variant="outline" onClick={reload} disabled={catalog.isFetching}>
              <RefreshCw className={catalog.isFetching ? "animate-spin" : undefined} /> Muat ulang price list
            </Button>
          </>
        }
      />

      {result && <ResultCard result={result} onClose={() => setResult(null)} />}

      {catalog.data?.warning && (
        <p className="flex items-start gap-2 rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" /> {catalog.data.warning}
        </p>
      )}

      {catalog.isPending ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : catalog.isError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertTriangle className="size-8 text-amber-500" />
            <div>
              <p className="font-semibold">Price list gagal dimuat</p>
              <p className="text-sm text-muted-foreground">{catalog.error.message}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Digiflazz membatasi frekuensi permintaan price list. Tunggu beberapa menit lalu coba lagi.
              </p>
            </div>
            <Button variant="outline" onClick={reload}>
              <RefreshCw /> Coba lagi
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="flex flex-wrap items-center gap-3 py-4">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama, SKU, atau brand…" className="h-9 w-full sm:w-64" />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-9 w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Semua kategori provider</SelectItem>
                  {providerCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={onlyAvailable} onCheckedChange={setOnlyAvailable} /> Hanya yang tersedia
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={hideImported} onCheckedChange={setHideImported} /> Sembunyikan yang sudah ada
              </label>
              <p className="w-full text-xs text-muted-foreground sm:ml-auto sm:w-auto">
                {items.length} produk · diambil {formatDateTime(catalog.data.fetched_at)}
                {catalog.data.cached && " (cache)"}
              </p>
            </CardContent>
          </Card>

          {groups.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
                <PackageSearch className="size-8" />
                <p className="text-sm">Tidak ada produk yang cocok dengan filter.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center gap-3 px-1 text-sm">
                <Checkbox
                  id="select-all"
                  checked={allVisibleSelected}
                  onCheckedChange={(v) => toggle(visibleSkus, v === true)}
                  aria-label="Pilih semua yang tampil"
                />
                <Label htmlFor="select-all" className="font-normal">
                  Pilih semua yang tampil ({visibleSkus.length} produk dari {groups.length} brand)
                </Label>
              </div>
              <div className="space-y-2">
                {groups.map((g) => (
                  <GroupCard
                    key={g.key}
                    group={g}
                    open={open.has(g.key)}
                    onOpenChange={(v) =>
                      setOpen((prev) => {
                        const next = new Set(prev);
                        if (v) next.add(g.key);
                        else next.delete(g.key);
                        return next;
                      })
                    }
                    selected={selected}
                    onToggle={toggle}
                    target={targetOf(g.key)}
                    onTarget={(t) => setTargets((prev) => ({ ...prev, [g.key]: t }))}
                    categories={categories.data ?? []}
                    categoryName={categoryName}
                    categoryBySlug={categoryBySlug}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {selected.size > 0 && (
        <div className="sticky bottom-0 z-30 -mx-4 border-t bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="text-sm">
              <b>{selected.size}</b> produk dipilih dari <b>{selectedGroups.size}</b> brand
              {selectedExisting > 0 && <span className="text-muted-foreground"> · {selectedExisting} sudah ada</span>}
            </p>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={updateExisting} onCheckedChange={setUpdateExisting} />
              Perbarui produk yang sudah ada
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={activate} onCheckedChange={setActivate} />
              Langsung tampilkan kategori baru
            </label>
            <div className="ml-auto flex gap-2">
              <Button variant="ghost" onClick={() => setSelected(new Set())} disabled={runImport.isPending}>
                Batal
              </Button>
              <Button onClick={() => runImport.mutate()} disabled={runImport.isPending}>
                {runImport.isPending ? <Spinner /> : <Download />}
                Import {selected.size} produk
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GroupCard({
  group,
  open,
  onOpenChange,
  selected,
  onToggle,
  target,
  onTarget,
  categories,
  categoryName,
  categoryBySlug,
}: {
  group: Group;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selected: Set<string>;
  onToggle: (skus: string[], on: boolean) => void;
  target: Target;
  onTarget: (t: Target) => void;
  categories: CategoryRow[];
  categoryName: Map<number, string>;
  categoryBySlug: Map<string, CategoryRow>;
}) {
  const sameName = target.mode === "new" ? categoryBySlug.get(slugify(target.name)) : undefined;
  const skus = group.items.map((it) => it.sku);
  const count = skus.filter((sku) => selected.has(sku)).length;
  const existing = group.items.filter((it) => it.product_id).length;
  const minPrice = group.items[0]?.price ?? 0;
  const maxPrice = group.items.at(-1)?.price ?? 0;

  return (
    <Card className={cn("gap-0 overflow-hidden py-0", count > 0 && "border-primary/50")}>
      <div className="flex items-center gap-3 px-4 py-3">
        <Checkbox checked={count === skus.length} onCheckedChange={(v) => onToggle(skus, v === true)} aria-label={`Pilih semua ${group.brand}`} />
        <button type="button" onClick={() => onOpenChange(!open)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-2 font-semibold">
              {prettyBrand(group.brand)} <Pill>{group.category}</Pill>
              {count > 0 && <Pill className="bg-primary/15 text-primary">{count} dipilih</Pill>}
            </p>
            <p className="text-xs text-muted-foreground">
              {group.items.length} produk · {formatRupiah(minPrice)}
              {maxPrice !== minPrice && ` – ${formatRupiah(maxPrice)}`}
              {existing > 0 && ` · ${existing} sudah ada`}
              {count > 0 && ` · → ${target.mode === "new" ? `kategori baru "${target.name}"` : (categoryName.get(Number(target.categoryId)) ?? "?")}`}
            </p>
          </div>
          <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
        </button>
      </div>

      {open && (
        <div className="border-t">
          <div className="grid gap-3 bg-muted/30 px-4 py-3 sm:grid-cols-[220px_1fr_200px]">
            <div className="space-y-1.5">
              <Label className="text-xs">Masukkan ke</Label>
              <Select
                value={target.mode === "new" ? NEW : target.categoryId}
                onValueChange={(v) =>
                  onTarget(v === NEW ? { mode: "new", name: prettyBrand(group.brand), type: guessType(group.category) } : { mode: "existing", categoryId: v })
                }
              >
                <SelectTrigger className="h-9 w-full bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NEW}>+ Kategori baru</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {target.mode === "new" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs">Nama kategori baru</Label>
                  <Input value={target.name} onChange={(e) => onTarget({ ...target, name: e.target.value })} className="h-9 bg-background" />
                  {sameName && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Kategori &quot;{sameName.name}&quot; sudah ada, produk akan dimasukkan ke kategori itu.
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Tipe</Label>
                  <Select value={target.type} onValueChange={(v) => onTarget({ ...target, type: v as CategoryType })}>
                    <SelectTrigger className="h-9 w-full bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <ul className="divide-y">
            {group.items.map((it) => (
              <li key={it.sku}>
                <label className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-muted/40">
                  <Checkbox checked={selected.has(it.sku)} onCheckedChange={(v) => onToggle([it.sku], v === true)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{it.name}</p>
                    <p className="flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                      <span className="font-mono">{it.sku}</span>
                      {it.seller && <span>· {it.seller}</span>}
                      {!it.unlimited_stock && <span>· stok {it.stock}</span>}
                      {it.cut_off && <span>· cut-off {it.cut_off}</span>}
                    </p>
                  </div>
                  {it.product_id && (
                    <Pill className="bg-sky-500/15 text-sky-600 dark:text-sky-400">
                      Sudah ada{it.category_id && categoryName.get(it.category_id) ? ` · ${categoryName.get(it.category_id)}` : ""}
                    </Pill>
                  )}
                  {!it.available && <Pill className="bg-red-500/15 text-red-600 dark:text-red-400">Gangguan</Pill>}
                  <span className="w-24 text-right text-sm font-semibold tabular-nums">{formatRupiah(it.price)}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

function ResultCard({ result, onClose }: { result: ImportResult; onClose: () => void }) {
  const newCats = result.categories.filter((c) => c.new);
  return (
    <Card className="border-emerald-500/40 bg-emerald-500/5">
      <CardContent className="space-y-3 py-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
          <div className="flex-1 text-sm">
            <p className="font-semibold">Import selesai</p>
            <p className="text-muted-foreground">
              {result.categories_created} kategori baru · {result.products_created} produk baru · {result.products_updated} diperbarui
              {result.skipped > 0 && ` · ${result.skipped} dilewati karena sudah ada`}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
        {newCats.length > 0 && (
          <p className="rounded-lg bg-background px-3 py-2 text-xs text-muted-foreground">
            Lengkapi gambar, banner, dan field input untuk kategori baru ({newCats.map((c) => c.name).join(", ")}) lalu aktifkan di{" "}
            <Link href="/admin/categories" className="font-medium text-primary underline-offset-2 hover:underline">
              Kategori
            </Link>
            . Harga jual mengikuti margin default; atur di{" "}
            <Link href="/admin/products" className="font-medium text-primary underline-offset-2 hover:underline">
              Produk
            </Link>
            .
          </p>
        )}
      </CardContent>
    </Card>
  );
}
