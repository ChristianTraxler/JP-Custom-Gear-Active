// Hat builder: data and pure logic (no DOM). Browser global: window.HatBuilderCore.
// Loaded by build-hat.html before js/hat-drawing.js and js/hat-builder.js, and
// require()d by tests/hat-builder.test.js.
//
// Data is ported from the approved redesign mockup (data/hat.js). Price is the
// store's real one: a flat $25 per hat, the same amount checkout charges for the
// 'custom-hat' product (js/custom-pricing.js). The client never sets the price the
// customer pays; the server recomputes it.
(function (root) {
  'use strict';

  const PRICE_CENTS = 2500;
  const MIN_QTY = 1;
  const MAX_QTY = 99; // the cart and checkout both cap a line at 99
  const MAX_TEXT = 30;
  // Stripe metadata values are cut at 500 characters (api/_lib/build-line-items.js). A cut
  // payload is no longer valid JSON, so the order email would lose every option. The client
  // trims Notes to keep the whole payload under this.
  const METADATA_LIMIT = 500;

  const SHAPES = [
    { id: 'rounded-top', no: 1, name: 'Rounded Top', aspect: 1.5 },
    { id: 'tall-hex', no: 2, name: 'Tall Hex', aspect: 0.74 },
    { id: 'wide-hex', no: 3, name: 'Wide Hex', aspect: 1.75 },
    { id: 'diamond', no: 4, name: 'Diamond', aspect: 1.6 },
    { id: 'wide-diamond', no: 5, name: 'Wide Diamond', aspect: 2.05 },
    { id: 'oval', no: 6, name: 'Oval', aspect: 1.45 },
    { id: 'square', no: 7, name: 'Square', aspect: 1 },
    { id: 'rounded-square', no: 8, name: 'Rounded Square', aspect: 1 },
    { id: 'circle', no: 9, name: 'Circle', aspect: 1 },
    { id: 'mini-hex', no: 11, name: 'Mini Hex', aspect: 0.87 },
    { id: 'wide-rect', no: 12, name: 'Wide Rectangle', aspect: 2.1 },
    { id: 'rounded-rect', no: 13, name: 'Rounded Rectangle', aspect: 2.1 },
    { id: 'large-hex', no: 14, name: 'Large Hex', aspect: 1.45 },
    { id: 'custom', no: null, name: 'Custom outline', aspect: 1.5 }
  ];

  const SIZES = ['2"', '2.25"', '2.5"', '3"', '3.5"', '4"', '4.5"', '5"'];

  const SOLIDS = {
    Black: '#1f201d',
    White: '#ebeae3',
    Charcoal: '#3c3e3a',
    Heather: '#9d9e98',
    'Heather Grey': '#9d9e98',
    Khaki: '#b8a27b',
    Red: '#9b2321',
    Loden: '#3e4b37',
    Navy: '#1d2a42',
    Brown: '#5a3d22',
    Olive: '#5a5a37',
    Burgundy: '#5b1b27',
    Tan: '#c6a87a'
  };

  const CAMO = {
    Harvest: { base: '#b59a6c', blobs: ['#7b5b37', '#8b8a57', '#d3bf93'], mesh: '#5d4630' },
    Marsh: { base: '#7a7d50', blobs: ['#4e5233', '#a6a076', '#5f4a30'], mesh: '#3e4b37' },
    Bark: { base: '#6b5440', blobs: ['#3e2f22', '#8e7558', '#4f4a36'], mesh: '#2e2620' },
    Blaze: { base: '#df6320', blobs: ['#9a3d12', '#3a2a1e', '#f08a48'], mesh: '#1f201d' },
    'Salt Water': { base: '#8fa5b2', blobs: ['#5c7686', '#c4cfd3', '#3e5563'], mesh: '#d9dcd8' },
    Bottomland: { base: '#5a4a35', blobs: ['#2e2519', '#7c6a4e', '#463c2c'], mesh: '#3a2f25' },
    Americana: { base: '#e9e4d4', blobs: ['#b3202e', '#f7f7f4', '#1c2a52'], mesh: '#f1f0ea' },
    Admiral: { base: '#1d2a4a', blobs: ['#3b5a92', '#111a30', '#2a3f6e'], mesh: '#1f201d' },
    Realtree: { base: '#c2a878', blobs: ['#7a5a34', '#6b6b3a', '#9b8b52'], mesh: '#c6a87a' },
    Camo: { base: '#7a7d50', blobs: ['#4e5233', '#a6a076', '#5f4a30'], mesh: '#3e4b37' }
  };

  // Photos for the cart thumbnail, the same ones js/hat-styles.js uses for these bodies.
  const BODIES = [
    {
      id: '112', name: 'Richardson 112', kind: 'Classic trucker',
      note: 'Structured 6-panel, curved bill, mesh back', drawing: 'trucker',
      image: 'images/hats/IMG_0684.png',
      colors: ['Black', 'Black/White', 'Charcoal/Black', 'Charcoal/White', 'Heather/Black', 'Khaki/White', 'Red/Black', 'Loden/Black', 'Harvest', 'Marsh', 'Bark', 'Blaze', 'Salt Water', 'Bottomland']
    },
    {
      id: '168', name: 'Richardson 168', kind: '7-panel trucker',
      note: 'Taller crown, seamless front, vintage feel', drawing: 'seven',
      image: 'images/hats/IMG_1303.png',
      colors: ['Heather Grey/Black', 'Black', 'Charcoal/Black', 'Charcoal/Black/White']
    },
    {
      id: '168p', name: 'Richardson 168P', kind: '7-panel trucker',
      note: '7-panel trucker. Printed camo front, mesh back', drawing: 'seven',
      image: 'images/hats/IMG_1303.png',
      colors: ['Bottomland', 'Bark', 'Harvest', 'Marsh', 'Salt Water', 'Realtree']
    },
    {
      id: '112pfp', name: 'Richardson 112PFP', kind: 'Flat bill',
      note: 'Printed 5-panel, flat bill, snapback', drawing: 'flat',
      image: 'images/hats/mama-tried-112-v1.png',
      colors: ['Harvest', 'Blaze', 'Bark', 'Americana', 'Marsh', 'Bottomland', 'Salt Water', 'Admiral']
    },
    {
      id: '256p', name: 'Richardson 256P', kind: 'Rope cap',
      note: '5-panel, low profile, rope trim', drawing: 'rope',
      image: 'images/hats/richardson256.png',
      colors: ['Harvest', 'Marsh', 'Bark', 'Salt Water', 'Bottomland']
    },
    {
      id: 'beanie', name: 'Knit beanie', kind: 'Cold weather',
      note: 'Cuffed knit, patch on the cuff', drawing: 'beanie',
      image: 'images/hats/duty-sheriff-knit.png',
      colors: ['Black', 'Charcoal', 'Navy', 'Heather Grey', 'Brown', 'Olive', 'Burgundy', 'Tan', 'Camo']
    }
  ];

  const PATCH_TYPES = [
    {
      id: 'leatherette', name: 'Leatherette', note: 'Laser engraved',
      tones: [
        { id: 'saddle', name: 'Saddle', fill: '#b0713e', ink: '#2a1a10', edge: '#7a4a24' },
        { id: 'rawhide', name: 'Rawhide', fill: '#cdb18a', ink: '#3a2817', edge: '#9c8160' },
        { id: 'chestnut', name: 'Chestnut', fill: '#6c4228', ink: '#1a0e07', edge: '#43281a' },
        { id: 'black-gold', name: 'Black & gold', fill: '#262522', ink: '#c9a45c', edge: '#111110' },
        { id: 'grey', name: 'Grey & black', fill: '#8f918b', ink: '#1d1e1b', edge: '#62645f' }
      ]
    },
    {
      id: 'pvc', name: 'PVC', note: 'Molded rubber, raised edge',
      tones: [
        { id: 'black', name: 'Black', fill: '#22231f', ink: '#e8e6dc', edge: '#4a4b46' },
        { id: 'olive', name: 'Olive', fill: '#4f5535', ink: '#e5e0c8', edge: '#6d7350' },
        { id: 'white', name: 'White', fill: '#e8e6dd', ink: '#1f201d', edge: '#bdbbb2' }
      ]
    },
    {
      id: 'embroidered', name: 'Embroidered', note: 'Stitched on twill',
      tones: [
        { id: 'black', name: 'Black twill', fill: '#232421', ink: '#e8e4d6', edge: '#d1c7ad' },
        { id: 'navy', name: 'Navy twill', fill: '#1e2b45', ink: '#e8e4d6', edge: '#c7a75e' },
        { id: 'khaki', name: 'Khaki twill', fill: '#bfa77d', ink: '#2a2116', edge: '#3a2f22' }
      ]
    },
    {
      id: 'woven', name: 'Woven', note: 'Fine thread, flat finish',
      tones: [
        { id: 'black', name: 'Black', fill: '#262623', ink: '#e6e2d4', edge: '#3b3b37' },
        { id: 'cream', name: 'Cream', fill: '#e6e0cd', ink: '#2a261d', edge: '#c9c2ab' }
      ]
    }
  ];

  const pad = n => String(n).padStart(2, '0');
  const money = n => (Number.isInteger(n) ? '$' + n : '$' + n.toFixed(2));

  const shapeById = id => SHAPES.find(s => s.id === id) || SHAPES[2];
  const bodyById = id => BODIES.find(b => b.id === id) || BODIES[0];
  const patchTypeById = id => PATCH_TYPES.find(p => p.id === id) || PATCH_TYPES[0];
  const shapeLabel = s => (s.no ? 'No. ' + pad(s.no) : 'Custom');
  // "No. 03 Wide Hex" or "Custom outline"
  const shapeFullName = s => (s.no ? 'No. ' + pad(s.no) + ' ' + s.name : s.name);

  // Patch types offered for a body (PVC is not offered on the beanie).
  function patchTypesFor(bodyId) {
    return bodyId === 'beanie' ? PATCH_TYPES.filter(t => t.id !== 'pvc') : PATCH_TYPES;
  }

  // "Charcoal/White" means charcoal front and bill with a white mesh back.
  // "Charcoal/Black/White" adds a white upper front panel and a black bill.
  function colorway(name) {
    name = String(name || '');
    if (CAMO[name]) {
      return { front: 'camo:' + name, bill: 'camo:' + name, mesh: CAMO[name].mesh, swatch: CAMO[name].base, camo: name, second: null };
    }
    const parts = name.split('/').map(s => s.trim());
    const a = parts[0];
    const b = parts[1];
    const c = parts[2];
    const front = SOLIDS[a] || '#555';
    const mesh = b ? SOLIDS[b] || front : front;
    // Three parts, "Front/Mesh/Top": a charcoal front with black mesh and bill, and a
    // white upper front panel (Richardson 168 Charcoal/Black/White).
    return {
      front,
      bill: c ? mesh : front,
      mesh,
      swatch: front,
      camo: null,
      second: b ? SOLIDS[b] || null : null,
      top: c ? SOLIDS[c] || null : null
    };
  }

  // Price. The store charges a flat $25 per hat, whatever the body, color, patch or size.
  function unitPriceCents() { return PRICE_CENTS; }
  function clampQty(n) {
    n = Math.floor(Number(n));
    if (!Number.isFinite(n)) return MIN_QTY;
    return Math.max(MIN_QTY, Math.min(MAX_QTY, n));
  }
  function estimateCents(qty) { return unitPriceCents() * clampQty(qty); }
  function estimateLabel(qty) { return money(estimateCents(qty) / 100) + '+'; }

  // Keep the picked color valid for a body, and the patch type valid for the beanie.
  function normalize(state) {
    const body = bodyById(state.bodyId);
    const next = Object.assign({}, state);
    if (body.colors.indexOf(next.color) === -1) next.color = body.colors[0];
    const types = patchTypesFor(body.id);
    if (!types.some(t => t.id === next.typeId)) {
      next.typeId = types[0].id;
      next.toneId = types[0].tones[0].id;
    }
    const type = patchTypeById(next.typeId);
    if (!type.tones.some(t => t.id === next.toneId)) next.toneId = type.tones[0].id;
    return next;
  }

  function trim(v) { return String(v == null ? '' : v).trim(); }

  // state: { bodyId, color, typeId, toneId, shape, size, text, font, logoName, qty, notes, name, email, phone }
  // Returns { ok, errors: { name?, email?, design? }, first: 'name'|'email'|'design'|null }
  function validate(state) {
    const errors = {};
    if (!trim(state.name)) errors.name = 'Add your name.';
    const email = trim(state.email);
    if (!email) errors.email = 'Add your email so we can send your proof.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'That email address does not look right.';
    if (!trim(state.text) && !trim(state.logoName)) errors.design = 'Add custom text, upload a logo, or both.';
    const first = ['name', 'email', 'design'].find(k => errors[k]) || null;
    return { ok: !first, errors, first };
  }

  function patchLabel(type, tone) { return type.name + ', ' + tone.name; }

  // Rows for the work order ticket.
  function summaryRows(state) {
    const s = normalize(state);
    const body = bodyById(s.bodyId);
    const type = patchTypeById(s.typeId);
    const tone = type.tones.find(t => t.id === s.toneId) || type.tones[0];
    const shape = shapeById(s.shape);
    const qty = clampQty(s.qty);
    const text = trim(s.text);
    return [
      ['Hat', body.name + ', ' + body.kind.toLowerCase()],
      ['Color', s.color],
      ['Patch', type.name + ', ' + tone.name.toLowerCase()],
      ['Shape', shape.no ? shapeFullName(shape) : 'Custom outline, cut to your design'],
      ['Size', s.size + ' on the long side'],
      ['Text', text ? '"' + text + '" (' + (s.font === 'serif' ? 'serif' : 'block') + ')' : 'None'],
      ['Logo', trim(s.logoName) || 'None'],
      ['Quantity', qty + (qty === 1 ? ' hat' : ' hats')]
    ];
  }

  // Cart item for Cart.addItem. Customization keys match js/customize.js where they overlap
  // (Style, Color, Patch, Custom Text, Logo File, Logo URL, Notes, Customer Name, Customer Email)
  // and add Patch Shape and Patch Size. opts: { logoUrl }.
  // None of these keys is read by the server pricing (it reads Type, Shape, Size, Backing,
  // Blank), so the charged price stays 2500 per hat.
  function buildCartItem(state, opts) {
    opts = opts || {};
    const s = normalize(state);
    const body = bodyById(s.bodyId);
    const type = patchTypeById(s.typeId);
    const tone = type.tones.find(t => t.id === s.toneId) || type.tones[0];
    const shape = shapeById(s.shape);
    const text = trim(s.text);
    const logoName = trim(s.logoName);
    const notes = trim(s.notes);
    const name = trim(s.name);
    const email = trim(s.email);

    const customizations = {
      Style: 'Custom Hat',
      'Hat Body Style': body.name,
      Color: s.color,
      Patch: patchLabel(type, tone),
      'Patch Shape': shapeFullName(shape),
      'Patch Size': s.size
    };
    if (text) customizations['Custom Text'] = text;
    if (logoName) customizations['Logo File'] = logoName;
    if (opts.logoUrl) customizations['Logo URL'] = opts.logoUrl;
    if (name) customizations['Customer Name'] = name;
    if (email) customizations['Customer Email'] = email;
    if (notes) customizations.Notes = fitNotes(customizations, notes);
    if (text && s.font === 'serif') customizations.Lettering = 'Serif';

    return {
      productId: 'custom-hat',
      name: 'Custom Hat, ' + body.name,
      unitPrice: unitPriceCents(),
      quantity: clampQty(s.qty),
      customizations,
      thumbnail: body.image
    };
  }

  // The server stores { productId, customizations } as JSON in one Stripe metadata value
  // (Logo URL is stored apart). Trim Notes so that JSON stays under the limit.
  function fitNotes(customizations, notes) {
    const probe = Object.assign({}, customizations);
    delete probe['Logo URL'];
    const wrap = n => JSON.stringify({ productId: 'custom-hat', customizations: Object.assign({}, probe, { Notes: n }) }).length;
    if (wrap(notes) <= METADATA_LIMIT) return notes;
    let n = notes;
    while (n.length > 0 && wrap(n + '…') > METADATA_LIMIT) n = n.slice(0, -1);
    return n ? n.replace(/\s+$/, '') + '…' : '';
  }

  const api = {
    PRICE_CENTS, MIN_QTY, MAX_QTY, MAX_TEXT, METADATA_LIMIT,
    SHAPES, SIZES, SOLIDS, CAMO, BODIES, PATCH_TYPES,
    pad, money, shapeById, bodyById, patchTypeById, shapeLabel, shapeFullName, patchTypesFor,
    colorway, unitPriceCents, clampQty, estimateCents, estimateLabel,
    normalize, validate, summaryRows, buildCartItem
  };

  root.HatBuilderCore = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
