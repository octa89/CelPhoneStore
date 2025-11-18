"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";

interface CarouselSlide {
  productId: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  ctaText: string;
  ctaHref: string;
  order: number;
}

export default function CarouselAdminPage() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [carouselRes, productsRes] = await Promise.all([
        fetch("/api/admin/carousel"),
        fetch("/api/admin/products"),
      ]);

      if (carouselRes.ok) {
        const carouselData = await carouselRes.json();
        setSlides(carouselData.slides || []);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveCarousel() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/carousel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides }),
      });

      if (res.ok) {
        alert("Carrusel guardado exitosamente");
      }
    } catch (error) {
      console.error("Error saving carousel:", error);
      alert("Error al guardar el carrusel");
    } finally {
      setSaving(false);
    }
  }

  function moveSlide(index: number, direction: "up" | "down") {
    const newSlides = [...slides];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= slides.length) return;

    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
    newSlides.forEach((slide, i) => (slide.order = i));

    setSlides(newSlides);
  }

  function removeSlide(index: number) {
    const newSlides = slides.filter((_, i) => i !== index);
    newSlides.forEach((slide, i) => (slide.order = i));
    setSlides(newSlides);
  }

  function addProductToCarousel(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newSlide: CarouselSlide = {
      productId: product.id,
      title: product.name,
      subtitle: product.brand,
      description: product.description || "",
      badge: "NUEVO",
      ctaText: "Ver Más",
      ctaHref: `/product/${product.slug}`,
      order: slides.length,
    };

    setSlides([...slides, newSlide]);
  }

  function updateSlide(updatedSlide: CarouselSlide) {
    setSlides(slides.map((s) => (s.productId === updatedSlide.productId && s.order === updatedSlide.order ? updatedSlide : s)));
    setEditingSlide(null);
  }

  function getProductById(productId: string): Product | undefined {
    return products.find((p) => p.id === productId);
  }

  const availableProducts = products.filter(
    (p) => !slides.some((s) => s.productId === p.id)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-text-muted">Cargando carrusel...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Carrusel Hero</h1>
          <p className="text-text-muted">Gestiona las diapositivas del carrusel principal</p>
        </div>
        <button
          onClick={saveCarousel}
          disabled={saving}
          className="btn-primary disabled:opacity-50"
        >
          {saving ? "Guardando..." : "💾 Guardar Cambios"}
        </button>
      </div>

      {/* Current Slides */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Diapositivas Actuales ({slides.length})</h2>

        {slides.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3 opacity-30">🎠</div>
            <p className="text-text-muted">No hay diapositivas en el carrusel</p>
          </div>
        ) : (
          <div className="space-y-4">
            {slides.map((slide, index) => {
              const product = getProductById(slide.productId);
              if (!product) return null;

              return (
                <div
                  key={`${slide.productId}-${index}`}
                  className="glass-card rounded-xl p-4 flex gap-4 items-center"
                >
                  {/* Order Number */}
                  <div className="flex flex-col gap-2">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-tecno-cyan/20 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <button
                      onClick={() => moveSlide(index, "up")}
                      disabled={index === 0}
                      className="p-1 hover:bg-tecno-cyan/20 rounded disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveSlide(index, "down")}
                      disabled={index === slides.length - 1}
                      className="p-1 hover:bg-tecno-cyan/20 rounded disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Product Image */}
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  {/* Slide Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{slide.title}</h3>
                    <p className="text-sm text-tecno-cyan">{slide.subtitle}</p>
                    <p className="text-sm text-text-muted line-clamp-1">{slide.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-tecno-cyan/10 text-tecno-cyan px-2 py-1 rounded">
                        {slide.badge}
                      </span>
                      <span className="text-xs bg-tecno-primary/10 text-text-muted px-2 py-1 rounded">
                        CTA: {slide.ctaText}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setEditingSlide(slide)}
                      className="px-4 py-2 bg-tecno-cyan/10 text-tecno-cyan rounded-lg hover:bg-tecno-cyan/20 transition-colors"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => removeSlide(index)}
                      className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Product to Carousel */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Agregar Producto al Carrusel</h2>

        {availableProducts.length === 0 ? (
          <p className="text-text-muted text-center py-8">
            Todos los productos ya están en el carrusel
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableProducts.map((product) => (
              <div
                key={product.id}
                className="glass-card rounded-xl p-4 flex flex-col"
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold mb-1">{product.name}</h3>
                <p className="text-sm text-text-muted mb-3 line-clamp-2">
                  {product.description}
                </p>
                <button
                  onClick={() => addProductToCarousel(product.id)}
                  className="mt-auto btn-secondary text-sm py-2"
                >
                  ➕ Agregar al Carrusel
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Slide Modal */}
      {editingSlide && (
        <div className="fixed inset-0 bg-black/70 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card rounded-2xl p-6 max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-6">Editar Diapositiva</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título</label>
                  <input
                    type="text"
                    value={editingSlide.title}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subtítulo</label>
                  <input
                    type="text"
                    value={editingSlide.subtitle}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, subtitle: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descripción</label>
                  <textarea
                    value={editingSlide.description}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Badge</label>
                  <input
                    type="text"
                    value={editingSlide.badge}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, badge: e.target.value })
                    }
                    placeholder="NUEVO, DESTACADO, etc."
                    className="w-full px-4 py-3 bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texto del Botón CTA</label>
                  <input
                    type="text"
                    value={editingSlide.ctaText}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, ctaText: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Enlace del Botón CTA</label>
                  <input
                    type="text"
                    value={editingSlide.ctaHref}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, ctaHref: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingSlide(null)}
                  className="flex-1 px-4 py-3 bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg hover:bg-tecno-bg/80 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => updateSlide(editingSlide)}
                  className="flex-1 btn-primary"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
