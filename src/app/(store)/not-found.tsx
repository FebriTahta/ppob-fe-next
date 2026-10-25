import Link from "next/link";
import { Ghost } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="py-16">
      <EmptyState
        icon={<Ghost />}
        title="Halaman tidak ditemukan"
        description="Halaman yang kamu cari tidak ada atau sudah dipindahkan."
        action={
          <Button asChild className="bg-brand-gradient text-white">
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        }
      />
    </div>
  );
}
