# TypeScript Guidelines for Claude Code

This file contains critical TypeScript patterns and rules specific to this project. **Always reference this file before writing or modifying TypeScript code.**

## CRITICAL: Object.entries() Pattern

### The Problem

When using `Object.entries()` on a `Record<string, T>`, TypeScript infers the value type as `unknown`, causing type assignment errors.

**This is the #1 most common TypeScript error in this codebase.**

### The Pattern - ALWAYS USE THIS

```typescript
// Given: You have a Record and want to convert to an array
const grouped: Record<string, Product[]> = { /* ... */ };

// ❌ WRONG - Will cause build error
const groups = Object.entries(grouped)
  .map(([brand, products]) => ({ brand, products }));
// Type: { brand: string; products: unknown }[]

// ✅ CORRECT - ALWAYS USE THIS PATTERN
const groups: BrandGroup[] = Object.entries(grouped)
  .map(([brand, products]) => ({ brand, products: products as Product[] }));
```

### When to Apply This Pattern

Apply this pattern whenever you:
- Use `Object.entries()` on a typed Record
- See TypeScript error about `unknown` type
- Convert object to array of key-value pairs
- Group/reduce arrays into objects then convert back

### Real Example from Codebase

File: `src/components/brands-dropdown.tsx`

```typescript
// Group products by brand
const grouped = data.products.reduce((acc: Record<string, Product[]>, product: Product) => {
  if (!acc[product.brand]) {
    acc[product.brand] = [];
  }
  acc[product.brand].push(product);
  return acc;
}, {});

// Convert to array with PROPER TYPING
const groups: BrandGroup[] = Object.entries(grouped)
  .map(([brand, products]) => ({ brand, products: products as Product[] }))
  .sort((a, b) => a.brand.localeCompare(b.brand));
```

## Required TypeScript Patterns

### 1. Array.reduce() with Typed Accumulator

```typescript
// ❌ WRONG
const result = items.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

// ✅ CORRECT
const result = items.reduce<Record<string, Item>>((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});
```

### 2. React Event Handlers

```typescript
// ❌ WRONG
const handleClick = (e) => {
  console.log(e.target);
};

// ✅ CORRECT
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget);
};
```

### 3. Optional Chaining and Nullish Coalescing

```typescript
// ❌ WRONG
const name = user.profile.name || 'Unknown';

// ✅ CORRECT
const name = user?.profile?.name ?? 'Unknown';
```

### 4. Array Access Safety

```typescript
// ❌ WRONG
const first = items[0];

// ✅ CORRECT - Option 1
const first = items[0] ?? null;

// ✅ CORRECT - Option 2
const first = items.at(0);
```

### 5. API Response Typing

```typescript
// ❌ WRONG
async function fetchProducts() {
  const res = await fetch('/api/products');
  const data = await res.json();
  return data.products;
}

// ✅ CORRECT
interface ProductsResponse {
  products: Product[];
  total: number;
}

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('/api/products');
  const data: ProductsResponse = await res.json();
  return data.products;
}
```

## Pre-Commit Checklist

Before committing any TypeScript code:

1. [ ] Run `npm run build` - must complete without errors
2. [ ] Run `npm run lint` - must pass
3. [ ] No `any` types unless absolutely necessary and documented
4. [ ] All `Object.entries()` uses follow the correct pattern
5. [ ] All function parameters are typed
6. [ ] All exported functions have return types
7. [ ] No unused imports or variables

## Common Error Messages and Solutions

### "Type 'unknown' is not assignable to type 'T'"

**Solution:** Add type assertion
```typescript
const value = unknownValue as T;
```

### "Parameter 'x' implicitly has an 'any' type"

**Solution:** Add type annotation
```typescript
function myFunc(x: string) { }
```

### "Element implicitly has an 'any' type"

**Solution:** Use type assertion for Object.keys()
```typescript
const keys = Object.keys(obj) as Array<keyof typeof obj>;
```

### "Property 'X' does not exist on type 'never'"

**Solution:** Initialize arrays with proper type
```typescript
const items: Product[] = [];
```

## Project-Specific Types

Always import types from `@/lib/types`:

```typescript
import type { Product, CartItem, BrandGroup } from "@/lib/types";
```

### Key Interfaces

```typescript
interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  priceCents: number;
  images: string[];
  tags: string[];
  specs: Record<string, string>;
  category: "android" | "audio" | "tablet";
  description: string;
  featured?: boolean;
  displayOrder?: number;
}

interface BrandGroup {
  brand: string;
  products: Product[];
}

interface CartItem {
  product: Product;
  quantity: number;
}
```

## Resources

- Full guide: [docs/TYPESCRIPT_BEST_PRACTICES.md](../docs/TYPESCRIPT_BEST_PRACTICES.md)
- Troubleshooting: [docs/TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md)
- Changelog: [CHANGELOG.md](../CHANGELOG.md)

## Critical Rules

1. **NEVER use `any`** unless absolutely required and documented
2. **ALWAYS type Object.entries()** results with explicit type + assertion
3. **ALWAYS type reduce()** accumulators with generic parameter
4. **ALWAYS check for null/undefined** before accessing properties
5. **ALWAYS add return types** to exported functions
6. **ALWAYS run build** before committing

---

**Last Updated:** 2025-01-18
**Version:** 2.0.1
