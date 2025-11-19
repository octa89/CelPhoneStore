import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const formatCurrency = (cents: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    cents / 100
  );

/**
 * Generates a URL-friendly slug from a string
 * - Converts to lowercase
 * - Removes accents and special characters
 * - Replaces spaces with hyphens
 * - Removes consecutive hyphens
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Trim hyphens from start and end
}
