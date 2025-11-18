import HeroCarousel from "@/components/hero-carousel";
import ProductGrid from "@/components/product-grid";
import { getProducts } from "@/lib/data-manager";

export default async function HomePage() {
  const allProducts = await getProducts();

  // Filter only available products for the main page
  const items = allProducts.filter((p) => p.available !== false);
  const featured = items.filter((p) => p.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Featured Products Section */}
      {featured.length > 0 && (
        <div className="container-honor section-padding">
          <ProductGrid items={featured} title="Productos Destacados" />
        </div>
      )}

      {/* All Products Section */}
      <div className="container-honor section-padding">
        <ProductGrid items={items} title="Catálogo Completo" />
      </div>
    </div>
  );
}
