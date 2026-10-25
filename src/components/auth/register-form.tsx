"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { FormInput } from "./form-input";
import { useAuthSubmit } from "./use-auth-submit";

const schema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.email("Format email tidak valid"),
    phone: z.string().regex(/^(\+?62|0)8\d{7,12}$/, "Nomor WhatsApp tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Konfirmasi password tidak sama" });

export function RegisterForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirm: "" },
  });
  const submit = useAuthSubmit("/auth/register", form);
  return (
    <form onSubmit={form.handleSubmit(({ confirm: _confirm, ...v }) => submit.mutate(v as never))} noValidate>
      <FieldGroup>
        <FormInput form={form} name="name" label="Nama lengkap" autoComplete="name" />
        <FormInput form={form} name="email" label="Email" type="email" autoComplete="email" />
        <FormInput form={form} name="phone" label="No. WhatsApp" placeholder="08xxxxxxxxxx" autoComplete="tel" />
        <FormInput form={form} name="password" label="Password" type="password" autoComplete="new-password" />
        <FormInput form={form} name="confirm" label="Konfirmasi password" type="password" autoComplete="new-password" />
        <Button type="submit" size="lg" className="h-11 w-full bg-brand-gradient text-white glow" disabled={submit.isPending}>
          {submit.isPending && <Loader2 className="animate-spin" />} Daftar
        </Button>
      </FieldGroup>
    </form>
  );
}
