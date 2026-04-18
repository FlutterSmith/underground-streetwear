# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Underground streetwear brand website — minimalist, cult-feeling static marketing site (no cart/checkout). Six routes: `/`, `/home`, `/shop`, `/contact`, `/lookbook`, `/pre-order`. The canonical spec lives in `docs/prd/2026-04-18-streetwear-brand-site.md`; gap analysis and turn-by-turn progress in `.candy-wrapper/gap-prd/gap-prd.md`. Treat the PRD as the source of truth for requirements (FR-* IDs are referenced throughout the codebase history).

## Commands

```bash
npm run dev          # next dev
npm run build        # next build (produces 9 static pages)
npm run start        # next start
npm run lint         # next lint — must be zero warnings/errors
npm run typecheck    # tsc --noEmit — must be zero issues
```

There is no test runner configured. "Done" means lint + typecheck + `next build` all clean.

## Architecture

**Stack:** Next.js 15 App Router + React 19 + TypeScript (strict) + Tailwind v4 + Framer Motion v11. No state manager, no CMS, no backend.

**Content is config-driven** — never hardcode brand copy, product data, or social links in components:
- `src/config/site.config.ts` — brand name, logo path, taglines, color tokens, socials. Consumed by `layout.tsx` metadata, `Logo`, `Nav`, `SocialRow`, `/home`, `/contact`.
- `src/content/products.json` — product catalog. Typed through `src/lib/products.ts` (`Product` type: `id`, `name`, `priceEGP`, `image`, `category`, optional `signature`/`caption`). `/shop` renders from this JSON only.

**Design tokens** are declared in `src/app/globals.css` under Tailwind v4's `@theme` block (`--color-bg-light: #F5F4F0`, `--color-bg-dark: #0A0A0A`, `--color-ink`, `--color-paper`, `--font-sans`, `--font-mono`). Use these tokens rather than raw hex.

**Root layout (`src/app/layout.tsx`)** wires the global `<Cursor />` and wraps children in `<PageTransition>` (AnimatePresence keyed on pathname). Fonts are loaded via `next/font/google` (Inter + JetBrains Mono) and exposed as CSS variables.

### Signature interaction — `BarButton`

Every CTA on the site uses `src/components/BarButton.tsx`. It's the brand's identity: a `scaleX 0→1` black fill from `transform-origin: left` at 500ms ease `[0.65, 0, 0.35, 1]`, with a 100ms-delayed label color flip black→white. Default size **320×48**; `fullWidth` prop makes it span the container (used on mobile per FR-R1). Do not reimplement this animation elsewhere — reuse the component.

### Mobile breakpoint

The site's mobile/desktop split is **768px (`md:`), not 640px (`sm:`)** — this is FR-R1 in the PRD. Use `md:` in Tailwind classes for the mobile→desktop transition (logo sizing, button width, grid columns on `/shop`). Using `sm:` is a known spec-drift bug that has been fixed twice; don't reintroduce it.

### SSR-sensitive components

Two places are prone to hydration bugs — keep the existing patterns:
- **`Timestamp.tsx`** renders empty on the server and starts `setInterval(1000)` in `useEffect`. Do not try to render the initial time server-side.
- **`ProductTile` rotation** uses `lib/seededRotation.ts` (FNV-1a hash of `product.id` → mulberry32 PRNG → ±8°) so server and client produce identical angles. Never use `Math.random()` for per-product visuals.

### Logo inlining

`src/components/Logo.tsx` reads `public/logo.svg` with `fs.readFileSync` at module load and inlines the inner markup via `dangerouslySetInnerHTML`. This is a server component and must stay server-side — the PRD requires the logo to ship in the initial HTML (no blank flash). If the logo changes, just replace the SVG file.

### Reduced motion

`BarButton`, `PageTransition`, the parallax on `/home`, and the cursor all branch on `useReducedMotion()` / `matchMedia('(hover: hover)')`. When adding animations, gate them the same way.

## Conventions

- Path alias `@/*` → `src/*` (configured in `tsconfig.json`).
- Client components must have `"use client"` at the top. Server components (e.g. `Logo.tsx`) must not import client-only hooks.
- Product images live under `public/products/`; missing images fall back to `public/fallback-garment.svg`.
- The landing route `/` has no header/footer (FR-L8). Other routes use `Nav.tsx`.
- `.candy-wrapper/` is a working directory for PRD gap analysis; treat it as a living notebook, not shipped code.
