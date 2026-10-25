"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { FormInput } from "./form-input";
import { useAuthSubmit } from "./use-auth-submit";

const schema = z.object({
  email: z.email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });
  const submit = useAuthSubmit("/auth/login", form);
  return (
    <form onSubmit={form.handleSubmit((v) => submit.mutate(v))} noValidate>
      <FieldGroup>
        <FormInput form={form} name="email" label="Email" type="email" placeholder="nama@email.com" autoComplete="email" />
        <FormInput form={form} name="password" label="Password" type="password" placeholder="••••••••" autoComplete="current-password" />
        <Button type="submit" size="lg" className="h-11 w-full bg-brand-gradient text-white glow" disabled={submit.isPending}>
          {submit.isPending && <Loader2 className="animate-spin" />} Masuk
        </Button>
      </FieldGroup>
    </form>
  );
}
