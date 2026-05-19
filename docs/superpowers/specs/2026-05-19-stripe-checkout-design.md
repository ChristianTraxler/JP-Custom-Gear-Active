# JP Custom Gear — Cart, Stripe Checkout & Order Emails

**Status:** Approved
**Date:** 2026-05-19
**Owner:** Christian Traxler

## Goal

Add a shopping cart and Stripe-powered checkout to the JP Custom Gear site so customers can place orders directly. On successful payment, the shop owner receives a detailed order email and the customer receives a confirmation email.

## Non-goals (v1)

- Image uploads from customizers (parked for v2; revisit with Vercel Blob)
- Sales tax collection
- Customer accounts / order history UI
- Discount codes
- Inventory tracking
- International shipping or multi-currency

## Constraints & decisions

| Topic | Decision |
|---|---|
| Hosting | Vercel (site will deploy here; not yet hosted at spec time) |
| Pricing source | Hardcoded in `js/products.js` (single source of truth; server validates) |
| Checkout style | Stripe Checkout (hosted page) |
| Shipping | Flat rate via `SHIPPING_RATE_CENTS` env var (default $8.00) |
| Sales tax | Not collected |
| Email service | Resend |
| Cart persistence | `localStorage` |
| Custom-product details | Captured per cart line; rendered in owner order email |
| Image uploads | Out of scope for v1 |
| Order records | Stripe Dashboard + archived order emails (no database) |
| Currency | USD only |
| Shipping countries | US only |

## Architecture

```
Customer browses site (static HTML)
        |
Adds item -> cart in localStorage (key: jpcg_cart)
        |
Opens /cart.html -> reviews items
        |
Clicks "Checkout"
        |
Browser -> POST /api/create-checkout-session  (Vercel serverless)
        |
Server validates productIds + quantities, recomputes prices from
products.js, builds Stripe line items, adds flat shipping,
encodes customizations into session metadata, creates Stripe
Checkout Session, returns session.url
        |
Browser redirects to Stripe-hosted checkout
        |
Customer pays -> Stripe redirects to /thank-you.html?session_id=...
        |
Stripe -> POST /api/stripe-webhook  (Vercel serverless)
        |
Server verifies signature, listens for checkout.session.completed,
sends 2 emails via Resend:
   - Owner: full order incl. customizations
   - Customer: confirmation
```

**Source of truth for prices is the server.** The browser sends `productId` + `quantity` + `customizations` only. The server looks up unit price from `products.js`. Cart tampering cannot affect the charged amount.

## File map

```
JP-Custom-Gear/
├── api/                              # NEW (Vercel serverless functions)
│   ├── create-checkout-session.js
│   └── stripe-webhook.js
├── js/
│   ├── cart.js                       # NEW — pure cart state, no DOM
│   ├── cart-page.js                  # NEW — renders /cart.html
│   ├── cart-badge.js                 # NEW — nav cart icon + count
│   ├── products.js                   # EDIT — add priceCents + getProduct(id)
│   ├── customize.js                  # EDIT — wire "Add to Cart"
│   ├── customize-patches.js          # EDIT — wire "Add to Cart"
│   ├── customize-keychains.js        # EDIT — wire "Add to Cart"
│   └── customize-tumblers.js         # EDIT — wire "Add to Cart"
├── cart.html                         # NEW
├── thank-you.html                    # NEW
├── product.html                      # EDIT — Add to Cart on standard products
├── *.html (all pages with navbar)    # EDIT — cart icon + count badge in nav
├── package.json                      # NEW — stripe, resend deps
├── vercel.json                       # NEW — function config
└── .env.example                      # NEW — env var documentation
```

## Modules

Each module has one job, well-defined inputs/outputs, and can be tested in isolation.

### `js/cart.js` — Cart state

Pure module, no DOM. Reads/writes `localStorage` key `jpcg_cart`.

**Exports:**

- `getCart(): Cart` — returns current cart, normalizes empty state
- `addItem({ productId, quantity, customizations }): Cart` — adds new line (always a new `lineId`, never merges, because customizations may differ)
- `updateQuantity(lineId, quantity): Cart` — clamps 1..99; removes if 0
- `removeItem(lineId): Cart` — removes a line
- `clearCart(): void` — wipes cart
- `getTotalCents(): number` — sum of unitPrice * quantity for display (not authoritative)
- `getItemCount(): number` — sum of quantities (for nav badge)
- `subscribe(callback): unsubscribe` — fires when cart changes (for badge auto-update)

**Cart shape:**

```js
{
  items: [
    {
      lineId: "abc123",            // random id per line
      productId: "patch-3in-pvc",
      name: "3\" PVC Patch",       // snapshot for display
      unitPrice: 1200,             // cents, display only
      quantity: 2,
      customizations: { /* free-form object */ },
      thumbnail: "images/..."
    }
  ],
  updatedAt: 1716134400000
}
```

