import { BarButton } from "@/components/BarButton";
import { Logo } from "@/components/Logo";
import { SocialRow } from "@/components/SocialRow";
import { Timestamp } from "@/components/Timestamp";

const entryLinks: { label: string; href: string }[] = [
  { label: "SHOP", href: "/shop" },
  { label: "CONTACT", href: "/contact" },
  { label: "LOOKBOOK", href: "/lookbook" },
  { label: "PRE-ORDER", href: "/pre-order" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-between px-4 sm:px-8 py-8 bg-[var(--color-bg-light)]">
      <Timestamp />

      <div className="flex flex-col items-center gap-10 sm:gap-14 flex-1 justify-center w-full">
        <div className="w-[70vw] max-w-[420px]">
          <Logo />
        </div>

        <div className="flex flex-col items-center gap-3 w-full sm:w-auto px-4 sm:px-0">
          {entryLinks.map((l) => (
            <BarButton
              key={l.href}
              href={l.href}
              label={l.label}
              fullWidth
              className="sm:!w-[320px]"
            />
          ))}
        </div>
      </div>

      <SocialRow className="mt-10" />
    </main>
  );
}
