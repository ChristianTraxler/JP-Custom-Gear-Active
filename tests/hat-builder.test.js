const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Core = require('../js/hat-builder-core.js');
const { buildLineItems } = require('../api/_lib/build-line-items.js');
const { PRODUCTS } = require('../js/products.js');
const { unitPriceCents, selectionFromCustomizations } = require('../js/custom-pricing.js');

const base = () => ({
  bodyId: '112', color: 'Bark', typeId: 'leatherette', toneId: 'saddle', shape: 'wide-hex', size: '3"',
  text: 'SMITH FARMS', font: 'block', logoName: '', qty: 3, notes: '', name: 'Pat Smith', email: 'pat@example.com', phone: ''
});

test('price is a flat $25 per hat and the estimate is 25 x qty', () => {
  assert.equal(Core.unitPriceCents(), 2500);
  assert.equal(Core.estimateCents(1), 2500);
  assert.equal(Core.estimateCents(3), 7500);
  assert.equal(Core.estimateLabel(3), '$75+');
  assert.equal(Core.estimateLabel(12), '$300+');
});

test('quantity is clamped to 1..99 (what the cart and checkout accept)', () => {
  assert.equal(Core.clampQty(0), 1);
  assert.equal(Core.clampQty('abc'), 1);
  assert.equal(Core.clampQty(2.9), 2);
  assert.equal(Core.clampQty(500), 99);
});

test('colorway: solid color uses one tone for front, bill and mesh', () => {
  const cw = Core.colorway('Black');
  assert.equal(cw.front, Core.SOLIDS.Black);
  assert.equal(cw.bill, cw.front);
  assert.equal(cw.mesh, cw.front);
  assert.equal(cw.camo, null);
  assert.equal(cw.second, null);
});

test('colorway: two-tone is front first, mesh back second', () => {
  const cw = Core.colorway('Charcoal/White');
  assert.equal(cw.front, Core.SOLIDS.Charcoal);
  assert.equal(cw.bill, Core.SOLIDS.Charcoal);
  assert.equal(cw.mesh, Core.SOLIDS.White);
  assert.equal(cw.second, Core.SOLIDS.White);
  assert.equal(Core.colorway('Heather/Black').front, Core.SOLIDS.Heather);
});

test('colorway: camo names paint front and bill with the pattern and use the camo mesh', () => {
  const cw = Core.colorway('Bark');
  assert.equal(cw.front, 'camo:Bark');
  assert.equal(cw.bill, 'camo:Bark');
  assert.equal(cw.camo, 'Bark');
  assert.equal(cw.mesh, Core.CAMO.Bark.mesh);
});

test('colorway: unknown names fall back to a neutral tone instead of throwing', () => {
  assert.equal(Core.colorway('Mystery').front, '#555');
});

test('every color offered for every body resolves to a real colorway', () => {
  for (const b of Core.BODIES) {
    for (const c of b.colors) {
      const cw = Core.colorway(c);
      for (const k of ['front', 'bill', 'mesh']) assert.notEqual(cw[k], '#555', b.id + ' ' + c + ' ' + k);
      if (!cw.camo) assert.ok(Object.values(Core.SOLIDS).includes(cw.front), b.id + ' ' + c);
    }
  }
});

test('colorway: three-part name gives a charcoal front, black mesh and bill, white top panel', () => {
  const cw = Core.colorway('Charcoal/Black/White');
  assert.equal(cw.front, Core.SOLIDS.Charcoal);
  assert.equal(cw.mesh, Core.SOLIDS.Black);
  assert.equal(cw.bill, Core.SOLIDS.Black);
  assert.equal(cw.top, Core.SOLIDS.White);
  assert.equal(Core.colorway('Heather Grey/Black').front, Core.SOLIDS['Heather Grey']);
});

test('colors per body match the Richardson chart', () => {
  const by = id => Core.bodyById(id).colors;
  assert.deepEqual(by('168'), ['Heather Grey/Black', 'Black', 'Charcoal/Black', 'Charcoal/Black/White']);
  assert.deepEqual(by('168p').slice().sort(), ['Bark', 'Bottomland', 'Harvest', 'Marsh', 'Realtree', 'Salt Water']);
  assert.deepEqual(by('112pfp').slice().sort(), ['Admiral', 'Americana', 'Bark', 'Blaze', 'Bottomland', 'Harvest', 'Marsh', 'Salt Water']);
  assert.equal(Core.bodyById('168p').drawing, 'seven');
  assert.equal(Core.buildCartItem({ bodyId: '168p', color: 'Realtree', typeId: 'leatherette', toneId: 'saddle', shape: 'wide-hex', size: '3"', text: 'x', qty: 2 }).unitPrice, 2500);
});

test('normalize resets an invalid color to the body first color', () => {
  const n = Core.normalize({ bodyId: '168p', color: 'Black', typeId: 'leatherette', toneId: 'saddle' });
  assert.equal(n.color, 'Bottomland');
});

test('normalize resets a color the new body does not offer, and PVC on the beanie', () => {
  assert.equal(Core.normalize({ ...base(), bodyId: '256p', color: 'Black' }).color, 'Harvest');
  assert.equal(Core.normalize({ ...base(), bodyId: '168', color: 'Bark' }).color, 'Heather Grey/Black');
  const b = Core.normalize({ ...base(), bodyId: 'beanie', color: 'Black', typeId: 'pvc', toneId: 'olive' });
  assert.equal(b.typeId, 'leatherette');
  assert.equal(b.toneId, 'saddle');
});

