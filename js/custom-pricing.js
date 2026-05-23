// Single source of truth for custom-product pricing (tumblers, keychains, patches, hats).
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
// js/customize-tumblers.js, js/customize-keychains.js and js/customize-patches.js, which
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
    return { type: c['Type'], shape: c['Shape'], size: c['Size'], backing: c['Backing'] };
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
