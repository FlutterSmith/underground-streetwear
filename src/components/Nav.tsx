import Link from "next/link";
import { siteConfig } from "@/config/site.config";

const links = [
  { label: "Home", href: "/home" },
  { label: "Catalog", href: "/shop" },
  { label: "Contact", href: "/contact" },
];

type NavProps = { invert?: boolean };

export function Nav({ invert = false }: NavProps) {
  const color = invert ? "text-white" : "text-black";

  return (
    <header className={`w-full flex items-center justify-between px-6 sm:px-10 py-6 font-mono text-xs tracking-[0.2em] uppercase ${color}`}>
      <Link href="/" className="hover:opacity-70 transition-opacity">
        {siteConfig.brandName}
      </Link>
      <nav className="flex items-center gap-5 sm:gap-8">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:opacity-70 transition-opacity">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
