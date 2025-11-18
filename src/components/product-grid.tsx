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
    <section id="productos" className="section-padding scroll-mt-20">
      {title && (
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-honor-text-primary mb-4">
            {title}
          </h2>
          <p className="text-lg text-honor-text-secondary max-w-2xl mx-auto">
            Descubre nuestra selección premium de smartphones y accesorios
          </p>
        </div>
      )}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
        {items
          .filter((p) => p.available !== false) // Only show available products
          .map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-20">
          <p className="text-honor-text-secondary text-lg">
            No se encontraron productos que coincidan con tu búsqueda.
          </p>
        </div>
      )}
    </section>
  );
}
