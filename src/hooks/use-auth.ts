"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import type { User } from "@/lib/types";

export const ME_KEY = ["me"] as const;

export function useAuth() {
  const query = useQuery({
    queryKey: ME_KEY,
    queryFn: () => api.get<User>("/me").catch(() => null),
    staleTime: 5 * 60_000,
  });
  return { user: query.data ?? null, isLoading: query.isLoading, isAdmin: query.data?.role === "admin" };
}

export function useLogout() {
  const qc = useQueryClient();
  const router = useRouter();
  return async () => {
    await api.post("/auth/logout").catch(() => undefined);
    qc.setQueryData(ME_KEY, null);
    qc.invalidateQueries();
    router.push("/");
    router.refresh();
  };
}
