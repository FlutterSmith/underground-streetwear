# Gap Analysis — Streetwear Brand Site

**PRD:** `docs/prd/2026-04-18-streetwear-brand-site.md`
**Last updated:** 2026-04-18 (Turn 2 of 10)

---

## Current State

Next.js 15 + Tailwind v4 + Framer Motion v11 scaffold is in place. All 6 routes build and pass lint + typecheck. Production build output: landing 148kB first load (slightly above PRD target of 120kB — optimization pending).

## What's Implemented

### Foundations
- [x] `package.json` — Next 15.1.3, React 19, Tailwind v4, framer-motion 11
- [x] `tsconfig.json` strict, `@/*` path alias
- [x] `eslint.config.mjs`, `postcss.config.mjs`, `next.config.ts`
- [x] Tailwind v4 `@theme` tokens in `globals.css`
- [x] `next/font` — Inter + JetBrains Mono as CSS variables
- [x] `src/config/site.config.ts` — brand, taglines, colors, socials
- [x] `src/content/products.json` — 6 products incl. signature
- [x] `src/lib/seededRotation.ts` — mulberry32 + FNV-1a hash
- [x] `src/lib/products.ts` — typed loader

### Components
- [x] `BarButton` — signature left→right scaleX fill, label color invert, reduced-motion safe
- [x] `Timestamp` — SSR-safe (empty placeholder, ticks via useEffect)
- [x] `Cursor` — rAF-driven, gated by `(hover: hover)`, mix-blend-difference, scales on interactive hover
- [x] `PageTransition` — AnimatePresence fade+slide, reduced-motion fallback
- [x] `Logo` — inline SVG (graffiti-style placeholder wordmark)
- [x] `Nav` — monospace top nav, no hamburger, invert-able
- [x] `SocialRow` — 5 inline SVG icons, 1.15x hover, noopener noreferrer
- [x] `ProductTile` — rotates per seeded value, scale+rotate→0 on hover, image fallback

### Routes
- [x] `/` — landing: timestamp, logo, 4 bar-buttons, social row, no header/footer
- [x] `/home` — two-col hero + parallax eye SVG (useScroll/useTransform)
- [x] `/shop` — dark theme, grid, signature piece isolated w/ caption
- [x] `/contact` — BarButton-based stub
- [x] `/lookbook` — stub
- [x] `/pre-order` — stub

### Assets
- [x] `public/logo.svg`, `public/fallback-garment.svg`, 6 placeholder product SVGs

### Quality gates
- [x] `npx tsc --noEmit` — clean
- [x] `npx next lint` — clean
- [x] `npx next build` — succeeds, all 9 pages static

## Gaps / Still To Do

### PRD Compliance
- [ ] Landing first-load JS 148kB exceeds 120kB target (PRD §4.5) — consider dynamic-importing framer-motion on landing or stripping BarButton's motion dependency
- [ ] Lighthouse audit not yet run; a11y score not verified
- [ ] Mobile viewports (375, 768) not yet manually verified in a real browser
- [ ] Empty `products.json` edge case: `/shop` message exists but rendering path not tested with empty array
- [ ] `prefers-reduced-motion` respected in motion code but not manually verified end-to-end

### Deployment (blocked on user input)
- [ ] GitHub org/username + repo creation
- [ ] Firebase App Hosting wiring + `.hosted.app` URL

### Nice-to-haves deferred
- [ ] Richer graffiti logo (current is geometric placeholder — owner can swap via `site.config.ts` + `/public/logo.svg`)
- [ ] Real product photography (PNGs with transparent backgrounds)

## Progress Log

- **Turn 1 (2026-04-18)** — Created gap analysis, asked user about GitHub/deploy. Blocked.
- **Turn 2 (2026-04-18)** — User said continue. Scaffolded entire codebase locally: all 9 components, 6 routes, assets, tooling. Build + lint + typecheck clean. Awaiting GitHub info for deploy; remaining work is polish/verification.
