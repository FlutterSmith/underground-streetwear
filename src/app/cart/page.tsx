"use client";

import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { BarButton } from "@/components/BarButton";
import { Footer } from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";

const FREE_SHIP_THRESHOLD = 3000;

export default function CartPage() {
  const { items, subtotal, count, setQty, remove, clear } = useCart();
  const { format } = useCurrency();
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);

  if (items.length === 0) {
    return (
      <>
        <Nav />
        <main className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center gap-8 px-6 pb-20 text-center">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/70">
            &mdash; cart &mdash;
          </p>
          <h1 className="text-4xl sm:text-6xl font-medium max-w-2xl leading-tight">
            empty for now.
          </h1>
          <p className="max-w-md text-black/60">
            Nothing saved yet. Browse the catalog — the drop won&apos;t last.
          </p>
          <BarButton href="/shop" label="Go to shop" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 sm:px-10 pb-24">
        <div className="flex items-end justify-between mt-6 mb-6">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/70">
            &mdash; cart ({count}) &mdash;
          </p>
          <button
            type="button"
            onClick={clear}
            className="font-mono text-[11px] tracking-[0.25em] uppercase text-black/50 hover:text-black transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="mb-10 flex flex-col gap-2">
          <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-black/60">
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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-10">
          <ul className="divide-y divide-black/15">
            {items.map((it) => (
              <li key={it.id} className="flex gap-5 py-6">
                <Link
                  href={`/shop/${it.productId}`}
                  className="relative w-28 h-28 shrink-0 bg-white"
                >
                  <Image
                    src={it.image}
                    alt={it.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/shop/${it.productId}`}
                        className="font-mono text-sm tracking-[0.2em] uppercase hover:opacity-70 transition-opacity"
                      >
                        {it.name}
                      </Link>
                      <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-black/50 mt-1">
                        Size {it.size}
                      </p>
                    </div>
                    <p className="font-mono text-sm whitespace-nowrap">
                      {format(it.priceEGP * it.qty)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="inline-flex items-center border border-black">
                      <button
                        type="button"
                        onClick={() => setQty(it.id, it.qty - 1)}
                        className="w-8 h-8 font-mono text-sm hover:bg-black hover:text-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        &minus;
                      </button>
                      <span className="w-10 text-center font-mono text-xs">
                        {it.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(it.id, it.qty + 1)}
                        className="w-8 h-8 font-mono text-sm hover:bg-black hover:text-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(it.id)}
                      className="font-mono text-[11px] tracking-[0.25em] uppercase text-black/50 hover:text-black transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="border border-black p-6 h-fit flex flex-col gap-5 lg:sticky lg:top-6">
            <p className="font-mono text-xs tracking-[0.3em] uppercase">
              &mdash; summary &mdash;
            </p>
            <div className="flex items-center justify-between font-mono text-sm">
              <span>Subtotal</span>
              <span>{format(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between font-mono text-xs text-black/60">
              <span>Shipping</span>
              <span>{remaining === 0 ? "FREE" : "At checkout"}</span>
            </div>
            <div className="flex items-center justify-between font-mono text-xs text-black/60">
              <span>Taxes</span>
              <span>At checkout</span>
            </div>
            <div className="h-px bg-black/15" />
            <div className="flex items-center justify-between font-mono text-sm">
              <span>Total</span>
              <span>{format(subtotal)}</span>
            </div>
            <BarButton href="/checkout" label="Checkout" fullWidth />
            <Link
              href="/shop"
              className="text-center font-mono text-[11px] tracking-[0.25em] uppercase text-black/60 hover:text-black transition-colors"
            >
              Keep shopping
            </Link>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
