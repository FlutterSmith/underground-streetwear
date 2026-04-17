# Product Requirement Document — Underground Streetwear Brand Website

**Date:** 2026-04-18
**Owner:** Ahmed Hamdy
**Status:** Draft v1.0
**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion

---

## 1. Product Overview

A minimalist, cult-feeling streetwear brand website inspired by labels like **Corteiz** and **Broken Planet**. The site is intentionally raw and underground — it rejects conventional e-commerce polish in favor of stark contrasts, heavy whitespace, graffiti typography, and a single signature interaction (a left-to-right progress-bar button fill) that recurs across every clickable element.

### Core Value Proposition

- **Brand-first, not retail-first.** The entry screen sells the vibe before a single product.
- **Signature interaction as identity.** The filling-bar hover becomes a memorable, on-brand micro-moment users associate with the label.
- **Mode-switching atmosphere.** A stark off-white landing contrasts a near-black catalog, reinforcing the cult/underground duality.
- **Editable without a CMS.** Logo, colors, tagline, and products are all swappable from a single JSON/TS config — owner can iterate without touching components.

---

## 2. User Stories & Use Cases

### Primary Personas

| Persona | Motivation | Success Looks Like |
|---|---|---|
| **The Hype Buyer** (18–25, follows drops on IG/TikTok) | Check for new drops, grab before sellout | Lands → hits SHOP → sees floating grid → clicks a piece |
| **The Curious Scroller** (discovered via a repost) | Figure out what this brand is about | Lands → reads About → bookmarks / follows socials |
| **The Returning Fan** | Check lookbook or pre-order status | Lands → goes straight to LOOKBOOK or PRE-ORDER |
| **The Brand Owner** | Swap hero tagline, add a new product | Edits `site.config.ts` + `products.json`, redeploys |

### User Stories

- As a visitor, I want the entry screen to feel like stepping into a shop, not a homepage, so the brand immediately feels different.
- As a visitor, I want every button to fill left-to-right on hover so I recognize the brand's signature interaction.
- As a visitor on mobile, I want the same experience without a hamburger menu so the minimalism is preserved.
- As a shopper, I want products to feel like stickers thrown on a wall rather than catalog cards, so browsing feels curated and loose.
- As the brand owner, I want to edit products from a JSON file without redeploying component code, so I can iterate fast.

---

## 3. Functional Requirements

### 3.1 Global

| ID | Requirement |
|---|---|
| FR-G1 | Site uses a custom cursor (white dot, 8px) that scales to 24px when hovering interactive elements. Disabled on touch devices. |
| FR-G2 | Every `<Button>` component uses the **signature fill animation**: a black rectangle animates `scaleX 0 → 1` from left edge on hover; label color inverts when fully filled. |
| FR-G3 | Page transitions use Framer Motion `AnimatePresence` with combined fade (`opacity 0→1`) and slide (`y: 12 → 0`), duration 0.4s, ease `[0.22, 1, 0.36, 1]`. |
| FR-G4 | A single config file (`src/config/site.config.ts`) controls: logo SVG path, brand name, tagline(s), color tokens, social links. |
| FR-G5 | Products are sourced from `src/content/products.json` — no CMS dependency. |

### 3.2 Page 1 — Landing / Entry (`/`)

| ID | Requirement |
|---|---|
| FR-L1 | Background `#F5F4F0`. Centered vertical stack, min-height 100vh. |
| FR-L2 | Top: live timestamp in monospace, format `MM/DD/YYYY, h:mm:ss A`, updates every 1000ms via `setInterval`. |
| FR-L3 | Center: graffiti-style SVG logo, jagged/ink-splatter placeholder, black fill. Max width 420px desktop / 70vw mobile. |
| FR-L4 | 4 stacked bar-buttons, each **320px wide × 48px tall**, labels: `SHOP`, `CONTACT`, `LOOKBOOK`, `PRE-ORDER`. 1px black outline, transparent fill. |
| FR-L5 | Hover on bar-button: black fill sweeps left → right over 0.5s; label text flips to white once filled. |
| FR-L6 | Click routes: `/shop`, `/contact`, `/lookbook`, `/pre-order`. |
| FR-L7 | Social row: Facebook, Instagram, YouTube, TikTok, X — 20px black icons, 1.15x scale on hover, 200ms. |
| FR-L8 | No header or footer on this route. |

