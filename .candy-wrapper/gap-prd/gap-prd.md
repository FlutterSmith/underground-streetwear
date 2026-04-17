# Gap Analysis — Underground Streetwear Brand Site

**Date:** 2026-04-18
**PRD:** `docs/prd/2026-04-18-streetwear-brand-site.md`
**Branch:** `main`
**Scope:** Fresh audit of current codebase vs. PRD v1.0

---

## 1. Executive Summary

**Status:** ~95% of functional PRD requirements are implemented and wired end‑to‑end.

The scaffold, design tokens, config, data model, all six routes, signature bar‑button interaction, page transitions, custom cursor, live timestamp, inline logo, parallax About page, seeded shop grid with signature highlight, responsive breakpoints, reduced‑motion handling, focus rings, alt text, and edge cases (empty catalog, missing image fallback, SSR‑safe clock) are all present and correct.

Remaining work is almost entirely **verification / quality gates** from §6 of the PRD (Lighthouse budget, cross‑viewport manual QA, deployment confirmation) plus a handful of small fidelity nits in existing components. There is no missing feature area.

Lint passes clean (`next lint` → 0 errors/warnings). Typecheck passes clean (`tsc --noEmit` → 0 issues).

---

## 2. Completed Features (PRD FR → code)

### 2.1 Global (§3.1)
| FR | Status | Evidence |
|---|---|---|
| FR‑G1 Custom cursor (8px → 24px, touch‑disabled) | ✅ | `src/components/Cursor.tsx:5-55` — `(hover: hover)` gate, interactive‑target detection, `mix-blend-difference` dot |
| FR‑G2 BarButton signature fill | ✅ | `src/components/BarButton.tsx:17-47` — `scaleX 0→1`, `transform-origin:left`, 500ms, label color inverts with 100ms delay |
| FR‑G3 Page transitions (fade + y:12→0, 0.4s, cubic ease) | ✅ | `src/components/PageTransition.tsx:9-18` — `AnimatePresence mode="wait"`, exact ease `[0.22,1,0.36,1]` |
| FR‑G4 `site.config.ts` | ✅ | `src/config/site.config.ts:11-26` — brandName, logoSvgPath, taglines (2), colors, socials (5) |
| FR‑G5 Products from JSON | ✅ | `src/content/products.json` + `src/lib/products.ts` (typed loader) |

### 2.2 Landing `/` (§3.2)
| FR | Status | Evidence |
|---|---|---|
| FR‑L1 `#F5F4F0`, centered, min‑h 100vh | ✅ | `src/app/page.tsx:15` |
| FR‑L2 Live timestamp `MM/DD/YYYY, h:mm:ss A`, 1s tick, SSR‑safe | ✅ | `src/components/Timestamp.tsx:5-32` (empty → hydrate → `setInterval 1000`) |
| FR‑L3 Inline graffiti SVG, 70vw/420px | ✅ | `src/components/Logo.tsx:6-32` (inlined via `fs.readFileSync`); sizing at `src/app/page.tsx:19` |
| FR‑L4 4 × 320×48 bar‑buttons, correct labels | ✅ | `src/app/page.tsx:6-32`, `BarButton.tsx:33-36` |
| FR‑L5 Hover sweep | ✅ | `BarButton.tsx:41-43` |
| FR‑L6 Routes to `/shop /contact /lookbook /pre-order` | ✅ | All four page files present |
| FR‑L7 Social row fb/ig/yt/tt/x, 20px, 1.15x hover | ✅ | `src/components/SocialRow.tsx:30-51` |
| FR‑L8 No header/footer on landing | ✅ | `src/app/page.tsx` has no `<Nav>` / footer |

