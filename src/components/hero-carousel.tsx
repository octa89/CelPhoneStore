"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface CarouselSlide {
  productId: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  ctaText: string;
  ctaHref: string;
  order: number;
}

interface SlideWithImage extends CarouselSlide {
  image: string;
  id: number;
  cta: { text: string; href: string };
}

export default function HeroCarousel() {
  const [slides, setSlides] = useState<SlideWithImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load carousel data
  useEffect(() => {
    async function loadCarouselData() {
      try {
        const [carouselRes, productsRes] = await Promise.all([
          fetch("/api/admin/carousel"),
          fetch("/api/admin/products"),
        ]);

        if (carouselRes.ok && productsRes.ok) {
          const carouselData = await carouselRes.json();
          const productsData = await productsRes.json();

          const products = productsData.products || [];
          const carouselSlides = (carouselData.slides || []) as CarouselSlide[];

          // Map carousel slides to products to get images
          const slidesWithImages: SlideWithImage[] = carouselSlides
            .map((slide, index) => {
              const product = products.find((p: any) => p.id === slide.productId);
              if (!product) return null;

              return {
                ...slide,
                id: index + 1,
                image: product.images[0],
                cta: { text: slide.ctaText, href: slide.ctaHref },
              };
            })
            .filter(Boolean) as SlideWithImage[];

          setSlides(slidesWithImages);
        }
      } catch (error) {
        console.error("Error loading carousel data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCarouselData();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000); // Changed from 5000ms (5s) to 8000ms (8s)
    return () => clearInterval(timer);
  }, [slides.length]);

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

  // Show loading or empty state
  if (loading) {
    return (
      <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden mb-0 flex items-center justify-center bg-tecno-bgDark">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-text-muted">Cargando carrusel...</p>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden mb-0 flex items-center justify-center bg-tecno-bgDark">
        <div className="text-center">
          <div className="text-4xl mb-4">🎠</div>
          <p className="text-text-muted">No hay diapositivas en el carrusel</p>
        </div>
      </section>
    );
  }

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
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden mb-0">
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
              {/* Gradient Overlay - Honor style */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container-honor">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="max-w-2xl mt-20 md:mt-32"
                >
                  {/* Badge */}
                  {currentSlide.badge && (
                    <div className="inline-flex items-center gap-2 bg-honor-accent/90 text-white px-5 py-2 rounded-full text-sm font-bold mb-6">
                      {currentSlide.badge}
                    </div>
                  )}

                  {/* Title */}
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white">
                    {currentSlide.title}
                  </h1>

                  <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-white/90">
                    {currentSlide.subtitle}
                  </h2>

                  {/* Description */}
                  <p className="text-lg md:text-xl text-white/80 max-w-xl mb-8 leading-relaxed">
                    {currentSlide.description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={currentSlide.cta.href} className="btn-primary">
                      {currentSlide.cta.text}
                    </Link>
                    <Link href="#productos" className="btn-secondary !bg-white !border-white !text-black hover:!bg-gray-100">
                      Explorar Más
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows - Honor style */}
      <button
        onClick={handlePrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full glass flex items-center justify-center text-honor-text-primary hover:bg-white/30 transition-all text-2xl"
        aria-label="Slide anterior"
      >
        ‹
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full glass flex items-center justify-center text-honor-text-primary hover:bg-white/30 transition-all text-2xl"
        aria-label="Slide siguiente"
      >
        ›
      </button>

      {/* Dot Indicators - Honor style */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-10 h-2 bg-white"
                : "w-2 h-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
