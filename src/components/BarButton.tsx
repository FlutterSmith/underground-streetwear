"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import type { ReactNode } from "react";

type BarButtonProps = {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
};

export function BarButton({ label, href, onClick, className, fullWidth }: BarButtonProps) {
  const reduced = useReducedMotion();

  const fillTransition = reduced
    ? { duration: 0 }
    : { duration: 0.5, ease: [0.65, 0, 0.35, 1] as const };
  const labelTransition = reduced
    ? { duration: 0 }
    : { duration: 0.3, delay: 0.1 };

  const inner = (
    <motion.span
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap="hover"
      animate="rest"
      className={clsx(
        "relative inline-flex items-center justify-center h-12 border border-black overflow-hidden font-mono text-sm tracking-[0.2em] uppercase select-none align-middle",
        fullWidth ? "w-full" : "w-[320px]",
        className,
      )}
    >
      <motion.span
        aria-hidden
        variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
        transition={fillTransition}
        style={{ transformOrigin: "left", willChange: "transform" }}
        className="absolute inset-0 bg-black"
      />
      <motion.span
        variants={{ rest: { color: "#000000" }, hover: { color: "#FFFFFF" } }}
        transition={labelTransition}
        className="relative z-10"
      >
        {label}
      </motion.span>
    </motion.span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={clsx("focus:outline-none focus-visible:ring-2 focus-visible:ring-current", fullWidth && "w-full block")}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx("focus:outline-none focus-visible:ring-2 focus-visible:ring-current", fullWidth && "w-full")}
    >
      {inner}
    </button>
  );
}