### 3.3 Page 2 — Home / About (`/home`)

| ID | Requirement |
|---|---|
| FR-H1 | Background `#F5F4F0`. Top-left wordmark (small, monospace). Top-center nav: `Home` / `Catalog` / `Contact`. |
| FR-H2 | Hero two-column: left tagline stack ("We make things that work better and last longer."); right hand-drawn SVG eye with dripping lashes. |
| FR-H3 | Parallax: right illustration translates `y` at 0.5x scroll speed; text stays static. Use `useScroll` + `useTransform`. |

### 3.4 Page 3 — Shop / Catalog (`/shop`)

| ID | Requirement |
|---|---|
| FR-S1 | Background `#0A0A0A`, text white. |
| FR-S2 | Products render in a loose CSS grid (3 cols desktop, 2 tablet, 1 mobile). Each product wrapper rotated a deterministic random angle in `[-8°, +8°]` (seeded by product id so layout is stable across renders/SSR). |
| FR-S3 | Product image: transparent PNG of garment, no card/border/shadow. |
| FR-S4 | Hover: `scale 1.05` and `rotate → 0deg`, 300ms ease-out. |
| FR-S5 | Below each: `NAME` in small caps + `— LE {price} EGP` in monospace. |
| FR-S6 | One product flagged `signature: true` in JSON renders isolated at the bottom with a caption line. |

### 3.5 Responsive

| ID | Requirement |
|---|---|
| FR-R1 | Mobile breakpoint `< 768px`: vertical stacking; logo reduced to 240px; bar-buttons become full-width minus 32px side padding. |
| FR-R2 | Nav stays visible on mobile (compact horizontal) — **no hamburger**. |
| FR-R3 | Custom cursor disabled on devices without `hover: hover` media capability. |

---

## 4. Technical Requirements

### 4.1 Architecture

```
src/
  app/
    layout.tsx                # Root layout (cursor, font loader, AnimatePresence wrapper)
    page.tsx                  # Landing (/)
    home/page.tsx             # About (/home)
    shop/page.tsx             # Catalog (/shop)
    contact/page.tsx
    lookbook/page.tsx
    pre-order/page.tsx
  components/
    BarButton.tsx             # Signature fill button
    Cursor.tsx                # Global white-dot cursor
    Logo.tsx                  # Reads SVG path from config
    Timestamp.tsx             # Live ticking clock
    Nav.tsx
    SocialRow.tsx
    ProductTile.tsx
    PageTransition.tsx        # Wraps children in AnimatePresence motion
  config/
    site.config.ts            # Brand config (colors, tagline, logo, socials)
  content/
    products.json             # Product catalog
  lib/
    seededRotation.ts         # Deterministic rotation per product id
  styles/
    globals.css
```

### 4.2 Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | RSC by default, client components for interaction |
| Language | **TypeScript** (strict) | Per global coding standards |
| Styling | **Tailwind CSS** | Custom tokens for `#F5F4F0`, `#0A0A0A` |
| Animation | **Framer Motion** | `motion`, `AnimatePresence`, `useScroll`, `useTransform` |
| Fonts | `Inter` (sans) + `JetBrains Mono` (mono) via `next/font` | Self-hosted; no FOUT |
| Images | `next/image` for PNGs; inline SVG for logo/illustrations | |
| Deployment | Firebase App Hosting | Per global stack default |

### 4.3 Data Model — Product

```ts
type Product = {
  id: string;              // kebab-case, unique — seeds rotation
  name: string;            // e.g. "PANTS"
  priceEGP: number;        // integer, formatted at render
  image: string;           // public path, transparent PNG
  category: "hoodie" | "tee" | "pants" | "mask" | "shorts" | "other";
  signature?: boolean;     // renders isolated at bottom
  caption?: string;        // only used when signature === true
};
```

### 4.4 Config Shape

