"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";

const FREE_SHIP_THRESHOLD = 3000;

export function CartDrawer() {
  const { items, isOpen, closeCart, remove, setQty, subtotal, count } = useCart();
  const { format } = useCurrency();
  const reduced = useReducedMotion();
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.1 : 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-black/50"
            aria-hidden
          />
          <motion.aside
            key="cart-panel"
            role="dialog"
            aria-label="Shopping cart"
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: reduced ? 0.15 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[var(--color-bg-light)] text-black flex flex-col border-l border-black"
          >
            <header className="flex flex-col gap-4 px-6 py-5 border-b border-black">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs tracking-[0.3em] uppercase">
                  Cart &mdash; {count}
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="font-mono text-xs tracking-[0.3em] uppercase hover:opacity-60 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
                  aria-label="Close cart"
                >
                  Close
                </button>
              </div>
              {items.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-black/60">
                    {remaining > 0
                      ? `Add ${format(remaining)} for free shipping`
                      : "Free shipping unlocked"}
                  </p>
                  <div className="h-1 bg-black/10 relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-black transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </header>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center">
                  <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/50">
                    &mdash; empty &mdash;
                  </p>
                  <p className="text-sm text-black/60 max-w-xs">
                    Nothing saved yet. The drop is waiting.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="font-mono text-xs tracking-[0.3em] uppercase underline decoration-1 underline-offset-4 hover:opacity-60 transition-opacity"
                  >
                    Browse catalog
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-black/10">
                  {items.map((it) => (
                    <li key={it.id} className="flex gap-4 p-5">
                      <div className="relative w-20 h-20 shrink-0 bg-white">
                        <Image
                          src={it.image}
                          alt={it.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-mono text-xs tracking-[0.2em] uppercase">
                              {it.name}
                            </p>
                            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-black/50 mt-1">
                              Size {it.size}
                            </p>
                          </div>
                          <p className="font-mono text-xs whitespace-nowrap">
                            {format(it.priceEGP * it.qty)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="inline-flex items-center border border-black">
                            <button
                              type="button"
                              onClick={() => setQty(it.id, it.qty - 1)}
                              className="w-7 h-7 font-mono text-sm hover:bg-black hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
                              aria-label="Decrease quantity"
                            >
                              &minus;
                            </button>
                            <span className="w-8 text-center font-mono text-xs">
                              {it.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(it.id, it.qty + 1)}
                              className="w-7 h-7 font-mono text-sm hover:bg-black hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(it.id)}
                            className="font-mono text-[10px] tracking-[0.25em] uppercase text-black/50 hover:text-black transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-black px-6 py-5 flex flex-col gap-4">
                <div className="flex items-center justify-between font-mono text-xs tracking-[0.2em] uppercase">
                  <span>Subtotal</span>
                  <span>{format(subtotal)}</span>
                </div>
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-black/50">
                  Shipping + taxes calculated at checkout
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="block w-full text-center font-mono text-xs tracking-[0.3em] uppercase py-3 border border-black hover:bg-black hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
                  >
                    Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block w-full text-center font-mono text-xs tracking-[0.3em] uppercase py-3 bg-black text-white hover:bg-black/85 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
                  >
                    Checkout
                  </Link>
                </div>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
