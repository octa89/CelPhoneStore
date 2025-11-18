"use client";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/use-cart";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function AddToCartClient({ product }: { product: Product }) {
  const { add, openCart } = useCart();

  function handleAddToCart() {
    add(product, 1);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#000000', '#2F2F2F', '#666666', '#999999'],
    });
    openCart();
  }

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.05 }}
      className="btn-primary w-full text-lg py-4 font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
      onClick={handleAddToCart}
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      Agregar al Carrito
    </motion.button>
  );
}
