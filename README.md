<div align="center">

# UNDERGROUND

### A streetwear brand site that does not feel like a template.

Built for small labels that want a real shop without the Shopify tax. Cart, product pages, checkout, lookbook, reviews, wishlist, currency switcher, mobile menu, the lot. No backend. Drop in your endpoints and ship.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Motion-11-ff0080?style=flat-square)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/license-commercial-lightgrey?style=flat-square)](#license)

[Quick start](#quick-start) &middot; [Features](#features) &middot; [Customize](#customize) &middot; [Backend hooks](#backend-hooks) &middot; [Deploy](#deploy) &middot; [Roadmap](#roadmap)

</div>

---

## Why this template

Most "premium" e-commerce templates look like every other premium e-commerce template. They have a hero slider, three pricing tiers, a testimonial carousel, and a checkout that runs on jQuery from 2017.

This one does not. It is built for streetwear labels that drop small batches and want the site to feel like a brand, not a marketplace. Heavy whitespace. One signature interaction repeated until you remember it. A near-black catalog where the products float at deliberately wrong angles. A live clock on the landing page because why not.

Underneath: every shopping primitive a real customer expects. Cart, wishlist, currency switching, stock urgency, reviews, free-shipping progress, order tracking, mobile menu. Wired up with state, persistence, and clean type definitions.

## Features

### Storefront

| Surface | What it does |
| --- | --- |
| Landing `/` | Logo + four pillar buttons + live timestamp. Zero distractions. |
| Home `/home` | Hero photo (parallaxed), tagline, three featured products, recently viewed, newsletter capture. |
| Shop `/shop` | Catalog with seeded random rotation per piece. Category tabs, search, in-stock filter, sort dropdown, active-filter chips, count. |
| Product `/shop/[id]` | Multi-image gallery + thumbnails, multi-image hover swap on tiles, size + qty + ADD TO CART, wishlist heart, low-stock urgency, full reviews section with rating distribution, related pieces, recently viewed. |
| Cart `/cart` | Full cart page with line items, qty, remove, sticky summary, free-shipping progress bar. |
| Cart drawer | Slide-in from right anywhere on the site. Free-shipping progress, line items, checkout CTA. |
| Wishlist `/wishlist` | Saved pieces with one-click add to cart. |
| Checkout `/checkout` | 4-section form (contact, address, shipping method, payment), saved-address autofill, mock order confirmation with generated number. |
| Pre-order `/pre-order` | Reserve form with name, email, phone, piece, size, notes. |
| Lookbook `/lookbook` | Editorial grid, varied aspect ratios, photo credits. |
| Order tracking `/orders` | Email + order number lookup with mock 5-stage status timeline. |
| Contact `/contact` | Form with topic chips and validation. |
| Legal `/shipping`, `/returns`, `/privacy`, `/terms` | Real-feel policy pages, ready to edit. |

### Storefront systems

- **Cart** with localStorage persistence, line-id keyed by product+size, qty controls.
- **Wishlist** with localStorage persistence, heart icons everywhere a product appears.
- **Currency switcher** (EGP / USD / EUR) with rates plugged in one place. Every price across the site updates live.
- **Recently viewed** tracker that surfaces on `/shop`, `/home`, and product pages.
- **Reviews** with rating distribution bars, filter-by-stars, verified-buyer flag.
- **Free-shipping progress bar** in the cart drawer and on `/cart`.
- **Stock urgency** badges ("Only 2 left") on tiles and product pages.
- **Sold-out + waitlist** capture on individual products.
- **Mobile drawer menu** with cart + wishlist + currency switcher.

### Brand interaction details

- The **signature `<BarButton>`** fill animation reused across every CTA in the site.
- **Custom cursor** (white dot, scales on interactive hover, hides on touch).
- **Page transitions** via `AnimatePresence` with synchronised fade + translate.
- **Live timestamp** on the landing page, rendered client-side to avoid hydration drift.
- **Seeded random rotation** on shop tiles so server and client produce the same angle (no hydration warnings).
- **Reduced-motion** respected across every animation: snap, no parallax, fade-only transitions.
- **Per-route theme** (`html[data-theme="dark"]`) so dark pages do not flash white during scroll bounce or page transition.
- **Image skeletons** with shimmer while CDN photos load.

### Developer experience

- TypeScript strict, every component typed.
- Zero state libraries (`useState` + `Context` only). Read the data flow in 10 minutes.
- Zero UI library. Every component is two screens of code, no `node_modules` archaeology.
- Content lives in JSON. Edit a product in `products.json`, redeploy, done. No CMS round-trip.
- `npm run lint`, `npm run typecheck`, `npm run build` all clean.

## Quick start

```bash
git clone https://github.com/FlutterSmith/underground-streetwear.git
cd underground-streetwear
npm install
npm run dev
```

Open http://localhost:3000.

Production build:

```bash
npm run lint        # ESLint, must be clean
npm run typecheck   # tsc --noEmit, must be clean
npm run build       # next build, generates 20+ static pages
npm run start       # serve the production build locally
```

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15 (App Router) | RSC by default, routing built in, image optimisation, generateStaticParams. |
| UI runtime | React 19 | Latest hooks + concurrent rendering. |
| Language | TypeScript (strict) | Caught dozens of bugs while building. Worth it. |
| Styling | Tailwind CSS v4 | `@theme` block, no PostCSS gymnastics. Custom design tokens in one file. |
| Animation | Framer Motion 11 | Page transitions, cart drawer, hover states. |
| Fonts | next/font (Inter + JetBrains Mono) | Self-hosted via Next, zero FOUT. |
| State | React Context + localStorage | Cart, wishlist, currency. No Redux, no Zustand. |
| Data | Static JSON | `products.json`, `lookbook.json`. Replace with your CMS later if you want. |

## Project layout

```
src/
  app/
    layout.tsx              root: providers, cursor, page transition, cart drawer
    page.tsx                landing /
    home/                   home /home
    shop/
      page.tsx              catalog /shop
      [id]/                 product detail (SSG, one page per product)
    cart/                   cart page
    checkout/               checkout flow
    wishlist/               saved pieces
    orders/                 order tracking lookup
    lookbook/               editorial grid
    pre-order/              reserve form
    contact/                contact form
    shipping/ returns/ privacy/ terms/   legal stubs

  components/
    BarButton.tsx           signature fill button (reuse this for every CTA)
    CartDrawer.tsx          slide-in cart
    Cursor.tsx              custom white-dot cursor
    Footer.tsx              sitewide footer with link columns
    FormField.tsx           input + textarea with error styling
    LegalPage.tsx           wrapper for /shipping etc.
    Logo.tsx                inlines the SVG server-side
    Nav.tsx                 desktop nav + mobile drawer + cart/wishlist/currency
    Newsletter.tsx          email capture
    PageTheme.tsx           sets html[data-theme] per route
    PageTransition.tsx      AnimatePresence page fades
    ProductTile.tsx         catalog tile: hover-swap image, quick-add, heart, stock badge
    RecentlyViewedStrip.tsx persisted recently-viewed grid
    Reviews.tsx             rating distribution + reviews list with star filter
    ShopGrid.tsx            client-side filter / sort / search for /shop
    SocialRow.tsx           landing socials
    Stars.tsx               accessible 5-star renderer
    Timestamp.tsx           live ticking clock
    WishlistHeart.tsx       toggle heart used everywhere a product appears

  config/
    site.config.ts          brand name, logo, taglines, colors, socials

  content/
    products.json           catalog
    lookbook.json           editorial shots

  lib/
    cart.tsx                cart context + localStorage
    currency.tsx            currency context + format helper
    lookbook.ts             lookbook reader
    products.ts             Product type + helpers
    recentlyViewed.tsx      track + read recent product visits
    seededRotation.ts       deterministic rotation per product id
    wishlist.tsx            wishlist context + localStorage
```

## Customize

### Brand identity

Edit `src/config/site.config.ts`:

```ts
export const siteConfig: SiteConfig = {
  brandName: "UNDERGROUND",
  logoSvgPath: "/logo.svg",
  taglines: ["We make things that work better and last longer.", "Underground by design."],
  colors: { light: "#F5F4F0", dark: "#0A0A0A", accent: "#000000" },
  socials: [
    { label: "Instagram", href: "https://instagram.com/yourbrand", icon: "ig" },
    // ...
  ],
};
```

The brand name flows into `<title>` metadata, the nav, the contact page, the footer, and the `aria-label` on the logo. Change it once.

The logo is `public/logo.svg`. Replace the file. The Logo component reads it server-side and inlines the markup so the brand never blinks in.

### Tokens

`src/app/globals.css` declares the design tokens under Tailwind's `@theme` block:

```css
@theme {
  --color-bg-light: #F5F4F0;
  --color-bg-dark:  #0A0A0A;
  --color-ink:      #000000;
  --color-paper:    #FFFFFF;
}
```

Use `bg-[var(--color-bg-dark)]` rather than hardcoded hex. Changing one token propagates.

### Products

Add a product to `src/content/products.json`. The schema:

```jsonc
{
  "id": "wool-cardigan-01",            // kebab-case, unique. Seeds the rotation.
  "name": "CARDIGAN",                   // upper-case, short
  "priceEGP": 2200,                     // integer EGP, currency switcher converts
  "image": "https://.../primary.jpg",   // primary image
  "gallery": [                          // 1+ images, first is primary
    "https://.../primary.jpg",
    "https://.../detail-1.jpg",
    "https://.../detail-2.jpg"
  ],
  "category": "other",                  // hoodie | tee | pants | mask | shorts | other
  "description": "Chunky merino. Hand-finished placket.",
  "fabric": "100% merino wool",
  "sizes": ["S", "M", "L"],
  "stock": 12,                          // optional, drives "Only N left" badge if <= 5
  "releasedAt": "2026-04-18",           // optional, drives "newest" sort
  "signature": false,                   // true = isolated render at bottom of /shop
  "soldOut": false,                     // true = waitlist UI replaces add-to-cart
  "reviews": [                          // optional, drives ratings on tile + page
    { "author": "A. R.", "rating": 5, "title": "best", "body": "...", "date": "2026-04-10", "verified": true }
  ]
}
```

Save the file, hot-reload picks it up. New product live in your local dev within a second. Production: redeploy.

Images can be local (drop into `public/products/`) or remote. Remote hosts must be allowed in `next.config.ts`:

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "cdn.your-cdn.com" },
  ],
},
```

### Lookbook

`src/content/lookbook.json`:

```jsonc
{
  "title": "SS 26",
  "subtitle": "Shot on film. No retouching.",
  "credits": { "photographer": "J. Karim", "stylist": "N. Saad", "models": "The Cast" },
  "shots": [
    { "src": "https://...", "alt": "Look 01", "aspect": "portrait", "span": "tall", "caption": "Look 01" },
    { "src": "https://...", "alt": "Look 02", "aspect": "square" }
  ]
}
```

`aspect`: `portrait` | `landscape` | `square`. `span`: `wide` (2 columns) | `tall` (2 rows). Mix them up for an editorial feel.

### Currency

`src/lib/currency.tsx`. Replace the static `RATES` map with a fetch on app boot or a 24h cached server route:

```ts
const RATES: Record<Currency, number> = {
  EGP: 1,
  USD: 1 / 48,
  EUR: 1 / 52,
};
```

Add a currency by extending the `Currency` type and the maps.

## Backend hooks

Forms ship as client-side scaffolds with a `// TODO(template-buyer):` comment marking the integration point. Each form fakes a 600ms latency and shows a success state so you can demo the UX before plumbing.

