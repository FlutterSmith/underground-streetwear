"use client";

import Link from "next/link";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
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
  const { count, hydrated: cartHydrated, openCart } = useCart();
  const { count: wishCount, hydrated: wishHydrated } = useWishlist();
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    const toggleBtn = toggleRef.current;
    document.body.style.overflow = "hidden";
    const first = menuRef.current?.querySelector<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    first?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      toggleBtn?.focus();
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
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "hover:opacity-70 transition-opacity",
                  active && "underline underline-offset-4 font-semibold",
                )}
              >
                {l.label}
              </Link>
            );
          })}
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
              {wishHydrated ? wishCount : "\u00A0"}
            </span>
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative inline-flex items-center gap-2 hover:opacity-70 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
            aria-label={cartHydrated ? `Open cart (${count} items)` : "Open cart"}
          >
            <span>Cart</span>
            <span
              className={clsx(
                "inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-[10px] rounded-full tabular-nums",
                badgeBg,
              )}
            >
              {cartHydrated ? count : "\u00A0"}
            </span>
          </button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
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
          id="mobile-nav-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          className={clsx(
            "md:hidden fixed inset-x-0 top-[4.5rem] z-40 border-t",
            surface,
            border,
            color,
          )}
        >
          <nav className="flex flex-col px-6 py-4">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "py-3 font-mono text-sm tracking-[0.25em] uppercase border-b transition-opacity active:opacity-60",
                    border,
                    active && "underline underline-offset-4 font-semibold",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/wishlist"
              className={clsx("py-3 font-mono text-sm tracking-[0.25em] uppercase border-b flex items-center justify-between transition-opacity active:opacity-60", border)}
            >
              <span>Wishlist</span>
              <span className={clsx("inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1 text-[10px] rounded-full", badgeBg)}>
                {wishHydrated ? wishCount : "\u00A0"}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openCart();
              }}
              className={clsx("py-3 font-mono text-sm tracking-[0.25em] uppercase border-b flex items-center justify-between text-left transition-opacity active:opacity-60", border)}
            >
              <span>Cart</span>
              <span className={clsx("inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1 text-[10px] rounded-full", badgeBg)}>
                {cartHydrated ? count : "\u00A0"}
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
