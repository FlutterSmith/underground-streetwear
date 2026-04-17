import { BarButton } from "@/components/BarButton";
import { Nav } from "@/components/Nav";
import { siteConfig } from "@/config/site.config";

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center gap-10 px-6 pb-20">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/50">&mdash; contact &mdash;</p>
        <h1 className="text-4xl sm:text-6xl font-medium max-w-2xl text-center leading-tight">
          press, stockists, and the brave.
        </h1>
        <a
          href="mailto:hello@underground.label"
          className="font-mono text-sm tracking-[0.2em] underline decoration-1 underline-offset-4 hover:opacity-70 transition-opacity"
        >
          hello@underground.label
        </a>
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <BarButton href="/shop" label="Go to shop" />
          <BarButton href={siteConfig.socials[1].href} label="Follow on IG" />
        </div>
      </main>
    </>
  );
}
