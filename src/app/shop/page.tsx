import { Nav } from "@/components/Nav";
import { ShopGrid } from "@/components/ShopGrid";
import { PageTheme } from "@/components/PageTheme";
import { Footer } from "@/components/Footer";
import { products } from "@/lib/products";

export default function ShopPage() {
  const regular = products.filter((p) => !p.signature);
  const signatures = products.filter((p) => p.signature);

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-dark)] text-white flex flex-col">
        <PageTheme mode="dark" />
        <Nav invert />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <h1 className="sr-only">Catalog</h1>
          <p
            role="status"
            className="font-mono text-xs tracking-[0.3em] uppercase text-white/70"
          >
            &mdash; no drops live yet &mdash;
          </p>
          <p className="text-sm text-white/50 max-w-xs">
            The next release is incoming. Join the list to hear first.
          </p>
        </div>
        <Footer invert />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] text-white flex flex-col">
      <PageTheme mode="dark" />
      <Nav invert />

      <main className="flex-1 px-6 sm:px-10 pb-24">
        <h1 className="sr-only">Catalog</h1>
        <p
          aria-hidden
          className="font-mono text-xs tracking-[0.3em] uppercase text-white/70 mt-6 mb-10 sm:mb-14 text-center"
        >
          &mdash; catalog &mdash;
        </p>

        <ShopGrid regular={regular} signatures={signatures} />
      </main>
      <Footer invert />
    </div>
  );
}
