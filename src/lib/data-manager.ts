import fs from "fs/promises";
import path from "path";
import type { Product } from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const CAROUSEL_FILE = path.join(DATA_DIR, "carousel.json");

interface ProductsData {
  products: Product[];
  lastUpdated: string;
}

interface CategoriesData {
  categories: string[];
}

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: { text: string; href: string };
  badge?: string;
}

interface CarouselData {
  slides: CarouselSlide[];
  lastUpdated: string;
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Products operations
export async function getProducts(): Promise<Product[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PRODUCTS_FILE, "utf-8");
    const parsed: ProductsData = JSON.parse(data);
    return parsed.products;
  } catch {
    // If file doesn't exist, import from products.ts and save to JSON
    try {
      const { products } = await import("./products");
      // Save to JSON for future use
      await saveProducts(products);
      return products;
    } catch (importError) {
      console.error("Error importing products:", importError);
      return [];
    }
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  await ensureDataDir();
  const data: ProductsData = {
    products,
    lastUpdated: new Date().toISOString(),
  };
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function addProduct(product: Product): Promise<Product> {
  const products = await getProducts();
  products.push(product);
  await saveProducts(products);
  return product;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) return null;

  products[index] = { ...products[index], ...updates };
  await saveProducts(products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);

  if (filtered.length === products.length) return false;

  await saveProducts(filtered);
  return true;
}

// Categories operations
export async function getCategories(): Promise<string[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(CATEGORIES_FILE, "utf-8");
    const parsed: CategoriesData = JSON.parse(data);
    return parsed.categories;
  } catch {
    return ["android", "audio", "tablet"];
  }
}

export async function saveCategories(categories: string[]): Promise<void> {
  await ensureDataDir();
  const data: CategoriesData = { categories };
  await fs.writeFile(CATEGORIES_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function addCategory(category: string): Promise<string[]> {
  const categories = await getCategories();
  if (!categories.includes(category)) {
    categories.push(category);
    await saveCategories(categories);
  }
  return categories;
}

export async function deleteCategory(category: string): Promise<string[]> {
  const categories = await getCategories();
  const filtered = categories.filter((c) => c !== category);
  await saveCategories(filtered);
  return filtered;
}

// Carousel operations
export async function getCarousel(): Promise<CarouselSlide[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(CAROUSEL_FILE, "utf-8");
    const parsed: CarouselData = JSON.parse(data);
    return parsed.slides;
  } catch {
    // Return default carousel data
    return [
      {
        id: 1,
        title: "Los Mejores Smartphones",
        subtitle: "Al Mejor Precio",
        description: "Descubre nuestra selección de celulares Honor, Xiaomi, Samsung y Google",
        image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=1600&auto=format&fit=crop",
        cta: { text: "Ver Catálogo", href: "#productos" },
        badge: "ENVÍO EXPRESS GRATIS ⚡",
      },
    ];
  }
}

export async function saveCarousel(slides: CarouselSlide[]): Promise<void> {
  await ensureDataDir();
  const data: CarouselData = {
    slides,
    lastUpdated: new Date().toISOString(),
  };
  await fs.writeFile(CAROUSEL_FILE, JSON.stringify(data, null, 2), "utf-8");
}
