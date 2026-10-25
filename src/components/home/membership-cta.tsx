import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MembershipCta() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-brand-gradient p-6 text-white sm:p-10">
      <div className="absolute -top-16 -right-10 size-64 rounded-full bg-white/15 blur-2xl" />
      <div className="absolute -bottom-20 left-10 size-52 rounded-full bg-black/20 blur-2xl" />
      <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            <Sparkles className="size-3.5" /> Member & Reseller
          </span>
          <h2 className="text-2xl font-bold sm:text-3xl">Harga lebih murah untuk setiap transaksi</h2>
          <p className="max-w-xl text-sm text-white/85">Upgrade membership untuk margin lebih kecil, atau jadi reseller dan dapatkan harga terbaik untuk dijual kembali.</p>
        </div>
        <Button asChild size="lg" className="h-11 bg-white px-6 text-black hover:bg-white/90">
          <Link href="/membership">
            <Crown /> Lihat Paket
          </Link>
        </Button>
      </div>
    </section>
  );
}
