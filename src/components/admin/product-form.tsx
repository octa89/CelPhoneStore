"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Product } from "@/lib/types";

interface ProductFormProps {
  product?: Product;
  mode: "create" | "edit";
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddBrand, setShowAddBrand] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: product?.name || "",
    brand: product?.brand || "",
    price: product ? (product.priceCents / 100).toString() : "",
    category: product?.category || "android",
    description: product?.description || "",
    featured: product?.featured || false,
    available: product?.available !== false, // Default to true
    inCarousel: product?.inCarousel || false,
    newArrival: product?.newArrival || false,
    onSale: product?.onSale || false,
    images: product?.images || [""],
    tags: product?.tags || [""],
    specs: product?.specs || {} as Record<string, string>,
  });

  // Specs state
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  useEffect(() => {
    loadCategories();
    loadBrands();
  }, []);

  async function loadCategories() {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  async function loadBrands() {
    try {
      const res = await fetch("/api/admin/brands");
      if (res.ok) {
        const data = await res.json();
        setBrands(data.brands);
      }
    } catch (error) {
      console.error("Error loading brands:", error);
    }
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) return;

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: newCategory.toLowerCase() }),
      });

      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
        setFormData({ ...formData, category: newCategory.toLowerCase() });
        setNewCategory("");
        setShowAddCategory(false);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  }

  function addImageField() {
    setFormData({ ...formData, images: [...formData.images, ""] });
  }

  function removeImageField(index: number) {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length ? newImages : [""] });
  }

  function updateImage(index: number, value: string) {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  }

  function addTagField() {
    setFormData({ ...formData, tags: [...formData.tags, ""] });
  }

  function removeTagField(index: number) {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags.length ? newTags : [""] });
  }

  function updateTag(index: number, value: string) {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  }

  function addSpec() {
    if (!specKey.trim() || !specValue.trim()) return;
    setFormData({
      ...formData,
      specs: { ...formData.specs, [specKey]: specValue },
    });
    setSpecKey("");
    setSpecValue("");
  }

  function removeSpec(key: string) {
    const newSpecs = { ...formData.specs };
    delete newSpecs[key];
    setFormData({ ...formData, specs: newSpecs });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const priceCents = Math.round(parseFloat(formData.price) * 100);

      const productData = {
        ...product,
        name: formData.name,
        brand: formData.brand,
        priceCents,
        category: formData.category,
        description: formData.description,
        featured: formData.featured,
        available: formData.available,
        inCarousel: formData.inCarousel,
        newArrival: formData.newArrival,
        onSale: formData.onSale,
        images: formData.images.filter((img) => img.trim()),
        tags: formData.tags.filter((tag) => tag.trim()),
        specs: formData.specs,
      };

      const url =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${product?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al guardar el producto");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4 text-red-400 text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Información Básica</h2>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2">
              Nombre del Producto *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20 transition-all"
              placeholder="Samsung Galaxy S24 Ultra 256GB"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2">Marca *</label>
            <div className="flex gap-2">
              <select
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20 transition-all"
              >
                <option value="">Seleccionar marca...</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowAddBrand(!showAddBrand)}
                className="px-3 sm:px-4 py-2 sm:py-3 bg-tecno-cyan/10 text-tecno-cyan rounded-lg hover:bg-tecno-cyan/20 transition-colors text-sm sm:text-base"
                title="Agregar marca"
              >
                ➕
              </button>
            </div>
            {showAddBrand && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  placeholder="Nueva marca"
                  className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan transition-all"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!newBrand.trim()) return;
                    // Just add to local list and select it
                    const updatedBrands = [...brands, newBrand.trim()];
                    setBrands(updatedBrands.sort());
                    setFormData({ ...formData, brand: newBrand.trim() });
                    setNewBrand("");
                    setShowAddBrand(false);
                  }}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-tecno-cyan text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Agregar
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2">Precio (USD) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20 transition-all"
              placeholder="1199.00"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2">Categoría *</label>
            <div className="flex gap-2">
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20 transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="px-3 sm:px-4 py-2 sm:py-3 bg-tecno-cyan/10 text-tecno-cyan rounded-lg hover:bg-tecno-cyan/20 transition-colors text-sm sm:text-base"
                title="Agregar categoría"
              >
                ➕
              </button>
            </div>
            {showAddCategory && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nueva categoría"
                  className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-tecno-cyan text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Agregar
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 sm:mt-4">
          <label className="block text-xs sm:text-sm font-medium mb-2">Descripción</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20 transition-all"
            placeholder="Descripción del producto..."
          />
        </div>

        <div className="mt-3 sm:mt-4">
          <h3 className="text-xs sm:text-sm font-medium mb-3">Estado del Producto</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-tecno-cyan/30 text-tecno-cyan focus:ring-tecno-cyan/20"
              />
              <span className="text-xs sm:text-sm">⭐ Destacado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-tecno-cyan/30 text-tecno-cyan focus:ring-tecno-cyan/20"
              />
              <span className="text-xs sm:text-sm">✅ Disponible</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inCarousel}
                onChange={(e) => setFormData({ ...formData, inCarousel: e.target.checked })}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-tecno-cyan/30 text-tecno-cyan focus:ring-tecno-cyan/20"
              />
              <span className="text-xs sm:text-sm">🎠 En Carrusel</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.newArrival}
                onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-tecno-cyan/30 text-tecno-cyan focus:ring-tecno-cyan/20"
              />
              <span className="text-xs sm:text-sm">🆕 Nuevo</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.onSale}
                onChange={(e) => setFormData({ ...formData, onSale: e.target.checked })}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-tecno-cyan/30 text-tecno-cyan focus:ring-tecno-cyan/20"
              />
              <span className="text-xs sm:text-sm">💰 En Oferta</span>
            </label>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Imágenes</h2>
          <button
            type="button"
            onClick={addImageField}
            className="px-3 sm:px-4 py-2 bg-tecno-cyan/10 text-tecno-cyan rounded-lg hover:bg-tecno-cyan/20 transition-colors text-xs sm:text-sm w-fit"
          >
            ➕ Agregar Imagen
          </button>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {formData.images.map((img, index) => (
            <div key={index} className="flex gap-2 sm:gap-3 items-start">
              <div className="flex-1 min-w-0">
                <input
                  type="url"
                  value={img}
                  onChange={(e) => updateImage(index, e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20 transition-all"
                />
              </div>
              {img && (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-tecno-cyan/30 flex-shrink-0">
                  <Image
                    src={img}
                    alt={`Preview ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23333' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='12'%3E❌%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              )}
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="px-2 sm:px-3 py-2 sm:py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm sm:text-base"
                  title="Eliminar"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-[10px] sm:text-xs text-text-muted mt-2">
          💡 Pega URLs de imágenes desde Amazon, Unsplash u otros CDNs. Las imágenes se previsualizarán automáticamente.
        </p>
      </div>

      {/* Tags */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Etiquetas</h2>
          <button
            type="button"
            onClick={addTagField}
            className="px-3 sm:px-4 py-2 bg-tecno-cyan/10 text-tecno-cyan rounded-lg hover:bg-tecno-cyan/20 transition-colors text-xs sm:text-sm w-fit"
          >
            ➕ Agregar Etiqueta
          </button>
        </div>
        <div className="grid gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3">
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => updateTag(index, e.target.value)}
                placeholder="Ej: Snapdragon 8 Gen 3"
                className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-base bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan transition-all"
              />
              {formData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTagField(index)}
                  className="px-2 sm:px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm sm:text-base"
                  title="Eliminar"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Specs */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Especificaciones</h2>

        {/* Add Spec */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
          <input
            type="text"
            value={specKey}
            onChange={(e) => setSpecKey(e.target.value)}
            placeholder="Nombre (ej: Pantalla)"
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan transition-all"
          />
          <input
            type="text"
            value={specValue}
            onChange={(e) => setSpecValue(e.target.value)}
            placeholder='Valor (ej: 6.8")'
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan transition-all"
          />
          <button
            type="button"
            onClick={addSpec}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-tecno-cyan text-white rounded-lg hover:opacity-90 transition-opacity text-xs sm:text-base whitespace-nowrap"
          >
            ➕ Agregar
          </button>
        </div>

        {/* Specs List */}
        <div className="space-y-2">
          {Object.entries(formData.specs).map(([key, value]) => (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-tecno-bg/30 rounded-lg p-3">
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <span className="font-medium text-xs sm:text-base">{key}:</span>
                <span className="text-text-muted text-xs sm:text-base break-words">{value}</span>
              </div>
              <button
                type="button"
                onClick={() => removeSpec(key)}
                className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-xs sm:text-sm w-fit"
              >
                🗑️ Eliminar
              </button>
            </div>
          ))}
          {Object.keys(formData.specs).length === 0 && (
            <p className="text-center text-text-muted py-4 text-xs sm:text-base">
              No hay especificaciones. Agrega una usando el formulario arriba.
            </p>
          )}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg hover:bg-tecno-bg/80 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Guardando..."
            : mode === "create"
            ? "Crear Producto"
            : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
}
