"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type FieldDef, SchemaForm, validateRequired, type Values } from "./schema-form";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description?: string;
  fields: FieldDef[];
  initial: Values;
  saving?: boolean;
  serverErrors?: Record<string, string>;
  onSubmit: (values: Values) => void;
  wide?: boolean;
};

/** Modal create/edit form driven by field definitions. Remount (key) per record to reset state. */
export function FormDialog({ open, onOpenChange, title, description, fields, initial, saving, serverErrors, onSubmit, wide }: Props) {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={wide ? "sm:max-w-3xl" : "sm:max-w-2xl"}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const errs = validateRequired(fields, values);
            setErrors(errs);
            if (Object.keys(errs).length === 0) onSubmit(values);
          }}
        >
          <div className="-mx-6 max-h-[65vh] overflow-y-auto px-6 py-1">
            <SchemaForm fields={fields} values={values} errors={{ ...serverErrors, ...errors }} onChange={(k, v) => setValues((s) => ({ ...s, [k]: v }))} />
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={saving} className="bg-brand-gradient text-white">
              {saving && <Loader2 className="animate-spin" />} Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
