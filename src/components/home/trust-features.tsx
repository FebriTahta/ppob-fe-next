import { BadgeCheck, Clock3, CreditCard, Headset } from "lucide-react";

const FEATURES = [
  { icon: Clock3, title: "Proses Instan", desc: "Otomatis dalam hitungan detik, 24/7" },
  { icon: BadgeCheck, title: "Legal & Aman", desc: "Jalur resmi, transaksi terenkripsi" },
  { icon: CreditCard, title: "Banyak Pembayaran", desc: "QRIS, e-wallet, VA & retail" },
  { icon: Headset, title: "CS Responsif", desc: "Bantuan cepat via WhatsApp" },
];

export function TrustFeatures() {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {FEATURES.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="glass flex items-start gap-3 rounded-2xl p-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
            <Icon className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