### 2.3 Home / About `/home` (§3.3)
| FR | Status | Evidence |
|---|---|---|
| FR‑H1 Light bg, wordmark left, center nav | ✅ | `src/components/Nav.tsx:16-28` grid layout |
| FR‑H2 Two‑column hero with eye SVG | ✅ | `src/app/home/page.tsx:28-84` |
| FR‑H3 Parallax via `useScroll` + `useTransform`, 0.5x, text static, hover‑gated | ✅ | `src/app/home/page.tsx:11-22,38` |

### 2.4 Shop `/shop` (§3.4)
| FR | Status | Evidence |
|---|---|---|
| FR‑S1 `#0A0A0A`, white text | ✅ | `src/app/shop/page.tsx:11,21` |
| FR‑S2 Loose 3/2/1 grid, seeded rotation `[-8°,+8°]` | ✅ | `src/app/shop/page.tsx:29`; `src/lib/seededRotation.ts:19-22` uses `mulberry32`‑style PRNG seeded by `product.id` — deterministic SSR/CSR |
| FR‑S3 Transparent imagery, no card | ✅ | `src/components/ProductTile.tsx:26-48` |
| FR‑S4 Hover `scale 1.05 rotate 0` | ✅ | `ProductTile.tsx:34` |
| FR‑S5 Name small caps + `— LE {price} EGP` mono | ✅ | `ProductTile.tsx:13-15,50-56` |
| FR‑S6 `signature:true` isolated + caption | ✅ | `src/app/shop/page.tsx:37-46`; `products.json` signature entry with `caption` |

### 2.5 Responsive (§3.5) & A11y (§4.7)
| FR | Status | Evidence |
|---|---|---|
| FR‑R1 Mobile vertical, logo 240px, full‑width buttons | ✅ | `src/app/page.tsx:19-31`; `BarButton.tsx:33-36` |
| FR‑R2 No hamburger | ✅ | `Nav.tsx:16-28` always visible |
| FR‑R3 Cursor disabled on `no-hover` | ✅ | `Cursor.tsx:9-10` |
| `prefers-reduced-motion` | ✅ | `globals.css:29-38`, `useReducedMotion()` in BarButton/PageTransition/ProductTile/home |
| Alt text | ✅ | Logo `aria-label`, product `alt`, socials `aria-label`, eye `aria-label` |
| Focus rings | ✅ | `globals.css:40-43` + `focus-visible:ring-2` on BarButton and SocialRow |

### 2.6 Edge Cases (§6.2)
| Scenario | Status | Evidence |
|---|---|---|
| Empty `products.json` → "DROP LOADING…" | ✅ | `src/app/shop/page.tsx:9-18` |
| Missing product image → fallback SVG | ✅ | `ProductTile.tsx:11,46`; `public/fallback-garment.svg` present |
| Timestamp hydration safety | ✅ | `Timestamp.tsx:19-25` renders `\u00A0` placeholder server‑side |
| Inline logo, no flash | ✅ | `Logo.tsx:6-31` RSC reads file at build, inlines via `dangerouslySetInnerHTML` |

### 2.7 Stub routes (§7.1 step 8)
- `src/app/contact/page.tsx` — Nav + headline + `mailto:` + 2× `<BarButton>` ✅
- `src/app/lookbook/page.tsx` — Nav + placeholder + BarButton ✅
- `src/app/pre-order/page.tsx` — Nav + placeholder + BarButton ✅

---

## 3. Partially Completed

These are either fidelity nits or Acceptance‑Criteria checks that have not been *verified* even though the underlying code appears correct.

