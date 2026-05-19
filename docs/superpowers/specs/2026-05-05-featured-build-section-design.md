# Featured Build Section — Design Spec

**Date:** 2026-05-05
**Page:** `index.html` (homepage)
**Replaces:** The "Find Your Collection" section at [index.html:172-232](../../../index.html#L172-L232)

## Goal

Replace the current `<section class="collections">` tile grid with a **Featured Build** spotlight that uses real in-the-field photography to tell the story of one custom client (Evergreene Excavation), while also pitching forward with a CTA to start a custom order.

The slot is designed so future custom builds can rotate through it without renaming or restructuring.

## Why this change

The current "Find Your Collection" tiles are flat product shots organized as category navigation. Collection navigation is already well-represented on the homepage by:

- The "Featured Picks" cards section directly below at [index.html:235-345](../../../index.html#L235-L345)
- The "Shop Collections" CTA in the hero
- The site nav

Replacing the redundant tile grid with a storytelling section adds emotional/social-proof content the homepage currently lacks, and converts via a custom-build CTA. The lifestyle photography in `images/hats/product-showcase/` is well-suited to this — it shows one custom build in real use across multiple contexts (atmosphere, action, human moment, product close-up).

## Section behavior & content

### Identity

- CSS section class: `featured-build`
- Section eyebrow: `FEATURED BUILD`
- Headline: `Built for <em>Evergreene</em> Excavation.`
  - Italicized accent on the customer name follows the page's existing convention (e.g. "Find Your *Collection*", "JP *vs.* Everyone Else", "Designed for *Duty.*")

### Story copy

> A working excavation crew needed gear that could earn its keep — long days in the cab, then straight into town without missing a beat. We built this run from the ground up: bark camo trucker, custom leatherette hex patch, every stitch dialed in. Real gear for real work.

This copy is placeholder-quality and intended to be edited with real customer details when available.

### Badges (under story, before CTA)

Three pill-style badges, matching the existing `why-badge` styling family:

- `Land Clearing & Excavation`
- `Custom Leatherette Patch`
- `Made to Order`

### CTAs

- **Primary CTA:** `Start Your Custom Build →` → links to `custom-work.html`
  - Reuses the existing `.btn-primary` button class
  - Rationale: a "Start Your Custom Build" CTA is a discovery step. `custom-work.html` is the discovery destination; `#contact` is the commitment step. This matches the convention used at [index.html:50](../../../index.html#L50) and [index.html:86](../../../index.html#L86).
- **Secondary text link:** `See more builds →` → `custom-work.html`
  - **Default: omit.** Implementation should ship without this link to keep the section focused. Can be added later if the page feels under-CTA'd.

## Layout

### Desktop (≥ 900px)

Two-column editorial split, ~45% / 55%:

```
┌─ LEFT (~45%) ────────────┬─ RIGHT (~55%) bento grid ───────┐
│                          │                                  │
│  [eyebrow line]          │  ┌─────────────┬──────────────┐  │
│  FEATURED BUILD          │  │             │  IMG_0677    │  │
│                          │  │             │  (moody)     │  │
│  Built for Evergreene    │  │  IMG_4757   ├──────────────┤  │
│    Excavation.           │  │  (HERO,     │  IMG_4754    │  │
│                          │  │   tall,     │  (action)    │  │
│  Story paragraph...      │  │   anchors)  ├──────────────┤  │
│                          │  │             │  IMG_4756    │  │
│  [badge] [badge] [badge] │  │             │  (dad+kid)   │  │
│                          │  └─────────────┴──────────────┘  │
│  [Start Your Custom →]   │                                  │
│  see more builds →       │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

**Photo roles:**

| Image | Role | Position |
|---|---|---|
| `IMG_4757.jpeg` | Hero anchor — clean front-on bark camo trucker product shot | Tall left column of the bento grid (full grid height) |
| `IMG_0677.jpeg` | Atmosphere/context — moody hat-on-equipment at sunset | Top-right of bento |
| `IMG_4754.png` | Action/in-use — chainsaw work shot | Middle-right of bento |
| `IMG_4756.png` | Human moment — dad and kid in excavator cab | Bottom-right of bento |

`IMG_0678.jpeg` is intentionally **omitted** because it's nearly a duplicate of `IMG_0677` (same hat, same setting, slightly different angle). Easy to substitute later.

### Mobile (< 900px)

Single-column stack, in narrative order:

1. Eyebrow + headline + story paragraph
2. Hero photo (`IMG_4757`) full-width
3. Three context thumbnails as a 3-up row (`IMG_0677`, `IMG_4754`, `IMG_4756`)
4. Badges
5. Primary CTA
6. Optional secondary link

### Background & visual treatment

- **Background:** Cream/walnut tones — keeps the existing alternating cream/dark page rhythm intact (this section stays light; "Featured Picks" section directly below stays dark)
- **Photo treatment:** Reuse existing `coll-grain` and `coll-shine` overlays so photos feel native to the site's existing card styling
- **Hover:** Subtle lift + grain shift on photos, matching the existing `coll-card` hover behavior — same family, not new
- **Spacing:** Match existing `collections-inner` container width and vertical padding

## Accessibility

- Each photo gets descriptive `alt` text (e.g. "Evergreene Excavation bark camo trucker hat with leatherette hex patch resting on excavator equipment at sunset")
- The headline uses semantic `<h2>` to match existing section headings
- The primary CTA is a real `<a>` with `aria-label` if visual text is shortened on smaller breakpoints
- All hover/lift effects respect `prefers-reduced-motion`
- Badges are decorative text, not interactive — no role needed
- Photo grid uses sufficient color contrast for any overlaid text (none currently planned, but if added in future rotations, must meet WCAG AA)

## Out of scope (explicit non-goals)

- **Not building a CMS / admin UI for rotating builds.** Future builds will be edited directly in HTML, same as today's content. Section is *structured* to make rotation easy, but no tooling.
- **Not removing the "Featured Picks" section** below. Collection navigation remains.
- **Not redesigning `custom-work.html`** — only linking to it.
- **Not changing the global nav, footer, or any other section.**
- **Not adding a multi-photo lightbox or carousel** — static bento grid only.

## Files affected

- `index.html` — replace the `<section class="collections" id="collections">` block (lines 172–232)
- `css/` — add new styles for `.featured-build` and its bento grid (location: append to whichever stylesheet currently holds the `.collections` styles, to keep related styles colocated)
- `images/hats/product-showcase/` — already populated; no new assets needed

## Open questions / future iterations

- Whether to revisit the `id="collections"` anchor — currently the removed section owns that id. If anything links to `#collections` we should either keep the id on a remaining section or update those links. **Action during implementation: grep for `#collections` references and resolve.**
- Whether the customer story copy should be replaced with a real quote or job-specific detail (low-priority polish, can ship with placeholder)
