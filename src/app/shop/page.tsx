import { Nav } from "@/components/Nav";
import { ShopGrid } from "@/components/ShopGrid";
import { PageTheme } from "@/components/PageTheme";
import { Footer } from "@/components/Footer";
import { products } from "@/lib/products";

export default function ShopPage() {
  const regular = products.filter((p) => !p.signature);
  const signature = products.find((p) => p.signature);

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-dark)] text-white flex flex-col">
        <PageTheme mode="dark" />
        <Nav invert />
        <div className="flex-1 flex items-center justify-center">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-white/70">
            DROP LOADING&hellip;
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
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-white/70 mt-6 mb-10 sm:mb-14 text-center">
          &mdash; catalog &mdash;
        </p>

        <ShopGrid regular={regular} signature={signature} />
      </main>
      <Footer invert />
    </div>
  );
}
