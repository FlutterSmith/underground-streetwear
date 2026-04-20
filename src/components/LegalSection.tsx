import type { ReactNode } from "react";

type LegalSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function LegalSection({ title, defaultOpen = false, children }: LegalSectionProps) {
  return (
    <details open={defaultOpen} className="group border-b border-black/15 py-5 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex items-center justify-between cursor-pointer list-none font-mono text-[13px] tracking-[0.2em] uppercase select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-light)]">
        <span>{title}</span>
        <span
          aria-hidden
          className="font-mono text-lg leading-none transition-transform duration-300 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}
