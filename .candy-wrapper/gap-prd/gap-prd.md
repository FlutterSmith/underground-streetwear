# Gap Analysis — Underground Streetwear Brand Website

**Generated:** 2026-04-18
**PRD:** `docs/prd/2026-04-18-streetwear-brand-site.md`
**Branch:** `main`
**Auditor:** Fresh codebase sweep vs PRD v1.0

---

## 1. Executive Summary

The site is **substantially complete**. All six routes render, the signature BarButton fill animation is implemented correctly, the seeded-rotation SSR strategy is in place, and accessibility affordances (reduced-motion, focus rings, alt text, touch-aware cursor/parallax) are wired through.

Against the PRD's 41 discrete functional checks, **41 pass** as of turn 7 — FR-S5 small-caps fixed at `src/components/ProductTile.tsx:67` via `[font-variant-caps:all-small-caps]`. `npm run lint` and `npx tsc --noEmit` both clean on HEAD.

What's still unverified — and therefore the real remaining risk — is the PRD's **Definition of Done** in §6.1: Lighthouse (Performance ≥ 90, Accessibility ≥ 95), cross-viewport manual QA (375/768/1280/1920), and whether `npm run lint` / `npm run typecheck` currently run clean. None of these are code gaps; they are verification gaps.

**Bottom line:** Implementation work is effectively done. The remaining work is **one styling tweak** + **verification / polish pass**.

---

## 2. Completed Features

All are present with file references. Statuses reflect static code review only (no runtime Lighthouse run).

### Global (FR-G1 … FR-G5)
- **FR-G1** Custom cursor — `src/components/Cursor.tsx:1-59`. 8px dot, scales 3× on interactive hover, early-exits on `(hover: hover)` miss.
- **FR-G2** Signature fill — `src/components/BarButton.tsx:16-76`. `scaleX 0→1`, 500ms, ease `[0.65, 0, 0.35, 1]`, label flips with 100ms delay.
- **FR-G3** Page transitions — `src/components/PageTransition.tsx:12-22`. Fade + `y:12→0`, 0.4s, ease `[0.22, 1, 0.36, 1]`, reduced-motion → fade only.
- **FR-G4** Config — `src/config/site.config.ts:11-26`. `brandName`, `logoSvgPath`, `taglines[2]`, `colors`, `socials[]`.
- **FR-G5** Products JSON — `src/content/products.json` (6 products, 1 signature).

### Landing `/` (FR-L1 … FR-L8)
- **FR-L1** `src/app/page.tsx:15` — `min-h-screen`, bg `--color-bg-light` (`#F5F4F0` in `globals.css:4`).
- **FR-L2** `src/components/Timestamp.tsx:1-35` — server renders empty string, `setInterval` 1000ms after mount, exact `MM/DD/YYYY, h:mm:ss A` format.
- **FR-L3** `src/app/page.tsx:19` — `w-[min(240px,70vw)] sm:w-[min(70vw,420px)]`.
- **FR-L4** `src/app/page.tsx:23-32` — 4 buttons, 320×48 via `sm:!w-[320px]` + `h-12` in `BarButton.tsx:34`.
- **FR-L5** Same as FR-G2.
- **FR-L6** Routes wired in `src/app/page.tsx:6-11`.
- **FR-L7** `src/components/SocialRow.tsx:4-40` — 5 icons, 20px, `hover:scale-[1.15] duration-200`.
- **FR-L8** Landing renders no Nav and no footer.

### Home `/home` (FR-H1 … FR-H3)
- **FR-H1** `src/app/home/page.tsx:26-27` + `src/components/Nav.tsx:16-25` — wordmark top-left, nav center.
- **FR-H2** `src/app/home/page.tsx:28-40` + eye SVG at `:57-84`.
- **FR-H3** `src/app/home/page.tsx:11,22,38` — `useScroll` + `useTransform([0,1000], [0,-500])`, gated on `(hover: hover)` and `prefers-reduced-motion`.

### Shop `/shop` (FR-S1, S2, S3, S4, S6)
- **FR-S1** `src/app/shop/page.tsx:21` — `bg-[var(--color-bg-dark)] text-white`.
- **FR-S2** Grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (`shop/page.tsx:29`); rotation via `rotationFor(product.id)` → mulberry32 in `src/lib/seededRotation.ts:1-22`.
- **FR-S3** `src/components/ProductTile.tsx:55-64` — `object-contain`, no border/shadow.
- **FR-S4** `src/components/ProductTile.tsx:34-41` — `whileHover: { scale: 1.05, rotate: 0 }`, 300ms.
- **FR-S6** `src/app/shop/page.tsx:37-46` — signature piece isolated, `mt-32`, caption below.