### `js/cart-badge.js` — Nav cart icon

Renders a small cart icon + count in the navbar on every page. Subscribes to `cart.js` and updates on change. Click navigates to `/cart.html`.

### `js/cart-page.js` — Cart review page

Renders `/cart.html`:
- Lists each line: thumbnail, name, customization summary, qty stepper, line total, remove button.
- Shows subtotal and a "+ flat shipping at checkout" note.
- "Checkout" button POSTs the cart to `/api/create-checkout-session`, then `window.location = response.url`.
- Disabled when empty; shows "Your cart is empty" + link to shop.

### `js/products.js` — Catalog

Extended to include `priceCents` and helper:

```js
export const products = {
  "patch-3in-pvc": {
    name: "3\" PVC Patch",
    priceCents: 1200,
    image: "images/patches/...",
    customizable: true,
    // existing display fields preserved
  },
  // ...
};

export function getProduct(id) { return products[id] || null; }
```

The Vercel serverless functions import this same file. One source of truth.

### `js/customize*.js` — Wire Add to Cart

The existing customizers already collect selections. We add an "Add to Cart" button that:
1. Reads current selections into a `customizations` object.
2. Calls `cart.addItem({ productId, quantity: 1, customizations })`.
3. Shows a brief confirmation ("Added to cart — view cart").

### `api/create-checkout-session.js` — Vercel function

**Request:**
```json
{
  "items": [
    { "productId": "patch-3in-pvc", "quantity": 2, "customizations": {...} }
  ]
}
```

**Logic:**
1. Validate body shape. Return 400 if malformed.
2. For each item:
   - `getProduct(productId)` — return 400 if unknown ID.
   - Clamp/reject quantity outside 1..99.
3. Build Stripe `line_items` from server prices:
   ```js
   { price_data: { currency: "usd", unit_amount: priceCents, product_data: { name } }, quantity }
   ```
4. Append shipping line item using `process.env.SHIPPING_RATE_CENTS` (default 800).
5. Encode customizations into Stripe `metadata`:
   - Key: `item_<index>` → JSON-stringified `{ productId, customizations }`.
   - Stripe limit: 50 keys, 500 chars/value. If a line's serialized customizations exceed 500 chars, truncate the `notes` field with `…` and log a warning. Cart total of >50 distinct lines is implausible for this shop — reject with 400 if exceeded.
6. Create session:
   ```js
   {
     mode: "payment",
     line_items: [...],
     shipping_address_collection: { allowed_countries: ["US"] },
     phone_number_collection: { enabled: true },
     success_url: `${SITE_URL}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
     cancel_url: `${SITE_URL}/cart.html`,
     metadata
   }
   ```
7. Return `{ url: session.url }`.

**Errors:** Stripe failure → 500 with `{ error: "Couldn't start checkout, try again." }`. Log full error to Vercel logs.

### `api/stripe-webhook.js` — Vercel function

Configured in `vercel.json` to receive the raw body (needed for signature verification).

**Logic:**
1. Read raw body + `stripe-signature` header.
2. `stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)` — return 400 if invalid.
3. Only handle `checkout.session.completed`. Ignore everything else, return 200.
4. Retrieve full session with `line_items` expanded.
5. Reconstruct order summary from session.metadata (productId + customizations per item) joined with line_items (final amounts, names, quantities).
6. Build two HTML emails:
   - **Owner email** (`to: ORDER_NOTIFICATION_EMAIL`):
     - Subject: `New order #{shortId} — ${customerName} — ${total}`
     - Customer name, email, phone, shipping address
     - Per item: name, qty, line total, customizations rendered as bulleted `key: value` list
     - Subtotal, shipping, total
     - Stripe session ID for reference
   - **Customer email** (`to: customer email`):
     - Subject: `Your JP Custom Gear order — #{shortId}`
     - Greeting, brief "thanks for your order"
     - Items list (no internal notes), total
     - Shipping address
     - "We'll ship in 5–7 business days. Reply with any questions."
7. Send both via Resend. If either fails: log error, still return 200 (Stripe must not retry once payment is captured).

**Idempotency:** Stripe may deliver a webhook more than once. For v1 we accept this risk — re-sending an order email twice is recoverable (owner just sees a duplicate). If duplication becomes a problem, add a small KV/Vercel KV store of processed `event.id`s.

### `cart.html` — Cart review page

Standard site shell (existing nav, footer). Single section containing the cart contents rendered by `cart-page.js`. Mobile-optimized via existing responsive CSS patterns.

### `thank-you.html` — Post-payment landing

