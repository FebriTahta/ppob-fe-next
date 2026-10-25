"use client";

import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, EyeOff, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { CopyButton } from "@/components/shared/copy-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMounted } from "@/hooks/use-mounted";
import { api } from "@/lib/api/client";
import { cn } from "@/lib/utils";

type KeyIn = "header" | "query";
type Result = { status: number; duration_ms: number; url: string; headers: Record<string, string>; body?: unknown; raw?: string };
type Meta = { page: number; per_page: number; total: number; total_pages: number; from: number; to: number };
type Links = { first: string | null; prev: string | null; next: string | null; last: string | null };
type ApiBody = { success?: boolean; message?: string; meta?: Meta; links?: Links };

const BASE_URL = "https://jackzstore.id/api/v1";
const STORAGE_KEY = "ppob-api-explorer";

/** Auth per access-api.md: header X-API-KEY (recommended) or query string api_key. */
const KEY_IN: { value: KeyIn; label: string; name: string }[] = [
  { value: "header", label: "Header X-API-KEY (disarankan)", name: "X-API-KEY" },
  { value: "query", label: "Query string ?api_key=", name: "api_key" },
];

type ParamName = "page" | "per_page" | "search" | "game" | "games_id" | "category_id" | "status" | "sort" | "order";
type EndpointId = "categories" | "category" | "products" | "product";

const LIST_PARAMS: ParamName[] = ["page", "per_page", "search", "game", "games_id", "status", "sort", "order"];

const ENDPOINTS: {
  id: EndpointId;
  path: string;
  desc: string;
  paginated: boolean;
  pathParam?: { label: string; placeholder: string };
  params: ParamName[];
}[] = [
  { id: "categories", path: "/categories", desc: "Semua kategori beserta daftar game & jumlah produk", paginated: false, params: ["status"] },
  {
    id: "category",
    path: "/categories/{id}",
    desc: "Detail kategori + daftar game + produk di dalamnya",
    paginated: true,
    pathParam: { label: "ID kategori", placeholder: "2" },
    params: LIST_PARAMS,
  },
  { id: "products", path: "/products", desc: "Daftar produk", paginated: true, params: [...LIST_PARAMS, "category_id"] },
  {
    id: "product",
    path: "/products/{id}",
    desc: "Detail satu produk (angka = ID, selain itu SKU)",
    paginated: false,
    pathParam: { label: "ID atau SKU", placeholder: "4871 atau xl5" },
    params: [],
  },
];

const PARAMS: Record<ParamName, { label: string; placeholder?: string; options?: string[]; type?: string }> = {
  page: { label: "page", placeholder: "1", type: "number" },
  per_page: { label: "per_page (maks 100)", placeholder: "20", type: "number" },
  search: { label: "search", placeholder: "nama produk, SKU, atau game" },
  game: { label: "game (slug)", placeholder: "mobile-legends" },
  games_id: { label: "games_id", placeholder: "579", type: "number" },
  category_id: { label: "category_id", placeholder: "3", type: "number" },
  status: { label: "status", options: ["On", "Off", "all"] },
  sort: { label: "sort", options: ["game", "name", "price", "sort", "id"] },
  order: { label: "order", options: ["asc", "desc"] },
};

/** Error causes from the "Response Error" table in access-api.md. */
const ERROR_HINTS: Record<number, string> = {
  401: "API key kosong atau salah. Cek nilai u_key = 'api-product-key' di tabel utility.",
  404: "ID/SKU produk atau ID kategori tidak ditemukan.",
  422: "Nilai parameter (sort/status) tidak dikenali.",
  503: "API belum dikonfigurasi: api-product-key belum diisi di tabel utility.",
};

const DEFAULT = "__default";

/** Minimal JSON syntax highlighting; input is escaped before markup is added. */
function highlight(json: string) {
  const esc = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc.replace(
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (m) => {
      let cls = "text-amber-600 dark:text-amber-400";
      if (m.startsWith('"')) cls = m.endsWith(":") ? "text-sky-600 dark:text-sky-400" : "text-emerald-600 dark:text-emerald-400";
      else if (/true|false/.test(m)) cls = "text-violet-600 dark:text-violet-400";
      else if (m === "null") cls = "text-muted-foreground";
      return `<span class="${cls}">${m}</span>`;
    },
  );
}

function statusVariant(status: number) {
  if (status >= 200 && status < 300) return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
  if (status >= 400 && status < 500) return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
  return "bg-red-500/15 text-red-600 dark:text-red-400";
}

function buildUrl(base: string, endpoint: EndpointId, pathValue: string, params: Partial<Record<ParamName, string>>) {
  const ep = ENDPOINTS.find((e) => e.id === endpoint)!;
  const path = ep.path.replace("{id}", encodeURIComponent(pathValue.trim() || "{id}"));
  const q = new URLSearchParams();
  for (const name of ep.params) {
    const v = params[name]?.trim();
    if (v) q.set(name, v);
  }
  const qs = q.toString();
  return `${base.replace(/\/+$/, "")}${path}${qs ? `?${qs}` : ""}`;
}

type Saved = { base: string; key: string; keyIn: KeyIn; endpoint: EndpointId };

