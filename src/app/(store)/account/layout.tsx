import { Suspense } from "react";
import { AccountTabs } from "@/components/account/account-tabs";

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold sm:text-3xl">Akun Saya</h1>
      <Suspense>
        <AccountTabs />
      </Suspense>
      {children}
    </div>
  );
}
