"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function ProductOrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        // Sort by displayOrder if it exists, otherwise by name
        const sorted = (data.products || []).sort((a: Product, b: Product) => {
          const orderA = (a as any).displayOrder ?? 999;
          const orderB = (b as any).displayOrder ?? 999;
          if (orderA !== orderB) return orderA - orderB;
          return a.name.localeCompare(b.name);
        });
        setProducts(sorted);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveOrder() {
    setSaving(true);
    try {
      // Update each product with its display order
      const updates = products.map((product, index) => ({
        id: product.id,
        displayOrder: index,
      }));

      const res = await fetch("/api/admin/products/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (res.ok) {
        alert("Orden guardado exitosamente");
      } else {
        alert("Error al guardar el orden");
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Error al guardar el orden");
    } finally {
      setSaving(false);
    }
  }

  function moveProduct(index: number, direction: "up" | "down") {
    const newProducts = [...products];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= products.length) return;

    [newProducts[index], newProducts[newIndex]] = [newProducts[newIndex], newProducts[index]];
    setProducts(newProducts);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-text-muted">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Orden de Productos</h1>
          <p className="text-text-muted">Organiza el orden en que aparecen los productos en la tienda</p>
        </div>
        <button
          onClick={saveOrder}
          disabled={saving}
          className="btn-primary disabled:opacity-50"
        >
          {saving ? "Guardando..." : "💾 Guardar Orden"}
        </button>
      </div>

      {/* Products List */}
      <div className="glass-card rounded-2xl p-6">
        <div className="space-y-3">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="glass-card rounded-xl p-4 flex gap-4 items-center hover:bg-tecno-primary/5 transition-colors"
            >
              {/* Order Controls */}
              <div className="flex flex-col gap-1">
                <div className="text-center">
                  <div className="w-12 h-12 bg-tecno-cyan/20 rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                </div>
                <button
                  onClick={() => moveProduct(index, "up")}
                  disabled={index === 0}
                  className="p-2 hover:bg-tecno-cyan/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Mover arriba"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveProduct(index, "down")}
                  disabled={index === products.length - 1}
                  className="p-2 hover:bg-tecno-cyan/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Mover abajo"
                >
                  ▼
                </button>
              </div>

              {/* Product Image */}
              <Image
                src={product.images[0]}
                alt={product.name}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-lg"
              />

              {/* Product Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-tecno-cyan">{product.brand}</p>
                <p className="text-sm text-text-muted line-clamp-1">{product.description}</p>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="font-bold text-tecno-cyan text-lg">
                  {formatCurrency(product.priceCents)}
                </p>
                <div className="flex gap-2 mt-1">
                  {product.featured && (
                    <span className="text-xs bg-tecno-cyan/10 text-tecno-cyan px-2 py-1 rounded">
                      ⭐ Destacado
                    </span>
                  )}
                  {product.newArrival && (
                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">
                      🆕 Nuevo
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3 opacity-30">📦</div>
            <p className="text-text-muted">No hay productos disponibles</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 glass-card rounded-xl p-4">
        <p className="text-sm text-text-muted">
          💡 <strong>Nota:</strong> El orden que definas aquí determinará cómo aparecen los productos en la página principal de la tienda. Los productos de arriba aparecerán primero.
        </p>
      </div>
    </div>
  );
}
