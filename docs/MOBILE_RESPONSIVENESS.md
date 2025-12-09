# Mobile Responsiveness Guide

## Overview

Tecno Express is built with a **mobile-first** approach, ensuring all pages are fully responsive from 320px to 2560px+ widths. Special attention has been given to iPhone optimization (430x932 resolution).

---

## Design Philosophy

### Mobile-First Approach

All components start with mobile styling and progressively enhance for larger screens:

```tsx
// ✅ CORRECT: Mobile-first
<div className="text-base md:text-lg lg:text-xl">
  {/* Starts at 16px, grows to 18px on tablets, 20px on desktop */}
</div>

// ❌ WRONG: Desktop-first
<div className="text-xl lg:text-base">
  {/* Don't scale down, always scale up */}
</div>
```

### Touch-First Interactions

- **Minimum tap target:** 44x44px (Apple HIG recommendation)
- **Spacing between targets:** 8px minimum
- **No hover-dependent features:** All actions accessible via touch
- **Large, clear buttons:** Easy to tap with thumbs

---

## Breakpoint System

### Tailwind Breakpoints

```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'sm': '640px',   // Mobile landscape, small tablets
      'md': '768px',   // Tablets (iPad Mini)
      'lg': '1024px',  // Small laptops (iPad Pro landscape)
      'xl': '1280px',  // Desktop
      '2xl': '1536px', // Large desktop
    }
  }
}
```

### Usage Guidelines

| Screen Size | Breakpoint | Typical Devices | Layout Strategy |
|-------------|------------|-----------------|-----------------|
| 320-639px | Base (mobile) | iPhone SE, iPhone 14 | Single column, stacked |
| 640-767px | `sm:` | iPhone landscape, large phones | 2 columns max |
| 768-1023px | `md:` | iPad Mini, Android tablets | 2-3 columns |
| 1024-1279px | `lg:` | iPad Pro, small laptops | 3-4 columns, sidebars |
| 1280+ | `xl:` | Desktop monitors | Full layout |

---

## Responsive Patterns

### 1. Grid Layouts

**Product Grids:**
```tsx
// 1 column mobile → 2 tablet → 3 desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <ProductCard />
  <ProductCard />
  <ProductCard />
</div>
```

**Admin Dashboard:**
```tsx
// Single column mobile → Two columns desktop
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <StatsCard />
  <ActivityLog />
</div>
```

### 2. Typography Scaling

**Headlines:**
```tsx
// Mobile: 30px → Tablet: 36px → Desktop: 48px
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
  Tecno Express
</h1>
```

**Body Text:**
```tsx
// Mobile: 14px → Desktop: 16px
<p className="text-sm md:text-base leading-relaxed">
  Product description text
</p>
```

**Section Titles:**
```tsx
// Mobile: 24px → Desktop: 36px
<h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
  Featured Products
</h2>
```

### 3. Spacing & Padding

**Section Padding (Honor Standard):**
```tsx
// Mobile: 64px vertical → Desktop: 96px vertical
<section className="section-padding"> {/* py-16 md:py-24 */}
  {/* Content */}
</section>
```

**Container Padding:**
```tsx
// Mobile: 16px → Tablet: 24px → Desktop: 32px
<div className="container-honor"> {/* px-4 sm:px-6 lg:px-8 */}
  {/* Content */}
</div>
```

**Component Gaps:**
```tsx
// Mobile: 16px → Desktop: 32px
<div className="flex flex-col gap-4 md:gap-8">
  {/* Items */}
</div>
```

### 4. Navigation Patterns

**Desktop Navigation:**
```tsx
<nav className="hidden md:flex items-center space-x-6">
  <Link href="/products">Products</Link>
  <Link href="/about">About</Link>
  <Link href="/contact">Contact</Link>
</nav>
```

**Mobile Menu:**
```tsx
<button
  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
  aria-label="Open menu"
>
  <Menu className="w-6 h-6" />
</button>

{/* Mobile menu drawer */}
<div className={`
  fixed inset-y-0 right-0 w-64 bg-white shadow-xl
  transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}
  transition-transform md:hidden
