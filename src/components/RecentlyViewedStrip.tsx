"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useRecentlyViewed } from "@/lib/recentlyViewed";
import { products } from "@/lib/products";
import { useCurrency } from "@/lib/currency";

type Props = {
  excludeId?: string;
  invert?: boolean;
};

export function RecentlyViewedStrip({ excludeId, invert = false }: Props) {
  const ids = useRecentlyViewed();
  const { format } = useCurrency();

  const items = ids
    .filter((id) => id !== excludeId)
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p))
    .slice(0, 6);

  if (items.length === 0) return null;

  const text = invert ? "text-white" : "text-black";
  const muted = invert ? "text-white/50" : "text-black/50";
  const bg = invert ? "bg-white/5" : "bg-black/5";

  return (
    <section className={clsx("max-w-6xl mx-auto px-6 sm:px-10", text)}>
      <p className={clsx("font-mono text-xs tracking-[0.3em] uppercase text-center mb-10", muted)}>
        &mdash; recently viewed &mdash;
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {items.map((p) => (
          <Link key={p.id} href={`/shop/${p.id}`} className="group flex flex-col gap-2">
            <div className={clsx("relative aspect-square overflow-hidden", bg)}>
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 768px) 45vw, 160px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase">
              <span>{p.name}</span>
              <span className={muted}>{format(p.priceEGP)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
