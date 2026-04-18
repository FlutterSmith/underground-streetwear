"use client";

import Image from "next/image";
import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { BarButton } from "@/components/BarButton";
import { PageTheme } from "@/components/PageTheme";
import { Footer } from "@/components/Footer";
import { lookbook } from "@/lib/lookbook";

export default function LookbookPage() {
  const reduced = useReducedMotion();
  const { title, subtitle, credits, shots } = lookbook;

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] text-white">
      <PageTheme mode="dark" />
      <Nav invert />

      <main className="pb-24">
        <header className="max-w-4xl mx-auto px-6 text-center pt-10 pb-20">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/60">
            &mdash; lookbook &mdash;
          </p>
          <h1 className="text-6xl sm:text-8xl font-medium tracking-tight mt-4">
            {title}
          </h1>
          <p className="mt-4 text-white/70">{subtitle}</p>
        </header>

        {shots.length === 0 ? (
          <div className="max-w-xl mx-auto px-6 flex flex-col items-center gap-6 py-20 text-center">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-white/50">
              &mdash; editorial drops soon &mdash;
            </p>
            <BarButton href="/shop" label="See the catalog" />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {shots.map((shot, i) => (
              <motion.figure
                key={shot.src}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: Math.min(i * 0.05, 0.4),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={clsx(
                  "group relative overflow-hidden bg-white/5",
                  shot.aspect === "portrait" && "aspect-[3/4]",
                  shot.aspect === "landscape" && "aspect-[4/3]",
                  shot.aspect === "square" && "aspect-square",
                  shot.span === "wide" && "col-span-2",
                  shot.span === "tall" && "row-span-2",
                )}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
                {shot.caption && (
                  <figcaption className="absolute left-4 bottom-4 font-mono text-[10px] tracking-[0.25em] uppercase text-white mix-blend-difference opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {shot.caption}
                  </figcaption>
                )}
              </motion.figure>
            ))}
          </div>
        )}

        <section className="max-w-4xl mx-auto px-6 mt-32 text-center">
          <div className="inline-flex flex-wrap justify-center gap-x-10 gap-y-3 font-mono text-[11px] tracking-[0.3em] uppercase text-white/50">
            <span>Photo · {credits.photographer}</span>
            <span>Styling · {credits.stylist}</span>
            <span>Cast · {credits.models}</span>
          </div>
          <div className="mt-14">
            <BarButton href="/shop" label="Shop the looks" />
          </div>
        </section>
      </main>
      <Footer invert />
    </div>
  );
}
