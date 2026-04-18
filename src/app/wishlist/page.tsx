"use client";

import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BarButton } from "@/components/BarButton";
import { useWishlist } from "@/lib/wishlist";
import { useCurrency } from "@/lib/currency";
import { useCart } from "@/lib/cart";
import { products } from "@/lib/products";

export default function WishlistPage() {
  const { ids, remove, clear } = useWishlist();
  const { format } = useCurrency();
  const { add } = useCart();

  const items = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  if (items.length === 0) {
    return (
      <>
        <Nav />
        <main className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center gap-8 px-6 pb-20 text-center">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/70">
            &mdash; wishlist &mdash;
          </p>
          <h1 className="text-4xl sm:text-6xl font-medium max-w-2xl leading-tight">
            nothing saved yet.
          </h1>
          <p className="max-w-md text-black/60">
            Tap the heart on a piece you like. We&apos;ll keep it here for next time.
          </p>
          <BarButton href="/shop" label="Browse the drop" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 sm:px-10 pb-24">
        <div className="flex items-end justify-between mt-6 mb-12">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/70">
            &mdash; wishlist ({items.length}) &mdash;
          </p>
          <button
            type="button"
            onClick={clear}
            className="font-mono text-[11px] tracking-[0.25em] uppercase text-black/50 hover:text-black transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {items.map((p) => {
            const defaultSize = p.sizes?.[0] ?? "M";
            return (
              <div key={p.id} className="flex flex-col gap-3">
                <Link href={`/shop/${p.id}`} className="relative aspect-square bg-white block overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 90vw, 33vw"
                    className={`object-cover transition-transform duration-500 hover:scale-105 ${
                      p.soldOut ? "grayscale opacity-50" : ""
                    }`}
                  />
                  {p.soldOut && (
                    <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.3em] uppercase bg-white text-black px-2 py-1">
                      Sold out
                    </span>
                  )}
                </Link>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs tracking-[0.2em] uppercase">{p.name}</p>
                    <p className="font-mono text-[11px] tracking-[0.15em] text-black/60 mt-1">
                      {format(p.priceEGP)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="font-mono text-[10px] tracking-[0.25em] uppercase text-black/50 hover:text-black transition-colors"
                  >
                    Remove
                  </button>
                </div>
                {!p.soldOut && (
                  <button
                    type="button"
                    onClick={() => add(p, defaultSize, 1)}
                    className="h-10 border border-black font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-colors"
                  >
                    Add to cart ({defaultSize})
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
