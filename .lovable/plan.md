## Goal

Recreate the pasted `Majestic Stoff` single-file HTML site inside this TanStack Start project as the home route, apply a sitewide 40%-off sale, add free-shipping messaging everywhere, rewrite image paths to `src/images/...`, and keep the Meta Pixel intact. WhatsApp remains the only checkout.

## What I'll change

### 1. `src/routes/__root.tsx` — head + Meta Pixel
- Update title to `Majestic Stoff — Premium Menswear` and description to premium menswear copy (also update og:title, og:description, twitter tags).
- Add Google Fonts preconnect + Playfair Display / Inter stylesheet via `links`.
- Add the Meta Pixel init script (id `1999778283983910`, PageView + InitiateCheckout) via the `scripts` array so it lives in `<head>`, plus a `<noscript>` fallback image rendered in the shell body.
- Leave the router shell, QueryClient, and error/notFound boundaries untouched.

### 2. `src/routes/index.tsx` — the full site
Replace the placeholder with a single-page React component that renders the entire Majestic Stoff experience:
- One mount `<div id="app" />` plus a `<style>` block containing all the original CSS (unchanged look-and-feel: gold `#C9A961`, ivory background, Playfair headings).
- A `useEffect` that installs the original vanilla-JS state machine (products, cart, router views: home / shop / product detail / cart / WhatsApp order confirmation) onto `window` and calls `render()` — porting the JS verbatim keeps behavior identical (cart in `localStorage`, WhatsApp checkout, review submission, filters, sort, mobile nav, toast).
- Cleanup on unmount.

### 3. Sale pricing (40% off sitewide)
Add a `compareAt` field to each product = `Math.round(price * 1.4 / 50) * 50` (rounded to a clean PKR figure). Current `price` stays as the sale price so cart totals and the WhatsApp message don't change.

Rendering updates:
- `productCard`: `<span class="price-old">Rs. X</span> <span class="card-price">Rs. Y</span> <span class="price-off">40% OFF</span>` with strikethrough on `.price-old`.
- Product detail: same treatment in the buy box + `SALE — 40% OFF` ribbon on the media.
- Cart line items and order summary: show old vs new per line.
- Slim announcement bar above the navbar: `FREE SHIPPING ACROSS PAKISTAN · 40% OFF SITEWIDE · CASH ON DELIVERY`.

### 4. Free shipping messaging
- Announcement bar (above).
- Product card: small `Free Shipping` chip under price.
- Product detail: replace shipping bullet in the trust row with `Free Shipping — Pakistan-wide`.
- Cart summary: explicit `Shipping — FREE` line.
- WhatsApp checkout confirmation copy mentions free delivery.

### 5. Image paths
Rewrite every image URL from `/images/...` to `src/images/...` as requested:
- Hero background (`combo-signature-1.png`)
- Our Story (`our-story.jpeg`)
- All product `images: [...]` arrays inside `PRODUCTS`
- Favicon link (`src/images/logo.ico`)

Heads-up (not blocking): Vite does not serve `src/` as static assets — `src/images/foo.png` will 404 in the Lovable preview unless the files sit in `public/images/` or are imported. I'll use the literal `src/images/...` per your instruction; once you push the repo we can switch patterns if needed.

### 6. Meta Pixel
Kept exactly as pasted (same pixel id, same PageView + InitiateCheckout), moved into the root route head. I'll also fire `fbq('track','AddToCart')` on add-to-cart and `fbq('track','InitiateCheckout', {value, currency:'PKR'})` when the WhatsApp order button is clicked — pure additions, pixel id unchanged.

## Suggestions to lift conversions (not implemented unless you say yes)

Removed #6 (combos already cover bundles) and #10 (WhatsApp-only checkout stays). Remaining ideas:

1. **Sticky mobile ATC** on PDP with price + "Order on WhatsApp" — mobile is 80%+ of PK traffic.
2. **Urgency**: low-stock indicator ("Only 3 left in M") using the existing `oos`/stock model, plus a 24h countdown on the 40% sale banner.
3. **Floating WhatsApp button** sitewide (you already have `WHATSAPP_NUMBER`), with a pre-filled "Hi, I want to order …" message from the current product.
4. **COD confidence strip**: "Pay when it arrives · Try before you pay · Easy exchange in 7 days" on PDP and cart.
5. **Size guide modal** + fit notes ("Model wears M, height 5'11") — reduces returns and hesitation.
6. **Exit-intent popup** offering an extra 5% off for email capture → feeds the newsletter form you already have.
7. **Real photo reviews**: allow image upload on the review form and show a "Customer Photos" strip on PDP — the single biggest COD trust booster in PK.
8. **Instagram-style shoppable reels section** on home (short mp4 loops).
9. **Analytics stack**: add GA4 + TikTok Pixel + Google Merchant Center product feed (Playfair audience skews IG/TikTok).
10. **SEO**: unique meta per product route (`/product/:id`) with JSON-LD `Product` + `AggregateRating` from reviews, plus `BreadcrumbList` — currently everything is one URL, which hides you from Google.
11. **Speed**: convert product images to WebP + `srcset`, preload hero image.

Tell me which of these you want and I'll fold them in.

## Technical notes

- Site logic stays vanilla JS injected via `useEffect` — fastest faithful port, avoids a full React rewrite.
- No backend / Lovable Cloud needed — cart is `localStorage`, checkout goes to WhatsApp, reviews live in memory.
- No new npm packages required.
