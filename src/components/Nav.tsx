"use client";

import Link from "next/link";
import clsx from "clsx";
import { siteConfig } from "@/config/site.config";
import { useCart } from "@/lib/cart";

const links = [
  { label: "Home", href: "/home" },
  { label: "Catalog", href: "/shop" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Contact", href: "/contact" },
];

type NavProps = { invert?: boolean };

export function Nav({ invert = false }: NavProps) {
  const { count, openCart } = useCart();
  const color = invert ? "text-white" : "text-black";
  const badgeBg = invert ? "bg-white text-black" : "bg-black text-white";

  return (
    <header
      className={clsx(
        "w-full grid grid-cols-3 items-center px-6 sm:px-10 py-6 font-mono text-xs tracking-[0.2em] uppercase",
        color,
      )}
    >
      <Link href="/" className="justify-self-start hover:opacity-70 transition-opacity">
        {siteConfig.brandName}
      </Link>
      <nav className="justify-self-center flex items-center gap-5 sm:gap-8">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:opacity-70 transition-opacity">
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="justify-self-end">
        <button
          type="button"
          onClick={openCart}
          className="relative inline-flex items-center gap-2 hover:opacity-70 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
          aria-label={`Open cart (${count} items)`}
        >
          <span>Cart</span>
          <span
            className={clsx(
              "inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-[10px] rounded-full tabular-nums",
              badgeBg,
            )}
          >
            {count}
          </span>
        </button>
      </div>
    </header>
  );
}