`}>
  {/* Menu content */}
</div>
```

### 5. Form Layouts

**Stacked on Mobile, Side-by-Side on Desktop:**
```tsx
<form className="grid grid-cols-1 md:grid-cols-2 gap-5">
  <input placeholder="Name" />
  <input placeholder="Email" />
  <textarea className="md:col-span-2" placeholder="Message" />
  <button className="md:col-span-2 btn-primary">Submit</button>
</form>
```

**Full-Width Inputs on Mobile:**
```tsx
<input className="w-full px-4 py-3 rounded-honor-lg border" />
```

### 6. Button Behavior

**Full-Width Mobile, Auto Desktop:**
```tsx
<button className="btn-primary w-full md:w-auto">
  Add to Cart
</button>
```

**Touch-Friendly Sizes:**
```tsx
// Minimum 44x44px tap target
<button className="min-h-[44px] px-6 py-3 text-base">
  Touch Me
</button>
```

### 7. Image Handling

**Responsive Images:**
```tsx
import Image from 'next/image';

<Image
  src={product.image}
  alt={product.name}
  width={800}
  height={600}
  className="w-full h-auto object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 8. Tables on Mobile

**Horizontal Scroll:**
```tsx
<div className="overflow-x-auto -mx-4 sm:mx-0">
  <table className="min-w-full divide-y divide-gray-200">
    {/* Table content */}
  </table>
</div>
```

**Card View Alternative:**
```tsx
{/* Desktop: Table */}
<table className="hidden md:table">
  {/* Rows */}
</table>

{/* Mobile: Cards */}
<div className="md:hidden space-y-4">
  {data.map(item => (
    <div key={item.id} className="border rounded-lg p-4">
      <div className="font-semibold">{item.name}</div>
      <div className="text-sm text-gray-600">{item.email}</div>
    </div>
  ))}
</div>
```

---

## Admin Panel Mobile Optimization

### Dashboard (`/admin`)

**Mobile Layout:**
- ✅ Stacked stat cards (1 column)
- ✅ Full-width activity log
- ✅ Collapsible sections
- ✅ Touch-friendly action buttons

**Desktop Layout:**
- ✅ 2-column grid for stats
- ✅ Side-by-side panels
- ✅ More compact spacing

### Products Management (`/admin/products`)

**Mobile Features:**
```tsx
// Product cards stack vertically
<div className="grid grid-cols-1 gap-4">
  {products.map(product => (
    <div className="border rounded-lg p-4">
      {/* Mobile-optimized card */}
      <Image className="w-full h-48 object-cover" />
      <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
      <div className="flex gap-2 mt-4">
        <button className="flex-1 btn-secondary">Edit</button>
        <button className="flex-1 btn-danger">Delete</button>
      </div>
    </div>
  ))}
