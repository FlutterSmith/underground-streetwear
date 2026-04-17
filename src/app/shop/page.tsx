import { Nav } from "@/components/Nav";
import { ProductTile } from "@/components/ProductTile";
import { products } from "@/lib/products";

export default function ShopPage() {
  const regular = products.filter((p) => !p.signature);
  const signature = products.find((p) => p.signature);

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-dark)] text-white flex items-center justify-center">
        <Nav invert />
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-white/60">
          DROP LOADING&hellip;
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] text-white">
      <Nav invert />

      <main className="px-6 sm:px-10 pb-24">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-white/40 mt-6 mb-10 sm:mb-16 text-center">
          &mdash; catalog &mdash;
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-8 max-w-6xl mx-auto">
          {regular.map((p, i) => (
            <div key={p.id} className="flex justify-center">
              <ProductTile product={p} index={i} />
            </div>
          ))}
        </div>

        {signature && (
          <div className="mt-32 flex flex-col items-center gap-5">
            <ProductTile product={signature} index={regular.length} />
            {signature.caption && (
              <p className="font-mono text-[11px] tracking-[0.35em] uppercase text-white/50">
                &ldquo;{signature.caption}&rdquo;
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
