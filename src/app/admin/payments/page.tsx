"use client";

import { ActiveDot, Pill, Thumb } from "@/components/admin/cells";
import { CrudPage } from "@/components/admin/crud-page";
import { DriverConfig } from "@/components/admin/driver-config";
import { useOptions } from "@/components/admin/use-options";
import { WebhookUrl } from "@/components/admin/webhook-url";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PAYMENT_GROUPS } from "@/lib/constants";
import { formatRupiah } from "@/lib/format";
import { TAGS } from "@/lib/tags";
import type { PaymentMethod } from "@/lib/types";

type Gateway = { id: number; code: string; name: string; driver: string; config: Record<string, unknown>; is_sandbox: boolean; is_active: boolean };

const DRIVERS = [
  { value: "midtrans", label: "Midtrans (Snap)" },
  { value: "xendit", label: "Xendit (Invoice)" },
  { value: "demo", label: "Demo (simulasi)" },
];

function Gateways() {
  return (
    <CrudPage<Gateway>
      title="Payment Gateway"
      description="Gateway pembayaran. Daftarkan URL webhook di dashboard masing-masing gateway."
      singular="Gateway"
      endpoint="/admin/payment-gateways"
      revalidate={[TAGS.payments]}
      defaults={{ code: "", name: "", driver: "midtrans", config: {}, is_sandbox: true, is_active: true }}
      fields={[
        { name: "name", label: "Nama", type: "text", required: true },
        { name: "code", label: "Kode unik", type: "text", required: true },
        { name: "driver", label: "Driver", type: "select", options: DRIVERS },
        { name: "config", label: "Kredensial", type: "custom", render: (v, onChange, values) => <DriverConfig driver={String(values.driver)} value={v} onChange={onChange} /> },
        { name: "is_sandbox", label: "Mode sandbox", type: "switch" },
        { name: "is_active", label: "Aktif", type: "switch" },
      ]}
      nameOf={(g) => g.name}
      columns={[
        { header: "Gateway", cell: (g) => <div><p className="font-semibold">{g.name}</p><p className="text-xs text-muted-foreground">{g.code}</p></div> },
        { header: "Driver", cell: (g) => <Pill>{g.driver}{g.is_sandbox ? " · sandbox" : ""}</Pill> },
        { header: "Webhook", cell: (g) => (g.driver === "demo" ? <span className="text-xs text-muted-foreground">-</span> : <WebhookUrl path={`/api/v1/webhooks/payments/${g.code}`} />) },
        { header: "Status", cell: (g) => <ActiveDot active={g.is_active} /> },
      ]}
    />
  );
}

function Methods() {
  const gateways = useOptions<Gateway>("/admin/payment-gateways", (g) => g.name);
  return (
    <CrudPage<PaymentMethod>
      title="Metode Pembayaran"
      description="Channel yang ditampilkan saat checkout. Kode channel harus sesuai dengan kode di gateway (mis. Midtrans: gopay, bca_va, other_qris; Xendit: OVO, BNI, QRIS)."
      singular="Metode"
      endpoint="/admin/payment-methods"
      revalidate={[TAGS.payments]}
      defaults={{ gateway_id: null, code: "", name: "", group_name: "ewallet", image_url: "", fee_flat: 0, fee_percent: 0, min_amount: 0, max_amount: 0, sort_order: 0, is_active: true }}
      fields={[
        { name: "gateway_id", label: "Gateway", type: "select", options: gateways, numeric: true, required: true },
        { name: "group_name", label: "Grup", type: "select", options: Object.entries(PAYMENT_GROUPS).map(([value, label]) => ({ value, label })) },
        { name: "name", label: "Nama tampilan", type: "text", required: true },
        { name: "code", label: "Kode channel", type: "text", required: true },
        { name: "fee_flat", label: "Biaya tetap (Rp)", type: "number" },
        { name: "fee_percent", label: "Biaya persen", type: "number", step: 0.01, suffix: "%" },
        { name: "min_amount", label: "Min. transaksi (Rp)", type: "number" },
        { name: "max_amount", label: "Maks. transaksi (Rp)", type: "number", description: "0 = tanpa batas" },
        { name: "image_url", label: "Logo", type: "image" },
        { name: "sort_order", label: "Urutan", type: "number" },
        { name: "is_active", label: "Aktif", type: "switch" },
      ]}
      nameOf={(m) => m.name}
      columns={[
        { header: "Metode", cell: (m) => <div className="flex items-center gap-3"><Thumb name={m.name} src={m.image_url} /><div><p className="font-semibold">{m.name}</p><p className="text-xs text-muted-foreground">{m.code}</p></div></div> },
        { header: "Gateway", cell: (m) => <Pill>{m.gateway_code}</Pill> },
        { header: "Grup", cell: (m) => PAYMENT_GROUPS[m.group_name] },
        { header: "Biaya", cell: (m) => <span className="text-xs">{formatRupiah(m.fee_flat)} + {m.fee_percent}%</span> },
        { header: "Status", cell: (m) => <ActiveDot active={m.is_active} /> },
      ]}
    />
  );
}

export default function PaymentsPage() {
  return (
    <Tabs defaultValue="methods">
      <TabsList className="mb-4">
        <TabsTrigger value="methods">Metode Pembayaran</TabsTrigger>
        <TabsTrigger value="gateways">Gateway</TabsTrigger>
      </TabsList>
      <TabsContent value="methods"><Methods /></TabsContent>
      <TabsContent value="gateways"><Gateways /></TabsContent>
    </Tabs>
  );
}
