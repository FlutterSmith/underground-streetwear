"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { averageRating } from "@/lib/products";
import { rotationFor } from "@/lib/seededRotation";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";
import { WishlistHeart } from "@/components/WishlistHeart";
import { Stars } from "@/components/Stars";

type ProductTileProps = { product: Product; index?: number };

const FALLBACK = "/fallback-garment.svg";

export function ProductTile({ product, index = 0 }: ProductTileProps) {
  const reduced = useReducedMotion();
  const rotation = rotationFor(product.id);
  const [primarySrc, setPrimarySrc] = useState(product.image);
  const [hovered, setHovered] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { add, openCart } = useCart();
  const { format } = useCurrency();

  const secondImage = product.gallery && product.gallery.length > 1 ? product.gallery[1] : null;
  const sizes = product.sizes ?? ["S", "M", "L", "XL"];
  const rating = averageRating(product);
  const reviewCount = product.reviews?.length ?? 0;

  const initial = reduced ? { opacity: 0 } : { opacity: 0, y: 24, rotate: rotation };
  const animate = reduced ? { opacity: 1 } : { opacity: 1, y: 0, rotate: rotation };

  const lowStock = !product.soldOut && typeof product.stock === "number" && product.stock > 0 && product.stock <= 5;

  function handleQuickAdd(e: React.MouseEvent, size: string) {
    e.preventDefault();
    e.stopPropagation();
    add(product, size, 1);
    setShowQuickAdd(false);
    openCart();
  }

  return (
    <Link
      href={`/shop/${product.id}`}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowQuickAdd(false);
      }}
    >
      <motion.figure
        initial={initial}
        animate={animate}
        transition={{
          duration: reduced ? 0.2 : 0.5,
          delay: reduced ? 0 : index * 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={
          reduced
            ? undefined
            : {
                scale: 1.05,
                rotate: 0,
                transition: { duration: 0.3, ease: "easeOut" },
              }
        }
        whileTap={
          reduced
            ? undefined
            : {
                scale: 1.05,
                rotate: 0,
                transition: { duration: 0.3, ease: "easeOut" },
              }
        }
        className="group relative flex flex-col items-center gap-3 cursor-pointer"
        style={{ transformOrigin: "center" }}
      >
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 overflow-hidden">
          {!loaded && (
            <div className="absolute inset-0 skeleton" aria-hidden />
          )}
          <Image
            src={primarySrc}
            alt={`${product.name} (${product.category})`}
            fill
            sizes="(max-width: 768px) 60vw, 240px"
            className={`object-cover transition-opacity duration-500 ${
              hovered && secondImage ? "opacity-0" : "opacity-100"
            } ${product.soldOut ? "grayscale opacity-50" : ""}`}
            onError={() => setPrimarySrc(FALLBACK)}
            onLoad={() => setLoaded(true)}
            priority={index < 3}
          />
          {secondImage && (
            <Image
              src={secondImage}
              alt=""
              fill
              sizes="(max-width: 768px) 60vw, 240px"
              className={`object-cover transition-opacity duration-500 ${
                hovered ? "opacity-100" : "opacity-0"
              } ${product.soldOut ? "grayscale opacity-50" : ""}`}
              aria-hidden
            />
          )}

          <div className="absolute top-2 right-2 z-10">
            <WishlistHeart productId={product.id} invert />
          </div>

          {product.soldOut && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-mono text-[10px] tracking-[0.35em] uppercase bg-white text-black px-3 py-1.5">
                Sold out
              </span>
            </div>
          )}
          {lowStock && (
            <span className="absolute top-2 left-2 font-mono text-[9px] tracking-[0.25em] uppercase bg-red-600 text-white px-2 py-1 z-10">
              Only {product.stock} left
            </span>
          )}

          {!product.soldOut && (
            <div
              className={`absolute inset-x-0 bottom-0 transition-transform duration-300 ease-out ${
                hovered ? "translate-y-0" : "translate-y-full"
              }`}
            >
              {showQuickAdd ? (
                <div className="bg-white text-black p-2 grid grid-cols-4 gap-1">
                  {sizes.slice(0, 4).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={(e) => handleQuickAdd(e, s)}
                      className="h-9 font-mono text-[10px] tracking-wider border border-black/30 hover:bg-black hover:text-white transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowQuickAdd(true);
                  }}
                  className="w-full bg-white text-black h-10 font-mono text-[10px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-colors"
                >
                  Quick add
                </button>
              )}
            </div>
          )}
        </div>
        <figcaption className="flex flex-col items-center gap-1 text-center">
          <span className="font-mono text-[11px] tracking-[0.25em] [font-variant-caps:all-small-caps] text-white/90">
            {product.name}
          </span>
          <span className="font-mono text-[11px] tracking-[0.15em] text-white/60">
            {product.soldOut ? (
              <span className="text-white/40">&mdash; waitlist open</span>
            ) : (
              <>&mdash; {format(product.priceEGP)}</>
            )}
          </span>
          {reviewCount > 0 && (
            <Stars value={rating} invert size="sm" showValue count={reviewCount} />
          )}
        </figcaption>
      </motion.figure>
    </Link>
  );
}
