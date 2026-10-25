"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyButton({ value, label = "Disalin" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      type="button"
      size="icon-sm"
      variant="ghost"
      aria-label="Salin"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setDone(true);
        toast.success(label);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? <Check className="text-emerald-500" /> : <Copy />}
    </Button>
  );
}
