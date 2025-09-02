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
    id: "ip15-128",
    slug: "iphone-15-128",
    name: "iPhone 15 128GB",
    brand: "Apple",
    priceCents: 79900,
    images: [
      "https://images.unsplash.com/photo-1695048132832-b41495f12eb4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["A16 Bionic", "USB‑C", "Dynamic Island"],
    specs: { Storage: "128 GB", Chip: "A16 Bionic", Display: '6.1"' },
    category: "iphone",
    description: "The most essential iPhone with Dynamic Island and USB-C.",
  },
  {
    id: "ip14-pro-512",
    slug: "iphone-14-pro-512",
    name: "iPhone 14 Pro 512GB",
    brand: "Apple",
    priceCents: 129900,
    images: [
      "https://images.unsplash.com/photo-1681395791877-e7186492ad3a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["A16 Bionic", "ProRAW", "Always-On Display"],
    specs: { Storage: "512 GB", Chip: "A16 Bionic", Display: '6.1"' },
    category: "iphone",
    description:
      "Pro performance with Always-On display and advanced camera system.",
  },
  {
    id: "samsung-s24-ultra",
    slug: "samsung-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra 256GB",
    brand: "Samsung",
    priceCents: 119900,
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["Snapdragon 8 Gen 3", "S Pen", "AI Features"],
    specs: {
      Storage: "256 GB",
      Processor: "Snapdragon 8 Gen 3",
      Display: '6.8"',
    },
    featured: true,
    category: "android",
    description: "Ultimate productivity with built-in S Pen and Galaxy AI.",
  },
  {
    id: "samsung-s24-plus",
    slug: "samsung-galaxy-s24-plus",
    name: "Samsung Galaxy S24+ 512GB",
    brand: "Samsung",
    priceCents: 99900,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["Snapdragon 8 Gen 3", "120Hz", "Circle to Search"],
    specs: {
      Storage: "512 GB",
      Processor: "Snapdragon 8 Gen 3",
      Display: '6.7"',
    },
    category: "android",
    description:
      "Premium Galaxy experience with enhanced display and performance.",
  },
  {
    id: "google-pixel-8-pro",
    slug: "google-pixel-8-pro",
    name: "Google Pixel 8 Pro 256GB",
    brand: "Google",
    priceCents: 89900,
    images: [
      "https://images.unsplash.com/photo-1706412703794-d944cd3625b3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["Tensor G3", "Magic Eraser", "Pure Android"],
    specs: { Storage: "256 GB", Chip: "Google Tensor G3", Display: '6.7"' },
    featured: true,
    category: "android",
    description: "AI-powered photography and the purest Android experience.",
  },
  {
    id: "google-pixel-8",
    slug: "google-pixel-8",
    name: "Google Pixel 8 128GB",
    brand: "Google",
    priceCents: 69900,
    images: [
      "https://images.unsplash.com/photo-1730818877199-8c15b5638fbe?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["Tensor G3", "Call Screen", "Live Translate"],
    specs: { Storage: "128 GB", Chip: "Google Tensor G3", Display: '6.2"' },
    category: "android",
    description: "Smart features powered by Google AI in a compact design.",
  },
  {
    id: "oneplus-12-pro",
    slug: "oneplus-12-pro",
    name: "OnePlus 12 Pro 512GB",
    brand: "OnePlus",
    priceCents: 79900,
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["Snapdragon 8 Gen 3", "80W Charging", "OxygenOS"],
    specs: {
      Storage: "512 GB",
      Processor: "Snapdragon 8 Gen 3",
      Display: '6.82"',
    },
    category: "android",
    description:
      "Flagship performance with ultra-fast charging and smooth OxygenOS.",
  },
  {
    id: "xiaomi-14-ultra",
    slug: "xiaomi-14-ultra",
    name: "Xiaomi 14 Ultra 512GB",
    brand: "Xiaomi",
    priceCents: 89900,
    images: [
      "https://images.unsplash.com/photo-1661267990546-74312bcb1d15?q=80&w=1339&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["Snapdragon 8 Gen 3", "Leica Cameras", "120W HyperCharge"],
    specs: {
      Storage: "512 GB",
      Processor: "Snapdragon 8 Gen 3",
      Display: '6.73"',
    },
    category: "android",
    description:
      "Professional photography with Leica optics and blazing fast charging.",
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
    id: "airpods-3",
    slug: "airpods-3",
    name: "AirPods (3rd Gen)",
    brand: "Apple",
    priceCents: 17900,
    images: [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["Spatial Audio", "Adaptive EQ"],
    specs: { Case: "Lightning", "Battery Life": "30 hours" },
    category: "audio",
    description: "Spatial Audio experience with personalized sound profile.",
  },
  {
    id: "samsung-buds2-pro",
    slug: "samsung-galaxy-buds2-pro",
    name: "Samsung Galaxy Buds2 Pro",
    brand: "Samsung",
    priceCents: 22900,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["ANC", "360 Audio", "Hi-Fi 24bit"],
    specs: { "Driver Size": "10mm", "Battery Life": "29 hours" },
    category: "audio",
    description: "Intelligent ANC and immersive 360 Audio for Galaxy devices.",
  },
  {
    id: "ipad-air-m2",
    slug: "ipad-air-m2",
    name: "iPad Air (M2)",
    brand: "Apple",
    priceCents: 59900,
    images: [
      "https://images.unsplash.com/photo-1625864667534-aa5208d45a87?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["M2", "Apple Pencil Pro"],
    specs: { Chip: "M2", Display: '11"' },
    category: "tablet",
    description: "All‑day power with M2 and an ultra‑portable form factor.",
  },
  {
    id: "ipad-pro-m4-11",
    slug: "ipad-pro-m4-11",
    name: "iPad Pro 11-inch (M4)",
    brand: "Apple",
    priceCents: 99900,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["M4", "Ultra Retina XDR", "Thunderbolt"],
    specs: { Chip: "M4", Display: '11"', Storage: "256 GB" },
    featured: true,
    category: "tablet",
    description:
      "Ultimate iPad experience with M4 chip and pro-level features.",
  },
  {
    id: "ipad-pro-m4-13",
    slug: "ipad-pro-m4-13",
    name: "iPad Pro 13-inch (M4)",
    brand: "Apple",
    priceCents: 129900,
    images: [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["M4", "Ultra Retina XDR", "Magic Keyboard"],
    specs: { Chip: "M4", Display: '13"', Storage: "512 GB" },
    category: "tablet",
    description:
      "Largest and most advanced iPad with desktop-class performance.",
  },
  {
    id: "samsung-tab-s9-ultra",
    slug: "samsung-galaxy-tab-s9-ultra",
    name: "Samsung Galaxy Tab S9 Ultra",
    brand: "Samsung",
    priceCents: 119900,
    images: [
      "https://images.unsplash.com/photo-1620288650879-20db0eb38c05?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["Snapdragon 8 Gen 2", "S Pen", "14.6 Display"],
    specs: {
      Processor: "Snapdragon 8 Gen 2",
      Display: '14.6"',
      Storage: "256 GB",
    },
    featured: true,
    category: "tablet",
    description: "Massive productivity powerhouse with included S Pen.",
  },
  {
    id: "samsung-tab-s9-plus",
    slug: "samsung-galaxy-tab-s9-plus",
    name: "Samsung Galaxy Tab S9+",
    brand: "Samsung",
    priceCents: 79900,
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["Snapdragon 8 Gen 2", "AMOLED", "Water Resistant"],
    specs: {
      Processor: "Snapdragon 8 Gen 2",
      Display: '12.4"',
      Storage: "256 GB",
    },
    category: "tablet",
    description: "Premium AMOLED display with S Pen for creative work.",
  },
  {
    id: "surface-pro-9",
    slug: "microsoft-surface-pro-9",
    name: "Microsoft Surface Pro 9",
    brand: "Microsoft",
    priceCents: 99900,
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["Intel i7", "2-in-1", "Surface Pen"],
    specs: { Processor: "Intel Core i7", Display: '13"', RAM: "16 GB" },
    category: "tablet",
    description:
      "Versatile 2-in-1 laptop and tablet with full Windows experience.",
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
