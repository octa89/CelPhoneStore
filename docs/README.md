# Tecno Express - E-Commerce Platform Documentation

![Version](https://img.shields.io/badge/version-2.0.1-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Architecture](#architecture)
4. [Development Guide](#development-guide)
5. [TypeScript Guidelines](#typescript-guidelines)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)
8. [Contributing](#contributing)

---

## Overview

Tecno Express is a modern e-commerce platform for smartphones, tablets, and audio devices built with Next.js 15 and the Honor Global design system.

### Key Features

- **Modern Stack**: Next.js 15, React 19, TypeScript 5.x
- **Honor Design System**: Premium, minimalist UI with professional aesthetics
- **Full E-Commerce**: Product catalog, search, cart, checkout
- **Admin Panel**: Product management, carousel editing, order tracking
- **Type-Safe**: Strict TypeScript with comprehensive type checking
- **Optimized**: Server-side rendering, image optimization, static generation
- **Responsive**: Mobile-first design with full responsive support

### Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15.4.6 (App Router) |
| Language | TypeScript 5.x (Strict mode) |
| UI Library | React 19.1.0 |
| Styling | Tailwind CSS 3.4.1 |
| Animations | Framer Motion 11.15.0 |
| State Management | Zustand 5.0.2 |
| Database | PostgreSQL + Prisma ORM |
| Payment | Stripe |
| File Upload | UploadThing |
| Deployment | AWS Amplify |
| Icons | Lucide React 0.462.0 |

---

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- PostgreSQL 14+ (for production)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/octa89/CelPhoneStore.git
cd CelPhoneStore

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/tecnoexpress"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# UploadThing
UPLOADTHING_SECRET="sk_..."
UPLOADTHING_APP_ID="your-app-id"

# Admin
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2a$10$..." # Use bcrypt to hash

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting errors

# Database
npx prisma studio    # Open Prisma Studio
npx prisma migrate   # Run migrations
npx prisma generate  # Generate Prisma Client
```

---

## Architecture

### Directory Structure

```
iphone-electro-store/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (main)/            # Main app routes
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── product/       # Product pages
│   │   │   └── search/        # Search page
│   │   ├── admin/             # Admin panel routes
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── navbar.tsx
│   │   ├── product-card.tsx
│   │   ├── brands-dropdown.tsx
│   │   └── ...
│   ├── lib/                   # Utility functions
│   │   ├── types.ts           # TypeScript types
│   │   ├── products.ts        # Product utilities
│   │   ├── db.ts              # Database connection
│   │   └── utils.ts           # Helper functions
│   └── store/                 # Zustand state
│       └── cart-store.ts
├── prisma/                    # Database schema
│   └── schema.prisma
├── public/                    # Static assets
├── docs/                      # Documentation
│   ├── README.md
│   ├── TYPESCRIPT_BEST_PRACTICES.md
│   └── TROUBLESHOOTING.md
├── .env.local                 # Environment variables
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json
```

### Data Flow

```
User Request
    ↓
Next.js App Router (src/app)
    ↓
Server Components (RSC) ← API Routes (src/app/api)
    ↓                           ↓
Client Components          Prisma Client
    ↓                           ↓
Zustand Store              PostgreSQL
    ↓
UI Components
```

### Key Concepts

#### Server Components (Default)
- Fetch data on the server
- No JavaScript sent to client
- Better performance and SEO

```tsx
// src/app/product/[slug]/page.tsx
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  return <ProductDetail product={product} />;
}
```

#### Client Components (Interactive)
- Use `"use client"` directive
- Access browser APIs
- Handle user interactions

```tsx
// src/components/add-to-cart-button.tsx
"use client";
import { useCartStore } from "@/store/cart-store";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore(state => state.addItem);
  return <button onClick={() => addItem(product)}>Add to Cart</button>;
}
```

#### API Routes
- Server-side endpoints
- Database operations
- External API calls

```tsx
// src/app/api/products/route.ts
export async function GET() {
  const products = await prisma.product.findMany();
  return Response.json({ products });
}
```

---

## Development Guide

### Adding a New Product

1. **Via Admin Panel** (Recommended)
   - Navigate to `/admin` and login
   - Click "Products" → "Add New Product"
   - Fill in product details
   - Upload images
   - Click "Save"

2. **Via Database** (Development)
   ```typescript
   // Use Prisma Studio
   npx prisma studio
   ```

3. **Via Code** (Initial Setup)
   ```typescript
   // src/lib/products.ts
   export const products: Product[] = [
     {
       id: "unique-id",
       slug: "product-slug",
       name: "Product Name",
       brand: "Brand",
       priceCents: 99900, // $999.00
       images: ["https://..."],
       tags: ["Feature 1", "Feature 2"],
       specs: {
         Storage: "256 GB",
         Processor: "Snapdragon 8 Gen 3",
       },
       category: "android",
       description: "Product description",
       featured: false,
     },
   ];
   ```

### Creating a New Component

1. Create the component file:
   ```tsx
   // src/components/my-component.tsx
   "use client"; // If it needs interactivity

   import { type Product } from "@/lib/types";

   interface MyComponentProps {
     product: Product;
     onAction?: () => void;
   }

   export function MyComponent({ product, onAction }: MyComponentProps) {
     return (
       <div className="rounded-honor shadow-honor p-6">
         <h3 className="text-xl font-semibold">{product.name}</h3>
         {onAction && (
           <button onClick={onAction} className="btn-primary">
             Action
           </button>
         )}
       </div>
     );
   }
   ```

2. Follow Honor design system:
   - Use `rounded-honor`, `shadow-honor` for cards
   - Use `btn-primary`, `btn-secondary` for buttons
   - Use `text-honor-text-primary` for text
   - Use `section-padding` for sections

### Adding a New Route

```tsx
// src/app/my-route/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Page | Tecno Express",
  description: "Page description for SEO",
};

export default function MyPage() {
  return (
    <div className="section-padding">
      <div className="container-honor">
        <h1 className="text-5xl font-bold">My Page</h1>
      </div>
    </div>
  );
}
```

### Working with the Cart

```tsx
"use client";
import { useCartStore } from "@/store/cart-store";

export function MyComponent() {
  const { items, addItem, removeItem, clearCart } = useCartStore();

  return (
    <div>
      <p>Cart Items: {items.length}</p>
      <button onClick={() => addItem(product)}>Add</button>
      <button onClick={() => removeItem(product.id)}>Remove</button>
      <button onClick={clearCart}>Clear</button>
    </div>
  );
}
```

---

## TypeScript Guidelines

### CRITICAL: Object.entries() Type Safety

This is the most common TypeScript error in this codebase. See [TYPESCRIPT_BEST_PRACTICES.md](./TYPESCRIPT_BEST_PRACTICES.md) for complete details.

**Problem:**
```typescript
const grouped: Record<string, Product[]> = { /* ... */ };

// ❌ WRONG: products is inferred as unknown
const groups = Object.entries(grouped)
  .map(([brand, products]) => ({ brand, products }));
```

**Solution:**
```typescript
// ✅ CORRECT: Add type annotation + type assertion
const groups: BrandGroup[] = Object.entries(grouped)
  .map(([brand, products]) => ({ brand, products: products as Product[] }));
```

### Type Definitions

All types are defined in `src/lib/types.ts`:

```typescript
export interface Product {
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
```

### Strict Mode Requirements

- ✅ All function parameters must be typed
- ✅ No implicit `any` types
- ✅ Handle null/undefined properly
- ✅ Use type guards for runtime checks
- ✅ Explicit return types for exported functions

---

## Deployment

### AWS Amplify

This project is configured for AWS Amplify deployment.

**amplify.yml:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

**next.config.ts:**
```typescript
const nextConfig = {
  output: 'standalone', // Required for Amplify
  // ... other config
};
```

### Environment Variables in Amplify

1. Go to Amplify Console
2. Select your app
3. Go to "Environment variables"
4. Add all variables from `.env.local`

### Build Verification

Before deploying:

```bash
# Run all checks
npm run lint
npm run build

# Verify no TypeScript errors
# Verify build completes successfully
# Verify all pages generate
```

---

## Troubleshooting

### Common Build Errors

#### 1. TypeScript Error: Object.entries() Type Inference

**Error:**
```
Type '{ brand: string; products: unknown; }[]' is not assignable to type 'BrandGroup[]'
```

**Solution:**
See [TYPESCRIPT_BEST_PRACTICES.md](./TYPESCRIPT_BEST_PRACTICES.md#objectentries-type-inference-issues)

#### 2. Missing @next/swc Dependencies

**Error:**
```
Found lockfile missing swc dependencies
```

**Solution:**
```bash
npm install
```

#### 3. Build Fails on Amplify

**Causes:**
- Missing environment variables
- Node version mismatch
- TypeScript errors

**Solution:**
1. Check Amplify build logs
2. Verify environment variables are set
3. Ensure Node 20+ is specified
4. Run `npm run build` locally to reproduce

### Development Issues

#### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

#### Database Connection Issues

```bash
# Check DATABASE_URL in .env.local
# Test connection
npx prisma db push

# Reset database (development only!)
npx prisma migrate reset
```

#### Type Errors After Git Pull

```bash
# Regenerate Prisma Client
npx prisma generate

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Contributing

### Code Style

- Use TypeScript strict mode
- Follow Honor design system
- Add JSDoc comments for complex functions
- Keep components small and focused
- Write meaningful commit messages

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Example:**
```
fix: TypeScript type inference error in brands dropdown

- Added explicit type annotation to groups variable
- Added type assertion for products array
- Fixes AWS Amplify build error

Closes #123
```

### Pull Request Process

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Run tests: `npm run lint && npm run build`
4. Commit with descriptive message
5. Push and create PR
6. Wait for review

---

## Resources

### Internal Documentation

- [TypeScript Best Practices](./TYPESCRIPT_BEST_PRACTICES.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Changelog](../CHANGELOG.md)

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Prisma Docs](https://www.prisma.io/docs)

---

## Support

- **Email**: info@geolink.dev
- **GitHub Issues**: [Report a bug](https://github.com/octa89/CelPhoneStore/issues)
- **Documentation**: See `/docs` folder

---

## License

Proprietary - Tecno Express © 2025

Developed by [GeoLink IT Services](mailto:info@geolink.dev)
