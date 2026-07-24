// Majestic Stoff — full single-page site logic ported from the original HTML.
// Runs entirely on the client. Import and call `initMajesticSite()` from a
// client-side effect. Do not import at module scope from anything SSR uses.

/* eslint-disable @typescript-eslint/no-explicit-any */
import { placeOrder } from "./orders.functions";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export const MAJESTIC_CSS = `
:root{
  --bg:#FBF8F3;
  --card:#FFFFFF;
  --ivory:#F1E9D8;
  --gold:#C9A961;
  --gold-deep:#9C7A3C;
  --ink:#1F1F1F;
  --ink-soft:#6B665D;
  --line:#E6DEC9;
  --onyx:#0D0D0D;
  --whatsapp:#25D366;
  --sale:#B3453D;
  --radius:2px;
}
.majestic-root *{box-sizing:border-box;}
.majestic-root{ background:var(--bg); color:var(--ink); font-family:'Inter',sans-serif; font-size:16px; line-height:1.55; -webkit-font-smoothing:antialiased; min-height:100vh; }
.majestic-root h1,.majestic-root h2,.majestic-root h3,.majestic-root .font-display{ font-family:'Playfair Display',serif; font-weight:600; margin:0; }
.majestic-root a{color:inherit; text-decoration:none;}
.majestic-root button{font-family:inherit; cursor:pointer;}
.majestic-root img{display:block; max-width:100%;}
.majestic-root :focus-visible{ outline:2px solid var(--gold-deep); outline-offset:2px; }
.majestic-root .eyebrow{ text-transform:uppercase; letter-spacing:.14em; font-size:.72rem; color:var(--gold-deep); font-weight:600; }
.majestic-root .wrap{ max-width:1240px; margin:0 auto; padding:0 20px; }
.majestic-root .hairline{ border:none; border-top:1px solid var(--line); margin:0; }

/* Announcement bar */
.announcement{ background:var(--onyx); color:#F1E9D8; text-align:center; padding:9px 14px; font-size:.74rem; letter-spacing:.14em; text-transform:uppercase; font-weight:600; }
.announcement strong{ color:var(--gold); font-weight:700; }

/* Buttons */
.majestic-root .btn{ display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:14px 30px; font-size:.85rem; letter-spacing:.06em; text-transform:uppercase; font-weight:600; border:1px solid transparent; border-radius:var(--radius); transition:transform .15s ease, box-shadow .15s ease, background .15s ease; }
.majestic-root .btn:active{ transform:translateY(1px); }
.majestic-root .btn-gold{ background:var(--gold); color:var(--onyx); }
.majestic-root .btn-gold:hover{ background:var(--gold-deep); color:#fff; box-shadow:0 6px 18px rgba(156,122,60,.28); }
.majestic-root .btn-outline{ background:transparent; color:var(--ink); border-color:var(--ink); }
.majestic-root .btn-outline:hover{ background:var(--ink); color:#fff; }
.majestic-root .btn-full{ width:100%; }
.majestic-root .btn[disabled]{ opacity:.4; cursor:not-allowed; }
.majestic-root .btn[disabled]:hover{ background:var(--gold); color:var(--onyx); box-shadow:none; }

/* Navbar */
.majestic-root .navbar{ position:sticky; top:0; z-index:60; background:rgba(251,248,243,.92); backdrop-filter:blur(8px); border-bottom:1px solid var(--line); }
.majestic-root .nav-inner{ display:flex; align-items:center; justify-content:space-between; padding:18px 0; }
.majestic-root .logo{ font-size:1.28rem; letter-spacing:.16em; text-transform:uppercase; cursor:pointer; }
.majestic-root .nav-links{ display:none; gap:36px; font-size:.86rem; letter-spacing:.03em; }
.majestic-root .nav-links a{ position:relative; padding-bottom:4px; cursor:pointer; }
.majestic-root .nav-links a::after{ content:''; position:absolute; left:0; bottom:0; width:0; height:1px; background:var(--gold-deep); transition:width .25s ease; }
.majestic-root .nav-links a:hover::after{ width:100%; }
.majestic-root .nav-icons{ display:flex; align-items:center; gap:20px; }
.majestic-root .icon-btn{ background:none; border:none; color:var(--ink); position:relative; display:flex; padding:4px; }
.majestic-root .icon-btn:hover{ color:var(--gold-deep); }
.majestic-root .cart-badge{ position:absolute; top:-6px; right:-8px; background:var(--gold-deep); color:#fff; font-size:.62rem; font-weight:700; width:16px; height:16px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
.majestic-root .hamburger{ display:flex; }
.majestic-root .mobile-nav{ border-top:1px solid var(--line); display:flex; flex-direction:column; padding:14px 20px 20px; gap:14px; font-size:.92rem; }
@media(min-width:860px){
  .majestic-root .nav-links{ display:flex; }
  .majestic-root .hamburger{ display:none; }
}

/* Hero */
.majestic-root .hero{ position:relative; min-height:88vh; display:flex; align-items:flex-end; overflow:hidden; }
.majestic-root .hero-bg{ position:absolute; inset:0; }
.majestic-root .hero-bg img{ width:100%; height:100%; object-fit:cover; }
.majestic-root .hero-bg::after{ content:''; position:absolute; inset:0; background:linear-gradient(180deg, rgba(251,248,243,0) 0%, rgba(251,248,243,.55) 62%, rgba(251,248,243,.96) 100%); }
.majestic-root .hero-content{ position:relative; padding:0 20px 64px; width:100%; animation:majFadeUp .9s ease both; }
.majestic-root .hero-content .eyebrow{ margin-bottom:14px; display:block; }
.majestic-root .hero h1{ font-size:2.4rem; max-width:720px; line-height:1.08; color:var(--ink); }
.majestic-root .hero p{ max-width:460px; margin:18px 0 28px; color:var(--ink-soft); font-size:1.02rem; }
.majestic-root .hero-sale{ display:inline-block; background:var(--sale); color:#fff; padding:6px 12px; font-size:.72rem; letter-spacing:.14em; text-transform:uppercase; font-weight:700; margin-bottom:14px; }
@keyframes majFadeUp{ from{opacity:0; transform:translateY(18px);} to{opacity:1; transform:translateY(0);} }
@media(min-width:860px){ .majestic-root .hero h1{ font-size:3.6rem; } }

/* Sections */
.majestic-root section{ padding:80px 0; }
.majestic-root .section-head{ margin-bottom:40px; }
.majestic-root .section-head h2{ font-size:1.9rem; margin-top:10px; }
.majestic-root .ivory-section{ background:var(--ivory); }

/* Product grid & cards */
.majestic-root .grid{ display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }
@media(min-width:640px){ .majestic-root .grid{ grid-template-columns:repeat(3,1fr); } }
@media(min-width:960px){ .majestic-root .grid.grid-4{ grid-template-columns:repeat(4,1fr); } }
.majestic-root .card{ background:var(--card); cursor:pointer; }
.majestic-root .card-media{ position:relative; aspect-ratio:3/4; overflow:hidden; background:var(--ivory); }
.majestic-root .card-media img{ width:100%; height:100%; object-fit:cover; transition:transform .5s ease; }
.majestic-root .card:hover .card-media img{ transform:scale(1.045); }
.majestic-root .card-tag{ position:absolute; top:10px; left:10px; background:var(--bg); border:1px solid var(--gold); color:var(--gold-deep); font-size:.62rem; letter-spacing:.08em; text-transform:uppercase; padding:4px 8px; }
.majestic-root .card-sale{ position:absolute; top:10px; right:10px; background:var(--sale); color:#fff; font-size:.62rem; letter-spacing:.08em; text-transform:uppercase; padding:4px 8px; font-weight:700; }
.majestic-root .card-info{ padding:14px 2px; }
.majestic-root .card-info h3{ font-size:.98rem; font-weight:500; margin-bottom:4px; }
.majestic-root .price-row{ display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; }
.majestic-root .card-price{ color:var(--gold-deep); font-weight:600; font-size:.96rem; }
.majestic-root .price-old{ color:var(--ink-soft); text-decoration:line-through; font-size:.82rem; }
.majestic-root .price-off{ color:var(--sale); font-weight:700; font-size:.72rem; letter-spacing:.05em; }
.majestic-root .ship-chip{ display:inline-flex; align-items:center; gap:6px; margin-top:6px; font-size:.72rem; color:var(--ink-soft); }
.majestic-root .ship-chip::before{ content:'✓'; color:var(--gold-deep); font-weight:700; }

/* Brand story */
.majestic-root .story{ display:grid; grid-template-columns:1fr; gap:34px; align-items:center; }
.majestic-root .story img{ width:100%; aspect-ratio:4/5; object-fit:cover; }
@media(min-width:860px){ .majestic-root .story{ grid-template-columns:1fr 1fr; gap:64px; } }
.majestic-root .story blockquote{ font-family:'Playfair Display',serif; font-size:1.5rem; line-height:1.4; margin:0 0 18px; }

/* Testimonials */
.majestic-root .testi-track{ display:flex; gap:20px; overflow-x:auto; scroll-snap-type:x mandatory; padding-bottom:6px; }
.majestic-root .testi-card{ scroll-snap-align:start; flex:0 0 82%; background:var(--card); border:1px solid var(--line); padding:26px; }
@media(min-width:640px){ .majestic-root .testi-card{ flex:0 0 46%; } }
@media(min-width:960px){ .majestic-root .testi-card{ flex:0 0 31%; } }
.majestic-root .stars{ color:var(--gold); font-size:.9rem; letter-spacing:2px; margin-bottom:10px; }
.majestic-root .testi-name{ margin-top:14px; font-size:.85rem; font-weight:600; }
.majestic-root .testi-product{ font-size:.78rem; color:var(--ink-soft); }

/* Footer */
.majestic-root footer{ background:var(--onyx); color:#EDE9DF; padding:60px 0 26px; }
.majestic-root .footer-grid{ display:grid; grid-template-columns:1fr; gap:36px; }
@media(min-width:760px){ .majestic-root .footer-grid{ grid-template-columns:1.4fr 1fr 1.2fr; gap:24px; } }
.majestic-root .footer-grid h4{ font-family:'Inter',sans-serif; font-size:.78rem; letter-spacing:.1em; text-transform:uppercase; color:var(--gold); margin-bottom:16px; font-weight:600; }
.majestic-root .footer-grid ul{ list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; font-size:.88rem; color:#C9C5BA; }
.majestic-root .footer-grid ul a{ cursor:pointer; }
.majestic-root .footer-grid p{ color:#B9B4A7; font-size:.9rem; max-width:320px; }
.majestic-root .newsletter-row{ display:flex; margin-top:6px; border:1px solid #3A3833; }
.majestic-root .newsletter-row input{ flex:1; background:transparent; border:none; padding:12px 12px; color:#fff; font-size:.85rem; }
.majestic-root .newsletter-row input::placeholder{ color:#8A867B; }
.majestic-root .newsletter-row button{ background:var(--gold); border:none; color:var(--onyx); padding:0 16px; font-weight:600; }
.majestic-root .socials{ display:flex; gap:14px; margin-top:18px; }
.majestic-root .socials a{ width:34px; height:34px; border:1px solid #3A3833; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#EDE9DF; }
.majestic-root .socials a:hover{ border-color:var(--gold); color:var(--gold); }
.majestic-root .footer-bottom{ text-align:center; color:#7A766B; font-size:.78rem; margin-top:44px; border-top:1px solid #2A2823; padding-top:22px; }

/* WhatsApp float */
.wa-float{ position:fixed; bottom:22px; right:22px; z-index:80; width:56px; height:56px; border-radius:50%; background:var(--whatsapp); display:flex; align-items:center; justify-content:center; box-shadow:0 8px 22px rgba(0,0,0,.22); }
.wa-float::before{ content:''; position:absolute; inset:0; border-radius:50%; background:var(--whatsapp); animation:majPulse 2.2s ease-out infinite; z-index:-1; }
@keyframes majPulse{ 0%{ transform:scale(1); opacity:.55; } 100%{ transform:scale(1.9); opacity:0; } }

/* Toast */
.maj-toast{ position:fixed; left:50%; bottom:28px; transform:translateX(-50%) translateY(20px); background:var(--onyx); color:#fff; padding:13px 22px; font-size:.86rem; border-radius:2px; opacity:0; pointer-events:none; transition:opacity .25s ease, transform .25s ease; z-index:200; }
.maj-toast.show{ opacity:1; transform:translateX(-50%) translateY(0); }

/* Page head */
.majestic-root .page-head{ padding:40px 0 0; }
.majestic-root .page-head h1{ font-size:2rem; }

/* Shop layout */
.majestic-root .shop-layout{ display:grid; grid-template-columns:1fr; gap:30px; }
@media(min-width:900px){ .majestic-root .shop-layout{ grid-template-columns:220px 1fr; gap:40px; } }
.majestic-root .filters-desktop{ display:none; }
@media(min-width:900px){ .majestic-root .filters-desktop{ display:block; } }
.majestic-root .filter-group{ margin-bottom:30px; }
.majestic-root .filter-group h4{ font-size:.78rem; letter-spacing:.08em; text-transform:uppercase; margin-bottom:14px; }
.majestic-root .pill-list{ display:flex; flex-wrap:wrap; gap:8px; }
.majestic-root .pill{ border:1px solid var(--line); background:var(--card); padding:7px 13px; font-size:.8rem; border-radius:20px; }
.majestic-root .pill.active{ background:var(--ink); border-color:var(--ink); color:#fff; }
.majestic-root .shop-toolbar{ display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; gap:12px; }
.majestic-root .filter-toggle{ display:flex; align-items:center; gap:8px; border:1px solid var(--ink); padding:9px 16px; font-size:.82rem; background:var(--card); }
@media(min-width:900px){ .majestic-root .filter-toggle{ display:none; } }
.majestic-root select{ font-family:inherit; padding:9px 12px; border:1px solid var(--line); background:var(--card); font-size:.82rem; }
.majestic-root .mobile-drawer{ position:fixed; inset:0; z-index:100; display:none; }
.majestic-root .mobile-drawer.open{ display:block; }
.majestic-root .drawer-backdrop{ position:absolute; inset:0; background:rgba(13,13,13,.4); }
.majestic-root .drawer-panel{ position:absolute; left:0; right:0; bottom:0; background:var(--bg); padding:24px 20px 30px; max-height:80vh; overflow:auto; border-radius:10px 10px 0 0; }
.majestic-root .drawer-head{ display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }

/* Product detail */
.majestic-root .pd-layout{ display:grid; grid-template-columns:1fr; gap:40px; }
@media(min-width:900px){ .majestic-root .pd-layout{ grid-template-columns:1.1fr 1fr; gap:60px; } }
.majestic-root .pd-main-image{ position:relative; aspect-ratio:3/4; overflow:hidden; background:var(--ivory); }
.majestic-root .pd-main-image img{ width:100%; height:100%; object-fit:cover; }
.majestic-root .pd-ribbon{ position:absolute; top:14px; left:14px; background:var(--sale); color:#fff; padding:6px 12px; font-size:.72rem; letter-spacing:.14em; text-transform:uppercase; font-weight:700; }
.majestic-root .pd-thumbs{ display:flex; gap:10px; margin-top:10px; }
.majestic-root .pd-thumb{ width:64px; height:80px; overflow:hidden; border:1px solid var(--line); opacity:.6; cursor:pointer; }
.majestic-root .pd-thumb.active{ opacity:1; border-color:var(--gold-deep); }
.majestic-root .pd-thumb img{ width:100%; height:100%; object-fit:cover; }
.majestic-root .pd-price-row{ display:flex; align-items:baseline; gap:14px; margin:10px 0 8px; flex-wrap:wrap; }
.majestic-root .pd-price{ font-size:1.5rem; color:var(--gold-deep); font-weight:600; }
.majestic-root .pd-price-old{ font-size:1.05rem; color:var(--ink-soft); text-decoration:line-through; }
.majestic-root .pd-price-off{ background:var(--sale); color:#fff; padding:3px 9px; font-size:.72rem; letter-spacing:.06em; font-weight:700; }
.majestic-root .pd-freeship{ display:inline-flex; align-items:center; gap:8px; background:var(--ivory); border-left:3px solid var(--gold); padding:10px 14px; font-size:.82rem; margin-bottom:22px; }
.majestic-root .size-grid{ display:flex; flex-wrap:wrap; gap:10px; margin-bottom:26px; }
.majestic-root .size-box{ width:48px; height:44px; display:flex; align-items:center; justify-content:center; border:1px solid var(--line); font-size:.85rem; background:var(--card); cursor:pointer; }
.majestic-root .size-box.selected{ border-color:var(--ink); background:var(--ink); color:#fff; }
.majestic-root .size-box.oos{ opacity:.35; text-decoration:line-through; cursor:not-allowed; }
.majestic-root .qty-stepper{ display:inline-flex; align-items:center; border:1px solid var(--line); }
.majestic-root .qty-stepper button{ width:38px; height:42px; background:none; border:none; font-size:1rem; }
.majestic-root .qty-stepper span{ width:36px; text-align:center; font-size:.9rem; }
.majestic-root .pd-actions{ display:flex; gap:16px; align-items:center; margin-bottom:34px; flex-wrap:wrap; }
.majestic-root .accordion-item{ border-top:1px solid var(--line); }
.majestic-root .accordion-item:last-child{ border-bottom:1px solid var(--line); }
.majestic-root .accordion-head{ width:100%; background:none; border:none; display:flex; justify-content:space-between; align-items:center; padding:16px 0; font-size:.92rem; font-weight:600; text-align:left; }
.majestic-root .accordion-body{ padding:0 0 18px; color:var(--ink-soft); font-size:.9rem; display:none; }
.majestic-root .accordion-body.open{ display:block; }
.majestic-root .chevron{ transition:transform .2s ease; }
.majestic-root .chevron.open{ transform:rotate(180deg); }

/* Reviews */
.majestic-root .review-summary{ display:flex; align-items:center; gap:18px; margin-bottom:26px; }
.majestic-root .review-avg{ font-family:'Playfair Display',serif; font-size:2.4rem; }
.majestic-root .review-item{ padding:18px 0; border-top:1px solid var(--line); }
.majestic-root .review-item .stars{ margin-bottom:6px; }
.majestic-root .review-name{ font-weight:600; font-size:.88rem; }
.majestic-root .review-date{ color:var(--ink-soft); font-size:.76rem; margin-left:8px; }
.majestic-root .review-form{ background:var(--ivory); padding:24px; margin-top:30px; }
.majestic-root .star-pick{ display:flex; gap:6px; margin:10px 0 16px; font-size:1.4rem; color:var(--line); }
.majestic-root .star-pick span{ cursor:pointer; }
.majestic-root .star-pick span.on{ color:var(--gold); }
.majestic-root .field{ margin-bottom:16px; }
.majestic-root .field label{ display:block; font-size:.8rem; letter-spacing:.04em; text-transform:uppercase; margin-bottom:7px; color:var(--ink-soft); }
.majestic-root .field input, .majestic-root .field textarea{ width:100%; padding:12px 14px; border:1px solid var(--line); background:var(--card); font-family:inherit; font-size:.92rem; }
.majestic-root .field input:focus, .majestic-root .field textarea:focus{ border-color:var(--gold-deep); }

/* Cart */
.majestic-root .cart-item{ display:grid; grid-template-columns:78px 1fr auto; gap:16px; padding:20px 0; border-top:1px solid var(--line); align-items:center; }
.majestic-root .cart-item img{ width:78px; height:96px; object-fit:cover; }
.majestic-root .cart-item-name{ font-weight:500; margin-bottom:4px; }
.majestic-root .cart-item-meta{ font-size:.82rem; color:var(--ink-soft); margin-bottom:10px; }
.majestic-root .cart-item-remove{ background:none; border:none; color:var(--ink-soft); font-size:.78rem; text-decoration:underline; padding:0; margin-top:8px; }
.majestic-root .cart-summary{ background:var(--ivory); padding:24px; margin-top:20px; }
.majestic-root .row-between{ display:flex; justify-content:space-between; margin-bottom:10px; font-size:.92rem; }
.majestic-root .free-tag{ color:var(--gold-deep); font-weight:700; }
.majestic-root .empty-state{ text-align:center; padding:80px 20px; }

/* Checkout */
.majestic-root .checkout-layout{ display:grid; grid-template-columns:1fr; gap:40px; }
@media(min-width:900px){ .majestic-root .checkout-layout{ grid-template-columns:1.3fr 1fr; } }
.majestic-root .cod-note{ background:var(--ivory); border-left:3px solid var(--gold); padding:14px 16px; font-size:.85rem; margin:18px 0 28px; }
.majestic-root .trust-row{ display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px; }
.majestic-root .trust-chip{ display:flex; align-items:center; gap:7px; border:1px solid var(--line); padding:8px 12px; font-size:.76rem; background:var(--card); }
.majestic-root .order-summary-box{ background:var(--ivory); padding:24px; }
.majestic-root .mini-line{ display:flex; justify-content:space-between; font-size:.85rem; margin-bottom:10px; color:var(--ink-soft); }

/* Confirmation */
.majestic-root .confirm-box{ text-align:center; padding:100px 20px; max-width:560px; margin:0 auto; }
.majestic-root .confirm-check{ width:64px; height:64px; border-radius:50%; background:var(--gold); display:flex; align-items:center; justify-content:center; margin:0 auto 26px; }
`;

