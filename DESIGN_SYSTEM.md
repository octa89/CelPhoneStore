# Honor Global Design System - Documentation

## Overview

This project implements the **Honor Global** design system, inspired by https://www.honor.com/global/. The design follows a premium, minimalist aesthetic with clean typography, generous spacing, and a professional color palette.

---

## 🎨 Design Tokens

### Color Palette

#### Primary Colors
```css
--primary: #1A1F71        /* Deep blue - Primary brand color */
--accent: #E10071         /* Magenta - Accent for CTAs and highlights */
```

#### Background Colors
```css
--background: #FFFFFF     /* Clean white background */
--bg-light: #F5F5F7       /* Light gray for sections */
--bg-dark: #F8F8F8        /* Slightly darker gray */
```

#### Text Colors
```css
--text-primary: #1A1A1A   /* Primary text - High contrast */
--text-secondary: #6A6A6A /* Secondary text - Medium gray */
--text-muted: #999999     /* Muted text - Light gray */
```

#### Border & Divider Colors
```css
--border: #E5E5E5         /* Standard borders */
--divider: #EBEBEB        /* Section dividers */
```

### Tailwind Color Classes

```javascript
// In tailwind.config.ts
honor: {
  bg: '#FFFFFF',
  'bg-light': '#F5F5F7',
  'bg-dark': '#F8F8F8',
  'text-primary': '#1A1A1A',
  'text-secondary': '#6A6A6A',
  'text-muted': '#999999',
  primary: '#1A1F71',
  accent: '#E10071',
  border: '#E5E5E5',
  divider: '#EBEBEB',
}
```

---

## 📝 Typography System

### Font Family
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Type Scale (Honor Standard)

#### Headings
```css
/* H1 - Hero titles */
text-5xl md:text-6xl font-bold tracking-tight
/* 48px mobile → 60px desktop */

/* H2 - Section titles */
text-4xl md:text-5xl font-semibold
/* 36px mobile → 48px desktop */

/* H3 - Subsection titles */
text-2xl md:text-3xl font-medium
/* 24px mobile → 30px desktop */
```

#### Body Text
```css
/* Subtitle */
text-lg md:text-xl text-honor-text-secondary
/* 18px mobile → 20px desktop */

/* Body */
text-base text-honor-text-secondary leading-relaxed
/* 16px with relaxed line-height */

/* Small */
text-sm text-honor-text-muted
/* 14px for captions and meta info */
```

### Usage Examples

```tsx
// Hero Title
<h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
  Los Mejores Smartphones
</h1>

// Section Title
<h2 className="text-4xl md:text-5xl font-semibold text-honor-text-primary mb-4">
  Productos Destacados
</h2>

// Description
<p className="text-lg text-honor-text-secondary max-w-2xl mx-auto leading-relaxed">
  Descubre nuestra selección premium de smartphones
</p>
```

---

## 🔘 Button System

### Primary Button (Main CTAs)
```tsx
className="btn-primary"
// Generates:
px-8 py-3 bg-honor-primary text-white rounded-honor-lg text-lg font-semibold
hover:opacity-90 transition-all duration-200
w-full md:w-auto
```

**Use Cases:**
- Main call-to-action buttons
- "Add to Cart" buttons
- Form submissions
- Primary navigation actions

### Secondary Button (Alternative Actions)
```tsx
className="btn-secondary"
// Generates:
px-8 py-3 border-2 border-honor-primary text-honor-primary rounded-honor-lg text-lg font-semibold
hover:bg-honor-bg-light transition-all duration-200
w-full md:w-auto
```

**Use Cases:**
- Secondary actions ("Learn More", "View Details")
- Alternative paths
- Less prominent CTAs

### Accent Button (Special Actions)
```tsx
className="btn-accent"
// Generates:
px-8 py-3 bg-honor-accent text-white rounded-honor-lg text-lg font-semibold
hover:opacity-90 transition-all duration-200
w-full md:w-auto
```

**Use Cases:**
- Promotional actions
- Limited-time offers
- Featured badges

### Button Specifications

| Property | Value |
|----------|-------|
| **Padding** | `px-8 py-3` (32px horizontal, 12px vertical) |
| **Border Radius** | `16px` (rounded-honor-lg) |
| **Font Size** | `18px` (text-lg) |
| **Font Weight** | `600` (font-semibold) |
| **Transition** | `200ms` all properties |
| **Mobile Width** | `w-full` (100%) |
| **Desktop Width** | `w-auto` (content-based) |

---

## 📐 Spacing System

### Section Padding (Honor Standard)
```css
.section-padding {
  @apply py-16 md:py-24;
}
/* 64px mobile → 96px desktop vertical padding */
```

### Container Width
```css
.container-honor {
  @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
}
/* Max width: 1280px with responsive horizontal padding */
```

### Grid Gaps
```css
/* Product grids */
gap-8  /* 32px between items */

/* Form fields */
gap-5  /* 20px between inputs */

/* Footer columns */
gap-12 /* 48px between sections */
```

