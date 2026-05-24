const test = require('node:test');
const assert = require('node:assert/strict');
const { buildLineItems } = require('../api/_lib/build-line-items.js');
const { PRODUCTS } = require('../js/products.js');

const catalog = {
  'hat-a': { name: 'Hat A', priceCents: 2500 },
  'tumbler-b': { name: 'Tumbler B', priceCents: 2000 }
};

// Regression: the tumbler customizer adds productId 'custom-tumbler' to the cart
// (js/customize-tumblers.js). The REAL catalog must contain it or checkout throws
// "unknown product: custom-tumbler" and the order can never complete.
test('real catalog prices a custom-tumbler cart item (regression for unknown product)', () => {
  const { lineItems } = buildLineItems({
    items: [{ productId: 'custom-tumbler', quantity: 1, customizations: { Text: 'Hello' } }],
    catalog: PRODUCTS,
    shippingCents: 800
  });
  assert.equal(lineItems.length, 1);
  assert.equal(lineItems[0].price_data.product_data.name, 'Custom Tumbler');
  assert.equal(lineItems[0].price_data.unit_amount, 2000, 'base custom tumbler is $20');
});

test('checkout computes each custom builder price from its selections', () => {
  const cases = [
    [{ productId: 'custom-tumbler', quantity: 1, customizations: { Backing: 'Wraparound (360°)' } }, 2500],
    [{ productId: 'custom-tumbler', quantity: 1, customizations: { Backing: 'Front + Back' } }, 2250],
    [{ productId: 'custom-keychain', quantity: 1, customizations: { Size: '3"' } }, 800],
    [{ productId: 'custom-keychain', quantity: 1, customizations: { Size: '1.5"' } }, 500],
    [{ productId: 'custom-patch', quantity: 1, customizations: { Size: '2"' } }, 400],
    [{ productId: 'custom-patch', quantity: 1, customizations: { Size: '5"' } }, 900],
    [{ productId: 'custom-hat', quantity: 1, customizations: { Style: 'Trucker Hat' } }, 2500]
  ];
  for (const [item, expected] of cases) {
    const { lineItems } = buildLineItems({ items: [item], catalog: PRODUCTS, shippingCents: 800 });
    assert.equal(lineItems[0].price_data.unit_amount, expected,
      `${item.productId} ${JSON.stringify(item.customizations)} should be ${expected} cents`);
  }
});

// Sized apparel: 2X/3X tees cost more than the base S–XL price. The server must
// charge the size-specific price from the catalog (TEE_SIZES), not the flat
// product.priceCents, or 2X/3X buyers are undercharged $2.
test('charges the size-specific price for 2X / 3X tees', () => {
  const base = buildLineItems({
    items: [{ productId: 'mama-floral-tee', quantity: 1, customizations: { Size: 'L' } }],
    catalog: PRODUCTS, shippingCents: 800
  });
  assert.equal(base.lineItems[0].price_data.unit_amount, 2500, 'S–XL tee is $25');

  for (const big of ['2X', '3X']) {
    const { lineItems } = buildLineItems({
      items: [{ productId: 'mama-floral-tee', quantity: 1, customizations: { Size: big } }],
      catalog: PRODUCTS, shippingCents: 800
    });
    assert.equal(lineItems[0].price_data.unit_amount, 2700, `${big} tee is $27`);
  }
});

test('falls back to base price when a sized product has no/unknown size', () => {
  for (const customizations of [{}, { Size: 'XXXXL' }]) {
    const { lineItems } = buildLineItems({
      items: [{ productId: 'mama-floral-tee', quantity: 1, customizations }],
      catalog: PRODUCTS, shippingCents: 800
    });
    assert.equal(lineItems[0].price_data.unit_amount, 2500,
      `missing/unknown size should fall back to base $25 (${JSON.stringify(customizations)})`);
  }
});

test('size-based price feeds the shipping-threshold subtotal', () => {
  // 3 × 3X tees: size price = 3 × $27 = $81 (≥ $80 → upgraded), but the buggy
  // flat price = 3 × $25 = $75 (< $80 → base). Threshold chosen so only correct
  // size pricing crosses it, making this test fail under the bug.
  const { shippingItem } = buildLineItems({
    items: [{ productId: 'mama-floral-tee', quantity: 3, customizations: { Size: '3X' } }],
    catalog: PRODUCTS,
    shippingCents: 800,
    shippingUpgradeAtCents: 8000,
    shippingUpgradeCents: 1000
  });
  assert.equal(shippingItem.price_data.unit_amount, 1000);
});

test('subtotal uses the computed custom price for shipping-threshold logic', () => {
  // 5 wraparound tumblers = 5 × $25 = $125 → over the $100 threshold → upgraded shipping.
  const { shippingItem } = buildLineItems({
    items: [{ productId: 'custom-tumbler', quantity: 5, customizations: { Backing: 'Wraparound (360°)' } }],
    catalog: PRODUCTS,
    shippingCents: 800,
    shippingUpgradeAtCents: 10000,
    shippingUpgradeCents: 1000
  });
  assert.equal(shippingItem.price_data.unit_amount, 1000);
});

