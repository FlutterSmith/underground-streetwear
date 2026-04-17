import Image from "next/image";
import clsx from "clsx";
import { siteConfig } from "@/config/site.config";

type LogoProps = { className?: string };

export function Logo({ className }: LogoProps) {
  return (
    <Image
      src={siteConfig.logoSvgPath}
      alt={siteConfig.brandName}
      width={600}
      height={180}
      priority
      className={clsx("block w-full h-auto select-none", className)}
      draggable={false}
    />
  );
}
