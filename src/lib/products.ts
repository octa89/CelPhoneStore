import type { Product } from "./types";

export const products: Product[] = [
  {
    id: "samsung-s24-ultra",
    slug: "samsung-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra 256GB",
    brand: "Samsung",
    priceCents: 119900,
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["Snapdragon 8 Gen 3", "S Pen", "Galaxy AI"],
    specs: {
      Almacenamiento: "256 GB",
      Procesador: "Snapdragon 8 Gen 3",
      Pantalla: '6.8"',
    },
    featured: true,
    category: "android",
    description: "Máxima productividad con S Pen integrado y Galaxy AI.",
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
      Almacenamiento: "512 GB",
      Procesador: "Snapdragon 8 Gen 3",
      Pantalla: '6.7"',
    },
    category: "android",
    description:
      "Experiencia Galaxy premium con pantalla mejorada y alto rendimiento.",
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
    tags: ["Tensor G3", "Magic Eraser", "Android Puro"],
    specs: {
      Almacenamiento: "256 GB",
      Chip: "Google Tensor G3",
      Pantalla: '6.7"',
    },
    featured: true,
    category: "android",
    description: "Fotografía con IA y la experiencia Android más pura.",
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
    tags: ["Tensor G3", "Filtrado de Llamadas", "Traducción en Vivo"],
    specs: {
      Almacenamiento: "128 GB",
      Chip: "Google Tensor G3",
      Pantalla: '6.2"',
    },
    category: "android",
    description: "Funciones inteligentes con IA de Google en diseño compacto.",
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
    tags: ["Snapdragon 8 Gen 3", "Carga 80W", "OxygenOS"],
    specs: {
      Almacenamiento: "512 GB",
      Procesador: "Snapdragon 8 Gen 3",
      Pantalla: '6.82"',
    },
    category: "android",
    description:
      "Rendimiento flagship con carga ultrarrápida y OxygenOS fluido.",
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
    tags: ["Snapdragon 8 Gen 3", "Cámaras Leica", "Carga 120W"],
    specs: {
      Almacenamiento: "512 GB",
      Procesador: "Snapdragon 8 Gen 3",
      Pantalla: '6.73"',
    },
    category: "android",
    description:
      "Fotografía profesional con ópticas Leica y carga ultrarrápida de 120W.",
  },
  {
    id: "honor-magic-6-lite",
    slug: "honor-magic-6-lite",
    name: "Honor Magic 6 Lite 256GB",
    brand: "Honor",
    priceCents: 39900,
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["Snapdragon 6 Gen 1", "Pantalla AMOLED", "Carga 35W"],
    specs: {
      Almacenamiento: "256 GB",
      Procesador: "Snapdragon 6 Gen 1",
      Pantalla: '6.78"',
      RAM: "8 GB",
    },
    featured: true,
    category: "android",
    description:
      "Excelente relación calidad-precio con pantalla AMOLED de 120Hz y diseño elegante.",
  },
  {
    id: "honor-90",
    slug: "honor-90",
    name: "Honor 90 512GB",
    brand: "Honor",
    priceCents: 54900,
    images: [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["Snapdragon 7 Gen 1", "Cámara 200MP", "Carga 66W"],
    specs: {
      Almacenamiento: "512 GB",
      Procesador: "Snapdragon 7 Gen 1",
      Pantalla: '6.7"',
      RAM: "12 GB",
    },
    category: "android",
    description:
      "Cámara principal de 200MP y pantalla AMOLED curva con tasa de refresco de 120Hz.",
  },
  {
    id: "honor-x9b",
    slug: "honor-x9b",
    name: "Honor X9b 256GB",
    brand: "Honor",
    priceCents: 42900,
    images: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=2565&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["Snapdragon 6 Gen 1", "Pantalla Resistente", "Batería 5800mAh"],
    specs: {
      Almacenamiento: "256 GB",
      Procesador: "Snapdragon 6 Gen 1",
      Pantalla: '6.78"',
      Batería: "5800 mAh",
    },
    category: "android",
    description:
      "Diseño ultra-resistente con pantalla antigolpes y batería de larga duración.",
  },
  {
    id: "xiaomi-14t-pro",
    slug: "xiaomi-14t-pro",
    name: "Xiaomi 14T Pro 512GB",
    brand: "Xiaomi",
    priceCents: 74900,
    images: [
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["Dimensity 9300+", "Cámaras Leica", "Carga 120W"],
    specs: {
      Almacenamiento: "512 GB",
      Procesador: "Dimensity 9300+",
      Pantalla: '6.67"',
      RAM: "12 GB",
    },
    featured: true,
    category: "android",
    description:
      "Potencia extrema con procesador MediaTek de última generación y sistema de cámaras Leica.",
  },
  {
    id: "redmi-note-13-pro-plus",
    slug: "redmi-note-13-pro-plus",
    name: "Redmi Note 13 Pro+ 256GB",
    brand: "Xiaomi",
    priceCents: 44900,
    images: ["https://m.media-amazon.com/images/I/61EtI-x8JML.jpg"],
    tags: ["Dimensity 7200", "Cámara 200MP", "Carga 120W"],
    specs: {
      Almacenamiento: "256 GB",
      Procesador: "Dimensity 7200 Ultra",
      Pantalla: '6.67"',
      RAM: "8 GB",
    },
    category: "android",
    description:
      "El mejor Redmi Note con cámara de 200MP y carga rápida de 120W.",
  },
  {
    id: "poco-f6",
    slug: "poco-f6",
    name: "POCO F6 512GB",
    brand: "Xiaomi",
    priceCents: 49900,
    images: [
      "https://images.unsplash.com/photo-1568171284620-57dc85d9f210?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    tags: ["Snapdragon 8s Gen 3", "Gaming", "Carga 90W"],
    specs: {
      Almacenamiento: "512 GB",
      Procesador: "Snapdragon 8s Gen 3",
      Pantalla: '6.67"',
      RAM: "12 GB",
    },
    featured: true,
    category: "android",
    description:
      "Flagship killer con rendimiento gaming extremo y precio competitivo.",
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
      "https://images.unsplash.com/photo-1493661969828-411ef6a6624d?q=80&w=1592&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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

// For server-side use (admin), import from data-manager
// For client-side use, these functions use the static products array as fallback
// Frontend pages should use API routes to get latest data

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
