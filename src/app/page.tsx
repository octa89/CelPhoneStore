import Hero from "@/components/hero";
import ProductGrid from "@/components/product-grid";
import { getAllProducts } from "@/lib/products";

export default function HomePage() {
  const items = getAllProducts();
  const featured = items.filter((p) => p.featured);
  return (
    <>
      <Hero />
      <ProductGrid items={featured} title="Featured Products" />
      <div className="mt-10">
        <ProductGrid items={items} title="All Products" />
      </div>
    </>
  );
}
