"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/use-cart";
import { Badge } from "./ui";
import MobileMenu from "./mobile-menu";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const { totalCount, toggleCart } = useCart();
  const [q, setQ] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {/* Mobile Menu - Rendered outside navbar to avoid container restrictions */}
      <MobileMenu />

      <header className="sticky top-0 z-40 border-b border-tecno-cyan/20 bg-tecno-bg/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          {/* Hamburger Button - Only visible on mobile */}
          <button
            onClick={() => {
              // Trigger the mobile menu to open
              const event = new CustomEvent('toggleMobileMenu');
              window.dispatchEvent(event);
            }}
            className="relative p-2 rounded-lg hover:bg-tecno-primary/20 transition-colors lg:hidden"
            aria-label="Menú de navegación"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className="w-full h-0.5 bg-tecno-cyan rounded-full" />
              <span className="w-full h-0.5 bg-tecno-cyan rounded-full" />
              <span className="w-full h-0.5 bg-tecno-cyan rounded-full" />
            </div>
          </button>

          {/* Logo */}
          <Link href="/" className="font-bold tracking-tight text-lg sm:text-xl flex items-center gap-2 group">
          <span className="text-tecno-mint group-hover:text-tecno-cyan transition-colors">
            TECNO
          </span>
          <span className="text-tecno-bolt">
            EXPRESS
          </span>
          <span className="text-tecno-bolt text-2xl">⚡</span>
        </Link>

        {/* Search Bar */}
        <form
          className="hidden md:flex items-center gap-2 flex-1 max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/search?q=${encodeURIComponent(q)}`);
          }}
          role="search"
        >
          <label htmlFor="search-input" className="sr-only">
            Buscar productos
          </label>
          <div className="relative flex-1">
            <input
              id="search-input"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar celulares, tablets, accesorios..."
              className="w-full rounded-full glass px-5 py-2.5 outline-none text-text-main placeholder:text-text-muted
                         focus:ring-2 focus:ring-tecno-cyan/50 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-primary text-white px-4 py-1.5 rounded-full text-sm font-medium
                         hover:brightness-110 transition-all"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-4">
          {/* Mobile Search Link */}
          <Link
            href="/search"
            className="md:hidden text-sm text-tecno-cyan hover:text-tecno-mint transition-colors"
          >
            🔍 Buscar
          </Link>

          {/* Admin Link (will be protected later) */}
          <Link
            href="/admin"
            className="hidden lg:block text-sm text-text-muted hover:text-tecno-mint transition-colors"
          >
            Admin
          </Link>

          {/* Cart Button */}
          <button
            onClick={toggleCart}
            className="relative p-2 rounded-full hover:bg-tecno-primary/20 transition-colors group"
            aria-label={`Carrito de compras con ${isMounted ? totalCount() : 0} productos`}
          >
            <svg
              className="w-6 h-6 text-tecno-cyan group-hover:text-tecno-mint transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <Badge className="absolute -top-1 -right-1 bg-tecno-bolt text-tecno-bg font-bold">
              {isMounted ? totalCount() : 0}
            </Badge>
          </button>
        </div>
        </div>
      </header>
    </>
  );
}