| Form | File | Suggested backend |
| --- | --- | --- |
| Contact | `src/app/contact/page.tsx` | Resend / Postmark / Formspree |
| Pre-order | `src/app/pre-order/page.tsx` | Resend + your DB / Airtable |
| Newsletter | `src/components/Newsletter.tsx` | Mailchimp / ConvertKit / Beehiiv |
| Waitlist (sold-out) | `src/app/shop/[id]/ProductDetail.tsx` | Same as newsletter |
| Checkout | `src/app/checkout/page.tsx` | **Stripe Checkout** for global, **Paymob** or **Fawry** for Egypt |
| Order lookup | `src/app/orders/page.tsx` | Your orders DB or Shopify Admin API |

Wiring example (Stripe):

```tsx
// in src/app/checkout/page.tsx, replace the mock delay
const res = await fetch("/api/checkout", {
  method: "POST",
  body: JSON.stringify({ items, address: form, total }),
});
const { url } = await res.json();
window.location.href = url; // Stripe-hosted Checkout
```

Then create `src/app/api/checkout/route.ts` that calls Stripe's `checkout.sessions.create`. Webhook confirms payment, marks order paid, clears the cart on success page.

## Deploy

The site is **static-first**. `next build` generates 20+ static HTML routes including one per product. Works on:

