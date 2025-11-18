import fs from "fs/promises";
import path from "path";
import type { Product } from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const CAROUSEL_FILE = path.join(DATA_DIR, "carousel.json");
const ACTIVITY_LOG_FILE = path.join(DATA_DIR, "activity-log.json");

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

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  type: "product" | "carousel" | "category" | "order";
}

interface ActivityLogData {
  entries: ActivityLogEntry[];
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
  await addActivityLog("Producto Agregado", `${product.name} - ${product.brand}`, "product");
  return product;
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>,
  skipLog: boolean = false
): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) return null;

  const oldProduct = products[index];
  products[index] = { ...products[index], ...updates };
  await saveProducts(products);

  if (!skipLog) {
    // Determine what was changed
    let action = "Producto Editado";
    let details = `${products[index].name} - ${products[index].brand}`;

    if (updates.priceCents !== undefined && updates.priceCents !== oldProduct.priceCents) {
      action = "Precio Actualizado";
      const oldPrice = (oldProduct.priceCents / 100).toFixed(2);
      const newPrice = (updates.priceCents / 100).toFixed(2);
      details = `${products[index].name}: $${oldPrice} → $${newPrice}`;
    } else if (updates.displayOrder !== undefined) {
      action = "Orden de Producto Actualizado";
      details = `${products[index].name} - Posición: ${updates.displayOrder + 1}`;
    } else if (updates.available !== undefined) {
      action = updates.available ? "Producto Disponible" : "Producto No Disponible";
      details = `${products[index].name}`;
    }

    await addActivityLog(action, details, "product");
  }

  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const deletedProduct = products.find((p) => p.id === id);
  const filtered = products.filter((p) => p.id !== id);

  if (filtered.length === products.length) return false;

  await saveProducts(filtered);
  if (deletedProduct) {
    await addActivityLog("Producto Eliminado", `${deletedProduct.name} - ${deletedProduct.brand}`, "product");
  }
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
  await addActivityLog("Carrusel Actualizado", `${slides.length} slides configuradas`, "carousel");
}

// Activity Log operations
export async function getActivityLog(limit: number = 10): Promise<ActivityLogEntry[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(ACTIVITY_LOG_FILE, "utf-8");
    const parsed: ActivityLogData = JSON.parse(data);
    // Return most recent entries first
    return parsed.entries.slice(0, limit);
  } catch {
    return [];
  }
}

export async function addActivityLog(
  action: string,
  details: string,
  type: ActivityLogEntry["type"]
): Promise<void> {
  try {
    await ensureDataDir();
    let entries: ActivityLogEntry[] = [];

    try {
      const data = await fs.readFile(ACTIVITY_LOG_FILE, "utf-8");
      const parsed: ActivityLogData = JSON.parse(data);
      entries = parsed.entries;
    } catch {
      // File doesn't exist yet
    }

    const newEntry: ActivityLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      details,
      type,
    };

    // Add new entry at the beginning (most recent first)
    entries.unshift(newEntry);

    // Keep only last 100 entries
    if (entries.length > 100) {
      entries = entries.slice(0, 100);
    }

    const data: ActivityLogData = { entries };
    await fs.writeFile(ACTIVITY_LOG_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error adding activity log:", error);
  }
}
