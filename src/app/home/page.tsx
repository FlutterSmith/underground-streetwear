"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Nav } from "@/components/Nav";
import { Newsletter } from "@/components/Newsletter";
import { BarButton } from "@/components/BarButton";
import { Footer } from "@/components/Footer";
import { RecentlyViewedStrip } from "@/components/RecentlyViewedStrip";
import { Marquee } from "@/components/Marquee";
import { Manifesto } from "@/components/Manifesto";
import { SplitReveal } from "@/components/SplitReveal";
import { siteConfig } from "@/config/site.config";
import { products } from "@/lib/products";
import { useCurrency } from "@/lib/currency";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1579725854926-dbeab39780bc?w=1600&q=80&auto=format&fit=crop";
const HERO_FALLBACK = "/fallback-garment.svg";

const TICKER = [
  "SS 26 — DROP 01",
  "BUILT SLOW",
  "SHIPPED RARE",
  "CAIRO · LONDON · TOKYO",
  "NO PRESS RELEASES",
  "HEAVY FABRICS",
  "NUMBERED RUNS",
  "WEAR IT OUT",
];

export default function HomePage() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const { format } = useCurrency();
  const [parallaxEnabled, setParallaxEnabled] = useState(false);
  const [heroSrc, setHeroSrc] = useState(HERO_IMAGE);

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
        className="bg-[var(--color-bg-light)] text-[var(--color-ink)]"
      >
        <section className="px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center max-w-6xl mx-auto pt-8 min-h-[80vh]">
          <div className="flex flex-col gap-6 max-w-xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-mono text-[11px] tracking-[0.3em] uppercase text-black/60"
            >
              SS 26 &mdash; Drop 01
            </motion.p>
            <SplitReveal
              text={siteConfig.taglines[0]}
              as="h1"
              delay={0.15}
              className="font-sans text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight font-medium"
            />
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="font-mono text-xs tracking-[0.25em] uppercase text-black/60"
            >
              {siteConfig.taglines[1]}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="flex flex-wrap gap-3 mt-4"
            >
              <BarButton href="/shop" label="Shop the drop" />
              <BarButton href="/lookbook" label="Lookbook" />
            </motion.div>
          </div>

          <motion.div
            style={{ y }}
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.76, 0, 0.24, 1] }}
            className="relative aspect-[4/5] w-full max-w-md justify-self-center md:justify-self-end overflow-hidden"
          >
            <Image
              src={heroSrc}
              alt="Editorial hero"
              fill
              sizes="(max-width: 768px) 90vw, 420px"
              className="object-cover grayscale contrast-[1.05]"
              priority
              onError={() => setHeroSrc(HERO_FALLBACK)}
            />
            <div className="absolute left-3 bottom-3 font-mono text-[9px] tracking-[0.3em] uppercase text-white mix-blend-difference">
              frame 01 · ss26
            </div>
          </motion.div>
        </section>

        <div className="mt-16">
          <Marquee items={TICKER} speed={45} />
        </div>

        <Manifesto />

        <section className="px-6 sm:px-12 max-w-6xl mx-auto">
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
            {featured.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/shop/${p.id}`} className="group flex flex-col gap-3">
                  <div className="relative aspect-[3/4] bg-white overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 90vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    <span className="absolute left-3 top-3 font-mono text-[9px] tracking-[0.3em] uppercase text-white bg-black/70 px-2 py-1">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-xs tracking-[0.2em] uppercase">
                    <span>{p.name}</span>
                    <span className="text-black/60">{format(p.priceEGP)}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="mt-32 px-6 sm:px-12">
          <RecentlyViewedStrip />
        </div>

        <div className="mt-16">
          <Marquee items={["JOIN THE LIST", "FIRST LOOK", "NO SPAM", "EARLY DROPS", "CAIRO BUILT"]} speed={60} />
        </div>

        <div className="mt-20 border-t border-black/15 px-6 sm:px-12 pb-24">
          <Newsletter />
        </div>
      </main>
      <Footer />
    </>
  );
}
