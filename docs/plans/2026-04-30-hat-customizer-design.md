# Hat Customizer — Design Doc

**Date:** 2026-04-30
**Status:** Approved — ready to build (v1)

## Goal

Let visitors click a hat card on `custom-work.html` and land on a customization page where they can configure a hat (color, style options, patch type, custom text, logo upload, quantity, notes) and submit a request. Designed for v1 as a quote/contact handoff, structured so it can be swapped to a real cart + checkout later.

## Long-term direction

Eventually: full e-commerce (cart, checkout, payment). For now: form-based quote request. The customizer's data model and submit flow are built so the only thing that changes later is the submit endpoint.

## Scope

### v1 ships with

- Click any of the 6 hat cards on `custom-work.html` → opens `customize.html?style=<id>`
- Static `customize.html` page reuses existing nav, footer, announce bar, drawer
- Per-style config in `js/hat-styles.js`
- Form fields: hat color, style sub-option, patch type, custom text, logo upload, quantity, notes, contact info
- Form + static preview (Option B from brainstorm) — single hero image, color swatch chip, logo thumbnail, live summary card
- Submit handoff: save payload to `sessionStorage`, redirect to `contact.html?source=customizer`, prefill the contact message field
- `FORM_ENDPOINT` constant at top of `customize.js` for future direct-submit upgrade
- Mobile-responsive (form stacks above preview on small screens)

### v1 explicitly does NOT include

- Backend / database / order persistence
- Real cart, checkout, or payment
- Image compositing onto the hat (no drag-drop logo placement)
- Per-color hat photos — uses one hero image per style with a "your hat made in [color]" note
- Hat size selector (most styles are one-size)
- Thread-color picker (use the notes field)
- Preset design picker

## Architecture

### Routing

One shared customizer page driven by URL param:

```
custom-work.html → click card → customize.html?style=<id>
```

Style IDs: `leather-patch`, `embroidered`, `richardson-112`, `trucker`, `snapback`, `knit-beanie`

### Files

**New:**

- `customize.html` — the page
- `js/customize.js` — form logic, validation, preview updates, submit handler
- `js/hat-styles.js` — per-style config

**Modified:**

- `custom-work.html` — wrap each hat card in an `<a href="customize.html?style=...">`
- `contact.html` — on load, read `sessionStorage` if `?source=customizer`, prefill message field
- `css/styles.css` — customizer-specific styles

### Hat style config shape

```js
{
  "trucker": {
    name: "Trucker Hat",
    tagline: "Mesh Back",
    image: "images/hats/nc-trucker.png",
    colors: ["Black/White", "Charcoal/White", "Navy/White", "Khaki/Brown", "Camo"],
    subOptions: { label: "Brim Style", values: ["Curved", "Flat"] },
    patchTypes: ["Leather", "PVC", "Embroidered", "Woven"],
    basePrice: 28
  }
}
```

Each of the 6 styles gets its own entry. Sub-options vary by style (e.g., trucker has brim style, beanie has cuff option, richardson has structure).

## Customization options (final)

1. Hat color — dropdown
2. Style sub-option — dropdown (label + values from config)
3. Patch type — radio group (Leather / PVC / Embroidered / Woven)
4. Design — combinable:
   - Custom text input (max 30 chars)
   - Logo file upload (`.png .jpg .jpeg .pdf .svg`)
   - At least one is required
5. Quantity — number input, min 1
6. Notes — textarea
7. Contact info — name, email, phone

## Preview behavior

Right-side panel (sticky on desktop, stacks below form on mobile):

- Hero hat image (single image, with note about color)
- CSS color swatch chip next to color dropdown
- Logo thumbnail + filename when uploaded
- Live summary card (all selections, updates on change)
- Estimated price (`basePrice × quantity`, with "+" suffix)
- "We'll send you a digital proof" expectation note

## Submit flow

1. Validate required fields client-side (name, email, color, patch type, quantity ≥ 1, text-or-logo)
2. Bundle payload into structured object
3. Save to `sessionStorage` under key `customizer_order`
4. Redirect to `contact.html?source=customizer`
5. Contact page reads `sessionStorage`, formats payload as a readable summary, prefills message field
6. Customer reviews, attaches the logo file again if needed, sends via existing contact flow
7. Show success message after submit, with "Customize Another" CTA

## Future migration to real submit (Option B in brainstorm)

When ready:

1. Sign up for Formspree / Basin / Web3Forms
2. Replace `FORM_ENDPOINT = null` with the form URL in `customize.js`
3. Customizer posts directly to that endpoint (file included), shows success in-page
4. No other code changes needed

## Future migration to real cart

When the user is ready for option B from the brainstorm:

1. Replace "Request This Hat" submit with "Add to Cart"
2. Push payload onto a cart array in `localStorage`
3. Add `cart.html` + checkout flow
4. The payload shape is already a clean cart line-item

## Open questions

None — proceeding to implementation.
