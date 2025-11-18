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
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <ProductImageCarousel images={product.images} productName={product.name} />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-fuchsia-300 mt-1">
          {formatCurrency(product.priceCents)}
        </p>
        <p className="mt-3 text-neutral-300">{product.description}</p>

        {product.specs && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="glass ringed rounded-lg p-3">
                <p className="text-xs text-neutral-400">{k}</p>
                <p className="font-medium">{String(v)}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <AddToCartClient product={product} />
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
  );
}
