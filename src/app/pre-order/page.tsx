import { BarButton } from "@/components/BarButton";
import { Nav } from "@/components/Nav";

export default function PreOrderPage() {
  return (
    <>
      <Nav />
      <main className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center gap-10 px-6 pb-20">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/50">&mdash; pre-order &mdash;</p>
        <h1 className="text-4xl sm:text-6xl font-medium max-w-2xl text-center leading-tight">
          next drop opens soon.
        </h1>
        <p className="max-w-md text-center text-black/60">
          Pre-orders are limited and fulfilled in the order received. No restocks.
        </p>
        <BarButton href="/shop" label="See catalog" />
      </main>
    </>
  );
}
