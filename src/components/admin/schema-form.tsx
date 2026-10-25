"use client";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ImageUpload } from "./image-upload";
import { SearchableSelect } from "./searchable-select";

export type Values = Record<string, unknown>;
export type Option = { value: string; label: string; icon?: React.ReactNode };

type Base = { name: string; label: string; description?: string; required?: boolean; span?: 1 | 2; hidden?: (v: Values) => boolean };

export type FieldDef = Base &
  (
    | { type: "text" | "textarea" | "password" | "color"; placeholder?: string }
    | { type: "number"; placeholder?: string; nullable?: boolean; step?: number; suffix?: string }
    | { type: "switch" }
    | { type: "datetime"; nullable?: boolean }
    | { type: "select"; options: Option[]; numeric?: boolean; nullable?: boolean; placeholder?: string; searchable?: boolean }
    | { type: "image"; aspect?: "square" | "wide" }
    | { type: "tags"; placeholder?: string }
    | { type: "json" }
    | { type: "custom"; render: (value: unknown, onChange: (v: unknown) => void, values: Values) => React.ReactNode }
  );

const NONE = "__none__";

/** Converts between ISO timestamps and <input type="datetime-local"> values in local time. */
const toLocalInput = (iso: unknown) => {
  if (!iso || typeof iso !== "string") return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

function FieldControl({ def, value, onChange, values }: { def: FieldDef; value: unknown; onChange: (v: unknown) => void; values: Values }) {
  const id = `f-${def.name}`;
  switch (def.type) {
    case "textarea":
      return <Textarea id={id} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={def.placeholder} rows={4} />;
    case "number":
      return (
        <div className="relative">
          <Input
            id={id}
            type="number"
            step={def.step ?? 1}
            value={value === null || value === undefined ? "" : String(value)}
            placeholder={def.placeholder ?? (def.nullable ? "Kosongkan untuk mewarisi" : undefined)}
            onChange={(e) => onChange(e.target.value === "" ? (def.nullable ? null : 0) : Number(e.target.value))}
            className={cn("h-9", def.suffix && "pr-10")}
          />
          {def.suffix && <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">{def.suffix}</span>}
        </div>
      );
    case "switch":
      return <Switch id={id} checked={!!value} onCheckedChange={onChange} />;
    case "color":
      return (
        <div className="flex gap-2">
          <input type="color" value={(value as string) || "#7c3aed"} onChange={(e) => onChange(e.target.value)} className="h-9 w-12 cursor-pointer rounded-md border bg-transparent p-1" aria-label={def.label} />
          <Input id={id} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} className="h-9 font-mono" />
        </div>
      );
    case "datetime":
      return (
        <Input
          id={id}
          type="datetime-local"
          value={toLocalInput(value)}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : def.nullable ? null : "")}
          className="h-9"
        />
      );
    case "select": {
      const current = value === null || value === undefined || value === "" ? (def.nullable ? NONE : "") : String(value);
      if (def.searchable) {
        return (
          <SearchableSelect
            id={id}
            value={current}
            options={def.options}
            onChange={(v) => onChange(v === NONE ? null : def.numeric ? Number(v) : v)}
            placeholder={def.placeholder}
            noneLabel={def.nullable ? (def.placeholder ?? "Tidak ada") : undefined}
            noneValue={NONE}
          />
        );
      }
      return (
        <Select value={current} onValueChange={(v) => onChange(v === NONE ? null : def.numeric ? Number(v) : v)}>
          <SelectTrigger id={id} className="h-9 w-full">
            <SelectValue placeholder={def.placeholder ?? "Pilih"} />
          </SelectTrigger>
          <SelectContent>
            {def.nullable && <SelectItem value={NONE}>— {def.placeholder ?? "Tidak ada"} —</SelectItem>}
            {def.options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    case "image":
      return <ImageUpload value={(value as string) ?? ""} onChange={onChange} aspect={def.aspect} />;
    case "tags":
      return (
        <Textarea
          id={id}
          rows={3}
          value={Array.isArray(value) ? value.join("\n") : ""}
          placeholder={def.placeholder ?? "Satu item per baris"}
          onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
        />
      );
    case "json":
      return <JsonInput id={id} value={value} onChange={onChange} />;
    case "custom":
      return <>{def.render(value, onChange, values)}</>;
    default:
      return (
        <Input
          id={id}
          type={def.type === "password" ? "password" : "text"}
          autoComplete={def.type === "password" ? "new-password" : undefined}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={"placeholder" in def ? def.placeholder : undefined}
          className="h-9"
        />
      );
  }
}

function JsonInput({ id, value, onChange }: { id: string; value: unknown; onChange: (v: unknown) => void }) {
  return (
    <Textarea
      id={id}
      rows={6}
      className="font-mono text-xs"
      defaultValue={JSON.stringify(value ?? {}, null, 2)}
      onBlur={(e) => {
        try {
          onChange(JSON.parse(e.target.value || "{}"));
        } catch {
          /* keep previous value until JSON is valid */
        }
      }}
    />
  );
}

type FormProps = { fields: FieldDef[]; values: Values; onChange: (name: string, value: unknown) => void; errors?: Record<string, string> };

/** Renders a grid of fields from declarative definitions (used by every admin CRUD and settings form). */
export function SchemaForm({ fields, values, onChange, errors = {} }: FormProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((def) => {
        if (def.hidden?.(values)) return null;
        const wide = def.span === 2 || ["textarea", "image", "tags", "json", "custom"].includes(def.type);
        if (def.type === "switch") {
          return (
            <Field key={def.name} orientation="horizontal" className={cn("rounded-xl border p-3", wide && "sm:col-span-2")}>
              <div className="flex-1">
                <FieldLabel htmlFor={`f-${def.name}`}>{def.label}</FieldLabel>
                {def.description && <FieldDescription>{def.description}</FieldDescription>}
              </div>
              <FieldControl def={def} value={values[def.name]} values={values} onChange={(v) => onChange(def.name, v)} />
            </Field>
          );
        }
        return (
          <Field key={def.name} data-invalid={!!errors[def.name]} className={cn(wide && "sm:col-span-2")}>
            <FieldLabel htmlFor={`f-${def.name}`}>
              {def.label}
              {def.required && <span className="text-destructive">*</span>}
            </FieldLabel>
            <FieldControl def={def} value={values[def.name]} values={values} onChange={(v) => onChange(def.name, v)} />
            {errors[def.name] ? (
              <FieldDescription className="text-destructive">{errors[def.name]}</FieldDescription>
            ) : (
              def.description && <FieldDescription>{def.description}</FieldDescription>
            )}
          </Field>
        );
      })}
    </div>
  );
}

/** Required-field validation shared by schema forms. */
export function validateRequired(fields: FieldDef[], values: Values) {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    if (!f.required || f.hidden?.(values)) continue;
    const v = values[f.name];
    if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) errors[f.name] = `${f.label} wajib diisi`;
  }
  return errors;
}
