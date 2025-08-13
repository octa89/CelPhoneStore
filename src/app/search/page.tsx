import { searchProducts } from "@/lib/products";
import ProductGrid from "@/components/product-grid";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.toString() || "";
  const results = q ? searchProducts(q) : [];
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Search {q && `“${q}”`}</h1>
      {q ? (
        <ProductGrid items={results} />
      ) : (
        <p>Type a search term in the navbar.</p>
      )}
    </div>
  );
}
