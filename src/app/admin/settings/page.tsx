"use client";

import { PageHeader } from "@/components/admin/page-header";
import { SettingsSection } from "@/components/admin/settings/settings-section";
import { useAdminSettings } from "@/components/admin/settings/use-settings";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ICON_OPTIONS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "headset", label: "Headset CS" },
  { value: "chat", label: "Chat bubble" },
  { value: "phone", label: "Telepon" },
  { value: "send", label: "Kirim" },
];

export default function SettingsPage() {
  const { data, isLoading } = useAdminSettings();
  if (isLoading || !data) return <Skeleton className="h-96 rounded-2xl" />;

  return (
    <div>
      <PageHeader title="Pengaturan" description="Informasi global website, kontak, harga & notifikasi." />
      <Tabs defaultValue="site">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="site">Website</TabsTrigger>
          <TabsTrigger value="contact">Kontak & WhatsApp</TabsTrigger>
          <TabsTrigger value="pricing">Harga & Transaksi</TabsTrigger>
          <TabsTrigger value="notification">Notifikasi</TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <SettingsSection
            settingKey="site"
            initial={data.site}
            title="Identitas website"
            description="Nama, logo, ikon, dan informasi SEO."
            fields={[
              { name: "name", label: "Nama website", type: "text" },
              { name: "tagline", label: "Tagline", type: "text" },
              { name: "logo_url", label: "Logo", type: "image", aspect: "wide" },
              { name: "favicon_url", label: "Favicon / ikon", type: "image" },
              { name: "description", label: "Deskripsi (SEO)", type: "textarea" },
              { name: "keywords", label: "Kata kunci SEO", type: "text", span: 2 },
              { name: "footer_text", label: "Teks footer", type: "text", span: 2 },
              { name: "instagram", label: "URL Instagram", type: "text" },
              { name: "tiktok", label: "URL TikTok", type: "text" },
              { name: "youtube", label: "URL YouTube", type: "text" },
            ]}
          />
        </TabsContent>

        <TabsContent value="contact">
          <SettingsSection
            settingKey="contact"
            initial={data.contact}
            title="Kontak & tombol WhatsApp melayang"
            description="Tombol melayang untuk menghubungi admin. Ikon bisa dipilih atau diganti gambar sendiri."
            fields={[
              { name: "whatsapp_number", label: "Nomor WhatsApp admin", type: "text", placeholder: "6281234567890" },
              { name: "whatsapp_message", label: "Pesan awal", type: "text" },
              { name: "floating_enabled", label: "Tampilkan tombol melayang", type: "switch" },
              { name: "floating_icon", label: "Ikon", type: "select", options: ICON_OPTIONS },
              { name: "floating_icon_url", label: "Ikon kustom (opsional, menimpa ikon)", type: "image" },
              { name: "floating_label", label: "Label", type: "text", placeholder: "Butuh bantuan?" },
              { name: "floating_position", label: "Posisi", type: "select", options: [{ value: "right", label: "Kanan bawah" }, { value: "left", label: "Kiri bawah" }] },
              { name: "floating_color", label: "Warna tombol", type: "color" },
              { name: "email", label: "Email support", type: "text" },
              { name: "operational_hours", label: "Jam operasional", type: "text" },
              { name: "address", label: "Alamat", type: "textarea" },
            ]}
          />
        </TabsContent>

        <TabsContent value="pricing">
          <SettingsSection
            settingKey="pricing"
            initial={data.pricing}
            title="Harga & transaksi"
            description="Margin default berlaku untuk semua produk yang tidak memiliki margin kategori/produk."
            fields={[
              { name: "default_margin_percent", label: "Margin keuntungan default", type: "number", step: 0.01, suffix: "%" },
              { name: "round_to", label: "Pembulatan harga ke atas (Rp)", type: "number", description: "mis. 100 → Rp10.432 menjadi Rp10.500" },
              { name: "payment_expiry_minutes", label: "Batas waktu pembayaran", type: "number", suffix: "mnt" },
              { name: "invoice_prefix", label: "Prefix invoice", type: "text" },
            ]}
          />
        </TabsContent>

        <TabsContent value="notification">
          <SettingsSection
            settingKey="notification"
            initial={data.notification}
            title="Notifikasi pembelian"
            description="Kirim konfirmasi pesanan via Email (SMTP) dan/atau WhatsApp (gateway kompatibel Fonnte)."
            fields={[
              { name: "notify_on_created", label: "Saat pesanan dibuat", type: "switch" },
              { name: "notify_on_paid", label: "Saat pembayaran diterima", type: "switch" },
              { name: "notify_on_completed", label: "Saat pesanan selesai", type: "switch" },
              { name: "email_enabled", label: "Aktifkan Email", type: "switch" },
              { name: "smtp_host", label: "SMTP host", type: "text", hidden: (v) => !v.email_enabled },
              { name: "smtp_port", label: "SMTP port", type: "number", hidden: (v) => !v.email_enabled },
              { name: "smtp_user", label: "SMTP user", type: "text", hidden: (v) => !v.email_enabled },
              { name: "smtp_password", label: "SMTP password", type: "password", hidden: (v) => !v.email_enabled },
              { name: "smtp_from", label: "Pengirim", type: "text", placeholder: "NeoTopup <no-reply@domain.com>", hidden: (v) => !v.email_enabled },
              { name: "whatsapp_enabled", label: "Aktifkan WhatsApp", type: "switch" },
              { name: "whatsapp_api_url", label: "Endpoint API WhatsApp", type: "text", hidden: (v) => !v.whatsapp_enabled },
              { name: "whatsapp_token", label: "Token", type: "password", hidden: (v) => !v.whatsapp_enabled },
              { name: "admin_whatsapp", label: "WhatsApp admin (notif pesanan masuk)", type: "text", hidden: (v) => !v.whatsapp_enabled },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
