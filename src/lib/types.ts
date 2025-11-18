export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  priceCents: number;
  images: string[];
  tags: string[];
  specs?: Record<string, string | number>;
  featured?: boolean;
  category: string; // Dynamic categories managed by admin
  description: string;
  // Admin-managed status flags
  available?: boolean; // Product is in stock and available for purchase
  inCarousel?: boolean; // Show product in hero carousel
  newArrival?: boolean; // Mark as new arrival
  onSale?: boolean; // Mark as on sale
};
