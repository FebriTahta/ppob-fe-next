"use client";

import { type FieldDef, SchemaForm, type Values } from "./schema-form";

/** Credential fields per payment gateway driver; secrets render as password inputs. */
export const DRIVER_FIELDS: Record<string, FieldDef[]> = {
  midtrans: [
    { name: "server_key", label: "Server Key", type: "password" },
    { name: "client_key", label: "Client Key", type: "text" },
  ],
  xendit: [
    { name: "secret_key", label: "Secret Key", type: "password" },
    { name: "callback_token", label: "Callback verification token", type: "password" },
  ],
};

export function DriverConfig({ driver, value, onChange }: { driver: string; value: unknown; onChange: (v: unknown) => void }) {
  const fields = DRIVER_FIELDS[driver];
  const config = (value as Values) ?? {};
  if (!fields) {
    return <p className="rounded-xl border border-dashed p-3 text-sm text-muted-foreground">Driver ini tidak memerlukan kredensial.</p>;
  }
  return (
    <div className="rounded-xl border p-4">
      <SchemaForm fields={fields} values={config} onChange={(k, v) => onChange({ ...config, [k]: v })} />
    </div>
  );
}
