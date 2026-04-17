# Gap Analysis — Streetwear Brand Site

**PRD:** `docs/prd/2026-04-18-streetwear-brand-site.md`
**Created:** 2026-04-18
**Status:** Scaffolding pending

---

## Current State of Codebase

The project directory `C:\code\marketWebsite\` is effectively **empty**:

- `docs/prd/2026-04-18-streetwear-brand-site.md` — the PRD (do not edit)
- `.candy-wrapper/` — planning/notes folders only
- **No** `package.json`, **no** `src/`, **no** Next.js scaffold, **no** git repo
- Not yet initialized as a git repo, no GitHub remote, no Firebase project

## PRD Requirements Summary

- Next.js 15 App Router + TypeScript + Tailwind v4 + Framer Motion v11
- 6 routes: `/`, `/home`, `/shop`, `/contact`, `/lookbook`, `/pre-order`
- Signature left-to-right fill BarButton
- Custom 8px cursor (hover-capable devices only)
- Live monospace timestamp on landing
- Deterministic rotated product grid (seeded mulberry32) on /shop
- Parallax eye illustration on /home
- Editable via `src/config/site.config.ts` + `src/content/products.json`
- Deploy: Firebase App Hosting (`.hosted.app`)
- Lighthouse Perf ≥ 90, A11y ≥ 95
- Honors `prefers-reduced-motion` and `hover: hover`

## Gap: Everything

Literally nothing is built yet. Full implementation required.

---

## Implementation Plan (aligned with PRD §7.1 build order)

### Phase 0 — Preflight (blocked on user input)
- [ ] Confirm GitHub org/username for repo creation
- [ ] Confirm whether to deploy to Firebase App Hosting now or build locally first

### Phase 1 — Scaffold
- [ ] `npx create-next-app@latest . --typescript --tailwind --eslint --app --use-npm`
- [ ] Initialize git repo, first commit
- [ ] Push to GitHub
- [ ] (Optional) Wire Firebase App Hosting, confirm live URL

### Phase 2 — Foundations
- [ ] Tailwind v4 design tokens (`--bg-light`, `--bg-dark`, `--ink`, `--paper`)
- [ ] `next/font` loader: Inter + JetBrains Mono
- [ ] `src/config/site.config.ts` (brand, tagline, colors, socials)
- [ ] `src/content/products.json` (seed 5–8 products, 1 signature)
- [ ] `src/lib/seededRotation.ts` (mulberry32 PRNG keyed by product id)

### Phase 3 — Landing (/)
- [ ] `Timestamp.tsx` — SSR-safe, empty placeholder → ticks on mount
- [ ] `Logo.tsx` — inline SVG (graffiti placeholder at `/public/logo.svg`)
- [ ] `BarButton.tsx` — signature fill animation
- [ ] `SocialRow.tsx` — 20px icons, 1.15x hover scale
- [ ] `app/page.tsx` — compose landing per wireframe

### Phase 4 — Global concerns
- [ ] `Cursor.tsx` — rAF-driven, gated by `(hover: hover)`
- [ ] `PageTransition.tsx` — fade+slide via AnimatePresence
- [ ] Root `layout.tsx` wires cursor + transitions + fonts

### Phase 5 — Remaining routes
- [ ] `/home` — two-col hero + parallax eye SVG
- [ ] `/shop` — deterministic rotated grid + signature piece isolated
- [ ] `/contact`, `/lookbook`, `/pre-order` — minimal BarButton-based stubs

### Phase 6 — Polish
- [ ] `prefers-reduced-motion` handling in all motion components
- [ ] Mobile verification (375, 768) and desktop (1280, 1920)
- [ ] Lint / typecheck clean
- [ ] Lighthouse pass
- [ ] Edge cases: missing image fallback, empty products.json → "DROP LOADING…"

---

## Progress Log

- **2026-04-18** — Created gap analysis. Awaiting user confirmation on GitHub org + deploy-now preference before scaffolding.

---

## Context7 Calls Needed (per global rule)

Before writing code for each, verify current syntax via Context7:
- Next.js 15 App Router + Framer Motion `AnimatePresence` integration pattern
- `framer-motion` vs `motion/react` import path (v11+)
- `next/font/google` self-hosted Inter + JetBrains Mono
- Tailwind v4 `@theme` / `@import` token syntax
