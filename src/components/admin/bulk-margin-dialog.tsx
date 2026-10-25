"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Percent } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { revalidateStorefront } from "@/lib/actions";
import { api } from "@/lib/api/client";
import { TAGS } from "@/lib/tags";
import { SchemaForm, type Option, type Values } from "./schema-form";

/** Sets (or resets) the margin of all products, optionally limited to one category. */
export function BulkMarginDialog({ categories }: { categories: Option[] }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Values>({ category_id: null, margin_percent: null });
  const run = useMutation({
    mutationFn: () => api.post<{ updated: number }>("/admin/products/bulk-margin", { category_id: values.category_id ?? 0, margin_percent: values.margin_percent }),
    onSuccess: async (r) => {
      toast.success(`${r.updated} produk diperbarui`);
      setOpen(false);
      await qc.invalidateQueries({ queryKey: ["admin", "/admin/products"] });
      await revalidateStorefront([TAGS.catalog]);
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Percent /> Atur Margin Massal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atur margin massal</DialogTitle>
          <DialogDescription>Kosongkan margin untuk mengembalikan produk agar mewarisi margin kategori/default.</DialogDescription>
        </DialogHeader>
        <SchemaForm
          fields={[
            { name: "category_id", label: "Kategori", type: "select", options: categories, numeric: true, nullable: true, placeholder: "Semua produk" },
            { name: "margin_percent", label: "Margin produk", type: "number", step: 0.01, nullable: true, suffix: "%" },
          ]}
          values={values}
          onChange={(k, v) => setValues((s) => ({ ...s, [k]: v }))}
        />
        <DialogFooter>
          <Button onClick={() => run.mutate()} disabled={run.isPending} className="bg-brand-gradient text-white">Terapkan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