```ts
type SiteConfig = {
  brandName: string;
  logoSvgPath: string;          // /logo.svg
  taglines: [string, string];   // exactly 2 short lines
  colors: { light: string; dark: string; accent: string };
  socials: { label: string; href: string; icon: "fb"|"ig"|"yt"|"tt"|"x" }[];
};
```

### 4.5 Performance

- Lighthouse Performance ≥ 90 on mobile.
- Largest Contentful Paint < 2.0s on Fast 3G-emulated.
- Total JS shipped on landing route < 120 KB gzip.
- Framer Motion imports code-split via dynamic `import()` where not needed in RSC.

### 4.6 Security

- No user input on v1 → minimal attack surface.
- Social links open with `rel="noopener noreferrer"` `target="_blank"`.
- `next.config.ts` sets `images.remotePatterns` strictly (Unsplash only if used).
- No hardcoded secrets. Any future form submission routes through `.env.local`.

### 4.7 Accessibility

- All interactive elements reachable via keyboard; focus ring visible in a brand-appropriate style (2px solid current text color).
- Custom cursor is decorative — native cursor remains functional for keyboard users.
- Animations respect `prefers-reduced-motion`: fill animation instant-snaps, parallax disabled, page transitions reduced to fade only.
- Alt text on all product images from JSON (`name` + `category` fallback).

---

## 5. UI/UX Specifications

### 5.1 Design Tokens

| Token | Value | Use |
|---|---|---|
| `--bg-light` | `#F5F4F0` | Landing, About backgrounds |
| `--bg-dark` | `#0A0A0A` | Shop background |
| `--ink` | `#000000` | Logo, borders, primary text on light |
| `--paper` | `#FFFFFF` | Text on dark |
| Font — display | Hand-drawn SVG (logo only) | Logo |
| Font — body | `Inter`, 400/500 | Paragraph, nav |
| Font — mono | `JetBrains Mono`, 400 | Timestamp, price, labels |

### 5.2 Wireframes (ASCII)

**Landing (`/`)**
```
┌───────────────────────────────────────────┐
│          04/18/2026, 3:22:14 PM           │  ← mono, 12px
│                                           │
│                                           │
│              [ GRAFFITI LOGO ]            │  ← SVG, ~420px
│                                           │
│                                           │
│         ┌─────── SHOP ───────┐            │  ← bar-button 320×48
│         ┌────── CONTACT ─────┐            │
│         ┌────── LOOKBOOK ────┐            │
│         ┌───── PRE-ORDER ────┐            │
│                                           │
│              f  ig  yt  tt  x             │  ← 20px icons
│                                           │
└───────────────────────────────────────────┘
```

**Shop (`/shop`)** — near-black, products floating at random angles:
```
┌───────────────────────────────────────────┐
│  BRAND            HOME · CATALOG · CONTACT│
│                                           │
│    [hoodie↙]            [tee↗]            │
│    HOODIE — LE 2,400    TEE — LE 900      │
│                                           │
│         [pants↗]   [mask↙]                │
│                                           │
│              [ signature piece ]          │
│              "limited drop · 01"          │
└───────────────────────────────────────────┘
```

### 5.3 Signature Bar-Button Interaction

1. Rest: 1px black outline, transparent fill, black monospace label.
2. Hover enter: pseudo-layer `::before` animates `transform: scaleX(0) → scaleX(1)` with `transform-origin: left`, duration 500ms, ease `[0.65, 0, 0.35, 1]`.
3. Concurrent with fill: label color transitions `black → white` with 100ms delay.
4. Hover leave: reverse — fill retracts to the left.
5. Click: no extra animation; route transition takes over.

### 5.4 User Flows

- **Enter → Shop:** `/` → hover SHOP (fill sweeps) → click → fade/slide transition → `/shop` grid fades in, products settle to their rotated positions with a 100ms stagger.
- **Enter → About:** `/` → click LOOKBOOK or typed `/home` → fade transition → eye illustration fades/translates into place.
- **Owner edits catalog:** edit `products.json` → commit → auto-deploy via Firebase App Hosting → live in ~2 min.

---

## 6. Acceptance Criteria

### 6.1 Definition of Done

