import HeroCarousel from "@/components/hero-carousel";
import ProductGrid from "@/components/product-grid";
import { getAllProducts } from "@/lib/products";

export default function HomePage() {
  const items = getAllProducts();
  const featured = items.filter((p) => p.featured);
  return (
    <>
      <HeroCarousel />
      <ProductGrid items={featured} title="Productos Destacados" />
      <div className="mt-10">
        <ProductGrid items={items} title="Todos los Productos" />
      </div>
    </>
  );
}
