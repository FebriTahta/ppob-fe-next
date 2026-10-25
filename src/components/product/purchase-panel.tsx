"use client";

import { useQuery } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api/client";
import { MULTI_QTY_TYPES, UNIQUE_LISTING_TYPES } from "@/lib/constants";
import type { CategoryDetail, PublicProduct } from "@/lib/types";
import { useCart } from "@/stores/cart-store";
import { CustomerFields, validateCustomerData } from "./customer-fields";
import { FlashDeals } from "./flash-deals";
import { ProductPicker } from "./product-picker";
import { PurchaseSummary } from "./purchase-summary";
import { StepCard } from "./step-card";

/**
 * Interactive purchase flow for one category: customer data → product → quantity → cart / buy now.
 * Server-rendered guest prices are shown first; logged-in members get their own prices re-fetched.
 */
export function PurchasePanel({ initial }: { initial: CategoryDetail }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const addToCart = useCart((s) => s.add);
  const setBuyNow = useCart((s) => s.setBuyNow);

  const { data: category = initial } = useQuery({
    queryKey: ["category", initial.slug, user?.membership_level_id ?? 0],
    queryFn: () => api.get<CategoryDetail>(`/categories/${initial.slug}`),
    initialData: user?.membership ? undefined : initial,
    enabled: !!user?.membership,
  });

  const preselect = Number(searchParams.get("product")) || null;
  const [selectedId, setSelectedId] = useState<number | null>(preselect);
  const [qty, setQty] = useState(1);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selected = useMemo(() => category.products.find((p) => p.id === selectedId) ?? null, [category, selectedId]);
  const multiQty = MULTI_QTY_TYPES.includes(category.type);
  const unique = UNIQUE_LISTING_TYPES.includes(category.type);
  const maxQty = selected ? Math.max(1, Math.min(selected.max_qty, selected.stock ?? selected.max_qty)) : 1;
  // Point Blank characters are bought directly, without an account data form.
  const hasFields = !unique && category.input_fields.length > 0;

  const select = (p: PublicProduct) => {
    setSelectedId(p.id);
    setQty((q) => Math.min(q, Math.max(1, Math.min(p.max_qty, p.stock ?? p.max_qty))));
  };

  const buildItem = () => {
    if (!selected) {
      toast.error("Pilih produk terlebih dahulu");
      return null;
    }
    const errs = validateCustomerData(category.input_fields, values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error("Lengkapi data akun terlebih dahulu");
      document.getElementById("step-account")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return null;
    }
    const data = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()]).filter(([, v]) => v));
    return {
      productId: selected.id,
      productName: selected.name,
      categoryName: category.name,
      categorySlug: category.slug,
      categoryType: category.type,
      image: selected.image_url || category.image_url,
      unitPrice: selected.price,
      qty: multiQty ? qty : 1,
      maxQty: multiQty ? maxQty : 1,
      isPreorder: selected.is_preorder,
      customerData: data,
      customerLabels: Object.fromEntries(category.input_fields.map((f) => [f.key, f.label])),
    };
  };

  const onAddToCart = () => {
    const item = buildItem();
    if (!item) return;
    const res = addToCart(item);
    if (res === "limit") toast.warning("Item yang sama sudah ada di keranjang");
    else
      toast.success("Ditambahkan ke keranjang", {
        action: { label: "Lihat", onClick: () => router.push("/cart") },
      });
  };

  const onBuyNow = () => {
    const item = buildItem();
    if (!item) return;
    setBuyNow(item);
    router.push("/checkout?mode=buynow");
  };

  let step = 1;
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5 pb-36 lg:pb-0">
        <FlashDeals products={category.products} selectedId={selectedId} onSelect={select} />
        {hasFields && (
          <div id="step-account">
            <StepCard step={step++} title="Masukkan Data Akun" description="Pastikan data yang dimasukkan sudah benar">
              <CustomerFields
                fields={category.input_fields}
                values={values}
                errors={errors}
                onChange={(k, v) => {
                  setValues((s) => ({ ...s, [k]: v }));
                  if (errors[k]) setErrors(({ [k]: _removed, ...rest }) => rest);
                }}
              />
            </StepCard>
          </div>
        )}
        <StepCard
          step={step++}
          title={category.type === "game_topup" ? "Pilih Nominal" : unique ? "Pilih Karakter" : "Pilih Produk"}
          description={user?.membership ? `Harga khusus ${user.membership.name} aktif` : undefined}
        >
          <ProductPicker products={category.products} selectedId={selectedId} onSelect={select} unique={unique} />
          {unique && (
            // The character's login is never public; the admin hands it over once the order is paid.
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3.5 shrink-0" />
              Data login karakter dikirim admin setelah pembayaran berhasil.
            </p>
          )}
          {selected?.is_preorder && selected.preorder_note && (
            <p className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
              Pre-Order: {selected.preorder_note}
            </p>
          )}
        </StepCard>
        {multiQty && (
          <StepCard step={step++} title="Jumlah Pembelian" description={selected ? `Maksimal ${maxQty} per transaksi` : "Pilih produk dahulu"}>
            <QuantityStepper value={qty} max={maxQty} onChange={setQty} />
          </StepCard>
        )}
      </div>
      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <PurchaseSummary
            variant="card"
            product={selected}
            qty={multiQty ? qty : 1}
            memberLabel={user?.membership ? `Harga ${user.membership.name}` : undefined}
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
          />
        </div>
      </aside>
      <PurchaseSummary variant="bar" product={selected} qty={multiQty ? qty : 1} onAddToCart={onAddToCart} onBuyNow={onBuyNow} />
    </div>
  );
}
