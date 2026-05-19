# Shop Page — Hat-Type Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a single-select chip-row filter to `shop.html` so customers can narrow products by hat type (256P, 112PFP, 168P, 112, 168, Infinity Her).

**Architecture:** Each product is tagged with a `hatType` value in both `js/products.js` and as a `data-hat-type` attribute on its `.product-card`. The chip row sets a `data-active-filter` attribute on the grid container; CSS selectors hide cards that don't match. A small JS file wires click events, manages active state, and updates a visible product count.

**Tech Stack:** Vanilla HTML / CSS / JavaScript (no build step, no test runner). Existing site uses CSS custom properties from `css/default.css` (`--canvas`, `--linen`, `--tobacco`, `--brass`, `--amber`, `--cream`).

**Note on TDD/commits:** This is a static site with no test runner, and the project is not a git repository. Each task ends with a manual browser verification step in place of automated tests, and there are no `git commit` steps. Verifications use a local static server (`python3 -m http.server`) so the relative paths and JS load cleanly.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `js/products.js` | Modify | Source of truth for product data; gains a `hatType` field per product |
| `shop.html` | Modify | Adds filter chip row + count display markup; adds `data-hat-type` to each card; loads `js/shop-filter.js` |
| `css/styles.css` | Modify | Chip row styles, active state, count text, hide rules driven by `[data-active-filter]` |
| `js/shop-filter.js` | Create | Click handler, active-state toggle, count updater |

---

## Task 1: Tag every product with `hatType` in `js/products.js`

**Files:**
- Modify: `js/products.js` (one new line per product entry, 30 entries total)

**Mapping (from the spec):**

| Slug | hatType |
|---|---|
| she-prayed-tee | none |
| salt-water-camo-hat | 112 |
| eagle-flag-tee | none |
| bottomland-camo-256p | 256P |
| mama-floral-tumbler | none |
| blossom-bliss-tumbler | none |
| show-me-flat-bill | 112PFP |
| shit-show-flat-bill | 112PFP |
| nc-state-flag-112 | 112 |
| nc-trucker-112 | 112 |
| bass-fish-trucker-112 | 112 |
| same-asshole-different-day | 112 |
| milfin-aint-easy | 112 |
| first-responder | 112 |
| custom-bride-hat | infinity-her |
| unsupervised-112 | 112 |
| mama-tried-112-v1 | 112 |
| mama-tried-112-v2 | 112 |
| mama-tried-168 | 168 |
| mimi-cheetah-infinity-her | infinity-her |
| ball-park-mama-cheetah | infinity-her |
| mama-cow-infinity-her | infinity-her |
| police-wife-infinity-her | infinity-her |
| dad-trout-112 | 112 |
| dad-bass-112 | 112 |
| somebody-112 | 112 |
| somebodys-problem-infinity-her | infinity-her |
| little-debbie-hunting-team | 112 |
| liberty-or-death-112 | 112 |
| support-your-local-hooker-168 | 168 |

- [ ] **Step 1: Add `hatType` field after the `categoryHref` line in every product entry.**

For each product, insert a new line immediately after the `categoryHref:` line, with the same indentation (4 spaces). Example for `salt-water-camo-hat`:

```js
  "salt-water-camo-hat": {
    name: "JP Salt Water Camo Custom Hat",
    tag: "Hat",
    price: 25,
    image: "images/hats/salt-water-camo.png",
    category: "Woods & Water",
    categoryHref: "shop-woods-water.html",
    hatType: "112",
    description: "Coastal camo built for dock days and deep water. ...",
```

Use the table above to pick the value for each slug. Do this for all 30 products.

- [ ] **Step 2: Verify the file parses (no syntax errors).**

Run: `node --check js/products.js`
Expected: no output, exit code 0.

- [ ] **Step 3: Spot-check a few entries.**

Run: `grep -E '^\s+(hatType|categoryHref):' js/products.js | head -20`
Expected: alternating `categoryHref:` and `hatType:` lines, in order. Confirm `bottomland-camo-256p` reads `hatType: "256P"`, `mama-tried-168` reads `hatType: "168"`, `mimi-cheetah-infinity-her` reads `hatType: "infinity-her"`, and `she-prayed-tee` reads `hatType: "none"`.

---

## Task 2: Add `data-hat-type` attribute to every `.product-card` in `shop.html`

**Files:**
- Modify: `shop.html` (30 `.product-card` anchor tags)

The grid is between `<div class="product-grid">` (line 80) and its closing `</div>` (line 322). Each `<a class="product-card fade-in" ...>` line gets a `data-hat-type="<value>"` attribute.

