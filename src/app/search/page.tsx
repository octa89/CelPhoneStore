import { searchProducts } from "@/lib/products";
import ProductGrid from "@/components/product-grid";

type Search = { q?: string };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Search>; // <-- Promise
}) {
  const { q = "" } = await searchParams; // <-- await
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
