import ProductCard from "./product-card";
import type { Product } from "@/lib/types";

export default function ProductGrid({
  items,
  title,
}: {
  items: Product[];
  title?: string;
}) {
  return (
    <section>
      {title && (
        <h2 id="featured" className="text-xl font-semibold mb-4">
          {title}
        </h2>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
