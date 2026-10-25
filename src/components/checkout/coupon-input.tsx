"use client";

import { BadgePercent, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = { applied: string; error?: string; discount: number; onApply: (code: string) => void; loading?: boolean };

export function CouponInput({ applied, error, discount, onApply, loading }: Props) {
  const [code, setCode] = useState(applied);
  const ok = applied && !error && discount > 0;
  return (
    <div className="space-y-2">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onApply(code.trim().toUpperCase());
        }}
      >
        <div className="relative flex-1">
          <BadgePercent className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Kode kupon" className="h-10 pl-9 uppercase" />
        </div>
        {applied ? (
          <Button
            type="button"
            variant="outline"
            className="h-10"
            onClick={() => {
              setCode("");
              onApply("");
            }}
          >
            <X /> Hapus
          </Button>
        ) : (
          <Button type="submit" className="h-10" disabled={!code.trim() || loading}>
            Pakai
          </Button>
        )}
      </form>
      {applied && error && <p className="text-xs text-destructive">{error}</p>}
      {ok && <p className="text-xs text-emerald-500">Kupon {applied} berhasil dipakai 🎉</p>}
    </div>
  );
}
