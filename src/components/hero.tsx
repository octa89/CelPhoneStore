"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-12 mb-12 border border-tecno-cyan/30 shadow-glow-lg">
      {/* Animated Background Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-tecno-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-tecno-cyan/20 rounded-full blur-3xl" />

      <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-tecno-bolt/20 border border-tecno-bolt/50 text-tecno-bolt px-4 py-2 rounded-full text-sm font-bold mb-6">
              <span>⚡</span>
              ENVÍO EXPRESS GRATIS
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              <span className="text-gradient">Los Mejores</span>
              <br />
              <span className="text-white">Smartphones</span>
              <br />
              <span className="text-tecno-cyan">Al Mejor Precio</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-text-muted max-w-xl mb-8">
              Descubre nuestra selección de celulares de las mejores marcas.
              Honor, Xiaomi, Samsung, iPhone y más. Entrega rápida en todo el país.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="#productos" className="btn-primary">
                Ver Catálogo
              </Link>
              <Link href="/search?q=honor" className="btn-secondary">
                Ofertas Honor
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-tecno-cyan text-xl">✓</span>
                <span className="text-text-muted">Garantía Oficial</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-tecno-cyan text-xl">⚡</span>
                <span className="text-text-muted">Envío Express</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-tecno-cyan text-xl">🔒</span>
                <span className="text-text-muted">Pago Seguro</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Showcase */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Featured Product */}
          <div className="relative z-10">
            <Image
              src="https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=764&auto=format&fit=crop"
              alt="Featured Product"
              width={764}
              height={764}
              className="w-full max-w-md mx-auto drop-shadow-2xl"
            />
          </div>

          {/* Floating Stats */}
          <motion.div
            className="absolute top-10 -left-4 glass-card rounded-2xl p-4 shadow-glow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-3xl font-bold text-tecno-cyan">24h</p>
            <p className="text-xs text-text-muted">Entrega Express</p>
          </motion.div>

          <motion.div
            className="absolute bottom-10 -right-4 glass-card rounded-2xl p-4 shadow-glow"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-3xl font-bold text-tecno-bolt">-30%</p>
            <p className="text-xs text-text-muted">En Productos Select</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
