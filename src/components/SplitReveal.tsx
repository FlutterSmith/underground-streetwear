"use client";

import { motion, useReducedMotion } from "framer-motion";

type SplitRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "p";
};

export function SplitReveal({
  text,
  className,
  delay = 0,
  stagger = 0.05,
  as = "h1",
}: SplitRevealProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const MotionTag = as === "h1" ? motion.h1 : as === "h2" ? motion.h2 : motion.p;

  if (reduced) {
    return <MotionTag className={className}>{text}</MotionTag>;
  }

  return (
    <MotionTag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-top pr-[0.25em]"
          aria-hidden
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 0.8,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
