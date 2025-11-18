import { getProducts } from "@/lib/data-manager";
import ProductGrid from "@/components/product-grid";
import type { Product } from "@/lib/types";

type Search = { q?: string };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { q = "" } = await searchParams;

  let results: Product[] = [];
  if (q) {
    const allProducts = await getProducts();
    // Filter by available and search term
    const term = q.toLowerCase();
    results = allProducts.filter(
      (p) =>
        p.available !== false &&
        (p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          p.tags.some((t) => t.toLowerCase().includes(term)))
    );
  }

  return (
    <div className="container-honor section-padding">
      <h1 className="text-3xl font-bold text-honor-text-primary mb-2">
        Resultados de búsqueda {q && `para "${q}"`}
      </h1>
      {q && results.length > 0 && (
        <p className="text-honor-text-muted mb-8">
          Se encontraron {results.length} producto{results.length !== 1 ? 's' : ''}
        </p>
      )}
      {q ? (
        <ProductGrid items={results} />
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 opacity-30">🔍</div>
          <p className="text-honor-text-secondary text-lg">
            Escribe un término de búsqueda en la barra superior para encontrar productos.
          </p>
        </div>
      )}
    </div>
  );
}
