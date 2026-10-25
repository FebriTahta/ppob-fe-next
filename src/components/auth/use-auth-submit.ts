"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { ME_KEY } from "@/hooks/use-auth";
import { api, ApiError } from "@/lib/api/client";
import type { User } from "@/lib/types";

/** Shared login/register submission: stores the user, maps field errors, redirects to ?next. */
export function useAuthSubmit<T extends FieldValues>(path: string, form: UseFormReturn<T>) {
  const qc = useQueryClient();
  const router = useRouter();
  const params = useSearchParams();
  return useMutation({
    mutationFn: (values: T) => api.post<{ token: string; user: User }>(path, values),
    onSuccess: ({ user }) => {
      qc.setQueryData(ME_KEY, user);
      toast.success(`Selamat datang, ${user.name}!`);
      const next = params.get("next");
      const safe = next && next.startsWith("/") && !next.startsWith("//") ? next : user.role === "admin" ? "/admin" : "/";
      router.replace(safe);
      router.refresh();
    },
    onError: (e) => {
      if (e instanceof ApiError && e.errors) {
        for (const [k, msg] of Object.entries(e.errors)) form.setError(k as Path<T>, { message: msg });
      }
      toast.error(e.message);
    },
  });
}
