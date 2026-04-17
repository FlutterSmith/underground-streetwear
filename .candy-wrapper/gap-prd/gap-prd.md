# Gap Analysis — Underground Streetwear Brand Website

**Date:** 2026-04-18
**PRD:** `docs/prd/2026-04-18-streetwear-brand-site.md`
**Scope:** Full-codebase audit against PRD v1.0.

---

## 1. Executive Summary

The v1 codebase is **substantially complete** against the PRD's functional surface. All six routes exist, the signature BarButton fill animation works, the catalog is grid-rendered with deterministic seeded rotations, and `site.config.ts` + `products.json` drive content without component edits. Design tokens, fonts, reduced-motion handling, and focus rings are all wired.

Remaining gaps are concentrated in (a) **verification / Definition-of-Done items** (Lighthouse score, cross-device checks, deployment confirmation), (b) **minor spec drift** in a few hard-coded values (grid breakpoints, hover easing, cursor-hit selectors), and (c) **infrastructure not yet present** (Firebase App Hosting wiring, `public/fallback-garment.svg` verified but no remote image pattern config populated).

**Rough completion: ~85% of functional requirements; ~60% of acceptance criteria verifiably met.**

---

## 2. Completed Features

### Global (FR-G1 … FR-G5)
- **FR-G1 — Custom cursor.** `src/components/Cursor.tsx` uses `matchMedia('(hover: hover)')` to disable on touch, direct-ref `transform` in a `requestAnimationFrame` loop (no React re-render on mousemove), and scales 1→3 on interactive hover (8px base → 24px, matches PRD).
- **FR-G2 — Signature bar-button fill.** `src/components/BarButton.tsx` animates a `scaleX 0→1` black pseudo-layer with `transform-origin: left`, 500ms, ease `[0.65, 0, 0.35, 1]`; label color inverts with a 100ms delay. Reduced-motion branch snaps instantly.
- **FR-G3 — Page transitions.** `src/components/PageTransition.tsx` uses `AnimatePresence mode="wait"` with combined fade + `y: 12 → 0`, 0.4s, ease `[0.22, 1, 0.36, 1]`.
- **FR-G4 — Config file.** `src/config/site.config.ts` holds `brandName`, `logoSvgPath`, `taglines`, `colors`, `socials`. Consumed in `layout.tsx` metadata, `Logo.tsx`, `SocialRow.tsx`, `Nav.tsx`, `home/page.tsx`, `contact/page.tsx`.
- **FR-G5 — Products from JSON.** `src/content/products.json` feeds `src/lib/products.ts`, consumed in `app/shop/page.tsx`.

### Landing `/` (FR-L1 … FR-L8)
- Background `#F5F4F0` via `--color-bg-light` token; min-h-screen centered stack (`app/page.tsx:15`).
- Live timestamp: `Timestamp.tsx` renders empty on SSR, starts `setInterval(1000)` on mount, format `MM/DD/YYYY, h:mm:ss A` — matches FR-L2 and the hydration guidance in §7.2.
- Logo (`Logo.tsx`) inlines the SVG server-side via `fs.readFileSync`, so it ships with the HTML (aligns with "Logo SVG inlined in HTML so landing has no blank flash").
- 4 stacked `BarButton`s (SHOP / CONTACT / LOOKBOOK / PRE-ORDER), 320px × 48px desktop, full-width mobile — FR-L4 ✓.
- Click routes `/shop`, `/contact`, `/lookbook`, `/pre-order` — FR-L6 ✓.
- Social row (`SocialRow.tsx`) renders 5 inline SVG icons at 20px with `hover:scale-[1.15] transition-transform duration-200` — FR-L7 ✓. All links `target="_blank" rel="noopener noreferrer"` (FR security ✓).
- No header/footer on `/` — FR-L8 ✓.

### Home `/home` (FR-H1 … FR-H3)
- Light background, top-left wordmark, top-center `Home / Catalog / Contact` nav (via `Nav.tsx`).
- Two-column grid: tagline stack left (uses `siteConfig.taglines[0]` headline + `taglines[1]` mono subtitle), hand-drawn eye SVG with dripping-lash paths right.
- Parallax: `useScroll` + `useTransform(scrollY, [0, 1000], [0, -500])`, gated by `useReducedMotion` and `matchMedia('(hover: hover)')` — matches §7.2 "Parallax on mobile typically disabled".

