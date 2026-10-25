import type { ApiEnvelope, Paginated } from "@/lib/types";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
};

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const url = `/api/v1${path}`;
  if (!query) return url;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `${url}?${s}` : url;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<ApiEnvelope<T>> {
  const isForm = typeof FormData !== "undefined" && opts.body instanceof FormData;
  const res = await fetch(buildUrl(path, opts.query), {
    method: opts.method ?? "GET",
    credentials: "same-origin",
    headers: opts.body && !isForm ? { "Content-Type": "application/json" } : undefined,
    body: opts.body ? (isForm ? (opts.body as FormData) : JSON.stringify(opts.body)) : undefined,
    signal: opts.signal,
  });
  let json: ApiEnvelope<T> | null = null;
  try {
    json = await res.json();
  } catch {
    /* empty or non-JSON body */
  }
  if (!res.ok || !json?.success) {
    const fieldMsg = json?.errors ? Object.values(json.errors)[0] : undefined;
    throw new ApiError(json?.message || fieldMsg || "Terjadi kesalahan, coba lagi", res.status, json?.errors);
  }
  return json;
}

/** Browser API client. Requests go through the Next.js rewrite so the auth cookie is first-party. */
export const api = {
  get: <T>(path: string, query?: RequestOptions["query"], signal?: AbortSignal) =>
    request<T>(path, { query, signal }).then((r) => r.data),
  paginated: async <T>(path: string, query?: RequestOptions["query"]): Promise<Paginated<T>> => {
    const r = await request<T[]>(path, { query });
    return { data: r.data ?? [], meta: r.meta! };
  },
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body: body ?? {} }).then((r) => r.data),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body }).then((r) => r.data),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }).then((r) => r.data),
  message: (path: string, body?: unknown, method: "POST" | "PUT" | "DELETE" = "POST") =>
    request<unknown>(path, { method, body: body ?? {} }).then((r) => r.message ?? "Berhasil"),
};

export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : "Terjadi kesalahan");
