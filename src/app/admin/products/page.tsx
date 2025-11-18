"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import type { Product } from "@/lib/types";
import ProductPreviewModal from "@/components/admin/product-preview-modal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [brandFilter, setBrandFilter] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [carouselProductIds, setCarouselProductIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadBrands();
    loadCarouselData();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (brandFilter) {
      filtered = filtered.filter((p) => p.brand === brandFilter);
    }

    setFilteredProducts(filtered);
  }, [search, categoryFilter, brandFilter, products]);

  async function loadProducts() {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setFilteredProducts(data.products);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  }

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

  async function loadCarouselData() {
    try {
      const res = await fetch("/api/admin/carousel");
      if (res.ok) {
        const data = await res.json();
        const productIds = new Set(data.slides?.map((slide: { productId: string }) => slide.productId) || []);
        setCarouselProductIds(productIds);
      }
    } catch (error) {
      console.error("Error loading carousel data:", error);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  async function toggleProductStatus(productId: string, field: keyof Product, value: boolean) {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });

      if (res.ok) {
        // Update local state
        setProducts(products.map((p) =>
          p.id === productId ? { ...p, [field]: value } : p
        ));
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
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
          <h1 className="text-3xl font-bold text-gradient mb-2">Productos</h1>
          <p className="text-text-muted">Gestiona tu catálogo de productos</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          ➕ Agregar Producto
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium mb-2">Buscar</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, marca o descripción..."
              className="w-full px-4 py-3 bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Marca</label>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full px-4 py-3 bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20 transition-all"
            >
              <option value="">Todas las marcas</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Categoría</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20 transition-all"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-text-muted">
          Mostrando {filteredProducts.length} de {products.length} productos
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-tecno-primary/10 border-b border-tecno-cyan/20">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-semibold">Imagen</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Producto</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Marca</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Categoría</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Precio</th>
                <th className="px-3 py-4 text-center text-sm font-semibold">
                  <div className="flex flex-col gap-1">
                    <span>⭐</span>
                    <span className="text-xs">Destacado</span>
                  </div>
                </th>
                <th className="px-3 py-4 text-center text-sm font-semibold">
                  <div className="flex flex-col gap-1">
                    <span>👁️</span>
                    <span className="text-xs">Visible</span>
                    <span className="text-[10px] text-text-muted font-normal">(Mostrar/Ocultar)</span>
                  </div>
                </th>
                <th className="px-3 py-4 text-center text-sm font-semibold">
                  <div className="flex flex-col gap-1">
                    <span>🎠</span>
                    <span className="text-xs">Carrusel</span>
                  </div>
                </th>
                <th className="px-3 py-4 text-center text-sm font-semibold">
                  <div className="flex flex-col gap-1">
                    <span>🆕</span>
                    <span className="text-xs">Nuevo</span>
                  </div>
                </th>
                <th className="px-3 py-4 text-center text-sm font-semibold">
                  <div className="flex flex-col gap-1">
                    <span>💰</span>
                    <span className="text-xs">Oferta</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-right text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tecno-cyan/10">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center">
                    <div className="text-4xl mb-3 opacity-30">📦</div>
                    <p className="text-text-muted">No se encontraron productos</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-tecno-primary/5 transition-colors">
                    <td className="px-4 py-4">
                      {product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="w-15 h-15 object-cover rounded-lg"
                        />
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setPreviewProduct(product)}
                        className="font-medium hover:text-tecno-cyan transition-colors text-left hover:underline"
                      >
                        {product.name} 👁️
                      </button>
                      <div className="text-sm text-text-muted line-clamp-1">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-text-muted">{product.brand}</td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 rounded-full text-xs bg-tecno-cyan/10 text-tecno-cyan">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-tecno-cyan">
                      {formatCurrency(product.priceCents)}
                    </td>
                    {/* Checkboxes */}
                    <td className="px-3 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={product.featured || false}
                        onChange={(e) => toggleProductStatus(product.id, 'featured', e.target.checked)}
                        className="w-5 h-5 rounded border-tecno-cyan/30 text-tecno-cyan focus:ring-tecno-cyan/20 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={product.available !== false} // Default to true if undefined
                        onChange={(e) => toggleProductStatus(product.id, 'available', e.target.checked)}
                        className="w-5 h-5 rounded border-tecno-cyan/30 text-tecno-cyan focus:ring-tecno-cyan/20 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <input
                          type="checkbox"
                          checked={carouselProductIds.has(product.id)}
                          readOnly
                          className="w-5 h-5 rounded border-tecno-cyan/30 text-tecno-cyan focus:ring-tecno-cyan/20 cursor-not-allowed opacity-60"
                          title="Gestiona el carrusel en la página de Carrusel Hero"
                        />
                        {carouselProductIds.has(product.id) && (
                          <Link
                            href="/admin/carousel"
                            className="text-xs text-tecno-cyan hover:underline"
                          >
                            Editar
                          </Link>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={product.newArrival || false}
                        onChange={(e) => toggleProductStatus(product.id, 'newArrival', e.target.checked)}
                        className="w-5 h-5 rounded border-tecno-cyan/30 text-tecno-cyan focus:ring-tecno-cyan/20 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={product.onSale || false}
                        onChange={(e) => toggleProductStatus(product.id, 'onSale', e.target.checked)}
                        className="w-5 h-5 rounded border-tecno-cyan/30 text-tecno-cyan focus:ring-tecno-cyan/20 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="px-3 py-1 bg-tecno-cyan/10 text-tecno-cyan rounded-lg hover:bg-tecno-cyan/20 transition-colors text-sm"
                        >
                          ✏️ Editar
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Preview Modal */}
      <ProductPreviewModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="glass-card rounded-2xl p-8 max-w-md mx-4">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-2">¿Eliminar producto?</h3>
              <p className="text-text-muted">
                Esta acción no se puede deshacer. El producto será eliminado permanentemente.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg hover:bg-tecno-bg/80 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
