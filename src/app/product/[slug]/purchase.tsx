"use client";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/use-cart";
import { motion } from "framer-motion";

export default function AddToCartClient({ product }: { product: Product }) {
  const { add, openCart } = useCart();
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      className="glass ringed rounded-xl px-5 py-3 font-medium"
      onClick={() => {
        add(product, 1);
        openCart();
      }}
    >
      Agregar al carrito
    </motion.button>
  );
}