- [ ] **Step 1: Add `data-hat-type` to each card.**

For every `<a href="product.html?id=<slug>" class="product-card fade-in">`, add the attribute matching the same slug from Task 1's mapping table. Example:

```html
<!-- Before -->
<a href="product.html?id=salt-water-camo-hat" class="product-card fade-in">

<!-- After -->
<a href="product.html?id=salt-water-camo-hat" class="product-card fade-in" data-hat-type="112">
```

Required mapping (all 30):

```
she-prayed-tee              → none
salt-water-camo-hat         → 112
eagle-flag-tee              → none
bottomland-camo-256p        → 256P
mama-floral-tumbler         → none
blossom-bliss-tumbler       → none
show-me-flat-bill           → 112PFP
shit-show-flat-bill         → 112PFP
nc-state-flag-112           → 112
nc-trucker-112              → 112
bass-fish-trucker-112       → 112
same-asshole-different-day  → 112
milfin-aint-easy            → 112
first-responder             → 112
custom-bride-hat            → infinity-her
unsupervised-112            → 112
mama-tried-112-v1           → 112
mama-tried-112-v2           → 112
mama-tried-168              → 168
mimi-cheetah-infinity-her   → infinity-her
ball-park-mama-cheetah      → infinity-her
mama-cow-infinity-her       → infinity-her
police-wife-infinity-her    → infinity-her
dad-trout-112               → 112
dad-bass-112                → 112
somebody-112                → 112
somebodys-problem-infinity-her → infinity-her
little-debbie-hunting-team  → 112
liberty-or-death-112        → 112
support-your-local-hooker-168 → 168
```

- [ ] **Step 2: Verify exactly 30 cards have the attribute.**

Run: `grep -c 'data-hat-type=' shop.html`
Expected: `30`

- [ ] **Step 3: Verify no card was missed.**

Run: `grep -c 'class="product-card fade-in"' shop.html`
Expected: `30` (matches the count above)

---

## Task 3: Add filter chip row + count markup to `shop.html`

**Files:**
- Modify: `shop.html` (insert new markup just inside `.shop-inner`, immediately before `.product-grid`)

- [ ] **Step 1: Insert the filter row markup.**

Find this block in `shop.html` (around line 78–80):

```html
<section class="shop-section">
  <div class="shop-inner">
    <div class="product-grid">
```

Replace it with:

```html
<section class="shop-section">
  <div class="shop-inner">

    <div class="shop-filter">
      <div class="shop-filter-chips" role="group" aria-label="Filter by hat type">
        <button type="button" class="shop-filter-chip is-active" data-filter="all">All</button>
        <button type="button" class="shop-filter-chip" data-filter="256P">256P</button>
        <button type="button" class="shop-filter-chip" data-filter="112PFP">112PFP</button>
        <button type="button" class="shop-filter-chip" data-filter="168P">168P</button>
        <button type="button" class="shop-filter-chip" data-filter="112">112</button>
        <button type="button" class="shop-filter-chip" data-filter="168">168</button>
        <button type="button" class="shop-filter-chip" data-filter="infinity-her">Infinity Her</button>
      </div>
      <div class="shop-filter-count" id="shopFilterCount" aria-live="polite">Showing 30 products</div>
    </div>

    <div class="product-grid" id="productGrid">
```

Two changes from the original: (1) new `.shop-filter` block above the grid, (2) `id="productGrid"` added to the grid so the JS can find it.

- [ ] **Step 2: Verify the markup.**

Run: `grep -n 'shop-filter\|productGrid\|data-filter=' shop.html | head`
Expected output should show the 7 chip buttons with `data-filter=` attributes, the `.shop-filter-chips` group, the `.shop-filter-count` div, and `id="productGrid"`.

- [ ] **Step 3: Verify the page still loads.**

In one terminal, run a static server from the project root:
`python3 -m http.server 8000`
In a browser, open `http://localhost:8000/shop.html`.
Expected: page loads, chips render as plain (unstyled) buttons in a row above the grid, count text reads `Showing 30 products`. Clicking chips does nothing yet — that's expected.

Stop the server (Ctrl-C) when done.

---

## Task 4: Style the chip row, count, active state, and filter hide rules in `css/styles.css`

**Files:**
- Modify: `css/styles.css` (append new block; do not edit existing rules)

- [ ] **Step 1: Append the styles to `css/styles.css`.**

Add this block at the end of the file:

