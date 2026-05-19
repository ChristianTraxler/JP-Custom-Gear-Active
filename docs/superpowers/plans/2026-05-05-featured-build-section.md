# Featured Build Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "Find Your Collection" tile grid on `index.html` with a Featured Build editorial-split section that spotlights one custom client (Evergreene Excavation) using the photos in `images/hats/product-showcase/`.

**Architecture:** Static HTML/CSS edit, single page. New `<section class="featured-build">` replaces the existing `<section class="collections">` block. New CSS lives alongside the existing collections styles in `css/styles.css`. Reuses existing utility classes (`.section-eyebrow`, `.btn-primary`, `.why-badge`, `.fade-in`, `.coll-grain`, `.coll-shine`) so the section feels native to the site.

**Tech Stack:** HTML5, CSS3 (CSS Grid for the bento layout), no JS framework. Existing IntersectionObserver-based `.fade-in` animation reused.

**Spec:** [`docs/superpowers/specs/2026-05-05-featured-build-section-design.md`](../specs/2026-05-05-featured-build-section-design.md)

**Verification approach:** This codebase has no automated test suite. Verification is manual: open `index.html` in a browser at multiple widths and confirm specific visual/behavioral checks listed in each task.

**Pre-resolved spec open questions:**
- `#collections` anchor: `grep -rn "#collections"` across HTML/JS/CSS returns zero references. Safe to remove the id entirely with the section.

---

## File Structure

| File | Change | Responsibility |
|---|---|---|
| `index.html` | Modify lines 172–232 | Replace the `<section class="collections">` block with the new Featured Build section markup |
| `css/styles.css` | Append after line 322 (end of removed collections styles) | New `.featured-build` styles: section background, two-column layout, bento photo grid, hover treatments, mobile stack |
| `css/styles.css` | Delete lines 271–322 (after Task 5 grep check) | Remove orphaned `.collections`, `.coll-grid`, `.coll-tile*`, `.collections-cta`, `.btn-outline-dark` styles that no other section uses |

No new image assets — `images/hats/product-showcase/` is already populated.

---

## Task 1: Replace the HTML section

**Files:**
- Modify: [`index.html`](../../../index.html) lines 172–232 (the entire `<section class="collections" id="collections">` block including its closing `</section>`)

- [ ] **Step 1: Verify the current state of the section**

Run: `sed -n '172,232p' index.html`

Expected: Output begins with `<!-- COLLECTIONS -->` and `<section class="collections" id="collections">` and ends with `</section>` followed by a blank line and `<!-- FEATURED COLLECTIONS (styled cards) -->`.

- [ ] **Step 2: Replace lines 172–232 with the new Featured Build section**

Use the Edit tool. The `old_string` is the entire current block (from the `<!-- COLLECTIONS -->` comment through the closing `</section>` on line 232). The `new_string` is:

```html
    <!-- FEATURED BUILD -->
    <section class="featured-build" id="featured-build">
      <div class="featured-build-inner">
        <div class="featured-build-text fade-in">
          <div class="section-eyebrow featured-build-eyebrow">
            <div class="line"></div>
            <span>Featured Build</span>
          </div>
          <h2 class="section-title featured-build-title">Built for <em>Evergreene</em> Excavation.</h2>
          <p class="featured-build-story">
            A working excavation crew needed gear that could earn its keep — long days in the cab, then straight into town without missing a beat. We built this run from the ground up: bark camo trucker, custom leatherette hex patch, every stitch dialed in. Real gear for real work.
          </p>
        </div>

        <div class="featured-build-gallery fade-in fade-in-delay-1">
          <div class="fb-photo fb-photo-hero">
            <picture>
              <source type="image/webp" srcset="images/hats/product-showcase/web/IMG_4757.webp" />
              <img src="images/hats/product-showcase/web/IMG_4757.jpg" alt="Evergreene Excavation bark camo trucker hat with leatherette hex patch, front view" width="1400" height="1600" loading="lazy" />
            </picture>
            <div class="coll-grain"></div>
            <div class="coll-shine"></div>
          </div>
          <div class="fb-photo fb-photo-mood">
            <picture>
              <source type="image/webp" srcset="images/hats/product-showcase/web/IMG_0677.webp" />
              <img src="images/hats/product-showcase/web/IMG_0677.jpg" alt="Evergreene Excavation hat resting on excavator equipment at sunset in the woods" width="1222" height="1600" loading="lazy" />
            </picture>
            <div class="coll-grain"></div>
            <div class="coll-shine"></div>
          </div>
          <div class="fb-photo fb-photo-action">
            <picture>
              <source type="image/webp" srcset="images/hats/product-showcase/web/IMG_4754.webp" />
              <img src="images/hats/product-showcase/web/IMG_4754.jpg" alt="Crew member in the field clearing trees, wearing the Evergreene Excavation hat" width="1400" height="1600" loading="lazy" />
            </picture>
            <div class="coll-grain"></div>
            <div class="coll-shine"></div>
          </div>
          <div class="fb-photo fb-photo-human">
            <picture>
              <source type="image/webp" srcset="images/hats/product-showcase/web/IMG_4756.webp" />
              <img src="images/hats/product-showcase/web/IMG_4756.jpg" alt="Father and child in an excavator cab, dad wearing the Evergreene Excavation bark camo hat" width="1400" height="1600" loading="lazy" />
            </picture>
            <div class="coll-grain"></div>
            <div class="coll-shine"></div>
          </div>
        </div>

        <div class="featured-build-action fade-in fade-in-delay-2">
          <div class="why-badges featured-build-badges">
            <span class="why-badge">Land Clearing &amp; Excavation</span>
            <span class="why-badge">Custom Leatherette Patch</span>
            <span class="why-badge">Made to Order</span>
          </div>
          <a href="custom-work.html" class="btn-primary featured-build-cta">Start Your Custom Build →</a>
        </div>
      </div>
    </section>
```

