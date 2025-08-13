"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/use-cart";
import { Badge } from "./ui";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const { totalCount, toggleCart } = useCart();
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="text-white">GEOLINK - IT Engineering</span>
          <span className="text-fuchsia-300">Store</span>
        </Link>

        <form
          className="ml-6 hidden md:flex items-center gap-2 flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/search?q=${encodeURIComponent(q)}`);
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search iPhone, AirPods, iPad..."
            className="w-full rounded-xl glass ringed px-3 py-2 outline-none"
          />
        </form>

        <div className="ml-auto flex items-center gap-4">
          <Link href="/search" className="md:hidden text-sm">
            Search
          </Link>
          <button onClick={toggleCart} className="relative">
            🛒
            <Badge>{totalCount()}</Badge>
          </button>
        </div>
      </div>
    </header>
  );
}
