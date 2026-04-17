import { siteConfig } from "@/config/site.config";
import clsx from "clsx";

type LogoProps = { className?: string };

export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 600 180"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("block w-full h-auto", className)}
      role="img"
      aria-label={siteConfig.brandName}
    >
      <g fill="#000">
        <path d="M20 140 L40 40 L60 40 L72 110 L84 40 L104 40 L120 140 L100 140 L92 80 L82 140 L68 140 L58 80 L50 140 Z" />
        <path d="M130 40 L195 40 L195 60 L152 60 L152 78 L188 78 L188 96 L152 96 L152 120 L198 120 L198 140 L130 140 Z" />
        <path d="M210 40 L232 40 L252 92 L252 40 L272 40 L272 140 L250 140 L228 86 L228 140 L210 140 Z" />
        <path d="M285 40 L308 40 L320 80 L332 40 L355 40 L333 100 L340 140 L318 140 L312 108 L306 140 L284 140 L291 100 Z" />
        <path d="M365 40 L390 40 L400 96 L412 40 L436 40 L420 140 L395 140 L380 110 L378 140 L365 140 Z" />
        <path d="M448 40 L480 40 Q510 40 510 70 Q510 96 485 100 L505 140 L482 140 L466 104 L466 140 L448 140 Z M466 58 L466 88 L480 88 Q490 88 490 73 Q490 58 480 58 Z" />
        <path d="M524 40 L580 40 L580 60 L544 60 L544 78 L572 78 L572 96 L544 96 L544 140 L524 140 Z" />
      </g>
      <g fill="#000" opacity="0.9">
        <rect x="18" y="148" width="18" height="4" transform="rotate(-3 27 150)" />
        <rect x="160" y="152" width="40" height="3" transform="rotate(2 180 153)" />
        <rect x="440" y="150" width="80" height="4" transform="rotate(-1 480 152)" />
        <circle cx="590" cy="46" r="3" />
        <circle cx="12" cy="38" r="3" />
      </g>
    </svg>
  );
}
