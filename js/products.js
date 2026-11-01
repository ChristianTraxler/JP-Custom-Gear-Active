// Shared color palettes
const RICHARDSON_112_COLORS = [
  "Black",
  "Black / White",
  "Charcoal / Black",
  "Charcoal / White",
  "Heather / Black",
  "Khaki / White",
  "Red / Black",
  "Loden / Black",
  "Harvest",
  "Marsh",
  "Bark",
  "Blaze",
  "Salt Water",
  "Bottomland"
];

const RICHARDSON_168_COLORS = [
  "Black",
  "Charcoal / Black"
];

const RICHARDSON_112PFP_COLORS = [
  "Harvest",
  "Blaze",
  "Bark",
  "Marsh",
  "Bottomland",
  "Salt Water"
];

const RICHARDSON_112P_COLORS = [
  "Bottomland",
  "Harvest",
  "Blaze",
  "Bark",
  "Marsh",
  "Salt Water"
];

const RICHARDSON_168P_COLORS = [
  "Black",
  "Charcoal/Black",
  "Harvest",
  "Marsh",
  "Bark",
  "Salt Water",
  "Bottomland"
];

const RICHARDSON_256P_COLORS = [
  "Bark",
  "Bottomland",
  "Harvest",
  "Marsh",
  "Salt Water"
];

const INFINITY_HER_COLORS = [
  "Black Leopard",
  "Black/White Cow",
  "Grey Snow Leopard"
];

const FLAT_BILL_COLORS = [
  "Black / Black",
  "Charcoal / Black",
  "Navy / White",
  "Red / White",
  "Heather Grey / Black",
  "Khaki / Brown"
];

const TEE_COLORS = [
  "Natural",
  "Ivory",
  "Sand",
  "Mustard",
  "Crimson",
  "Hunter Green",
  "Pepper",
  "Blue Jean",
  "Black",
  "White"
];

const COMFORT_COLORS_COLORS = [
  "Pepper",
  "Black",
  "Crunchberry",
  "Blue Jean",
  "Seafoam",
  "Moss",
  "Ivory",
  "Granite",
  "Violet",
  "Lagoon"
];

const TEE_SIZES = [
  { label: "S",  priceCents: 2500 },
  { label: "M",  priceCents: 2500 },
  { label: "L",  priceCents: 2500 },
  { label: "XL", priceCents: 2500 },
  { label: "2X", priceCents: 2700 },
  { label: "3X", priceCents: 2700 }
];

const LEATHERETTE_PATCH_COLORS = [
  "Buckskin to Black", "Walnut to Black", "Rawhide to Black", "Black to Black",
  "Bright White to Black", "Charcoal to Black", "Olive to Black", "Primrose to Black",
  "Black to Silver", "Black to Copper", "Black to Gold", "Indigo to Black"
];

const TUMBLER_COLORS = [
  "Stainless",
  "Matte Black",
  "White",
  "Rose Gold",
  "Seafoam",
  "Blush Pink",
  "Navy"
];

const TUMBLER_SKINNY_COLORS = [
  "Stainless",
  "Matte Black",
  "White",
  "Blush Pink",
  "Lavender",
  "Seafoam"
];