```css
/* ── SHOP FILTER ── */
.shop-filter {
  display: flex; align-items: center; justify-content: space-between;
  gap: 18px; flex-wrap: wrap;
  margin-bottom: 28px;
}
.shop-filter-chips {
  display: flex; flex-wrap: wrap; gap: 8px;
}
.shop-filter-chip {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--tobacco);
  background: var(--cream);
  border: 1px solid var(--linen);
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border-color 0.18s, transform 0.18s;
}
.shop-filter-chip:hover {
  border-color: var(--brass);
  color: var(--bark);
}
.shop-filter-chip:focus-visible {
  outline: 2px solid var(--amber);
  outline-offset: 2px;
}
.shop-filter-chip.is-active {
  background: var(--tobacco);
  color: var(--amber);
  border-color: var(--tobacco);
}
.shop-filter-count {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(44,26,14,0.6);
  font-family: 'DM Sans', sans-serif;
}

/* Hide cards whose hat-type doesn't match the active filter.
   When data-active-filter is absent (the "All" state), nothing is hidden. */
.product-grid[data-active-filter="256P"]        .product-card:not([data-hat-type="256P"])        { display: none; }
.product-grid[data-active-filter="112PFP"]      .product-card:not([data-hat-type="112PFP"])      { display: none; }
.product-grid[data-active-filter="168P"]        .product-card:not([data-hat-type="168P"])        { display: none; }
.product-grid[data-active-filter="112"]         .product-card:not([data-hat-type="112"])         { display: none; }
.product-grid[data-active-filter="168"]         .product-card:not([data-hat-type="168"])         { display: none; }
.product-grid[data-active-filter="infinity-her"] .product-card:not([data-hat-type="infinity-her"]) { display: none; }

@media (max-width: 760px) {
  .shop-filter { margin-bottom: 20px; }
  .shop-filter-chip { font-size: 12px; padding: 7px 12px; }
}
```

- [ ] **Step 2: Verify the page renders styled chips.**

Run: `python3 -m http.server 8000` from project root, open `http://localhost:8000/shop.html`.
Expected:
- Chip row is left-aligned above the grid.
- "All" chip is styled as active (dark background, amber text).
- Other chips have cream background, thin border.
- Hovering a chip changes the border color.
- "Showing 30 products" appears at the right of the chip row (or wraps below on narrow screens).

Filtering still doesn't work yet — clicking a chip does nothing. That's the next task.

Stop the server when done.

---

## Task 5: Create `js/shop-filter.js` and load it from `shop.html`

**Files:**
- Create: `js/shop-filter.js`
- Modify: `shop.html` (add `<script>` tag)

- [ ] **Step 1: Create `js/shop-filter.js` with this content:**

```js
(function () {
  const grid = document.getElementById('productGrid');
  const chipsContainer = document.querySelector('.shop-filter-chips');
  const countEl = document.getElementById('shopFilterCount');

  if (!grid || !chipsContainer || !countEl) return;

  const cards = Array.from(grid.querySelectorAll('.product-card'));
  const totalCount = cards.length;

  function applyFilter(filterValue) {
    if (filterValue === 'all') {
      grid.removeAttribute('data-active-filter');
      countEl.textContent = `Showing ${totalCount} products`;
    } else {
      grid.setAttribute('data-active-filter', filterValue);
      const visible = cards.filter(c => c.getAttribute('data-hat-type') === filterValue).length;
      countEl.textContent = `Showing ${visible} products`;
    }
  }

  function setActiveChip(activeChip) {
    chipsContainer.querySelectorAll('.shop-filter-chip').forEach(chip => {
      chip.classList.toggle('is-active', chip === activeChip);
    });
  }

  chipsContainer.addEventListener('click', function (e) {
    const chip = e.target.closest('.shop-filter-chip');
    if (!chip) return;
    const filterValue = chip.getAttribute('data-filter');
    setActiveChip(chip);
    applyFilter(filterValue);
  });
})();
```

- [ ] **Step 2: Load the script from `shop.html`.**

Find the existing script tags near the bottom of `shop.html`:

```html
<script src="js/products.js"></script>
<script src="js/search.js"></script>
<script src="js/site.js"></script>
```

Add a new line for `shop-filter.js` right before `</body>`:

```html
<script src="js/products.js"></script>
<script src="js/search.js"></script>
<script src="js/site.js"></script>
<script src="js/shop-filter.js"></script>
```

- [ ] **Step 3: Verify the script loads with no JS errors.**

Run: `python3 -m http.server 8000`, open `http://localhost:8000/shop.html`, open browser DevTools → Console.
Expected: no errors. Network tab shows `shop-filter.js` loaded with status 200.

- [ ] **Step 4: Manually verify each chip filters correctly.**

With the page open:

