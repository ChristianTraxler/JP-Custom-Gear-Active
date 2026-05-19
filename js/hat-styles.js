window.HAT_STYLES = {
  "leather-patch": {
    name: "Leather Patch Hat",
    tagline: "Engraved Leather",
    image: "images/hats/dad-bass.png",
    colors: ["Black", "Black/White", "Charcoal/Black", "Charcoal/White", "Heather/Black", "Khaki/White", "Red/Black", "Loden/Black", "Harvest", "Marsh", "Bark", "Blaze", "Salt Water", "Bottomland"],
    subOptions: { label: "Hat Body Style", values: ["Richardson 112", "Richardson 168", "Richardson 256"] },
    subOptionImages: {
      "Richardson 112": "images/hats/IMG_0684.png",
      "Richardson 168": "images/hats/mama-tried-168.png",
      "Richardson 256": "images/hats/richardson256.png"
    },
    subOptionColors: {
      "Richardson 112": ["Black", "Black/White", "Charcoal/Black", "Charcoal/White", "Heather/Black", "Khaki/White", "Red/Black", "Loden/Black", "Harvest", "Marsh", "Bark", "Blaze", "Salt Water", "Bottomland"],
      "Richardson 168": ["Black", "Charcoal/Black", "Harvest", "Marsh", "Bark", "Salt Water", "Bottomland"],
      "Richardson 256": ["Harvest", "Marsh", "Bark", "Salt Water", "Bottomland"]
    },
    patchTypes: ["Leatherette"],
    basePrice: 32
  },
  "embroidered": {
    name: "Embroidered Hat",
    tagline: "Stitched Logo",
    image: "images/hats/infinity-her.png",
    colors: ["Black", "Charcoal", "Navy", "Khaki", "White", "Heather Grey", "Burgundy", "Olive", "Pink"],
    subOptions: { label: "Hat Body Style", values: ["Trucker (Curved Brim)", "Trucker (Flat Brim)", "Dad Hat (Unstructured)", "Snapback", "Visor"] },
    patchTypes: ["Flat Embroidery", "3D Puff Embroidery", "Combo (Flat + 3D)", "Applique"],
    basePrice: 28
  },
  "richardson-112": {
    name: "Richardson 112",
    tagline: "Classic Trucker Fit",
    image: "images/hats/mama-tried-112-v1.png",
    colors: ["Black", "Black/White", "Charcoal/Black", "Charcoal/White", "Heather/Black", "Khaki/White", "Red/Black", "Loden/Black", "Harvest", "Marsh", "Bark", "Blaze", "Salt Water", "Bottomland"],
    subOptions: { label: "Crown Type", values: ["Structured (Standard 112)", "Unstructured (112FP)"] },
    patchTypes: ["Leatherette", "Faux Leather", "PVC", "Flat Embroidery", "3D Puff Embroidery", "Woven"],
    basePrice: 30
  },
  "trucker": {
    name: "Trucker Hat",
    tagline: "Mesh Back",
    image: "images/hats/nc-trucker.png",
    colors: ["Black/Black", "Black/White", "Charcoal/White", "Navy/White", "Khaki/Brown", "Heather/Black", "Camo/Black"],
    subOptions: { label: "Brim Style", values: ["Curved", "Flat"] },
    patchTypes: ["Leatherette", "Faux Leather", "PVC", "Flat Embroidery", "3D Puff Embroidery", "Woven"],
    basePrice: 28
  },
  "snapback": {
    name: "Snapback",
    tagline: "Flat Brim",
    image: "images/hats/caution-offend.png",
    colors: ["Black", "Charcoal", "Navy", "Heather Grey", "Khaki", "Olive", "White", "Two-Tone"],
    subOptions: { label: "Crown Profile", values: ["High Profile (Structured)", "Mid Profile", "Low Profile (Unstructured)"] },
    patchTypes: ["Leatherette", "Faux Leather", "PVC", "Flat Embroidery", "3D Puff Embroidery", "Woven"],
    basePrice: 30
  },
  "knit-beanie": {
    name: "Knit Beanie",
    tagline: "Cold Weather",
    image: "images/hats/duty-sheriff-knit.png",
    colors: ["Black", "Charcoal", "Navy", "Heather Grey", "Brown", "Olive", "Burgundy", "Tan", "Camo"],
    subOptions: { label: "Beanie Style", values: ["Cuffed", "Uncuffed (Slouch)", "Cuffed with Pom", "Waffle Knit"] },
    patchTypes: ["Leatherette", "Faux Leather", "Flat Embroidery", "3D Puff Embroidery", "Woven"],
    basePrice: 24
  }
};

window.COLOR_SWATCH = {
  "Black": "#1a1a1a",
  "Charcoal": "#3a3a3a",
  "Heather Grey": "#9a9a9a",
  "White": "#f5f5f0",
  "Navy": "#1a2a44",
  "Khaki": "#bda57a",
  "Brown": "#5a3d22",
  "Coffee": "#3e2a18",
  "Burgundy": "#5a1a26",
  "Olive": "#5a5a36",
  "Loden": "#3d4a36",
  "Red": "#a01a1a",
  "Royal": "#1f3da3",
  "Pink": "#e8a0b6",
  "Tan": "#c8a878",
  "Camo": "#5a5a3a",
  "Heather": "#9a9a9a",
  "Harvest": "#a86b3a",
  "Marsh": "#5a6638",
  "Bark": "#4a3a2a",
  "Blaze": "#e85a1a",
  "Salt Water": "#6b8aa0",
  "Bottomland": "#4a4030"
};

window.getSwatchColor = function(label) {
  if (!label) return "#888";
  const primary = label.split("/")[0].trim();
  const map = window.COLOR_SWATCH;
  if (map[primary]) return map[primary];
  for (const key in map) {
    if (primary.toLowerCase().includes(key.toLowerCase())) return map[key];
  }
  return "#888";
};
