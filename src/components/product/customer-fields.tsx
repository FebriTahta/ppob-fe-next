"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { InputField } from "@/lib/types";

type Props = {
  fields: InputField[];
  values: Record<string, string>;
  errors: Record<string, string>;
  onChange: (key: string, value: string) => void;
};

/** Dynamic customer-data form rendered from the category's input field definitions. */
export function CustomerFields({ fields, values, errors, onChange }: Props) {
  return (
    <FieldGroup className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <Field key={f.key} data-invalid={!!errors[f.key]} className={fields.length === 1 || f.key === "address" ? "sm:col-span-2" : undefined}>
          <FieldLabel htmlFor={`cf-${f.key}`}>
            {f.label}
            {f.required && <span className="text-destructive">*</span>}
          </FieldLabel>
          <CustomerInput field={f} value={values[f.key] ?? ""} invalid={!!errors[f.key]} onChange={(v) => onChange(f.key, v)} />
          {errors[f.key] && <FieldError>{errors[f.key]}</FieldError>}
        </Field>
      ))}
      {fields.some((f) => f.type === "password") && (
        <p className="flex items-start gap-2 text-xs text-muted-foreground sm:col-span-2">
          <Lock className="mt-0.5 size-3.5 shrink-0 text-primary" />
          Data login hanya digunakan untuk memproses pesanan dan dihapus otomatis setelah pesanan selesai.
        </p>
      )}
    </FieldGroup>
  );
}

function CustomerInput({ field, value, invalid, onChange }: { field: InputField; value: string; invalid: boolean; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  if (field.type === "select" && field.options?.length) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={`cf-${field.key}`} aria-invalid={invalid} className="w-full">
          <SelectValue placeholder={field.placeholder || `Pilih ${field.label}`} />
        </SelectTrigger>
        <SelectContent>
          {field.options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  const isPassword = field.type === "password";
  return (
    <div className="relative">
      <Input
        id={`cf-${field.key}`}
        value={value}
        aria-invalid={invalid}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || field.label}
        type={isPassword && !show ? "password" : field.type === "email" ? "email" : "text"}
        inputMode={field.type === "number" ? "numeric" : undefined}
        autoComplete={isPassword ? "off" : undefined}
        className="h-10"
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
          aria-label={show ? "Sembunyikan" : "Tampilkan"}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      )}
    </div>
  );
}

/** Returns field errors for required/option validation. */
export function validateCustomerData(fields: InputField[], values: Record<string, string>) {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const v = (values[f.key] ?? "").trim();
    if (f.required && !v) errors[f.key] = `${f.label} wajib diisi`;
    else if (v && f.type === "number" && !/^\d+$/.test(v)) errors[f.key] = `${f.label} hanya boleh angka`;
  }
  return errors;
}