### Shop `/shop` (FR-S1 … FR-S6)
- Background `#0A0A0A`, white text.
- Grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` with deterministic rotation via `lib/seededRotation.ts` (FNV-1a hash → mulberry32 → ±8°). SSR and CSR produce identical angles.
- Transparent-PNG/SVG products rendered with `next/image`, no borders/cards (`ProductTile.tsx`).
- Hover: `scale: 1.05, rotate: 0`, 300ms — FR-S4 ✓.
- Caption renders `NAME` in small-caps + `— LE {price} EGP` in mono (FR-S5 ✓, reflecting the recent commit `18006fb`).
- `signature: true` product renders isolated at bottom with caption line — FR-S6 ✓.
- **Empty-catalog state** renders the "DROP LOADING…" monospace message with Nav hoisted above center (edge case §6.2 ✓, matches commit `b3f3c1f`).

### Contact / Lookbook / Pre-Order
- Minimal placeholder screens exist, each reusing `<BarButton>` and `<Nav>`, consistent with implementation note §7.1 step 8.

### Supporting Infrastructure
- `public/fallback-garment.svg` exists and is wired as `onError` fallback in `ProductTile.tsx`.
- Design tokens in `globals.css` (`--color-bg-light`, `--color-bg-dark`, `--color-ink`, `--color-paper`, font vars).
- `next/font` self-hosting `Inter` + `JetBrains Mono` via CSS variables.
- `prefers-reduced-motion` global reset in `globals.css` plus per-component `useReducedMotion` branches.
- Focus-visible 2px ring in `globals.css` (FR Accessibility ✓).

---

## 3. Partially Completed

| Area | Status | Gap |
|---|---|---|
| **FR-S2 grid breakpoints** | 1 / 2 / 3-col grid present | PRD says "3 cols desktop, 2 tablet, 1 mobile". Current uses Tailwind `sm` (640px) for 2-col and `lg` (1024px) for 3-col. Tablet breakpoint should be `md:` (768px) per FR-R1. Tile layout will flip to 2-col at 640px instead of 768px. |
| **FR-S4 easing** | Hover plays at 300ms | PRD specifies plain `ease-out`; `ProductTile.tsx:40` uses `[0.22, 1, 0.36, 1]`. Likely imperceptible but spec-drift. |
| **FR-G1 cursor selectors** | Works on most interactive elements | `Cursor.tsx:25` matches `a, button, [role="button"], input, textarea, select` but not `label` or elements with `tabindex`. Fine for this site; flag if future forms are added. |
| **FR-R2 mobile nav** | No hamburger, always visible | `Nav.tsx` uses `gap-5 sm:gap-8` — on very narrow viewports (<360px) the three items + wordmark may overflow. Not verified at 320px. |
| **Acceptance 6.1 — Lighthouse ≥ 90** | Not measured | No perf / a11y audit on record. |
| **Acceptance 6.1 — Device matrix** | Not verified | 375px / 768px / 1280px / 1920px manual check not recorded. |
| **Acceptance 6.1 — `npm run lint` / `typecheck`** | Not executed in this session | Should be run before declaring DoD. |
| **Performance budget (4.5)** | Framer Motion imports are static | PRD §4.5 suggests dynamic `import()` / `motion/react` tree-shakeable entry. Landing is an RSC, but it mounts `Cursor` + `PageTransition` (both `"use client"`), which pull full framer-motion into the landing bundle. Bundle size not measured against <120 KB gzip target. |
| **Deployment (§7.1 step 1)** | No Firebase App Hosting config | No `apphosting.yaml`, no `.firebaserc`, no `firebase.json`. Violates global "Deploy Before Features" rule — repo has been built out without a confirmed live `.hosted.app` URL. |

---

## 4. Not Started

- **Firebase App Hosting wiring.** No hosting configuration files; deployment pipeline unverified.
- **Lighthouse audit run + results recorded.** PRD targets ≥ 90 performance / ≥ 95 accessibility on mobile.
- **`npm run lint` + `npm run typecheck` evidence for DoD.** Scripts exist in `package.json` but no CI and no captured clean run.
- **JS-disabled fallback verification (§6.2).** Not tested. Buttons are `<Link>` so routing works; fill animation is purely visual. Needs a no-JS browser check or at minimum acknowledgement.
- **SEO metadata depth.** Only `title` + `description` set in `layout.tsx`. Per-route metadata, OG tags, and favicon polish not present (not explicit in PRD, but typical for a brand landing).
- **Analytics pageview pixel.** Out of scope per §7.4 but worth a placeholder decision.

---

## 5. Priority Order

Ranked by (a) whether it blocks the PRD's Definition of Done, (b) global CLAUDE.md rules, (c) risk of late rework.

1. **P0 — Stand up Firebase App Hosting and confirm a live URL.**
   Violates the "Deploy Before Features" rule in global CLAUDE.md. The longer this waits, the more likely runtime surprises (font self-hosting, `next/image` config, `fs.readFileSync` in `Logo.tsx` running in the App Hosting build environment) go uncaught.

2. **P0 — Run `npm run lint` and `npm run typecheck` and fix anything they surface.**
   Required by acceptance §6.1. Trivially fast; do first.

3. **P1 — Fix FR-S2 grid breakpoint to `md:` for the 2-col tier.**
   Small `app/shop/page.tsx` edit; brings behavior in line with FR-R1 (mobile = `< 768px`).

4. **P1 — Lighthouse mobile run + address obvious perf wins.**
   Candidates: verify framer-motion tree-shaking, confirm landing is a pure RSC, check `next/image` sizing on `ProductTile` (`sizes="(max-width: 768px) 60vw, 240px"` is reasonable), confirm priority hints.

5. **P2 — Manual device-width verification at 375 / 768 / 1280 / 1920px.**
   Especially confirm `Nav` wordmark + 3 links don't overflow at 320–360px (FR-R2 "no hamburger").

6. **P2 — Align `ProductTile` hover easing to the PRD's `ease-out`** (or document the deviation as intentional).

7. **P3 — Accessibility pass.** Keyboard-walk the landing, verify focus rings are visible against both `#F5F4F0` and `#0A0A0A` backgrounds (current `outline: 2px solid currentColor` inverts correctly on `/shop`).

