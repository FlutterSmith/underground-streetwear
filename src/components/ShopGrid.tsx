"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ProductTile } from "@/components/ProductTile";
import { RecentlyViewedStrip } from "@/components/RecentlyViewedStrip";
import type { Product, ProductCategory } from "@/lib/products";

type Filter = "all" | ProductCategory;
type Sort = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "hoodie", label: "Hoodies" },
  { key: "tee", label: "Tees" },
  { key: "pants", label: "Pants" },
  { key: "shorts", label: "Shorts" },
  { key: "mask", label: "Masks" },
  { key: "other", label: "Signature" },
];

const SORTS: { key: Sort; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "rating", label: "Top rated" },
];

function avg(p: Product): number {
  if (!p.reviews || p.reviews.length === 0) return 0;
  return p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length;
}

function ts(p: Product): number {
  if (!p.releasedAt) return 0;
  const t = new Date(p.releasedAt).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export function ShopGrid({
  regular,
  signatures,
}: {
  regular: Product[];
  signatures: Product[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [hideSoldOut, setHideSoldOut] = useState(false);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    if (filter === "all") return;
    if (!regular.some((p) => p.category === filter)) setFilter("all");
  }, [filter, regular]);

  const hasSoldOut = useMemo(() => regular.some((p) => p.soldOut), [regular]);

  useEffect(() => {
    if (hideSoldOut && !hasSoldOut) setHideSoldOut(false);
  }, [hideSoldOut, hasSoldOut]);

  const filtered = useMemo(() => {
    const tokens = deferredQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const filterLabel = (cat: string) => FILTERS.find((f) => f.key === cat)?.label ?? cat;
    const list = regular.filter((p) => {
      const matchFilter = filter === "all" || p.category === filter;
      const haystack = `${p.name} ${p.description ?? ""} ${p.category} ${filterLabel(p.category)} ${(p.sizes ?? []).join(" ")}`.toLowerCase();
      const matchQuery = tokens.length === 0 || tokens.every((t) => haystack.includes(t));
      const matchStock = !hideSoldOut || !p.soldOut;
      return matchFilter && matchQuery && matchStock;
    });
    const tsCache = sort === "newest" ? new Map(list.map((p) => [p.id, ts(p)])) : null;
    const avgCache = sort === "rating" ? new Map(list.map((p) => [p.id, avg(p)])) : null;
    list.sort((a, b) => {
      switch (sort) {
        case "newest":
          return (tsCache!.get(b.id) ?? 0) - (tsCache!.get(a.id) ?? 0);
        case "price-asc":
          return a.priceEGP - b.priceEGP;
        case "price-desc":
          return b.priceEGP - a.priceEGP;
        case "rating":
          return (avgCache!.get(b.id) ?? 0) - (avgCache!.get(a.id) ?? 0);
        default: {
          const sigDiff = Number(!!b.signature) - Number(!!a.signature);
          if (sigDiff !== 0) return sigDiff;
          return Number(!!a.soldOut) - Number(!!b.soldOut);
        }
      }
    });
    return list;
  }, [regular, filter, deferredQuery, sort, hideSoldOut]);

  const showSignature = useMemo(
    () =>
      signatures.length > 0 && (filter === "all" || filter === "other") && query.trim().length === 0,
    [signatures, filter, query],
  );

  const activeChips: { key: string; label: string; onClear: () => void }[] = [];
  if (filter !== "all") {
    activeChips.push({
      key: "filter",
      label: FILTERS.find((f) => f.key === filter)?.label ?? filter,
      onClear: () => setFilter("all"),
    });
  }
  if (query.trim().length > 0) {
    activeChips.push({
      key: "query",
      label: `"${query.trim()}"`,
      onClear: () => setQuery(""),
    });
  }
  if (hideSoldOut) {
    activeChips.push({
      key: "stock",
      label: "In stock only",
      onClear: () => setHideSoldOut(false),
    });
  }

  function clearAll() {
    setFilter("all");
    setQuery("");
    setHideSoldOut(false);
    setSort("featured");
  }

  return (
    <>
      <div className="max-w-6xl mx-auto mb-8 flex flex-col gap-5">
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

        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="relative flex-1 max-w-sm">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the drop"
              aria-label="Search products"
              className="w-full bg-transparent border-b border-white/30 focus:border-white outline-none py-2 pr-7 font-mono text-sm text-white placeholder:text-white/40 transition-colors [&::-webkit-search-cancel-button]:hidden"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-current text-sm"
              >
                &times;
              </button>
            )}
          </div>

          {hasSoldOut && (
            <label className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-white/70 cursor-pointer">
              <input
                type="checkbox"
                checked={hideSoldOut}
                onChange={(e) => setHideSoldOut(e.target.checked)}
                className="accent-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              />
              In stock only
            </label>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <label className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/60">
              Sort
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="bg-transparent border border-white/30 text-white font-mono text-[11px] tracking-[0.15em] uppercase py-2 px-3 focus:outline-none focus:border-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key} className="text-black">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {activeChips.map((c) => (
              <span
                key={c.key}
                className="inline-flex items-center gap-2 h-7 px-3 bg-white/10 font-mono text-[10px] tracking-[0.2em] uppercase text-white"
              >
                {c.label}
                <button
                  type="button"
                  onClick={c.onClear}
                  className="opacity-60 hover:opacity-100"
                  aria-label={`Clear ${c.label}`}
                >
                  &times;
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60 hover:text-white underline decoration-1 underline-offset-2"
            >
              Clear all
            </button>
          </div>
        )}

        <p
          role="status"
          aria-live="polite"
          className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/50"
        >
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </p>
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
                <ProductTile product={p} index={i} reduced={reduced} />
              </div>
            ))}
          </div>

          {showSignature && (
            <div className="mt-32 flex flex-col items-center gap-16">
              {signatures.map((sig, i) => (
                <div key={sig.id} className="flex flex-col items-center gap-5">
                  <ProductTile product={sig} index={filtered.length + i} reduced={reduced} />
                  {sig.caption && (
                    <p className="font-mono text-[11px] tracking-[0.35em] uppercase text-white/50">
                      &ldquo;{sig.caption}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-32">
        <RecentlyViewedStrip invert />
      </div>
    </>
  );
}
