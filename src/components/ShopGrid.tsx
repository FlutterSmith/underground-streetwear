"use client";

import { useMemo, useState } from "react";
import { ProductTile } from "@/components/ProductTile";
import type { Product, ProductCategory } from "@/lib/products";

type Filter = "all" | ProductCategory;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "hoodie", label: "Hoodies" },
  { key: "tee", label: "Tees" },
  { key: "pants", label: "Pants" },
  { key: "shorts", label: "Shorts" },
  { key: "mask", label: "Masks" },
  { key: "other", label: "Signature" },
];

export function ShopGrid({
  regular,
  signature,
}: {
  regular: Product[];
  signature?: Product;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return regular.filter((p) => {
      const matchFilter = filter === "all" || p.category === filter;
      const matchQuery =
        q.length === 0 ||
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [regular, filter, query]);

  const showSignature =
    signature && (filter === "all" || filter === "other") && query.trim().length === 0;

  return (
    <>
      <div className="max-w-6xl mx-auto mb-12 flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const active = f.key === filter;
            return (
              <button
                type="button"
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`h-9 px-4 border font-mono text-[11px] tracking-[0.2em] uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  active
                    ? "bg-white text-black border-white"
                    : "border-white/30 text-white/70 hover:border-white hover:text-white"
                }`}
                aria-pressed={active}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <div className="relative max-w-sm w-full">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the drop"
            aria-label="Search products"
            className="w-full bg-transparent border-b border-white/30 focus:border-white outline-none py-2 font-mono text-sm text-white placeholder:text-white/40 transition-colors"
          />
        </div>
      </div>

      {filtered.length === 0 && !showSignature ? (
        <div className="max-w-md mx-auto text-center py-20">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-white/50">
            &mdash; nothing matches &mdash;
          </p>
          <p className="text-white/60 mt-4 text-sm">
            Try a different filter or clear the search.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-8 max-w-6xl mx-auto">
            {filtered.map((p, i) => (
              <div key={p.id} className="flex justify-center">
                <ProductTile product={p} index={i} />
              </div>
            ))}
          </div>

          {showSignature && signature && (
            <div className="mt-32 flex flex-col items-center gap-5">
              <ProductTile product={signature} index={filtered.length} />
              {signature.caption && (
                <p className="font-mono text-[11px] tracking-[0.35em] uppercase text-white/50">
                  &ldquo;{signature.caption}&rdquo;
                </p>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
