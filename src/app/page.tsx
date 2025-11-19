import HeroCarousel from "@/components/hero-carousel";
import ProductGrid from "@/components/product-grid";
import { getProducts } from "@/lib/data-manager";

export default async function HomePage() {
  const allProducts = await getProducts();

  // Sort by displayOrder first, then by name
  const sortedProducts = allProducts.sort((a, b) => {
    const orderA = a.displayOrder ?? 999;
    const orderB = b.displayOrder ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return a.name.localeCompare(b.name);
  });

  // Filter only available products for the main page
  const items = sortedProducts.filter((p) => p.available !== false);
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
