"use client";

import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth, useLogout } from "@/hooks/use-auth";

export function AdminTopbar() {
  const { user } = useAuth();
  const logout = useLogout();
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mx-1 h-5" />
      <span className="text-sm text-muted-foreground">Halo, {user?.name ?? "Admin"}</span>
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut /> Keluar
        </Button>
      </div>
    </header>
  );
}
