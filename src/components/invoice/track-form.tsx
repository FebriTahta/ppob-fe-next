"use client";

import { ReceiptText, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMounted } from "@/hooks/use-mounted";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { useRecentOrders } from "@/stores/recent-orders-store";

export function TrackForm() {
  const router = useRouter();
  const [inv, setInv] = useState("");
  const mounted = useMounted();
  const recent = useRecentOrders((s) => s.orders);

  return (
    <div className="space-y-6">
      <form
        className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (inv.trim()) router.push(`/invoice/${encodeURIComponent(inv.trim().toUpperCase())}`);
        }}
      >
        <div className="relative flex-1">
          <ReceiptText className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={inv} onChange={(e) => setInv(e.target.value)} placeholder="Contoh: INV2610124X7KQ9" className="h-12 pl-9 font-mono uppercase" aria-label="Nomor invoice" />
        </div>
        <Button type="submit" size="lg" className="h-12 bg-brand-gradient px-6 text-white">
          <Search /> Lacak
        </Button>
      </form>

      {mounted && recent.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Pesanan terakhir di perangkat ini</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {recent.map((o) => (
              <li key={o.invoice}>
                <Link href={`/invoice/${o.invoice}`} className="glass flex items-center justify-between rounded-xl p-3 hover:glow">
                  <div>
                    <p className="font-mono text-sm font-semibold">{o.invoice}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(o.createdAt)}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatRupiah(o.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