</div>
```

**Desktop Features:**
```tsx
// 3-column grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Product cards */}
</div>
```

### Product Form (`/admin/products/new`)

**Mobile Optimizations:**
- ✅ Single-column form layout
- ✅ Full-width inputs
- ✅ Stacked image upload buttons
- ✅ Touch-friendly dropdowns
- ✅ Native mobile inputs (file picker, color picker)

**Implementation:**
```tsx
<form className="space-y-6">
  {/* Single column on mobile, 2 columns on desktop */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <input placeholder="Product Name" />
    <input placeholder="Brand" />
  </div>

  {/* Full width on all screens */}
  <textarea
    placeholder="Description"
    rows={4}
    className="w-full"
  />

  {/* Image uploads */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {[1,2,3,4].map(i => (
      <button
        key={i}
        type="button"
        className="aspect-square border-2 border-dashed rounded-lg
                   flex items-center justify-center
                   hover:border-honor-primary transition-colors"
      >
        <Plus className="w-8 h-8" />
      </button>
    ))}
  </div>

  {/* Full-width submit on mobile */}
  <button className="btn-primary w-full md:w-auto">
    Save Product
  </button>
</form>
```

### Drag-and-Drop Ordering (`/admin/products/order`)

**Mobile Strategy:**
- ✅ Single-column layout for easy dragging
- ✅ Large drag handles (touch-friendly)
- ✅ Visual feedback during drag
- ✅ Smooth animations

**Implementation:**
```tsx
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

<DndContext
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext
    items={products}
    strategy={verticalListSortingStrategy}
  >
    <div className="space-y-3">
      {products.map(product => (
        <SortableProductCard key={product.id} product={product} />
      ))}
    </div>
  </SortableContext>
</DndContext>
```

**Touch-Friendly Drag Handle:**
```tsx
<div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow">
  {/* Large drag handle */}
  <button
    {...attributes}
    {...listeners}
    className="p-2 cursor-grab active:cursor-grabbing touch-none"
    aria-label="Drag to reorder"
  >
    <GripVertical className="w-6 h-6 text-gray-400" />
  </button>

  {/* Product info */}
  <div className="flex-1">
    <p className="font-medium">{product.name}</p>
  </div>
</div>
```

### Carousel Management (`/admin/carousel`)

**Mobile Layout:**
```tsx
// Preview stacks above controls
<div className="space-y-6">
  {/* Full-width preview */}
  <div className="aspect-video rounded-lg overflow-hidden">
    <Image src={slide.image} className="w-full h-full object-cover" />
  </div>

  {/* Form fields stack */}
  <div className="space-y-4">
    <input placeholder="Title" className="w-full" />
    <input placeholder="Subtitle" className="w-full" />
    <input placeholder="CTA Text" className="w-full" />
  </div>
</div>
```

---

## Testing Mobile Responsiveness

### Browser DevTools Testing

**Chrome DevTools:**
```
1. Open DevTools (F12)
2. Click Toggle Device Toolbar (Ctrl+Shift+M)
3. Select preset:
   - iPhone 14 Pro (430x932)
   - iPhone SE (375x667)
   - iPad Mini (768x1024)
   - iPad Pro (1024x1366)
4. Test all pages and interactions
5. Check touch targets (44px minimum)
```

**Firefox Responsive Design Mode:**
```
1. Open DevTools (F12)
2. Click Responsive Design Mode (Ctrl+Shift+M)
3. Enter custom dimensions: 430x932
4. Test portrait and landscape
5. Verify text readability
```

### Real Device Testing

**Access Dev Server on Phone:**
```bash
# 1. Start dev server
npm run dev

# 2. Find your computer's IP address
# Windows:
ipconfig
# Look for "IPv4 Address" (e.g., 192.168.1.100)

# Mac/Linux:
ifconfig | grep "inet "
# Look for local IP (not 127.0.0.1)

# 3. On your phone, visit:
http://YOUR_IP:3000
# Example: http://192.168.1.100:3000

# Make sure phone and computer are on same WiFi network!
```

**Test Checklist:**
- [ ] All pages load correctly
- [ ] Navigation works (menu opens/closes)
- [ ] Forms are usable (inputs not too small)
- [ ] Buttons are touch-friendly (44x44px minimum)
- [ ] No horizontal scrolling (except tables)
- [ ] Images load and scale properly
- [ ] Text is readable without zooming
- [ ] Modals/popups fit on screen
- [ ] Drag-and-drop works with touch
- [ ] Color pickers work on mobile

### Automated Testing Tools

**Lighthouse Mobile Score:**
```bash
# Run Lighthouse audit
npm run build
npm start

# In Chrome:
# 1. Open DevTools → Lighthouse tab
# 2. Select "Mobile" device
# 3. Run audit
# Target scores:
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 100
# - SEO: 100
```

---

## Common Mobile Issues & Solutions

### Issue 1: Text Too Small

**Problem:**
```tsx
// ❌ Text is 12px on mobile - too small!
<p className="text-xs">This is hard to read</p>
```

**Solution:**
```tsx
// ✅ Minimum 14px (text-sm) on mobile
<p className="text-sm md:text-base">Now readable on all devices</p>
```

### Issue 2: Buttons Too Small

**Problem:**
```tsx
// ❌ Only 32px tall - hard to tap
<button className="px-3 py-1 text-xs">Click</button>
```

**Solution:**
```tsx
// ✅ 44px+ tap target
<button className="min-h-[44px] px-6 py-3 text-base">Click</button>
```

### Issue 3: Horizontal Scrolling

**Problem:**
```tsx
// ❌ Content wider than viewport
<div className="w-[500px]">Wide content</div>
```

**Solution:**
```tsx
// ✅ Constrain to viewport
<div className="max-w-full px-4">Responsive content</div>
```

### Issue 4: Images Not Scaling

**Problem:**
```tsx
// ❌ Fixed width breaks mobile
<img src="/image.jpg" width={800} height={600} />
```

**Solution:**
```tsx
// ✅ Responsive image
<Image
  src="/image.jpg"
  width={800}
  height={600}
  className="w-full h-auto"
  alt="Description"
/>
```

### Issue 5: Form Inputs Zooming

**Problem:**
```
Input font-size < 16px causes iOS to zoom when focused
```

**Solution:**
```tsx
// ✅ Minimum 16px font to prevent zoom
<input className="text-base px-4 py-3" /> {/* text-base = 16px */}
```

### Issue 6: Touch Areas Too Close

**Problem:**
```tsx
// ❌ Buttons too close together
<div className="flex gap-1">
  <button>Edit</button>
  <button>Delete</button>
</div>
```

**Solution:**
```tsx
// ✅ Adequate spacing for touch
<div className="flex gap-3 md:gap-2">
  <button className="min-h-[44px]">Edit</button>
  <button className="min-h-[44px]">Delete</button>
</div>
```

---

## Mobile Performance Optimization

### Image Optimization

**Use Next.js Image Component:**
```tsx
import Image from 'next/image';

// Automatically optimizes for mobile
<Image
  src={product.image}
  alt={product.name}
  width={800}
  height={600}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 50vw"
  className="w-full"
/>
```

### Lazy Loading

**Lazy Load Off-Screen Components:**
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### Reduce Bundle Size

**Code Splitting:**
```tsx
// Admin components only load in admin routes
const AdminPanel = dynamic(() => import('@/components/AdminPanel'), {
  ssr: false, // Don't render on server
});
```

---

## Accessibility on Mobile

### Screen Reader Support

```tsx
// Provide context for screen readers
<button
  aria-label="Add iPhone 16 Pro Max to cart"
  className="btn-primary"
>
  <ShoppingCart className="w-5 h-5" />
</button>
```

### Keyboard Navigation

```tsx
// Ensure focusable elements are accessible
<button
  className="focus:ring-2 focus:ring-honor-primary focus:outline-none"
  tabIndex={0}
>
  Focusable Button
</button>
```

### Color Contrast

```
Minimum WCAG AA contrast ratios:
- Normal text: 4.5:1
- Large text (18px+): 3:1
- Interactive elements: 3:1

Test with: Chrome DevTools → Lighthouse → Accessibility
```

---

## Summary Checklist

### Mobile-First Design
- [ ] Start with mobile styles, add breakpoints for larger screens
- [ ] Use `sm:`, `md:`, `lg:` prefixes for progressive enhancement
- [ ] Test on actual devices, not just emulators

### Touch Optimization
- [ ] 44x44px minimum tap targets
- [ ] 8px spacing between interactive elements
- [ ] No hover-dependent features
- [ ] Touch-friendly drag handles for sortables

### Layout Flexibility
- [ ] Grid layouts that stack on mobile
- [ ] Typography that scales with viewport
- [ ] Full-width buttons on mobile
- [ ] Responsive images with proper sizing

### Performance
- [ ] Lazy load images
- [ ] Code split heavy components
- [ ] Optimize bundle size for mobile networks
- [ ] Use Next.js Image component

### Testing
- [ ] Test on iPhone SE (375px) and iPhone 14 Pro (430px)
- [ ] Verify on actual iOS and Android devices
- [ ] Run Lighthouse mobile audits
- [ ] Check all admin pages at 430x932 resolution

---

**Last Updated:** December 2025
**Version:** 2.1.0
**Optimized For:** iPhone 14 Pro (430x932) and all modern devices
