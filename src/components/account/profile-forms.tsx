"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormInput } from "@/components/auth/form-input";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { ME_KEY, useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api/client";
import type { User } from "@/lib/types";
import { MembershipCard } from "./membership-card";

const profileSchema = z.object({ name: z.string().min(2, "Nama minimal 2 karakter"), phone: z.string().min(8, "Nomor tidak valid") });
const passwordSchema = z
  .object({ current_password: z.string().min(1, "Wajib diisi"), new_password: z.string().min(8, "Minimal 8 karakter"), confirm: z.string() })
  .refine((v) => v.new_password === v.confirm, { path: ["confirm"], message: "Konfirmasi tidak sama" });

export function AccountOverview() {
  const { user, isLoading } = useAuth();
  if (isLoading || !user) return <Skeleton className="h-80 rounded-2xl" />;
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-5">
        <MembershipCard user={user} />
        <ProfileForm user={user} />
      </div>
      <PasswordForm />
    </div>
  );
}

function ProfileForm({ user }: { user: User }) {
  const qc = useQueryClient();
  const form = useForm<z.infer<typeof profileSchema>>({ resolver: zodResolver(profileSchema), defaultValues: { name: user.name, phone: user.phone } });
  const save = useMutation({
    mutationFn: (v: z.infer<typeof profileSchema>) => api.put<User>("/me", v),
    onSuccess: (u) => {
      qc.setQueryData(ME_KEY, { ...user, ...u });
      toast.success("Profil disimpan");
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <form onSubmit={form.handleSubmit((v) => save.mutate(v))} className="glass space-y-4 rounded-2xl p-5">
      <div>
        <h2 className="font-semibold">Profil</h2>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
      <FieldGroup>
        <FormInput form={form} name="name" label="Nama" />
        <FormInput form={form} name="phone" label="No. WhatsApp" />
      </FieldGroup>
      <Button type="submit" disabled={save.isPending}>
        {save.isPending && <Loader2 className="animate-spin" />} Simpan
      </Button>
    </form>
  );
}

function PasswordForm() {
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: "", new_password: "", confirm: "" },
  });
  const save = useMutation({
    mutationFn: ({ confirm: _c, ...v }: z.infer<typeof passwordSchema>) => api.message("/me/password", v, "PUT"),
    onSuccess: (m) => {
      toast.success(m);
      form.reset();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <form onSubmit={form.handleSubmit((v) => save.mutate(v))} className="glass h-fit space-y-4 rounded-2xl p-5">
      <h2 className="font-semibold">Ubah Password</h2>
      <FieldGroup>
        <FormInput form={form} name="current_password" label="Password saat ini" type="password" autoComplete="current-password" />
        <FormInput form={form} name="new_password" label="Password baru" type="password" autoComplete="new-password" />
        <FormInput form={form} name="confirm" label="Konfirmasi password baru" type="password" autoComplete="new-password" />
      </FieldGroup>
      <Button type="submit" variant="outline" disabled={save.isPending}>
        {save.isPending && <Loader2 className="animate-spin" />} Ubah Password
      </Button>
    </form>
  );
}
