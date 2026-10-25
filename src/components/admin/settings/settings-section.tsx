"use client";

import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { AllSettings } from "@/lib/types";
import { type FieldDef, SchemaForm, type Values } from "../schema-form";
import { useSaveSetting } from "./use-settings";

type Props<K extends keyof AllSettings> = {
  settingKey: K;
  initial: AllSettings[K];
  title: string;
  description?: string;
  fields: FieldDef[];
  children?: (values: Values, set: (k: string, v: unknown) => void) => React.ReactNode;
};

/** One editable settings group (site, contact, pricing...) rendered from field definitions. */
export function SettingsSection<K extends keyof AllSettings>({ settingKey, initial, title, description, fields, children }: Props<K>) {
  const [values, setValues] = useState<Values>(initial as unknown as Values);
  const save = useSaveSetting(settingKey);
  const set = (k: string, v: unknown) => setValues((s) => ({ ...s, [k]: v }));

  return (
    <form
      className="glass space-y-5 rounded-2xl p-5"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate(values as unknown as AllSettings[K]);
      }}
    >
      <div>
        <h2 className="font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children?.(values, set)}
      <SchemaForm fields={fields} values={values} onChange={set} />
      <Button type="submit" disabled={save.isPending} className="bg-brand-gradient text-white">
        {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Simpan
      </Button>
    </form>
  );
}