| Item | PRD ref | Gap | Action |
|---|---|---|---|
| ProductTile hover transition duration | FR‑S4 "300ms ease‑out" | `ProductTile.tsx:34` relies on Framer Motion's default spring for `whileHover`, not an explicit `transition={{ duration: 0.3, ease: "easeOut" }}`. Behavior is close but not spec‑exact. | Add explicit `transition` prop to the `whileHover` motion object. |
| Landing product stagger on `/shop` entry | §5.4 "products settle to their rotated positions with a 100ms stagger" | Tiles animate individually on mount but there is no orchestrated stagger container (no `staggerChildren` / index‑based delay). | Wrap the grid in a `motion` parent with `variants` + `staggerChildren: 0.1`, switch tiles to `variants`. |
| Lighthouse ≥ 90 mobile / A11y ≥ 95 | §4.5, §6.1 | Not measured in this audit. | Run `chrome-devtools lighthouse_audit` on deployed or local prod build. |
| LCP < 2.0s on Fast 3G, landing JS < 120 KB gzip | §4.5 | Not measured. | `next build` → inspect route bundle sizes; trace LCP. |
| Framer Motion code‑split / `motion/react` | §4.5, §7.2 | Current imports are plain `"framer-motion"` across components (`BarButton`, `Cursor`, `PageTransition`, `ProductTile`, `home/page.tsx`). No dynamic `import()` gating. | Consider switching to `motion/react` tree‑shakeable entry or `dynamic(() => import(...), { ssr: false })` for heavy client‑only pieces if bundle budget is violated. |
| Cross‑viewport manual verification (375 / 768 / 1280 / 1920) | §6.1 | Not executed in this audit. | Open each breakpoint in browser; screenshot. |
| Firebase App Hosting deployment | §4.2, §7.1 step 1 | No `firebase.json` / `apphosting.yaml` in repo; unclear if live `.hosted.app` URL exists. | Confirm deploy pipeline or create it per global rule "Deploy Before Features". |
| "Social row 20px black icons" | FR‑L7 | Current icons inherit `currentColor` from parent `<a class="text-black">`; effectively black on the landing light background, but the color is not hard‑pinned. | Acceptable; note for future theme re‑use. |

---

## 4. Not Started

Nothing from §3 (Functional) or §4 (Technical) is untouched.

The only PRD items with no code representation are those explicitly called out as **Out of Scope v1** (§7.4): cart/checkout, CMS, i18n, auth, analytics. No action required.

---

## 5. Priority Order

Ranked by remaining value / blocking nature:

1. **Verify Acceptance Criteria (§6.1).** Run Lighthouse, check bundle sizes, manually sweep 4 viewports. This is the last gate before "Done".
2. **Confirm / configure Firebase App Hosting deploy.** Global rule ("Deploy Before Features") and PRD §4.2 both require a live URL; no hosting config is in‑repo.
3. **Add explicit `transition: { duration: 0.3, ease: "easeOut" }` on ProductTile `whileHover`.** Tiny, spec‑accurate.
4. **Add 100 ms stagger to the shop grid mount animation.** Polish called out in user‑flow section §5.4.
5. **Bundle / `motion/react` audit** — only if the 120 KB gzip landing budget (§4.5) is breached after step 1.

---

## 6. Next Steps (Actionable)

- [ ] `npm run build` → record per‑route First Load JS; compare landing route against 120 KB gzip budget.
- [ ] Run Lighthouse (mobile, throttled) on `/`, `/home`, `/shop`; capture Performance and Accessibility scores; file issues only if < 90 / < 95.
- [ ] Visually QA `/`, `/home`, `/shop`, `/contact`, `/lookbook`, `/pre-order` at 375, 768, 1280, 1920; verify no hamburger, logo sizing, bar‑button width switch, parallax on desktop only.
- [ ] `src/components/ProductTile.tsx:34` — add explicit `transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}` alongside the `whileHover` target.
- [ ] `src/app/shop/page.tsx:29` — wrap grid in `motion.div` with `variants={{ show: { transition: { staggerChildren: 0.1 } } }}`; convert `ProductTile` initial/animate to `variants`.
- [ ] Verify or create Firebase App Hosting config (`apphosting.yaml`) and confirm `.hosted.app` URL renders current `main`.
- [ ] After 1–3 are green, tick all boxes in PRD §6.1 and close the gap.

---

**End of gap analysis.**
