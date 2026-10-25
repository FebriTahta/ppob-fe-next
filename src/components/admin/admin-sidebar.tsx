"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Zap } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { ADMIN_NAV } from "./admin-nav";

export function AdminSidebar({ siteName }: { siteName: string }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <Link href="/admin" className="flex items-center gap-2 px-2 py-1.5 font-heading font-bold">
          <span className="grid size-8 place-items-center rounded-lg bg-brand-gradient text-white">
            <Zap className="size-4 fill-current" />
          </span>
          <span className="truncate">{siteName} Admin</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {ADMIN_NAV.map((g) => (
          <SidebarGroup key={g.group}>
            <SidebarGroupLabel>{g.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map(({ href, label, icon: Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild isActive={isActive(href)} onClick={() => setOpenMobile(false)}>
                      <Link href={href}>
                        <Icon /> <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" target="_blank">
                <ExternalLink /> <span>Lihat Website</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
