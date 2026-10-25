import type { PublicProduct } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductOption } from "./product-option";

type Props = { products: PublicProduct[]; selectedId: number | null; onSelect: (p: PublicProduct) => void; unique?: boolean };

export function ProductPicker({ products, selectedId, onSelect, unique }: Props) {
  if (products.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">Produk belum tersedia.</p>;
  }
  return (
    // Character cards carry their full description, so they get wider columns.
    <div className={cn("grid gap-2.5", unique ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-3")}>
      {products.map((p) => (
        <ProductOption key={p.id} product={p} selected={selectedId === p.id} onSelect={() => onSelect(p)} unique={unique} />
      ))}
    </div>
  );
}
