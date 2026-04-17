import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Cursor } from "@/components/Cursor";
import { PageTransition } from "@/components/PageTransition";
import { siteConfig } from "@/config/site.config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.brandName,
  description: siteConfig.taglines[0],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        <Cursor />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
