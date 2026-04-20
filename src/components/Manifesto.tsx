"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const LINES = [
  "Built slow. Dropped rare.",
  "Garments for the hours no one is watching.",
  "Heavy fabric. Quiet labels.",
  "If it fits the algorithm it doesn't fit us.",
  "Wear it until it remembers you.",
];

export function Manifesto() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % LINES.length), 3600);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <section className="relative w-full min-h-[40vh] flex items-center justify-center overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span
          aria-hidden
          className="font-sans text-[22vw] leading-none tracking-tighter font-medium text-black/[0.035] select-none whitespace-nowrap"
        >
          MANIFESTO
        </span>
      </div>
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-black/60 mb-6">
          &mdash; {String(i + 1).padStart(2, "0")} / {String(LINES.length).padStart(2, "0")} &mdash;
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-5xl md:text-6xl leading-[1.1] tracking-tight font-medium"
          >
            {LINES[i]}
          </motion.p>
        </AnimatePresence>
        <div className="mt-10 flex items-center justify-center gap-1.5">
          {LINES.map((_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Show line ${n + 1}`}
              className={`h-[2px] transition-all duration-500 ${n === i ? "w-10 bg-black" : "w-4 bg-black/20 hover:bg-black/40"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