- [ ] `npm run lint` — zero errors/warnings.
- [ ] `npm run typecheck` — zero issues.
- [ ] All 6 routes render without runtime errors.
- [ ] Signature bar-button fill animation plays correctly on all 4 landing buttons and any reused `<BarButton>`.
- [ ] Timestamp updates every second without SSR hydration mismatch (render empty/neutral on server, start ticking on mount).
- [ ] Product rotations are **deterministic** — same across SSR and CSR; no hydration warnings.
- [ ] Mobile (375px, 768px) and desktop (1280px, 1920px) verified in browser.
- [ ] Lighthouse Performance ≥ 90 (mobile), Accessibility ≥ 95.
- [ ] `site.config.ts` change (swap brandName or tagline) reflects everywhere without other edits.
- [ ] Adding a new product via `products.json` appears on `/shop` on next build without code changes.

### 6.2 Edge Cases & Error States

| Scenario | Expected Behavior |
|---|---|
| JS disabled | Static content visible; buttons still link; animations gracefully absent |
| `prefers-reduced-motion: reduce` | Fill = instant; parallax off; transitions = fade-only |
| Touch device | Custom cursor hidden; hover states map to `:active` |
| Missing product image | Fallback SVG silhouette from `/public/fallback-garment.svg` |
| Empty `products.json` | `/shop` shows a single monospace message: `"DROP LOADING…"` |
| Timestamp before hydration | Server renders empty container with fixed width; no layout shift when client clock starts |
| Slow network | Logo SVG inlined in HTML so landing has no blank flash |

---

## 7. Implementation Notes

### 7.1 Recommended Build Order (aligns with "Deploy Before Features" rule)

1. **Scaffold & deploy first.** `create-next-app` → push to GitHub → wire Firebase App Hosting → confirm live `.hosted.app` URL.
2. **Design tokens + fonts + config file.** Lay down `site.config.ts`, Tailwind tokens, font loader. Commit + deploy.
3. **Landing page** (highest-signal screen): logo, timestamp, bar-buttons, socials. Commit + deploy.
4. **`BarButton` extracted as reusable component** once pattern is proven on landing.
5. **Page transitions + custom cursor** as global layout-level concerns.
6. **About page** with parallax.
7. **Shop page** with deterministic rotations + signature highlight.
8. **Contact / Lookbook / Pre-order stubs** — minimal placeholder screens reusing `BarButton`.
9. **Polish pass:** reduced-motion, mobile verification, Lighthouse tuning.

### 7.2 Known Challenges

- **SSR hydration for randomized rotations.** Use a seeded PRNG keyed by `product.id` (e.g. a small `mulberry32` in `lib/seededRotation.ts`), so server and client produce identical angles. Do **not** use `Math.random()`.
- **Live timestamp hydration mismatch.** Render the timestamp component with `suppressHydrationWarning` OR render an empty placeholder on server and populate on `useEffect` mount. Pick the latter to avoid masking real mismatches elsewhere.
- **Custom cursor performance.** Avoid React re-renders on `mousemove`; update position via direct ref + `transform` in a `requestAnimationFrame` loop.
- **Framer Motion bundle size.** Import from `framer-motion` carefully; consider `motion/react` tree-shakeable entry if staying on v11+.
- **Parallax on mobile.** Typically disabled — scroll-driven translations feel janky on touch. Gate behind `matchMedia('(hover: hover)')`.

### 7.3 Dependencies

```
next            ^15
react           ^19
typescript      ^5
tailwindcss     ^4
framer-motion   ^11
clsx            ^2     (optional, class composition)
```

### 7.4 Out of Scope (v1)

- Cart / checkout / payments.
- Real CMS (Sanity, Contentful) — JSON suffices.
- Internationalization — Arabic-language mirror deferred.
- Auth / user accounts.
- Analytics beyond a single pageview pixel (can be added later).

### 7.5 Context7 Verification Checklist

Before implementing, verify current patterns for:

- Next.js 15 App Router `layout.tsx` + `AnimatePresence` integration.
- Framer Motion `motion` import path (framer-motion vs motion/react) and `useScroll` API.
- `next/font` with self-hosted Google Fonts.
- Tailwind v4 custom color token syntax.

---

**End of PRD.**
