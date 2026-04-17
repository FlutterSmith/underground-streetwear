import fs from "node:fs";
import path from "node:path";
import clsx from "clsx";
import { siteConfig } from "@/config/site.config";

const svgMarkup = fs.readFileSync(
  path.join(process.cwd(), "public", siteConfig.logoSvgPath.replace(/^\//, "")),
  "utf8",
);

const innerSvg = svgMarkup
  .replace(/<\?xml[^?]*\?>/i, "")
  .replace(/<!DOCTYPE[^>]*>/i, "")
  .replace(/^\s*<svg[^>]*>/i, "")
  .replace(/<\/svg>\s*$/i, "")
  .trim();

const viewBoxMatch = svgMarkup.match(/viewBox="([^"]+)"/i);
const viewBox = viewBoxMatch?.[1] ?? "0 0 600 180";

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
