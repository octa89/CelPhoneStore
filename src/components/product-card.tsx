"use client";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/use-cart";
import confetti from "canvas-confetti";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ p, onQuickView }: { p: Product; onQuickView?: () => void }) {
  const { add } = useCart();

  function addToCart() {
    add(p, 1);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#000000', '#2F2F2F', '#666666', '#999999'],
    });
  }

  return (
    <motion.article
      className="group glass-card product-card-hover overflow-hidden relative"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {/* Featured Badge */}
      {p.featured && (
        <div className="absolute top-4 left-4 z-10 bg-honor-accent text-white px-4 py-1.5 rounded-full text-xs font-bold">
          DESTACADO
        </div>
      )}

      {/* Product Image */}
      <Link href={`/product/${p.slug}`} className="block relative overflow-hidden bg-honor-bg-light">
        <Image
          src={p.images[0]}
          alt={p.name}
          width={400}
          height={400}
          className="h-72 w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="p-6">
        {/* Brand */}
        <p className="text-sm text-honor-text-muted uppercase tracking-wide mb-2">{p.brand}</p>

        {/* Name - Clickable for Quick View */}
        <button
          onClick={onQuickView}
          className="text-xl font-semibold text-honor-text-primary mb-2 line-clamp-2 min-h-[3.5rem] text-left hover:text-honor-primary transition-colors w-full hover:underline"
        >
          {p.name}
        </button>

        {/* Description */}
        <p className="text-sm text-black line-clamp-2 mb-4 leading-relaxed">
          {p.description}
        </p>

        {/* Price */}
        <div className="mb-5">
          <span className="text-2xl font-bold text-honor-primary">
            {formatCurrency(p.priceCents)}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {p.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="text-xs rounded-honor bg-honor-bg-light text-honor-text-secondary px-3 py-1 border border-honor-border"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={addToCart}
            className="btn-primary text-base py-3"
          >
            Agregar al Carrito
          </button>
          <Link
            href={`/product/${p.slug}`}
            className="btn-secondary text-base py-3 text-center"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
