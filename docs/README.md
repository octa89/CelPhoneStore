# Tecno Express - E-Commerce Platform Documentation

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
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
- **Admin Panel**: Product management, carousel editing, categories, drag-and-drop ordering
- **AI Chatbot**: OpenAI-powered customer service with lead capture and analytics
- **Email Notifications**: Automatic lead notifications with model and location extraction
- **Type-Safe**: Strict TypeScript with comprehensive type checking
- **Optimized**: Server-side rendering, image optimization, static generation
- **Mobile-First**: Fully responsive design optimized for iPhone (430x932) and all screen sizes
- **Cloud Database**: AWS DynamoDB for persistent, scalable data storage
- **Production-Ready**: JWT authentication, rate limiting, activity logging

### Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15.4.6 (App Router) |
| Language | TypeScript 5.x (Strict mode) |
| UI Library | React 19.1.0 |
| Styling | Tailwind CSS 3.4.14 |
| Animations | Framer Motion 12.23.12 |
| Drag & Drop | @dnd-kit/core 6.3.1, @dnd-kit/sortable 10.0.0 |
| State Management | Zustand 5.0.7 |
| Database | AWS DynamoDB with DocumentClient |
| Payment | Stripe (ready for integration) |
| Storage | AWS S3 (via AWS SDK) |
| Deployment | AWS Amplify (Standalone) |
| Icons | Lucide React 0.554.0 |
| Authentication | JWT (jose 6.1.2) + Rate Limiting |
| AI/Chatbot | OpenAI GPT-3.5/4 with Function Calling |
| Email | Nodemailer with SMTP |

---

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- AWS Account (for DynamoDB)
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
# Admin Panel Authentication
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
SESSION_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))">

# DynamoDB Configuration (no AWS_ prefix to avoid Amplify conflicts)
DYNAMODB_REGION=us-east-2
DYNAMODB_ACCESS_KEY_ID=AKIA****************
DYNAMODB_SECRET_ACCESS_KEY=****************************************

# DynamoDB Table Names
DYNAMODB_PRODUCTS_TABLE=tecnoexpress-products
DYNAMODB_CAROUSEL_TABLE=tecnoexpress-carousel
DYNAMODB_ACTIVITY_LOG_TABLE=tecnoexpress-activity-log
DYNAMODB_CATEGORIES_TABLE=tecnoexpress-categories

# Stripe (Optional - for payment integration)
STRIPE_SECRET_KEY=sk_test_************************
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_************************

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**For detailed AWS setup, see:** [DYNAMODB_SETUP_GUIDE.md](../DYNAMODB_SETUP_GUIDE.md)

### Available Scripts

```bash
# Development
npm run dev                   # Start dev server (http://localhost:3000)
npm run build                 # Build for production
npm run start                 # Start production server
npm run lint                  # Run ESLint

# DynamoDB Data Management
npm run migrate:dynamodb      # Migrate data from JSON to DynamoDB
                              # (Requires AWS credentials in .env.local)

# AWS Amplify Deployment
npm run amplify:sandbox       # Test in Amplify sandbox
npm run amplify:deploy        # Deploy to AWS Amplify
npm run amplify:delete        # Delete Amplify resources
```

---

## Architecture

### Directory Structure

