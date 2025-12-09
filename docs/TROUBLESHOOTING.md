# Troubleshooting Guide

This guide provides solutions to common issues encountered when developing and deploying the Tecno Express e-commerce platform.

## Table of Contents

1. [TypeScript Errors](#typescript-errors)
2. [Build Failures](#build-failures)
3. [AWS Amplify Deployment](#aws-amplify-deployment)
4. [Runtime Errors](#runtime-errors)
5. [Development Server Issues](#development-server-issues)
6. [Database Problems](#database-problems)
7. [Performance Issues](#performance-issues)

---

## TypeScript Errors

### Error: Type 'unknown' is not assignable to type 'T[]'

**Symptom:**
```
Type '{ brand: string; products: unknown; }[]' is not assignable to type 'BrandGroup[]'.
  Types of property 'products' are incompatible.
    Type 'unknown' is not assignable to type 'Product[]'.
```

**Cause:**
TypeScript loses type information when using `Object.entries()` on `Record<string, T>` types.

**Solution:**
```typescript
// ❌ WRONG
const groups = Object.entries(grouped)
  .map(([brand, products]) => ({ brand, products }));

// ✅ CORRECT
const groups: BrandGroup[] = Object.entries(grouped)
  .map(([brand, products]) => ({ brand, products: products as Product[] }));
```

**Files Commonly Affected:**
- `src/components/brands-dropdown.tsx`
- Any component using `Object.entries()` with typed objects

**Prevention:**
- Always add explicit type annotations when using `Object.entries()`
- Use type assertions for values from `Object.entries()`
- See [TYPESCRIPT_BEST_PRACTICES.md](./TYPESCRIPT_BEST_PRACTICES.md) for detailed guidance

---

### Error: Parameter 'x' implicitly has an 'any' type

**Symptom:**
```
Parameter 'item' implicitly has an 'any' type.
```

**Cause:**
TypeScript strict mode requires all parameters to be explicitly typed.

**Solution:**
```typescript
// ❌ WRONG
const result = items.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

// ✅ CORRECT
const result = items.reduce<Record<string, Item>>((acc, item: Item) => {
  acc[item.id] = item;
  return acc;
}, {});
```

**Quick Fix Checklist:**
- [ ] Type all function parameters
- [ ] Add generic types to array methods (`.map()`, `.reduce()`, `.filter()`)
- [ ] Type event handlers: `(e: React.MouseEvent<HTMLButtonElement>)`
- [ ] Type callback functions: `onChange: (value: string) => void`

---

### Error: Element implicitly has an 'any' type

**Symptom:**
```
Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Product'.
```

**Cause:**
Using `Object.keys()` or string indexing without proper type assertions.

**Solution:**
```typescript
// ❌ WRONG
const keys = Object.keys(product);
keys.forEach(key => {
  console.log(product[key]); // Error!
});

// ✅ CORRECT - Option 1: Type assertion
const keys = Object.keys(product) as Array<keyof Product>;
keys.forEach(key => {
  console.log(product[key]); // Works!
});

// ✅ CORRECT - Option 2: Use Object.entries()
Object.entries(product).forEach(([key, value]) => {
  console.log(key, value); // Works!
});
```

---

### Error: Type 'null' is not assignable to type 'T'

**Symptom:**
```
Type 'Product | undefined' is not assignable to type 'Product'.
```

**Cause:**
Strict null checks require handling of potential null/undefined values.

**Solution:**
```typescript
// ❌ WRONG
function getProduct(id: string): Product {
  return products.find(p => p.id === id); // Might be undefined!
}

// ✅ CORRECT - Option 1: Nullable return type
function getProduct(id: string): Product | null {
  return products.find(p => p.id === id) ?? null;
}

// ✅ CORRECT - Option 2: Throw error
function getProduct(id: string): Product {
  const product = products.find(p => p.id === id);
  if (!product) throw new Error(`Product ${id} not found`);
  return product;
}

// ✅ CORRECT - Option 3: Default value
function getProduct(id: string): Product {
  return products.find(p => p.id === id) ?? defaultProduct;
}
```

---

## Build Failures

### Error: Found lockfile missing swc dependencies

**Symptom:**
```
⚠ Found lockfile missing swc dependencies, patching...
⚠ Lockfile was successfully patched, please run "npm install" to ensure @next/swc dependencies are downloaded
```

**Cause:**
Missing platform-specific SWC (Speedy Web Compiler) dependencies in `package-lock.json`.

**Solution:**
```bash
# Simply run npm install
npm install

# Or regenerate the lockfile
rm package-lock.json
npm install
```

**When This Happens:**
- After cloning the repository
- After switching Node versions
- After npm cache corruption
- During AWS Amplify builds

**Prevention:**
- Always commit `package-lock.json` with complete dependencies
- Use consistent Node version (20.x)
- Run `npm install` after pulling changes

---

### Error: Build failed due to TypeScript errors

**Symptom:**
```
Failed to compile.
./src/components/my-component.tsx
Type error: ...
```

**Diagnosis:**
```bash
# Check for TypeScript errors
npm run build

# Run linting
npm run lint

# Check specific file
npx tsc --noEmit src/components/my-component.tsx
```

**Solution:**
1. Fix all TypeScript errors shown
2. Ensure strict mode compliance
3. Verify all imports are correct
4. Check for unused variables

**Common Causes:**
- Missing type annotations
- Incorrect type assertions
- Unused imports or variables
- Missing return types on exported functions

---

### Error: Module not found

**Symptom:**
```
Module not found: Can't resolve '@/lib/types'
```

**Causes & Solutions:**

**1. Missing import:**
```typescript
// ✅ Add the import
import type { Product } from "@/lib/types";
```

**2. Incorrect path alias:**
```typescript
// ❌ WRONG
import { Product } from "lib/types";

// ✅ CORRECT
import { Product } from "@/lib/types";
```

**3. Missing file:**
```bash
# Check if file exists
ls src/lib/types.ts

# If missing, create it or restore from git
git checkout src/lib/types.ts
```

**4. TypeScript config issue:**
```json
// Check tsconfig.json has:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## AWS Amplify Deployment

### Error: "Missing credentials" for OpenAI during Build

**Symptom:**
```
Error: Missing credentials. Please pass an `apiKey`, or set the `OPENAI_API_KEY` environment variable.
[Error: Failed to collect page data for /api/chat]
```

**Cause:**
The OpenAI client was being instantiated at module load time. During Amplify's "Collecting page data" phase, all route modules are loaded, but environment variables are not available at build time.

**Solution:**
This was fixed in v2.1.0 by implementing lazy initialization:

```typescript
// ❌ WRONG - Module-level instantiation (fails at build time)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ CORRECT - Lazy initialization (only runs at runtime)
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}
```

**Key Principle:** Any code that requires environment variables should be lazily initialized inside request handlers, not at module load time.

**Files Commonly Affected:**
- `src/app/api/chat/route.ts` - OpenAI client
- Any API route using external services with API keys

---

### Build Fails on Amplify but Works Locally

**Diagnosis Steps:**

1. **Check Node Version**
   ```yaml
   # amplify.yml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - node --version  # Should be 20.x
           - npm install
   ```

2. **Check Environment Variables**
   - Go to Amplify Console → Environment Variables
   - Verify all required variables are set
   - Check for typos in variable names

3. **Check Build Logs**
   - Look for the first error (ignore subsequent errors)
   - Common issues:
     - TypeScript errors
     - Missing dependencies
     - Environment variable issues

**Solutions:**

**Issue: TypeScript Error on Amplify**
```bash
# Reproduce locally with production settings
npm run build

# If it works locally, check:
# 1. Amplify Node version matches local (20.x)
# 2. All dependencies are in package.json (not devDependencies)
# 3. No reliance on local environment variables
```

**Issue: Missing Environment Variables**
```typescript
// Add fallback values for build-time variables
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

// Validate required variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}
```

**Issue: Different Build Behavior**
```typescript
// next.config.ts
const nextConfig = {
  output: 'standalone', // Required for Amplify
  typescript: {
    // Don't ignore errors on build
    ignoreBuildErrors: false,
  },
  eslint: {
    // Don't ignore linting on build
    ignoreDuringBuilds: false,
  },
};
```

---

### Amplify Build Succeeds but Site Doesn't Work

**Symptoms:**
- Build shows success
- Site loads but shows errors
- API routes return 404
- Images don't load

**Diagnosis:**

**1. Check Amplify Output Settings**
```typescript
// next.config.ts
const nextConfig = {
  output: 'standalone', // REQUIRED for Amplify
};
```

**2. Check Environment Variables**
```bash
# In browser console
console.log(process.env.NEXT_PUBLIC_API_URL);
# Should show the public variable

# API variables (server-side) won't show in browser
# Verify in Amplify Console → Environment Variables
```

**3. Check Rewrites/Redirects**
```typescript
// next.config.ts
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};
```

**Solutions:**

**Issue: API Routes Return 404**
- Ensure `output: 'standalone'` is set
- Check API route files use correct export syntax
- Verify Amplify deployment region matches

**Issue: Images Don't Load**
```typescript
// next.config.ts
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'm.media-amazon.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
    ],
  },
};
```

**Issue: Environment Variables Not Working**
- Only `NEXT_PUBLIC_*` variables are available in browser
- Server-side variables must be set in Amplify Console
- Rebuild after changing environment variables

---

## Runtime Errors

### Error: Cannot read property 'X' of undefined

**Common Causes:**

**1. Accessing nested properties without checking**
```typescript
// ❌ WRONG
const name = user.profile.name; // Error if profile is undefined

// ✅ CORRECT
const name = user?.profile?.name ?? 'Unknown';
```

**2. Array access without checking length**
```typescript
// ❌ WRONG
const firstItem = items[0]; // Undefined if array is empty

// ✅ CORRECT
const firstItem = items[0] ?? null;
const firstItem = items.at(0); // Returns undefined safely
```

**3. Missing data from API**
```typescript
// ❌ WRONG
const products = data.products; // Error if data is null

// ✅ CORRECT
const products = data?.products ?? [];
```

---

### Error: Hydration failed

**Symptom:**
```
Error: Hydration failed because the initial UI does not match what was rendered on the server.
```

**Common Causes:**

**1. Client-only APIs in Server Components**
```typescript
// ❌ WRONG - Server Component
export default function MyComponent() {
  const [count, setCount] = useState(0); // Error!
  return <div>{count}</div>;
}

// ✅ CORRECT - Add "use client"
"use client";
export default function MyComponent() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

**2. Different HTML on Server vs Client**
```typescript
// ❌ WRONG
const now = new Date().toLocaleString(); // Different on server vs client

// ✅ CORRECT - Suppress hydration warning
<time suppressHydrationWarning>{now}</time>

// ✅ BETTER - Use useEffect for client-only
const [now, setNow] = useState<string>('');
useEffect(() => {
  setNow(new Date().toLocaleString());
}, []);
```

**3. Invalid HTML Nesting**
```tsx
// ❌ WRONG
<p>
  <div>Content</div> {/* div inside p is invalid */}
</p>

// ✅ CORRECT
<div>
  <div>Content</div>
</div>
```

---

## Development Server Issues

### Port 3000 Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

**Option 1: Kill the process**
```bash
# Using npx kill-port
npx kill-port 3000

# Manual (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Manual (Mac/Linux)
lsof -ti:3000 | xargs kill -9
```

**Option 2: Use different port**
```bash
npm run dev -- -p 3001
```

**Option 3: Fix the issue**
- Make sure you don't have multiple dev servers running
- Check for VS Code terminal instances
- Restart your computer if problem persists

---

### Hot Reload Not Working

**Symptoms:**
- Changes don't reflect without manual refresh
- Console shows disconnected
- "Fast Refresh" not working

**Solutions:**

**1. Clear Next.js cache**
```bash
rm -rf .next
npm run dev
```

**2. Check file watchers**
```bash
# Increase file watchers (Linux/Mac)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**3. Restart dev server**
```bash
# Stop server (Ctrl+C)
# Clear cache
rm -rf .next
# Start again
npm run dev
```

**4. Check next.config.ts**
```typescript
const nextConfig = {
  // Ensure these are not set
  // webpack: (config) => config, // Don't disable HMR
};
```

---

## Database Problems

### Prisma Client Not Generated

**Error:**
```
Cannot find module '@prisma/client'
```

**Solution:**
```bash
# Generate Prisma Client
npx prisma generate

# If that doesn't work, reinstall
npm install @prisma/client
npx prisma generate
```

---

### Database Connection Failed

**Error:**
```
Can't reach database server at `localhost:5432`
```

**Diagnosis:**
```bash
# Check DATABASE_URL in .env.local
cat .env.local | grep DATABASE_URL

# Test PostgreSQL connection
psql -h localhost -p 5432 -U your_user -d your_db

# Check if PostgreSQL is running
# Mac
brew services list

# Linux
systemctl status postgresql

# Windows
# Check Services app for PostgreSQL
```

**Solutions:**

**1. Start PostgreSQL**
```bash
# Mac
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows - Start via Services app
```

**2. Fix DATABASE_URL**
```env
# Format
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Example
DATABASE_URL="postgresql://admin:password123@localhost:5432/tecnoexpress"

# For development with no password
DATABASE_URL="postgresql://postgres@localhost:5432/tecnoexpress"
```

**3. Create database if missing**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE tecnoexpress;

# Exit
\q

# Run migrations
npx prisma migrate dev
```

---

### Migration Failed

**Error:**
```
Migration `20250118_xxx` failed to apply cleanly
```

**Solutions:**

**Development (Safe to reset):**
```bash
# Reset database (DESTRUCTIVE!)
npx prisma migrate reset

# Run migrations
npx prisma migrate dev
```

**Production (Careful!):**
```bash
# Mark migration as applied (if it partially ran)
npx prisma migrate resolve --applied 20250118_xxx

# Or roll forward
npx prisma migrate deploy
```

---

## Performance Issues

### Slow Page Load

**Diagnosis:**

1. **Check Network Tab**
   - Large images? (use Next.js Image)
   - Too many requests? (bundle/combine)
   - Slow API? (optimize queries)

2. **Check Lighthouse Score**
   ```bash
   # Use Chrome DevTools → Lighthouse
   # Target: 90+ Performance score
   ```

3. **Check Server Logs**
   - Slow database queries
   - External API timeouts

**Solutions:**

**1. Optimize Images**
```tsx
// ❌ WRONG
<img src="/large-image.jpg" />

// ✅ CORRECT
<Image
  src="/large-image.jpg"
  width={800}
  height={600}
  alt="Description"
  priority={isAboveFold}
/>
```

**2. Use Static Generation**
```tsx
// For pages that don't change often
export const dynamic = 'force-static';

// Or with revalidation
export const revalidate = 3600; // 1 hour
```

**3. Reduce JavaScript Bundle**
```tsx
// Use dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./heavy-component'));

// Lazy load images
<Image loading="lazy" />
```

---

### Memory Leaks

**Symptoms:**
- Dev server slows down over time
- Browser tab crashes
- High memory usage

**Solutions:**

**1. Clean up effects**
```tsx
useEffect(() => {
  const interval = setInterval(() => {
    // Do something
  }, 1000);

  // ✅ IMPORTANT: Cleanup
  return () => clearInterval(interval);
}, []);
```

**2. Clean up event listeners**
```tsx
useEffect(() => {
  const handleClick = () => { /* ... */ };
  document.addEventListener('click', handleClick);

  // ✅ IMPORTANT: Cleanup
  return () => document.removeEventListener('click', handleClick);
}, []);
```

**3. Avoid storing large objects in state**
```tsx
// ❌ WRONG - Storing entire large dataset
const [allProducts, setAllProducts] = useState<Product[]>([]);

// ✅ BETTER - Store only what's needed
const [productIds, setProductIds] = useState<string[]>([]);
```

---

## Quick Reference

### Checklist Before Committing

- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] No console errors in development
- [ ] TypeScript strict mode compliant
- [ ] All imports are used
- [ ] No `@ts-ignore` comments (unless absolutely necessary)
- [ ] Changes tested in browser

### Checklist Before Deploying

- [ ] Build succeeds locally
- [ ] Environment variables documented
- [ ] Database migrations created
- [ ] API endpoints tested
- [ ] Images optimized
- [ ] No hardcoded secrets
- [ ] Changelog updated
- [ ] Version bumped in package.json

---

## Getting Help

If you're still stuck:

1. **Check Documentation**
   - [TypeScript Best Practices](./TYPESCRIPT_BEST_PRACTICES.md)
   - [Project README](./README.md)
   - [Changelog](../CHANGELOG.md)

2. **Search Issues**
   - [GitHub Issues](https://github.com/octa89/CelPhoneStore/issues)
   - Search for your error message

3. **Ask for Help**
   - Create a new GitHub issue
   - Include error messages, stack traces
   - Describe what you've tried
   - Email: info@geolink.dev

---

## Appendix: Useful Commands

```bash
# Clean everything and start fresh
rm -rf node_modules .next package-lock.json
npm install
npm run dev

# Check for outdated packages
npm outdated

# Update packages (careful!)
npm update

# Check bundle size
npm run build
# Look at the output table

# Analyze bundle
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build

# Database
npx prisma studio              # Visual editor
npx prisma migrate dev         # Create migration
npx prisma migrate deploy      # Run migrations (prod)
npx prisma db push             # Push schema (dev only)
npx prisma db seed             # Run seed script

# Git
git status
git log --oneline -10
git diff
git stash                      # Temporarily save changes
git stash pop                  # Restore stashed changes
```

---

**Last Updated:** 2025-12-09
**Version:** 2.1.0