### Spacing Scale
```
4px  → gap-1
8px  → gap-2
12px → gap-3
16px → gap-4
20px → gap-5
24px → gap-6
32px → gap-8
48px → gap-12
64px → gap-16
```

---

## 🎯 Border Radius System

### Honor Border Radius Tokens
```javascript
borderRadius: {
  'honor': '12px',      // Standard cards and inputs
  'honor-lg': '16px',   // Buttons and featured cards
  'honor-xl': '24px',   // Large containers and modals
}
```

### Usage
```tsx
// Product cards
<div className="rounded-honor-xl">

// Buttons
<button className="rounded-honor-lg">

// Input fields
<input className="rounded-honor-lg">
```

---

## 🌓 Shadow System

### Honor Shadow Tokens
```javascript
boxShadow: {
  'honor': '0 2px 12px rgba(0, 0, 0, 0.06)',       // Standard elevation
  'honor-lg': '0 8px 24px rgba(0, 0, 0, 0.08)',    // Medium elevation
  'honor-xl': '0 12px 32px rgba(0, 0, 0, 0.12)',   // High elevation
  'honor-lift': '0 16px 48px rgba(0, 0, 0, 0.15)', // Hover state
}
```

### Usage
```tsx
// Base card
<div className="shadow-honor">

// Hover effect
<div className="hover:shadow-honor-xl transition-shadow">
```

---

## 🎬 Animation System

### Animation Tokens
```javascript
animation: {
  'fade-in': 'fadeIn 0.6s ease-out',
  'slide-up': 'slideUp 0.6s ease-out',
  'zoom': 'zoom 0.3s ease-out',
}
```

### Keyframes
```css
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes slideUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes zoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}
```

### Usage
```tsx
// Fade in content
<div className="animate-fade-in">

// Slide up on load
<section className="animate-slide-up">

// Product card hover
<div className="group">
  <img className="group-hover:scale-105 transition-transform duration-500" />
</div>
```

---

## 📦 Component Library

### Navbar
**File:** `src/components/navbar.tsx`

**Features:**
- Sticky positioning
- Backdrop blur effect (`glass` utility)
- Honor-style search bar
- Responsive mobile menu
- Cart icon with badge

**Structure:**
```tsx
<header className="sticky top-0 z-40 border-b border-honor-border glass">
  <div className="container-honor h-20">
    {/* Logo, Search, Cart */}
  </div>
</header>
```

---

### Hero Carousel
**File:** `src/components/hero-carousel.tsx`

**Specifications:**
- **Height:** 500px mobile → 700px desktop
- **Auto-advance:** 5 seconds per slide
- **Navigation:** Arrows + dot indicators
- **Animation:** Framer Motion with spring physics

**Typography:**
```tsx
<h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
<h2 className="text-3xl md:text-4xl font-semibold text-white/90">
<p className="text-lg md:text-xl text-white/80">
```

**CTA Buttons:**
```tsx
<Link href={cta.href} className="btn-primary">
<Link href="#productos" className="btn-secondary bg-white">
```

---

### Product Card
**File:** `src/components/product-card.tsx`

**Card Structure:**
```tsx
<motion.article className="group glass-card product-card-hover">
  {/* Image - 288px height */}
  <Link href={`/product/${slug}`}>
    <Image className="h-72 w-full object-cover group-hover:scale-105" />
  </Link>

  {/* Content - 24px padding */}
  <div className="p-6">
    {/* Brand, Name, Description, Price, Tags */}

    {/* Actions */}
    <button className="btn-primary">Agregar al Carrito</button>
    <Link className="btn-secondary">Ver Detalles</Link>
  </div>
</motion.article>
```

**Hover Effect:**
```css
.product-card-hover {
  @apply hover:shadow-honor-xl hover:-translate-y-1 transition-all duration-300;
}
```

---

### Product Grid
**File:** `src/components/product-grid.tsx`

**Grid Layout:**
```tsx
<section className="section-padding">
  {/* Title Section */}
  <div className="mb-12 text-center">
    <h2 className="text-4xl md:text-5xl font-semibold">
    <p className="text-lg text-honor-text-secondary">
  </div>

  {/* Products Grid */}
  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
    {/* 1 col mobile → 2 cols tablet → 3 cols desktop */}
  </div>
</section>
```

---

### Footer
**File:** `src/components/contact-footer.tsx`

**Layout Structure:**
```tsx
<footer className="border-t border-honor-border bg-honor-bg-light">
  <div className="container-honor py-16 md:py-24">

    {/* 4-Column Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      <div>{/* Company Info + Social */}</div>
      <div>{/* Quick Links */}</div>
      <div>{/* Contact Info */}</div>
      <div>{/* Business Hours */}</div>
    </div>

    {/* Contact Form Card */}
    <div className="bg-white rounded-honor-xl p-8 md:p-12">
      <form className="grid md:grid-cols-2 gap-5">
        {/* Name, Email, Phone, Message */}
      </form>
    </div>

    {/* Copyright Bar */}
    <div className="pt-8 border-t border-honor-border">
      {/* © 2025 Tecno Express */}
    </div>
  </div>
</footer>
```

