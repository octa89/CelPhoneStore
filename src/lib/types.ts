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
  category: "iphone" | "accessory" | "audio" | "tablet" | "watch";
  description: string;
};
