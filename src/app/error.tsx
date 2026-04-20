"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center bg-[var(--color-bg-light)] text-[var(--color-ink)]">
      <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/60">
        &mdash; something broke &mdash;
      </p>
      <h1 className="text-3xl sm:text-5xl font-medium leading-tight max-w-xl">
        the thread snapped.
      </h1>
      <p className="max-w-md text-black/60">
        An unexpected error kept this page from loading. Try again, or head back
        to the shop.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        <button
          type="button"
          onClick={reset}
          className="h-12 px-8 bg-black text-white font-mono text-[11px] tracking-[0.3em] uppercase"
        >
          Try again
        </button>
        <Link
          href="/shop"
          className="h-12 px-8 border border-black/30 text-black font-mono text-[11px] tracking-[0.3em] uppercase flex items-center"
        >
          Back to shop
        </Link>
      </div>
    </main>
  );
}
