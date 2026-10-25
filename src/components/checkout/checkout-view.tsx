"use client";

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Lock, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { StepCard } from "@/components/product/step-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useMounted } from "@/hooks/use-mounted";
import { api, ApiError } from "@/lib/api/client";
import type { CheckoutPayload, PaymentMethod, Quote } from "@/lib/types";
import { useCart } from "@/stores/cart-store";
import { useRecentOrders } from "@/stores/recent-orders-store";
import { CheckoutLines } from "./checkout-lines";
import { type Contact, ContactFields } from "./contact-fields";
import { CouponInput } from "./coupon-input";
import { OrderTotals } from "./order-totals";
import { PaymentMethodPicker } from "./payment-method-picker";

type CreateResult = { invoice: string; payment_url: string; total: number };

/**
 * Checkout supports three sources: the cart, a single "buy now" item, or a membership upgrade (?membership=ID).
 * Prices are always re-quoted by the server; the client never decides the amount.
 */
export function CheckoutView({ methods }: { methods: PaymentMethod[] }) {
  const mounted = useMounted();
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useAuth();
  const cart = useCart();
  const recent = useRecentOrders();

  const mode = params.get("mode") === "buynow" ? "buynow" : "cart";
  const membershipId = Number(params.get("membership")) || null;
  const source = useMemo(
    () => (membershipId ? [] : mode === "buynow" && cart.buyNow ? [cart.buyNow] : cart.items),
    [membershipId, mode, cart.buyNow, cart.items],
  );

  const [methodId, setMethodId] = useState<number | null>(null);
  const [coupon, setCoupon] = useState("");
  const [draft, setContact] = useState<Contact>(recent.contact);
  // Logged-in users get their profile as default contact without overwriting what they typed.
  const contact: Contact = {
    name: draft.name || user?.name || "",
    phone: draft.phone || user?.phone || "",
    email: draft.email || user?.email || "",
  };
  const [errors, setErrors] = useState<Partial<Record<keyof Contact, string>>>({});

  const labels = useMemo(() => Object.assign({}, ...source.map((s) => s.customerLabels)), [source]);
  const payload: CheckoutPayload = useMemo(
    () => ({
      items: source.map((s) => ({ product_id: s.productId, qty: s.qty, customer_data: s.customerData })),
      membership_level_id: membershipId,
      payment_method_id: methodId ?? undefined,
      coupon_code: coupon || undefined,
    }),
    [source, membershipId, methodId, coupon],
  );
  const hasItems = payload.items.length > 0 || !!membershipId;

  const quote = useQuery({
    queryKey: ["quote", payload],
    queryFn: () => api.post<Quote>("/checkout/quote", payload),
    enabled: mounted && hasItems,
    placeholderData: keepPreviousData,
    retry: false,
  });

  const create = useMutation({
    mutationFn: (body: CheckoutPayload) => api.post<CreateResult>("/orders", body),
    onSuccess: (res) => {
      recent.push({ invoice: res.invoice, total: res.total, createdAt: new Date().toISOString() });
      recent.setContact(contact);
      if (membershipId) {
        /* nothing to clear */
      } else if (mode === "buynow") cart.setBuyNow(null);
      else cart.clear();
      const internal = res.payment_url.includes(`/invoice/${res.invoice}`);
      if (internal || !res.payment_url) router.push(`/invoice/${res.invoice}`);
      else window.location.href = res.payment_url;
    },
    onError: (e) => toast.error(e.message),
  });

  if (!mounted) return <Skeleton className="h-96 rounded-2xl" />;
  if (!hasItems) {
    return (
      <EmptyState
        icon={<ShoppingBag />}
        title="Tidak ada item untuk dibayar"
        description="Pilih produk terlebih dahulu."
        action={
          <Button asChild>
            <Link href="/games">Pilih Produk</Link>
          </Button>
        }
      />
    );
  }

  const submit = () => {
    const errs: typeof errors = {};
    if (!contact.phone.trim() && !contact.email.trim()) errs.phone = "Isi nomor WhatsApp atau email";
    if (contact.email && !/^\S+@\S+\.\S+$/.test(contact.email)) errs.email = "Format email tidak valid";
    setErrors(errs);
    if (Object.keys(errs).length) return toast.error(Object.values(errs)[0]);
    if (!methodId) return toast.error("Pilih metode pembayaran");
    if (quote.data?.coupon_error) return toast.error(quote.data.coupon_error);
    create.mutate({ ...payload, name: contact.name, phone: contact.phone.trim(), email: contact.email.trim() });
  };

  const amount = quote.data ? quote.data.subtotal - quote.data.discount : 0;
  const quoteError = quote.error instanceof ApiError ? quote.error.message : null;

  return (
    <div className="grid gap-5 pb-24 lg:grid-cols-[1fr_380px] lg:pb-0">
      <div className="space-y-5">
        <StepCard step={1} title="Detail Pesanan">
          {quote.isLoading ? <Skeleton className="h-24" /> : quoteError ? <p className="text-sm text-destructive">{quoteError}</p> : <CheckoutLines lines={quote.data?.lines ?? []} labels={labels} />}
        </StepCard>
        <StepCard step={2} title="Kontak" description="Untuk notifikasi & bukti pembelian">
          <ContactFields value={contact} onChange={setContact} errors={errors} />
        </StepCard>
        <StepCard step={3} title="Metode Pembayaran">
          {methods.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada metode pembayaran aktif.</p>
          ) : (
            <PaymentMethodPicker methods={methods} amount={amount} value={methodId} onChange={setMethodId} />
          )}
        </StepCard>
      </div>
      <aside>
        <div className="glass sticky top-20 space-y-5 rounded-2xl p-5">
          <h2 className="font-semibold">Ringkasan Pembayaran</h2>
          <CouponInput applied={coupon} error={quote.data?.coupon_error} discount={quote.data?.discount ?? 0} onApply={setCoupon} loading={quote.isFetching} />
          <OrderTotals quote={quote.data} />
          <Button size="lg" className="h-12 w-full bg-brand-gradient text-base text-white glow" onClick={submit} disabled={create.isPending || !!quoteError || quote.isLoading}>
            {create.isPending ? <Loader2 className="animate-spin" /> : <Lock />} Bayar Sekarang
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">Dengan membayar, kamu menyetujui syarat & ketentuan yang berlaku.</p>
        </div>
      </aside>
    </div>
  );
}