interface Review { name:string; rating:number; comment:string; date:string }
interface Product {
  id:string; name:string; category:string; price:number; compareAt:number;
  sizes:string[]; oos:string[]; images:string[];
  desc:string; fit:string; ship:string; badge?:string; reviews:Review[];
}
interface CartItem { key:string; id:string; size:string; qty:number }

export function initMajesticSite(root: HTMLElement): () => void {
  // ---------- Data ----------
  const CATEGORIES = ['Shirts','Trousers','Combo Packs'];
  const SIZES = ['S','M','L','XL','XXL'];
  const IMG = (n:string) => '/images/' + n;

  const rawProducts: Array<Omit<Product,'compareAt'>> = [
    { id:'p1', name:'Down Shoulder Premium Polo — Gray & Black', category:'Shirts', price:2800,
      sizes:['S','M','L','XL','XXL'], oos:[],
      images:[IMG('downshoulder-polo-gray-black-1 (2).png'),IMG('downshoulder-polo-gray-black-2.jpeg')],
      desc:'A relaxed down-shoulder polo in a premium cotton-blend knit, finished in a sharp gray and black colourway. The dropped shoulder seam gives it a modern, easy silhouette while the ribbed collar keeps its shape all day.',
      fit:'Relaxed fit with a dropped shoulder seam. True to size.',
      ship:'Free shipping across Pakistan. Dispatched within 1–2 business days. Delivered in 3–5 business days — cash collected at your door on arrival.',
      reviews:[]},
    { id:'p2', name:'Down Shoulder Premium Polo — Green & Black', category:'Shirts', price:2800,
      sizes:['S','M','L','XL','XXL'], oos:[],
      images:[IMG('downshoulder-polo-green-black-1.png'),IMG('downshoulder-polo-green-black-2.jpeg')],
      desc:'A relaxed down-shoulder polo in a premium cotton-blend knit, finished in a rich green and black colourway. The dropped shoulder seam gives it a modern, easy silhouette while the ribbed collar keeps its shape all day.',
      fit:'Relaxed fit with a dropped shoulder seam. True to size.',
      ship:'Free shipping across Pakistan. Dispatched within 1–2 business days. Delivered in 3–5 business days — cash collected at your door on arrival.',
      reviews:[]},
    { id:'p3', name:'Down Shoulder Premium Polo — Silver Gray & White', category:'Shirts', price:2800,
      sizes:['S','M','L','XL','XXL'], oos:[],
      images:[IMG('downshoulder-polo-silver-white-1 (2).png'),IMG('downshoulder-polo-silver-white-2.jpeg')],
      desc:'A relaxed down-shoulder polo in a premium cotton-blend knit, finished in a clean silver gray and white colourway. The dropped shoulder seam gives it a modern, easy silhouette while the ribbed collar keeps its shape all day.',
      fit:'Relaxed fit with a dropped shoulder seam. True to size.',
      ship:'Free shipping across Pakistan. Dispatched within 1–2 business days. Delivered in 3–5 business days — cash collected at your door on arrival.',
      reviews:[]},
    { id:'p4', name:'Premium Textured Striped Shirt — Black & White', category:'Shirts', price:3200,
      sizes:['S','M','L','XL','XXL'], oos:[],
      images:[IMG('striped-shirt-black-white-1.png'),IMG('striped-shirt-black-white-2.jpeg')],
      desc:'A textured woven shirt in a classic black-and-white stripe. The subtle fabric texture adds depth without shouting, making it equally sharp buttoned all the way up or worn open over a tee.',
      fit:'Tailored fit through the body. True to size.',
      ship:'Free shipping across Pakistan. Dispatched within 1–2 business days. Delivered in 3–5 business days — cash collected at your door on arrival.',
      reviews:[]},
    { id:'p5', name:'Premium Textured Smooth Fabric Zip Polo — White', category:'Shirts', price:3000,
      sizes:['S','M','L','XL','XXL'], oos:[],
      images:[IMG('zip-polo-white-1.png'),IMG('zip-polo-white-2.jpeg')],
      desc:'A smooth-textured zip polo with a half-zip placket for a cleaner, more modern take on the classic polo. Cut in crisp white for a sharp look that moves easily from day to evening.',
      fit:'Tailored fit through the body. True to size.',
      ship:'Free shipping across Pakistan. Dispatched within 1–2 business days. Delivered in 3–5 business days — cash collected at your door on arrival.',
      reviews:[]},
    { id:'p6', name:'Premium Textured Smooth Fabric Zip Polo — Olive Green', category:'Shirts', price:3000,
      sizes:['S','M','L','XL','XXL'], oos:[],
      images:[IMG('zip-polo-olive-1.png'),IMG('zip-polo-olive-2.jpeg')],
      desc:'A smooth-textured zip polo with a half-zip placket for a cleaner, more modern take on the classic polo. Cut in an earthy olive green for a versatile, elevated everyday look.',
      fit:'Tailored fit through the body. True to size.',
      ship:'Free shipping across Pakistan. Dispatched within 1–2 business days. Delivered in 3–5 business days — cash collected at your door on arrival.',
      reviews:[]},
    { id:'p7', name:'Classic Beige Premium Collar Button Shirt', category:'Shirts', price:2700,
      sizes:['S','M','L','XL','XXL'], oos:[],
      images:[IMG('collar-shirt-beige-1.png'),IMG('collar-shirt-beige-2.jpeg')],
      desc:'A classic button-down shirt in a premium beige fabric with a structured collar. Understated and versatile — dresses up or down with ease.',
      fit:'Tailored fit through the waist. True to size.',
      ship:'Free shipping across Pakistan. Dispatched within 1–2 business days. Delivered in 3–5 business days — cash collected at your door on arrival.',
      reviews:[]},
    { id:'p8', name:'Classic Blue Premium Collar Button Shirt', category:'Shirts', price:2700,
      sizes:['S','M','L','XL','XXL'], oos:[],
      images:[IMG('collar-shirt-blue-1.png'),IMG('collar-shirt-blue-2.jpeg')],
      desc:'A classic button-down shirt in a premium blue fabric with a structured collar. Understated and versatile — dresses up or down with ease.',
      fit:'Tailored fit through the waist. True to size.',
      ship:'Free shipping across Pakistan. Dispatched within 1–2 business days. Delivered in 3–5 business days — cash collected at your door on arrival.',
      reviews:[]},
    { id:'p9', name:'Premium Beige Straight Fit Trouser', category:'Trousers', price:3000,
      sizes:['S','M','L','XL','XXL'], oos:[],
      images:[IMG('trouser-beige-1.jpeg'),IMG('trouser-beige-2.jpeg')],
      desc:'A straight fit trouser in a soft, elastic, and durable fabric with an adjustable drawstring waist. Exceptionally lightweight for all-day comfort.',
      fit:'Straight fit through the leg, sits at the natural waist. True to size.',
      ship:'Free shipping across Pakistan. Dispatched within 1–2 business days. Delivered in 3–5 business days — cash collected at your door on arrival.',
      reviews:[]},
    { id:'p10', name:'Premium Gray Straight Fit Trouser', category:'Trousers', price:3000,
      sizes:['S','M','L','XL','XXL'], oos:[],
      images:[IMG('trouser-gray-1.jpeg'),IMG('trouser-gray-2.jpeg')],
      desc:'A straight fit trouser in a soft, elastic, and durable fabric with an adjustable drawstring waist. Exceptionally lightweight for all-day comfort.',
      fit:'Straight fit through the leg, sits at the natural waist. True to size.',
      ship:'Free shipping across Pakistan. Dispatched within 1–2 business days. Delivered in 3–5 business days — cash collected at your door on arrival.',
      reviews:[]},
    { id:'p11', name:'Premium Camel Straight Fit Trouser', category:'Trousers', price:3000,
      sizes:['S','M','L','XL','XXL'], oos:[],
      images:[IMG('trouser-camel-1.jpeg'),IMG('trouser-camel-2.jpeg')],
      desc:'A straight fit trouser in a soft, elastic, and durable fabric with an adjustable drawstring waist. Exceptionally lightweight for all-day comfort.',
      fit:'Straight fit through the leg, sits at the natural waist. True to size.',
      ship:'Free shipping across Pakistan. Dispatched within 1–2 business days. Delivered in 3–5 business days — cash collected at your door on arrival.',
      reviews:[]},
    { id:'p12', name:'The Signature Combo', category:'Combo Packs', price:5500,
      sizes:['S','M','L','XL','XXL'], oos:[],
      images:[IMG('combo-signature-1.jpeg'),IMG('combo-signature-2.jpeg')],
      desc:'Our strongest combination: the Premium Textured Striped Shirt (Black & White) paired with the Premium Beige Straight Fit Trouser. A clean, premium, and timeless look that\u2019s perfect for summer.',
      fit:'Shirt and trouser are cut in the same size as selected below.',
      ship:'Free shipping across Pakistan. Dispatched within 1–2 business days. Delivered in 3–5 business days — cash collected at your door on arrival.',
      reviews:[]},
    { id:'p13', name:'The Luxe White Combo', category:'Combo Packs', price:5500,
      sizes:['S','M','L','XL','XXL'], oos:[],
      images:[IMG('combo-luxe-white-1.png'),IMG('combo-luxe-white-2.jpeg')],
      desc:'One of the most luxurious pairings in the collection: the Premium Textured Smooth Fabric Zip Polo (White) with the Premium Camel Straight Fit Trouser. The white zip polo brings a modern edge, while the camel trouser adds warmth and elegance.',
      fit:'Shirt and trouser are cut in the same size as selected below.',
      ship:'Free shipping across Pakistan. Dispatched within 1–2 business days. Delivered in 3–5 business days — cash collected at your door on arrival.',
      reviews:[]},
    { id:'p14', name:'The Olive Elite', category:'Combo Packs', price:5500,
      sizes:['S','M','L','XL','XXL'], oos:[],
      images:[IMG('combo-olive-elite-1.png'),IMG('combo-olive-elite-2.jpeg')],
      desc:'The Premium Textured Smooth Fabric Zip Polo (Olive Green) paired with the Premium Beige Straight Fit Trouser. A stylish, earthy-toned outfit that\u2019s trending in men\u2019s fashion right now — looks expensive, feels effortless, ideal for casual outings.',
      fit:'Shirt and trouser are cut in the same size as selected below.',
      ship:'Free shipping across Pakistan. Dispatched within 1–2 business days. Delivered in 3–5 business days — cash collected at your door on arrival.',
      reviews:[]},
    { id:'p15', name:'The Executive Blue', category:'Combo Packs', price:5500,
      sizes:['S','M','L','XL','XXL'], oos:[],
      images:[IMG('combo-executive-blue-1.png'),IMG('combo-executive-blue-2.jpeg')],
      desc:'The Classic Blue Premium Collar Button Shirt paired with the Premium Gray Straight Fit Trouser. A smart-casual outfit suitable for work, dinners, and everyday wear — blue and gray is classic and versatile.',
      fit:'Shirt and trouser are cut in the same size as selected below.',
      ship:'Free shipping across Pakistan. Dispatched within 1–2 business days. Delivered in 3–5 business days — cash collected at your door on arrival.',
      reviews:[]},
    { id:'p16', name:'The Urban Green', category:'Combo Packs', price:5500,
      sizes:['S','M','L','XL','XXL'], oos:[],
      images:[IMG('combo-urban-green-1.png'),IMG('combo-urban-green-2.jpeg')],
      desc:'The Down Shoulder Premium Polo (Green & Black) paired with the Premium Camel Straight Fit Trouser. A trendy, youthful combination that stands out while remaining easy to wear.',
      fit:'Shirt and trouser are cut in the same size as selected below.',
      ship:'Free shipping across Pakistan. Dispatched within 1–2 business days. Delivered in 3–5 business days — cash collected at your door on arrival.',
      reviews:[]},
    { id:'p17', name:'The Custom Combo', category:'Combo Packs', price:5500,
      sizes:['S','M','L','XL','XXL'], oos:[],
      images:[IMG('combo-modern-mono-1.png'),IMG('combo-modern-mono-2.jpeg')],
      desc:'Can\'t decide on a set pairing? Build your own combo — choose any shirt from our shirt collection and any trouser from our trouser collection, in whatever colours and sizes you like. Once you\'ve picked your two pieces, just message us your selection and sizes on WhatsApp and we\'ll bundle them together at our special combo price.',
      fit:'Shirt and trouser are cut in the same size as selected below.',
      ship:'Free shipping across Pakistan. Dispatched within 1–2 business days. Delivered in 3–5 business days — cash collected at your door on arrival.',
      reviews:[]},
  ];

  // Apply +40% "compare-at" (original price shown as strikethrough).
  const PRODUCTS: Product[] = rawProducts.map(p => ({
    ...p,
    compareAt: Math.round((p.price * 1.4) / 50) * 50,
  }));

  const WHATSAPP_NUMBER = '03124051475';
  const CART_STORAGE_KEY = 'majesticStoffCart';

  interface State {
    view:string; productId:string|null; activeImage:number; pdSize:string|null;
    pdQty:number; openAccordion:string|null; cart:CartItem[];
    filters:{category:string; size:string; price:string};
    sort:string; mobileFiltersOpen:boolean; mobileNavOpen:boolean;
    reviewForm:{name:string; rating:number; comment:string};
  }

  function loadCart():CartItem[] {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if(!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }
  function saveCart() {
    try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart)); } catch {}
  }

  const state: State = {
    view:'home', productId:null, activeImage:0, pdSize:null, pdQty:1,
    openAccordion:'desc', cart:loadCart(),
    filters:{ category:'all', size:'all', price:'all' },
    sort:'newest', mobileFiltersOpen:false, mobileNavOpen:false,
    reviewForm:{ name:'', rating:5, comment:'' },
  };

  // ---------- Helpers ----------
  const fmt = (n:number) => 'Rs. ' + Number(n).toLocaleString('en-PK');
  const findProduct = (id:string|null) => PRODUCTS.filter(p => p.id===id)[0];
  const cartCount = () => state.cart.reduce((s,i)=>s+i.qty,0);
  interface Line { item:CartItem; product:Product; lineTotal:number; lineCompare:number }
  const cartLines = ():Line[] => state.cart.map(item => {
    const p = findProduct(item.id);
    return p ? { item, product:p, lineTotal:p.price*item.qty, lineCompare:p.compareAt*item.qty } : null;
  }).filter((l): l is Line => !!l);
  const cartSubtotal = () => cartLines().reduce((s,l)=>s+l.lineTotal,0);
  const cartCompareTotal = () => cartLines().reduce((s,l)=>s+l.lineCompare,0);
  function avgRating(p:Product){
    if(!p.reviews.length) return null;
    const sum = p.reviews.reduce((s,r)=>s+r.rating,0);
    return Math.round((sum/p.reviews.length)*10)/10;
  }
  function starString(rating:number, max=5){
    const full = Math.round(rating); let s='';
    for(let i=0;i<max;i++){ s += (i<full?'★':'☆'); }
    return s;
  }
  function escapeHtml(str:string){
    return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] as string));
  }
  let toastTimer:number|undefined;
  function toast(msg:string){
    const el = document.getElementById('maj-toast');
    if(!el) return;
    el.textContent = msg;
    el.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(()=>el.classList.remove('show'), 2200);
  }
  function navigate(view:string, params?:Partial<State>){
    state.view = view;
    if(params) Object.assign(state, params);
    state.mobileFiltersOpen=false;
    state.mobileNavOpen=false;
    render();
    window.scrollTo({top:0, behavior:'auto'});
  }

  // ---------- Icons ----------
  const ICONS = {
    search:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.6" y2="16.6"/></svg>',
    user:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>',
    cart:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h8a2 2 0 0 0 2-1.6L21.5 8h-16"/></svg>',
    menu:'<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    close:'<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>',
    chev:'<svg class="chevron __CLS__" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="6 9 12 15 18 9"/></svg>',
    truck:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="1" y="7" width="13" height="9"/><path d="M14 10h4l4 4v2h-8z"/><circle cx="6" cy="18.5" r="1.6"/><circle cx="17.5" cy="18.5" r="1.6"/></svg>',
    shield:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z"/></svg>',
    swap:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><polyline points="17 2 21 6 17 10"/><path d="M3 12v-2a4 4 0 0 1 4-4h14"/><polyline points="7 22 3 18 7 14"/><path d="M21 12v2a4 4 0 0 1-4 4H3"/></svg>',
    insta:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1"/></svg>',
    fb:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 8h2V4h-2a4 4 0 0 0-4 4v3H9v4h2v7h4v-7h2.5l.5-4H15V8.5c0-.3.2-.5.5-.5Z"/></svg>',
    tiktok:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 3v10.5a3.5 3.5 0 1 1-3-3.46"/><path d="M14 3a5 5 0 0 0 5 5"/></svg>',
  };

  // ---------- Render pieces ----------
  function announcement(){
    return '<div class="announcement"><strong>FREE SHIPPING</strong> ACROSS PAKISTAN · <strong>40% OFF</strong> SITEWIDE · CASH ON DELIVERY</div>';
  }
  function navbar(){
    return '<header class="navbar"><div class="wrap nav-inner">' +
      '<button class="hamburger icon-btn" data-action="toggle-mobile-nav" aria-label="Menu">' + ICONS.menu + '</button>' +
      '<a class="logo font-display" data-action="go" data-view="home">Majestic Stoff</a>' +
      '<div class="nav-links">' +
        '<a data-action="go" data-view="shop">Shop</a>' +
        '<a data-action="go" data-view="home" data-anchor="about">About</a>' +
        '<a data-action="go" data-view="home" data-anchor="footer">Contact</a>' +
      '</div>' +
      '<div class="nav-icons">' +
        '<button class="icon-btn" data-action="go" data-view="shop" aria-label="Search">' + ICONS.search + '</button>' +
        '<button class="icon-btn" data-action="account-click" aria-label="Account">' + ICONS.user + '</button>' +
        '<button class="icon-btn" data-action="go" data-view="cart" aria-label="Cart">' + ICONS.cart +
          (cartCount()>0 ? '<span class="cart-badge">'+cartCount()+'</span>' : '') +
        '</button>' +
      '</div>' +
    '</div>' +
    (state.mobileNavOpen ? (
      '<div class="mobile-nav">' +
        '<a data-action="go" data-view="shop">Shop</a>' +
        '<a data-action="go" data-view="home" data-anchor="about">About</a>' +
        '<a data-action="go" data-view="home" data-anchor="footer">Contact</a>' +
      '</div>'
    ) : '') +
    '</header>';
  }
  function footer(){
    return '<footer id="footer"><div class="wrap footer-grid">' +
      '<div>' +
        '<div class="logo font-display" style="color:#fff;margin-bottom:14px;">Majestic Stoff</div>' +
        '<p>Premium menswear for a generation that dresses with intent. Considered fabrics, tailored cuts, cash on delivery — free shipping across Pakistan.</p>' +
        '<div class="socials">' +
          '<a href="#" aria-label="Instagram">'+ICONS.insta+'</a>' +
          '<a href="#" aria-label="Facebook">'+ICONS.fb+'</a>' +
          '<a href="#" aria-label="TikTok">'+ICONS.tiktok+'</a>' +
        '</div>' +
      '</div>' +
      '<div><h4>Shop</h4><ul>' +
        '<li><a data-action="go" data-view="shop">All Products</a></li>' +
        '<li><a data-action="set-filter-category" data-value="Shirts">Shirts</a></li>' +
        '<li><a data-action="set-filter-category" data-value="Trousers">Trousers</a></li>' +
        '<li><a data-action="set-filter-category" data-value="Combo Packs">Combo Packs</a></li>' +
      '</ul></div>' +
      '<div><h4>Newsletter</h4>' +
        '<p style="max-width:none;">First look at new drops, no spam.</p>' +
        '<form id="newsletterForm">' +
          '<div class="newsletter-row">' +
            '<input type="email" placeholder="Email address" required>' +
            '<button type="submit">Join</button>' +
          '</div>' +
        '</form>' +
      '</div>' +
    '</div>' +
    '<div class="footer-bottom">© 2026 Majestic Stoff. All rights reserved.</div>' +
    '</footer>';
  }

  function priceBlock(p:Product){
    return '<div class="price-row">' +
      '<span class="card-price">'+fmt(p.price)+'</span>' +
      '<span class="price-old">'+fmt(p.compareAt)+'</span>' +
      '<span class="price-off">40% OFF</span>' +
    '</div>';
  }

  function productCard(p:Product){
    const tag = p.oos.length >= p.sizes.length ? 'Sold Out' : (p.badge || p.category);
    return '<div class="card" data-action="open-product" data-id="'+p.id+'">' +
      '<div class="card-media">' +
        '<span class="card-tag">'+escapeHtml(tag)+'</span>' +
        '<span class="card-sale">40% OFF</span>' +
        '<img src="'+p.images[0]+'" alt="'+escapeHtml(p.name)+'" loading="lazy">' +
      '</div>' +
      '<div class="card-info">' +
        '<h3>'+escapeHtml(p.name)+'</h3>' +
        priceBlock(p) +
        '<span class="ship-chip">Free Shipping</span>' +
      '</div>' +
    '</div>';
  }

  // ---------- Views ----------
  function viewHome(){
    const shirts = PRODUCTS.filter(p=>p.category==='Shirts');
    const trousers = PRODUCTS.filter(p=>p.category==='Trousers');
    const combos = PRODUCTS.filter(p=>p.category==='Combo Packs');
    const allReviews:Array<Review & {product:string}> = [];
    PRODUCTS.forEach(p => p.reviews.forEach(r => allReviews.push(Object.assign({},r,{product:p.name}))));
    allReviews.sort((a,b) => b.rating-a.rating || new Date(b.date).getTime()-new Date(a.date).getTime());
    const testis = allReviews.slice(0,6);

    return '<section class="hero">' +
      '<div class="hero-bg"><img src="'+IMG('hero.png')+'" alt=""></div>' +
      '<div class="wrap hero-content">' +
        '<span class="hero-sale">40% OFF · Free Shipping</span>' +
        '<span class="eyebrow">Spring / Summer 2026</span>' +
        '<h1>Tailored for the streets you actually walk.</h1>' +
        '<p>Elevated staples cut for a generation that dresses with intent — considered fabrics, modern silhouettes, no stiffness. Free shipping across Pakistan, cash on delivery.</p>' +
        '<button class="btn btn-gold" data-action="go" data-view="shop">Shop Now</button>' +
      '</div>' +
    '</section>' +

    '<section><div class="wrap">' +
      '<div class="section-head"><span class="eyebrow">Sharp & Considered</span><h2>Shirts</h2></div>' +
      '<div class="grid">' + shirts.map(productCard).join('') + '</div>' +
    '</div></section>' +

    '<section><div class="wrap">' +
      '<div class="section-head"><span class="eyebrow">Tailored Fit</span><h2>Trousers</h2></div>' +
      '<div class="grid">' + trousers.map(productCard).join('') + '</div>' +
    '</div></section>' +

    '<section><div class="wrap">' +
      '<div class="section-head"><span class="eyebrow">Best Value · Bundle & Save</span><h2>Combo Packs</h2></div>' +
      '<div class="grid">' + combos.map(productCard).join('') + '</div>' +
    '</div></section>' +

    '<section class="ivory-section" id="about"><div class="wrap story">' +
      '<img src="'+IMG('our-story.jpeg')+'" alt="Majestic Stoff craftsmanship">' +
      '<div>' +
        '<span class="eyebrow">Our Story</span>' +
        '<blockquote style="margin-top:14px;">Clothes should earn their place in your wardrobe, not just your closet.</blockquote>' +
        '<p style="color:var(--ink-soft);">Majestic Stoff was built for young men who take their style seriously without taking themselves too seriously. Every piece is developed for fit first, then fabric, then finish — the order that actually shows up when you wear it. We ship free anywhere in Pakistan, and you only pay when it\'s in your hands.</p>' +
      '</div>' +
    '</div></section>' +

    '<section><div class="wrap">' +
      '<div class="section-head"><span class="eyebrow">In Their Words</span><h2>What the Community Says</h2></div>' +
      (testis.length ? '<div class="testi-track">' + testis.map(r =>
        '<div class="testi-card">' +
          '<div class="stars">'+starString(r.rating)+'</div>' +
          '<div>"'+escapeHtml(r.comment)+'"</div>' +
          '<div class="testi-name">'+escapeHtml(r.name)+'</div>' +
          '<div class="testi-product">'+escapeHtml(r.product)+'</div>' +
        '</div>').join('') + '</div>'
        : '<p style="color:var(--ink-soft);">Reviews will appear here as customers share them.</p>') +
    '</div></section>';
  }

  function getFilteredProducts(){
    const f = state.filters;
    let list = PRODUCTS.filter(p => {
      if(f.category!=='all' && p.category!==f.category) return false;
      if(f.size!=='all' && p.sizes.indexOf(f.size)===-1) return false;
      if(f.price==='under5000' && p.price>=5000) return false;
      if(f.price==='5to10k' && (p.price<5000 || p.price>10000)) return false;
      if(f.price==='over10k' && p.price<=10000) return false;
      return true;
    });
    if(state.sort==='price-asc') list = list.slice().sort((a,b)=>a.price-b.price);
    else if(state.sort==='price-desc') list = list.slice().sort((a,b)=>b.price-a.price);
    return list;
  }

  function viewShop(){
    const list = getFilteredProducts();
    function pillList(kind:string, options:{label:string;value:string}[], activeVal:string){
      return '<div class="pill-list">' + options.map(o => {
        const active = o.value===activeVal;
        return '<button class="pill'+(active?' active':'')+'" data-action="set-filter-'+kind+'" data-value="'+o.value+'">'+o.label+'</button>';
      }).join('') + '</div>';
    }
    function filterBlock(){
      return '<div class="filter-group"><h4>Category</h4>' + pillList('category', [{label:'All',value:'all'}].concat(CATEGORIES.map(c=>({label:c,value:c}))), state.filters.category) + '</div>' +
        '<div class="filter-group"><h4>Size</h4>' + pillList('size', [{label:'All',value:'all'}].concat(SIZES.map(s=>({label:s,value:s}))), state.filters.size) + '</div>' +
        '<div class="filter-group"><h4>Price</h4>' + pillList('price', [
          {label:'All Prices',value:'all'},{label:'Under Rs. 5,000',value:'under5000'},{label:'Rs. 5,000–10,000',value:'5to10k'},{label:'Over Rs. 10,000',value:'over10k'}
        ], state.filters.price) + '</div>';
    }

    return '<div class="wrap page-head"><span class="eyebrow">Shop · 40% Off · Free Shipping</span><h1>All Products</h1></div>' +
    '<section style="padding-top:26px;"><div class="wrap shop-layout">' +
      '<aside class="filters-desktop">' + filterBlock() + '</aside>' +
      '<div>' +
        '<div class="shop-toolbar">' +
          '<button class="filter-toggle" data-action="toggle-filters">Filters</button>' +
          '<div></div>' +
          '<select data-role="sort-select">' +
            '<option value="newest"'+(state.sort==='newest'?' selected':'')+'>Newest</option>' +
            '<option value="price-asc"'+(state.sort==='price-asc'?' selected':'')+'>Price: Low to High</option>' +
            '<option value="price-desc"'+(state.sort==='price-desc'?' selected':'')+'>Price: High to Low</option>' +
          '</select>' +
        '</div>' +
        (list.length ? '<div class="grid grid-4">' + list.map(productCard).join('') + '</div>' :
          '<div class="empty-state"><h3 class="font-display">No products match those filters</h3><p style="color:var(--ink-soft);margin-bottom:20px;">Try widening your search.</p><button class="btn btn-outline" data-action="clear-filters">Clear Filters</button></div>') +
      '</div>' +
    '</div></section>' +
    '<div class="mobile-drawer'+(state.mobileFiltersOpen?' open':'')+'">' +
      '<div class="drawer-backdrop" data-action="toggle-filters"></div>' +
      '<div class="drawer-panel">' +
        '<div class="drawer-head"><h3 class="font-display" style="font-size:1.2rem;">Filters</h3><button class="icon-btn" data-action="toggle-filters">'+ICONS.close+'</button></div>' +
        filterBlock() +
        '<button class="btn btn-gold btn-full" data-action="toggle-filters">Show '+list.length+' Results</button>' +
      '</div>' +
    '</div>';
  }

  function viewProduct(){
    const p = findProduct(state.productId);
    if(!p) return '<div class="wrap" style="padding:80px 0;">Product not found. <a data-action="go" data-view="shop" style="text-decoration:underline;cursor:pointer;">Back to shop</a></div>';
    const selSize = state.pdSize;
    const avg = avgRating(p);
    const accordions = [
      {key:'desc', title:'Description', body:p.desc},
      {key:'fit', title:'Size & Fit', body:p.fit},
      {key:'ship', title:'Shipping Info', body:p.ship},
    ];

    return '<div class="wrap" style="padding:34px 0 80px;">' +
      '<div class="pd-layout">' +
        '<div>' +
          '<div class="pd-main-image">' +
            '<span class="pd-ribbon">Sale · 40% Off</span>' +
            '<img src="'+p.images[state.activeImage]+'" alt="'+escapeHtml(p.name)+'">' +
          '</div>' +
          '<div class="pd-thumbs">' + p.images.map((img,i) =>
            '<div class="pd-thumb'+(i===state.activeImage?' active':'')+'" data-action="set-main-image" data-index="'+i+'"><img src="'+img+'" alt=""></div>'
          ).join('') + '</div>' +
        '</div>' +
        '<div>' +
          '<span class="eyebrow">'+escapeHtml(p.category)+'</span>' +
          '<h1 class="font-display" style="font-size:1.9rem;margin-top:10px;">'+escapeHtml(p.name)+'</h1>' +
          '<div class="pd-price-row">' +
            '<span class="pd-price">'+fmt(p.price)+'</span>' +
            '<span class="pd-price-old">'+fmt(p.compareAt)+'</span>' +
            '<span class="pd-price-off">Save 40%</span>' +
          '</div>' +
          '<div class="pd-freeship">'+ICONS.truck+' <strong>Free Shipping</strong> across Pakistan · Cash on Delivery</div>' +
          '<div style="font-size:.85rem;color:var(--ink-soft);margin-bottom:22px;">' +
            (avg ? '<span style="color:var(--gold-deep);">'+starString(avg)+'</span> '+avg+' ('+p.reviews.length+' review'+(p.reviews.length===1?'':'s')+')' : 'No reviews yet') +
          '</div>' +
          '<div><span style="font-size:.8rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-soft);">Size</span></div>' +
          '<div class="size-grid">' + p.sizes.map(s => {
            const isOos = p.oos.indexOf(s)>-1;
            const cls = 'size-box' + (isOos?' oos':'') + (selSize===s?' selected':'');
            return '<div class="'+cls+'" '+(isOos?'':'data-action="select-pd-size" data-size="'+s+'"')+'>'+s+'</div>';
          }).join('') + '</div>' +
          '<div class="pd-actions">' +
            '<div class="qty-stepper">' +
              '<button data-action="pd-qty" data-dir="dec">−</button>' +
              '<span>'+state.pdQty+'</span>' +
              '<button data-action="pd-qty" data-dir="inc">+</button>' +
            '</div>' +
            '<button class="btn btn-gold" data-action="add-to-cart">Add to Cart</button>' +
          '</div>' +
          accordions.map(a => {
            const open = state.openAccordion===a.key;
            return '<div class="accordion-item">' +
              '<button class="accordion-head" data-action="toggle-accordion" data-key="'+a.key+'">'+a.title+' '+ICONS.chev.replace('__CLS__', open?'open':'')+'</button>' +
              '<div class="accordion-body'+(open?' open':'')+'">'+a.body+'</div>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>' +

      '<div style="margin-top:70px;max-width:720px;">' +
        '<h2 class="font-display" style="font-size:1.5rem;margin-bottom:22px;">Reviews</h2>' +
        (avg ? '<div class="review-summary"><div class="review-avg">'+avg+'</div><div><div style="color:var(--gold-deep);">'+starString(avg)+'</div><div style="font-size:.82rem;color:var(--ink-soft);">'+p.reviews.length+' review'+(p.reviews.length===1?'':'s')+'</div></div></div>' : '') +
        (p.reviews.length ? p.reviews.map(r =>
          '<div class="review-item"><div class="stars">'+starString(r.rating)+'</div><span class="review-name">'+escapeHtml(r.name)+'</span><span class="review-date">'+r.date+'</span><div style="margin-top:6px;">'+escapeHtml(r.comment)+'</div></div>'
        ).join('') : '<p style="color:var(--ink-soft);">Be the first to review this piece.</p>') +

        '<div class="review-form">' +
          '<h3 class="font-display" style="font-size:1.1rem;margin-bottom:14px;">Write a Review</h3>' +
          '<div class="star-pick" data-role="review-stars">' + [1,2,3,4,5].map(n =>
            '<span data-action="star-pick" data-value="'+n+'" class="'+(n<=state.reviewForm.rating?'on':'')+'">★</span>'
          ).join('') + '</div>' +
          '<div class="field"><label>Your Name</label><input type="text" data-role="review-name" value="'+escapeHtml(state.reviewForm.name)+'"></div>' +
          '<div class="field"><label>Comment</label><textarea rows="3" data-role="review-comment">'+escapeHtml(state.reviewForm.comment)+'</textarea></div>' +
          '<button class="btn btn-outline" data-action="submit-review">Submit Review</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function viewCart(){
    const lines = cartLines();
    if(!lines.length){
      return '<div class="wrap empty-state"><h1 class="font-display">Your cart is empty</h1><p style="color:var(--ink-soft);margin:14px 0 26px;">Add something you\'ll actually wear.</p><button class="btn btn-gold" data-action="go" data-view="shop">Continue Shopping</button></div>';
    }
    const saved = cartCompareTotal() - cartSubtotal();
    return '<div class="wrap page-head"><h1>Your Cart</h1></div>' +
    '<div class="wrap" style="padding:26px 0 80px;max-width:760px;">' +
      lines.map(l =>
        '<div class="cart-item">' +
          '<img src="'+l.product.images[0]+'" alt="'+escapeHtml(l.product.name)+'">' +
          '<div>' +
            '<div class="cart-item-name">'+escapeHtml(l.product.name)+'</div>' +
            '<div class="cart-item-meta">Size '+l.item.size+' · <span style="color:var(--gold-deep);font-weight:600;">'+fmt(l.product.price)+'</span> <span style="text-decoration:line-through;">'+fmt(l.product.compareAt)+'</span></div>' +
            '<div class="qty-stepper">' +
              '<button data-action="cart-qty" data-key="'+l.item.key+'" data-dir="dec">−</button>' +
              '<span>'+l.item.qty+'</span>' +
              '<button data-action="cart-qty" data-key="'+l.item.key+'" data-dir="inc">+</button>' +
            '</div>' +
            '<div><button class="cart-item-remove" data-action="remove-cart-item" data-key="'+l.item.key+'">Remove</button></div>' +
          '</div>' +
          '<div style="font-weight:600;">'+fmt(l.lineTotal)+'</div>' +
        '</div>'
      ).join('') +
      '<div class="cart-summary">' +
        '<div class="row-between"><span>Subtotal</span><strong>'+fmt(cartSubtotal())+'</strong></div>' +
        '<div class="row-between" style="color:var(--sale);"><span>You saved (40% off)</span><strong>−'+fmt(saved)+'</strong></div>' +
        '<div class="row-between"><span>Shipping</span><span class="free-tag">FREE</span></div>' +
        '<div class="row-between"><span>Payment</span><span>Cash on Delivery</span></div>' +
        '<button class="btn btn-gold btn-full" style="margin-top:14px;" data-action="go" data-view="checkout">Proceed to Checkout</button>' +
      '</div>' +
    '</div>';
  }

  function viewCheckout(){
    const lines = cartLines();
    if(!lines.length){
      return '<div class="wrap empty-state"><h1 class="font-display">Nothing to check out</h1><p style="color:var(--ink-soft);margin:14px 0 26px;">Your cart is empty.</p><button class="btn btn-gold" data-action="go" data-view="shop">Back to Shop</button></div>';
    }
    const waMsg = 'Hi Majestic Stoff, I would like to place an order:%0A%0A' +
      lines.map(l => '- '+l.product.name+' (Size '+l.item.size+') x'+l.item.qty+' — '+fmt(l.lineTotal)).join('%0A') +
      '%0A%0ATotal: '+fmt(cartSubtotal())+' (Free shipping · Cash on Delivery)';
    const waHref = 'https://wa.me/'+WHATSAPP_NUMBER+'?text='+waMsg;
    const saved = cartCompareTotal() - cartSubtotal();
    return '<div class="wrap page-head"><h1>Checkout</h1></div>' +
    '<div class="wrap checkout-layout" style="padding:26px 0 90px;">' +
      '<div>' +
        '<p style="color:var(--ink-soft);margin-bottom:20px;">We take orders directly on WhatsApp. Tap the button below to send us your order — our team will confirm sizes and delivery details right there.</p>' +
        '<div class="cod-note"><strong>Free Shipping · Cash on Delivery.</strong> Delivery is free across Pakistan and you pay in cash when your order arrives — no card or online payment needed.</div>' +
        '<div class="trust-row">' +
          '<div class="trust-chip">'+ICONS.truck+' Free Shipping</div>' +
          '<div class="trust-chip">'+ICONS.shield+' Cash on Delivery</div>' +
          '<div class="trust-chip">'+ICONS.swap+' Easy Exchange</div>' +
          '<div class="trust-chip">'+ICONS.shield+' Quality Checked</div>' +
        '</div>' +
        '<a class="btn btn-gold btn-full" style="margin-top:20px;" href="'+waHref+'" target="_blank" rel="noopener" data-action="order-whatsapp">Order via WhatsApp</a>' +
      '</div>' +
      '<div>' +
        '<div class="order-summary-box">' +
          '<h3 class="font-display" style="font-size:1.1rem;margin-bottom:16px;">Order Summary</h3>' +
          lines.map(l =>
            '<div class="mini-line"><span>'+escapeHtml(l.product.name)+' ('+l.item.size+') × '+l.item.qty+'</span><span>'+fmt(l.lineTotal)+'</span></div>'
          ).join('') +
          '<hr class="hairline" style="margin:14px 0;">' +
          '<div class="mini-line"><span>Subtotal</span><span>'+fmt(cartSubtotal())+'</span></div>' +
          '<div class="mini-line" style="color:var(--sale);"><span>40% off saving</span><span>−'+fmt(saved)+'</span></div>' +
          '<div class="mini-line"><span>Shipping</span><span class="free-tag">FREE</span></div>' +
          '<hr class="hairline" style="margin:14px 0;">' +
          '<div class="row-between"><strong>Total</strong><strong>'+fmt(cartSubtotal())+'</strong></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // ---------- Main render ----------
  function render(){
    saveCart();
    let body = '';
    if(state.view==='home') body = viewHome();
    else if(state.view==='shop') body = viewShop();
    else if(state.view==='product') body = viewProduct();
    else if(state.view==='cart') body = viewCart();
    else if(state.view==='checkout') body = viewCheckout();

    const appEl = root.querySelector('#maj-app') as HTMLElement | null;
    if(appEl){
      appEl.innerHTML = announcement() + navbar() + '<main>' + body + '</main>' + footer();
    }
    const wa = root.querySelector('#waFloat') as HTMLAnchorElement | null;
    if(wa){
      wa.href = 'https://wa.me/'+WHATSAPP_NUMBER+'?text=' + encodeURIComponent('Hi Majestic Stoff, I have a question');
    }
  }

  // ---------- Event delegation ----------
  const onClick = (e:Event) => {
    const t = e.target as Element;
    const el = t.closest ? t.closest('[data-action]') as HTMLElement | null : null;
    if(!el || !root.contains(el)) return;
    const action = el.getAttribute('data-action');

    if(action==='go'){
      const view = el.getAttribute('data-view') || 'home';
      const anchor = el.getAttribute('data-anchor');
      navigate(view);
      if(anchor){ setTimeout(() => { const tgt=document.getElementById(anchor); if(tgt) tgt.scrollIntoView({behavior:'smooth'}); }, 60); }
    }
    else if(action==='toggle-mobile-nav'){ state.mobileNavOpen = !state.mobileNavOpen; render(); }
    else if(action==='account-click'){ toast('Account & order tracking coming soon.'); }
    else if(action==='open-product'){
      const id = el.getAttribute('data-id') || '';
      const p = findProduct(id);
      const firstAvail = p ? p.sizes.filter(s => p.oos.indexOf(s)===-1)[0] : null;
      navigate('product', { productId:id, activeImage:0, pdSize:firstAvail||null, pdQty:1, openAccordion:'desc' });
    }
    else if(action==='set-main-image'){ state.activeImage = parseInt(el.getAttribute('data-index')||'0',10); render(); }
    else if(action==='select-pd-size'){ state.pdSize = el.getAttribute('data-size'); render(); }
    else if(action==='pd-qty'){
      const dir = el.getAttribute('data-dir');
      state.pdQty = Math.max(1, state.pdQty + (dir==='inc'?1:-1));
      render();
    }
    else if(action==='add-to-cart'){
      const p2 = findProduct(state.productId);
      if(!p2) return;
      if(!state.pdSize){ toast('Please select a size'); return; }
      const key = p2.id+'-'+state.pdSize;
      const existing = state.cart.filter(i => i.key===key)[0];
      if(existing) existing.qty += state.pdQty;
      else state.cart.push({ key, id:p2.id, size:state.pdSize, qty:state.pdQty });
      try {
        window.fbq && window.fbq('track','AddToCart', {
          content_ids:[p2.id], content_name:p2.name, content_type:'product',
          value: p2.price * state.pdQty, currency:'PKR',
        });
      } catch {}
      render();
      toast('Added to cart');
    }
    else if(action==='toggle-accordion'){
      const key2 = el.getAttribute('data-key');
      state.openAccordion = (state.openAccordion===key2 ? null : key2);
      render();
    }
    else if(action==='star-pick'){ state.reviewForm.rating = parseInt(el.getAttribute('data-value')||'5',10); render(); }
    else if(action==='submit-review'){
      const p3 = findProduct(state.productId);
      if(!p3) return;
      if(!state.reviewForm.name.trim() || !state.reviewForm.comment.trim()){ toast('Please add your name and a comment'); return; }
      p3.reviews.unshift({ name:state.reviewForm.name.trim(), rating:state.reviewForm.rating, comment:state.reviewForm.comment.trim(), date: new Date().toISOString().slice(0,10) });
      state.reviewForm = { name:'', rating:5, comment:'' };
      render();
      toast('Review submitted — thank you');
    }
    else if(action==='toggle-filters'){ state.mobileFiltersOpen = !state.mobileFiltersOpen; render(); }
    else if(action==='set-filter-category'){ state.filters.category = el.getAttribute('data-value')||'all'; if(state.view!=='shop') navigate('shop'); else render(); }
    else if(action==='set-filter-size'){ state.filters.size = el.getAttribute('data-value')||'all'; render(); }
    else if(action==='set-filter-price'){ state.filters.price = el.getAttribute('data-value')||'all'; render(); }
    else if(action==='clear-filters'){ state.filters = {category:'all',size:'all',price:'all'}; render(); }
    else if(action==='cart-qty'){
      const ckey = el.getAttribute('data-key'); const cdir = el.getAttribute('data-dir');
      const citem = state.cart.filter(i => i.key===ckey)[0];
      if(citem){ citem.qty = Math.max(1, citem.qty + (cdir==='inc'?1:-1)); render(); }
    }
    else if(action==='remove-cart-item'){
      state.cart = state.cart.filter(i => i.key!==el.getAttribute('data-key'));
      render();
      toast('Removed from cart');
    }
    else if(action==='order-whatsapp'){
      const total = cartSubtotal();
      const items = cartCount();
      try {
        window.fbq && window.fbq('track','InitiateCheckout', {
          value: total, currency:'PKR', num_items: items,
          content_ids: state.cart.map(i => i.id),
        });
      } catch {}
      state.cart = [];
      render();
      toast('Opening WhatsApp to confirm your order...');
    }
  };

  const onInput = (e:Event) => {
    const t = e.target as HTMLInputElement | HTMLTextAreaElement;
    const role = t.getAttribute && t.getAttribute('data-role');
    if(!role) return;
    if(role==='review-name') state.reviewForm.name = t.value;
    else if(role==='review-comment') state.reviewForm.comment = t.value;
  };
  const onChange = (e:Event) => {
    const t = e.target as HTMLSelectElement;
    if(t.getAttribute && t.getAttribute('data-role')==='sort-select'){ state.sort = t.value; render(); }
  };
  const onSubmit = (e:Event) => {
    const t = e.target as HTMLFormElement;
    if(t.id==='newsletterForm'){
      e.preventDefault();
      const input = t.querySelector('input') as HTMLInputElement | null;
      if(input && input.value.trim()){ toast('Thanks — you\'re on the list'); t.reset(); }
    }
  };

  document.addEventListener('click', onClick);
  document.addEventListener('input', onInput);
  document.addEventListener('change', onChange);
  document.addEventListener('submit', onSubmit);

  render();

  return () => {
    document.removeEventListener('click', onClick);
    document.removeEventListener('input', onInput);
    document.removeEventListener('change', onChange);
    document.removeEventListener('submit', onSubmit);
  };
}