- **Vercel** &mdash; zero config. `vercel --prod`.
- **Netlify** &mdash; auto-detects Next.js. `netlify deploy --prod`.
- **Cloudflare Pages** &mdash; framework preset = Next.js.
- **Firebase App Hosting** &mdash; needs Blaze plan, `firebase init apphosting` from the dashboard.
- **Self-hosted** &mdash; `npm run build && npm run start` behind any reverse proxy.

Forms are client-side until you wire a backend. If you deploy without wiring, customers will see a fake success state. **Wire a real endpoint before launch.**

## Performance

Built for Lighthouse 90+ on mobile out of the box:

- All routes statically prerendered.
- Images via `next/image` (auto WebP, responsive sizes).
- Fonts self-hosted via `next/font` (no FOUT).
- Framer Motion only loaded on routes that use it.
- Custom cursor uses a `requestAnimationFrame` ref-only pattern, no React re-render on `mousemove`.

## Accessibility

- Skip-friendly DOM order, single `<main>` per route.
- Focus rings visible (`focus-visible:ring`) in a brand-appropriate style.
- Custom cursor is decorative; keyboard users still get a real cursor.
- All animations honour `prefers-reduced-motion`.
- Form fields have explicit labels, `aria-pressed` on toggle buttons, `aria-label` on icon-only controls.
- Color contrast passes AA on both light and dark surfaces.

