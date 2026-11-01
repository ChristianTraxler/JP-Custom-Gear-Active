# Redesign notes

Branch `redesign-cosmetic` restyles the JP Custom Gear test site without touching behavior. It adds `css/jp-redesign.css` and `css/jp-pages.css`, new tokens in `css/default.css`, and markup changes on each page.

## Commits

| Hash | Area |
|---|---|
| `bc19ac7` | Global tokens, fonts, header, drawer, footer, cards, forms |
| `8daee97` | Home page |
| `89945fc` | Shop, collections, caution, product |
| `607a1ed` | Customizers, bulk orders, custom work |
| `276a753` | Services, contact, cart, thank-you |
| `28368a6` | Camo hoodie framing fix, new JP logo |
| `18e1f57` | Leave `custom-work(unused).html` untouched |
| `278d5d6` | Camo Reserve home tile sized to its square photo |
| `99da902` | Fix header width, focus states, reduced motion |

## Rolling back

Light rollback: remove the two `<link>`s to `css/jp-redesign.css` and `css/jp-pages.css`, and restore the old token values in `css/default.css`.

That leaves some markup changes in place: new classes, body classes, the hero `<picture>`, the KEEP svg, the logo lockup, the footer line, the section 6 headlines, and the removed Google Fonts links. A full rollback means reverting the five commits.

## Decisions needed from Christian

1. **Collections title.** Changed to "Eight collections." to match the 8 tiles.
2. **Hero video.** Removed the hidden `<video>` and the inline script that played it (`hero-bg.mp4` stays in the repo, unused).
3. **Caution tape strip wording.** "Caution · May offend · You were warned · Caution", approved.
4. **Vercel link is broken.** `vercel dev` fails (see Testing caveats), so checkout and logo upload were never exercised. Fix the link before merging.
5. **Home "why" intro.** It still says "We're not a big-box print shop...", which repeats the new section title. Left alone because of the wording rule. Reword?
6. **Services price label.** It reads "starting at $X" (existing text), not "from $X". Change it?
7. **Em dashes in JS strings.** Alert strings in the inline home JS and cart strings in `cart-page.js` (the "Free" pickup line and "Qty") contain em dashes. They are outside the cosmetic scope. Edit them?
8. **Thank-you page.** It has one link, so there is one patch button and no ink button. An ink button needs a new `href`. Which URL?

## Not built

- Live hat drawing in the customizer
- Slide-out bag, toast, and "request this order" flow (the site keeps `cart.html` and Stripe checkout)
- Separate On Duty page and its agency form (the home `#onduty` section stays)
- Hiding Caution items behind a "Show them" card in Shop All
- Color swatch buttons and sticky mobile buy bar on the product page
- Header that is transparent over the hero and solid on scroll
- Burn progress ring on the back-to-top button
- Splitting product names into title and spec (touches `products.js`)
- Switching product photos to WebP (touches `products.js`)
- Contact page FAQ
- Home patch-shape picker
- Mat ruler ticks and captions in the customizers
- Hat, Patch, and Shape tile pickers in the customizers
- "Add to bag" plus "Request a proof" button pair
- Per-section price captions in the customizers
- Shop filter-bar search, "All types", and "Featured" controls (the site has none)
- Contact page phone field, filter chips, file attach, and copy button
- Separate patch-shapes chart and agency/bulk block on Services (the patches card holds the chart in a hairline frame; the bulk strip became the dark `bulk.webp` band, inside the gutters to avoid horizontal scroll)
- Reference Services copy "What JP makes, and what it costs." and "Bulk quote / Department orders" (not in README section 6)

## README vs real code

- `custom-select.js` has no `.cs-trigger` or `.cs-arrow`. The native select acts as the trigger.
- Appendix A does not list the hooks in `logo-upload.js` and `richardson-chart.js`.
- The home trust row has 3 items, not 4, laid out as 3 columns at every size.
- The hat color control is a `<select>` with one swatch, not a swatch grid, so only `#cz-swatch` gets the ring.
- The Caution page has no `.shop-filter` markup, so there is no filter bar there.
- The Services page has no separate patch-shapes chart or agency/bulk block.
- The thank-you page has one link, not two.

## Editing later

- Transparent product images are listed by filename in the `.product-card` cutout selectors, because CSS cannot detect transparency. Add any new transparent image to that list.
- The square camo-reserve hoodie photos are cropped at the sides by the 4:5 cover frame.
- `.product-tag` was `display:none` and now shows as a tag on every card.
- At 901 to 1299px the nav search collapses to an icon box that expands on focus, because there is no room otherwise.
- The phone product grid is 2 columns at 420px and below (it was 1).
- The logo uses `images/redesign/badge.webp`. `J.PATS.png` is still in the repo.
- Header logo is `images/jp-custom-gear-logo-256.webp` (footer uses `-512`), made from `images/jp-custom-gear-logo.png` with the black corners masked off. Favicon and apple-touch icon are now `images/jp-custom-gear-icon-64.png` and `-180.png`.
- The Camo Reserve home tile is a square sized to its photo.
- Home: the Caution tile moved to the end of the DOM and has two decorative Caution hat photos (`alt=""`) in its tape strip. A "Shop all collections" link to `shop.html` was added.
- Home: featured-build badges that duplicate the ticket are hidden, not removed. The ticket Status reads "Made to Order".
- `shop.html`: h1 is now "The full lineup" and the eyebrow changed from "The Full Lineup" to "Shop all".
- Product page keeps DOM order: "Start Your Order" above the note, Add to cart below.
- Mat panels in the customizers only show around transparent preview images. Opaque photos fill the frame.
- Google Fonts links are removed from every page. Only `custom-work(unused).html` still has them.

## Testing caveats

- `vercel dev` fails. The CLI (`developerofcode`) cannot access the project in `.vercel/project.json` (`jp-custom-gear`, team `developer-of-code-llcs-projects`) and then tries to create a new project.
- Baseline and QA ran on a static server. `vercel.json` has no rewrites, so pages load, but API routes do not.
- Checkout and API logo upload were not tested.
- Final QA: smoke test identical to baseline, `npm test` 79/79, no JS, API or inline-script changes, no console errors. Four QA items were fixed: (1) the header overflowed horizontally from 1101 to 1299px (the compact nav rule now covers 901 to 1299px; the same overflow at 1280 also existed on the original site), (2) the empty-cart "Continue shopping" link had unreadable text on hover and focus, (3) `#pdp-qty` had no visible focus ring, (4) card hover zoom now turns off under `prefers-reduced-motion`.
- Existing quirk, unchanged: `#shopFilterCount` says "Showing 84 products" with 78 cards until a chip is clicked.
