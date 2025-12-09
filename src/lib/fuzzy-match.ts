import type { Product } from "./types";
import { MODEL_ALIASES, BRAND_TYPOS, SPANISH_PATTERNS } from "./product-aliases";

/**
 * Fuzzy matching utility for product model names
 * Handles typos, abbreviations, and colloquial Spanish variations
 */

export type MatchResult = {
  product: Product | null;
  confidence: number; // 0-100
  matchedTerm: string; // What matched
  originalQuery: string; // User's input
  needsConfirmation: boolean;
};

/**
 * Calculate Levenshtein distance between two strings
 * Used for typo detection
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Normalize string for comparison
 * - Lowercase
 * - Remove accents
 * - Trim whitespace
 * - Normalize spaces
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
}

/**
 * Check if query matches any Spanish colloquial pattern
 */
function matchSpanishPattern(query: string): string | null {
  const normalized = normalizeString(query);
  for (const { pattern, maps_to } of SPANISH_PATTERNS) {
    if (pattern.test(normalized)) {
      return maps_to;
    }
  }
  return null;
}

/**
 * Check if query matches any brand typo
 */
function correctBrandTypo(query: string): string {
  const normalized = normalizeString(query);
  let corrected = normalized;

  for (const [correctBrand, typos] of Object.entries(BRAND_TYPOS)) {
    for (const typo of typos) {
      if (normalized.includes(typo.toLowerCase())) {
        corrected = corrected.replace(typo.toLowerCase(), correctBrand.toLowerCase());
      }
    }
  }

  return corrected;
}

/**
 * Calculate confidence score for a product match
 */
function calculateConfidence(query: string, product: Product): number {
  const normalizedQuery = normalizeString(query);
  const normalizedName = normalizeString(product.name);
  const normalizedBrand = normalizeString(product.brand);

  let score = 0;

  // 1. Exact match (100%)
  if (normalizedQuery === normalizedName) return 100;

  // 2. Check alias matches first (95%)
  const aliases = MODEL_ALIASES[product.name] || [];
  for (const alias of aliases) {
    if (normalizeString(alias) === normalizedQuery) {
      return 95;
    }
    // Partial alias match
    if (normalizedQuery.includes(normalizeString(alias))) {
      score = Math.max(score, 90);
    }
  }

  // 3. Substring match (80-90%)
  if (normalizedName.includes(normalizedQuery)) {
    score = Math.max(score, 88);
  }
  if (normalizedQuery.includes(normalizedName)) {
    score = Math.max(score, 80);
  }

  // 4. Brand + partial model match
  if (normalizedQuery.includes(normalizedBrand)) {
    // Extract the non-brand part of the query
    const withoutBrand = normalizedQuery.replace(normalizedBrand, "").trim();
    if (withoutBrand && normalizedName.includes(withoutBrand)) {
      score = Math.max(score, 85);
    }
  }

  // 5. Word-level matching
  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 1);
  const nameWords = normalizedName.split(/\s+/);

  if (queryWords.length > 0) {
    const matchedWords = queryWords.filter((qw) =>
      nameWords.some((nw) => nw.includes(qw) || qw.includes(nw))
    );
    const wordScore = (matchedWords.length / queryWords.length) * 85;
    score = Math.max(score, wordScore);
  }

  // 6. Levenshtein distance (for typo detection)
  // Only use for shorter queries to avoid false positives
  if (normalizedQuery.length >= 4 && normalizedQuery.length <= 30) {
    const distance = levenshteinDistance(normalizedQuery, normalizedName);
    const maxLen = Math.max(normalizedQuery.length, normalizedName.length);
    const similarity = 1 - distance / maxLen;

    // Only consider if similarity is high enough
    if (similarity > 0.6) {
      const levenScore = similarity * 80; // Max 80 from Levenshtein alone
      score = Math.max(score, levenScore);
    }
  }

  // 7. Check against brand name alone for partial matches
  if (normalizedQuery === normalizedBrand) {
    // User mentioned just the brand - low confidence for specific product
    score = Math.max(score, 40);
  }

  return Math.round(score);
}

/**
 * Find the best matching product for a query
 */
export function findBestMatch(
  query: string,
  products: Product[]
): MatchResult {
  if (!query || !products.length) {
    return {
      product: null,
      confidence: 0,
      matchedTerm: "",
      originalQuery: query,
      needsConfirmation: true,
    };
  }

  // First, check for Spanish pattern matches
  const spanishMatch = matchSpanishPattern(query);
  if (spanishMatch) {
    // Try to find a product matching the Spanish pattern result
    const patternProduct = products.find((p) =>
      normalizeString(p.name).includes(normalizeString(spanishMatch)) ||
      normalizeString(p.brand).includes(normalizeString(spanishMatch))
    );
    if (patternProduct) {
      return {
        product: patternProduct,
        confidence: 85,
        matchedTerm: spanishMatch,
        originalQuery: query,
        needsConfirmation: false,
      };
    }
  }

  // Correct any brand typos in the query
  const correctedQuery = correctBrandTypo(query);

  let bestMatch: MatchResult = {
    product: null,
    confidence: 0,
    matchedTerm: "",
    originalQuery: query,
    needsConfirmation: true,
  };

  for (const product of products) {
    // Try both original and corrected query
    const originalConfidence = calculateConfidence(query, product);
    const correctedConfidence = calculateConfidence(correctedQuery, product);
    const confidence = Math.max(originalConfidence, correctedConfidence);

    if (confidence > bestMatch.confidence) {
      bestMatch = {
        product,
        confidence,
        matchedTerm: product.name,
        originalQuery: query,
        needsConfirmation: confidence < 85,
      };
    }
  }

  return bestMatch;
}

/**
 * Find all matching products for a query, sorted by confidence
 */
export function findAllMatches(
  query: string,
  products: Product[],
  limit: number = 5
): MatchResult[] {
  if (!query || !products.length) {
    return [];
  }

  // Correct brand typos
  const correctedQuery = correctBrandTypo(query);

  const matches: MatchResult[] = products
    .map((product) => {
      const originalConfidence = calculateConfidence(query, product);
      const correctedConfidence = calculateConfidence(correctedQuery, product);
      const confidence = Math.max(originalConfidence, correctedConfidence);

      return {
        product,
        confidence,
        matchedTerm: product.name,
        originalQuery: query,
        needsConfirmation: confidence < 85,
      };
    })
    .filter((m) => m.confidence > 30) // Only include matches above threshold
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit);

  return matches;
}

/**
 * Normalize a model name to its canonical form
 * Returns the original if no high-confidence match is found
 */
export function normalizeModelName(
  modelName: string,
  products: Product[]
): string {
  const match = findBestMatch(modelName, products);

  // Only use the matched name if confidence is high enough
  if (match.product && match.confidence >= 70) {
    return match.product.name;
  }

  return modelName;
}
