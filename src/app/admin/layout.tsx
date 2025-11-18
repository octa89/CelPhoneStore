"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
          <Link href="/admin" className="font-bold tracking-tight text-lg flex items-center gap-2">
            <span className="text-tecno-mint">ADMIN</span>
            <span className="text-tecno-bolt">⚡</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-tecno-cyan hover:text-tecno-mint transition-colors">
              Ver Tienda →
            </Link>
            <button
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                window.location.href = "/admin/login";
              }}
              className="text-sm text-text-muted hover:text-red-400 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-tecno-cyan/20 bg-tecno-bgDark/50 p-4 flex flex-col">
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

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
