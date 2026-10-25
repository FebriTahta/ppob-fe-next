"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { Option } from "./schema-form";

/** Loads an admin list endpoint and maps it to select options. */
export function useOptions<T extends { id: number }>(endpoint: string, label: (row: T) => string): Option[] {
  const { data = [] } = useQuery({
    queryKey: ["admin", endpoint, {}, 0, "options"],
    queryFn: () => api.get<T[]>(endpoint),
    staleTime: 60_000,
  });
  return data.map((r) => ({ value: String(r.id), label: label(r) }));
}