```
iphone-electro-store/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (main)/               # Public storefront routes
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── product/          # Product detail pages
│   │   │   └── search/           # Search results page
│   │   ├── admin/                # Admin panel (8 pages, fully mobile-responsive)
│   │   │   ├── page.tsx          # Dashboard
│   │   │   ├── login/            # JWT authentication with rate limiting
│   │   │   ├── products/         # Product CRUD + drag-and-drop ordering
│   │   │   ├── carousel/         # Hero carousel management
│   │   │   └── categories/       # Category management
│   │   ├── api/                  # API routes
│   │   │   ├── admin/            # Admin API endpoints (protected)
│   │   │   └── products/         # Public product API
│   │   └── layout.tsx            # Root layout
│   ├── components/               # React components
│   │   ├── navbar.tsx            # Sticky nav with backdrop blur
│   │   ├── product-card.tsx      # Honor design card with hover effects
│   │   ├── hero-carousel.tsx     # Auto-advancing carousel
│   │   └── contact-footer.tsx    # Multi-column footer with form
│   ├── lib/                      # Core utilities
│   │   ├── types.ts              # TypeScript type definitions
│   │   ├── dynamodb.ts           # DynamoDB client configuration
│   │   ├── dynamodb-service.ts   # DynamoDB CRUD operations
│   │   ├── auth.ts               # JWT authentication
│   │   ├── rate-limit.ts         # Rate limiting for login
│   │   └── utils.ts              # Helper functions
│   ├── store/                    # Zustand state management
│   │   └── cart-store.ts         # Shopping cart state
│   └── data/                     # Static data (for reference)
│       ├── products.json         # Legacy product data
│       └── categories.json       # Category definitions
├── scripts/                      # Utility scripts
│   └── migrate-to-dynamodb.ts    # DynamoDB migration script
├── public/                       # Static assets
├── docs/                         # Comprehensive documentation
│   ├── README.md                 # Main project documentation
│   ├── INDEX.md                  # Documentation index
│   ├── TYPESCRIPT_BEST_PRACTICES.md
│   └── TROUBLESHOOTING.md
├── amplify/                      # AWS Amplify backend config
├── .env.local                    # Environment variables (not in git)
├── amplify.yml                   # Amplify build configuration
├── next.config.ts                # Next.js config (standalone output)
├── tailwind.config.ts            # Tailwind + Honor design tokens
├── tsconfig.json                 # TypeScript strict mode
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
Client Components          DynamoDB Service Layer
    ↓                           ↓
Zustand Store          AWS DynamoDB DocumentClient
    ↓                           ↓
UI Components              DynamoDB Tables
                               ├── products
                               ├── carousel
                               ├── categories
                               └── activity-log
```

### DynamoDB Architecture

**Why DynamoDB?**
- **Persistent Storage**: Data survives AWS Amplify deployments (JSON files didn't)
- **Scalability**: Auto-scales with traffic, no server management
- **Performance**: Single-digit millisecond latency
- **Cost-Effective**: Free tier covers ~100 products, < $1/month for typical usage
- **Serverless**: Perfect for Next.js standalone deployment on Amplify

**Tables Structure:**

| Table | Partition Key | Sort Key | Purpose |
|-------|--------------|----------|---------|
| `tecnoexpress-products` | `id` (String) | - | Product catalog with full details |
| `tecnoexpress-carousel` | `id` (String) | - | Hero carousel slides |
| `tecnoexpress-categories` | `id` (String) | - | Product categories |
| `tecnoexpress-activity-log` | `id` (String) | `timestamp` (String) | Admin activity tracking |

**Service Layer (`src/lib/dynamodb-service.ts`):**
- Centralized CRUD operations
- Type-safe queries with TypeScript
- Error handling and logging
- Automatic data marshalling/unmarshalling

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

2. **Via AWS Console** (Development)
   - Go to AWS Console -> DynamoDB
   - Select the `tecnoexpress-products` table
   - Click "Explore table items"
   - Add or edit items directly

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

### Working with DynamoDB

**Fetching Data:**
```typescript
// src/app/admin/products/page.tsx
import { getAllProducts } from "@/lib/dynamodb-service";

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Creating/Updating Data:**
```typescript
// src/app/api/admin/products/route.ts
import { createProduct, updateProduct } from "@/lib/dynamodb-service";

export async function POST(request: Request) {
  const data = await request.json();
  const product = await createProduct(data);
  return Response.json({ product });
}

export async function PUT(request: Request) {
  const data = await request.json();
  const product = await updateProduct(data.id, data);
  return Response.json({ product });
}
```

**Migration from JSON:**
```bash
# One-time migration to move data from JSON files to DynamoDB
npm run migrate:dynamodb

# This will:
# 1. Read products.json, categories.json, etc.
# 2. Upload all data to DynamoDB tables
# 3. Verify migration success
# 4. Log summary of migrated items
```

---

## Mobile Responsiveness

### iPhone Optimization (430x932)

All admin pages are fully responsive and optimized for iPhone screens:

**Responsive Breakpoints:**
```typescript
// tailwind.config.ts
screens: {
  'sm': '640px',   // Mobile landscape / Small tablets
  'md': '768px',   // Tablets
  'lg': '1024px',  // Laptops
  'xl': '1280px',  // Desktops
}
```

**Mobile-First Design Patterns:**

#### 1. **Adaptive Layouts**
```tsx
// Desktop: Side-by-side | Mobile: Stacked
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Content automatically stacks on mobile */}
</div>
```

#### 2. **Responsive Typography**
```tsx
// Scales from mobile to desktop
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
  {/* 30px → 36px → 48px */}