test('validate: name, email and text-or-logo are required', () => {
  const r = Core.validate({ ...base(), name: '', email: '', text: '', logoName: '' });
  assert.equal(r.ok, false);
  assert.deepEqual(Object.keys(r.errors).sort(), ['design', 'email', 'name']);
  assert.equal(r.first, 'name');
  assert.equal(Core.validate({ ...base(), name: 'A', email: '' }).first, 'email');
  assert.equal(Core.validate({ ...base(), text: '  ' }).first, 'design');
});

test('validate: a logo alone satisfies the design requirement; a bad email is rejected', () => {
  assert.equal(Core.validate({ ...base(), text: '', logoName: 'logo.png' }).ok, true);
  assert.equal(Core.validate({ ...base(), email: 'not-an-email' }).errors.email.length > 0, true);
  assert.equal(Core.validate(base()).ok, true);
  assert.equal(Core.validate(base()).first, null);
});

test('buildCartItem: product, price, quantity and customization keys', () => {
  const item = Core.buildCartItem({ ...base(), notes: 'Need by June', logoName: 'logo.png' }, { logoUrl: 'https://abc.public.blob.vercel-storage.com/logos/logo-x.png' });
  assert.equal(item.productId, 'custom-hat');
  assert.equal(item.unitPrice, 2500);
  assert.equal(item.quantity, 3);
  assert.equal(item.name, 'Custom Hat, Richardson 112');
  assert.ok(!item.name.includes('—'));
  assert.equal(item.thumbnail, 'images/hats/IMG_0684.png');
  const c = item.customizations;
  assert.equal(c.Style, 'Custom Hat');
  assert.equal(c['Hat Body Style'], 'Richardson 112');
  assert.equal(c.Color, 'Bark');
  assert.equal(c.Patch, 'Leatherette, Saddle');
  assert.equal(c['Patch Shape'], 'No. 03 Wide Hex');
  assert.equal(c['Patch Size'], '3"');
  assert.equal(c['Custom Text'], 'SMITH FARMS');
  assert.equal(c['Logo File'], 'logo.png');
  assert.equal(c['Logo URL'], 'https://abc.public.blob.vercel-storage.com/logos/logo-x.png');
  assert.equal(c.Notes, 'Need by June');
  assert.equal(c['Customer Name'], 'Pat Smith');
  assert.equal(c['Customer Email'], 'pat@example.com');
});

test('buildCartItem: optional keys are left out when empty; quantity is clamped', () => {
  const c = Core.buildCartItem({ ...base(), qty: 400 }).customizations;
  assert.equal(Core.buildCartItem({ ...base(), qty: 400 }).quantity, 99);
  for (const k of ['Logo File', 'Logo URL', 'Notes', 'Lettering']) assert.equal(k in c, false, k);
});

test('buildCartItem: thumbnail is an existing image for every body', () => {
  for (const b of Core.BODIES) {
    const item = Core.buildCartItem({ ...base(), bodyId: b.id, color: b.colors[0] });
    assert.equal(fs.existsSync(path.join(__dirname, '..', item.thumbnail)), true, item.thumbnail);
    assert.equal(item.name, 'Custom Hat, ' + b.name);
  }
});

test('buildCartItem: custom outline shape reads as a custom outline', () => {
  assert.equal(Core.buildCartItem({ ...base(), shape: 'custom' }).customizations['Patch Shape'], 'Custom outline');
});

test('buildCartItem: long notes are trimmed so the order metadata stays valid JSON', () => {
  const long = 'x'.repeat(200);
  const item = Core.buildCartItem({ ...base(), notes: long, name: 'N'.repeat(40), email: ('e'.repeat(40)) + '@example.com', logoName: 'l'.repeat(50) + '.png' });
  const { customizations } = item;
  const copy = { ...customizations };
  delete copy['Logo URL'];
  const payload = JSON.stringify({ productId: 'custom-hat', customizations: copy });
  assert.ok(payload.length <= Core.METADATA_LIMIT, 'payload ' + payload.length);
  assert.ok(customizations.Notes.length < long.length);
});

test('summaryRows lists hat, color, patch, shape, size, text, logo and quantity', () => {
  const rows = Core.summaryRows({ ...base(), qty: 1 });
  assert.deepEqual(rows.map(r => r[0]), ['Hat', 'Color', 'Patch', 'Shape', 'Size', 'Text', 'Logo', 'Quantity']);
  assert.equal(rows[7][1], '1 hat');
  assert.equal(rows[3][1], 'No. 03 Wide Hex');
  assert.equal(Core.summaryRows({ ...base(), text: '' })[5][1], 'None');
});

test('server prices a builder cart item at 2500 per unit, whatever options it carries', () => {
  for (const b of Core.BODIES) {
    for (const size of Core.SIZES) {
      const item = Core.buildCartItem({ ...base(), bodyId: b.id, color: b.colors[0], size, qty: 5, notes: 'x', logoName: 'a.png' }, { logoUrl: 'https://abc.public.blob.vercel-storage.com/logos/a.png' });
      assert.equal(unitPriceCents(item.productId, selectionFromCustomizations(item.customizations)), 2500);
    }
  }
});

test('checkout accepts a builder cart item: one line at $25 x qty, customizations carried in metadata', () => {
  const item = Core.buildCartItem({ ...base(), qty: 3, notes: 'Need by June' });
  const { lineItems, metadata } = buildLineItems({
    items: [{ productId: item.productId, quantity: item.quantity, customizations: item.customizations }],
    catalog: PRODUCTS,
    shippingCents: 800
  });
  assert.equal(lineItems.length, 1);
  assert.equal(lineItems[0].price_data.unit_amount, 2500);
  assert.equal(lineItems[0].quantity, 3);
  const parsed = JSON.parse(metadata.item_0);
  assert.equal(parsed.productId, 'custom-hat');
  assert.deepEqual(parsed.customizations, item.customizations);
});
