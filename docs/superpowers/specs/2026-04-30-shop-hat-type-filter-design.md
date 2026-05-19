# Shop Page — Product & Hat-Type Filter

## Goal

A two-tier filter on the Shop page so customers narrow first by product type (**Hats / Shirts / Tumblers**), then — when **Hats** is selected — by hat style (**256P, 112PFP, 168P, 112, 168, Infinity Her**).

Single-select at both tiers. The data model is built so a future slide-out multi-select panel can reuse it without changes.

## Scope

- `shop.html` only (not the per-collection shop pages, which are already filtered by collection).
- Client-side only. No backend, no URL persistence.

## UX

A two-row filter block above the product grid, left-aligned. The top row is always visible; the sub-row only appears when the top-level **Hats** chip is active.

```
[ All ]  [ Hats ]  [ Shirts ]  [ Tumblers ]                  Showing 30 products

   ↓  (sub-row only appears when "Hats" is active)
   [ All ]  [ 256P ]  [ 112PFP ]  [ 168P ]  [ 112 ]  [ 168 ]  [ Infinity Her ]
```

To the right of the top row, a count of visible products: `Showing 30 products`. Updates whenever either filter changes.

### Behavior

- **Default:** "All" active up top, sub-row hidden, all products visible.
- **Click "Hats":** sub-row appears with its own "All" sub-chip active. Only hats are visible.
- **Click a hat-type sub-chip (e.g., "112"):** narrows to that hat type. Top-level "Hats" stays active.
- **Click "Shirts" or "Tumblers":** sub-row hides, only that product type visible. Sub-filter resets to "All" so it doesn't surprise on return to Hats.
- **Click "All" (top):** sub-row hides, every product visible, sub-filter resets to "All".
- Single-select at both tiers.
- Active chip uses the site's accent styling (matches existing design tokens in `css/styles.css`).
- Chip rows wrap on narrow viewports.
- Sub-row appears instantly (no animation).

## Data Model

Each `.product-card` in `shop.html` carries two data attributes:

- `data-product-type="hat" | "shirt" | "tumbler"` — top-level filter axis
- `data-hat-type="<value>"` — sub-filter axis, only meaningful for hats

Allowed `data-hat-type` values:

- `256P`
- `112PFP`
- `168P`
- `112`
- `168`
- `infinity-her`
- `none` — for non-hat items (shirts, tumblers)

`js/products.js` keeps `hatType` per product as the source of truth for the sub-axis. Top-level product type is already encoded by the existing `tag` field (`Hat`, `Shirt`, `Tumbler`); a separate `productType` field is not added there to avoid duplication.

The filter reads attributes from the DOM, not parsed product names.

### Mapping for current products

| Product slug | productType | hatType |
|---|---|---|
| she-prayed-tee | shirt | none |
| salt-water-camo-hat | hat | 112 |
| eagle-flag-tee | shirt | none |
| bottomland-camo-256p | hat | 256P |
| mama-floral-tumbler | tumbler | none |
| blossom-bliss-tumbler | tumbler | none |
| show-me-flat-bill | hat | 112PFP |
| shit-show-flat-bill | hat | 112PFP |
| nc-state-flag-112 | hat | 112 |
| nc-trucker-112 | hat | 112 |
| bass-fish-trucker-112 | hat | 112 |
| same-asshole-different-day | hat | 112 |
| milfin-aint-easy | hat | 112 |
| first-responder | hat | 112 |
| custom-bride-hat | hat | infinity-her |
| unsupervised-112 | hat | 112 |
| mama-tried-112-v1 | hat | 112 |
| mama-tried-112-v2 | hat | 112 |
| mama-tried-168 | hat | 168 |
| mimi-cheetah-infinity-her | hat | infinity-her |
| ball-park-mama-cheetah | hat | infinity-her |
| mama-cow-infinity-her | hat | infinity-her |
| police-wife-infinity-her | hat | infinity-her |
| dad-trout-112 | hat | 112 |
| dad-bass-112 | hat | 112 |
| somebody-112 | hat | 112 |
| somebodys-problem-infinity-her | hat | infinity-her |
| little-debbie-hunting-team | hat | 112 |
| liberty-or-death-112 | hat | 112 |
| support-your-local-hooker-168 | hat | 168 |

Counts: 26 hats, 2 shirts, 2 tumblers (30 total). `168P` is in the sub-row but currently has zero matching products — placeholder for future inventory. Clicking it yields `Showing 0 products` and an empty grid.

## Implementation

### Files

- **`shop.html`** — two-row filter markup above `.product-grid`; `data-product-type` on each `.product-card`; loads `js/shop-filter.js`. The grid carries `id="productGrid"`.
- **`css/styles.css`** — chip styles, active-state styles, hide rules for both axes, sub-row visibility, count-text style.
- **`js/products.js`** — `hatType` field on each product entry per the mapping table. (No new `productType` field; the existing `tag` already encodes that.)
- **`js/shop-filter.js`** *(new)* — handles chip clicks at both tiers, manages active state, writes attributes that drive the CSS hide rules, updates the count text.

### Filter mechanism

The JS maintains two pieces of state — `productFilter` (top tier) and `hatFilter` (sub tier) — and writes them as attributes on the DOM:

- On `.product-grid`:
  - `data-product-filter="hat" | "shirt" | "tumbler"` (absent when "All")
  - `data-active-filter="<hat-type>"` (absent when product filter ≠ hat or sub filter is "All")
- On `.shop-filter` wrapper:
  - `data-product-active="hat"` (absent otherwise) — used by CSS to reveal the sub-row

CSS hide rules (one per value, both axes):

```css
.product-grid[data-product-filter="hat"]   .product-card:not([data-product-type="hat"])   { display: none; }
.product-grid[data-product-filter="shirt"] .product-card:not([data-product-type="shirt"]) { display: none; }
.product-grid[data-active-filter="112"]    .product-card:not([data-hat-type="112"])       { display: none; }
/* …one rule per hat-type value… */
```

When both attributes are set (e.g., product = hat, sub = 112), both rules apply and the grid shows only 112 hats.

Sub-row reveal is also pure CSS:

```css
.shop-subfilter-chips { display: none; }
.shop-filter[data-product-active="hat"] .shop-subfilter-chips { display: flex; }
```

The count is computed in JS after each filter change by counting cards that match both active filters.

### Initial state

On load: top-level "All" active, sub-row hidden, no `data-product-filter`/`data-active-filter` on the grid, no `data-product-active` on the wrapper. Count shows `Showing 30 products`.

### Reset rules

Switching the top-level chip always resets the sub-filter to "All". This avoids leaving a stale hat-type narrow attached when returning to Hats from Shirts/Tumblers.

## Out of Scope

- URL hash persistence (`#filter=hats/112`) — skipped for now per YAGNI. Easy to add later.
- Multi-select — the future slide-out panel will own this; the chip rows stay single-select.
- Filtering on per-collection shop pages (`shop-woods-water.html`, etc.) — those are already collection-filtered.
- Adding the filter to the product page or search dropdown — possible future use of the same data attributes, but not in this change.
- Animated reveal for the sub-row.

## Future Extension: Slide-Out Panel

A "Filter ▾" button replaces or augments the chip rows. Clicking opens a side drawer with checkboxes — multi-select across product types and hat types, possibly other facets (price, color family). The drawer reuses the same `data-product-type` and `data-hat-type` attributes and the same filter-mechanism pattern (the grid attributes can hold space-separated lists, with CSS rules per combination — or move to JS-driven `display` toggling for multi-select).

Nothing in this design blocks that direction.
