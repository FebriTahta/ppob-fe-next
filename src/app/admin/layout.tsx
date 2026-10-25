import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSettings } from "@/lib/api/server";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false } };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const { site } = await getSettings();
  return (
    <SidebarProvider>
      <Suspense>
        <AdminSidebar siteName={site.name} />
      </Suspense>
      <SidebarInset>
        <AdminTopbar />
        <div className="flex-1 p-4 sm:p-6">
          <AdminGuard>{children}</AdminGuard>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
