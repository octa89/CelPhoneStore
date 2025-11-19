"use client";
import { use, useEffect, useState } from "react";
import ProductForm from "@/components/admin/product-form";
import type { Product } from "@/lib/types";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
        } else {
          setError("Producto no encontrado");
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-text-muted">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold mb-2">{error || "Producto no encontrado"}</h2>
        <p className="text-text-muted">El producto que buscas no existe o fue eliminado.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient mb-2">Editar Producto</h1>
        <p className="text-sm sm:text-base text-text-muted truncate">{product.name}</p>
      </div>

      <ProductForm mode="edit" product={product} />
    </div>
  );
}
