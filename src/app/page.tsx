import Hero from "@/components/hero";
import ProductGrid from "@/components/product-grid";
import { getAllProducts } from "@/lib/products";

export default function HomePage() {
  const items = getAllProducts();
  const featured = items.filter((p) => p.featured || p.category === "iphone");
  return (
    <>
      <Hero />
      <ProductGrid items={featured} title="Featured" />
      <div className="mt-10">
        <ProductGrid items={items} title="All products" />
      </div>
    </>
  );
}
