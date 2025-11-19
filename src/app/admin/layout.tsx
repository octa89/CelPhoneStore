"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show nav on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/products", label: "Productos", icon: "📱" },
    { href: "/admin/products/new", label: "Nuevo Producto", icon: "➕" },
    { href: "/admin/products/order", label: "Orden de Productos", icon: "🔢" },
    { href: "/admin/carousel", label: "Carrusel Hero", icon: "🎠" },
    { href: "/admin/categories", label: "Categorías", icon: "📁" },
  ];

  return (
    <div className="min-h-screen bg-tecno-bg">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 border-b border-tecno-cyan/20 bg-tecno-bgDark/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-tecno-cyan hover:bg-tecno-primary/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link href="/admin" className="font-bold tracking-tight text-lg flex items-center gap-2">
              <span className="text-tecno-mint">ADMIN</span>
              <span className="text-tecno-bolt">⚡</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="text-xs sm:text-sm text-tecno-cyan hover:text-tecno-mint transition-colors">
              <span className="hidden sm:inline">Ver Tienda →</span>
              <span className="sm:hidden">Tienda</span>
            </Link>
            <button
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                window.location.href = "/admin/login";
              }}
              className="text-xs sm:text-sm text-text-muted hover:text-red-400 transition-colors"
            >
              <span className="hidden sm:inline">Cerrar Sesión</span>
              <span className="sm:hidden">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex w-64 border-r border-tecno-cyan/20 bg-tecno-bgDark/50 p-4 flex-col">
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-primary text-white font-semibold shadow-glow"
                      : "text-text-muted hover:text-tecno-cyan hover:bg-tecno-primary/10"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer in Sidebar */}
          <div className="mt-auto pt-4 border-t border-tecno-cyan/20">
            <p className="text-xs text-text-muted text-center">
              Desarrollado por{" "}
              <a
                href="https://www.geolink.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-tecno-cyan hover:text-tecno-mint transition-colors font-semibold"
              >
                GeoLink IT Services
              </a>
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Menu - Slide from left */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          >
            <aside
              className="fixed left-0 top-0 bottom-0 w-64 max-w-[80vw] bg-tecno-bgDark border-r border-tecno-cyan/20 shadow-2xl flex flex-col overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-tecno-cyan/20 sticky top-0 bg-tecno-bgDark z-10">
                <h2 className="text-lg font-bold text-tecno-cyan">Admin Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-tecno-primary/20 rounded-lg transition-colors"
                  aria-label="Cerrar menú"
                >
                  <X size={20} className="text-tecno-cyan" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="space-y-2 flex-1 p-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-gradient-primary text-white font-semibold shadow-glow"
                          : "text-text-muted hover:text-tecno-cyan hover:bg-tecno-primary/10"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-tecno-cyan/20 mt-auto">
                <p className="text-xs text-text-muted text-center">
                  Desarrollado por{" "}
                  <a
                    href="https://www.geolink.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tecno-cyan hover:text-tecno-mint transition-colors font-semibold"
                  >
                    GeoLink IT Services
                  </a>
                </p>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
