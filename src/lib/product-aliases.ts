/**
 * Product aliases and abbreviation mappings for fuzzy matching
 * Maps official product names to common abbreviations, typos, and variations
 */

// Common abbreviations and variations for specific models
export const MODEL_ALIASES: Record<string, string[]> = {
  // Samsung Galaxy S24 Series
  "Samsung Galaxy S24 Ultra 256GB": [
    "s24u",
    "s24 ultra",
    "galaxy s24u",
    "samsung s24 ultra",
    "s24ultra",
    "galaxy s24 ultra",
    "s24 256",
    "s24u 256",
  ],
  "Samsung Galaxy S24+ 256GB": [
    "s24+",
    "s24 plus",
    "galaxy s24+",
    "samsung s24+",
    "s24plus",
    "galaxy s24 plus",
  ],
  "Samsung Galaxy S24 128GB": [
    "s24",
    "galaxy s24",
    "samsung s24",
    "s24 128",
  ],

  // Samsung Galaxy Z Series
  "Samsung Galaxy Z Flip 6": [
    "z flip 6",
    "zflip6",
    "flip 6",
    "galaxy flip 6",
    "samsung flip 6",
    "z flip6",
  ],
  "Samsung Galaxy Z Fold 6": [
    "z fold 6",
    "zfold6",
    "fold 6",
    "galaxy fold 6",
    "samsung fold 6",
    "z fold6",
  ],

  // iPhone 15 Series
  "iPhone 15 Pro Max 256GB": [
    "15pm",
    "15 pro max",
    "iphone 15pm",
    "15promax",
    "ip15pm",
    "15 pm",
    "iphone pro max",
    "iphone 15 pro max",
  ],
  "iPhone 15 Pro 128GB": [
    "15p",
    "15 pro",
    "iphone 15p",
    "15pro",
    "ip15p",
    "iphone 15 pro",
  ],
  "iPhone 15 128GB": [
    "iphone15",
    "ip15",
    "iphone 15",
    "15 128",
  ],
  "iPhone 15 Plus": [
    "15+",
    "15 plus",
    "iphone 15+",
    "iphone 15 plus",
    "ip15+",
  ],

  // iPhone 16 Series (if available)
  "iPhone 16 Pro Max": [
    "16pm",
    "16 pro max",
    "iphone 16pm",
    "16promax",
    "ip16pm",
    "iphone 16 pro max",
  ],
  "iPhone 16 Pro": [
    "16p",
    "16 pro",
    "iphone 16p",
    "16pro",
    "ip16p",
    "iphone 16 pro",
  ],
  "iPhone 16": [
    "iphone16",
    "ip16",
    "iphone 16",
  ],

  // Google Pixel Series
  "Google Pixel 9 Pro": [
    "pixel 9p",
    "p9 pro",
    "pixel9pro",
    "pixel 9 pro",
    "google pixel 9p",
    "pixel pro 9",
  ],
  "Google Pixel 9": [
    "pixel 9",
    "p9",
    "pixel9",
    "google pixel 9",
  ],
  "Google Pixel 8 Pro": [
    "pixel 8p",
    "p8 pro",
    "pixel8pro",
    "pixel 8 pro",
    "google pixel 8p",
  ],
  "Google Pixel 8": [
    "pixel 8",
    "p8",
    "pixel8",
    "google pixel 8",
  ],
  "Google Pixel 8a": [
    "pixel 8a",
    "p8a",
    "pixel8a",
    "google pixel 8a",
  ],

  // Xiaomi Series
  "Xiaomi 14T Pro": [
    "14t pro",
    "xiaomi 14t",
    "mi 14t",
    "14t",
    "xiaomi 14t pro",
    "mi 14t pro",
  ],
  "Xiaomi 14 Ultra": [
    "14 ultra",
    "xiaomi 14u",
    "mi 14 ultra",
    "xiaomi ultra",
  ],
  "Xiaomi 13T Pro": [
    "13t pro",
    "xiaomi 13t",
    "mi 13t",
    "13t",
  ],

  // Honor Series
  "Honor Magic 6 Pro": [
    "magic 6 pro",
    "honor 6 pro",
    "magic6pro",
    "honor magic 6",
  ],
  "Honor 200 Pro": [
    "honor 200",
    "honor 200 pro",
    "200 pro",
  ],

  // OnePlus Series
  "OnePlus 12": [
    "oneplus 12",
    "op12",
    "1+12",
    "one plus 12",
  ],
  "OnePlus 12R": [
    "oneplus 12r",
    "op12r",
    "1+12r",
    "12r",
  ],

  // Nothing Series
  "Nothing Phone (2a)": [
    "nothing 2a",
    "phone 2a",
    "nothing phone 2a",
    "np2a",
  ],
  "Nothing Phone (2)": [
    "nothing 2",
    "phone 2",
    "nothing phone 2",
    "np2",
  ],
};

