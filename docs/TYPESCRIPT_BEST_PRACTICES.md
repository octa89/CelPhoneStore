# TypeScript Best Practices for Claude Code

This document provides guidelines and best practices to prevent common TypeScript errors when working on this Next.js project.

## Table of Contents

1. [Object.entries() Type Inference Issues](#objectentries-type-inference-issues)
2. [Type Assertions vs Type Annotations](#type-assertions-vs-type-annotations)
3. [Array and Object Type Safety](#array-and-object-type-safety)
4. [Strict Mode Compliance](#strict-mode-compliance)
5. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

---

## Object.entries() Type Inference Issues

### Problem

When using `Object.entries()` on a `Record<string, T>`, TypeScript loses type information and infers the value type as `unknown`.

### Example of the Problem

```typescript
interface BrandGroup {
  brand: string;
  products: Product[];
}

const grouped: Record<string, Product[]> = { /* ... */ };

// ❌ WRONG: TypeScript infers products as unknown
const groups = Object.entries(grouped)
  .map(([brand, products]) => ({ brand, products }));
// Type: { brand: string; products: unknown }[]

setBrandGroups(groups); // ❌ Error: Type 'unknown' is not assignable to 'Product[]'
```

### Solution

Add explicit type annotations and type assertions:

```typescript
// ✅ CORRECT: Explicit type annotation + type assertion
const groups: BrandGroup[] = Object.entries(grouped)
  .map(([brand, products]) => ({ brand, products: products as Product[] }))
  .sort((a, b) => a.brand.localeCompare(b.brand));

setBrandGroups(groups); // ✅ Works perfectly
```

### Why This Happens

- `Object.entries<T>(obj)` returns `[string, T[keyof T]][]`
- For `Record<string, Product[]>`, this becomes `[string, Product[] | undefined][]`
- TypeScript's type system is conservative and may infer `unknown` in strict mode
- Destructuring further complicates type inference

### Best Practices

1. **Always add explicit type annotations** when the return type is known
2. **Use type assertions** (`as`) when you know the runtime type better than TypeScript
3. **Prefer `Array.from()` + `entries()`** for better type safety with Maps
4. **Consider using `Object.keys()` + manual access** if type safety is critical

---

## Type Assertions vs Type Annotations

### Type Annotation (Preferred)

Use when declaring variables with known types:

```typescript
// ✅ GOOD: Explicit type annotation
const users: User[] = fetchUsers();
const count: number = users.length;
const groups: BrandGroup[] = transformData(data);
```

### Type Assertion (Use Sparingly)

Use when you know more about the type than TypeScript:

```typescript
// ✅ ACCEPTABLE: You know the runtime type
const element = document.getElementById('app') as HTMLDivElement;
const products = data as Product[];

// ❌ AVOID: Don't use to bypass valid errors
const value = "123" as number; // Wrong! This doesn't convert the type
```

### When to Use Each

| Scenario | Use Type Annotation | Use Type Assertion |
|----------|---------------------|-------------------|
| Variable declaration | ✅ Yes | ❌ No |
| Function return type | ✅ Yes | ❌ No |
| API responses | ✅ Yes (with validation) | ⚠️ Only after validation |
| DOM elements | ❌ No | ✅ Yes |
| Object.entries() results | ✅ Yes | ✅ Yes (for values) |

---

## Array and Object Type Safety

### Working with Arrays

```typescript
// ✅ GOOD: Type the array properly
const products: Product[] = [];
products.push(newProduct);

// ✅ GOOD: Type inference works
const names = products.map(p => p.name); // string[]

// ❌ AVOID: Implicit any
const items = []; // any[]
items.push(something); // No type safety!
```

### Working with Objects and Records

```typescript
// ✅ GOOD: Use Record for dynamic keys
const productsByBrand: Record<string, Product[]> = {};
productsByBrand['Samsung'] = [/* ... */];

// ✅ GOOD: Use reduce with proper typing
const grouped = products.reduce((acc: Record<string, Product[]>, product) => {
  if (!acc[product.brand]) {
    acc[product.brand] = [];
  }
  acc[product.brand].push(product);
  return acc;
}, {});

// ❌ AVOID: Untyped accumulator
const grouped = products.reduce((acc, product) => {
  // acc is 'any' - no type safety!
  acc[product.brand] = product;
  return acc;
}, {});
```

---

## Strict Mode Compliance

This project uses TypeScript strict mode. Follow these guidelines:

### Avoid Implicit Any

```typescript
// ❌ BAD
function process(data) { // Implicit 'any'
  return data.value;
}

// ✅ GOOD
function process(data: ProductData): number {
  return data.value;
}
```

### Handle Null/Undefined

```typescript
// ❌ BAD
function getProductName(id: string) {
  const product = products.find(p => p.id === id);
  return product.name; // Error: product might be undefined
}

// ✅ GOOD
function getProductName(id: string): string | null {
  const product = products.find(p => p.id === id);
  return product?.name ?? null;
}
```

### Type Function Parameters

```typescript
// ❌ BAD
const handleClick = (e) => { // Implicit 'any'
  console.log(e.target);
};

// ✅ GOOD
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget);
};
```

---

## Common Pitfalls and Solutions

### Pitfall 1: Array.reduce() with Untyped Accumulator

```typescript
// ❌ PROBLEM
const result = items.reduce((acc, item) => {
  acc[item.id] = item; // acc is 'any'
  return acc;
}, {});

// ✅ SOLUTION
const result = items.reduce<Record<string, Item>>((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});
```

### Pitfall 2: Object.keys() and Object.entries()

```typescript
interface Data {
  name: string;
  age: number;
}

const data: Data = { name: 'John', age: 30 };

// ❌ PROBLEM: keys is string[], not keyof Data
const keys = Object.keys(data);
keys.forEach(key => {
  console.log(data[key]); // Error: Element implicitly has 'any' type
});

// ✅ SOLUTION 1: Type assertion
const keys = Object.keys(data) as Array<keyof Data>;
keys.forEach(key => {
  console.log(data[key]); // Works!
});

// ✅ SOLUTION 2: Use entries with type assertion
Object.entries(data).forEach(([key, value]) => {
  console.log(key, value); // Works!
});
```

### Pitfall 3: Async/Await with Fetch

```typescript
// ❌ PROBLEM
async function fetchProducts() {
  const res = await fetch('/api/products');
  const data = await res.json(); // data is 'any'
  return data.products; // No type safety!
}

// ✅ SOLUTION
interface ProductsResponse {
  products: Product[];
  total: number;
}

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('/api/products');
  const data: ProductsResponse = await res.json();
  return data.products; // Type-safe!
}
```

### Pitfall 4: React State with Complex Types

```typescript
// ❌ PROBLEM
const [groups, setGroups] = useState([]); // any[]

// ✅ SOLUTION
const [groups, setGroups] = useState<BrandGroup[]>([]);

// ✅ EVEN BETTER: With initial type inference
const initialGroups: BrandGroup[] = [];
const [groups, setGroups] = useState(initialGroups);
```

### Pitfall 5: Array Methods Losing Type Information

```typescript
// ❌ PROBLEM
const data = fetchData(); // unknown
const items = data.items; // Error: Property 'items' does not exist on type 'unknown'

// ✅ SOLUTION 1: Type guard
function isProductData(data: unknown): data is { items: Product[] } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'items' in data &&
    Array.isArray((data as any).items)
  );
}

if (isProductData(data)) {
  const items = data.items; // Product[]
}

// ✅ SOLUTION 2: Validation + assertion
import { z } from 'zod';

const ProductSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    // ... more fields
  }))
});

const data = ProductSchema.parse(await res.json());
const items = data.items; // Fully type-safe!
```

---

## Build Verification Checklist

Before committing code, ensure:

- [ ] `npm run build` completes without TypeScript errors
- [ ] `npm run lint` passes without errors
- [ ] All `any` types are intentional and documented
- [ ] Complex type transformations have explicit annotations
- [ ] API responses are properly typed
- [ ] React hooks have proper type parameters
- [ ] Event handlers have correct event types

---

## Quick Reference: Common Patterns

### Pattern: Grouping Array Items

```typescript
// Group products by brand
const grouped = products.reduce<Record<string, Product[]>>((acc, product) => {
  if (!acc[product.brand]) {
    acc[product.brand] = [];
  }
  acc[product.brand].push(product);
  return acc;
}, {});

// Convert to array with proper typing
const groups: BrandGroup[] = Object.entries(grouped)
  .map(([brand, products]) => ({
    brand,
    products: products as Product[]
  }))
  .sort((a, b) => a.brand.localeCompare(b.brand));
```

### Pattern: Type-Safe API Fetching

```typescript
async function fetchTypedData<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return await res.json() as T;
}

// Usage
const products = await fetchTypedData<Product[]>('/api/products');
```

### Pattern: Safe Array Access

```typescript
// Get first item safely
const firstProduct = products[0] ?? null;
const firstProduct: Product | undefined = products.at(0);

// Filter and type-narrow
const samsungProducts = products.filter(
  (p): p is Product => p.brand === 'Samsung'
);
```

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Next.js TypeScript Documentation](https://nextjs.org/docs/app/building-your-application/configuring/typescript)

---

## When to Ask for Help

If you encounter:

1. **Persistent `unknown` or `any` types** that can't be resolved
2. **Complex generic type errors** that aren't clear
3. **Build failures** that don't make sense given the code
4. **Type errors in third-party libraries** without proper types

Ask the user for clarification or check the library's type definitions.
