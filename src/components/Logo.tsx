import fs from "node:fs";
import path from "node:path";
import clsx from "clsx";
import { siteConfig } from "@/config/site.config";

const FALLBACK_VIEWBOX = "0 0 600 180";
const FALLBACK_INNER = `<text x="50%" y="55%" text-anchor="middle" font-family="monospace" font-size="48" fill="currentColor">${siteConfig.brandName}</text>`;

let svgMarkup = "";
try {
  svgMarkup = fs.readFileSync(
    path.join(process.cwd(), "public", siteConfig.logoSvgPath.replace(/^\//, "")),
    "utf8",
  );
} catch (err) {
  console.warn(
    `[Logo] Failed to read logo SVG at "${siteConfig.logoSvgPath}" — falling back to text wordmark.`,
    err,
  );
}

const innerSvg = svgMarkup
  ? svgMarkup
      .replace(/<\?xml[^?]*\?>/i, "")
      .replace(/<!DOCTYPE[^>]*>/i, "")
      .replace(/^\s*<svg[^>]*>/i, "")
      .replace(/<\/svg>\s*$/i, "")
      .trim()
  : FALLBACK_INNER;

const viewBoxMatch = svgMarkup.match(/viewBox="([^"]+)"/i);
const viewBox = viewBoxMatch?.[1] ?? FALLBACK_VIEWBOX;

type LogoProps = { className?: string };

export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={siteConfig.brandName}
      className={clsx("block w-full h-auto select-none", className)}
      dangerouslySetInnerHTML={{ __html: innerSvg }}
    />
  );
}
