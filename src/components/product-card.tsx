"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/use-cart";
import confetti from "canvas-confetti";
import Link from "next/link";

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
    confetti({ particleCount: 60, spread: 55, origin: { y: 0.8 } });
  }

  return (
    <motion.article
      className="group glass ringed rounded-2xl overflow-hidden"
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
    >
      <Link href={`/product/${p.slug}`}>
        <img
          src={p.images[0]}
          alt={p.name}
          className="h-56 w-full object-cover"
        />
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{p.name}</h3>
          <span className="text-fuchsia-300">
            {formatCurrency(p.priceCents)}
          </span>
        </div>
        <p className="mt-1 text-sm text-neutral-300 line-clamp-2">
          {p.description}
        </p>
        <div className="mt-3 flex gap-2">
          {p.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-xs rounded-full bg-white/10 px-2 py-[2px]"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={addToCart}
            className="glass ringed rounded-lg px-3 py-2 text-sm"
          >
            Add to cart
          </button>
          <Link
            href={`/product/${p.slug}`}
            className="text-sm underline underline-offset-4"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