/** Last base URL/key used, remembered in this browser only. */
function loadSaved(): Saved {
  const fallback: Saved = { base: BASE_URL, key: "", keyIn: "header", endpoint: "categories" };
  try {
    const s = { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") } as Saved;
    if (!KEY_IN.some((k) => k.value === s.keyIn)) s.keyIn = "header";
    if (!ENDPOINTS.some((e) => e.id === s.endpoint)) s.endpoint = "categories";
    if (typeof s.base !== "string" || !s.base) s.base = BASE_URL;
    return s;
  } catch {
    return fallback;
  }
}

export default function ApiExplorerPage() {
  const mounted = useMounted();
  if (!mounted) return <Skeleton className="h-96 rounded-2xl" />;
  return <ApiExplorer initial={loadSaved()} />;
}

function ApiExplorer({ initial }: { initial: Saved }) {
  const [base, setBase] = useState(initial.base);
  const [key, setKey] = useState(initial.key);
  const [keyIn, setKeyIn] = useState<KeyIn>(initial.keyIn);
  const [showKey, setShowKey] = useState(false);
  const [endpoint, setEndpoint] = useState<EndpointId>(initial.endpoint);
  const [pathValue, setPathValue] = useState("");
  const [params, setParams] = useState<Partial<Record<ParamName, string>>>({});
  const [url, setUrl] = useState(() => buildUrl(initial.base, initial.endpoint, "", {}));

  const ep = ENDPOINTS.find((e) => e.id === endpoint)!;
  const keyName = KEY_IN.find((k) => k.value === keyIn)!.name;

  /** Any builder change regenerates the URL; the URL field itself stays editable for manual tweaks. */
  function update(next: { base?: string; endpoint?: EndpointId; pathValue?: string; params?: Partial<Record<ParamName, string>> }) {
    const b = next.base ?? base;
    const e = next.endpoint ?? endpoint;
    const p = next.pathValue ?? pathValue;
    const q = next.params ?? params;
    if (next.base !== undefined) setBase(b);
    if (next.endpoint !== undefined) setEndpoint(e);
    if (next.pathValue !== undefined) setPathValue(p);
    if (next.params !== undefined) setParams(q);
    setUrl(buildUrl(b, e, p, q));
  }

  const send = useMutation({
    mutationFn: (target: string) => {
      if (target.includes("{id}")) throw new Error(`${ep.pathParam?.label ?? "Parameter path"} wajib diisi`);
      // links.* from the API never carry api_key; the backend re-adds it when key_in = query.
      return api.post<Result>("/admin/api-explorer", { url: target, key, key_in: keyIn, key_name: keyName });
    },
    onSuccess: () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ base, key, keyIn, endpoint }));
      } catch {
        /* storage unavailable */
      }
    },
    onError: (e) => toast.error(e.message),
  });

  function go(target: string | null | undefined) {
    if (!target) return;
    setUrl(target);
    send.mutate(target);
  }

  const result = send.data;
  const body = (result?.body && typeof result.body === "object" ? result.body : undefined) as ApiBody | undefined;
  const pretty = useMemo(
    () => (result ? (result.body !== undefined ? JSON.stringify(result.body, null, 2) : (result.raw ?? "")) : ""),
    [result],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Explorer"
        description="Akses API read-only Jackzstore (kategori & produk) dengan API key, lalu lihat respons dalam format JSON."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              send.mutate(url);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_240px]">
              <div className="space-y-2">
                <Label htmlFor="api-base">Base URL</Label>
                <Input
                  id="api-base"
                  value={base}
                  onChange={(e) => update({ base: e.target.value })}
                  placeholder={BASE_URL}
                  className="font-mono text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">API key</Label>
                <div className="relative">
                  <Input
                    id="api-key"
                    type={showKey ? "text" : "password"}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="nilai api-product-key"
                    className="pr-10 font-mono text-sm"
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-1/2 right-1 -translate-y-1/2"
                    onClick={() => setShowKey((v) => !v)}
                    aria-label={showKey ? "Sembunyikan key" : "Tampilkan key"}
                  >
                    {showKey ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Kirim key via</Label>
                <Select value={keyIn} onValueChange={(v) => setKeyIn(v as KeyIn)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KEY_IN.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {keyIn === "query" && (
              <p className="-mt-2 text-xs text-amber-600 dark:text-amber-400">
                Key di query string bisa tercatat di log server/proxy. Gunakan header bila memungkinkan.
              </p>
            )}

            <div className="space-y-2">
              <Label>Endpoint</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {ENDPOINTS.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => update({ endpoint: e.id })}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left transition-colors hover:bg-muted/60",
                      endpoint === e.id && "border-primary bg-primary/5",
                    )}
                  >
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">GET</span>
                      <span>{e.path}</span>
                      {e.paginated && (
                        <Badge variant="secondary" className="ml-auto text-[10px]">
                          paginasi
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{e.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {(ep.pathParam || ep.params.length > 0) && (
              <div className="grid gap-4 sm:grid-cols-3">
                {ep.pathParam && (
                  <div className="space-y-2">
                    <Label htmlFor="api-path-param">{ep.pathParam.label}</Label>
                    <Input
                      id="api-path-param"
                      value={pathValue}
                      onChange={(e) => update({ pathValue: e.target.value })}
                      placeholder={ep.pathParam.placeholder}
                      className="font-mono text-sm"
                    />
                  </div>
                )}
                {ep.params.map((name) => {
                  const p = PARAMS[name];
                  const value = params[name] ?? "";
                  const set = (v: string) => update({ params: { ...params, [name]: v } });
                  return (
                    <div key={name} className="space-y-2">
                      <Label htmlFor={`api-param-${name}`} className="font-mono text-xs">
                        {p.label}
                      </Label>
                      {p.options ? (
                        <Select value={value || DEFAULT} onValueChange={(v) => set(v === DEFAULT ? "" : v)}>
                          <SelectTrigger id={`api-param-${name}`} className="w-full font-mono text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={DEFAULT}>default ({p.options[0]})</SelectItem>
                            {p.options.map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={`api-param-${name}`}
                          type={p.type ?? "text"}
                          min={p.type === "number" ? 1 : undefined}
                          max={name === "per_page" ? 100 : undefined}
                          value={value}
                          onChange={(e) => set(e.target.value)}
                          placeholder={p.placeholder}
                          className="font-mono text-sm"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="api-url">URL</Label>
              <div className="flex gap-2">
                <span className="inline-flex h-9 items-center rounded-md bg-muted px-3 font-mono text-xs font-semibold">GET</span>
                <Input
                  id="api-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="font-mono text-sm"
                  required
                />
                <CopyButton
                  value={`curl ${keyIn === "header" ? `-H "X-API-KEY: <api-key>" ` : ""}"${
                    keyIn === "query" ? `${url}${url.includes("?") ? "&" : "?"}api_key=<api-key>` : url
                  }"`}
                  label="Perintah curl disalin"
                />
              </div>
            </div>

            <Button type="submit" disabled={send.isPending || !url}>
              {send.isPending ? <Spinner /> : <Send />}
              Kirim request
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-center gap-2 space-y-0">
            <CardTitle className="text-base">Response</CardTitle>
            <span className={cn("rounded-md px-2 py-0.5 font-mono text-xs font-semibold", statusVariant(result.status))}>
              {result.status}
            </span>
            <span className="text-xs text-muted-foreground">{result.duration_ms} ms</span>
            {body?.message && (
              <span className={cn("text-xs", body.success ? "text-muted-foreground" : "text-red-600 dark:text-red-400")}>
                {body.message}
              </span>
            )}
            <div className="ml-auto">
              <CopyButton value={pretty} label="JSON disalin" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {body?.success === false && ERROR_HINTS[result.status] && (
              <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
                {ERROR_HINTS[result.status]}
              </p>
            )}

            {body?.meta && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted-foreground">
                  Halaman <b className="text-foreground">{body.meta.page}</b> / {body.meta.total_pages} · data {body.meta.from}–
                  {body.meta.to} dari <b className="text-foreground">{body.meta.total}</b>
                </span>
                <div className="ml-auto flex gap-1">
                  <Button type="button" size="icon-sm" variant="outline" aria-label="Halaman pertama" disabled={send.isPending || !body.links?.prev} onClick={() => go(body.links?.first)}>
                    <ChevronsLeft />
                  </Button>
                  <Button type="button" size="icon-sm" variant="outline" aria-label="Halaman sebelumnya" disabled={send.isPending || !body.links?.prev} onClick={() => go(body.links?.prev)}>
                    <ChevronLeft />
                  </Button>
                  <Button type="button" size="icon-sm" variant="outline" aria-label="Halaman berikutnya" disabled={send.isPending || !body.links?.next} onClick={() => go(body.links?.next)}>
                    <ChevronRight />
                  </Button>
                  <Button type="button" size="icon-sm" variant="outline" aria-label="Halaman terakhir" disabled={send.isPending || !body.links?.next} onClick={() => go(body.links?.last)}>
                    <ChevronsRight />
                  </Button>
                </div>
              </div>
            )}

            <Tabs defaultValue="body">
              <TabsList className="mb-3">
                <TabsTrigger value="body">Body</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
              </TabsList>
              <TabsContent value="body">
                {result.body === undefined && (
                  <p className="mb-2 text-xs text-amber-600 dark:text-amber-400">Respons bukan JSON — ditampilkan apa adanya.</p>
                )}
                <pre className="max-h-[60vh] overflow-auto rounded-lg bg-muted/50 p-4 font-mono text-xs leading-relaxed">
                  {result.body !== undefined ? <code dangerouslySetInnerHTML={{ __html: highlight(pretty) }} /> : <code>{pretty}</code>}
                </pre>
              </TabsContent>
              <TabsContent value="headers">
                <pre className="overflow-auto rounded-lg bg-muted/50 p-4 font-mono text-xs leading-relaxed">
                  {`GET ${result.url}\n${keyIn === "header" && key ? "X-API-KEY: ••••••\n" : ""}\n`}
                  {Object.entries(result.headers)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join("\n")}
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
