// Single source of truth for custom-product pricing (tumblers, camo tumblers, camo koozies, hoodies, Mossy Oak hoodies and long sleeves, Mad Hatter tees, keychains, patches, hats).
//
// Loaded in the browser by the customizer pages (so the displayed price is correct) AND
// require()d by the checkout function (api/_lib/build-line-items.js) so the price a customer
// SEES always equals what they're CHARGED. The server recomputes the price from the customer's
// selections — the browser-supplied price is never trusted.
//
// Pricing model — two modes per product:
//   1. priceCentsByOption: explicit cents looked up by one option (e.g. tumbler engraving),
//      used when prices aren't whole dollars ($22.50). Falls back to `default`.
//   2. base + multipliers + floor: cents = max(floor, round(base * Π multipliers)) * 100,
//      used by keychain/patch/hat. Unknown/unselected options default to a x1.0 multiplier.
//
// KEEP IN SYNC: the base/floor/multiplier numbers below mirror the *_CONFIG tables in
// js/customize-tumblers.js, js/customize-camo-tumbler.js, js/customize-camo-koozie.js, js/customize-camo-beanie.js, js/customize-hoodie.js, js/customize-mossy-oak-hoodie.js, js/customize-mossy-oak-longsleeve.js, js/customize-mad-hatter-tee.js, js/customize-mad-hatter-vintage-duck-tee.js, js/customize-keychains.js and js/customize-patches.js, which
// the customizer pages use to DISPLAY the price. If you change a price in one place,
// change it in both. This module is the authority for what is actually CHARGED.
(function (root) {
  'use strict';

  const CUSTOM_PRICING = {
    'custom-tumbler': {
      name: 'Custom Tumbler',
      // Explicit price (in cents) per engraving area — these aren't whole dollars,
      // so they're listed directly rather than computed via base × multiplier.
      priceCentsByOption: {
        dim: 'backing',
        default: 2000, // Front Only / nothing selected = $20.00
        prices: {
          'Front Only': 2000,        // $20.00
          'Front + Back': 2250,      // $22.50
          'Wraparound (360°)': 2500  // $25.00
        }
      }
    },
    'custom-camo-tumbler': {
      name: 'Custom Camo Tumbler', // Bone Yard, Blackwater and Timber Bark Camo share one price
      // Priced by the "Blank" cart field: 'Yes' = ordered blank ($20), anything else
      // (customized with text and/or a logo) = $25.
      priceCentsByOption: {
        dim: 'blank',
        default: 2500, // Customized = $25.00
        prices: {
          'Yes': 2000 // Blank (no customization) = $20.00
        }
      }
    },
    'custom-camo-koozie': {
      name: 'Custom Camo Can Koozie', // Ghost Marsh and Timber Bark Camo share one price
      // PLACEHOLDER PRICE: confirm with client. Change the two numbers below and the matching
      // blankPriceCents / customPriceCents in js/customize-camo-koozie.js.
      // Priced by the "Blank" cart field: 'Yes' = ordered blank ($20), anything else = $25.
      priceCentsByOption: {
        dim: 'blank',
        default: 2500, // Customized = $25.00 (placeholder)
        prices: {
          'Yes': 2000 // Blank (no customization) = $20.00 (placeholder)
        }
      }
    },
    'custom-hoodie': {
      name: 'Custom Independent Trading Co. Camo Hoodie', // Duck Camo and Washed Camo share one price
      // Priced by the "Blank" cart field: 'Yes' = ordered blank ($40), anything else
      // (customized front/back/both, no field) = $45. Size and placement carry no upcharge.
      priceCentsByOption: {
        dim: 'blank',
        default: 4500, // Customized = $45.00
        prices: {
          'Yes': 4000 // Blank (no customization) = $40.00
        }
      }
    },
    'custom-mossy-oak-hoodie': {
      name: 'Custom Mossy Oak Washed Bottomland Camo Hoodie',
      // Priced by the "Blank" cart field: 'Yes' = ordered blank ($55), anything else
      // (customized front/back/both) = $60. Size and placement carry no upcharge.
      priceCentsByOption: {
        dim: 'blank',
        default: 6000, // Customized = $60.00
        prices: {
          'Yes': 5500 // Blank (no customization) = $55.00
        }
      }
    },
    'custom-mossy-oak-longsleeve': {
      name: 'Custom Mossy Oak Washed Bottomland Camo Long Sleeve T-Shirt',
      // Priced by the "Blank" cart field: 'Yes' = ordered blank ($33), anything else
      // (customized front/back/both) = $38. Size and placement carry no upcharge.
      priceCentsByOption: {
        dim: 'blank',
        default: 3800, // Customized = $38.00
        prices: {
          'Yes': 3300 // Blank (no customization) = $33.00
        }
      }
    },
    'custom-mad-hatter-tee': {
      name: 'Custom Mad Hatter Fog Camo Short Sleeve T-Shirt',
      // PLACEHOLDER PRICE: confirm with client. Change the two numbers below and the matching
      // blankPriceCents / customPriceCents in js/customize-mad-hatter-tee.js.
      // Priced by the "Blank" cart field: 'Yes' = ordered blank ($28), anything else = $33.
      // Size and placement carry no upcharge.
      priceCentsByOption: {
        dim: 'blank',
        default: 3300, // Customized = $33.00 (placeholder)
        prices: {
          'Yes': 2800 // Blank (no customization) = $28.00 (placeholder)
        }
      }
    },
    'custom-mad-hatter-vintage-duck-tee': {
      name: 'Custom Mad Hatter Vintage Duck Camo Short Sleeve T-Shirt',
      // Priced by the "Blank" cart field: 'Yes' = ordered blank ($30), anything else = $35.
      // Size and placement carry no upcharge.
      priceCentsByOption: {
        dim: 'blank',
        default: 3500, // Customized = $35.00
        prices: {
          'Yes': 3000 // Blank (no customization) = $30.00
        }
      }
    },
    'custom-camo-beanie': {
      name: 'Custom Richardson Duck Camo Beanie', // all colors share one price
      // Priced by the "Blank" cart field: 'Yes' = ordered blank ($20), anything else = $25.
      // The "Customization type" choice carries no price difference.
      priceCentsByOption: {
        dim: 'blank',
        default: 2500, // Customized = $25.00
        prices: {
          'Yes': 2000 // Blank (no customization) = $20.00
        }
      }
    },
    'custom-keychain': {
      name: 'Custom Keychain',
      base: 6,
      floor: 3,
      multipliers: {
        type: { 'Leatherette (Engraved)': 1.0 },
        size: { '1.5"': 0.85, '2"': 1.0, '2.5"': 1.15, '3"': 1.3, 'Custom Size': 1.25 }
      }
    },
    'custom-patch': {
      name: 'Custom Patch',
      base: 5,
      floor: 2,
      multipliers: {
        type: { 'Leatherette (Engraved)': 1.0 },
        size: {
          '2"': 0.8, '2.25"': 0.85, '2.5"': 0.9, '3"': 1.0, '3.5"': 1.15,
          '4"': 1.3, '4.5"': 1.5, '5"': 1.7, 'Custom Size': 1.3
        }
      }
    },
    'custom-hat': {
      name: 'Custom Hat',
      base: 25,
      floor: 25,
      multipliers: {} // Flat $25 — the hat builder does not vary price by style or option.
    }
  };

  function isCustomProduct(productId) {
    return Object.prototype.hasOwnProperty.call(CUSTOM_PRICING, productId);
  }

  // sel: { type, shape, size, backing } — any subset; missing/unknown values default.
  function unitPriceCents(productId, sel) {
    const cfg = CUSTOM_PRICING[productId];
    if (!cfg) throw new Error('not a custom product: ' + productId);
    sel = sel || {};
    // Mode 1: explicit per-option cents (e.g. tumbler — supports non-whole-dollar prices).
    if (cfg.priceCentsByOption) {
      const { dim, prices, default: def } = cfg.priceCentsByOption;
      const chosen = sel[dim];
      return (chosen != null && prices[chosen] != null) ? prices[chosen] : def;
    }
    // Mode 2: whole-dollar base × option multipliers, rounded to the nearest dollar.
    let factor = 1;
    const mults = cfg.multipliers || {};
    for (const dim of Object.keys(mults)) {
      const table = mults[dim];
      const chosen = sel[dim];
      factor *= (chosen != null && table[chosen] != null) ? table[chosen] : 1.0;
    }
    return Math.max(cfg.floor, Math.round(cfg.base * factor)) * 100;
  }

  function unitPriceDollars(productId, sel) {
    return unitPriceCents(productId, sel) / 100;
  }

  // Server helper: rebuild a pricing selection from a cart item's `customizations` object,
  // whose keys are the customizer's Title-cased field labels (e.g. "Backing", "Size").
  function selectionFromCustomizations(c) {
    c = c || {};
    // "Blank" comes from the browser, so it only counts when the item carries nothing a
    // blank order wouldn't send (allowlist, not a denylist: any other key, or a non-string
    // value, means the item is priced as customized).
    const BLANK_KEYS = ['Blank', 'Pattern', 'Size', 'Notes'];
    const onlyBlankKeys = Object.keys(c).every(k => BLANK_KEYS.includes(k) && typeof c[k] === 'string');
    const blank = c['Blank'] === 'Yes' && onlyBlankKeys ? 'Yes' : undefined;
    return { type: c['Type'], shape: c['Shape'], size: c['Size'], backing: c['Backing'], blank };
  }

  const api = {
    CUSTOM_PRICING,
    isCustomProduct,
    unitPriceDollars,
    unitPriceCents,
    selectionFromCustomizations
  };

  root.CustomPricing = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
