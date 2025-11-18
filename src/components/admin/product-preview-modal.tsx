"use client";
import { Product } from "@/lib/types";
import ProductCard from "@/components/product-card";
import { useEffect } from "react";

interface ProductPreviewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductPreviewModal({ product, onClose }: ProductPreviewModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (product) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen flex items-center justify-center p-4 py-8">
        <div
          className="relative max-w-md w-full my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center text-xl"
            aria-label="Cerrar"
          >
            ✕
          </button>

          {/* Preview Title */}
          <div className="mb-4 text-center">
            <h3 className="text-white text-lg font-semibold bg-tecno-primary/80 backdrop-blur-sm rounded-t-xl py-3 px-4">
              Vista Previa - Página Principal
            </h3>
          </div>

          {/* Product Card Preview */}
          <div className="transform scale-100">
            <ProductCard p={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
