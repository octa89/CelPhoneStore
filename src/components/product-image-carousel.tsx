"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
}

export default function ProductImageCarousel({ images, productName }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-tecno-bg/60 rounded-xl flex items-center justify-center">
        <p className="text-text-muted">No hay imágenes disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-square w-full max-w-[600px] mx-auto bg-white/5 rounded-xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Image
              src={images[currentIndex]}
              alt={`${productName} - Image ${currentIndex + 1}`}
              width={600}
              height={600}
              className="w-full h-full object-contain"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all hover:scale-110"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all hover:scale-110"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation - Only show if more than 1 image */}
      {images.length > 1 && (
        <div className="flex gap-2 justify-center overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
                ${
                  index === currentIndex
                    ? "border-tecno-cyan ring-2 ring-tecno-cyan/30 scale-105"
                    : "border-transparent hover:border-tecno-cyan/50"
                }
              `}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
