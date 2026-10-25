import type { Metadata } from "next";
import { AccountOverview } from "@/components/account/profile-forms";

export const metadata: Metadata = { title: "Akun Saya", robots: { index: false } };

export default function AccountPage() {
  return <AccountOverview />;
}
