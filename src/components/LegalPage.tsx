import type { ReactNode } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
};

export function LegalPage({ eyebrow, title, updated, children }: LegalPageProps) {
  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 pb-24">
        <header className="text-center mt-6 mb-16">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-black/60 mb-4">
            &mdash; {eyebrow} &mdash;
          </p>
          <h1 className="text-4xl sm:text-5xl font-medium leading-tight">{title}</h1>
          <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-black/40 mt-4">
            Last updated {updated}
          </p>
        </header>
        <article className="prose-underground">{children}</article>
      </main>
      <Footer />
    </>
  );
}
