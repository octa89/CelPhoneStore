"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/use-cart";
import confetti from "canvas-confetti";
import Link from "next/link";

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
  const { add } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (product) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [product, onClose]);

  function handleAddToCart() {
    if (!product) return;
    add(product, 1);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#000000', '#2F2F2F', '#666666', '#999999'],
    });
  }

  if (!product) return null;

  console.log("RENDERING MODAL FOR:", product.name);

  const modalContent = (
    <div className="fixed inset-0 bg-black/70 z-[9999] overflow-y-auto p-4 md:p-6" onClick={onClose}>
      <div className="min-h-full flex items-center justify-center py-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden my-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/80 hover:bg-black text-white rounded-full flex items-center justify-center text-xl transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>

          {/* Scrollable content area */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 p-4 md:p-8 overflow-y-auto max-h-[calc(90vh-2rem)]">
            {/* Image Section */}
            <div className="relative flex-shrink-0">
              <div className="relative aspect-square max-h-[300px] md:max-h-[400px] rounded-xl overflow-hidden bg-honor-bg-light">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && (
                  <span className="bg-honor-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                    DESTACADO
                  </span>
                )}
                {product.newArrival && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    NUEVO
                  </span>
                )}
                {product.onSale && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    OFERTA
                  </span>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col">
              {/* Brand */}
              <p className="text-sm text-honor-text-muted uppercase tracking-wide mb-2">
                {product.brand}
              </p>

              {/* Name */}
              <h2 className="text-2xl md:text-3xl font-bold text-honor-text-primary mb-3">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl md:text-4xl font-bold text-honor-primary">
                  {formatCurrency(product.priceCents)}
                </span>
              </div>

              {/* Description */}
              <p className="text-honor-text-secondary mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Specs */}
              {product.specs && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-honor-text-primary mb-3 uppercase tracking-wide">
                    Especificaciones
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="bg-honor-bg-light rounded-lg p-3 border border-honor-border">
                        <p className="text-xs text-honor-text-muted mb-1">{key}</p>
                        <p className="text-sm font-semibold text-honor-text-primary">
                          {String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs rounded-honor bg-honor-bg-light text-honor-text-secondary px-3 py-1 border border-honor-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  className="btn-primary w-full text-base md:text-lg py-3 md:py-4 block"
                >
                  Agregar al Carrito
                </button>
                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="btn-secondary w-full text-center py-3 md:py-4 block text-base"
                >
                  Ver Detalles Completos
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
