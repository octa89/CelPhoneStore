"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/use-cart";
import confetti from "canvas-confetti";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ p }: { p: Product }) {
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-60, 60], [6, -6]), {
    stiffness: 180,
    damping: 16,
  });
  const ry = useSpring(useTransform(mx, [-60, 60], [-6, 6]), {
    stiffness: 180,
    damping: 16,
  });
  const { add } = useCart();

  function addToCart() {
    add(p, 1);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#2EC5FF', '#2434FF', '#FFD53D', '#BCEFE4'],
    });
  }

  return (
    <motion.article
      className="group glass-card rounded-2xl overflow-hidden relative"
      onMouseMove={(e) => {
        const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        mx.set(e.clientX - (r.left + r.width / 2));
        my.set(e.clientY - (r.top + r.height / 2));
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{ rotateX: rx, rotateY: ry }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Featured Badge */}
      {p.featured && (
        <div className="absolute top-3 left-3 z-10 bg-tecno-bolt text-tecno-bg px-3 py-1 rounded-full text-xs font-bold shadow-bolt">
          ⚡ DESTACADO
        </div>
      )}

      {/* Product Image */}
      <Link href={`/product/${p.slug}`} className="block relative overflow-hidden">
        <Image
          src={p.images[0]}
          alt={p.name}
          width={400}
          height={224}
          className="h-56 w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tecno-bg/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Brand */}
        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{p.brand}</p>

        {/* Name & Price */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-text-main line-clamp-2 flex-1">{p.name}</h3>
          <span className="text-tecno-cyan font-bold text-lg whitespace-nowrap">
            {formatCurrency(p.priceCents)}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-text-muted line-clamp-2 mb-3">
          {p.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {p.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-xs rounded-full bg-tecno-primary/20 text-tecno-mint px-2.5 py-0.5 border border-tecno-cyan/30"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={addToCart}
            className="btn-primary flex-1 text-sm py-2.5"
          >
            🛒 Agregar
          </button>
          <Link
            href={`/product/${p.slug}`}
            className="btn-secondary px-4 py-2.5 text-sm"
          >
            Ver
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
