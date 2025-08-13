"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

type CartItem = { product: Product; qty: number };
type CartState = {
  open: boolean;
  items: Record<string, CartItem>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  subtotalCents: () => number;
  totalCount: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      open: false,
      items: {},
      openCart: () => set({ open: true }),
      closeCart: () => set({ open: false }),
      toggleCart: () => set({ open: !get().open }),
      add: (product, qty = 1) => {
        const items = { ...get().items };
        const cur = items[product.id];
        items[product.id] = { product, qty: (cur?.qty || 0) + qty };
        set({ items, open: true });
      },
      remove: (id) => {
        const items = { ...get().items };
        delete items[id];
        set({ items });
      },
      setQty: (id, qty) => {
        const items = { ...get().items };
        if (!items[id]) return;
        if (qty <= 0) delete items[id];
        else items[id].qty = qty;
        set({ items });
      },
      clear: () => set({ items: {} }),
      subtotalCents: () =>
        Object.values(get().items).reduce(
          (s, it) => s + it.product.priceCents * it.qty,
          0
        ),
      totalCount: () =>
        Object.values(get().items).reduce((s, it) => s + it.qty, 0),
    }),
    { name: "cart-v1" }
  )
);
