"use client";

import { ImageUp, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api/client";

type Props = { value: string; onChange: (url: string) => void; aspect?: "square" | "wide" };

/** Uploads an image to the API (or accepts a URL) and previews it. */
export function ImageUpload({ value, onChange, aspect = "square" }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) return toast.error("Ukuran maksimal 5MB");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post<{ url: string }>("/admin/uploads", fd);
      onChange(res.url);
      toast.success("Gambar diunggah");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload gagal");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`relative grid shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed bg-muted/40 hover:border-primary ${aspect === "wide" ? "h-20 w-36" : "size-20"}`}
        aria-label="Unggah gambar"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="size-full object-cover" />
        ) : busy ? (
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        ) : (
          <ImageUp className="size-5 text-muted-foreground" />
        )}
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… atau unggah file" className="h-9" />
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => ref.current?.click()} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <ImageUp />} Unggah
          </Button>
          {value && (
            <Button type="button" size="sm" variant="ghost" onClick={() => onChange("")}>
              <X /> Hapus
            </Button>
          )}
        </div>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/x-icon"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