1. Click **All** — all 30 cards visible, count reads `Showing 30 products`, "All" chip is highlighted.
2. Click **256P** — only 1 card visible (Bottomland Camo 256P), count reads `Showing 1 products`, "256P" chip is highlighted, others unhighlighted.
3. Click **112PFP** — 2 cards visible (Show Me, Shit Show), count reads `Showing 2 products`.
4. Click **168P** — 0 cards visible, count reads `Showing 0 products`. (Expected — no products tagged 168P yet.)
5. Click **112** — 15 cards visible, count reads `Showing 15 products`. Verify all visible cards are 112 hats; no shirts, tumblers, 256P hat, 168 hats, Infinity Her hats, or flat-bills.
6. Click **168** — 2 cards visible (Mama Tried 168, Support Your Local Hooker 168), count reads `Showing 2 products`.
7. Click **Infinity Her** — 6 cards visible (Mimi, Ball Park Mama, Mama Cow, Police Wife, Somebody's Problem, Custom Bride), count reads `Showing 6 products`.
8. Click **All** again — back to 30 cards.

Expected counts summary:
| Filter | Count |
|---|---|
| All | 30 |
| 256P | 1 |
| 112PFP | 2 |
| 168P | 0 |
| 112 | 15 |
| 168 | 2 |
| Infinity Her | 6 |
| **Total hats** | 26 |
| Non-hats (shirts + tumblers) | 4 |

Sum check: 1 + 2 + 0 + 15 + 2 + 6 = 26 hats; 26 + 4 non-hats = 30 total. ✓

Stop the server when done.

---

## Task 6: End-to-end visual + responsive verification

**Files:** none (verification only)

- [ ] **Step 1: Desktop pass.**

Run: `python3 -m http.server 8000`, open `http://localhost:8000/shop.html` at full window width (≥1024px).

Verify:
- Chip row sits flush above the grid, left-aligned.
- "Showing N products" sits to the right on the same row.
- Active chip has dark (`--tobacco`) background, amber text.
- Hover on a chip darkens its border to brass.
- Tab key reaches each chip; focused chip shows an amber outline.
- Keyboard Enter/Space on a focused chip filters the grid.

- [ ] **Step 2: Tablet pass (768–1023px).**

Resize the browser window to ~900px wide (or use DevTools device toolbar, set viewport to 900×800).

Verify:
- Grid drops to 3 columns.
- Chip row still single-line; if it wraps, it wraps cleanly (no overlap).
- Count text either stays right or wraps below — both are fine.

- [ ] **Step 3: Mobile pass (≤760px).**

Resize the browser window to ~390px wide (or DevTools iPhone preset).

Verify:
- Grid drops to 2 columns, then 1 column at ≤420px.
- Chip row wraps to multiple lines; chips remain tappable (no overlap, ≥36px tap target).
- Chip font size reduces to 12px (`@media (max-width: 760px)` rule).
- Count text wraps below the chips — readable, not crammed.
- Filtering still works correctly on a chip tap.

- [ ] **Step 4: Cross-feature regression.**

Still on `shop.html`:
- Search bar in the navbar still opens its dropdown when typing (run a quick search like "112"); filter does not interfere.
- Clicking a product card still navigates to `product.html?id=<slug>`.
- Footer renders correctly below the grid even when the filter is active and only 1–2 cards are showing.
- Scroll-to-top button (if present in `js/site.js`) still works.

- [ ] **Step 5: Browser back-state sanity.**

Click a hat-type filter chip, then click a product card to navigate to the product page, then hit the browser Back button.

Expected: `shop.html` reopens with `All` active again (no persistence — this is per the spec, URL hash deliberately omitted).

Stop the server when done.

---

## Self-Review Checklist (for the plan author)

- [x] Spec coverage: every section of the spec maps to a task.
  - Data model + mapping → Task 1, Task 2
  - Chip row UX + count → Task 3, Task 4
  - Single-select behavior + non-hat hiding → Task 4 (CSS rules) + Task 5 (JS)
  - Mobile wrap → Task 4 media query + Task 6 mobile pass
  - No URL hash → covered by absence; verified in Task 6 Step 5
- [x] No placeholders: all code blocks contain real code; mapping table is explicit; expected counts are computed.
- [x] Type/name consistency: chip `data-filter` values match `data-hat-type` values match `js/products.js` `hatType` values (case-sensitive: `256P`, `112PFP`, `168P`, `112`, `168`, `infinity-her`, `none`). The grid's `data-active-filter` uses the same values.
- [x] No git commits referenced (project not a repo).
- [x] No automated tests referenced (no test runner); manual verifications instead.
