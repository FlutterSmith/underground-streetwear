"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Nav } from "@/components/Nav";
import { siteConfig } from "@/config/site.config";

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

  const y = useTransform(scrollY, [0, 1000], [0, reduced || !parallaxEnabled ? 0 : -500]);

  return (
    <>
      <Nav />
      <main ref={ref} className="min-h-[200vh] px-6 sm:px-12 pt-8 pb-24 bg-[var(--color-bg-light)] text-[var(--color-ink)]">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start max-w-6xl mx-auto pt-8">
          <div className="flex flex-col gap-6 max-w-xl">
            <p className="font-sans text-3xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight font-medium">
              {siteConfig.taglines[0]}
            </p>
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-black/60">
              {siteConfig.taglines[1]}
            </p>
          </div>

          <motion.div style={{ y }} className="relative flex justify-center md:justify-end">
            <EyeIllustration />
          </motion.div>
        </section>

        <section className="mt-40 max-w-3xl mx-auto">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-black/70 mb-4">
            &mdash; about
          </p>
          <p className="text-xl md:text-2xl leading-relaxed">
            An underground label for people who think the mainstream got too clean.
            Small drops. Heavy fabrics. No press releases.
          </p>
        </section>
      </main>
    </>
  );
}

function EyeIllustration() {
  return (
    <svg
      viewBox="0 0 300 260"
      width="100%"
      className="max-w-[360px] sm:max-w-[440px]"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="hand-drawn eye with dripping lashes"
    >
      <g fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 120 C 90 50, 210 50, 270 120 C 210 190, 90 190, 30 120 Z" />
        <circle cx="150" cy="120" r="38" fill="#000" stroke="none" />
        <circle cx="140" cy="110" r="7" fill="#fff" stroke="none" />
        <path d="M60 90 L50 60" />
        <path d="M95 75 L90 40" />
        <path d="M150 70 L150 30" />
        <path d="M205 75 L210 40" />
        <path d="M240 90 L250 60" />
        <path d="M60 155 L55 185 Q 60 200 65 185 L65 160" fill="#000" stroke="none" />
        <path d="M100 165 L95 210 Q 100 225 105 210 L105 170" fill="#000" stroke="none" />
        <path d="M150 170 L145 230 Q 150 250 155 230 L155 175" fill="#000" stroke="none" />
        <path d="M200 165 L197 215 Q 202 228 207 215 L207 170" fill="#000" stroke="none" />
        <path d="M240 155 L238 190 Q 243 202 248 190 L248 160" fill="#000" stroke="none" />
      </g>
    </svg>
  );
}