The structure: `.featured-build-text` (eyebrow + headline + story), `.featured-build-gallery` (the 4 photos), and `.featured-build-action` (badges + CTA) are three siblings inside `.featured-build-inner`. Desktop uses CSS grid-template-areas to place text top-left, action bottom-left, gallery spanning both rows on the right. Mobile stacks them as text → gallery → action, matching the spec's mobile order.

- [ ] **Step 3: Verify the edit landed correctly**

Run: `sed -n '172,220p' index.html`

Expected: Output begins with `<!-- FEATURED BUILD -->` and `<section class="featured-build" id="featured-build">`. The `<!-- FEATURED COLLECTIONS (styled cards) -->` comment should still appear shortly after the new section's closing tag.

Also run: `grep -n "section class=\"collections\" id=\"collections\"" index.html`

Expected: No matches (the old section is fully replaced).

- [ ] **Step 4: Open the page in a browser and visually confirm the markup is in place**

Open `index.html` in a browser. Don't worry about styling yet — at this point the section will look like an unstyled block of text, badges, and four images stacked top-to-bottom. Confirm:
- The headline reads "Built for *Evergreene* Excavation."
- The story paragraph appears.
- Three badge text strings appear ("Land Clearing & Excavation", "Custom Leatherette Patch", "Made to Order").
- The "Start Your Custom Build →" link appears.
- All four images load (no broken-image icons).

