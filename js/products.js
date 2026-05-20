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
    price: 25,
    image: "images/shirts/foam-side.png",
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
    colors: TEE_COLORS
  },

  "salt-water-camo-hat": {
    name: "JP Salt Water Camo Custom Hat",
    tag: "Hat",
    price: 25,
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

  "eagle-flag-tee": {
    name: "JP Custom Gear 'Eagle Flag' T-Shirt",
    tag: "Shirt",
    price: 20,
    image: "images/shirts/eagle-flag-tshirt.png",
    category: "The Foam Side",
    categoryHref: "shop-foam-side.html",
    hatType: "none",
    description: "Stars, stripes, and an eagle that means it. A patriotic statement tee built for cookouts, flag days, and every day in between.",
    features: [
      "Ring-spun cotton, pre-shrunk",
      "Unisex crew neck — classic fit",
      "Screen-printed in the USA",
      "Holds its shape and color wash after wash"
    ],
    colorsLabel: "Color",
    colors: ["Black", "White", "Navy", "Charcoal", "Heather Grey", "Military Green", "Sand"]
  },

  "bottomland-camo-256p": {
    name: "JP Custom Bottomland Camo Hat - Richardson 256P",
    tag: "Hat",
    price: 30,
    image: "images/hats/bottomland-camo.png",
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
    colors: RICHARDSON_256P_COLORS
  },

  "mama-floral-tumbler": {
    name: "Mama 20oz Engraved Floral Tumbler",
    tag: "Tumbler",
    price: 20,
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
    price: 20,
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

  "show-me-flat-bill": {
    name: "Show Me Richardson Flat Bill Hat",
    tag: "Hat",
    price: 25,
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
    price: 25,
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
    price: 25,
    image: "images/hats/nc-flag.png",
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
    colors: RICHARDSON_112_COLORS
  },

  "nc-trucker-112": {
    name: "NC Richardson 112 Trucker Hat",
    tag: "Hat",
    price: 25,
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
    price: 25,
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
    price: 25,
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
    price: 25,
    image: "images/hats/milfin.png",
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
    price: 25,
    image: "images/hats/first-responder.png",
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
    colors: RICHARDSON_112_COLORS
  },

  "custom-bride-hat": {
    name: "Custom Bride Hat – Choose Your Hat, Patch & Name!",
    tag: "Hat",
    price: 25,
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
    price: 25,
    image: "images/hats/in-my-defense.png",
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
    colors: RICHARDSON_112_COLORS
  },

  "mama-tried-112-v1": {
    name: "Mama Tried – Richardson 112 Trucker Hat",
    tag: "Hat",
    price: 25,
    image: "images/hats/mama-tried.png",
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
    colors: RICHARDSON_112_COLORS
  },

  "mama-tried-112-v2": {
    name: "Mama Tried – Richardson 112 Trucker (Variant)",
    tag: "Hat",
    price: 25,
    image: "images/hats/mama-tried-variant.png",
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
    colors: RICHARDSON_112_COLORS
  },

  "mama-tried-168": {
    name: "Mama Tried – Richardson 168 7-Panel Trucker",
    tag: "Hat",
    price: 25,
    image: "images/hats/mama-tried-168.png",
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
    colors: RICHARDSON_168P_COLORS
  },

  "mimi-cheetah-infinity-her": {
    name: "Mimi – Infinity Her Cheetah Print Hat",
    tag: "Hat",
    price: 25,
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
    price: 25,
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
    price: 25,
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
    price: 25,
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
    price: 25,
    image: "images/hats/dad-trout.png",
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
    colors: RICHARDSON_112_COLORS
  },

  "dad-bass-112": {
    name: "Dad Bass Richardson 112",
    tag: "Hat",
    price: 25,
    image: "images/hats/dad-bass.png",
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
    colors: RICHARDSON_112_COLORS
  },

  "somebody-112": {
    name: "Somebody Richardson 112",
    tag: "Hat",
    price: 25,
    image: "images/hats/somebody.png",
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
    colors: RICHARDSON_112_COLORS
  },

  "somebodys-problem-infinity-her": {
    name: "Somebody's Problem Infinity Her Cow Print",
    tag: "Hat",
    price: 25,
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
    price: 25,
    image: "images/hats/little-debbie.png",
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
    colors: RICHARDSON_112_COLORS
  },

  "liberty-or-death-112": {
    name: "Liberty or Death Richardson 112",
    tag: "Hat",
    price: 25,
    image: "images/hats/protectors-patriots.png",
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
    colors: RICHARDSON_112_COLORS
  },

  "my-wife-is-psychotic-112pfp": {
    name: "My Wife Is psycHOTic – Richardson 112PFP",
    tag: "Hat",
    price: 25,
    image: "images/hats/my-wife-is-psychotic.png",
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
    colors: RICHARDSON_112PFP_COLORS
  },

  "my-ol-lady-112pfp": {
    name: "My Ol' Lady Will Kill You – Richardson 112PFP",
    tag: "Hat",
    price: 25,
    image: "images/hats/my-ol-lady.png",
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
    colors: RICHARDSON_112PFP_COLORS
  },

  "let-me-ask-my-ol-lady-112pfp": {
    name: "Let Me Ask My Ol' Lady – Richardson 112PFP",
    tag: "Hat",
    price: 25,
    image: "images/hats/ol-lady.png",
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
    colors: RICHARDSON_112PFP_COLORS
  },

  "little-pecker-club-112": {
    name: "Little Pecker Club – Richardson 112",
    tag: "Hat",
    price: 25,
    image: "images/hats/little-pecker.png",
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
    colors: RICHARDSON_112_COLORS
  },

  "never-killed-mountain-lion-112": {
    name: "Never Killed A Mountain Lion But I've Choked A Cougar – Richardson 112",
    tag: "Hat",
    price: 25,
    image: "images/hats/but-ive-killed-a-cougar.png",
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
    colors: RICHARDSON_112_COLORS
  },

  "support-your-local-hooker-168": {
    name: "Support Your Local Hooker Richardson 168",
    tag: "Hat",
    price: 25,
    image: "images/hats/local-hooker.png",
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
    colors: RICHARDSON_168P_COLORS
  },

  "my-wiener-does-tricks": {
    name: "My Wiener Does Tricks – Flat Bill Snapback",
    tag: "Hat",
    price: 25,
    image: "images/hats/IMG_1180.png",
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
    colors: RICHARDSON_112PFP_COLORS
  },

  "gently-used-baby-mamas-112": {
    name: "Now Accepting Gently Used Baby Mamas – Richardson 112",
    tag: "Hat",
    price: 25,
    image: "images/hats/IMG_1181.png",
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
    colors: RICHARDSON_112_COLORS
  },

  "wiener-rides-25-cents": {
    name: "Wiener Rides – Only 25¢ Flat Bill Snapback",
    tag: "Hat",
    price: 25,
    image: "images/hats/IMG_1193.png",
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
    colors: RICHARDSON_112PFP_COLORS
  },

  "nc-flag-patriot-112-heather": {
    name: "NC Flag Patriot Patch – Richardson 112 (Heather Grey)",
    tag: "Hat",
    price: 25,
    image: "images/hats/IMG_1194.png",
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
    colors: RICHARDSON_112_COLORS
  },

  "nc-flag-patriot-112-loden": {
    name: "NC Flag Patriot Patch – Richardson 112 (Loden)",
    tag: "Hat",
    price: 25,
    image: "images/hats/IMG_1195.png",
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
    colors: RICHARDSON_112_COLORS
  },

  "nc-lighthouse-est-1789-112": {
    name: "North Carolina Est. 1789 Lighthouse – Richardson 112",
    tag: "Hat",
    price: 25,
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
    price: 25,
    image: "images/hats/IMG_1197.png",
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
    colors: RICHARDSON_112_COLORS
  }
};

// Helpers
function getProduct(slug) {
  return PRODUCTS[slug] || null;
}

function getRelatedProducts(slug, limit = 4) {
  const current = PRODUCTS[slug];
  if (!current) return [];
  const sameCategory = Object.entries(PRODUCTS)
    .filter(([s, p]) => s !== slug && p.category === current.category)
    .map(([s, p]) => ({ slug: s, ...p }));
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = Object.entries(PRODUCTS)
    .filter(([s, p]) => s !== slug && p.category !== current.category)
    .map(([s, p]) => ({ slug: s, ...p }));
  return [...sameCategory, ...others].slice(0, limit);
}
