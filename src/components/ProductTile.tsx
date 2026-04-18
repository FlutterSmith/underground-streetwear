"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { rotationFor } from "@/lib/seededRotation";

type ProductTileProps = { product: Product; index?: number };

const FALLBACK = "/fallback-garment.svg";

function formatPrice(n: number): string {
  return n.toLocaleString("en-US");
}

export function ProductTile({ product, index = 0 }: ProductTileProps) {
  const reduced = useReducedMotion();
  const rotation = rotationFor(product.id);
  const [src, setSrc] = useState(product.image);

  const initial = reduced ? { opacity: 0 } : { opacity: 0, y: 24, rotate: rotation };
  const animate = reduced ? { opacity: 1 } : { opacity: 1, y: 0, rotate: rotation };

  return (
    <Link href={`/shop/${product.id}`} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
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
          <Image
            src={src}
            alt={`${product.name} (${product.category})`}
            fill
            sizes="(max-width: 768px) 60vw, 240px"
            className={`object-cover ${product.soldOut ? "opacity-50 grayscale" : ""}`}
            onError={() => setSrc(FALLBACK)}
            priority={index < 3}
          />
          {product.soldOut && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-mono text-[10px] tracking-[0.35em] uppercase bg-white text-black px-3 py-1.5">
                Sold out
              </span>
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
              <>&mdash; LE {formatPrice(product.priceEGP)} EGP</>
            )}
          </span>
        </figcaption>
      </motion.figure>
    </Link>
  );
}