</h1>
```

#### 3. **Touch-Friendly Targets**
```tsx
// Minimum 44px tap targets on mobile
<button className="min-h-[44px] px-6 py-3 text-base">
  Touch-Friendly Button
</button>
```

#### 4. **Responsive Tables**
```tsx
// Admin panels use horizontal scroll on mobile
<div className="overflow-x-auto">
  <table className="min-w-full">
    {/* Table content */}
  </table>
</div>
```

#### 5. **Mobile Navigation**
```tsx
// Hamburger menu on mobile, full nav on desktop
<nav className="hidden md:flex md:space-x-6">
  {/* Desktop links */}
</nav>
<button className="md:hidden" aria-label="Menu">
  {/* Mobile menu toggle */}
</button>
```

### Admin Panel Mobile Features

**Products Management (`/admin/products`):**
- ✅ Responsive product cards (1 column mobile → 3 columns desktop)
- ✅ Touch-friendly edit/delete buttons
- ✅ Mobile-optimized forms with proper input sizes
- ✅ Image previews scale appropriately

**Drag-and-Drop Ordering (`/admin/products/order`):**
- ✅ Touch-enabled drag gestures (@dnd-kit/core)
- ✅ Visual feedback for dragging on mobile
- ✅ Snap-to-grid positioning
- ✅ Single-column layout on mobile for easy dragging

**Carousel Management (`/admin/carousel`):**
- ✅ Mobile-friendly carousel preview
- ✅ Stacked form fields on small screens
- ✅ Full-width buttons on mobile

**Categories Management (`/admin/categories`):**
- ✅ Responsive category cards
- ✅ Touch-optimized CRUD operations
- ✅ Mobile-friendly color pickers

### Testing Responsiveness

**Manual Testing:**
```bash
# Start dev server
npm run dev

# Test on actual device via network:
# 1. Find your local IP: ipconfig (Windows) or ifconfig (Mac/Linux)
# 2. Access from phone: http://YOUR_IP:3000
# 3. Test all admin pages at 430x932 resolution
```

**Browser DevTools:**
```
1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select "iPhone 14 Pro" or custom 430x932
4. Test all interactive elements
5. Verify touch targets are 44px minimum
```

**Responsive Design Checklist:**
- ✅ All text is readable without zooming
- ✅ Buttons are touch-friendly (minimum 44x44px)
- ✅ Forms use appropriate input types (tel, email, etc.)
- ✅ No horizontal scrolling on mobile (except tables)
- ✅ Images scale properly and load optimized sizes
- ✅ Navigation is accessible via hamburger menu
- ✅ Tables are scrollable horizontally on mobile
- ✅ Modals/dialogs fit within viewport

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
# Check DynamoDB credentials in .env.local
# Verify DYNAMODB_REGION, DYNAMODB_ACCESS_KEY_ID, DYNAMODB_SECRET_ACCESS_KEY

# Test connection by running the app
npm run dev
# Check browser console and server logs for DynamoDB errors
```

#### Type Errors After Git Pull

```bash
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
