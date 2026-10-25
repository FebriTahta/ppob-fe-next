import Link from "next/link";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/types";

export function MembershipCard({ user }: { user: User }) {
  const m = user.membership;
  return (
    <section className="relative overflow-hidden rounded-2xl bg-brand-gradient p-5 text-white">
      <div className="absolute -top-10 -right-10 size-40 rounded-full bg-white/15 blur-xl" />
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-white/80">Level membership</p>
          <p className="flex items-center gap-2 text-2xl font-bold">
            <Crown className="size-5" /> {m ? m.name : "Reguler"}
          </p>
          <p className="text-xs text-white/80">{m ? `Margin ${m.margin_percent}% untuk setiap transaksi` : "Upgrade untuk harga lebih murah"}</p>
        </div>
        <Button asChild variant="secondary" className="bg-white text-black hover:bg-white/90">
          <Link href="/membership">{m ? "Ganti Paket" : "Upgrade"}</Link>
        </Button>
      </div>
    </section>
  );
}
