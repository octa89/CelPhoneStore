"use client";
import Link from "next/link";

export default function AdminDashboard() {
  // TODO: Fetch real data from Amplify
  const stats = {
    totalProducts: 24,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
  };

  const quickActions = [
    { label: "Agregar Producto", href: "/admin/products/new", icon: "➕", color: "from-tecno-primary to-tecno-cyan" },
    { label: "Ver Productos", href: "/admin/products", icon: "📱", color: "from-tecno-cyan to-tecno-mint" },
    { label: "Pedidos", href: "/admin/orders", icon: "🛒", color: "from-tecno-bolt to-tecno-primary" },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">Panel de Administración</h1>
        <p className="text-text-muted">Gestiona tu tienda TecnoExpress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">📱</span>
            <span className="text-xs text-tecno-mint bg-tecno-mint/10 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-3xl font-bold text-tecno-cyan mb-1">{stats.totalProducts}</p>
          <p className="text-sm text-text-muted">Productos</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">🛒</span>
            <span className="text-xs text-tecno-bolt bg-tecno-bolt/10 px-2 py-1 rounded-full">Hoy</span>
          </div>
          <p className="text-3xl font-bold text-tecno-cyan mb-1">{stats.totalOrders}</p>
          <p className="text-sm text-text-muted">Pedidos</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">⏳</span>
            <span className="text-xs text-orange-400 bg-orange-400/10 px-2 py-1 rounded-full">Pendientes</span>
          </div>
          <p className="text-3xl font-bold text-tecno-cyan mb-1">{stats.pendingOrders}</p>
          <p className="text-sm text-text-muted">Por Procesar</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">💰</span>
            <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-3xl font-bold text-tecno-cyan mb-1">${stats.revenue}</p>
          <p className="text-sm text-text-muted">Ingresos</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-text-main mb-4">Acciones Rápidas</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`glass-card rounded-2xl p-6 hover:scale-105 transition-all group hover:shadow-glow`}
            >
              <div className={`text-4xl mb-3 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <h3 className="font-semibold text-text-main group-hover:text-gradient transition-colors">
                {action.label}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-bold text-text-main mb-4">Actividad Reciente</h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-3 opacity-30">📊</div>
          <p className="text-text-muted mb-2">No hay actividad reciente</p>
          <p className="text-sm text-text-muted/70">Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
        </div>
      </div>
    </div>
  );
}