## Roadmap

The template covers the full storefront experience. These would push it further:

- **Bundles** &mdash; "Hoodie + Pants saves 10%" with a dedicated bundle product type.
- **Real reviews submission** &mdash; the Reviews UI is read-only today, would pair with a backend.
- **Loyalty / referrals** &mdash; needs accounts and a backend to be real.
- **Arabic (RTL) mirror** &mdash; the global market would benefit; just needs the strings.
- **Product variants beyond size** &mdash; e.g. color, material.
- **Live inventory sync** &mdash; today `stock` is a static number per product.

## License

Commercial template. One brand per seat. The repo is public so you can preview, but production use requires a license. Contact the author below.

## Credits

- Product and lookbook photography sourced from [Unsplash](https://unsplash.com), free for commercial use. Replace with your own brand photography before launch.
- Inter and JetBrains Mono via Google Fonts (self-hosted through `next/font`).
- Built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), and [Framer Motion](https://www.framer.com/motion/).

## Author

Built by Ahmed Hamdy. Open to commissions for brand sites, e-commerce, and bespoke front-end work.

- GitHub &middot; [@FlutterSmith](https://github.com/FlutterSmith)
- For licensing or commission requests, open an issue on this repo.

---

<sub>If this saved you a week of work, a star on the repo means a lot.</sub>
