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
  assert.equal(unitPriceDollars('custom-tumbler', { backing: 'Front Only' }), 20);     // $20.00
  assert.equal(unitPriceDollars('custom-tumbler', { backing: 'Front + Back' }), 22.5); // $22.50
  assert.equal(unitPriceDollars('custom-tumbler', { backing: 'Wraparound (360°)' }), 25); // $25.00
  assert.equal(unitPriceCents('custom-tumbler', { backing: 'Front + Back' }), 2250);
  assert.equal(unitPriceCents('custom-tumbler', { backing: 'Wraparound (360°)' }), 2500);
});

test('tumbler defaults to base when no engraving selected (and color/shape do not change price)', () => {
  assert.equal(unitPriceDollars('custom-tumbler', {}), 20);
  assert.equal(unitPriceDollars('custom-tumbler', { size: 'Black/Copper', shape: '20 oz' }), 20);
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
  assert.deepEqual(sel, { type: 'Stainless Steel', shape: undefined, size: '3"', backing: 'Wraparound (360°)', blank: undefined });
  assert.equal(unitPriceCents('custom-tumbler', sel), 2500);
});

test('camo koozie: $20 blank, $25 customized (placeholder price)', () => {
  assert.equal(isCustomProduct('custom-camo-koozie'), true);
  assert.equal(unitPriceCents('custom-camo-koozie', selectionFromCustomizations({ Blank: 'Yes' })), 2000);
  assert.equal(unitPriceCents('custom-camo-koozie', selectionFromCustomizations({ Text: 'SMITH' })), 2500);
  assert.equal(unitPriceCents('custom-camo-koozie', {}), 2500);
});

test('mossy oak hoodie: $55 blank, $60 customized', () => {
  assert.equal(isCustomProduct('custom-mossy-oak-hoodie'), true);
  assert.equal(unitPriceCents('custom-mossy-oak-hoodie', selectionFromCustomizations({ Blank: 'Yes', Size: 'XL' })), 5500);
  assert.equal(unitPriceCents('custom-mossy-oak-hoodie', selectionFromCustomizations({ Size: '2XL', Placement: 'Front + Back', Text: 'X' })), 6000);
});

test('mossy oak long sleeve: $33 blank, $38 customized', () => {
  assert.equal(isCustomProduct('custom-mossy-oak-longsleeve'), true);
  assert.equal(unitPriceCents('custom-mossy-oak-longsleeve', selectionFromCustomizations({ Blank: 'Yes', Size: 'XL' })), 3300);
  assert.equal(unitPriceCents('custom-mossy-oak-longsleeve', selectionFromCustomizations({ Size: '2XL', Placement: 'Back', Text: 'X' })), 3800);
});

test('mad hatter tee: $28 blank, $33 customized (placeholder price)', () => {
  assert.equal(isCustomProduct('custom-mad-hatter-tee'), true);
  assert.equal(unitPriceCents('custom-mad-hatter-tee', selectionFromCustomizations({ Blank: 'Yes', Size: 'XL' })), 3000);
  assert.equal(unitPriceCents('custom-mad-hatter-tee', selectionFromCustomizations({ Size: '2XL', Placement: 'Full back design', Text: 'X' })), 3500);
});

test('mad hatter vintage duck tee: $30 blank, $35 customized', () => {
  assert.equal(isCustomProduct('custom-mad-hatter-vintage-duck-tee'), true);
  assert.equal(unitPriceCents('custom-mad-hatter-vintage-duck-tee', selectionFromCustomizations({ Blank: 'Yes', Size: 'XL' })), 3000);
  assert.equal(unitPriceCents('custom-mad-hatter-vintage-duck-tee', selectionFromCustomizations({ Size: '2XL', Placement: 'Full back design', Text: 'X' })), 3500);
});

test('camo beanie: $20 blank, $25 customized', () => {
  assert.equal(isCustomProduct('custom-camo-beanie'), true);
  assert.equal(unitPriceCents('custom-camo-beanie', selectionFromCustomizations({ Blank: 'Yes' })), 2000);
  assert.equal(unitPriceCents('custom-camo-beanie', selectionFromCustomizations({ 'Customization type': 'Business logo', Text: 'X' })), 2500);
});

test('throws for non-custom product ids', () => {
  assert.throws(() => unitPriceDollars('mama-floral-tumbler', {}), /not a custom product/);
});

test('a "Blank" flag on an item that carries a design is charged the customized price', () => {
  const cp = require('../js/custom-pricing.js');
  const s = cp.selectionFromCustomizations;
  assert.equal(cp.unitPriceCents('custom-hoodie', s({ Blank: 'Yes', Size: 'L' })), 4000);
  assert.equal(cp.unitPriceCents('custom-hoodie', s({ Blank: 'Yes', Text: 'JP' })), 4500);
  assert.equal(cp.unitPriceCents('custom-hoodie', s({ Blank: 'Yes', Placement: 'Front' })), 4500);
  assert.equal(cp.unitPriceCents('custom-camo-beanie', s({ Blank: 'Yes', 'Logo URL': 'x' })), 2500);
  assert.equal(cp.unitPriceCents('custom-camo-beanie', s({ Blank: 'Yes', 'Customization type': 'Business logo' })), 2500);
});

test('a "Blank" item with any key outside the blank allowlist is charged the customized price', () => {
  const cp = require('../js/custom-pricing.js');
  const s = cp.selectionFromCustomizations;
  assert.equal(cp.unitPriceCents('custom-camo-tumbler', s({ Blank: 'Yes', Pattern: 'Blackwater Camo', Notes: 'gift' })), 2000);
  assert.equal(cp.unitPriceCents('custom-camo-tumbler', s({ Blank: 'Yes', Design: 'my logo' })), 2500);
  assert.equal(cp.unitPriceCents('custom-camo-tumbler', s({ Blank: 'Yes', Pattern: ['x'] })), 2500);
});
