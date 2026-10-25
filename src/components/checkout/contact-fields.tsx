"use client";

import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export type Contact = { name: string; phone: string; email: string };

type Props = { value: Contact; onChange: (c: Contact) => void; errors: Partial<Record<keyof Contact, string>> };

export function ContactFields({ value, onChange, errors }: Props) {
  const set = (k: keyof Contact) => (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...value, [k]: e.target.value });
  return (
    <FieldGroup className="grid gap-4 sm:grid-cols-2">
      <Field data-invalid={!!errors.phone}>
        <FieldLabel htmlFor="phone">No. WhatsApp</FieldLabel>
        <Input id="phone" inputMode="tel" value={value.phone} onChange={set("phone")} placeholder="08xxxxxxxxxx" aria-invalid={!!errors.phone} className="h-10" />
        <FieldDescription>Bukti transaksi dikirim ke nomor ini.</FieldDescription>
      </Field>
      <Field data-invalid={!!errors.email}>
        <FieldLabel htmlFor="email">Email (opsional)</FieldLabel>
        <Input id="email" type="email" value={value.email} onChange={set("email")} placeholder="nama@email.com" aria-invalid={!!errors.email} className="h-10" />
        {errors.email && <FieldDescription className="text-destructive">{errors.email}</FieldDescription>}
      </Field>
    </FieldGroup>
  );
}
