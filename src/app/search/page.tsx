import { getProducts } from "@/lib/data-manager";
import ProductGrid from "@/components/product-grid";

type Search = { q?: string };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { q = "" } = await searchParams;

  let results = [];
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
    <div>
      <h1 className="text-xl font-semibold mb-4">Buscar {q && `"${q}"`}</h1>
      {q ? (
        <ProductGrid items={results} />
      ) : (
        <p>Escribe un término de búsqueda en la barra superior.</p>
      )}
    </div>
  );
}
