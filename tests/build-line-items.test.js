const test = require('node:test');
const assert = require('node:assert/strict');
const { buildLineItems } = require('../api/_lib/build-line-items.js');

const catalog = {
  'hat-a': { name: 'Hat A', priceCents: 2500 },
  'tumbler-b': { name: 'Tumbler B', priceCents: 2000 }
};

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