// Product catalog — slug keys map to product.html?id=<slug>
const PRODUCTS = {
  "she-prayed-tee": {
    name: "She Prayed Until the Chains Fell Off Comfort Color Tee",
    tag: "Shirt",
    priceCents: 2500,
    image: "images/shirts/IMG_1385.png",
    gallery: [
      "images/shirts/IMG_1385.png",
      "images/shirts/IMG_1297.png"
    ],
    galleryFit: "contain",
    galleryBackgrounds: ["#F3DFC8", "#e1d3c4"],
    category: "The Foam Side",
    categoryHref: "shop-foam-side.html",
    hatType: "none",
    description: "A soft, garment-dyed Comfort Colors® tee with a faith-forward graphic that says it all. Ring-spun cotton, broken-in feel from day one, and a print that holds up wash after wash.",
    features: [
      "100% ring-spun cotton, garment-dyed",
      "Relaxed unisex fit — true to size",
      "Screen-printed in the USA",
      "Pre-shrunk for minimal wash shrinkage"
    ],
    colorsLabel: "Color",
    colors: COMFORT_COLORS_COLORS,
    sizes: TEE_SIZES
  },

  "salt-water-camo-hat": {
    name: "JP Salt Water Camo Custom Hat",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/salt-water-camo.png",
    category: "Woods & Water",
    categoryHref: "shop-woods-water.html",
    hatType: "112",
    description: "Coastal camo built for dock days and deep water. Richardson 112 trucker profile with a breathable mesh back, pre-curved brim, and a custom JP salt-water camo patch.",
    features: [
      "Richardson 112 platform — structured 6-panel",
      "Breathable mesh back, snap-back adjustable",
      "Cotton-poly front with a raised embroidered patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: [
      "Salt Water Camo / White",
      "Salt Water Camo / Black",
      "Salt Water Camo / Khaki",
      "Marsh Duck / Khaki",
      "Bark Duck / Black"
    ]
  },

  "later-after-while-tee": {
    name: "Later, After While Alligator Comfort Color Tee",
    tag: "Shirt",
    priceCents: 2500,
    image: "images/shirts/IMG_1288.png",
    imageFit: "cover",
    gallery: [
      "images/shirts/IMG_1288.png",
      "images/shirts/IMG_1297.png"
    ],
    galleryFit: "contain",
    galleryBackgrounds: ["#f0e5d4", "#e1d3c4"],
    category: "The Foam Side",
    categoryHref: "shop-foam-side.html",
    hatType: "none",
    description: "See you later, alligator — after while, crocodile. A Comfort Colors® garment-dyed tee with pink-star alligator art on the front and 'After While' on the back. Soft from the first wear, broken-in for life.",
    features: [
      "100% ring-spun cotton, garment-dyed",
      "Relaxed unisex fit — true to size",
      "Front-and-back screen print",
      "Pre-shrunk for minimal wash shrinkage"
    ],
    colorsLabel: "Color",
    colors: COMFORT_COLORS_COLORS,
    sizes: TEE_SIZES
  },

  "nurse-tee": {
    name: "Nurse Checkered Comfort Color Tee",
    tag: "Shirt",
    priceCents: 2500,
    image: "images/shirts/IMG_1292.png",
    imageFit: "cover",
    gallery: [
      "images/shirts/IMG_1292.png",
      "images/shirts/IMG_1297.png"
    ],
    galleryFit: "contain",
    galleryBackgrounds: ["#f4e8d4", "#e1d3c4"],
    category: "The Foam Side",
    categoryHref: "shop-foam-side.html",
    hatType: "none",
    description: "Big love for the ones who show up shift after shift. A Comfort Colors® garment-dyed tee with a bold multi-color checkered 'NURSE' graphic and a stethoscope line drawing on top. Soft, lived-in, built to last.",
    features: [
      "100% ring-spun cotton, garment-dyed",
      "Relaxed unisex fit — true to size",
      "Screen-printed in the USA",
      "Pre-shrunk for minimal wash shrinkage"
    ],
    colorsLabel: "Color",
    colors: COMFORT_COLORS_COLORS,
    sizes: TEE_SIZES
  },

  "motherhood-tee": {
    name: "Motherhood Checkered Comfort Color Tee",
    tag: "Shirt",
    priceCents: 2500,
    image: "images/shirts/IMG_1293.png",
    imageFit: "cover",
    gallery: [
      "images/shirts/IMG_1293.png",
      "images/shirts/IMG_1297.png"
    ],
    galleryFit: "contain",
    galleryBackgrounds: ["#f4e6d4", "#e1d3c4"],
    category: "The Foam Side",
    categoryHref: "shop-foam-side.html",
    hatType: "none",
    description: "Some sweet, some salty, some sassy — either way we're rockin' it. A Comfort Colors® garment-dyed tee with a checkered circle on the front pocket and a full checkered 'MOTHERHOOD' graphic across the back.",
    features: [
      "100% ring-spun cotton, garment-dyed",
      "Relaxed unisex fit — true to size",
      "Front pocket print + full back print",
      "Pre-shrunk for minimal wash shrinkage"
    ],
    colorsLabel: "Color",
    colors: COMFORT_COLORS_COLORS,
    sizes: TEE_SIZES
  },

  "mama-floral-tee": {
    name: "Mama Floral Comfort Color Tee",
    tag: "Shirt",
    priceCents: 2500,
    image: "images/shirts/IMG_1384.png",
    imageFit: "cover",
    gallery: [
      "images/shirts/IMG_1384.png",
      "images/shirts/IMG_1297.png"
    ],
    galleryFit: "contain",
    galleryBackgrounds: ["#f4e1cd", "#e1d3c4"],
    category: "The Foam Side",
    categoryHref: "shop-foam-side.html",
    hatType: "none",
    description: "For the mama who keeps it all blooming. A Comfort Colors® garment-dyed tee with a ditsy-floral 'MAMA' graphic on a soft sage canvas. Broken-in feel from the first wear, built to last wash after wash.",
    features: [
      "100% ring-spun cotton, garment-dyed",
      "Relaxed unisex fit — true to size",
      "Screen-printed in the USA",
      "Pre-shrunk for minimal wash shrinkage"
    ],
    colorsLabel: "Color",
    colors: COMFORT_COLORS_COLORS,
    sizes: TEE_SIZES
  },

  "nurse-rainbow-tee": {
    name: "Nurse Rainbow Comfort Color Tee",
    tag: "Shirt",
    priceCents: 2500,
    image: "images/shirts/IMG_1379.png",
    imageFit: "cover",
    gallery: [
      "images/shirts/IMG_1379.png",
      "images/shirts/IMG_1297.png"
    ],
    galleryFit: "contain",
    galleryBackgrounds: ["#f3e4d1", "#e1d3c4"],
    category: "The Foam Side",
    categoryHref: "shop-foam-side.html",
    hatType: "none",
    description: "Big color for the ones who show up shift after shift. A Comfort Colors® garment-dyed tee with an arched, rainbow-gingham 'NURSE' varsity graphic. Soft, lived-in, and built to last.",
    features: [
      "100% ring-spun cotton, garment-dyed",
      "Relaxed unisex fit — true to size",
      "Screen-printed in the USA",
      "Pre-shrunk for minimal wash shrinkage"
    ],
    colorsLabel: "Color",
    colors: COMFORT_COLORS_COLORS,
    sizes: TEE_SIZES
  },

  "bottomland-camo-256p": {
    name: "JP Custom Bottomland Camo Hat - Richardson 256P",
    tag: "Hat",
    priceCents: 3000,
    image: "images/hats/bottomland-camo.png",
    gallery: ["images/hats/bottomland-camo.png", "images/patches/leatherette_colos.png"],
    category: "Woods & Water",
    categoryHref: "shop-woods-water.html",
    hatType: "256P",
    description: "The Richardson 256P in Mossy Oak Bottomland — a 5-panel, rope-trim, low-profile classic. Perfect canvas for a JP leather or PVC patch.",
    features: [
      "Richardson 256P — 5-panel rope cap",
      "Structured low profile, snap-back",
      "Choose leather or PVC front patch",
      "One size fits most"
    ],
    colorsLabel: "Camo",
    colors: RICHARDSON_256P_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "mama-floral-tumbler": {
    name: "Mama 20oz Engraved Floral Tumbler",
    tag: "Tumbler",
    priceCents: 2000,
    image: "images/tumblers/mama-tumbler.png",
    category: "Forever Favorites",
    categoryHref: "shop-forever-favorites.html",
    hatType: "none",
    description: "A 20oz double-wall insulated tumbler with a deep laser-engraved floral 'Mama' design. Keeps drinks cold for 24+ hours, hot for 12. A daily-use heirloom.",
    features: [
      "20oz stainless steel, double-wall vacuum insulated",
      "Precision laser engraving — dishwasher safe",
      "Sliding lid + straw included",
      "Fits most cup holders"
    ],
    colorsLabel: "Color",
    colors: TUMBLER_COLORS
  },

  "blossom-bliss-tumbler": {
    name: "Blossom Bliss 20oz Skinny Tumbler",
    tag: "Tumbler",
    priceCents: 2000,
    image: "images/tumblers/blossom-tumbler.png",
    category: "Forever Favorites",
    categoryHref: "shop-forever-favorites.html",
    hatType: "none",
    description: "Skinny-profile 20oz tumbler with a blossom-and-bliss laser engraving. Slim enough for any cup holder, insulated enough to last all day.",
    features: [
      "20oz stainless steel skinny tumbler",
      "Double-wall vacuum insulation",
      "Laser-engraved — never peels or fades",
      "Includes lid and straw"
    ],
    colorsLabel: "Color",
    colors: TUMBLER_SKINNY_COLORS
  },

  // ── Custom builders (tumbler / keychain / patch / hat) ──────────────────────────
  // These productIds are added by the customizer pages (js/customize-*.js). Their
  // CHECKOUT price is computed per-selection by js/custom-pricing.js, not from
  // `priceCents` below (which is only a starting-price fallback for display). Each
  // MUST exist here so checkout can resolve a name and order emails can show a thumb.
  // `hidden` keeps them out of site search/shop listings (they have their own pages).
  "custom-tumbler": {
    name: "Custom Tumbler",
    tag: "Tumbler",
    priceCents: 2000,
    image: "images/tumblers/mama-tumbler.png",
    category: "Forever Favorites",
    categoryHref: "shop-forever-favorites.html",
    hatType: "none",
    hidden: true,
    description: "A made-to-order 20oz engraved tumbler built from your selections on the customizer.",
    features: [
      "20oz stainless steel, double-wall vacuum insulated",
      "Custom laser engraving — your text or logo",
      "Sliding lid + straw included"
    ],
    colorsLabel: "Color",
    colors: TUMBLER_COLORS
  },

  "custom-camo-tumbler": {
    name: "The Camo Reserve 20 oz Stainless Steel Tumbler",
    tag: "Tumbler",
    priceCents: 2500,
    image: "images/camo-collection/tumblers/blackwater-camo-tumbler.webp",
    imageFit: "cover",
    category: "The Camo Reserve",
    categoryHref: "shop-camo-reserve.html",
    hatType: "none",
    hidden: true,
    description: "A 20 oz double-wall stainless steel camo tumbler in Bone Yard, Blackwater, or Timber Bark Camo, blank or personalized from your selections on the customizer.",
    features: [
      "20 oz stainless steel tumbler",
      "Double-wall insulated design",
      "Bone Yard, Blackwater, or Timber Bark Camo",
      "Clear lid included",
      "Available blank or customized"
    ],
    colorsLabel: "Color",
    colors: []
  },

  "custom-camo-koozie": {
    name: "The Camo Reserve Stainless Steel Can Koozie",
    tag: "Koozie",
    priceCents: 2500, // PLACEHOLDER PRICE: confirm with client (charged price comes from js/custom-pricing.js)
    image: "images/camo-collection/steel-can-koozies/ghost-marsh-camo-koozie.webp",
    imageFit: "cover",
    category: "The Camo Reserve",
    categoryHref: "shop-camo-reserve.html",
    hatType: "none",
    hidden: true,
    description: "A stainless steel camo can koozie in Ghost Marsh or Timber Bark Camo, blank or personalized from your selections on the customizer.",
    features: [
      "Durable stainless steel construction",
      "Insulated design to help keep drinks colder longer",
      "Ghost Marsh or Timber Bark Camo",
      "Available blank or customized"
    ],
    colorsLabel: "Color",
    colors: []
  },

  "custom-mossy-oak-hoodie": {
    name: "Custom Mossy Oak Washed Bottomland Camo Hoodie",
    tag: "Hoodie",
    priceCents: 6000,
    image: "images/camo-collection/hoodies/mossy-oak-bottomland-hoodie.webp",
    imageFit: "cover",
    category: "The Camo Reserve",
    categoryHref: "shop-camo-reserve.html",
    hatType: "none",
    hidden: true,
    description: "A made-to-order Mossy Oak Washed Bottomland Camo pullover hoodie, blank or customized front and back from your selections on the customizer.",
    features: [
      "Authentic Mossy Oak Washed Bottomland camo pattern",
      "Comfortable pullover hoodie with drawstring hood",
      "Front and back customization available",
      "Available blank or customized"
    ],
    colorsLabel: "Color",
    colors: []
  },

  "custom-mossy-oak-longsleeve": {
    name: "Custom Mossy Oak Washed Bottomland Camo Long Sleeve T-Shirt",
    tag: "Shirt",
    priceCents: 3800,
    image: "images/camo-collection/long-sleeve/mossy-oak-bottomland-longsleeve.webp",
    imageFit: "cover",
    category: "The Camo Reserve",
    categoryHref: "shop-camo-reserve.html",
    hatType: "none",
    hidden: true,
    description: "A made-to-order Mossy Oak Washed Bottomland Camo long sleeve t-shirt, blank or customized front and back from your selections on the customizer.",
    features: [
      "Authentic Mossy Oak Washed Bottomland camo pattern",
      "Comfortable long sleeve design",
      "Front and back customization available",
      "Available blank or customized"
    ],
    colorsLabel: "Color",
    colors: []
  },

  "custom-mad-hatter-tee": {
    name: "Custom Mad Hatter Fog Camo Short Sleeve T-Shirt",
    tag: "Shirt",
    priceCents: 3000, // From price (blank). Charged price comes from js/custom-pricing.js
    image: "images/camo-collection/short-sleeve/mad-hatter-fog-camo-tee.webp",
    imageFit: "cover",
    category: "The Camo Reserve",
    categoryHref: "shop-camo-reserve.html",
    hatType: "none",
    hidden: true,
    description: "A made-to-order Mad Hatter Fog Camo short sleeve t-shirt, blank or customized front and back from your selections on the customizer.",
    features: [
      "Mad Hatter Fog Camo pattern",
      "Comfortable short sleeve style",
      "Front and back customization available",
      "Available blank or customized"
    ],
    colorsLabel: "Color",
    colors: []
  },

  "custom-mad-hatter-vintage-duck-tee": {
    name: "Custom Mad Hatter Vintage Duck Camo Short Sleeve T-Shirt",
    tag: "Shirt",
    priceCents: 3500,
    image: "images/camo-collection/short-sleeve/mad-hatter-vintage-duck-camo-tee.webp",
    imageFit: "cover",
    category: "The Camo Reserve",
    categoryHref: "shop-camo-reserve.html",
    hatType: "none",
    hidden: true,
    description: "A made-to-order Mad Hatter Vintage Duck Camo short sleeve t-shirt, blank or customized front and back from your selections on the customizer.",
    features: [
      "Mad Hatter Vintage Duck Camo pattern",
      "Comfortable short sleeve style",
      "Front and back customization available",
      "Available blank or customized"
    ],
    colorsLabel: "Color",
    colors: []
  },

  "custom-camo-beanie": {
    name: "Custom Richardson Duck Camo Beanies",
    tag: "Beanie",
    priceCents: 2500,
    image: "images/camo-collection/Beanies/beanie-americana.webp",
    imageFit: "cover",
    category: "The Camo Reserve",
    categoryHref: "shop-camo-reserve.html",
    hatType: "none",
    hidden: true,
    description: "Richardson duck camo cuffed knit beanies in seven colors, blank or customized with a leather patch, business logo, lettering, or custom artwork from your selections on the customizer.",
    features: [
      "Richardson brand beanies",
      "Warm knit construction",
      "Classic cuffed design",
      "Seven duck camo colors",
      "Available blank or customized"
    ],
    colorsLabel: "Color",
    colors: []
  },

  "custom-hoodie": {
    name: "Custom Independent Trading Co. Camo Hoodie",
    tag: "Hoodie",
    priceCents: 4500,
    image: "images/camo-reserve/hoodies/duck-camo-hoodie.webp",
    imageFit: "cover",
    category: "The Camo Reserve",
    categoryHref: "shop-camo-reserve.html",
    hatType: "none",
    hidden: true,
    description: "A made-to-order Independent Trading Co. camo pullover hoodie (Duck Camo or Washed Camo), blank or customized front and back from your selections on the customizer.",
    features: [
      "Independent Trading Co. pullover hoodie",
      "Duck Camo or Washed Camo pattern",
      "Front and back customization available",
      "Available blank or customized"
    ],
    colorsLabel: "Color",
    colors: []
  },

  "custom-hat": {
    name: "Custom Hat",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/salt-water-camo.png",
    category: "Forever Favorites",
    categoryHref: "shop-forever-favorites.html",
    hatType: "none",
    hidden: true,
    description: "A made-to-order embroidered or patch hat built from your selections on the customizer.",
    features: [
      "Choose your hat style and color",
      "Custom embroidery, leather, or PVC patch",
      "Your text or logo"
    ],
    colorsLabel: "Color",
    colors: []
  },

  "custom-keychain": {
    name: "Custom Keychain",
    tag: "Keychain",
    priceCents: 600,
    image: "images/keychains/keychain-westward-farms.png",
    category: "Forever Favorites",
    categoryHref: "shop-forever-favorites.html",
    hatType: "none",
    hidden: true,
    description: "A made-to-order engraved leatherette keychain built from your selections on the customizer.",
    features: [
      "Leatherette, laser engraved",
      "Choose shape, size, and hardware",
      "Your text or logo"
    ],
    colorsLabel: "Color",
    colors: []
  },

  "custom-patch": {
    name: "Custom Patch",
    tag: "Patch",
    priceCents: 400,
    image: "images/patches/patch-shapes-card.png",
    category: "Forever Favorites",
    categoryHref: "shop-forever-favorites.html",
    hatType: "none",
    hidden: true,
    description: "A made-to-order engraved leatherette patch built from your selections on the customizer.",
    features: [
      "Leatherette, laser engraved",
      "Choose shape and size",
      "Your text or logo"
    ],
    colorsLabel: "Color",
    colors: []
  },

  "show-me-flat-bill": {
    name: "Show Me Richardson Flat Bill Hat",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/show-me.png",
    category: "Caution: May Offend",
    categoryHref: "shop-caution-may-offend.html",
    hatType: "112PFP",
    description: "A flat-bill snapback with attitude — 'Show Me' front and center on a structured 6-panel crown. High-profile, hard bill, zero apologies.",
    features: [
      "Structured high-profile 6-panel",
      "Flat bill, snap-back adjustable",
      "Raised embroidery or patch front",
      "One size fits most"
    ],
    colorsLabel: "Camo",
    colors: RICHARDSON_112PFP_COLORS
  },

  "shit-show-flat-bill": {
    name: "Shit Show Richardson Flat Bill Snapback",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/shit-show.png",
    category: "Caution: May Offend",
    categoryHref: "shop-caution-may-offend.html",
    hatType: "112PFP",
    description: "For the ringmaster of the daily circus. Bold front-panel graphic on a structured flat-bill snapback — loud, proud, and built to last.",
    features: [
      "Structured high-profile 6-panel",
      "Flat bill, snap-back adjustable",
      "Raised embroidery front",
      "One size fits most"
    ],
    colorsLabel: "Camo",
    colors: RICHARDSON_112PFP_COLORS
  },

  "nc-state-flag-112": {
    name: "NC State Flag Richardson 112 Hat",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/nc-flag.png",
    gallery: ["images/hats/nc-flag.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Forever Favorites",
    categoryHref: "shop-forever-favorites.html",
    hatType: "112",
    description: "Home-state pride on the Richardson 112 platform. The NC state flag rendered as a leather or PVC patch on our best-selling trucker profile.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Choose leather or PVC front patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "nc-trucker-112": {
    name: "NC Richardson 112 Trucker Hat",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/nc-trucker.png",
    imageFit: "cover",
    category: "Forever Favorites",
    categoryHref: "shop-forever-favorites.html",
    hatType: "112",
    description: "Clean NC script on a Richardson 112 trucker. The everyday hat for Carolina folks — built to wear in, not out.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Raised embroidery or patch front",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS
  },

  "bass-fish-trucker-112": {
    name: "Bass Fish Trucker Hat - Richardson 112",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/bass-fish.png",
    category: "Woods & Water",
    categoryHref: "shop-woods-water.html",
    hatType: "112",
    description: "Built on the Richardson 112 platform with a bold bass-fish patch and a breathable mesh back. Adjustable snap-back sizing and cotton-blend materials make this a go-to for fishing, casual wear, or gifting the bass-fishing fan in your life.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Bold bass-fish patch, raised and durable",
      "Breathable mesh back, snap-back adjustable",
      "Cotton-blend front panels",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS
  },

  "same-asshole-different-day": {
    name: "Same Asshole Different Day Trucker Cap - Richardson 112",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/same-asshole.png",
    imageFit: "cover",
    category: "Caution: May Offend",
    categoryHref: "shop-caution-may-offend.html",
    hatType: "112",
    description: "Honest headwear for anyone who's seen a Monday. Richardson 112 trucker with a raised patch front — says what everyone's thinking.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Raised patch front",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS
  },

  "milfin-aint-easy": {
    name: "\"Milfin Ain't Easy\" Classic Trucker Hat",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_1301.png",
    imageFit: "cover",
    category: "Caution: May Offend",
    categoryHref: "shop-caution-may-offend.html",
    hatType: "112",
    description: "A classic trucker with a wink. Richardson 112 silhouette, bold front patch, all-day comfort.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Bold embroidered or PVC patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS
  },

  "first-responder": {
    name: "Custom First Responder Hats",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/first-responder.png",
    gallery: ["images/hats/first-responder.png", "images/patches/leatherette_colos.png"],
    category: "Protectors & Patriots",
    categoryHref: "shop-protectors-patriots.html",
    hatType: "112",
    description: "Built for the people who run toward it. Custom first-responder hats — police, fire, EMS, dispatch — with agency-approved patches, badge numbers, and unit details.",
    features: [
      "Richardson 112 trucker or flex-fit options",
      "Agency-approved embroidery, leather, or PVC patches",
      "Badge numbers, unit names, and callsigns welcome",
      "Bulk pricing available for departments"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "custom-bride-hat": {
    name: "Custom Bride Hat – Choose Your Hat, Patch & Name!",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/custom-bride.png",
    category: "Infinity Her",
    categoryHref: "shop-infinity-her.html",
    hatType: "infinity-her",
    description: "The bride hat, your way. Pick the hat style, the patch, and the name or date — a bachelorette party favorite built to actually get worn after the wedding.",
    features: [
      "Choose Richardson 112, Infinity Her, or flat-bill",
      "Custom name, date, or phrase embroidered",
      "Leather or PVC patch options",
      "Bulk pricing for bridal parties"
    ],
    colorsLabel: "Color",
    colors: ["White / Gold", "White / Rose Gold", "Blush / White", "Black / White", "Ivory / Gold", "Champagne / White"]
  },

  "unsupervised-112": {
    name: "In My Defense, I Was Left Unsupervised – Richardson 112",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/in-my-defense.png",
    gallery: ["images/hats/in-my-defense.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Caution: May Offend",
    categoryHref: "shop-caution-may-offend.html",
    hatType: "112",
    description: "The universal defense, now in hat form. Richardson 112 trucker with a front patch that explains a lot.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Leather or PVC front patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "mama-tried-112-v1": {
    name: "Mama Tried – Richardson 112 Trucker Hat",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/mama-tried.png",
    gallery: ["images/hats/mama-tried.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Forever Favorites",
    categoryHref: "shop-forever-favorites.html",
    hatType: "112",
    description: "A tip of the cap to every mother who did her best. Richardson 112 trucker with the 'Mama Tried' front patch — an instant classic.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Leather or PVC front patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "mama-tried-112-v2": {
    name: "Mama Tried – Richardson 112 Trucker (Variant)",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/mama-tried-variant.png",
    gallery: ["images/hats/mama-tried-variant.png", "images/patches/leatherette_colos.png"],
    category: "Forever Favorites",
    categoryHref: "shop-forever-favorites.html",
    hatType: "112",
    description: "The 'Mama Tried' hat in a second patch style — same hat, fresh look.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Alt-style leather or PVC front patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "mama-tried-168": {
    name: "Mama Tried – Richardson 168 7-Panel Trucker",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_1303.png",
    gallery: ["images/hats/IMG_1303.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Forever Favorites",
    categoryHref: "shop-forever-favorites.html",
    hatType: "168P",
    description: "The 'Mama Tried' patch on the Richardson 168 — a 7-panel trucker with a taller crown and a vintage feel.",
    features: [
      "Richardson 168 — 7-panel high-crown trucker",
      "Breathable mesh back, snap-back adjustable",
      "Leather or PVC front patch",
      "One size fits most"
    ],
    colorsLabel: "Camo",
    colors: RICHARDSON_168P_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "dont-be-a-cock-sucker-168": {
    name: "Don't Be A Cock Sucker – Richardson 168 7-Panel Trucker",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_1192.png",
    gallery: ["images/hats/IMG_1192.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Caution: May Offend",
    categoryHref: "shop-caution-may-offend.html",
    hatType: "168P",
    description: "A patch that says it without saying it — a rooster and a sucker. Richardson 168 7-panel duck-camo trucker with a laser-engraved leather patch.",
    features: [
      "Richardson 168 — 7-panel high-crown trucker",
      "Breathable mesh back, snap-back adjustable",
      "Laser-engraved leather front patch",
      "One size fits most"
    ],
    colorsLabel: "Camo",
    colors: RICHARDSON_168P_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "guns-titties-beer-freedom-168": {
    name: "Guns, Titties, Beer & Freedom – Richardson 168 7-Panel Trucker",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_1294.png",
    gallery: ["images/hats/IMG_1294.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Caution: May Offend",
    categoryHref: "shop-caution-may-offend.html",
    hatType: "168P",
    description: "The American starter pack on a Richardson 168 7-panel duck-camo trucker. Laser-engraved leather flag patch — built for the guy who knows what he likes.",
    features: [
      "Richardson 168 — 7-panel high-crown trucker",
      "Breathable mesh back, snap-back adjustable",
      "Laser-engraved leather front patch",
      "One size fits most"
    ],
    colorsLabel: "Camo",
    colors: RICHARDSON_168P_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "mimi-cheetah-infinity-her": {
    name: "Mimi – Infinity Her Cheetah Print Hat",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/mimi-her-cheetah.png",
    imageFit: "cover",
    category: "Infinity Her",
    categoryHref: "shop-infinity-her.html",
    hatType: "infinity-her",
    description: "For the coolest grandma in the room. Infinity Her cheetah-print ponytail-friendly hat with a custom 'Mimi' patch.",
    features: [
      "Infinity Her platform — ponytail-friendly back",
      "Cheetah-print poly front, mesh back",
      "Leather or PVC front patch",
      "Adjustable snap-back closure"
    ],
    colorsLabel: "Print",
    colors: INFINITY_HER_COLORS
  },

  "ball-park-mama-cheetah": {
    name: "Ball Park Mama – Infinity Her Cheetah Print",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/ball-park-mama.png",
    category: "Infinity Her",
    categoryHref: "shop-infinity-her.html",
    hatType: "infinity-her",
    description: "For the mom who never misses an inning. Infinity Her cheetah print with a 'Ball Park Mama' patch — ponytail-friendly and built for the bleachers.",
    features: [
      "Infinity Her platform — ponytail-friendly back",
      "Cheetah-print poly front, mesh back",
      "Leather or PVC front patch",
      "Adjustable snap-back closure"
    ],
    colorsLabel: "Print",
    colors: INFINITY_HER_COLORS
  },

  "mama-cow-infinity-her": {
    name: "Mama – Infinity Her Cow Print Hat",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/mama-her-cow.png",
    imageFit: "cover",
    category: "Infinity Her",
    categoryHref: "shop-infinity-her.html",
    hatType: "infinity-her",
    description: "Cow-print Infinity Her with a clean 'Mama' patch. Ponytail-friendly, western-leaning, and impossible to miss.",
    features: [
      "Infinity Her platform — ponytail-friendly back",
      "Cow-print poly front, mesh back",
      "Leather or PVC front patch",
      "Adjustable snap-back closure"
    ],
    colorsLabel: "Print",
    colors: INFINITY_HER_COLORS
  },

  "police-wife-infinity-her": {
    name: "Police Wife – Infinity Her Cheetah Print Hat",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/infinity-her.png",
    category: "Protectors & Patriots",
    categoryHref: "shop-protectors-patriots.html",
    hatType: "infinity-her",
    description: "A proud tribute to the woman behind the badge. Infinity Her cheetah-print ponytail-friendly hat with a 'Police Wife' patch.",
    features: [
      "Infinity Her platform — ponytail-friendly back",
      "Cheetah-print poly front, mesh back",
      "Leather or PVC front patch",
      "Adjustable snap-back closure"
    ],
    colorsLabel: "Print",
    colors: INFINITY_HER_COLORS
  },

  "dad-trout-112": {
    name: "Dad Trout Richardson 112",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/dad-trout.png",
    gallery: ["images/hats/dad-trout.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Woods & Water",
    categoryHref: "shop-woods-water.html",
    hatType: "112",
    description: "A Father's-Day favorite. Richardson 112 trucker with a hand-drawn trout patch — for the dad whose other title is 'on the water by 5am.'",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Leather or PVC trout patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "dad-bass-112": {
    name: "Dad Bass Richardson 112",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/dad-bass.png",
    gallery: ["images/hats/dad-bass.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Woods & Water",
    categoryHref: "shop-woods-water.html",
    hatType: "112",
    description: "The bass-fishing dad's daily driver. Richardson 112 trucker with a 'Dad' bass patch.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Leather or PVC bass patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "whitetail-deer-112": {
    name: "Whitetail Deer Leather Patch – Richardson 112",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_1382.png",
    gallery: ["images/hats/IMG_1382.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Woods & Water",
    categoryHref: "shop-woods-water.html",
    hatType: "112",
    description: "For the hunter who lives for first light. Heather-grey Richardson 112 trucker with a laser-engraved leather whitetail buck patch — built for the stand, the truck, and everywhere in between.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Laser-engraved leather whitetail patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "somebody-112": {
    name: "Somebody Richardson 112",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/somebody.png",
    gallery: ["images/hats/somebody.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Forever Favorites",
    categoryHref: "shop-forever-favorites.html",
    hatType: "112",
    description: "A quiet-confidence hat for people who don't need to explain themselves. Richardson 112 trucker with the 'Somebody' patch.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Leather or PVC front patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "somebodys-problem-infinity-her": {
    name: "Somebody's Problem Infinity Her Cow Print",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/somebodys-problem.png",
    imageFit: "cover",
    category: "Infinity Her",
    categoryHref: "shop-infinity-her.html",
    hatType: "infinity-her",
    description: "Cow-print Infinity Her with a 'Somebody's Problem' patch — a country-radio nod, built ponytail-ready.",
    features: [
      "Infinity Her platform — ponytail-friendly back",
      "Cow-print poly front, mesh back",
      "Leather or PVC front patch",
      "Adjustable snap-back closure"
    ],
    colorsLabel: "Print",
    colors: INFINITY_HER_COLORS
  },

  "little-debbie-hunting-team": {
    name: "Little Debbie Hunting Team Richardson 112",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/little-debbie.png",
    gallery: ["images/hats/little-debbie.png", "images/patches/leatherette_colos.png"],
    category: "Forever Favorites",
    categoryHref: "shop-forever-favorites.html",
    hatType: "112",
    description: "A tongue-in-cheek favorite. Richardson 112 trucker with the 'Little Debbie Hunting Team' patch — a gift that always lands.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Leather or PVC front patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "liberty-or-death-112": {
    name: "Liberty or Death Richardson 112",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/protectors-patriots.png",
    gallery: ["images/hats/protectors-patriots.png", "images/patches/leatherette_colos.png"],
    category: "Protectors & Patriots",
    categoryHref: "shop-protectors-patriots.html",
    hatType: "112",
    description: "A patriotic statement in a Richardson 112 trucker. Bold front patch, subtle crown — wear your values without shouting.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Leather or PVC front patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "my-wife-is-psychotic-112pfp": {
    name: "My Wife Is psycHOTic – Richardson 112PFP",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/my-wife-is-psychotic.png",
    gallery: ["images/hats/my-wife-is-psychotic.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Caution: May Offend",
    categoryHref: "shop-caution-may-offend.html",
    hatType: "112PFP",
    description: "A backhanded compliment, framed in leather. The Richardson 112PFP printed 5-panel in Bottomland camo with a laser-engraved 'My Wife Is psycHOTic' patch — for the husband bold enough to wear it.",
    features: [
      "Richardson 112PFP — printed 5-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Laser-engraved leather front patch",
      "One size fits most"
    ],
    colorsLabel: "Camo",
    colors: RICHARDSON_112PFP_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "my-ol-lady-112pfp": {
    name: "My Ol' Lady Will Kill You – Richardson 112PFP",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_1302.png",
    gallery: ["images/hats/IMG_1302.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Caution: May Offend",
    categoryHref: "shop-caution-may-offend.html",
    hatType: "112PFP",
    description: "A warning, a wink, and a great hat. The Richardson 112PFP printed 5-panel in old-school duck camo with a laser-engraved leather 'My Ol' Lady Will Kill You' patch. Built for the husband who knows.",
    features: [
      "Richardson 112PFP — printed 5-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Laser-engraved leather front patch",
      "One size fits most"
    ],
    colorsLabel: "Camo",
    colors: RICHARDSON_112PFP_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "let-me-ask-my-ol-lady-112pfp": {
    name: "Let Me Ask My Ol' Lady – Richardson 112PFP",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/ol-lady.png",
    gallery: ["images/hats/ol-lady.png", "images/patches/leatherette_colos.png"],
    category: "Caution: May Offend",
    categoryHref: "shop-caution-may-offend.html",
    hatType: "112PFP",
    description: "The honest man's answer. Richardson 112PFP printed 5-panel in Bottomland camo with a laser-engraved leather 'Let Me Ask My Ol' Lady' patch — for the husband who knows who actually runs the show.",
    features: [
      "Richardson 112PFP — printed 5-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Laser-engraved leather front patch",
      "One size fits most"
    ],
    colorsLabel: "Camo",
    colors: RICHARDSON_112PFP_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "little-pecker-club-112": {
    name: "Little Pecker Club – Richardson 112",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/little-pecker.png",
    gallery: ["images/hats/little-pecker.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Caution: May Offend",
    categoryHref: "shop-caution-may-offend.html",
    hatType: "112",
    description: "Lil' gents making dents. Charcoal Richardson 112 trucker with a laser-engraved leather 'Little Pecker Club' patch — a kid-sized hat for the little man with big attitude (also a great gag gift for the grown ones).",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Laser-engraved leather front patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "never-killed-mountain-lion-112": {
    name: "Never Killed A Mountain Lion But I've Choked A Cougar – Richardson 112",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/but-ive-killed-a-cougar.png",
    gallery: ["images/hats/but-ive-killed-a-cougar.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Caution: May Offend",
    categoryHref: "shop-caution-may-offend.html",
    hatType: "112",
    description: "A double-take in hat form. Richardson 112 rope-trim trucker with a laser-engraved leather patch — for the husband, hunter, or smartass who knows the difference between a mountain lion and a cougar.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Rope-trim front detail",
      "Breathable mesh back, snap-back adjustable",
      "Laser-engraved leather front patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "support-your-local-hooker-168": {
    name: "Support Your Local Hooker Richardson 168",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/local-hooker.png",
    gallery: ["images/hats/local-hooker.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Woods & Water",
    categoryHref: "shop-woods-water.html",
    hatType: "168P",
    description: "Bass-fishing humor on a Richardson 168 7-panel trucker. Tall crown, vintage vibe, dockside-approved.",
    features: [
      "Richardson 168 — 7-panel high-crown trucker",
      "Breathable mesh back, snap-back adjustable",
      "Leather or PVC front patch",
      "One size fits most"
    ],
    colorsLabel: "Camo",
    colors: RICHARDSON_168P_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "my-wiener-does-tricks": {
    name: "My Wiener Does Tricks – Flat Bill Snapback",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_1180.png",
    gallery: ["images/hats/IMG_1180.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Hats",
    categoryHref: "shop.html?type=hat",
    hatType: "112PFP",
    description: "Old-school duck-camo flat-bill snapback with a laser-engraved leather 'My Wiener Does Tricks' patch — skateboarding dachshund and all. For the dog-loving smartass who isn't easily embarrassed.",
    features: [
      "7-panel flat-bill snapback",
      "Old-school duck-camo front, mesh back",
      "Laser-engraved leather front patch",
      "Snap-back adjustable, one size fits most"
    ],
    colorsLabel: "Camo",
    colors: RICHARDSON_112PFP_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "gently-used-baby-mamas-112": {
    name: "Now Accepting Gently Used Baby Mamas – Richardson 112",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_1181.png",
    gallery: ["images/hats/IMG_1181.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Hats",
    categoryHref: "shop.html?type=hat",
    hatType: "112",
    description: "Charcoal Richardson 112 trucker with a vintage-sign leather patch reading 'Now Accepting Gently Used Baby Mamas.' Built for the guy with a sense of humor and zero filter.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Laser-engraved leather front patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "wiener-rides-25-cents": {
    name: "Wiener Rides – Only 25¢ Flat Bill Snapback",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_1193.png",
    gallery: ["images/hats/IMG_1193.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Hats",
    categoryHref: "shop.html?type=hat",
    hatType: "112PFP",
    description: "Light-tone duck-camo flat-bill snapback with a laser-engraved leather 'Wiener Rides – Only 25¢' patch. Western-saddle dachshund included, dignity not required.",
    features: [
      "7-panel flat-bill snapback",
      "Light duck-camo front, mesh back",
      "Laser-engraved leather front patch",
      "Snap-back adjustable, one size fits most"
    ],
    colorsLabel: "Camo",
    colors: RICHARDSON_112PFP_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "nc-flag-patriot-112-heather": {
    name: "NC Flag Patriot Patch – Richardson 112 (Heather Grey)",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_1194.png",
    gallery: ["images/hats/IMG_1194.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Hats",
    categoryHref: "shop.html?type=hat",
    hatType: "112",
    description: "Heather grey Richardson 112 trucker with a leather NC-outline patch featuring the American flag inside. Home-state pride meets red-white-and-blue, raised and durable.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Laser-engraved leather front patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "nc-flag-patriot-112-loden": {
    name: "NC Flag Patriot Patch – Richardson 112 (Loden)",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_1195.png",
    gallery: ["images/hats/IMG_1195.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Hats",
    categoryHref: "shop.html?type=hat",
    hatType: "112",
    description: "Loden green Richardson 112 trucker with a leather NC-outline patch featuring the American flag inside. An earthy take on Carolina patriot pride.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Laser-engraved leather front patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "nc-lighthouse-est-1789-112": {
    name: "North Carolina Est. 1789 Lighthouse – Richardson 112",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_1196.png",
    imageFit: "cover",
    category: "Hats",
    categoryHref: "shop.html?type=hat",
    hatType: "112",
    description: "Black Richardson 112 trucker with a hexagonal PVC patch — 'North Carolina · Est. 1789' framed by mountains and a coastal lighthouse. From the Blue Ridge to the Outer Banks on one hat.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Raised PVC front patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS
  },

  "nc-camo-outline-112": {
    name: "NC Camo State Outline – Richardson 112",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_1197.png",
    gallery: ["images/hats/IMG_1197.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Hats",
    categoryHref: "shop.html?type=hat",
    hatType: "112",
    description: "Black Richardson 112 trucker with a leather NC-outline patch filled with old-school duck camo. Quiet pride for the Carolina hunter, fisherman, or backroads regular.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Laser-engraved leather front patch with camo inlay",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "dad-leather-patch-112p": {
    name: "Dad Leather Patch – Richardson 112P Camo Trucker",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_2259.png",
    gallery: ["images/hats/IMG_2259.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Hats",
    categoryHref: "shop.html?type=hat",
    hatType: "112P",
    description: "Simple, bold, and built to last. The Richardson 112P printed trucker in Mossy Oak Bottomland camo with a laser-engraved leather 'DAD' patch — the everyday cap for the man who earned the title.",
    features: [
      "Richardson 112P — printed camo trucker",
      "Breathable mesh back, snap-back adjustable",
      "Laser-engraved leather front patch",
      "One size fits most"
    ],
    colorsLabel: "Camo",
    colors: RICHARDSON_112P_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "fish-flag-112": {
    name: "Fish American Flag Leather Patch – Richardson 112",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_2260.png",
    gallery: ["images/hats/IMG_2260.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Hats",
    categoryHref: "shop.html?type=hat",
    hatType: "112",
    description: "Old Glory, rendered in bass, trout, and catfish. Black Richardson 112 trucker with a laser-engraved leather American-flag patch built entirely from fish silhouettes — for the angler who runs red, white, and blue.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Laser-engraved leather front patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "ar15-rifle-112pfp": {
    name: "AR-15 Rifle Leather Patch – Richardson 112PFP",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_2261.png",
    gallery: ["images/hats/IMG_2261.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Hats",
    categoryHref: "shop.html?type=hat",
    hatType: "112PFP",
    description: "For the shooter who appreciates a clean build. The Richardson 112PFP printed 5-panel in old-school camo with a laser-engraved leather AR-15 patch — optic, rail, and all.",
    features: [
      "Richardson 112PFP — printed 5-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Laser-engraved leather front patch",
      "One size fits most"
    ],
    colorsLabel: "Camo",
    colors: RICHARDSON_112PFP_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "will-dance-for-diesel-112": {
    name: "Will Dance For Diesel Leather Patch – Richardson 112",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_2262.png",
    gallery: ["images/hats/IMG_2262.png", "images/patches/leatherette_colos.png"],
    imageFit: "cover",
    category: "Hats",
    categoryHref: "shop.html?type=hat",
    hatType: "112",
    description: "A little diesel-powered humor for the truck crowd. Charcoal-and-white Richardson 112 trucker with a laser-engraved leather 'Will Dance For Diesel' patch — for the diesel lover who doesn't take themselves too seriously.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Laser-engraved leather front patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS,
    patchColors: LEATHERETTE_PATCH_COLORS,
  },

  "tactical-skull-112": {
    name: "Tactical Skull Rubber Patch – Richardson 112",
    tag: "Hat",
    priceCents: 2500,
    image: "images/hats/IMG_2264.png",
    imageFit: "cover",
    category: "Hats",
    categoryHref: "shop.html?type=hat",
    hatType: "112",
    description: "Blacked-out and battle-ready. Black Richardson 112 trucker with a raised rubber PVC patch — a night-vision-rigged operator skull with a subdued American flag. Low-key, high-speed.",
    features: [
      "Richardson 112 — structured 6-panel trucker",
      "Breathable mesh back, snap-back adjustable",
      "Raised rubber PVC front patch",
      "One size fits most"
    ],
    colorsLabel: "Color",
    colors: RICHARDSON_112_COLORS
  },

  "let-me-ask-my-ol-lady-patch": {
    name: "Let Me Ask My Ol' Lady Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2124.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "Every married man's final answer. A laser-engraved leatherette patch for the guy who checks in before he commits to anything.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "well-sheeyit-patch": {
    name: "Well Sheeyit Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2125.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "The universal Southern response to bad news. A laser-engraved leatherette patch in a bold hexagon script.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "fun-fact-i-dont-care-patch": {
    name: "Fun Fact I Don't Care Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2126.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "A backwards-cap skull in sunglasses backs up the attitude. A laser-engraved leatherette patch that says what everyone's thinking.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "mama-tried-patch": {
    name: "Mama Tried Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2127.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "A floral-engraved hexagon patch with classic Western scrollwork framing the Mama Tried script.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "shit-show-patch": {
    name: "Shit Show Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2128.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "Admit One to whatever's going on around here. A laser-engraved leatherette patch shaped like a vintage ticket stub.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "little-pecker-club-patch": {
    name: "Little Pecker Club Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2136.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "Lil' Gents Making Dents. A laser-engraved leatherette patch with a sunglasses-wearing bird for the little troublemaker in your life.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "pew-pew-madafakas-patch": {
    name: "Pew Pew Madafakas Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2137.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "A shades-wearing duck packing heat. A laser-engraved leatherette patch for the range bag or the ballcap.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "dad-in-the-streets-daddy-in-the-sheets-patch": {
    name: "Dad in the Streets, Daddy in the Sheets Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2138.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "Two very different reputations, one laser-engraved leatherette patch. Bold block type up top, script down below.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "choked-a-cougar-patch": {
    name: "Never Killed a Mountain Lion But I've Choked a Cougar Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2139.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "A mountain lion engraving next to a punchline you saw coming. A laser-engraved leatherette patch with attitude.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "anatomy-of-a-pew-patch": {
    name: "Anatomy of a Pew Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2240.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "A tongue-in-cheek diagram breaking down the 'bang button,' 'fire dust,' and 'freedom seed.' A laser-engraved leatherette patch for gun-range humor.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "blue-collar-degenerate-patch": {
    name: "Blue Collar Degenerate Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2241.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "Dirty Hands, Still Broke — Proudly Made in America. A laser-engraved leatherette patch for the working man who tells it straight.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "statue-of-liberty-flag-patch": {
    name: "Statue of Liberty American Flag Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2242.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "Lady Liberty rendered skull-faced over the Stars and Stripes. A bold, laser-engraved leatherette patch.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "american-flag-patch": {
    name: "American Flag Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2243.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "A classic Stars and Stripes, laser-engraved into leatherette. Simple, bold, and proud.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "whiskey-bent-hell-bound-patch": {
    name: "Whiskey Bent & Hell Bound Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2244.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "Bold Western type with a rope-stitched border. A laser-engraved leatherette patch for the honky-tonk crowd.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "excuse-me-you-look-like-you-love-me-patch": {
    name: "Excuse Me, You Look Like You Love Me Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2251.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "A cheesy pickup line done up in Western script with a braided border. A laser-engraved leatherette patch.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "sorry-about-my-husband-patch": {
    name: "Sorry About My Husband Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2252.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "The apology every wife has made at least once. A laser-engraved leatherette patch in clean script.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "mama-floral-letters-patch": {
    name: "Mama Floral Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2253.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "MAMA in bold Western letters filled with hand-drawn floral engraving. A laser-engraved leatherette patch.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "deer-duck-bass-patch": {
    name: "Deer, Duck & Bass Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2254.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "A whitetail buck, a flushing duck, and a jumping bass over a star-camo backdrop. A laser-engraved leatherette patch for the all-season outdoorsman.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "deer-turkey-bass-patch": {
    name: "Deer, Turkey & Bass Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2257.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "A whitetail buck, a strutting tom, and a bass over a bark-camo backdrop. A laser-engraved leatherette patch for the all-season outdoorsman.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "wiener-rides-25-cents-patch": {
    name: "Wiener Rides – Only 25¢ Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2130.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "A saddled-up dachshund in a cowboy hat spells out the offer: wiener rides, only 25¢. A laser-engraved leatherette patch with a whole lot of attitude.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "dont-be-a-cock-sucker-patch": {
    name: "Don't Be A Cock Sucker Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2132.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "A rooster and a sucker spell out the advice everybody needs. A laser-engraved leatherette patch with a cheeky rebus.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  },

  "guns-titties-beer-freedom-patch": {
    name: "Guns, Titties, Beer & Freedom Leatherette Patch",
    tag: "Patch",
    priceCents: 500,
    image: "images/patches/IMG_2133.png",
    imageFit: "cover",
    category: "Laser Engraved Patches",
    categoryHref: "shop.html?type=patch",
    hatType: "none",
    description: "Guns, titties, beer & freedom stacked beside the stars and stripes. A laser-engraved leatherette patch for the red-blooded patriot.",
    features: [
      "Laser-engraved leatherette patch",
      "Iron-on / sew-on backing",
      "Made in the USA"
    ]
  }
};

// Helpers
function getProduct(slug) {
  return PRODUCTS[slug] || null;
}

const FEATURED_NEW_HATS = [
  "milfin-aint-easy",
  "mama-tried-168",
  "dont-be-a-cock-sucker-168",
  "guns-titties-beer-freedom-168",
  "my-ol-lady-112pfp"
];

function getRelatedProducts(slug, limit = 4) {
  const current = PRODUCTS[slug];
  if (!current) return [];
  const sameCategory = Object.entries(PRODUCTS)
    .filter(([s, p]) => s !== slug && p.category === current.category)
    .map(([s, p]) => ({ slug: s, ...p }));
  const others = Object.entries(PRODUCTS)
    .filter(([s, p]) => s !== slug && p.category !== current.category)
    .map(([s, p]) => ({ slug: s, ...p }));
  const result = [...sameCategory, ...others].slice(0, limit);

  const alreadyHasNewHat = result.some(r => FEATURED_NEW_HATS.includes(r.slug));
  if (result.length === limit && !alreadyHasNewHat) {
    const pool = FEATURED_NEW_HATS.filter(
      s => s !== slug && PRODUCTS[s] && !result.some(r => r.slug === s)
    );
    if (pool.length) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      const existingHatIdx = result.findIndex(r => r.tag === "Hat");
      const replaceIdx = existingHatIdx >= 0 ? existingHatIdx : result.length - 1;
      result[replaceIdx] = { slug: pick, ...PRODUCTS[pick] };
    }
  }

  return result;
}

// CommonJS export for Node-side serverless functions.
// Browsers don't have `module`, so this line is harmless there.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS, getProduct, getRelatedProducts };
}
