"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ActivityLogEntry } from "@/lib/data-manager";

interface Stats {
  totalProducts: number;
  availableProducts: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    availableProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
  });
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

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
        <Link href="/admin/products" className="glass-card rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl group-hover:scale-110 transition-transform">📱</span>
            <span className="text-xs text-tecno-mint bg-tecno-mint/10 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-3xl font-bold text-tecno-cyan mb-1">{stats.totalProducts}</p>
          <p className="text-sm text-text-muted">Productos</p>
        </Link>

        <Link href="/admin/orders" className="glass-card rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl group-hover:scale-110 transition-transform">🛒</span>
            <span className="text-xs text-tecno-bolt bg-tecno-bolt/10 px-2 py-1 rounded-full">Hoy</span>
          </div>
          <p className="text-3xl font-bold text-tecno-cyan mb-1">{stats.totalOrders}</p>
          <p className="text-sm text-text-muted">Pedidos</p>
        </Link>

        <Link href="/admin/orders?filter=pending" className="glass-card rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl group-hover:scale-110 transition-transform">⏳</span>
            <span className="text-xs text-orange-400 bg-orange-400/10 px-2 py-1 rounded-full">Pendientes</span>
          </div>
          <p className="text-3xl font-bold text-tecno-cyan mb-1">{stats.pendingOrders}</p>
          <p className="text-sm text-text-muted">Por Procesar</p>
        </Link>

        <Link href="/admin/orders?filter=revenue" className="glass-card rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl group-hover:scale-110 transition-transform">💰</span>
            <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-3xl font-bold text-tecno-cyan mb-1">${stats.revenue}</p>
          <p className="text-sm text-text-muted">Ingresos</p>
        </Link>
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
        {loading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-3 opacity-30">⏳</div>
            <p className="text-text-muted">Cargando actividad...</p>
          </div>
        ) : activityLog.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-3 opacity-30">📊</div>
            <p className="text-text-muted mb-2">No hay actividad reciente</p>
            <p className="text-sm text-text-muted/70">Las acciones de administración aparecerán aquí</p>
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
                  className="flex items-start gap-4 p-4 bg-tecno-bg/40 rounded-lg border border-tecno-cyan/20 hover:border-tecno-cyan/40 transition-colors"
                >
                  <span className="text-2xl">{typeIcons[entry.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold ${typeColors[entry.type]}`}>
                      {entry.action}
                    </p>
                    <p className="text-sm text-text-muted truncate">{entry.details}</p>
                  </div>
                  <span className="text-xs text-text-muted whitespace-nowrap">
                    {timeAgo}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
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
