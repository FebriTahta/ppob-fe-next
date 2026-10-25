"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { InputField } from "@/lib/types";

const TYPES = [
  { value: "text", label: "Teks" },
  { value: "number", label: "Angka" },
  { value: "email", label: "Email" },
  { value: "password", label: "Password (disamarkan)" },
  { value: "select", label: "Pilihan" },
];

const PRESETS: Record<string, InputField[]> = {
  "User ID + Zone": [
    { key: "user_id", label: "User ID", type: "number", required: true },
    { key: "zone_id", label: "Zone ID", type: "number", required: true },
  ],
  "Player ID": [{ key: "user_id", label: "Player ID", type: "number", required: true }],
  "Login akun": [
    { key: "login_email", label: "Email / Username", type: "email", required: true },
    { key: "login_password", label: "Password", type: "password", required: true },
    { key: "login_via", label: "Login Via", type: "select", required: true, options: ["Google", "Facebook", "Email"] },
  ],
  "Alamat kirim": [
    { key: "recipient", label: "Nama Penerima", type: "text", required: true },
    { key: "address", label: "Alamat Lengkap", type: "text", required: true },
    { key: "phone", label: "No. HP Penerima", type: "number", required: true },
  ],
};

type Props = { value: unknown; onChange: (v: InputField[]) => void };

/** Editor for the customer data fields a category asks for (User ID, Zone, login credentials, address...). */
export function InputFieldsEditor({ value, onChange }: Props) {
  const fields = (Array.isArray(value) ? value : []) as InputField[];
  const update = (i: number, patch: Partial<InputField>) => onChange(fields.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  const move = (i: number, d: -1 | 1) => {
    const next = [...fields];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Preset:</span>
        {Object.keys(PRESETS).map((p) => (
          <Button key={p} type="button" size="xs" variant="outline" onClick={() => onChange(PRESETS[p])}>
            {p}
          </Button>
        ))}
      </div>
      {fields.map((f, i) => (
        <div key={i} className="grid gap-2 rounded-xl border p-3 sm:grid-cols-[1fr_1fr_150px_auto]">
          <Input value={f.label} placeholder="Label (mis. User ID)" onChange={(e) => update(i, { label: e.target.value })} className="h-8" />
          <Input value={f.key} placeholder="key (mis. user_id)" onChange={(e) => update(i, { key: e.target.value.replace(/[^a-z0-9_]/gi, "_").toLowerCase() })} className="h-8 font-mono text-xs" />
          <Select value={f.type ?? "text"} onValueChange={(t) => update(i, { type: t as InputField["type"] })}>
            <SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <label className="mr-1 flex items-center gap-1.5 text-xs"><Switch checked={f.required} onCheckedChange={(v) => update(i, { required: v })} /> Wajib</label>
            <Button type="button" variant="ghost" size="icon-xs" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Naik"><ArrowUp /></Button>
            <Button type="button" variant="ghost" size="icon-xs" disabled={i === fields.length - 1} onClick={() => move(i, 1)} aria-label="Turun"><ArrowDown /></Button>
            <Button type="button" variant="ghost" size="icon-xs" onClick={() => onChange(fields.filter((_, idx) => idx !== i))} aria-label="Hapus" className="text-destructive"><Trash2 /></Button>
          </div>
          <Input value={f.placeholder ?? ""} placeholder="Placeholder (opsional)" onChange={(e) => update(i, { placeholder: e.target.value })} className="h-8 sm:col-span-2" />
          {f.type === "select" && (
            <Input
              value={(f.options ?? []).join(", ")}
              placeholder="Opsi, pisahkan dengan koma"
              onChange={(e) => update(i, { options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
              className="h-8 sm:col-span-2"
            />
          )}
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={() => onChange([...fields, { key: "", label: "", type: "text", required: true }])}>
        <Plus /> Tambah field
      </Button>
    </div>
  );
}
