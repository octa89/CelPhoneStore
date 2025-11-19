"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 sm:mb-8" role="search">
      <label htmlFor="search-mobile-input" className="sr-only">
        Buscar productos
      </label>
      <div className="relative">
        <input
          id="search-mobile-input"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar celulares, tablets, accesorios..."
          className="w-full rounded-honor-lg bg-honor-bg-light px-4 py-3 sm:px-5 sm:py-4 pr-24 sm:pr-28 outline-none text-honor-text-primary placeholder:text-honor-text-muted border border-transparent
                     focus:border-honor-primary transition-all text-sm sm:text-base"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-honor-primary text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-honor text-xs sm:text-sm font-semibold
                     hover:opacity-90 transition-all"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
