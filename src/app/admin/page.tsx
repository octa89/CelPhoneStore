"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ActivityLogEntry } from "@/lib/dynamodb-service";
import ProductQuickView from "@/components/product-quick-view";
import type { Product } from "@/lib/types";

interface Stats {
  totalProducts: number;
  availableProducts: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  totalConversations: number;
  activeConversations: number;
  conversationsWithLeads: number;
  urgentLeads: number;
  pendingReservations: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    availableProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
    totalConversations: 0,
    activeConversations: 0,
    conversationsWithLeads: 0,
    urgentLeads: 0,
    pendingReservations: 0,
  });
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data.stats);
        setActivityLog(data.activityLog);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  async function handleViewProduct(productId: string) {
    try {
      const res = await fetch(`/api/admin/products/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedProduct(data.product);
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Error loading product:", error);
    }
  }

  const quickActions = [
    { label: "Agregar Producto", href: "/admin/products/new", icon: "➕", color: "from-tecno-primary to-tecno-cyan" },
    { label: "Ver Productos", href: "/admin/products", icon: "📱", color: "from-tecno-cyan to-tecno-mint" },
    { label: "Analíticas Chat", href: "/admin/chat-analytics", icon: "💬", color: "from-blue-500 to-purple-500" },
    { label: "Pedidos", href: "/admin/orders", icon: "🛒", color: "from-tecno-bolt to-tecno-primary" },
  ];

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient mb-2">Panel de Administración</h1>
        <p className="text-sm sm:text-base text-text-muted">Gestiona tu tienda TecnoExpress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-6 sm:mb-8">
        <Link href="/admin/products" className="glass-card rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 hover:scale-105 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xl sm:text-2xl md:text-3xl group-hover:scale-110 transition-transform">📱</span>
            <span className="text-[9px] sm:text-[10px] md:text-xs text-tecno-mint bg-tecno-mint/10 px-1 sm:px-1.5 md:px-2 py-0.5 md:py-1 rounded-full whitespace-nowrap">Total</span>
          </div>
          <p className="text-lg sm:text-xl md:text-3xl font-bold text-tecno-cyan mb-1">{stats.totalProducts}</p>
          <p className="text-[10px] sm:text-xs md:text-sm text-text-muted">Productos</p>
        </Link>

        <Link href="/admin/orders" className="glass-card rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 hover:scale-105 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xl sm:text-2xl md:text-3xl group-hover:scale-110 transition-transform">🛒</span>
            <span className="text-[9px] sm:text-[10px] md:text-xs text-tecno-bolt bg-tecno-bolt/10 px-1 sm:px-1.5 md:px-2 py-0.5 md:py-1 rounded-full whitespace-nowrap">Hoy</span>
          </div>
          <p className="text-lg sm:text-xl md:text-3xl font-bold text-tecno-cyan mb-1">{stats.totalOrders}</p>
          <p className="text-[10px] sm:text-xs md:text-sm text-text-muted">Pedidos</p>
        </Link>

        <Link href="/admin/orders?filter=pending" className="glass-card rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 hover:scale-105 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xl sm:text-2xl md:text-3xl group-hover:scale-110 transition-transform">⏳</span>
            <span className="text-[9px] sm:text-[10px] md:text-xs text-orange-400 bg-orange-400/10 px-1 sm:px-1.5 md:px-2 py-0.5 md:py-1 rounded-full whitespace-nowrap">Pend.</span>
          </div>
          <p className="text-lg sm:text-xl md:text-3xl font-bold text-tecno-cyan mb-1">{stats.pendingOrders}</p>
          <p className="text-[10px] sm:text-xs md:text-sm text-text-muted">Por Procesar</p>
        </Link>

        <Link href="/admin/orders?filter=revenue" className="glass-card rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 hover:scale-105 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xl sm:text-2xl md:text-3xl group-hover:scale-110 transition-transform">💰</span>
            <span className="text-[9px] sm:text-[10px] md:text-xs text-green-400 bg-green-400/10 px-1 sm:px-1.5 md:px-2 py-0.5 md:py-1 rounded-full whitespace-nowrap">Total</span>
          </div>
          <p className="text-lg sm:text-xl md:text-3xl font-bold text-tecno-cyan mb-1">${stats.revenue}</p>
          <p className="text-[10px] sm:text-xs md:text-sm text-text-muted">Ingresos</p>
        </Link>

        <Link href="/admin/chat-analytics" className="glass-card rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 hover:scale-105 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xl sm:text-2xl md:text-3xl group-hover:scale-110 transition-transform">💬</span>
            <span className="text-[9px] sm:text-[10px] md:text-xs text-blue-400 bg-blue-400/10 px-1 sm:px-1.5 md:px-2 py-0.5 md:py-1 rounded-full whitespace-nowrap">Chat</span>
          </div>
          <p className="text-lg sm:text-xl md:text-3xl font-bold text-tecno-cyan mb-1">{stats.totalConversations}</p>
          <p className="text-[10px] sm:text-xs md:text-sm text-text-muted">Conversaciones</p>
        </Link>

        <Link href="/admin/chat-analytics" className="glass-card rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 hover:scale-105 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xl sm:text-2xl md:text-3xl group-hover:scale-110 transition-transform">📧</span>
            <span className="text-[9px] sm:text-[10px] md:text-xs text-purple-400 bg-purple-400/10 px-1 sm:px-1.5 md:px-2 py-0.5 md:py-1 rounded-full whitespace-nowrap">Leads</span>
          </div>
          <p className="text-lg sm:text-xl md:text-3xl font-bold text-tecno-cyan mb-1">{stats.conversationsWithLeads}</p>
          <p className="text-[10px] sm:text-xs md:text-sm text-text-muted">Con Info</p>
        </Link>

        <Link href="/admin/chat-analytics" className="glass-card rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 hover:scale-105 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xl sm:text-2xl md:text-3xl group-hover:scale-110 transition-transform">🔥</span>
            <span className="text-[9px] sm:text-[10px] md:text-xs text-red-400 bg-red-400/10 px-1 sm:px-1.5 md:px-2 py-0.5 md:py-1 rounded-full whitespace-nowrap">Urgente</span>
          </div>
          <p className="text-lg sm:text-xl md:text-3xl font-bold text-tecno-cyan mb-1">{stats.urgentLeads}</p>
          <p className="text-[10px] sm:text-xs md:text-sm text-text-muted">Leads Urgentes</p>
        </Link>

        <Link href="/admin/chat-analytics" className="glass-card rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 hover:scale-105 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xl sm:text-2xl md:text-3xl group-hover:scale-110 transition-transform">📋</span>
            <span className="text-[9px] sm:text-[10px] md:text-xs text-yellow-400 bg-yellow-400/10 px-1 sm:px-1.5 md:px-2 py-0.5 md:py-1 rounded-full whitespace-nowrap">Reservas</span>
          </div>
          <p className="text-lg sm:text-xl md:text-3xl font-bold text-tecno-cyan mb-1">{stats.pendingReservations}</p>
          <p className="text-[10px] sm:text-xs md:text-sm text-text-muted">Pendientes</p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-text-main mb-3 sm:mb-4">Acciones Rápidas</h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`glass-card rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 hover:scale-105 transition-all group hover:shadow-glow`}
            >
              <div className={`text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <h3 className="font-semibold text-xs sm:text-sm md:text-base text-text-main group-hover:text-gradient transition-colors">
                {action.label}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-text-main mb-3 sm:mb-4">Actividad Reciente</h2>
        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-3 opacity-30">⏳</div>
            <p className="text-sm sm:text-base text-text-muted">Cargando actividad...</p>
          </div>
        ) : activityLog.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-3 opacity-30">📊</div>
            <p className="text-sm sm:text-base text-text-muted mb-2">No hay actividad reciente</p>
            <p className="text-xs sm:text-sm text-text-muted/70">Las acciones de administración aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activityLog.map((entry) => {
              const typeIcons = {
                product: "📱",
                carousel: "🎠",
                category: "📁",
                order: "🛒",
              };
              const typeColors = {
                product: "text-tecno-cyan",
                carousel: "text-tecno-mint",
                category: "text-tecno-bolt",
                order: "text-green-400",
              };

              const date = new Date(entry.timestamp);
              const timeAgo = getTimeAgo(date);

              return (
                <div
                  key={entry.id}
                  className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-tecno-bg/40 rounded-lg border border-tecno-cyan/20 hover:border-tecno-cyan/40 transition-colors"
                >
                  <span className="text-xl sm:text-2xl flex-shrink-0">{typeIcons[entry.type]}</span>
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <p className={`font-semibold text-sm sm:text-base ${typeColors[entry.type]}`}>
                        {entry.action}
                      </p>
                      {entry.productId && entry.action === "Producto Agregado" && (
                        <button
                          onClick={() => handleViewProduct(entry.productId!)}
                          className="text-xs bg-tecno-cyan/10 text-tecno-cyan px-3 py-1.5 rounded hover:bg-tecno-cyan/20 transition-colors font-medium w-fit"
                        >
                          Ver Preview
                        </button>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-text-muted break-words">{entry.details}</p>
                    <div className="flex items-center justify-between mt-2">
                      {entry.productBrand && (
                        <p className="text-xs text-text-muted/70">Marca: {entry.productBrand}</p>
                      )}
                      <span className="text-xs text-text-muted whitespace-nowrap ml-auto">
                        {timeAgo}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Preview Modal */}
      <ProductQuickView
        product={showPreview ? selectedProduct : null}
        onClose={() => {
          setShowPreview(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Hace un momento";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays === 1) return "Ayer";
  return `Hace ${diffDays} días`;
}
