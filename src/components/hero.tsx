"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MagneticButton } from "./ui";
import Link from "next/link";

export default function Hero() {
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-200, 200], [8, -8]), {
    stiffness: 120,
    damping: 10,
  });
  const ry = useSpring(useTransform(mx, [-200, 200], [-8, 8]), {
    stiffness: 120,
    damping: 10,
  });

  return (
    <section
      className="relative overflow-hidden rounded-2xl ringed glass p-8 md:p-12 mb-10"
      onMouseMove={(e) => {
        const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        mx.set(e.clientX - (r.left + r.width / 2));
        my.set(e.clientY - (r.top + r.height / 2));
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry }}
        className="will-change-transform"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          iPhone & <span className="text-fuchsia-300">Electronics</span> with
          style
        </h1>
        <p className="mt-3 text-neutral-300 max-w-2xl">
          Fast, polished, and animated. Built with Next.js, Tailwind, and Framer
          Motion.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="#featured">
            <MagneticButton className="group">Shop Featured</MagneticButton>
          </Link>
          <Link href="/search?q=iphone">
            <MagneticButton className="group">Explore iPhone</MagneticButton>
          </Link>
        </div>
        <motion.img
          src="https://images.unsplash.com/photo-1697284959152-32ef13855932?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="iPhone 15 Pro"
          className="mt-8 w-full rounded-xl ringed"
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        />
      </motion.div>
    </section>
  );
}
