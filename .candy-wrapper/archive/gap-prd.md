# Gap Analysis — Underground Streetwear Brand Site

**Date:** 2026-04-18
**PRD:** `docs/prd/2026-04-18-streetwear-brand-site.md`
**Branch:** `main` (last commit `455067e` — progress after turn 2 of 10)

## Turn 3 Progress

Closed P1/P2 code gaps:

- **3.1 Logo.tsx** — now renders `<Image src={siteConfig.logoSvgPath} />`. FR-G4 config-swap-reflects-everywhere verified.
- **3.2 Nav.tsx** — three-column grid (`grid-cols-3`), nav `justify-self-center`. FR-H1 wireframe match.
- **4.3 Touch fallback** — `whileTap` added to `BarButton` (mirrors hover) and `ProductTile` (scale 1.05 / rotate 0). §6.2 edge case closed.
- **3.4 Mobile logo** — landing wrapper now `w-[min(240px,70vw)] sm:w-[min(70vw,420px)]`. FR-R1 exact.
- **3.6 Gate run** — `npm run lint` clean, `tsc --noEmit` clean, `next build` green, 9/9 static pages. Landing First Load JS **153 KB** uncompressed (≈ budget once gzipped; monitor on deploy).

## Turn 4 Progress

- **§6.2 Slow-network edge case** — `Logo.tsx` now reads `public/<logoSvgPath>` at module-scope on the server and inlines the SVG markup via `dangerouslySetInnerHTML`. Config-driven *and* zero-roundtrip, no blank flash. FR-G4 still honored.
- **§7.2 Parallax mobile gating** — `/home` parallax transform now gated behind `matchMedia('(hover: hover)')` via `useEffect`; disabled on touch to avoid jank.
- **4.2 `next.config.ts`** — verified `images.remotePatterns: []` already locked.
- **Gate rerun** — lint/typecheck/build green. Landing First Load JS dropped 153 → **148 kB** (removed next/image runtime on landing since logo is now static SVG).

Still open: **4.1 Firebase App Hosting** (blocked on GitHub username), **3.3/4.5 transparent PNGs** (content task), **4.4 Framer Motion code-split** (post-Lighthouse), **4.6 Context7 audit** (defensive), **6.1 Lighthouse run** (requires deploy).

---

## 1. Executive Summary

The v1 scaffold is **~85% feature-complete against the PRD**. Every route exists, the signature bar-button interaction works end-to-end, the deterministic rotation and parallax mechanics are wired correctly, and the site-wide primitives (cursor, timestamp, page transition, Tailwind v4 tokens, reduced-motion) are all in place.

Remaining work falls into four buckets:

1. **Config/data fidelity** — `Logo.tsx` hardcodes SVG paths instead of reading `siteConfig.logoSvgPath`; product art is SVG, not the transparent PNGs the PRD specifies.
2. **Layout detail** — `Nav.tsx` places the nav links on the right (`justify-between`) rather than top-center as FR-H1 requires.
3. **Deployment** — no Firebase App Hosting config exists; the "Deploy Before Features" rule (PRD §7.1 step 1) was skipped.
4. **Acceptance verification** — no evidence yet of Lighthouse run, mobile breakpoint QA, or the typecheck/lint gate being executed.

No runtime-breaking defects were found in the read-through.

---

## 2. Completed Features

