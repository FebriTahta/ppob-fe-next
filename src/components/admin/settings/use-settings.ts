"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { revalidateStorefront } from "@/lib/actions";
import { api } from "@/lib/api/client";
import { TAGS } from "@/lib/tags";
import type { AllSettings } from "@/lib/types";

const KEY = ["admin", "settings"];

export function useAdminSettings() {
  return useQuery({ queryKey: KEY, queryFn: () => api.get<AllSettings>("/admin/settings") });
}

/** Saves one settings group and refreshes the cached storefront. */
export function useSaveSetting<K extends keyof AllSettings>(key: K) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (value: AllSettings[K]) => api.put<AllSettings[K]>(`/admin/settings/${key}`, value),
    onSuccess: async (saved) => {
      qc.setQueryData<AllSettings>(KEY, (s) => (s ? { ...s, [key]: saved } : s));
      await revalidateStorefront([TAGS.settings]);
      toast.success("Pengaturan disimpan");
    },
    onError: (e) => toast.error(e.message),
  });
}
