import type { Metadata } from "next";
import { TrackForm } from "@/components/invoice/track-form";

export const metadata: Metadata = { title: "Lacak Pesanan" };

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Lacak Pesanan
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Masukkan nomor invoice yang dikirim ke WhatsApp/email kamu.</p>
      </div>
      <TrackForm />
    </div>
  );
}