// Common brand name typos
export const BRAND_TYPOS: Record<string, string[]> = {
  Samsung: ["sumsung", "samsug", "sansung", "samung", "smasung", "samsong"],
  iPhone: ["ipone", "iphon", "ifone", "iphone", "iphine", "ipohne", "iphome"],
  Xiaomi: ["xaomi", "xiomi", "shaomi", "xiaome", "xiami", "xaiomi", "xiaomie"],
  Google: ["googl", "gogle", "gooogle", "googel"],
  Pixel: ["pixle", "piksel", "pxl", "pixl", "pixcel"],
  Honor: ["honour", "honer", "honr"],
  OnePlus: ["oneplus", "one plus", "1plus", "1+", "onepls"],
  Nothing: ["nothin", "nothng", "noting"],
  Galaxy: ["galxy", "galaxi", "gallaxy", "glaxy"],
};

// Spanish colloquial patterns that map to products or brands
export const SPANISH_PATTERNS: Array<{ pattern: RegExp; maps_to: string }> = [
  // Size-based references
  { pattern: /el (samsung|galaxy) (mas )?grande/i, maps_to: "Samsung Galaxy S24 Ultra" },
  { pattern: /el iphone (mas )?grande/i, maps_to: "iPhone 15 Pro Max" },
  { pattern: /el iphone (mas )?caro/i, maps_to: "iPhone 15 Pro Max" },
  { pattern: /el samsung (mas )?caro/i, maps_to: "Samsung Galaxy S24 Ultra" },

  // Latest/new references
  { pattern: /el (nuevo|ultimo) pixel/i, maps_to: "Google Pixel 9" },
  { pattern: /el (nuevo|ultimo) iphone/i, maps_to: "iPhone 15" },
  { pattern: /el (nuevo|ultimo) samsung/i, maps_to: "Samsung Galaxy S24" },
  { pattern: /el (nuevo|ultimo) xiaomi/i, maps_to: "Xiaomi 14T Pro" },

  // Folding phone references
  { pattern: /el (telefono|celular|samsung) (que se )?pliega/i, maps_to: "Samsung Galaxy Z Flip 6" },
  { pattern: /el (telefono|celular|samsung) plegable/i, maps_to: "Samsung Galaxy Z Flip 6" },
  { pattern: /el flip/i, maps_to: "Samsung Galaxy Z Flip 6" },
  { pattern: /el fold/i, maps_to: "Samsung Galaxy Z Fold 6" },

  // Pro model references
  { pattern: /el iphone pro(?! max)/i, maps_to: "iPhone 15 Pro" },
  { pattern: /el pixel pro/i, maps_to: "Google Pixel 9 Pro" },

  // Budget/affordable references
  { pattern: /el (pixel|google) (mas )?barato/i, maps_to: "Google Pixel 8a" },
  { pattern: /un android (bueno y )?barato/i, maps_to: "Google Pixel 8a" },

  // Camera-focused references
  { pattern: /el (de|con) (mejor|buena) camara/i, maps_to: "Samsung Galaxy S24 Ultra" },
  { pattern: /para (tomar )?fotos/i, maps_to: "Samsung Galaxy S24 Ultra" },
];

// Export a function to get all aliases for a given product name
export function getAliasesForProduct(productName: string): string[] {
  return MODEL_ALIASES[productName] || [];
}

// Export a function to find the canonical product name from an alias
export function findCanonicalName(alias: string): string | null {
  const normalizedAlias = alias.toLowerCase().trim();

  for (const [productName, aliases] of Object.entries(MODEL_ALIASES)) {
    if (aliases.some(a => a.toLowerCase() === normalizedAlias)) {
      return productName;
    }
  }

  return null;
}
