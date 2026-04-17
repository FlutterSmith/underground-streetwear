export type SocialIcon = "fb" | "ig" | "yt" | "tt" | "x";

export type SiteConfig = {
  brandName: string;
  logoSvgPath: string;
  taglines: [string, string];
  colors: { light: string; dark: string; accent: string };
  socials: { label: string; href: string; icon: SocialIcon }[];
};

export const siteConfig: SiteConfig = {
  brandName: "UNDERGROUND",
  logoSvgPath: "/logo.svg",
  taglines: [
    "We make things that work better and last longer.",
    "Underground by design.",
  ],
  colors: { light: "#F5F4F0", dark: "#0A0A0A", accent: "#000000" },
  socials: [
    { label: "Facebook", href: "https://facebook.com", icon: "fb" },
    { label: "Instagram", href: "https://instagram.com", icon: "ig" },
    { label: "YouTube", href: "https://youtube.com", icon: "yt" },
    { label: "TikTok", href: "https://tiktok.com", icon: "tt" },
    { label: "X", href: "https://x.com", icon: "x" },
  ],
};
