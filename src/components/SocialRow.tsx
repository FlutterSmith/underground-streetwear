import { siteConfig, type SocialIcon } from "@/config/site.config";
import clsx from "clsx";

const icons: Record<SocialIcon, React.ReactNode> = {
  fb: (
    <path d="M13.5 8.5H16V5.5h-2.5C11.6 5.5 10 7.1 10 9v2H8v3h2v5.5h3V14h2.4l.6-3H13V9c0-.3.2-.5.5-.5z" />
  ),
  ig: (
    <>
      <path d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm0 2a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H7zm10 1.5a1 1 0 11-1 1 1 1 0 011-1zM12 7.5a4.5 4.5 0 11-4.5 4.5A4.5 4.5 0 0112 7.5zm0 2A2.5 2.5 0 1014.5 12 2.5 2.5 0 0012 9.5z" />
    </>
  ),
  yt: (
    <path d="M21.6 7.2s-.2-1.4-.8-2a2.9 2.9 0 00-2-.9C15.8 4 12 4 12 4s-3.8 0-6.8.3a2.9 2.9 0 00-2 .9c-.6.6-.8 2-.8 2S2 8.8 2 10.4v1.2c0 1.6.2 3.2.2 3.2s.2 1.4.8 2a3.4 3.4 0 002.2.9c1.6.2 6.8.3 6.8.3s3.8 0 6.8-.3a2.9 2.9 0 002-.9c.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.2c0-1.6-.2-3.2-.2-3.2zM10 14.5v-5l4.5 2.5z" />
  ),
  tt: (
    <path d="M14 3h2.5c.2 1.5 1 2.7 2.5 3.1v2.6a6.5 6.5 0 01-3.5-1.1v6a5 5 0 11-5-5v2.6a2.4 2.4 0 102.5 2.4V3z" />
  ),
  x: (
    <path d="M18.5 3h2.8l-6.1 7 7.2 10h-5.6l-4.4-6.2L7.3 20H4.5l6.6-7.5L4.2 3h5.7l4 5.6zm-1 15h1.5L7.3 5h-1.6z" />
  ),
};

type SocialRowProps = { invert?: boolean; className?: string };

export function SocialRow({ invert = false, className }: SocialRowProps) {
  const fill = invert ? "#FFFFFF" : "#000000";
  return (
    <ul className={clsx("flex items-center gap-6", className)}>
      {siteConfig.socials.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="inline-flex items-center justify-center transition-transform duration-200 ease-out hover:scale-[1.15] focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={fill}
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              {icons[s.icon]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
