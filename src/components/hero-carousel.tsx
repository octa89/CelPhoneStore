"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    id: 1,
    title: "Los Mejores Smartphones",
    subtitle: "Al Mejor Precio",
    description: "Descubre nuestra selección de celulares Honor, Xiaomi, Samsung y Google",
    image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=1600&auto=format&fit=crop",
    cta: { text: "Ver Catálogo", href: "#productos" },
    badge: "ENVÍO EXPRESS GRATIS ⚡",
  },
  {
    id: 2,
    title: "Honor Magic 6 Lite",
    subtitle: "Diseño Elegante",
    description: "Pantalla AMOLED de 120Hz y Snapdragon 6 Gen 1",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop",
    cta: { text: "Comprar Ahora", href: "/product/honor-magic-6-lite" },
    badge: "DESTACADO",
  },
  {
    id: 3,
    title: "Xiaomi Redmi Note 13 Pro+",
    subtitle: "Potencia y Rendimiento",
    description: "Dimensity 7200 con cámara de 200MP",
    image: "https://images.unsplash.com/photo-1592286927505-b0501739c910?q=80&w=1600&auto=format&fit=crop",
    cta: { text: "Ver Más", href: "/product/redmi-note-13-pro-plus" },
    badge: "NUEVO",
  },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <section className="relative w-full h-[600px] sm:h-[750px] lg:h-[39vw] max-h-[750px] overflow-hidden rounded-3xl mb-12 border border-tecno-cyan/30">
      {/* Slide Container */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
            }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={currentSlide.image}
                alt={currentSlide.title}
                fill
                className="object-cover"
                priority={currentIndex === 0}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-tecno-bg via-tecno-bg/80 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="max-w-2xl"
                >
                  {/* Badge */}
                  {currentSlide.badge && (
                    <div className="inline-flex items-center gap-2 bg-tecno-bolt/20 border border-tecno-bolt/50 text-tecno-bolt px-4 py-2 rounded-full text-sm font-bold mb-6">
                      {currentSlide.badge}
                    </div>
                  )}

                  {/* Title */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                    <span className="text-gradient block">{currentSlide.title}</span>
                    <span className="text-white block mt-2">{currentSlide.subtitle}</span>
                  </h1>

                  {/* Description */}
                  <p className="text-lg sm:text-xl text-text-muted max-w-xl mb-8">
                    {currentSlide.description}
                  </p>

                  {/* CTA Button */}
                  <Link
                    href={currentSlide.cta.href}
                    className="btn-primary inline-block text-base sm:text-lg px-8 py-4"
                  >
                    {currentSlide.cta.text}
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-tecno-bgDark/80 border border-tecno-cyan/30 backdrop-blur-sm flex items-center justify-center text-tecno-cyan hover:bg-tecno-primary/20 hover:border-tecno-cyan transition-all hover:scale-110"
        aria-label="Slide anterior"
      >
        ‹
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-tecno-bgDark/80 border border-tecno-cyan/30 backdrop-blur-sm flex items-center justify-center text-tecno-cyan hover:bg-tecno-primary/20 hover:border-tecno-cyan transition-all hover:scale-110"
        aria-label="Slide siguiente"
      >
        ›
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 h-2 bg-tecno-cyan"
                : "w-2 h-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