If any image fails to load, check the file paths against `ls images/hats/product-showcase/web/` and confirm exact filename casing. Each photo uses a `<picture>` element with a `.webp` `<source>` and a `.jpg` fallback in the `<img>` — both files exist in the `web/` subfolder.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Replace collections grid with Featured Build section markup"
```

---

## Task 2: Add Featured Build desktop styles

**Files:**
- Modify: [`css/styles.css`](../../../css/styles.css) — append a new block immediately after line 322 (after the closing brace of the `@media (max-width: 520px) { .coll-grid { ... } }` rule that ends the old collections styles)

- [ ] **Step 1: Verify the insertion point**

Run: `sed -n '320,325p' css/styles.css`

Expected: Output shows the `@media (max-width: 520px) { .coll-grid { grid-template-columns: 1fr; gap: 32px; } }` rule on line 320–322, followed by `.coll-card {` on line 323.

The new styles will be inserted **between** these two — after line 322 and before line 323.

- [ ] **Step 2: Insert the Featured Build CSS block**

Use the Edit tool. Find the unique anchor:

```css
@media (max-width: 520px) {
  .coll-grid { grid-template-columns: 1fr; gap: 32px; }
}
.coll-card {
```

Replace it with:

```css
@media (max-width: 520px) {
  .coll-grid { grid-template-columns: 1fr; gap: 32px; }
}

/* ── FEATURED BUILD ── */
.featured-build { background: #EFEFEF; padding: 90px 0 100px; }
.featured-build-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 24px;
  display: grid;
  grid-template-columns: 45fr 55fr;
  grid-template-areas:
    "text   gallery"
    "action gallery";
  column-gap: 56px;
  row-gap: 28px;
  align-items: start;
}

/* Left column row 1: text */
.featured-build-text { grid-area: text; display: flex; flex-direction: column; align-items: flex-start; }
.featured-build-eyebrow { justify-content: flex-start; margin-bottom: 18px; }
.featured-build-eyebrow .line { width: 36px; }
.featured-build-title {
  text-align: left;
  font-size: clamp(34px, 4.2vw, 52px);
  line-height: 1.1;
  margin-bottom: 22px;
  max-width: 12ch;
}
.featured-build-story {
  color: rgba(107,63,34,0.72);
  font-size: 16px;
  line-height: 1.75;
  max-width: 46ch;
  margin: 0;
}

/* Left column row 2: badges + CTA */
.featured-build-action { grid-area: action; display: flex; flex-direction: column; align-items: flex-start; }
.featured-build-badges { margin-bottom: 24px; }
.featured-build-cta { align-self: flex-start; }

/* Right column (spans both rows): bento gallery */
.featured-build-gallery {
  grid-area: gallery;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  grid-template-rows: repeat(3, 1fr);
  gap: 14px;
  aspect-ratio: 5 / 6;
  max-height: 640px;
}
.fb-photo {
  position: relative; overflow: hidden;
  background: var(--tobacco, #2C1A0E);
  transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
}
.fb-photo picture { position: absolute; inset: 0; display: block; }
.fb-photo img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
}
.fb-photo:hover { transform: translateY(-3px); }
.fb-photo:hover img { transform: scale(1.05); }
.fb-photo .coll-shine { opacity: 0; transition: opacity 0.4s; }
.fb-photo:hover .coll-shine { opacity: 1; }

/* Bento placement */
.fb-photo-hero   { grid-column: 1; grid-row: 1 / span 3; }
.fb-photo-mood   { grid-column: 2; grid-row: 1; }
.fb-photo-action { grid-column: 2; grid-row: 2; }
.fb-photo-human  { grid-column: 2; grid-row: 3; }

@media (prefers-reduced-motion: reduce) {
  .fb-photo, .fb-photo img { transition: none; }
  .fb-photo:hover { transform: none; }
  .fb-photo:hover img { transform: none; }
}

.coll-card {
```

- [ ] **Step 3: Verify the edit**

Run: `grep -n "FEATURED BUILD\|\.featured-build\b\|\.fb-photo" css/styles.css | head -20`

Expected: At least 10+ matches inside `styles.css`, all clustered together starting around line 323-ish, ending before the `.coll-card {` rule.

- [ ] **Step 4: Open in a browser and verify desktop layout (window ≥ 1100px wide)**

Open `index.html` in a browser, ensure the window is at least 1100px wide. Confirm:
- The section background is the same light gray (`#EFEFEF`) the old collections section had.
- Two-column split: text on the left (eyebrow, headline, story, three badges, CTA button), photo grid on the right.
- Headline is left-aligned, with "Evergreene" in a darker brown italic accent (existing `em` styling from `.section-title em`).
- Photo grid shows the front-on bark camo hat in a tall left column, three smaller photos stacked on the right (sunset/equipment on top, chainsaw action middle, dad-and-kid bottom).
- Hovering any photo: photo lifts slightly, image inside zooms slightly, subtle radial highlight appears.
- The `.fade-in` animation triggers as you scroll the section into view (text slides up from below, then the photo grid does the same with a slight delay).

- [ ] **Step 5: Test photo aspect handling**

The bento aspect ratio is `5 / 6` with `max-height: 640px`. With photos using `object-fit: cover`, edges of each photo will be cropped to fill the cell. Walk through each cell and confirm:
- Hero (IMG_4757): the hat is the focal point and stays mostly centered. Acceptable if a small portion of the surroundings is cropped.
- Mood (IMG_0677): the hat with the sunset bokeh is visible. Acceptable to crop tightly.
- Action (IMG_4754): the worker and chainsaw remain in frame.
- Human (IMG_4756): both the dad and the kid remain visible.

If any photo is cropped in a way that loses the subject, note it as a polish item — we can adjust `object-position` per cell in a follow-up. Don't fix in this task unless the result is unusable.

- [ ] **Step 6: Commit**

```bash
git add css/styles.css
git commit -m "Add Featured Build section styles (desktop)"
```

---

## Task 3: Add Featured Build mobile/responsive styles

**Files:**
- Modify: [`css/styles.css`](../../../css/styles.css) — append within the existing Featured Build CSS block, immediately before the `.coll-card {` rule

- [ ] **Step 1: Insert the responsive rules**

Use the Edit tool. Find this anchor (the closing `prefers-reduced-motion` block from Task 2 followed by `.coll-card`):

```css
@media (prefers-reduced-motion: reduce) {
  .fb-photo, .fb-photo img { transition: none; }
  .fb-photo:hover { transform: none; }
  .fb-photo:hover img { transform: none; }
}

.coll-card {
```

Replace it with:

```css
@media (prefers-reduced-motion: reduce) {
  .fb-photo, .fb-photo img { transition: none; }
  .fb-photo:hover { transform: none; }
  .fb-photo:hover img { transform: none; }
}

@media (max-width: 900px) {
  .featured-build { padding: 70px 0 80px; }
  .featured-build-inner {
    grid-template-columns: 1fr;
    grid-template-areas:
      "text"
      "gallery"
      "action";
    column-gap: 0;
    row-gap: 32px;
  }
  .featured-build-title { max-width: none; }
  .featured-build-story { margin-bottom: 0; }
  .featured-build-gallery {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto auto;
    aspect-ratio: auto;
    max-height: none;
    gap: 12px;
  }
  .fb-photo-hero   { grid-column: 1 / -1; grid-row: 1; aspect-ratio: 16 / 10; }
  .fb-photo-mood   { grid-column: 1; grid-row: 2; aspect-ratio: 1 / 1; }
  .fb-photo-action { grid-column: 2; grid-row: 2; aspect-ratio: 1 / 1; }
  .fb-photo-human  { grid-column: 3; grid-row: 2; aspect-ratio: 1 / 1; }
}

@media (max-width: 520px) {
  .featured-build-title { font-size: clamp(28px, 8vw, 36px); }
  .featured-build-story { font-size: 15px; }
  .featured-build-cta { width: 100%; justify-content: center; text-align: center; }
}

.coll-card {
```

**Note:** `.fb-photo-action` is a grid cell name inside the gallery (one of the four photos). It is unrelated to `.featured-build-action`, the badges+CTA wrapper. Both names exist in the codebase but they don't collide (different scopes, different selectors).

- [ ] **Step 2: Verify the edit**

Run: `grep -n "max-width: 900px\|max-width: 520px" css/styles.css | head -10`

Expected: At least two new matches in the Featured Build region (in addition to existing matches elsewhere in the file).

- [ ] **Step 3: Test at 900px breakpoint**

Open `index.html` in a browser. Resize the window to ~890px wide (just under 900). Confirm:
- The two-column split collapses to single column.
- Order top-to-bottom: eyebrow → headline → story → hero photo (full width, ~16:10) → 3-up row of square thumbnails → badges → CTA. (The `grid-template-areas: "text" "gallery" "action"` rule controls this — gallery sits between text and the badges/CTA action block.)
- The CTA button sits at its natural width (not yet stretched).
- Photos still hover-lift correctly.

- [ ] **Step 4: Test at 520px breakpoint (phone-sized)**

Resize to ~480px wide. Confirm:
- Headline scales down (clamp kicks in around 36px).
- Story copy is readable (15px).
- CTA button stretches to full width and centers its text.
- The 3-up thumbnail row still fits without horizontal scroll. Each thumbnail is square.
- No horizontal overflow anywhere on the page.

- [ ] **Step 5: Test reduced-motion**

In your browser devtools, toggle "Emulate CSS prefers-reduced-motion: reduce" (Chrome: Rendering panel → Emulate CSS media feature). Confirm:
- Hovering a photo no longer triggers the lift/zoom.
- The `.fade-in` animation still fires (it's controlled by the existing global JS, not in scope for this section).

- [ ] **Step 6: Commit**

```bash
git add css/styles.css
git commit -m "Add Featured Build responsive layout for tablet and mobile"
```

---

## Task 4: Cross-section regression check

**Files:** No changes. Verification only.

- [ ] **Step 1: Verify the kept "Featured Picks" section still renders**

Open `index.html` and scroll to just below the new Featured Build section. Confirm:
- The dark "Featured Picks" cards section (with the 6 collection cards: Woods & Water, Protectors & Patriots, Infinity Her, Caution: May Offend, JP Shirt Collection, Forever Favorites) renders normally.
- Card hover behavior (lift, image opacity shift, shine, bottom-line accent) still works — these styles are shared with what we just removed and we need to confirm we didn't break them.

- [ ] **Step 2: Verify nothing else on the page broke**

Quickly scroll through the entire homepage. Confirm:
- Hero, stats, why-us, on-duty, and footer sections all render unchanged.
- No console errors in the browser devtools.

- [ ] **Step 3: Verify the CTA link works**

Click "Start Your Custom Build →". Expected: navigates to `custom-work.html`.

- [ ] **Step 4: No commit (verification-only task)**

If anything is broken, fix it in a follow-up commit before moving to Task 5.

---

## Task 5: Remove orphaned CSS from the old collections grid

**Files:**
- Modify: [`css/styles.css`](../../../css/styles.css) — delete lines that defined the now-removed section (originally lines 271–322, but line numbers will have shifted after Tasks 2–3 inserted new rules)

- [ ] **Step 1: Verify each class is unused before deleting**

Run each grep and confirm the result. If any returns matches outside `css/styles.css` (e.g. in another HTML file), STOP and re-evaluate — we may have missed a usage:

```bash
grep -rn "class=\"collections\"\|class=\"collections " --include="*.html" .
grep -rn "class=\"coll-tile\b\|coll-tile-image\|coll-tile-label" --include="*.html" .
grep -rn "class=\"coll-grid\"\|class=\"coll-grid " --include="*.html" .
grep -rn "class=\"collections-cta\"" --include="*.html" .
grep -rn "class=\"btn-outline-dark\"\|btn-outline-dark " --include="*.html" .
grep -rn "id=\"collections\"\|#collections" --include="*.html" --include="*.js" --include="*.css" .
```

Expected: Zero matches for each. If `btn-outline-dark` returns matches elsewhere (it might be reused on other pages), KEEP its rule — only delete the rules that are confirmed orphans.

- [ ] **Step 2: Delete the orphaned rules from styles.css**

Use the Edit tool. The block to remove starts at the `/* ── COLLECTIONS ── */` comment and ends with the `@media (max-width: 520px) { .coll-grid { ... } }` rule. Locate it via:

```bash
grep -n "── COLLECTIONS ──\|── FEATURED BUILD ──" css/styles.css
```

Replace this block:

```css
/* ── COLLECTIONS ── */
.collections { background: #EFEFEF; padding: 80px 0 90px; }
.collections-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.coll-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px 32px; margin-bottom: 48px; }

/* Featured collections (styled cards section) */
```

With:

```css
/* Featured collections (styled cards section) */
```

(This removes the unique-to-removed-section header, `.collections`, `.collections-inner`, and `.coll-grid` rules. Note: `.collections-inner` is **only** used by the removed section — the kept `.collections-featured` section uses its own `.collections-inner` reference at [index.html:236](../../../index.html#L236), which means we need to verify that one too — see Step 3.)

Then remove the `.coll-tile*` rules. Find:

```css
/* Simple tile style matching jpatscustom.com */
.coll-tile {
  display: flex; flex-direction: column; align-items: center;
  text-decoration: none; background: transparent;
  padding: 10px 10px 20px; transition: transform 0.25s ease;
}
.coll-tile:hover { transform: translateY(-4px); }
.coll-tile-image-wrap {
  width: 100%; aspect-ratio: 4 / 3;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 22px;
}
.coll-tile-image {
  max-width: 100%; max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 12px 18px rgba(0,0,0,0.18));
  transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
}
.coll-tile:hover .coll-tile-image { transform: scale(1.04); }
.coll-tile-label {
  font-family: 'DM Sans', sans-serif;
  font-weight: 700; font-size: 17px; letter-spacing: 0.08em;
  color: #111; text-transform: uppercase;
  text-decoration: underline; text-underline-offset: 4px;
  text-decoration-thickness: 2px;
  text-align: center;
}
@media (max-width: 900px) {
  .coll-grid { grid-template-columns: repeat(2, 1fr); gap: 32px 20px; }
}
@media (max-width: 520px) {
  .coll-grid { grid-template-columns: 1fr; gap: 32px; }
}
```

Replace with: (empty — delete the block entirely, leaving the `/* ── FEATURED BUILD ── */` block to follow directly)

Then remove `.collections-cta` and `.btn-outline-dark` (only if grep in Step 1 confirmed they're unused). Find and delete:

```css
.collections-cta { text-align: center; }
.btn-outline-dark {
  display: inline-flex; align-items: center; gap: 8px;
  border: 2px solid var(--tobacco); color: var(--tobacco);
  font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
  padding: 15px 32px; text-decoration: none; transition: background 0.2s, color 0.2s;
}
.btn-outline-dark:hover { background: var(--tobacco); color: var(--cream); }
```

- [ ] **Step 3: Handle the `.collections-inner` reuse**

The "Featured Picks" section at [index.html:236](../../../index.html#L236) uses `class="collections-inner"`. Since we just deleted the `.collections-inner` rule, that section will lose its `max-width: 1200px` container width.

Two options:
- **Option A (preferred — already in the plan):** The deletion in Step 2 only removed the standalone `.collections-inner` rule. Add it back as a shared rule:

  After Step 2's deletion, the file should now begin its Featured-Picks-related styles with `/* Featured collections (styled cards section) */`. Insert immediately above that comment:

  ```css
  /* Shared container for cream/dark collection sections */
  .collections-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

  ```

- **Option B (cleanup):** Rename the kept usage in `index.html:236` from `collections-inner` to `featured-build-inner` or a new `.section-inner` class. More invasive — skip unless requested.

Use Option A.

- [ ] **Step 4: Verify nothing visually changed**

Open `index.html`. Hard-reload (Cmd+Shift+R). Confirm:
- Featured Build section still renders correctly.
- Featured Picks (dark cards section below) still renders with proper container width and card styling.
- No layout shifts compared to before this task.

- [ ] **Step 5: Commit**

```bash
git add css/styles.css
git commit -m "Remove orphaned collections CSS now that the section is gone"
```

---

## Self-Review

Spec coverage check:

- ✅ Replaces `<section class="collections">` at index.html:172-232 → Task 1
- ✅ CSS section class `featured-build` → Task 2
- ✅ Eyebrow `FEATURED BUILD` → Task 1 markup, Task 2 left-align override
- ✅ Italicized "Evergreene" headline → Task 1 markup uses `<em>`, Task 2 inherits existing `.section-title em` styling
- ✅ Story paragraph copy → Task 1
- ✅ Three badges in `why-badge` styling family → Task 1 markup reuses `.why-badges`/`.why-badge`
- ✅ Primary CTA `Start Your Custom Build →` to `custom-work.html` using `.btn-primary` → Task 1
- ✅ Secondary link defaults to omitted → not in Task 1 markup ✓
- ✅ Desktop ≥900px editorial split, ~45/55 → Task 2 grid `45fr 55fr`
- ✅ Bento grid: hero left tall, 3 stacked right → Task 2 explicit grid placement
- ✅ Photo roles assigned correctly → Task 1 markup IDs each photo
- ✅ IMG_0678 omitted → Task 1 only references the 4 chosen photos
- ✅ Mobile <900px stack order text → hero → 3-up thumbs → badges → CTA → handled by the three-sibling structure in Task 1 markup (`.featured-build-text`, `.featured-build-gallery`, `.featured-build-action`) and `grid-template-areas` ordering in Tasks 2 and 3
- ✅ Cream background → Task 2
- ✅ Reuses `.coll-grain` and `.coll-shine` → Task 1 markup, Task 2 wires hover
- ✅ Subtle hover lift + grain shift → Task 2
- ✅ Matches `collections-inner` container width → Task 2 (1200px max-width, 24px padding)
- ✅ Accessible alt text → Task 1
- ✅ Semantic `<h2>` → Task 1 reuses `.section-title` (which is an `<h2>` per existing pattern)
- ✅ `prefers-reduced-motion` respected → Task 2

Placeholder scan: every code block is concrete, no TBDs.

Type/name consistency: `.featured-build`, `.featured-build-inner`, `.featured-build-text`, `.featured-build-gallery`, `.featured-build-action`, `.fb-photo`, `.fb-photo-hero/-mood/-action/-human` are used identically across HTML (Task 1) and CSS (Tasks 2–3). The two `-action` names (`.featured-build-action` for the badges/CTA wrapper vs `.fb-photo-action` for the chainsaw-shot photo cell) are intentionally distinct — different selectors, no collision.

---

## Final Sanity Pass

After Task 5, do one final cross-browser/cross-width spot-check:

- [ ] Desktop (1280px): looks right
- [ ] Tablet (820px): looks right
- [ ] Phone (390px): looks right
- [ ] Hover on each photo: works
- [ ] Reduced motion: hover disables transition
- [ ] CTA navigates to `custom-work.html`
- [ ] No console errors
- [ ] Featured Picks (dark cards section below) is undamaged

Done.
