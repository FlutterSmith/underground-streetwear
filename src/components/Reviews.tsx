"use client";

import { useState } from "react";
import { Stars } from "@/components/Stars";
import type { Review } from "@/lib/products";

type ReviewsProps = {
  reviews: Review[];
  invert?: boolean;
};

function dist(reviews: Review[]) {
  const out = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  return out;
}

export function Reviews({ reviews, invert = false }: ReviewsProps) {
  const [filter, setFilter] = useState<number | null>(null);
  const visible = filter ? reviews.filter((r) => r.rating === filter) : reviews;
  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  if (reviews.length === 0) {
    return (
      <div className={invert ? "text-white/60" : "text-black/60"}>
        <p className="text-sm">No reviews yet. Be the first.</p>
      </div>
    );
  }

  const text = invert ? "text-white" : "text-black";
  const muted = invert ? "text-white/60" : "text-black/60";
  const border = invert ? "border-white/15" : "border-black/15";

  return (
    <section className={`flex flex-col gap-8 ${text}`}>
      <header className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-start">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-5xl tabular-nums">{avg.toFixed(1)}</span>
          <Stars value={avg} size="md" invert={invert} />
          <span className={`font-mono text-[11px] tracking-[0.2em] uppercase ${muted}`}>
            {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {dist(reviews).map(({ star, count }) => {
            const pct = reviews.length === 0 ? 0 : (count / reviews.length) * 100;
            const active = filter === star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setFilter(active ? null : star)}
                className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
                aria-pressed={active}
              >
                <span className={`font-mono text-xs ${muted} group-hover:${text}`}>
                  {star}
                </span>
                <span className={`flex-1 h-1 ${invert ? "bg-white/15" : "bg-black/10"} relative`}>
                  <span
                    className={`absolute inset-y-0 left-0 ${active ? (invert ? "bg-white" : "bg-black") : invert ? "bg-white/50" : "bg-black/40"}`}
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className={`font-mono text-[10px] tabular-nums w-6 text-right ${muted}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      <ul className={`divide-y ${border}`}>
        {visible.map((r, i) => (
          <li key={`${r.author}-${i}`} className="py-6 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex flex-col gap-1">
                <Stars value={r.rating} invert={invert} />
                <h4 className="font-medium text-base">{r.title}</h4>
              </div>
              <span className={`font-mono text-[10px] tracking-[0.2em] uppercase ${muted}`}>
                {r.date}
                {r.verified && <span className="ml-3">verified</span>}
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${muted}`}>{r.body}</p>
            <span className={`font-mono text-[10px] tracking-[0.2em] uppercase ${muted}`}>
              &mdash; {r.author}
            </span>
          </li>
        ))}
      </ul>

      {filter !== null && (
        <button
          type="button"
          onClick={() => setFilter(null)}
          className={`self-start font-mono text-[11px] tracking-[0.25em] uppercase ${muted} hover:${text}`}
        >
          Show all reviews
        </button>
      )}
    </section>
  );
}
