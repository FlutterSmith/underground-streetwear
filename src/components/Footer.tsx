"use client";

import Link from "next/link";
import clsx from "clsx";
import { siteConfig } from "@/config/site.config";

type FooterProps = { invert?: boolean };

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Catalog", href: "/shop" },
      { label: "Lookbook", href: "/lookbook" },
      { label: "Pre-order", href: "/pre-order" },
      { label: "Cart", href: "/cart" },
    ],
  },
  {
    title: "Info",
    links: [
      { label: "About", href: "/home" },
      { label: "Contact", href: "/contact" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer({ invert = false }: FooterProps) {
  const year = new Date().getFullYear();
  const border = invert ? "border-white/15" : "border-black/15";
  const text = invert ? "text-white" : "text-black";
  const muted = invert ? "text-white/50" : "text-black/50";
  const mutedHover = invert ? "hover:text-white" : "hover:text-black";

  return (
    <footer className={clsx("w-full border-t", border, text)}>
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-14">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-8">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3 max-w-xs">
            <Link
              href="/"
              className="font-mono text-sm tracking-[0.3em] uppercase hover:opacity-70 transition-opacity"
            >
              {siteConfig.brandName}
            </Link>
            <p className={clsx("text-sm leading-relaxed", muted)}>
              {siteConfig.taglines[1]} Built slow. Dropped rare.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              {siteConfig.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    "font-mono text-[11px] tracking-[0.2em] uppercase transition-colors",
                    muted,
                    mutedHover,
                  )}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <p
                className={clsx(
                  "font-mono text-[10px] tracking-[0.3em] uppercase",
                  muted,
                )}
              >
                {col.title}
              </p>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={clsx(
                        "font-mono text-xs tracking-[0.15em] uppercase transition-colors",
                        mutedHover,
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className={clsx(
            "mt-14 pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[10px] font-mono tracking-[0.25em] uppercase",
            border,
            muted,
          )}
        >
          <span>
            &copy; {year} {siteConfig.brandName} &mdash; all rights reserved
          </span>
          <span>Built in Egypt. Shipped worldwide.</span>
        </div>
      </div>
    </footer>
  );
}
