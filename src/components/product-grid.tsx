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
    <section id="productos" className="scroll-mt-20">
      {title && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gradient mb-2">{title}</h2>
          <div className="h-1 w-20 bg-gradient-primary rounded-full" />
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-muted text-lg">No se encontraron productos.</p>
        </div>
      )}
    </section>
  );
}
