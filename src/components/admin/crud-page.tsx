"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SimplePagination } from "@/components/shared/simple-pagination";
import { Button } from "@/components/ui/button";
import { revalidateStorefront } from "@/lib/actions";
import { api, ApiError } from "@/lib/api/client";
import type { CacheTagName } from "@/lib/tags";
import type { Paginated } from "@/lib/types";
import { ConfirmDelete } from "./confirm-delete";
import { type Column, DataTable } from "./data-table";
import { FormDialog } from "./form-dialog";
import { PageHeader } from "./page-header";
import type { FieldDef, Values } from "./schema-form";

type Row = { id: number };

export type CrudConfig<T extends Row> = {
  title: string;
  description?: string;
  singular: string;
  endpoint: string;
  columns: Column<T>[];
  fields: FieldDef[] | ((editing: T | null) => FieldDef[]);
  defaults: Values | (() => Values);
  toForm?: (row: T) => Values;
  toPayload?: (values: Values) => unknown;
  nameOf?: (row: T) => string;
  revalidate?: CacheTagName[];
  paginated?: boolean;
  query?: Record<string, string | number | undefined>;
  toolbar?: React.ReactNode;
  canCreate?: boolean;
  canDelete?: boolean;
  wideForm?: boolean;
  extraActions?: (row: T) => React.ReactNode;
};

/** Generic admin resource page: list + create/edit dialog + delete, wired to the REST API. */
export function CrudPage<T extends Row>(cfg: CrudConfig<T>) {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<T | null>(null);
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [initial, setInitial] = useState<Values>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const queryKey = ["admin", cfg.endpoint, cfg.query ?? {}, cfg.paginated ? page : 0];

  const list = useQuery({
    queryKey,
    queryFn: async (): Promise<Paginated<T>> => {
      if (cfg.paginated) return api.paginated<T>(cfg.endpoint, { ...cfg.query, page, per_page: 25 });
      const data = await api.get<T[]>(cfg.endpoint, cfg.query);
      return { data: data ?? [], meta: { page: 1, per_page: data?.length ?? 0, total: data?.length ?? 0, total_pages: 1 } };
    },
    placeholderData: keepPreviousData,
  });

  const afterMutation = async () => {
    await qc.invalidateQueries({ queryKey: ["admin", cfg.endpoint] });
    if (cfg.revalidate?.length) await revalidateStorefront(cfg.revalidate);
  };

  const save = useMutation({
    mutationFn: (values: Values) => {
      const body = cfg.toPayload ? cfg.toPayload(values) : values;
      return editing ? api.put(`${cfg.endpoint}/${editing.id}`, body) : api.post(cfg.endpoint, body);
    },
    onSuccess: async () => {
      toast.success(`${cfg.singular} disimpan`);
      setOpen(false);
      await afterMutation();
    },
    onError: (e) => {
      setServerErrors(e instanceof ApiError && e.errors ? e.errors : {});
      toast.error(e.message);
    },
  });

  const del = useMutation({
    mutationFn: (id: number) => api.delete(`${cfg.endpoint}/${id}`),
    onSuccess: async () => {
      toast.success(`${cfg.singular} dihapus`);
      await afterMutation();
    },
    onError: (e) => toast.error(e.message),
  });

  const openForm = (row: T | null) => {
    setEditing(row);
    const defaults = typeof cfg.defaults === "function" ? cfg.defaults() : cfg.defaults;
    setInitial(row ? (cfg.toForm ? cfg.toForm(row) : (row as unknown as Values)) : defaults);
    setServerErrors({});
    setFormKey((k) => k + 1);
    setOpen(true);
  };

  const fields = typeof cfg.fields === "function" ? cfg.fields(editing) : cfg.fields;
  const columns: Column<T>[] = [
    ...cfg.columns,
    {
      header: "",
      className: "w-px text-right",
      cell: (row) => (
        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          {cfg.extraActions?.(row)}
          <Button variant="ghost" size="icon-sm" onClick={() => openForm(row)} aria-label="Ubah">
            <Pencil />
          </Button>
          {cfg.canDelete !== false && <ConfirmDelete name={cfg.nameOf?.(row) ?? cfg.singular} onConfirm={() => del.mutate(row.id)} />}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={cfg.title}
        description={cfg.description}
        actions={
          cfg.canCreate !== false && (
            <Button onClick={() => openForm(null)} className="bg-brand-gradient text-white">
              <Plus /> Tambah {cfg.singular}
            </Button>
          )
        }
      />
      {cfg.toolbar && <div className="mb-4 flex flex-wrap gap-2">{cfg.toolbar}</div>}
      <DataTable columns={columns} rows={list.data?.data} loading={list.isLoading} rowKey={(r) => r.id} onRowClick={(r) => openForm(r)} />
      {cfg.paginated && (
        <div className="mt-4">
          <SimplePagination meta={list.data?.meta} onPage={setPage} />
        </div>
      )}
      <FormDialog
        key={formKey}
        open={open}
        onOpenChange={setOpen}
        title={editing ? `Ubah ${cfg.singular}` : `Tambah ${cfg.singular}`}
        fields={fields}
        initial={initial}
        saving={save.isPending}
        serverErrors={serverErrors}
        onSubmit={(v) => save.mutate(v)}
        wide={cfg.wideForm}
      />
    </div>
  );
}
