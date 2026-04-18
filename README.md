# Underground

A streetwear brand template. Minimalist, a bit rude, built like a real shop.

Six routes, a working cart, real product pages, a lookbook that does not look like a placeholder. No Stripe, no backend. Drop in your API keys and ship.

## What you get

**Landing** - big logo, four buttons, live clock at the top. The buttons fill left to right on hover. That fill is the signature interaction and it gets reused across the site.

**Home** - hero photo, tagline, featured grid with three products, newsletter box at the bottom.

**Shop** - products float at seeded random angles against a near-black background. Click one, get a full product page.

**Product detail** - gallery with thumbnails, description, fabric notes, size buttons, quantity stepper, ADD TO CART. Related pieces at the bottom.

**Cart** - slide-in drawer from the right, full cart page with a summary card. Persists in localStorage across refreshes.

**Lookbook** - editorial grid, varied aspect ratios. Feels like a magazine.

**Pre-order** - proper form. Name, email, phone, piece, size, notes. Client-side validation, success state.

**Contact** - name, email, topic chips, message. Same deal.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To ship:

```bash
npm run lint
npm run typecheck
npm run build
```

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- Framer Motion for animation
- next/font for Inter + JetBrains Mono

No UI library, no state manager, no CMS. Everything is files.

## Customize

### Brand

Edit `src/config/site.config.ts`. Name, logo path, taglines, colors, socials. Changing `brandName` updates the metadata title, navigation, and contact page everywhere.

Logo is `public/logo.svg`. The `Logo` component reads it server-side and inlines the markup into the HTML so it never blinks.

### Products

`src/content/products.json`. Each product needs an id, name, priceEGP, image, and gallery. Everything else is optional. Add a new product, it shows up. No rebuild step, no deploy dance.

```json
{
  "id": "my-new-piece-01",
  "name": "CARDIGAN",
  "priceEGP": 2200,
  "image": "https://.../photo.jpg",
  "gallery": ["https://.../1.jpg", "https://.../2.jpg"],
  "category": "other",
  "description": "Chunky knit, hand-finished seams.",
  "fabric": "Merino blend",
  "sizes": ["S", "M", "L"]
}
```

If you set `"signature": true` the piece renders isolated at the bottom of the shop with a caption. One per drop is the idea.

Images can be local (`/products/mine.jpg` in `public/`) or remote. Remote hosts need to be allowed in `next.config.ts` under `images.remotePatterns`.

### Lookbook

`src/content/lookbook.json`. Season title, subtitle, credits, and an array of shots with `aspect` and optional `span` for the grid layout.

### Forms

Pre-order, contact, newsletter all have a `// TODO(template-buyer):` comment where the submit handler currently fakes a 600ms delay. Wire it to your own endpoint. Good candidates:

- Resend or Postmark for contact emails
- Formspree or Basin if you do not want a backend
- ConvertKit or Mailchimp for the newsletter
- Stripe + an API route for real checkout

The cart is client-side. The `/cart` "Checkout" button routes to `/pre-order` today. Swap that link for a real payment flow when you add one.

## Project layout

```
src/
  app/
    layout.tsx        root, cursor and cart live here
    page.tsx          landing
    home/             about + featured
    shop/
      page.tsx        grid
      [id]/           product detail
    cart/             cart page
    lookbook/
    pre-order/
    contact/
  components/
    BarButton.tsx     the signature fill button, reuse it everywhere
    CartDrawer.tsx
    Cursor.tsx        custom white-dot cursor
    FormField.tsx
    Logo.tsx
    Nav.tsx
    Newsletter.tsx
    PageTheme.tsx     sets html[data-theme] so dark pages do not flash
    PageTransition.tsx
    ProductTile.tsx
    SocialRow.tsx
    Timestamp.tsx     live clock on landing
  config/
    site.config.ts    brand config
  content/
    products.json
    lookbook.json
  lib/
    cart.tsx          cart context + localStorage
    lookbook.ts
    products.ts       Product type + find helper
    seededRotation.ts deterministic rotation per product id
```

## Design notes

- Off-white `#F5F4F0` for the light surfaces, near-black `#0A0A0A` for shop and lookbook.
- Mobile breakpoint is 768px (`md:`), not 640px. The PRD specifies this and one bug in the past crossed the wires.
- The signature button fills left to right at 500ms with a 100ms-delayed label color flip. Do not reinvent this, use `<BarButton>`.
- Product tile rotation uses a seeded PRNG keyed by product id so server and client produce the same angle. Never use `Math.random()` for per-product visuals, it will cause hydration warnings.
- Reduced-motion is respected everywhere: parallax disables, fills snap instant, transitions fade only.
- Custom cursor hides on touch devices.

## Deploy

Static-friendly. Every route generates a static page at build time including the six product detail routes under `/shop/[id]`. Works on Vercel, Netlify, Firebase App Hosting, Cloudflare Pages, anywhere that runs `next build`.

If you want the forms to actually send mail, you will need a backend or a form service. The template does not assume one.

## License

Commercial template. Buyer license, one brand per seat. If you are reading this on GitHub without a license, it is a preview.

## Credits

Product and lookbook photography via Unsplash (free for commercial use, no attribution required but credit the photographers when you can). Replace with your own shots before you launch.
