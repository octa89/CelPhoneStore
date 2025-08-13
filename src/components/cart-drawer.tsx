"use client";
import { useCart } from "@/store/use-cart";
import { formatCurrency } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CartDrawer() {
  const { open, closeCart, items, setQty, remove, subtotalCents, clear } =
    useCart();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  async function checkout() {
    const stripe = await stripePromise;
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lineItems: Object.values(items).map(({ product, qty }) => ({
          name: product.name,
          quantity: qty,
          amount: product.priceCents,
        })),
      }),
    });
    const { id } = await res.json();
    await stripe?.redirectToCheckout({ sessionId: id });
  }

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      {/* backdrop */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black/60 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-neutral-950 border-l border-white/10
                    transform transition-transform ${
                      open ? "translate-x-0" : "translate-x-full"
                    }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <h3 className="font-semibold">Your Cart</h3>
          <button onClick={closeCart} className="opacity-70 hover:opacity-100">
            ✕
          </button>
        </div>
        <div className="p-4 space-y-4 overflow-auto h-[calc(100%-9rem)]">
          {Object.values(items).length === 0 && (
            <p className="text-neutral-400">Cart is empty.</p>
          )}
          {Object.values(items).map(({ product, qty }) => (
            <div key={product.id} className="flex gap-3 items-center">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-16 w-16 rounded-lg object-cover ringed"
              />
              <div className="flex-1">
                <div className="flex justify-between gap-3">
                  <p className="font-medium">{product.name}</p>
                  <button
                    onClick={() => remove(product.id)}
                    className="text-xs opacity-75 hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) =>
                      setQty(product.id, parseInt(e.target.value || "1"))
                    }
                    className="w-16 rounded-md bg-white/10 px-2 py-[2px] outline-none"
                  />
                  <span className="ml-auto">
                    {formatCurrency(product.priceCents * qty)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-neutral-300">Subtotal</p>
            <p className="font-semibold">{formatCurrency(subtotalCents())}</p>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={clear}
              className="glass ringed rounded-lg px-3 py-2 text-sm"
            >
              Clear
            </button>
            <button
              onClick={checkout}
              className="glass ringed rounded-lg px-3 py-2 text-sm flex-1"
            >
              Checkout
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
