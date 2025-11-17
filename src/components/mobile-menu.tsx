"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

const brands = [
  { name: "Honor", slug: "honor", icon: "🏆" },
  { name: "Xiaomi", slug: "xiaomi", icon: "📱" },
  { name: "Samsung", slug: "samsung", icon: "🌟" },
  { name: "Google", slug: "google", icon: "🔍" },
  { name: "OnePlus", slug: "oneplus", icon: "🚀" },
  { name: "Microsoft", slug: "microsoft", icon: "💻" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const closeMenu = () => setIsOpen(false);

  // Check if we're mounted (client-side)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Listen for toggle event from navbar
  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggleMobileMenu', handleToggle);
    return () => window.removeEventListener('toggleMobileMenu', handleToggle);
  }, []);

  // Prevent body scroll when menu is open AND scroll menu content to top
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset scroll position to top when menu opens
      const menuPanel = document.getElementById('mobile-menu-panel');
      if (menuPanel) {
        menuPanel.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isMounted) return null;

  const menuContent = (
    <>
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeMenu}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] lg:hidden transition-opacity duration-300"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            aria-hidden="true"
          />

            {/* Menu Panel */}
            <aside
              id="mobile-menu-panel"
              className="w-[85vw] max-w-[320px] bg-tecno-bgDark border-r border-tecno-cyan/30 shadow-glow-lg z-[9999] lg:hidden overflow-y-auto transition-transform duration-300 ease-out"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                bottom: 0,
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
              }}
              aria-label="Menú de navegación móvil"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <Link href="/" onClick={closeMenu} className="font-bold text-xl flex items-center gap-2">
                    <span className="text-tecno-mint">TECNO</span>
                    <span className="text-tecno-bolt">EXPRESS</span>
                    <span className="text-tecno-bolt text-2xl">⚡</span>
                  </Link>
                  <button
                    onClick={closeMenu}
                    className="text-tecno-mint hover:text-tecno-cyan hover:rotate-90 transition-all duration-200 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-tecno-primary/20"
                  >
                    ✕
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-6">
                  {/* Brands Section */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-bold">
                      Marcas
                    </h3>
                    <ul className="space-y-2">
                      {brands.map((brand) => (
                        <li key={brand.slug}>
                          <Link
                            href={`/search?q=${brand.slug}`}
                            onClick={closeMenu}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-tecno-primary/20 text-text-main hover:text-tecno-cyan transition-all group"
                          >
                            <span className="text-2xl group-hover:scale-110 transition-transform">
                              {brand.icon}
                            </span>
                            <span className="font-medium">{brand.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-text-muted mb-3 font-bold">
                      Navegación
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="/#productos"
                          onClick={closeMenu}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-tecno-primary/20 text-text-main hover:text-tecno-cyan transition-all"
                        >
                          <span className="text-2xl">🛍️</span>
                          <span className="font-medium">Productos</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/admin/login"
                          onClick={closeMenu}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-tecno-primary/20 text-text-main hover:text-tecno-cyan transition-all"
                        >
                          <span className="text-2xl">🔐</span>
                          <span className="font-medium">Admin</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </nav>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-tecno-cyan/20">
                  <div className="glass-card rounded-xl p-4 text-center">
                    <p className="text-tecno-bolt font-bold text-sm mb-1">⚡ ENVÍO EXPRESS GRATIS</p>
                    <p className="text-xs text-text-muted">En todos los pedidos</p>
                  </div>
                </div>
              </div>
            </aside>
        </>
      )}
    </>
  );

  return createPortal(menuContent, document.body);
}