| PRD ID | Feature | Evidence |
|---|---|---|
| FR-G1 | Custom cursor, 8px white dot, scales on hover, disabled on no-hover media | `src/components/Cursor.tsx` — `matchMedia('(hover: hover)')`, rAF loop, mix-blend-difference |
| FR-G2 | Signature bar-button fill + label color invert | `src/components/BarButton.tsx` — `scaleX 0→1` with `transform-origin: left`, 500ms, `[0.65,0,0.35,1]` |
| FR-G3 | Page transitions fade+slide 0.4s `[0.22,1,0.36,1]` | `src/components/PageTransition.tsx` |
| FR-G4 (partial) | Central `site.config.ts` with brand/colors/taglines/socials | `src/config/site.config.ts` — shape matches PRD §4.4 exactly |
| FR-G5 | Products sourced from JSON | `src/content/products.json` + `src/lib/products.ts` |
| FR-L1 | Landing bg `#F5F4F0`, centered vertical stack | `src/app/page.tsx` |
| FR-L2 | Live `MM/DD/YYYY, h:mm:ss A` timestamp, 1000ms tick, hydration-safe placeholder | `src/components/Timestamp.tsx` |
| FR-L4 | 4 stacked bar-buttons 320×48 with correct labels/routes | `src/app/page.tsx:6-11` + `BarButton` |
| FR-L5 | Hover fill sweep + label flip | `BarButton.tsx` variants |
| FR-L6 | Routes wired to `/shop`, `/contact`, `/lookbook`, `/pre-order` | `src/app/page.tsx:7-10` |
| FR-L7 | 5 social icons, 20px, 1.15× hover 200ms, `rel="noopener noreferrer"` | `src/components/SocialRow.tsx` |
| FR-L8 | No header/footer on landing | `src/app/page.tsx` (Nav not rendered) |
| FR-H2 | Hero two-column + SVG eye with dripping lashes | `src/app/home/page.tsx:47-74` |
| FR-H3 | Parallax via `useScroll` + `useTransform` (0.5x) | `src/app/home/page.tsx:11-12` |
| FR-S1 | Shop bg `#0A0A0A`, white text | `src/app/shop/page.tsx:21` |
| FR-S2 | Seeded deterministic rotation per product.id | `src/lib/seededRotation.ts` (mulberry32 + FNV-ish hash) |
| FR-S4 | Hover scale 1.05, rotate → 0 | `src/components/ProductTile.tsx:34` |
| FR-S5 | `NAME` + `— LE {price} EGP` in monospace | `ProductTile.tsx:49-56` |
| FR-S6 | Signature product isolated with caption | `src/app/shop/page.tsx:37-46` |
| FR-R3 | Custom cursor disabled without `hover: hover` | `Cursor.tsx:9-10` |
| 4.2 Fonts | Inter + JetBrains Mono via `next/font` | `src/app/layout.tsx:2-18` |
| 4.7 | `prefers-reduced-motion` — fill instant, parallax disabled, transitions reduced to fade | `BarButton`, `PageTransition`, `home/page.tsx`, `globals.css` |
| Edge: empty products | "DROP LOADING…" fallback | `src/app/shop/page.tsx:9-18` |
| Edge: missing image | `onError` swap to `/fallback-garment.svg` | `ProductTile.tsx:45`; asset present in `public/` |
| §6.1 accessibility | Focus ring 2px currentColor | `src/app/globals.css:40-43` |

---

## 3. Partially Completed

### 3.1 `Logo.tsx` ignores `siteConfig.logoSvgPath` — **FR-G4 gap**
`src/components/Logo.tsx` renders a hardcoded inline SVG (`<path d="…"/>` blocks) instead of loading the SVG at `siteConfig.logoSvgPath` (`/logo.svg`, which exists in `public/`). A `site.config.ts` swap of the logo will **not** reflect on the page — contradicts FR-G4 and Acceptance §6.1 ("`site.config.ts` change reflects everywhere without other edits").
**Fix:** replace the inline `<svg>` body with `<img src={siteConfig.logoSvgPath}>` or `next/image`, or inline-fetch at build time.

### 3.2 Nav alignment — **FR-H1 gap**
PRD §3.3: "Top-left wordmark … Top-**center** nav: Home / Catalog / Contact."
`src/components/Nav.tsx:16` uses `justify-between`, placing links on the right. Needs a three-column layout (wordmark left / nav centered / spacer right) to match the wireframe.

### 3.3 Product art format — **FR-S3 gap**
PRD §3.4: "Product image: **transparent PNG** of garment." All six products in `src/content/products.json` point at `.svg` files (`/products/hoodie.svg`, etc.). Works visually, but violates the spec and the §4.2 image pipeline intent (`next/image` for PNGs; SVG reserved for logo/illustrations).

### 3.4 Landing logo sizing on mobile — **FR-R1 partial**
PRD §3.5: "logo reduced to 240px" on mobile. Current implementation uses `w-[70vw] max-w-[420px]` (`src/app/page.tsx:19`). On a 375px viewport that renders ~262px, not 240px. Close, but not spec-exact — decide whether to lock mobile width to `min(240px, 70vw)`.

### 3.5 `FR-G4` logo-path wiring (see 3.1) — same issue logged separately here for the acceptance checklist traceability: swapping `brandName` works (`layout.tsx` metadata, `Nav`, `SocialRow` aria), but logo does not.

### 3.6 Acceptance verification not executed
No evidence in the repo that any of the §6.1 gates have been run:
- `npm run lint` / `npm run typecheck` results unknown.
- Lighthouse ≥90 mobile, Accessibility ≥95 not measured.
- 375 / 768 / 1280 / 1920 breakpoints not manually verified.
This is not a code gap but a QA gap that must close before v1 ships.

---

## 4. Not Started

### 4.1 Firebase App Hosting deployment — PRD §4.2 + §7.1 step 1
No `apphosting.yaml`, no `firebase.json`, no `.firebaserc`, no GitHub Actions workflow, no evidence of a live `.hosted.app` URL. The global rule "Deploy Before Features" was not followed. Nothing has been shipped.

