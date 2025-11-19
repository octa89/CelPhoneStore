"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface SortableProductProps {
  product: Product;
  index: number;
  onMoveToTop: () => void;
}

function SortableProduct({ product, index, onMoveToTop }: SortableProductProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass-card rounded-xl p-4 flex gap-4 items-center transition-all ${
        isDragging ? "shadow-2xl z-50 scale-105" : "hover:bg-tecno-primary/5"
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-tecno-cyan/20 rounded transition-colors"
        title="Arrastra para reordenar"
      >
        <svg
          className="w-6 h-6 text-tecno-cyan"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </div>

      {/* Order Number */}
      <div className="flex flex-col gap-1 items-center">
        <div className="w-12 h-12 bg-tecno-cyan/20 rounded-full flex items-center justify-center font-bold text-lg">
          {index + 1}
        </div>
        {index > 0 && (
          <button
            onClick={onMoveToTop}
            className="text-xs px-2 py-1 bg-honor-primary hover:bg-honor-primary/80 text-white rounded transition-colors"
            title="Mover al inicio"
          >
            ⬆ Top
          </button>
        )}
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

      {/* Price & Badges */}
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
  );
}

export default function ProductOrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
          const orderA = a.displayOrder ?? 999;
          const orderB = b.displayOrder ?? 999;
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
        alert("✅ Orden guardado exitosamente");
        setHasChanges(false);
      } else {
        alert("❌ Error al guardar el orden");
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert("❌ Error al guardar el orden");
    } finally {
      setSaving(false);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        setHasChanges(true);
        return newItems;
      });
    }
  }

  function moveToTop(index: number) {
    if (index === 0) return;

    const newProducts = [...products];
    const [item] = newProducts.splice(index, 1);
    newProducts.unshift(item);

    setProducts(newProducts);
    setHasChanges(true);
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
          <p className="text-text-muted">
            Arrastra los productos para reorganizar su orden en la tienda
          </p>
        </div>
        <div className="flex gap-3">
          {hasChanges && (
            <span className="text-sm text-yellow-500 flex items-center gap-2">
              ⚠️ Cambios sin guardar
            </span>
          )}
          <button
            onClick={saveOrder}
            disabled={saving || !hasChanges}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Guardando..." : "💾 Guardar Orden"}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6 glass-card rounded-xl p-4 border-l-4 border-tecno-cyan">
        <div className="flex gap-3">
          <div className="text-2xl">ℹ️</div>
          <div>
            <h3 className="font-semibold mb-1">Cómo usar:</h3>
            <ul className="text-sm text-text-muted space-y-1">
              <li>• <strong>Arrastra</strong> los productos usando el ícono de líneas (☰) para reordenarlos</li>
              <li>• Usa el botón <strong>&quot;⬆ Top&quot;</strong> para mover un producto al inicio de la lista</li>
              <li>• Haz clic en <strong>&quot;Guardar Orden&quot;</strong> cuando termines de reorganizar</li>
              <li>• El orden que establezcas aquí se reflejará en toda la tienda</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Products List with Drag and Drop */}
      <div className="glass-card rounded-2xl p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={products.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {products.map((product, index) => (
                <SortableProduct
                  key={product.id}
                  product={product}
                  index={index}
                  onMoveToTop={() => moveToTop(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3 opacity-30">📦</div>
            <p className="text-text-muted">No hay productos disponibles</p>
          </div>
        )}
      </div>

      {/* Save Reminder */}
      {hasChanges && (
        <div className="fixed bottom-8 right-8 glass-card rounded-xl p-4 shadow-2xl border-2 border-yellow-500/50 animate-pulse">
          <div className="flex gap-3 items-center">
            <div className="text-2xl">⚠️</div>
            <div>
              <p className="font-semibold">Tienes cambios sin guardar</p>
              <p className="text-sm text-text-muted">
                No olvides guardar el nuevo orden
              </p>
            </div>
            <button
              onClick={saveOrder}
              disabled={saving}
              className="btn-primary ml-4"
            >
              {saving ? "Guardando..." : "Guardar Ahora"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
