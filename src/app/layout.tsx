import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Cursor } from "@/components/Cursor";
import { GlobalErrorListener } from "@/components/GlobalErrorListener";
import { PageTransition } from "@/components/PageTransition";
import { CartDrawer } from "@/components/CartDrawer";
import { Grain } from "@/components/Grain";
import { ScrollProgress } from "@/components/ScrollProgress";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { CurrencyProvider } from "@/lib/currency";
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
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      </head>
      <body>
        <CurrencyProvider>
          <WishlistProvider>
            <CartProvider>
              <GlobalErrorListener />
              <Cursor />
              <ScrollProgress />
              <PageTransition>{children}</PageTransition>
              <CartDrawer />
              <Grain />
            </CartProvider>
          </WishlistProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
