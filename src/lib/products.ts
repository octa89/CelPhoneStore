import type { Product } from "./types";

export const products: Product[] = [
  {
    id: "ip15-pro-256",
    slug: "iphone-15-pro-256",
    name: "iPhone 15 Pro 256GB",
    brand: "Apple",
    priceCents: 119900,
    images: [
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1570125412935-688dd0989229?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["A17 Pro", "Titanium", "USB‑C"],
    specs: { Storage: "256 GB", Chip: "A17 Pro", Display: '6.1"' },
    featured: true,
    category: "iphone",
    description:
      "Blazing performance with the A17 Pro, titanium build, and Pro camera system.",
  },
  {
    id: "airpods-pro2",
    slug: "airpods-pro-2",
    name: "AirPods Pro (2nd Gen)",
    brand: "Apple",
    priceCents: 24900,
    images: [
      "https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["ANC", "Spatial Audio"],
    specs: { Chip: "H2", Case: "USB‑C" },
    category: "audio",
    description: "Premium noise cancellation and richer, immersive sound.",
  },
  {
    id: "ipad-air-m2",
    slug: "ipad-air-m2",
    name: "iPad Air (M2)",
    brand: "Apple",
    priceCents: 59900,
    images: [
      "https://images.unsplash.com/photo-1625864667534-aa5208d45a87?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["M2", "Apple Pencil Pro"],
    specs: { Chip: "M2", Display: '11"' },
    category: "tablet",
    description: "All‑day power with M2 and an ultra‑portable form factor.",
  },
];

export function getAllProducts() {
  return products;
}
export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug) || null;
}
export function searchProducts(q: string) {
  const term = q.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.tags.some((t) => t.toLowerCase().includes(term))
  );
}