test('builds Stripe line_items from a valid cart', () => {
  const { lineItems, shippingItem } = buildLineItems({
    items: [
      { productId: 'hat-a', quantity: 2, customizations: { Color: 'Black' } },
      { productId: 'tumbler-b', quantity: 1, customizations: { Color: 'White' } }
    ],
    catalog,
    shippingCents: 800
  });
  assert.equal(lineItems.length, 2);
  assert.equal(lineItems[0].price_data.unit_amount, 2500);
  assert.equal(lineItems[0].price_data.product_data.name, 'Hat A');
  assert.equal(lineItems[0].quantity, 2);
  assert.equal(lineItems[1].price_data.unit_amount, 2000);
  assert.equal(shippingItem.price_data.unit_amount, 800);
  assert.equal(shippingItem.quantity, 1);
});

test('throws on unknown productId', () => {
  assert.throws(() => buildLineItems({
    items: [{ productId: 'nope', quantity: 1, customizations: {} }],
    catalog,
    shippingCents: 800
  }), /unknown product/i);
});

test('throws on quantity < 1', () => {
  assert.throws(() => buildLineItems({
    items: [{ productId: 'hat-a', quantity: 0, customizations: {} }],
    catalog,
    shippingCents: 800
  }), /quantity/i);
});

test('throws on quantity > 99', () => {
  assert.throws(() => buildLineItems({
    items: [{ productId: 'hat-a', quantity: 100, customizations: {} }],
    catalog,
    shippingCents: 800
  }), /quantity/i);
});

test('throws on empty items array', () => {
  assert.throws(() => buildLineItems({
    items: [],
    catalog,
    shippingCents: 800
  }), /empty cart/i);
});

test('throws on missing items field', () => {
  assert.throws(() => buildLineItems({ catalog, shippingCents: 800 }), /items/i);
});

test('rejects more than 50 line items (Stripe metadata key limit)', () => {
  const items = Array.from({ length: 51 }, () => ({
    productId: 'hat-a', quantity: 1, customizations: {}
  }));
  assert.throws(() => buildLineItems({ items, catalog, shippingCents: 800 }), /too many/i);
});

test('builds metadata with productId + customizations per item', () => {
  const { metadata } = buildLineItems({
    items: [
      { productId: 'hat-a', quantity: 1, customizations: { Color: 'Black' } }
    ],
    catalog,
    shippingCents: 800
  });
  assert.ok(metadata.item_0);
  const decoded = JSON.parse(metadata.item_0);
  assert.equal(decoded.productId, 'hat-a');
  assert.deepEqual(decoded.customizations, { Color: 'Black' });
});

test('omits shipping item and tags metadata when localPickup is true', () => {
  const { lineItems, shippingItem, metadata } = buildLineItems({
    items: [{ productId: 'hat-a', quantity: 1, customizations: {} }],
    catalog,
    shippingCents: 800,
    localPickup: true
  });
  assert.equal(lineItems.length, 1);
  assert.equal(shippingItem, null, 'shippingItem should be null for local pickup');
  assert.equal(metadata.local_pickup, '1');
});

test('still includes shipping item when localPickup is omitted or false', () => {
  const result = buildLineItems({
    items: [{ productId: 'hat-a', quantity: 1, customizations: {} }],
    catalog,
    shippingCents: 800,
    localPickup: false
  });
  assert.ok(result.shippingItem, 'shippingItem should be present when not local pickup');
  assert.equal(result.shippingItem.price_data.unit_amount, 800);
  assert.equal(result.metadata.local_pickup, undefined);
});

test('truncates per-item metadata that would exceed 500 chars', () => {
  const longNotes = 'a'.repeat(800);
  const { metadata } = buildLineItems({
    items: [{ productId: 'hat-a', quantity: 1, customizations: { Notes: longNotes } }],
    catalog,
    shippingCents: 800
  });
  assert.ok(metadata.item_0.length <= 500);
  assert.ok(metadata.item_0.includes('…'));
});

test('uses base shipping when subtotal is below the upgrade threshold', () => {
  const { shippingItem } = buildLineItems({
    items: [{ productId: 'hat-a', quantity: 1, customizations: {} }], // $25
    catalog,
    shippingCents: 800,
    shippingUpgradeAtCents: 10000,
    shippingUpgradeCents: 1000
  });
  assert.equal(shippingItem.price_data.unit_amount, 800);
});

test('uses upgraded shipping when subtotal meets the $100 threshold', () => {
  const { shippingItem } = buildLineItems({
    items: [{ productId: 'hat-a', quantity: 4, customizations: {} }], // 4 × $25 = $100
    catalog,
    shippingCents: 800,
    shippingUpgradeAtCents: 10000,
    shippingUpgradeCents: 1000
  });
  assert.equal(shippingItem.price_data.unit_amount, 1000);
});

test('uses upgraded shipping when subtotal exceeds the threshold across multiple items', () => {
  const { shippingItem } = buildLineItems({
    items: [
      { productId: 'hat-a', quantity: 4, customizations: {} }, // $100
      { productId: 'tumbler-b', quantity: 1, customizations: {} } // $20
    ],
    catalog,
    shippingCents: 800,
    shippingUpgradeAtCents: 10000,
    shippingUpgradeCents: 1000
  });
  assert.equal(shippingItem.price_data.unit_amount, 1000);
});
