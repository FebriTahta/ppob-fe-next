"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut, ReceiptText, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { initials } from "@/lib/format";

export function UserMenu() {
  const { user, isAdmin, isLoading } = useAuth();
  const logout = useLogout();

  if (isLoading) return <div className="size-8 animate-pulse rounded-full bg-muted" />;
  if (!user) {
    return (
      <Button asChild size="sm" className="bg-brand-gradient text-white">
        <Link href="/login">Masuk</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full ring-2 ring-primary/40 ring-offset-2 ring-offset-background" aria-label="Menu akun">
          <Avatar className="size-8">
            <AvatarFallback className="bg-brand-gradient text-xs font-bold text-white">{initials(user.name)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="truncate font-semibold">{user.name}</div>
          <div className="truncate text-xs font-normal text-muted-foreground">{user.email}</div>
          {user.membership && (
            <span
              className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
              style={{ backgroundColor: user.membership.badge_color }}
            >
              {user.membership.name}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <LayoutDashboard /> Dashboard Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/account">
            <UserRound /> Akun Saya
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/orders">
            <ReceiptText /> Riwayat Transaksi
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={logout}>
          <LogOut /> Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
