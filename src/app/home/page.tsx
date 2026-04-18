"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Nav } from "@/components/Nav";
import { Newsletter } from "@/components/Newsletter";
import { BarButton } from "@/components/BarButton";
import { siteConfig } from "@/config/site.config";
import { products } from "@/lib/products";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1579725854926-dbeab39780bc?w=1600&q=80&auto=format&fit=crop";

export default function HomePage() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const [parallaxEnabled, setParallaxEnabled] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover)");
    const update = () => setParallaxEnabled(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const y = useTransform(scrollY, [0, 1000], [0, reduced || !parallaxEnabled ? 0 : -180]);

  const featured = products.slice(0, 3);

  return (
    <>
      <Nav />
      <main
        ref={ref}
        className="px-6 sm:px-12 pt-4 pb-24 bg-[var(--color-bg-light)] text-[var(--color-ink)]"
      >
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center max-w-6xl mx-auto pt-8 min-h-[70vh]">
          <div className="flex flex-col gap-6 max-w-xl">
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-black/60">
              SS 26 &mdash; Drop 01
            </p>
            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight font-medium">
              {siteConfig.taglines[0]}
            </h1>
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-black/60">
              {siteConfig.taglines[1]}
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <BarButton href="/shop" label="Shop the drop" />
              <BarButton href="/lookbook" label="Lookbook" />
            </div>
          </div>

          <motion.div
            style={{ y }}
            className="relative aspect-[4/5] w-full max-w-md justify-self-center md:justify-self-end overflow-hidden"
          >
            <Image
              src={HERO_IMAGE}
              alt="Editorial hero"
              fill
              sizes="(max-width: 768px) 90vw, 420px"
              className="object-cover grayscale contrast-[1.05]"
              priority
            />
          </motion.div>
        </section>

        <section className="mt-32 max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/60 mb-4">
            &mdash; about &mdash;
          </p>
          <p className="text-xl md:text-2xl leading-relaxed">
            An underground label for people who think the mainstream got too clean.
            Small drops. Heavy fabrics. No press releases.
          </p>
        </section>

        <section className="mt-28 max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/60">
              &mdash; featured &mdash;
            </p>
            <Link
              href="/shop"
              className="font-mono text-[11px] tracking-[0.25em] uppercase underline decoration-1 underline-offset-4 hover:opacity-60 transition-opacity"
            >
              See all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {featured.map((p) => (
              <Link key={p.id} href={`/shop/${p.id}`} className="group flex flex-col gap-3">
                <div className="relative aspect-[3/4] bg-white overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 90vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center justify-between font-mono text-xs tracking-[0.2em] uppercase">
                  <span>{p.name}</span>
                  <span className="text-black/60">LE {p.priceEGP.toLocaleString("en-US")}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-32 border-t border-black/15">
          <Newsletter />
        </div>
      </main>
    </>
  );
}
