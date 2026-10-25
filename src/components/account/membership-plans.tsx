"use client";

import { Check, Crown, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { formatRupiah } from "@/lib/format";
import type { MembershipLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MembershipPlans({ levels }: { levels: MembershipLevel[] }) {
  const { user } = useAuth();
  const router = useRouter();

  const choose = (l: MembershipLevel) => {
    if (!user) {
      toast.info("Masuk terlebih dahulu untuk upgrade membership");
      router.push(`/login?next=${encodeURIComponent("/membership")}`);
      return;
    }
    router.push(`/checkout?membership=${l.id}`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {levels.map((l, i) => {
        const current = user?.membership_level_id === l.id;
        const featured = i === levels.length - 1;
        const Icon = l.kind === "reseller" ? Store : Crown;
        return (
          <div key={l.id} className={cn("relative flex flex-col rounded-3xl p-6", featured ? "border-gradient glow" : "glass")}>
            {featured && (
              <span className="absolute -top-3 left-6 rounded-full bg-brand-gradient px-3 py-1 text-xs font-bold text-white">Paling Untung</span>
            )}
            <div className="mb-4 flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl text-white" style={{ backgroundColor: l.badge_color }}>
                <Icon className="size-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold">{l.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{l.kind}</p>
              </div>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">{l.description}</p>
            <p className="mb-1 font-heading text-3xl font-bold">{l.price ? formatRupiah(l.price) : "Gratis"}</p>
            <p className="mb-5 text-xs text-muted-foreground">sekali bayar · margin {l.margin_percent}%</p>
            <ul className="mb-6 space-y-2 text-sm">
              {(l.benefits ?? []).map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500" /> {b}
                </li>
              ))}
            </ul>
            <Button className={cn("mt-auto h-11", featured && "bg-brand-gradient text-white")} variant={featured ? "default" : "outline"} disabled={current} onClick={() => choose(l)}>
              {current ? "Level kamu saat ini" : "Pilih Paket"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