---

## 🎨 Utility Classes

### Custom Utilities

```css
/* Container with max-width and padding */
.container-honor {
  @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
}

/* Section padding (Honor standard) */
.section-padding {
  @apply py-16 md:py-24;
}

/* Glass morphism effect */
.glass {
  @apply backdrop-blur-md border;
  background-color: rgba(255, 255, 255, 0.7);
  border-color: rgba(229, 229, 229, 0.5);
}

/* Glass card */
.glass-card {
  @apply bg-white border border-honor-border rounded-honor-xl;
  @apply shadow-honor hover:shadow-honor-lg transition-shadow duration-300;
}

/* Product card hover effect */
.product-card-hover {
  @apply hover:shadow-honor-xl hover:-translate-y-1 transition-all duration-300;
}

/* Gradient text */
.text-gradient-honor {
  @apply bg-gradient-primary bg-clip-text text-transparent;
}
```

---

## 📱 Responsive Breakpoints

### Tailwind Default Breakpoints
```javascript
screens: {
  'sm': '640px',   // Mobile landscape / Small tablets
  'md': '768px',   // Tablets
  'lg': '1024px',  // Laptops
  'xl': '1280px',  // Desktops
  '2xl': '1536px', // Large desktops
}
```

### Common Responsive Patterns

#### Typography
```tsx
// Mobile → Desktop
text-5xl md:text-6xl        // 48px → 60px
text-4xl md:text-5xl        // 36px → 48px
text-2xl md:text-3xl        // 24px → 30px
text-lg md:text-xl          // 18px → 20px
```

#### Spacing
```tsx
py-16 md:py-24              // 64px → 96px
gap-8 md:gap-12             // 32px → 48px
p-8 md:p-12                 // 32px → 48px
```

#### Layout
```tsx
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  // 1 → 2 → 3 columns
w-full md:w-auto                            // Full width → Auto
flex-col sm:flex-row                        // Vertical → Horizontal
```

---

## 🚀 Best Practices

### 1. Always Use Semantic HTML
```tsx
// Good ✅
<header>, <main>, <footer>, <section>, <article>

// Avoid ❌
<div>, <div>, <div> everywhere
```

### 2. Maintain Consistent Spacing
```tsx
// Use Honor section padding
<section className="section-padding">

// Use container for content width
<div className="container-honor">
```

### 3. Honor Button Guidelines
```tsx
// Primary action - Always visible
<button className="btn-primary">Add to Cart</button>

// Secondary action - Less prominent
<button className="btn-secondary">Learn More</button>

// Mobile full-width is automatic
// Desktop buttons are auto-width
```

### 4. Image Optimization
```tsx
// Always use next/image
import Image from 'next/image';

<Image
  src={product.image}
  alt={product.name}
  width={400}
  height={400}
  className="w-full h-72 object-cover"
/>
```

### 5. Accessibility
```tsx
// Provide aria-labels for icon buttons
<button aria-label="Open cart">
  <ShoppingCart />
</button>

// Use semantic link components
import Link from 'next/link';
<Link href="/products">Products</Link>
```

---

## 📚 File Structure

```
src/
├── app/
│   ├── globals.css          # Global styles + Honor utilities
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── navbar.tsx           # Sticky navigation
│   ├── hero-carousel.tsx    # Full-screen hero
│   ├── product-card.tsx     # Individual product
│   ├── product-grid.tsx     # Product listing
│   └── contact-footer.tsx   # Footer with form
└── lib/
    └── products.ts          # Product data
```

---

## 🎯 Design Checklist

When creating new components, ensure:

- [ ] Uses Honor color palette (`honor-*` classes)
- [ ] Typography follows Honor scale (text-5xl, text-4xl, etc.)
- [ ] Buttons use `.btn-primary` or `.btn-secondary`
- [ ] Sections use `.section-padding` (py-16 md:py-24)
- [ ] Content uses `.container-honor` for max-width
- [ ] Border radius uses `rounded-honor-*` tokens
- [ ] Shadows use `shadow-honor-*` tokens
- [ ] Responsive breakpoints follow mobile-first
- [ ] Animations are subtle and professional
- [ ] Accessibility labels are present

---

## 🔄 Migration from Old Design

### Color Migrations
```diff
- bg-tecno-bg          → bg-white
- text-tecno-cyan      → text-honor-primary
- bg-tecno-primary     → bg-honor-primary
- text-text-main       → text-honor-text-primary
- border-tecno-cyan    → border-honor-border
```

### Component Migrations
```diff
- .glass-card          → Updated with Honor shadows
- .btn-primary         → Honor-style rounded buttons
- Product cards        → Cleaner, more spacious
- Footer               → 4-column multi-layout
```

---

## 📞 Support & Contact

**Project Email:** info@geolink.dev
**Developer:** GeoLink IT Services
**Design System:** Honor Global Inspired

---

**Last Updated:** November 18, 2025
**Version:** 2.0.0 (Honor Global Edition)
