import type { Metadata } from "next";
import { MembershipPlans } from "@/components/account/membership-plans";
import { getMembershipLevels } from "@/lib/api/server";

export const metadata: Metadata = { title: "Membership & Reseller" };

export default async function MembershipPage() {
  const levels = await getMembershipLevels();
  return (
    <div className="space-y-8 py-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Hemat lebih banyak dengan Membership
        </h1>
        <p className="mt-2 text-muted-foreground">
          Setiap level memiliki margin keuntungan lebih kecil sehingga harga semua produk otomatis lebih murah. Reseller mendapat harga terbaik untuk dijual kembali.
        </p>
      </div>
      <MembershipPlans levels={levels} />
    </div>
  );
}
