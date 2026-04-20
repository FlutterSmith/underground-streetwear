"use client";

import clsx from "clsx";
import { useReducedMotion } from "framer-motion";

type MarqueeProps = {
  items: string[];
  invert?: boolean;
  speed?: number;
  className?: string;
};

export function Marquee({ items, invert = false, speed = 40, className }: MarqueeProps) {
  const reduced = useReducedMotion();
  const loop = [...items, ...items, ...items, ...items];

  return (
    <div
      className={clsx(
        "relative overflow-hidden border-y select-none",
        invert ? "border-white/15 text-white" : "border-black/15 text-black",
        className,
      )}
      aria-hidden
    >
      <div
        className={clsx(
          "flex whitespace-nowrap py-5 font-mono text-xs tracking-[0.35em] uppercase",
          !reduced && "marquee-track",
        )}
        style={!reduced ? { animationDuration: `${speed}s` } : undefined}
      >
        {loop.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-10 pr-10">
            <span>{item}</span>
            <span className={clsx("text-lg leading-none", invert ? "text-white/40" : "text-black/40")}>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
