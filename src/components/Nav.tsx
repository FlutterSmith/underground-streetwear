"use client";

import Link from "next/link";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useCurrency, type Currency } from "@/lib/currency";

const links = [
  { label: "Home", href: "/home" },
  { label: "Catalog", href: "/shop" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Contact", href: "/contact" },
];

const CURRENCIES: Currency[] = ["EGP", "USD", "EUR"];

type NavProps = { invert?: boolean };

export function Nav({ invert = false }: NavProps) {
  const { count, openCart } = useCart();
  const { count: wishCount } = useWishlist();
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const color = invert ? "text-white" : "text-black";
  const badgeBg = invert ? "bg-white text-black" : "bg-black text-white";
  const surface = invert ? "bg-[var(--color-bg-dark)]" : "bg-[var(--color-bg-light)]";
  const border = invert ? "border-white/15" : "border-black/15";

  return (
    <>
      <header
        className={clsx(
          "w-full grid grid-cols-[auto_1fr_auto] md:grid-cols-3 items-center px-6 sm:px-10 py-6 font-mono text-xs tracking-[0.2em] uppercase",
          color,
        )}
      >
        <Link href="/" className="justify-self-start hover:opacity-70 transition-opacity">
          {siteConfig.brandName}
        </Link>

        <nav className="hidden md:flex justify-self-center items-center gap-5 sm:gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:opacity-70 transition-opacity">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex justify-self-end items-center gap-5">
          <div className="flex items-center gap-1 text-[10px]">
            {CURRENCIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={clsx(
                  "transition-opacity",
                  currency === c ? "opacity-100" : "opacity-40 hover:opacity-70",
                )}
                aria-pressed={currency === c}
              >
                {c}
              </button>
            ))}
          </div>
          <Link
            href="/wishlist"
            className="relative inline-flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <span>Saved</span>
            <span
              className={clsx(
                "inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-[10px] rounded-full tabular-nums",
                badgeBg,
              )}
            >
              {wishCount}
            </span>
          </Link>
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

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="md:hidden justify-self-end inline-flex items-center justify-center w-10 h-10 -mr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            {open ? (
              <>
                <line x1="3" y1="3" x2="17" y2="11" />
                <line x1="17" y1="3" x2="3" y2="11" />
              </>
            ) : (
              <>
                <line x1="0" y1="2" x2="20" y2="2" />
                <line x1="0" y1="7" x2="20" y2="7" />
                <line x1="0" y1="12" x2="20" y2="12" />
              </>
            )}
          </svg>
        </button>
      </header>

      {open && (
        <div
          className={clsx(
            "md:hidden fixed inset-x-0 top-[4.5rem] z-40 border-t",
            surface,
            border,
            color,
          )}
        >
          <nav className="flex flex-col px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={clsx("py-3 font-mono text-sm tracking-[0.25em] uppercase border-b", border)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/wishlist"
              className={clsx("py-3 font-mono text-sm tracking-[0.25em] uppercase border-b flex items-center justify-between", border)}
            >
              <span>Wishlist</span>
              <span className={clsx("inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1 text-[10px] rounded-full", badgeBg)}>
                {wishCount}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openCart();
              }}
              className={clsx("py-3 font-mono text-sm tracking-[0.25em] uppercase border-b flex items-center justify-between text-left", border)}
            >
              <span>Cart</span>
              <span className={clsx("inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1 text-[10px] rounded-full", badgeBg)}>
                {count}
              </span>
            </button>
            <div className="py-4 flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-60">
                Currency
              </span>
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={clsx(
                    "font-mono text-[11px] tracking-[0.25em]",
                    currency === c ? "opacity-100" : "opacity-40",
                  )}
                  aria-pressed={currency === c}
                >
                  {c}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
