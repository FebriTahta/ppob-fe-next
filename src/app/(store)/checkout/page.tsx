import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutView } from "@/components/checkout/checkout-view";
import { Skeleton } from "@/components/ui/skeleton";
import { getPaymentMethods } from "@/lib/api/server";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const methods = await getPaymentMethods();
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>
      <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
        <CheckoutView methods={methods} />
      </Suspense>
    </div>
  );
}
