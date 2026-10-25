"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, RefreshCw, Wallet } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ActiveDot, Pill } from "@/components/admin/cells";
import { CrudPage } from "@/components/admin/crud-page";
import { WebhookUrl } from "@/components/admin/webhook-url";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { api } from "@/lib/api/client";
import { formatRupiah } from "@/lib/format";

/** Every provider speaks the Digiflazz buyer API; it is registered with just name, username and API key. */
type Provider = {
  id: number;
  code: string;
  name: string;
  username: string;
  api_key_set: boolean;
  testing: boolean;
  is_active: boolean;
  is_default: boolean;
};

function ProviderActions({ s }: { s: Provider }) {
  const qc = useQueryClient();
  const balance = useMutation({
    mutationFn: () => api.get<{ balance: number }>(`/admin/providers/${s.id}/balance`),
    onSuccess: (r) => toast.success(`Saldo ${s.name}: ${formatRupiah(r.balance)}`),
    onError: (e) => toast.error(e.message),
  });
  const sync = useMutation({
    mutationFn: () => api.post<{ updated: number }>(`/admin/providers/${s.id}/sync-prices`),
    onSuccess: (r) => {
      toast.success(`${r.updated} harga modal produk diperbarui`);
      qc.invalidateQueries({ queryKey: ["admin", "/admin/products"] });
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" asChild aria-label="Import produk">
            <Link href={`/admin/providers/${s.id}/import`}>
              <Download />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Import kategori & produk dari price list</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" onClick={() => balance.mutate()} disabled={balance.isPending} aria-label="Cek saldo">
            <Wallet />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Cek saldo</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" onClick={() => sync.mutate()} disabled={sync.isPending} aria-label="Sinkron harga">
            <RefreshCw className={sync.isPending ? "animate-spin" : undefined} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Sinkronkan harga modal dari price list (berdasarkan SKU)</TooltipContent>
      </Tooltip>
    </>
  );
}

export default function ProvidersPage() {
  return (
    <CrudPage<Provider>
      title="Provider PPOB"
      description="Daftarkan provider (format API Digiflazz) cukup dengan nama, username, dan API key. Provider default dipakai untuk kategori yang tidak menentukan provider sendiri."
      singular="Provider"
      endpoint="/admin/providers"
      defaults={{ name: "", username: "", api_key: "", testing: true, is_active: true, is_default: false }}
      toForm={(s) => ({ name: s.name, username: s.username, api_key: "", testing: s.testing, is_active: s.is_active, is_default: s.is_default })}
      fields={(editing) => [
        { name: "name", label: "Nama", type: "text", required: true, placeholder: "Digiflazz", span: 2 },
        { name: "username", label: "Username", type: "text", placeholder: "username Digiflazz" },
        {
          name: "api_key",
          label: "API Key",
          type: "password",
          placeholder: editing?.api_key_set ? "•••••••• (tersimpan)" : "production / development key",
          description: editing?.api_key_set
            ? "Kosongkan untuk tetap memakai key yang tersimpan"
            : "Kosongkan username & API key untuk memakai DIGIFLAZZ_USERNAME / DIGIFLAZZ_SIGN dari .env",
        },
        { name: "testing", label: "Mode testing", type: "switch", description: "Transaksi tidak memotong saldo (pakai development key)" },
        { name: "is_active", label: "Aktif", type: "switch" },
        { name: "is_default", label: "Jadikan default", type: "switch" },
      ]}
      nameOf={(s) => s.name}
      extraActions={(s) => <ProviderActions s={s} />}
      columns={[
        {
          header: "Provider",
          cell: (s) => (
            <div>
              <p className="font-semibold">
                {s.name} {s.is_default && <Pill className="ml-1 bg-primary/15 text-primary">Default</Pill>}
              </p>
              <p className="text-xs text-muted-foreground">{s.code}</p>
            </div>
          ),
        },
        {
          header: "Username",
          cell: (s) =>
            s.username ? <span className="font-mono text-xs">{s.username}</span> : <span className="text-xs text-muted-foreground">dari .env</span>,
        },
        { header: "Mode", cell: (s) => <Pill>{s.testing ? "Testing" : "Production"}</Pill> },
        { header: "Webhook", cell: (s) => <WebhookUrl path={`/api/v1/webhooks/providers/${s.code}`} /> },
        { header: "Status", cell: (s) => <ActiveDot active={s.is_active} /> },
      ]}
    />
  );
}
