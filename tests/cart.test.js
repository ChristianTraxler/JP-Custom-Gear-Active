const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { install, reset } = require('./_helpers/localStorage-shim.js');

install();

// cart.js attaches a global `Cart` object (UMD-lite — same pattern as products.js).
// We require it once; subsequent tests reset localStorage and the in-memory cart.
require(path.join(__dirname, '..', 'js', 'cart.js'));
const Cart = globalThis.Cart;

function freshCart() {
  reset();
  Cart._resetForTests();
}

test('empty cart has zero items and zero total', () => {
  freshCart();
  assert.equal(Cart.getItemCount(), 0);
  assert.equal(Cart.getTotalCents(), 0);
  assert.deepEqual(Cart.getCart().items, []);
});

test('addItem adds a new line with a unique lineId', () => {
  freshCart();
  const c1 = Cart.addItem({
    productId: 'salt-water-camo-hat',
    quantity: 1,
    customizations: { color: 'Salt Water Camo / White' },
    name: 'JP Salt Water Camo Custom Hat',
    unitPrice: 2500,
    thumbnail: 'images/hats/salt-water-camo.png'
  });
  assert.equal(c1.items.length, 1);
  assert.equal(c1.items[0].productId, 'salt-water-camo-hat');
  assert.equal(c1.items[0].quantity, 1);
  assert.equal(typeof c1.items[0].lineId, 'string');
  assert.ok(c1.items[0].lineId.length > 0);
});

test('two adds of the same productId create separate lines (different customizations)', () => {
  freshCart();
  Cart.addItem({ productId: 'p', quantity: 1, customizations: { color: 'Black' }, name: 'p', unitPrice: 1000 });
  Cart.addItem({ productId: 'p', quantity: 1, customizations: { color: 'White' }, name: 'p', unitPrice: 1000 });
  const items = Cart.getCart().items;
  assert.equal(items.length, 2);
  assert.notEqual(items[0].lineId, items[1].lineId);
});

test('updateQuantity changes quantity; removes line when set to 0', () => {
  freshCart();
  const c = Cart.addItem({ productId: 'p', quantity: 1, customizations: {}, name: 'p', unitPrice: 1000 });
  const lineId = c.items[0].lineId;
  Cart.updateQuantity(lineId, 3);
  assert.equal(Cart.getCart().items[0].quantity, 3);
  Cart.updateQuantity(lineId, 0);
  assert.equal(Cart.getCart().items.length, 0);
});

test('updateQuantity clamps to 1..99', () => {
  freshCart();
  const c = Cart.addItem({ productId: 'p', quantity: 1, customizations: {}, name: 'p', unitPrice: 1000 });
  const lineId = c.items[0].lineId;
  Cart.updateQuantity(lineId, -5);
  assert.equal(Cart.getCart().items.length, 0); // negative behaves like 0 → remove
  Cart.addItem({ productId: 'p', quantity: 1, customizations: {}, name: 'p', unitPrice: 1000 });
  const lineId2 = Cart.getCart().items[0].lineId;
  Cart.updateQuantity(lineId2, 500);
  assert.equal(Cart.getCart().items[0].quantity, 99);
});

test('removeItem removes the matching line', () => {
  freshCart();
  const c = Cart.addItem({ productId: 'p', quantity: 1, customizations: {}, name: 'p', unitPrice: 1000 });
  Cart.removeItem(c.items[0].lineId);
  assert.equal(Cart.getCart().items.length, 0);
});

test('getTotalCents sums unitPrice * quantity across all lines', () => {
  freshCart();
  Cart.addItem({ productId: 'a', quantity: 2, customizations: {}, name: 'a', unitPrice: 1200 });
  Cart.addItem({ productId: 'b', quantity: 1, customizations: {}, name: 'b', unitPrice: 2500 });
  assert.equal(Cart.getTotalCents(), 1200 * 2 + 2500);
});

test('getItemCount sums quantities', () => {
  freshCart();
  Cart.addItem({ productId: 'a', quantity: 2, customizations: {}, name: 'a', unitPrice: 1200 });
  Cart.addItem({ productId: 'b', quantity: 3, customizations: {}, name: 'b', unitPrice: 2500 });
  assert.equal(Cart.getItemCount(), 5);
});

test('clearCart empties the cart', () => {
  freshCart();
  Cart.addItem({ productId: 'a', quantity: 2, customizations: {}, name: 'a', unitPrice: 1200 });
  Cart.clearCart();
  assert.equal(Cart.getItemCount(), 0);
});

test('cart persists across module re-read (localStorage round-trip)', () => {
  freshCart();
  Cart.addItem({ productId: 'a', quantity: 2, customizations: { x: 1 }, name: 'a', unitPrice: 1200 });
  // Force re-read from localStorage by clearing in-memory state
  Cart._resetForTests({ rereadFromStorage: true });
  assert.equal(Cart.getCart().items.length, 1);
  assert.equal(Cart.getCart().items[0].quantity, 2);
  assert.deepEqual(Cart.getCart().items[0].customizations, { x: 1 });
});

test('subscribe fires on change and returns unsubscribe', () => {
  freshCart();
  let calls = 0;
  const unsub = Cart.subscribe(() => { calls++; });
  Cart.addItem({ productId: 'a', quantity: 1, customizations: {}, name: 'a', unitPrice: 100 });
  Cart.addItem({ productId: 'b', quantity: 1, customizations: {}, name: 'b', unitPrice: 100 });
  assert.equal(calls, 2);
  unsub();
  Cart.addItem({ productId: 'c', quantity: 1, customizations: {}, name: 'c', unitPrice: 100 });
  assert.equal(calls, 2);
});