8. **P3 — SEO / metadata polish.** Per-route `metadata` exports, OG image, favicon aligned to brand.

9. **P3 — JS-disabled smoke check** to satisfy §6.2.

---

## 6. Next Steps (Actionable)

- **`src/app/shop/page.tsx:31`** — change `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` to `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` to match FR-R1's 768px mobile breakpoint.
- **`next.config.ts`** — leave `images.remotePatterns: []` as-is (no remote images used); document this choice or remove the empty array.
- **`package.json`** — add `postinstall` / build hook verification once Firebase App Hosting is live, so future deploys don't silently drop `fs.readFileSync` behavior in `Logo.tsx`.
- **Create `apphosting.yaml`** at repo root with Node runtime + any required env (none currently). Add `.firebaserc`. Push, wait for `.hosted.app` URL, and record it somewhere (README or `site.config.ts` comment).
- **Run and commit:** `npm run lint`, `npm run typecheck`, and a Lighthouse mobile report. Capture Lighthouse numbers in a short note — not in a new markdown doc unless requested.
- **Verify `Cursor.tsx` on Windows touch laptops** (hybrid devices often report `hover: hover` *and* touch). If flicker is observed, gate additionally on `matchMedia('(pointer: fine)')`.
- **Audit framer-motion imports.** Confirm only `motion`, `AnimatePresence`, `useScroll`, `useTransform`, `useReducedMotion` are pulled in; consider switching to `framer-motion` v11's slim entry if bundle exceeds the 120 KB target.
- **Write a minimal `README.md`** describing how to edit `site.config.ts` and `products.json` (supports the "Owner edits catalog" user story and keeps future-you honest about the no-CMS promise).

---

**End of Gap Analysis.**
