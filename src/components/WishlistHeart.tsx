"use client";

import clsx from "clsx";
import { useWishlist } from "@/lib/wishlist";

type Props = {
  productId: string;
  invert?: boolean;
  size?: "sm" | "md";
};

export function WishlistHeart({ productId, invert = false, size = "sm" }: Props) {
  const { has, toggle } = useWishlist();
  const active = has(productId);
  const dim = size === "sm" ? 16 : 20;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={clsx(
        "inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-current",
        invert
          ? "bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm"
          : "bg-white/70 text-black hover:bg-white backdrop-blur-sm",
      )}
    >
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
