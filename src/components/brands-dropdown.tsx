"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";

interface BrandGroup {
  brand: string;
  products: Product[];
}

export default function BrandsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [brandGroups, setBrandGroups] = useState<BrandGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        // Group products by brand
        const grouped = data.products.reduce((acc: Record<string, Product[]>, product: Product) => {
          if (!acc[product.brand]) {
            acc[product.brand] = [];
          }
          acc[product.brand].push(product);
          return acc;
        }, {});

        // Convert to array and sort brands alphabetically
        const groups = Object.entries(grouped)
          .map(([brand, products]) => ({ brand, products }))
          .sort((a, b) => a.brand.localeCompare(b.brand));

        setBrandGroups(groups);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.brands-dropdown-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative hidden lg:block brands-dropdown-container">
      {/* Trigger Button */}
      <button
        className="text-sm text-honor-text hover:text-honor-primary transition-colors py-2 px-4 flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
      >
        Marcas
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-honor-border rounded-honor-lg shadow-2xl overflow-hidden min-w-[800px] z-50">
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-honor-text-muted">Cargando marcas...</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {brandGroups.map((group) => (
                  <div key={group.brand} className="space-y-3">
                    {/* Brand Name - Clickable */}
                    <Link
                      href={`/search?q=${encodeURIComponent(group.brand)}`}
                      onClick={() => setIsOpen(false)}
                      className="font-bold text-honor-text-primary text-lg border-b border-honor-border pb-2 hover:text-honor-primary transition-colors cursor-pointer block"
                    >
                      {group.brand}
                      <span className="text-xs text-honor-text-muted ml-2 font-normal">
                        ({group.products.length})
                      </span>
                    </Link>

                    {/* Product Models */}
                    <ul className="space-y-2">
                      {group.products.slice(0, 6).map((product) => (
                        <li key={product.id}>
                          <Link
                            href={`/product/${product.slug}`}
                            className="text-sm text-honor-text-secondary hover:text-honor-primary transition-colors block py-1"
                          >
                            {product.name}
                          </Link>
                        </li>
                      ))}
                      {group.products.length > 6 && (
                        <li>
                          <Link
                            href={`/search?q=${encodeURIComponent(group.brand)}`}
                            className="text-sm text-honor-primary font-semibold hover:underline inline-flex items-center gap-1"
                          >
                            Ver todos ({group.products.length})
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - View All Brands */}
          <div className="bg-honor-bg-light border-t border-honor-border px-6 py-3">
            <Link
              href="/search"
              className="text-sm text-honor-primary font-semibold hover:underline inline-flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              Ver todos los productos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
