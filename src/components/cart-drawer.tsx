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
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (open) {
      setScrollY(window.scrollY);
      
      const handleScroll = () => {
        setScrollY(window.scrollY);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [open]);
  
  if (!isMounted) return null;

  async function checkout() {
    try {
      if (Object.values(items).length === 0) {
        alert("Your cart is empty!");
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        alert("Stripe failed to load. Please try again.");
        return;
      }

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

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Checkout API error:", errorData);
        alert(`Checkout failed: ${errorData.error || 'Unknown error'}`);
        return;
      }

      const { id } = await res.json();
      if (!id) {
        alert("Failed to create checkout session. Please try again.");
        return;
      }

      const result = await stripe.redirectToCheckout({ sessionId: id });
      if (result.error) {
        console.error("Stripe redirect error:", result.error);
        alert(`Checkout failed: ${result.error.message}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong during checkout. Please try again.");
    }
  }

  const itemCount = Object.values(items).length;
  const dynamicHeight = Math.max(300, Math.min(600, 120 + itemCount * 100 + 100)); // min 300px, max 600px

  return (
    <>
      {/* backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden={!open}
      />
      {/* panel */}
      <aside
        className={`absolute right-4 w-full sm:w-[420px] bg-neutral-950 border border-white/10 shadow-2xl rounded-xl
                    transition-all duration-300 ease-in-out ${
                      open ? "transform translate-x-0 scale-100" : "transform translate-x-full scale-95"
                    }`}
        style={{ 
          top: `${scrollY + 100}px`,
          transform: open 
            ? 'translateX(0) scale(1)' 
            : 'translateX(100%) scale(0.95)',
          height: `${dynamicHeight}px`,
          zIndex: 70
        }}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
            <h3 className="font-semibold">Your Cart</h3>
            <button onClick={closeCart} className="opacity-70 hover:opacity-100">
              ✕
            </button>
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-0">
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
          <div className="p-4 border-t border-white/10 flex-shrink-0">
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
        </div>
      </aside>
    </>
  );
}