### Responsive (FR-R1 … FR-R3)
- **FR-R1** Logo 240px mobile, buttons full-width via `fullWidth` prop + `sm:!w-[320px]` override.
- **FR-R2** `src/components/Nav.tsx:16` — grid layout, links always visible.
- **FR-R3** `src/components/Cursor.tsx:9-10` — early return when `(hover: hover)` fails.

### Stubs
- `src/app/contact/page.tsx`, `src/app/lookbook/page.tsx`, `src/app/pre-order/page.tsx` all exist with BarButton-based placeholders.

### Edge cases & accessibility
- Empty products → `"DROP LOADING…"` at `src/app/shop/page.tsx:9-17`.
- Missing image fallback → `src/components/ProductTile.tsx:11,62` → `/public/fallback-garment.svg` (exists).
- `useReducedMotion()` applied in BarButton, ProductTile, PageTransition, home parallax.
- Focus rings via `focus-visible:ring-2 focus-visible:ring-current` + `globals.css:40-43`.
- Alt text: `ProductTile.tsx:58` — `${name} (${category})`.
- `next.config.ts:6` — `remotePatterns: []` (restrictive).

---

## 3. Partially Completed

**None.** FR-S5 closed in turn 7 — see `src/components/ProductTile.tsx:67`. Used `all-small-caps` so the existing UPPER-case `products.json` source still renders as small capitals without altering JSON.

---

## 4. Not Started

**None at the code level.** Every FR in the PRD has at least partial implementation.

What remains untouched from §6.1 Definition of Done is **verification**, not implementation:
- No evidence in repo that `npm run lint`, `npm run typecheck`, or Lighthouse have been run against the current HEAD.
- No manual QA record for 375 / 768 / 1280 / 1920px viewports.
- Performance budget (landing JS < 120 KB gzip, LCP < 2.0s on Fast 3G) is unverified.
- `prefers-reduced-motion` behavior is wired but not tested end-to-end.

---

## 5. Priority Order

1. **FR-S5 small-caps fix** — tiny scoped edit in `ProductTile.tsx`. Do this before any QA run so screenshots are final.
2. **`npm run lint` + `npm run typecheck`** — gate per global CLAUDE.md build checklist; fix anything that surfaces.
3. **Lighthouse mobile run** on `/` and `/shop` — confirm Performance ≥ 90, Accessibility ≥ 95. If perf fails, profile Framer Motion bundle and consider dynamic import on shop-only animations (PRD §4.5, §7.2).
4. **Manual QA matrix** — 375 / 768 / 1280 / 1920 × `/`, `/home`, `/shop`, stubs. Watch for: logo sizing, grid wrap, bar-button width, parallax disabled on touch, cursor absent on touch.
5. **Reduced-motion E2E** — toggle OS setting, verify fill is instant, parallax dead, transitions fade-only.
6. **Owner-edit smoke test** — change `brandName` in `site.config.ts` and add a 7th product in `products.json`; confirm both propagate with no other edits (FR-G4, FR-G5 acceptance).

---

## 6. Next Steps (Actionable)

- [x] FR-S5 fixed — `ProductTile.tsx:67` uses `[font-variant-caps:all-small-caps]`.
- [x] `npm run lint` clean; `npx tsc --noEmit` clean (turn 7).
- [ ] Run Lighthouse on deployed `.hosted.app` URL (mobile preset) for `/` and `/shop`; record scores.
- [ ] Walk the four viewport widths on each route; screenshot anything that breaks.
- [ ] Flip OS reduced-motion; confirm BarButton fill, shop tile animation, page transitions, home parallax all degrade correctly.
- [ ] Swap `brandName` in `site.config.ts` and revert — confirm wordmark / landing / nav all update.
- [ ] Append a 7th product to `products.json` with a fresh id — confirm it appears on `/shop` at a new deterministic rotation with no code changes.

Once items 1–6 pass, the PRD's Definition of Done (§6.1) is satisfied and v1 can ship.
