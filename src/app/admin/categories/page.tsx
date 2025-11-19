"use client";
import { useState, useEffect } from "react";
import { Trash2, Plus, Edit2, Check, X, Search } from "lucide-react";

type TabType = "categories" | "brands" | "tags";

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("categories");
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    await Promise.all([fetchCategories(), fetchBrands(), fetchTags()]);
    setLoading(false);
  }

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Error al cargar categorías");
    }
  }

  async function fetchBrands() {
    try {
      const res = await fetch("/api/admin/brands");
      const data = await res.json();
      setBrands(data.brands);
    } catch (err) {
      console.error("Error fetching brands:", err);
      setError("Error al cargar marcas");
    }
  }

  async function fetchTags() {
    try {
      const res = await fetch("/api/admin/tags");
      const data = await res.json();
      setTags(data.tags || []);
    } catch (err) {
      console.error("Error fetching tags:", err);
      setError("Error al cargar tags");
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.trim()) return;

    setError("");
    setSuccess("");
    setLoading(true);

    const endpoints = {
      categories: "/api/admin/categories",
      brands: "/api/admin/brands",
      tags: "/api/admin/tags",
    };

    const payloadKeys = {
      categories: "category",
      brands: "brand",
      tags: "tag",
    };

    try {
      const res = await fetch(endpoints[activeTab], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [payloadKeys[activeTab]]: newItem.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Error al agregar ${activeTab}`);
      }

      const data = await res.json();
      if (activeTab === "categories") setCategories(data.categories);
      if (activeTab === "brands") setBrands(data.brands);
      if (activeTab === "tags") setTags(data.tags);

      setNewItem("");
      setSuccess(`${activeTab === "categories" ? "Categoría" : activeTab === "brands" ? "Marca" : "Tag"} agregado exitosamente`);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error al agregar ${activeTab}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(item: string) {
    const labels = { categories: "categoría", brands: "marca", tags: "tag" };
    if (!confirm(`¿Estás seguro de eliminar ${labels[activeTab]} "${item}"?`)) {
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    const endpoints = {
      categories: "/api/admin/categories",
      brands: "/api/admin/brands",
      tags: "/api/admin/tags",
    };

    const payloadKeys = {
      categories: "category",
      brands: "brand",
      tags: "tag",
    };

    try {
      const res = await fetch(endpoints[activeTab], {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [payloadKeys[activeTab]]: item }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Error al eliminar ${labels[activeTab]}`);
      }

      const data = await res.json();
      if (activeTab === "categories") setCategories(data.categories);
      if (activeTab === "brands") setBrands(data.brands);
      if (activeTab === "tags") setTags(data.tags);

      setSuccess(`${labels[activeTab].charAt(0).toUpperCase() + labels[activeTab].slice(1)} eliminada exitosamente`);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error al eliminar ${labels[activeTab]}`);
    } finally {
      setLoading(false);
    }
  }

  function startEditing(item: string) {
    setEditingItem(item);
    setEditValue(item);
  }

  function cancelEditing() {
    setEditingItem(null);
    setEditValue("");
  }

  async function handleUpdate() {
    if (!editingItem || !editValue.trim()) return;

    setError("");
    setSuccess("");
    setLoading(true);

    const endpoints = {
      categories: "/api/admin/categories",
      brands: "/api/admin/brands",
      tags: "/api/admin/tags",
    };

    const oldKeys = {
      categories: "oldCategory",
      brands: "oldBrand",
      tags: "oldTag",
    };

    const newKeys = {
      categories: "newCategory",
      brands: "newBrand",
      tags: "newTag",
    };

    const labels = { categories: "categoría", brands: "marca", tags: "tag" };

    try {
      const res = await fetch(endpoints[activeTab], {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [oldKeys[activeTab]]: editingItem,
          [newKeys[activeTab]]: editValue.trim()
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Error al actualizar ${labels[activeTab]}`);
      }

      const data = await res.json();
      if (activeTab === "categories") setCategories(data.categories);
      if (activeTab === "brands") setBrands(data.brands);
      if (activeTab === "tags") setTags(data.tags);

      setSuccess(`${labels[activeTab].charAt(0).toUpperCase() + labels[activeTab].slice(1)} actualizada exitosamente`);
      setEditingItem(null);
      setEditValue("");
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error al actualizar ${labels[activeTab]}`);
    } finally {
      setLoading(false);
    }
  }

  // Get current items based on active tab
  const currentItems = activeTab === "categories" ? categories : activeTab === "brands" ? brands : tags;

  // Filter items based on search term
  const filteredItems = currentItems.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabLabels = {
    categories: { singular: "Categoría", plural: "Categorías", icon: "📁" },
    brands: { singular: "Marca", plural: "Marcas", icon: "🏷️" },
    tags: { singular: "Tag", plural: "Tags", icon: "🔖" },
  };

  const currentLabel = tabLabels[activeTab];

  return (
    <div className="max-w-full overflow-x-hidden">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient mb-2">Gestión de Taxonomía</h1>
        <p className="text-sm sm:text-base text-text-muted">Administra categorías, marcas y tags de productos</p>
      </div>

      {/* Tabs */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-2 mb-4 sm:mb-6 flex gap-1 sm:gap-2">
        <button
          onClick={() => { setActiveTab("categories"); setSearchTerm(""); }}
          className={`flex-1 px-2 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-base font-semibold transition-all ${
            activeTab === "categories"
              ? "bg-tecno-primary text-white shadow-lg"
              : "text-text-muted hover:bg-tecno-bg/40"
          }`}
        >
          <span className="hidden sm:inline">📁 Categorías ({categories.length})</span>
          <span className="sm:hidden">📁 ({categories.length})</span>
        </button>
        <button
          onClick={() => { setActiveTab("brands"); setSearchTerm(""); }}
          className={`flex-1 px-2 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-base font-semibold transition-all ${
            activeTab === "brands"
              ? "bg-tecno-primary text-white shadow-lg"
              : "text-text-muted hover:bg-tecno-bg/40"
          }`}
        >
          <span className="hidden sm:inline">🏷️ Marcas ({brands.length})</span>
          <span className="sm:hidden">🏷️ ({brands.length})</span>
        </button>
        <button
          onClick={() => { setActiveTab("tags"); setSearchTerm(""); }}
          className={`flex-1 px-2 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-base font-semibold transition-all ${
            activeTab === "tags"
              ? "bg-tecno-primary text-white shadow-lg"
              : "text-text-muted hover:bg-tecno-bg/40"
          }`}
        >
          <span className="hidden sm:inline">🔖 Tags ({tags.length})</span>
          <span className="sm:hidden">🔖 ({tags.length})</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 sm:mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4 text-sm sm:text-base text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 sm:mb-6 bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4 text-sm sm:text-base text-green-400">
          {success}
        </div>
      )}

      {/* Add New Form */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-text-main mb-3 sm:mb-4">Agregar Nueva {currentLabel.singular}</h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={`Nombre de ${currentLabel.singular.toLowerCase()} (ej: ${
              activeTab === "categories" ? "smartphones, tablets" :
              activeTab === "brands" ? "Samsung, Apple" :
              "5G, Dual SIM"
            })`}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newItem.trim()}
            className="btn-primary px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            Agregar
          </button>
        </form>
      </div>

      {/* Search Bar */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Buscar ${currentLabel.plural.toLowerCase()}...`}
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base bg-tecno-bg/60 border border-tecno-cyan/30 rounded-lg outline-none focus:border-tecno-cyan focus:ring-2 focus:ring-tecno-cyan/20 transition-all"
          />
        </div>
      </div>

      {/* Items List */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-text-main mb-3 sm:mb-4">
          {currentLabel.plural} {searchTerm ? `(${filteredItems.length} de ${currentItems.length})` : `(${currentItems.length})`}
        </h2>

        {loading && currentItems.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-3 opacity-30">⏳</div>
            <p className="text-sm sm:text-base text-text-muted">Cargando {currentLabel.plural.toLowerCase()}...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-3 opacity-30">{currentLabel.icon}</div>
            <p className="text-sm sm:text-base text-text-muted mb-2">
              {searchTerm ? `No se encontraron ${currentLabel.plural.toLowerCase()} que coincidan con "${searchTerm}"` : `No hay ${currentLabel.plural.toLowerCase()}`}
            </p>
            {!searchTerm && <p className="text-xs sm:text-sm text-text-muted/70">Agrega tu primer {currentLabel.singular.toLowerCase()} arriba</p>}
          </div>
        ) : (
          <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-3 sm:p-4 bg-tecno-bg/40 rounded-lg border border-tecno-cyan/20 hover:border-tecno-cyan/40 transition-colors"
              >
                {editingItem === item ? (
                  <>
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <span className="text-xl sm:text-2xl flex-shrink-0">{currentLabel.icon}</span>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 min-w-0 px-2 sm:px-3 py-1 text-sm sm:text-base bg-tecno-bg border border-tecno-cyan/30 rounded outline-none focus:border-tecno-cyan"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdate();
                          if (e.key === "Escape") cancelEditing();
                        }}
                      />
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={handleUpdate}
                        disabled={loading || !editValue.trim()}
                        className="p-1.5 sm:p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Guardar"
                      >
                        <Check size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={loading}
                        className="p-1.5 sm:p-2 text-text-muted hover:bg-tecno-bg/60 rounded-lg transition-colors"
                        title="Cancelar"
                      >
                        <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <span className="text-xl sm:text-2xl flex-shrink-0">{currentLabel.icon}</span>
                      <span className="font-medium text-sm sm:text-base text-text-main truncate">{item}</span>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => startEditing(item)}
                        disabled={loading}
                        className="p-1.5 sm:p-2 text-tecno-cyan hover:bg-tecno-cyan/10 rounded-lg transition-colors disabled:opacity-50"
                        title={`Editar ${currentLabel.singular.toLowerCase()}`}
                      >
                        <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={loading}
                        className="p-1.5 sm:p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
                        title={`Eliminar ${currentLabel.singular.toLowerCase()}`}
                      >
                        <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