### 4.2 `next.config.ts` `images.remotePatterns` hardening — PRD §4.6
Need to inspect/lock `next.config.ts` to strict `remotePatterns` (empty or Unsplash-only). Currently untouched from scaffold default.

### 4.3 Product hover scale on **touch** — §6.2 edge case
PRD: "Touch device: … hover states map to `:active`." `ProductTile` and `BarButton` use `whileHover` only; no `:active` / `whileTap` fallback for touch. Landing bar-buttons on iOS won't show the fill.

### 4.4 Framer Motion code-splitting — PRD §4.5
"Framer Motion imports code-split via dynamic `import()` where not needed in RSC." All components that use `motion` are currently eagerly imported client components. Bundle budget (<120 KB gzip on landing) is unverified.

### 4.5 Product images as transparent PNGs — see 3.3
Swap of asset pipeline — listed separately since producing the PNGs is a design/content task, not just a code change.

### 4.6 Context7 pre-implementation verification — global rule + PRD §7.5
No trace of Context7 lookups for Next.js 15 `AnimatePresence`, Framer Motion `motion/react` entry, Tailwind v4 tokens. The code looks correct but the global rule requires explicit verification before external-library work.

---

## 5. Priority Order

Ranked by (a) blocking other work, (b) PRD acceptance weight, (c) user-visible impact.

| # | Item | Why it's ranked here |
|---|---|---|
| **P0** | 4.1 Firebase App Hosting deploy | Violates "Deploy Before Features" rule; every further commit should auto-deploy. Nothing is live. |
| **P0** | 3.6 Run `npm run lint` + `npm run typecheck` | Cheap, gates every other task, required by §6.1. |
| **P1** | 3.1 `Logo.tsx` honor `siteConfig.logoSvgPath` | Breaks FR-G4 acceptance ("config change reflects everywhere"). |
| **P1** | 3.2 Nav centered | Visible layout mismatch with PRD wireframe on every internal page. |
| **P2** | 4.3 Touch `:active` fallback for fill + tile hover | PRD edge case; without it the brand's signature interaction is invisible on mobile (primary persona is 18–25 IG/TikTok). |
| **P2** | 3.4 Landing logo 240px mobile lock | Small numeric deviation; one-line fix. |
| **P3** | 3.3 / 4.5 Transparent PNG product art | Content/asset task; swap when real product photos exist. |
| **P3** | 4.2 `next.config.ts` image allowlist | Low risk today (no remote images), but check in before any remote source is added. |
| **P3** | 4.4 Framer Motion bundle audit | Verify after Lighthouse run; optimize only if <120 KB budget is blown. |
| **P4** | 4.6 Context7 verification pass | Defensive confirmation; code is working, so lowest urgency. |

---

## 6. Next Steps — Actionable

1. **Run the gate (5 min).** `npm run lint && npm run typecheck && npm run build`. Record results. Fix anything that isn't green.
2. **Wire Firebase App Hosting.** Ask Ahmed for GitHub org/username per global rule, create repo, push, add `apphosting.yaml`, connect via Firebase Console (browser method, not CLI per global stack rules), confirm `.hosted.app` URL loads the landing page.
3. **Fix `Logo.tsx`** (`src/components/Logo.tsx`): replace hardcoded `<path>` block with `<img src={siteConfig.logoSvgPath} alt={siteConfig.brandName} />` sized via existing wrapper. Verify `public/logo.svg` renders on `/`.
4. **Fix `Nav.tsx`** (`src/components/Nav.tsx:16`): restructure to three columns — `grid grid-cols-3` with wordmark in col 1, nav centered in col 2, empty col 3 — to match FR-H1 wireframe.
5. **Add touch/active fallback** to `BarButton.tsx` and `ProductTile.tsx`: add `whileTap` matching `whileHover`, so the fill sweep triggers on tap on touch devices.
6. **Lock mobile logo width** (`src/app/page.tsx:19`): change wrapper to `w-[min(240px,70vw)] sm:w-[420px]` (or equivalent) to exactly hit FR-R1.
7. **Lighthouse run** on the deployed URL; confirm Performance ≥ 90 mobile, Accessibility ≥ 95. Only pursue 4.4 (code-split Framer Motion) if the performance budget is breached.
8. **Manual breakpoint QA** at 375 / 768 / 1280 / 1920. Capture screenshots of `/` and `/shop` for the PR description.
9. **Swap product art** to transparent PNGs once real assets arrive; update `products.json` paths, keep fallback SVG untouched.

---

**End of gap analysis.**