1. Read `?session_id=` from URL.
2. Call `clearCart()`.
3. Display: "Thanks! Order received. Check your email for confirmation." Include session ID truncated to 8 chars as the order number.
4. No server call — the webhook is the source of truth for the order. This page is purely UX.

## Environment variables

All set in Vercel project settings, scoped per environment.

| Variable | Used by | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | both API routes | Test key for Preview; live key for Production |
| `STRIPE_WEBHOOK_SECRET` | webhook | Per-environment endpoint signing secret |
| `STRIPE_PUBLISHABLE_KEY` | reserved | Not used by hosted Checkout; set for future Payment Element |
| `RESEND_API_KEY` | webhook | |
| `ORDER_NOTIFICATION_EMAIL` | webhook | Owner's inbox |
| `FROM_EMAIL` | webhook | Must be on a Resend-verified domain in production |
| `SHIPPING_RATE_CENTS` | create-checkout-session | Default 800 if unset |
| `SITE_URL` | create-checkout-session | e.g. `https://jpcustomgear.com` |

A `.env.example` is committed with placeholder values. No real keys ever committed.

## One-time external setup (deploy checklist)

1. **Stripe**
   - Create Stripe account.
   - Copy test API keys → set `STRIPE_SECRET_KEY` (and `STRIPE_PUBLISHABLE_KEY`) in Vercel Preview env.
   - After first Preview deploy: in Stripe Dashboard → Developers → Webhooks, add endpoint `https://<preview-url>/api/stripe-webhook`, event `checkout.session.completed`. Copy signing secret → `STRIPE_WEBHOOK_SECRET` in Vercel.
   - Repeat with live keys + a separate Production webhook endpoint when going live.
2. **Resend**
   - Create account.
   - Add sending domain + DNS records. Until verified, use `onboarding@resend.dev` as `FROM_EMAIL`.
   - Generate API key → `RESEND_API_KEY` in Vercel.
3. **Owner inbox**
   - Provide `ORDER_NOTIFICATION_EMAIL` and `FROM_EMAIL` to set in Vercel.

## Error handling & edge cases

| Case | Behavior |
|---|---|
| Cart tampering (modified localStorage) | Server recomputes prices; charged amount always matches `products.js` |
| Unknown productId | `/api/create-checkout-session` returns 400; cart page surfaces a clear message |
| Quantity out of bounds | Server rejects with 400 |
| Empty cart | Checkout button disabled; server also rejects 400 if reached |
| Stripe API unreachable | 500 from create-checkout-session; cart shows retry message |
| Webhook signature invalid | 400, log; Stripe alerts in dashboard |
| Resend send fails | Log, return 200; owner email serves as the alarm (if it doesn't arrive, escalate) |
| Customer abandons after Stripe redirect | No problem — webhook is authoritative; emails go out anyway |
| Webhook delivered twice | Duplicate emails sent in v1. Acceptable risk; can add event-id dedupe later |
| Customizations exceed Stripe metadata limit | Truncate notes per line with "…"; reject cart with >50 distinct lines |
| Mobile checkout | Stripe Checkout is mobile-optimized; cart.html follows existing responsive patterns |

## Testing

**Unit tests** (added in `js/` and `api/` with a simple test runner — `node --test` or Vitest, decided at plan time):

- `cart.js` — add, remove, update qty, total math, empty-state, lineId uniqueness, localStorage round-trip (mocked).
- `api/create-checkout-session` price-validation — feed known and unknown product IDs, valid and invalid quantities; assert correct Stripe payload construction and 400s.

**Manual end-to-end** (Stripe test mode, card `4242 4242 4242 4242`):

1. Add a customized item + a standard item to cart.
2. Verify nav badge updates and persists across navigation/refresh.
3. Open `/cart.html`, verify line items + customization summary + subtotal.
4. Click checkout, complete payment on Stripe.
5. Land on `/thank-you.html`; cart is empty.
6. Confirm webhook event delivered in Stripe Dashboard.
7. Confirm owner email arrives with customizations rendered.
8. Confirm customer email arrives.
9. Verify in Stripe Dashboard the charged amount equals server-computed total + shipping (i.e. unaffected by any client-side price field).

## Open questions (resolve before launch, not blocking implementation)

- Final `ORDER_NOTIFICATION_EMAIL` and `FROM_EMAIL` values.
- Final shipping rate value (current default $8.00; client may want different).
- Stripe and Resend account ownership — created under the client or under the developer?

## Future work (v2+)

- Customizer image uploads via Vercel Blob, with links in owner emails.
- Sales tax via Stripe Tax once nexus states are known.
- Discount codes (Stripe Promotion Codes).
- Order-status email when item ships.
- Inventory tracking for fixed-stock SKUs.
