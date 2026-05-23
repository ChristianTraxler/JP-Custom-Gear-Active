const test = require('node:test');
const assert = require('node:assert/strict');
const {
  unitPriceCents,
  unitPriceDollars,
  isCustomProduct,
  selectionFromCustomizations
} = require('../js/custom-pricing.js');

test('isCustomProduct recognizes the four custom builders only', () => {
  ['custom-tumbler', 'custom-keychain', 'custom-patch', 'custom-hat'].forEach(id =>
    assert.equal(isCustomProduct(id), true, id));
  assert.equal(isCustomProduct('mama-floral-tumbler'), false);
  assert.equal(isCustomProduct('nope'), false);
});

test('tumbler priced by engraving area', () => {
  assert.equal(unitPriceDollars('custom-tumbler', { backing: 'Front Only' }), 14);
  assert.equal(unitPriceDollars('custom-tumbler', { backing: 'Front + Back' }), 17); // round(14*1.2)=17
  assert.equal(unitPriceDollars('custom-tumbler', { backing: 'Wraparound (360°)' }), 20); // round(14*1.4)=20
  assert.equal(unitPriceCents('custom-tumbler', { backing: 'Wraparound (360°)' }), 2000);
});

test('tumbler defaults to base when no engraving selected (and color/shape do not change price)', () => {
  assert.equal(unitPriceDollars('custom-tumbler', {}), 14);
  assert.equal(unitPriceDollars('custom-tumbler', { size: 'Black/Copper', shape: '20 oz' }), 14);
});

test('keychain priced by size', () => {
  assert.equal(unitPriceDollars('custom-keychain', { size: '1.5"' }), 5);  // round(6*0.85)=5
  assert.equal(unitPriceDollars('custom-keychain', { size: '2"' }), 6);
  assert.equal(unitPriceDollars('custom-keychain', { size: '2.5"' }), 7);  // round(6*1.15)=7
  assert.equal(unitPriceDollars('custom-keychain', { size: '3"' }), 8);    // round(6*1.3)=8
  assert.equal(unitPriceDollars('custom-keychain', { size: 'Custom Size' }), 8); // round(6*1.25)=8
});

test('patch priced by size', () => {
  assert.equal(unitPriceDollars('custom-patch', { size: '2"' }), 4);  // round(5*0.8)=4 — advertised "$4"
  assert.equal(unitPriceDollars('custom-patch', { size: '3"' }), 5);
  assert.equal(unitPriceDollars('custom-patch', { size: '5"' }), 9);  // round(5*1.7)=round(8.5)=9
});

test('hat is a flat $25 regardless of selections', () => {
  assert.equal(unitPriceDollars('custom-hat', {}), 25);
  assert.equal(unitPriceDollars('custom-hat', { size: '3"', backing: 'Wraparound (360°)' }), 25);
  assert.equal(unitPriceCents('custom-hat', {}), 2500);
});

test('floor prevents nonsensical sub-floor prices', () => {
  // Unknown options fall back to x1.0, so base is the effective minimum here.
  assert.equal(unitPriceDollars('custom-patch', { size: 'bogus' }), 5);
});

test('selectionFromCustomizations maps Title-cased cart labels back to pricing fields', () => {
  const sel = selectionFromCustomizations({ Backing: 'Wraparound (360°)', Size: '3"', Type: 'Stainless Steel', Text: 'Hi' });
  assert.deepEqual(sel, { type: 'Stainless Steel', shape: undefined, size: '3"', backing: 'Wraparound (360°)' });
  assert.equal(unitPriceCents('custom-tumbler', sel), 2000);
});

test('throws for non-custom product ids', () => {
  assert.throws(() => unitPriceDollars('mama-floral-tumbler', {}), /not a custom product/);
});
