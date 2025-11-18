import { getProducts } from "@/lib/data-manager";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import AddToCartClient from "./purchase";
import ProductImageCarousel from "@/components/product-image-carousel";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const allProducts = await getProducts();
  return allProducts.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>; // <-- Next 15: Promise
}) {
  const { slug } = await params; // <-- await
  const allProducts = await getProducts();
  const product = allProducts.find((p) => p.slug === slug);
  if (!product) return notFound();

  return (
    <div className="container-honor section-padding">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <ProductImageCarousel images={product.images} productName={product.name} />
        </div>
        <div>
        <h1 className="text-2xl font-bold text-honor-text-primary">{product.name}</h1>
        <p className="text-honor-primary font-bold text-3xl mt-2">
          {formatCurrency(product.priceCents)}
        </p>
        <p className="mt-4 text-honor-text-primary leading-relaxed">{product.description}</p>

        {product.specs && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="glass-card rounded-honor p-4 border border-honor-border">
                <p className="text-xs text-honor-text-muted mb-1 uppercase tracking-wide">{k}</p>
                <p className="font-semibold text-honor-text-primary">{String(v)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs rounded-honor bg-honor-bg-light text-honor-text-secondary px-3 py-1 border border-honor-border"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Add to Cart Section - Prominent CTA */}
        <div className="mt-8 p-6 bg-honor-bg-light rounded-honor-lg border-2 border-honor-primary/20">
          <div className="mb-4">
            <p className="text-sm text-honor-text-muted mb-1">Precio Total</p>
            <p className="text-4xl font-bold text-honor-primary">
              {formatCurrency(product.priceCents)}
            </p>
          </div>
          <AddToCartClient product={product} />
          <p className="text-xs text-honor-text-muted text-center mt-3">
            ✓ Envío gratis • ✓ Garantía incluida • ✓ Stock disponible
          </p>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.name,
              image: product.images,
              brand: product.brand,
              sku: product.id,
              offers: {
                "@type": "Offer",
                priceCurrency: "USD",
                price: (product.priceCents / 100).toFixed(2),
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />
        </div>
      </div>
    </div>
  );
}
