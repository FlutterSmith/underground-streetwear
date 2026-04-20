"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { PageTheme } from "@/components/PageTheme";
import { Footer } from "@/components/Footer";
import { Reviews } from "@/components/Reviews";
import { Stars } from "@/components/Stars";
import { WishlistHeart } from "@/components/WishlistHeart";
import { RecentlyViewedStrip } from "@/components/RecentlyViewedStrip";
import type { Product } from "@/lib/products";
import { products, averageRating, isLowStock } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";
import { recordView } from "@/lib/recentlyViewed";

export function ProductDetail({ product }: { product: Product }) {
  const gallery = useMemo(() => {
    const g = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
    return Array.from(new Set(g));
  }, [product]);
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"];

  const [activeIdx, setActiveIdx] = useState(0);
  const safeIdx = Math.min(activeIdx, gallery.length - 1);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [showSizeError, setShowSizeError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistState, setWaitlistState] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const waitlistInputRef = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();
  const { add } = useCart();
  const { format } = useCurrency();

  const rating = averageRating(product);
  const reviewCount = product.reviews?.length ?? 0;
  const lowStock = isLowStock(product);

  useEffect(() => {
    recordView(product.id);
    setShowSizeError(false);
    setSize(null);
    setQty(1);
    setActiveIdx(0);
    setJustAdded(false);
  }, [product.id]);

  const related = useMemo(
    () => products.filter((p) => p.id !== product.id).slice(0, 4),
    [product.id],
  );

  function handleAdd() {
    if (!size) {
      setShowSizeError(true);
      return;
    }
    add(product, size, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  }

  async function handleWaitlist(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(waitlistEmail)) {
      setWaitlistState("err");
      waitlistInputRef.current?.focus();
      waitlistInputRef.current?.select();
      return;
    }
    setWaitlistState("busy");
    // TODO(template-buyer): POST to your waitlist endpoint.
    await new Promise((r) => setTimeout(r, 500));
    setWaitlistState("ok");
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] text-white">
      <PageTheme mode="dark" />
      <Nav invert />

      <main className="max-w-6xl mx-auto px-6 sm:px-10 pb-24">
        <nav className="font-mono text-[11px] tracking-[0.25em] uppercase text-white/50 flex items-center gap-2 mt-4 mb-8">
          <Link href="/shop" className="hover:text-white transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-white/80">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square bg-white/5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={gallery[safeIdx]}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={gallery[safeIdx]}
                    alt={`${product.name} view ${safeIdx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority={safeIdx === 0}
                  />
                </motion.div>
              </AnimatePresence>
              {product.signature && (
                <span className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.3em] uppercase bg-white text-black px-2 py-1">
                  Signature
                </span>
              )}
              {product.soldOut && (
                <span className="absolute top-4 right-4 font-mono text-[10px] tracking-[0.3em] uppercase bg-red-600 text-white px-2 py-1">
                  Sold out
                </span>
              )}
            </div>
            {gallery.length > 1 && (
              <div
                role="tablist"
                aria-label="Product images"
                className="grid grid-cols-4 gap-2"
              >
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    role="tab"
                    aria-selected={i === safeIdx}
                    tabIndex={i === safeIdx ? 0 : -1}
                    onClick={() => setActiveIdx(i)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "Home" || e.key === "End") {
                        e.preventDefault();
                        const next =
                          e.key === "ArrowRight" ? (i + 1) % gallery.length
                          : e.key === "ArrowLeft" ? (i - 1 + gallery.length) % gallery.length
                          : e.key === "Home" ? 0
                          : gallery.length - 1;
                        setActiveIdx(next);
                        const parent = e.currentTarget.parentElement;
                        const btn = parent?.querySelectorAll<HTMLButtonElement>('button[role="tab"]')[next];
                        btn?.focus();
                        btn?.scrollIntoView({ block: "nearest", inline: "nearest" });
                      }
                    }}
                    className={`relative aspect-square bg-white/5 border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      i === safeIdx ? "border-white" : "border-transparent hover:border-white/40"
                    }`}
                    aria-label={`View image ${i + 1} of ${gallery.length}`}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/60 mb-2">
                &mdash; {product.category} &mdash;
              </p>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-4xl sm:text-5xl font-medium tracking-tight">
                  {product.name}
                </h1>
                <WishlistHeart productId={product.id} invert size="md" />
              </div>
              <p className="font-mono text-sm tracking-[0.2em] mt-3 text-white/80">
                {format(product.priceEGP)}
              </p>
              {rating !== null && (
                <div className="mt-2">
                  <Stars value={rating} invert showValue count={reviewCount} />
                </div>
              )}
              {lowStock && (
                <p className="mt-3 font-mono text-[11px] tracking-[0.25em] uppercase text-red-400">
                  Only {product.stock} left
                </p>
              )}
            </div>

            {product.description && (
              <p className="text-white/70 leading-relaxed max-w-md">
                {product.description}
              </p>
            )}

            {product.fabric && (
              <div className="flex gap-6 text-xs font-mono tracking-[0.2em] uppercase text-white/60">
                <div>
                  <p className="text-white/40 mb-1">Fabric</p>
                  <p className="text-white/90">{product.fabric}</p>
                </div>
              </div>
            )}

            {product.soldOut ? (
              <div className="border border-white/20 p-5 flex flex-col gap-4">
                <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/70">
                  &mdash; waitlist &mdash;
                </p>
                <p className="text-white/70 text-sm leading-relaxed">
                  Drop sold out. Leave your email and we&apos;ll tell you first when
                  this piece restocks or a successor drops.
                </p>
                {waitlistState === "ok" ? (
                  <p className="font-mono text-xs tracking-[0.25em] uppercase text-white/90">
                    &mdash; you&apos;re on it. &mdash;
                  </p>
                ) : (
                  <form onSubmit={handleWaitlist} className="flex items-stretch">
                    <input
                      ref={waitlistInputRef}
                      type="email"
                      value={waitlistEmail}
                      onChange={(e) => {
                        setWaitlistEmail(e.target.value);
                        if (waitlistState === "err") setWaitlistState("idle");
                      }}
                      placeholder="you@domain.com"
                      aria-label="Waitlist email"
                      aria-invalid={waitlistState === "err"}
                      aria-describedby={waitlistState === "err" ? "waitlist-error" : undefined}
                      className="flex-1 bg-transparent outline-none py-3 font-mono text-sm text-white placeholder:text-white/30"
                    />
                    <button
                      type="submit"
                      disabled={waitlistState === "busy"}
                      className="px-5 font-mono text-[11px] tracking-[0.3em] uppercase bg-white text-black disabled:opacity-40"
                    >
                      {waitlistState === "busy" ? "..." : "Notify me"}
                    </button>
                  </form>
                )}
                {waitlistState === "err" && (
                  <p
                    id="waitlist-error"
                    role="alert"
                    aria-live="polite"
                    className="font-mono text-[10px] tracking-[0.25em] uppercase text-red-400"
                  >
                    Invalid email
                  </p>
                )}
              </div>
            ) : (
            <>
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/70">
                  Size
                </p>
                <details className="relative font-mono text-[10px] tracking-[0.25em] uppercase text-white/40 [&[open]>summary]:text-white/80">
                  <summary className="cursor-pointer hover:text-white/80 transition-colors list-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    Size guide
                  </summary>
                  <div className="absolute right-0 mt-2 w-72 bg-black border border-white/20 p-4 z-10">
                    <p className="text-white/70 mb-3 tracking-[0.2em]">Chest / length (cm)</p>
                    <table className="w-full text-white/80 tabular-nums">
                      <thead>
                        <tr className="text-white/50">
                          <th className="text-left py-1">Size</th>
                          <th className="text-right py-1">Chest</th>
                          <th className="text-right py-1">Length</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="py-0.5">XS</td><td className="text-right">94</td><td className="text-right">66</td></tr>
                        <tr><td className="py-0.5">S</td><td className="text-right">100</td><td className="text-right">68</td></tr>
                        <tr><td className="py-0.5">M</td><td className="text-right">106</td><td className="text-right">70</td></tr>
                        <tr><td className="py-0.5">L</td><td className="text-right">112</td><td className="text-right">72</td></tr>
                        <tr><td className="py-0.5">XL</td><td className="text-right">118</td><td className="text-right">74</td></tr>
                        <tr><td className="py-0.5">XXL</td><td className="text-right">124</td><td className="text-right">76</td></tr>
                      </tbody>
                    </table>
                  </div>
                </details>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => {
                      setSize(s);
                      setShowSizeError(false);
                    }}
                    className={`min-w-[3rem] h-12 px-3 border font-mono text-xs tracking-wider transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      size === s
                        ? "bg-white text-black border-white"
                        : "border-white/40 hover:border-white"
                    }`}
                    aria-pressed={size === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {showSizeError && (
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-red-400 mt-2">
                  Pick a size
                </p>
              )}
            </div>

            <div>
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/70 mb-3">
                Quantity
              </p>
              <div className="inline-flex items-center border border-white/40">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 font-mono text-sm hover:bg-white hover:text-black transition-colors"
                  aria-label="Decrease quantity"
                >
                  &minus;
                </button>
                <span className="w-12 text-center font-mono text-sm">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  className="w-10 h-10 font-mono text-sm hover:bg-white hover:text-black transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={justAdded}
              className="relative overflow-hidden h-14 border border-white font-mono text-sm tracking-[0.3em] uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span className="absolute inset-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] origin-left scale-x-0 hover:scale-x-100" />
              <span
                className={`relative z-10 inline-flex items-center justify-center gap-2 transition-colors duration-300 ${
                  justAdded ? "text-white" : "text-white hover:text-black"
                }`}
              >
                {justAdded && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                  >
                    <path d="M3 8.5 L7 12 L13 4" />
                  </svg>
                )}
                {justAdded ? "Added to cart" : "Add to cart"}
              </span>
            </button>
            </>
            )}

            <div className="text-xs font-mono tracking-[0.2em] uppercase text-white/50 space-y-1.5 border-t border-white/10 pt-5">
              <p>Ships within 5 business days</p>
              <p>Free delivery on orders over LE 3,000</p>
              <p>No returns on signature pieces</p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-32">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-white/50 text-center mb-10">
              &mdash; more pieces &mdash;
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/shop/${p.id}`}
                  className="group flex flex-col items-center gap-3"
                >
                  <div className="relative aspect-square w-full bg-white/5 overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 45vw, 200px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-white/90">
                      {p.name}
                    </p>
                    <p className="font-mono text-[10px] tracking-[0.15em] text-white/60 mt-1">
                      {format(p.priceEGP)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {product.reviews && product.reviews.length > 0 && (
          <section className="mt-32 max-w-3xl mx-auto">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-white/50 text-center mb-10">
              &mdash; reviews &mdash;
            </p>
            <Reviews reviews={product.reviews} invert />
          </section>
        )}

        <div className="mt-32">
          <RecentlyViewedStrip excludeId={product.id} invert />
        </div>
      </main>
      <Footer invert />
    </div>
  );
}
