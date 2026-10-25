import type { Metadata } from "next";
import { Suspense } from "react";
import { InvoiceView } from "@/components/invoice/invoice-view";
import { Skeleton } from "@/components/ui/skeleton";
import { getSettings } from "@/lib/api/server";

export const metadata: Metadata = { title: "Invoice", robots: { index: false } };

export default function InvoicePage({ params }: PageProps<"/invoice/[invoice]">) {
  return (
    <Suspense fallback={<Skeleton className="mx-auto h-96 max-w-3xl rounded-2xl" />}>
      <InvoiceContent params={params} />
    </Suspense>
  );
}

async function InvoiceContent({ params }: Pick<PageProps<"/invoice/[invoice]">, "params">) {
  const [{ invoice }, { contact }] = await Promise.all([params, getSettings()]);
  return <InvoiceView invoice={decodeURIComponent(invoice).toUpperCase()} contact={contact} />;
}
