"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

/**
 * UX guard for admin pages. Children render immediately (the proxy already requires a session and the
 * Go API enforces the admin role on every request); non-admins see an access-denied screen once known.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth();
  if (!isLoading && !isAdmin) {
    return (
      <EmptyState
        icon={<ShieldAlert />}
        title="Akses ditolak"
        description="Halaman ini khusus administrator."
        action={
          <Button asChild>
            <Link href={user ? "/" : "/login?next=/admin"}>{user ? "Kembali ke Beranda" : "Masuk sebagai Admin"}</Link>
          </Button>
        }
      />
    );
  }
  return <>{children}</>;
}
