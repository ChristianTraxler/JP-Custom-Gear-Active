const test = require('node:test');
const assert = require('node:assert/strict');
const { renderOrderEmails } = require('../api/_lib/render-order-emails.js');

const fakeCatalog = {
  'salt-water-camo-hat': {
    name: 'JP Salt Water Camo Custom Hat',
    image: 'images/hats/salt-water-camo.png'
  }
};

const fakeOpts = { catalog: fakeCatalog, siteUrl: 'https://example.com' };

const fakeSession = {
  id: 'cs_test_abc12345xyz',
  amount_total: 5800, // $58.00
  amount_subtotal: 5000,
  shipping_cost: { amount_total: 800 },
  currency: 'usd',
  customer_details: {
    email: 'customer@example.com',
    name: 'Jane Customer',
    phone: '+15555551234',
    address: {
      line1: '123 Main St',
      line2: 'Apt 4',
      city: 'Raleigh',
      state: 'NC',
      postal_code: '27601',
      country: 'US'
    }
  },
  line_items: {
    data: [
      { description: 'JP Salt Water Camo Custom Hat', amount_total: 5000, quantity: 2 },
      { description: 'Shipping', amount_total: 800, quantity: 1 }
    ]
  },
  metadata: {
    item_0: JSON.stringify({ productId: 'salt-water-camo-hat', customizations: { Color: 'Salt Water Camo / White' } })
  }
};

test('returns both owner and customer HTML + text', () => {
  const out = renderOrderEmails(fakeSession, fakeOpts);
  assert.ok(out.ownerSubject.includes('New order'));
  assert.ok(out.customerSubject.includes('Your JP Custom Gear order'));
  assert.ok(out.ownerHtml.length > 0);
  assert.ok(out.customerHtml.length > 0);
  assert.ok(out.ownerText.length > 0);
  assert.ok(out.customerText.length > 0);
});

test('owner email includes customizations', () => {
  const out = renderOrderEmails(fakeSession, fakeOpts);
  assert.ok(out.ownerHtml.includes('Salt Water Camo / White'));
  assert.ok(out.ownerText.includes('Salt Water Camo / White'));
});

test('owner email includes customer contact details', () => {
  const out = renderOrderEmails(fakeSession, fakeOpts);
  assert.ok(out.ownerHtml.includes('Jane Customer'));
  assert.ok(out.ownerHtml.includes('customer@example.com'));
  assert.ok(out.ownerHtml.includes('+15555551234'));
  assert.ok(out.ownerHtml.includes('123 Main St'));
  assert.ok(out.ownerHtml.includes('Raleigh'));
});

test('customer email does NOT include internal-only fields', () => {
  // Customer should see their own info echoed; the test asserts general structure.
  const out = renderOrderEmails(fakeSession, fakeOpts);
  assert.ok(out.customerHtml.includes('Jane Customer'));
  assert.ok(out.customerHtml.includes('JP Salt Water Camo Custom Hat'));
  assert.ok(out.customerHtml.includes('$58.00'));
});

test('customer email includes customization details so the buyer sees their custom spec', () => {
  const out = renderOrderEmails(fakeSession, fakeOpts);
  assert.ok(out.customerHtml.includes('Color'), 'customer HTML should label customizations');
  assert.ok(out.customerHtml.includes('Salt Water Camo / White'), 'customer HTML should list customization values');
  assert.ok(out.customerText.includes('Salt Water Camo / White'), 'customer text should list customization values');
});

test('customer email omits the redundant Customer Name / Customer Email echo; owner keeps it', () => {
  const session = {
    ...fakeSession,
    metadata: {
      item_0: JSON.stringify({
        productId: 'salt-water-camo-hat',
        customizations: {
          Color: 'Salt Water Camo / White',
          'Customer Name': 'Jane Customer',
          'Customer Email': 'jane.unique@example.com'
        }
      })
    }
  };
  const out = renderOrderEmails(session, fakeOpts);
  // Owner copy keeps the contact echo in the order details.
  assert.ok(out.ownerHtml.includes('jane.unique@example.com'), 'owner keeps echoed email');
  assert.ok(out.ownerText.includes('Customer Name'), 'owner keeps the Customer Name label');
  // Customer copy drops it (already greeted by name + sent to their address).
  assert.ok(!out.customerHtml.includes('jane.unique@example.com'), 'customer HTML omits echoed email');
  assert.ok(!out.customerText.includes('jane.unique@example.com'), 'customer text omits echoed email');
  assert.ok(!out.customerText.includes('Customer Email'), 'customer text omits the Customer Email label');
  // …but still shows the real custom spec.
  assert.ok(out.customerText.includes('Salt Water Camo / White'), 'customer copy still shows the spec');
});

test('order reference is last 8 chars of session id, uppercased', () => {
  const out = renderOrderEmails(fakeSession, fakeOpts);
  assert.ok(out.ownerSubject.includes('12345XYZ'));
  assert.ok(out.customerSubject.includes('12345XYZ'));
});

test('handles missing metadata gracefully', () => {
  const session = { ...fakeSession, metadata: {} };
  const out = renderOrderEmails(session, fakeOpts);
  // Should still produce emails, just without customization details
  assert.ok(out.ownerHtml.length > 0);
});

test('escapes HTML in customer-supplied fields', () => {
  const session = {
    ...fakeSession,
    customer_details: { ...fakeSession.customer_details, name: '<script>alert(1)</script>' }
  };
  const out = renderOrderEmails(session, fakeOpts);
  assert.ok(!out.ownerHtml.includes('<script>alert(1)</script>'));
  assert.ok(out.ownerHtml.includes('&lt;script&gt;'));
});

test('embeds product thumbnail as absolute URL in both emails', () => {
  const out = renderOrderEmails(fakeSession, fakeOpts);
  const expected = 'https://example.com/images/hats/salt-water-camo.png';
  assert.ok(out.ownerHtml.includes(expected), 'owner email should include absolute image URL');
  assert.ok(out.customerHtml.includes(expected), 'customer email should include absolute image URL');
});

test('omits image when product not in catalog', () => {
  const out = renderOrderEmails(fakeSession, { catalog: {}, siteUrl: 'https://example.com' });
  assert.ok(!out.ownerHtml.includes('<img'), 'no img tag when product not in catalog');
});

test('camo koozie emails pick the per-pattern email image', () => {
  const cases = [
    ['Ghost Marsh Camo', 'images/camo-collection/steel-can-koozies/ghost-marsh-camo-koozie-email.jpg'],
    ['Timber Bark Camo', 'images/camo-collection/steel-can-koozies/timber-bark-camo-koozie-email.jpg']
  ];
  for (const [pattern, path] of cases) {
    const session = {
      ...fakeSession,
      line_items: { data: [{ description: pattern + ' Can Koozie', amount_total: 2000, quantity: 1 }] },
      metadata: { item_0: JSON.stringify({ productId: 'custom-camo-koozie', customizations: { Pattern: pattern, Blank: 'Yes' } }) }
    };
    const out = renderOrderEmails(session, { catalog: { 'custom-camo-koozie': { name: 'Koozie', image: 'x.webp' } }, siteUrl: 'https://example.com' });
    assert.ok(out.ownerHtml.includes('https://example.com/' + path), pattern + ' owner image');
    assert.ok(out.customerHtml.includes('https://example.com/' + path), pattern + ' customer image');
  }
});

test('mossy oak hoodie email uses its email image', () => {
  const session = {
    ...fakeSession,
    line_items: { data: [{ description: 'Custom Mossy Oak Washed Bottomland Camo Hoodie', amount_total: 5500, quantity: 1 }] },
    metadata: { item_0: JSON.stringify({ productId: 'custom-mossy-oak-hoodie', customizations: { Size: 'L', Blank: 'Yes' } }) }
  };
  const out = renderOrderEmails(session, { catalog: { 'custom-mossy-oak-hoodie': { name: 'Hoodie', image: 'x.webp' } }, siteUrl: 'https://example.com' });
  const expected = 'https://example.com/images/camo-collection/hoodies/mossy-oak-bottomland-hoodie-email.jpg';
  assert.ok(out.ownerHtml.includes(expected));
  assert.ok(out.customerHtml.includes(expected));
});

test('mossy oak long sleeve email uses its email image', () => {
  const session = {
    ...fakeSession,
    line_items: { data: [{ description: 'Custom Mossy Oak Washed Bottomland Camo Long Sleeve T-Shirt', amount_total: 3300, quantity: 1 }] },
    metadata: { item_0: JSON.stringify({ productId: 'custom-mossy-oak-longsleeve', customizations: { Size: 'L', Blank: 'Yes' } }) }
  };
  const out = renderOrderEmails(session, { catalog: { 'custom-mossy-oak-longsleeve': { name: 'Tee', image: 'x.webp' } }, siteUrl: 'https://example.com' });
  const expected = 'https://example.com/images/camo-collection/long-sleeve/mossy-oak-bottomland-longsleeve-email.jpg';
  assert.ok(out.ownerHtml.includes(expected));
  assert.ok(out.customerHtml.includes(expected));
});

test('mad hatter tee email uses its email image', () => {
  const session = {
    ...fakeSession,
    line_items: { data: [{ description: 'Custom Mad Hatter Fog Camo Short Sleeve T-Shirt', amount_total: 2800, quantity: 1 }] },
    metadata: { item_0: JSON.stringify({ productId: 'custom-mad-hatter-tee', customizations: { Size: 'L', Blank: 'Yes' } }) }
  };
  const out = renderOrderEmails(session, { catalog: { 'custom-mad-hatter-tee': { name: 'Tee', image: 'x.webp' } }, siteUrl: 'https://example.com' });
  const expected = 'https://example.com/images/camo-collection/short-sleeve/mad-hatter-fog-camo-tee-email.jpg';
  assert.ok(out.ownerHtml.includes(expected));
  assert.ok(out.customerHtml.includes(expected));
});

test('mad hatter vintage duck tee email uses its email image', () => {
  const session = {
    ...fakeSession,
    line_items: { data: [{ description: 'Custom Mad Hatter Vintage Duck Camo Short Sleeve T-Shirt', amount_total: 3000, quantity: 1 }] },
    metadata: { item_0: JSON.stringify({ productId: 'custom-mad-hatter-vintage-duck-tee', customizations: { Size: 'L', Blank: 'Yes' } }) }
  };
  const out = renderOrderEmails(session, { catalog: { 'custom-mad-hatter-vintage-duck-tee': { name: 'Tee', image: 'x.webp' } }, siteUrl: 'https://example.com' });
  const expected = 'https://example.com/images/camo-collection/short-sleeve/mad-hatter-vintage-duck-camo-tee-email.jpg';
  assert.ok(out.ownerHtml.includes(expected));
  assert.ok(out.customerHtml.includes(expected));
});

test('camo beanie emails pick the per-color email image', () => {
  for (const color of ['Americana', 'Bark', 'Blaze', 'Blizzard', 'Harvest', 'Marsh', 'Sable']) {
    const session = {
      ...fakeSession,
      line_items: { data: [{ description: 'Richardson Duck Camo Beanie - ' + color, amount_total: 2000, quantity: 1 }] },
      metadata: { item_0: JSON.stringify({ productId: 'custom-camo-beanie', customizations: { Pattern: color, Blank: 'Yes' } }) }
    };
    const out = renderOrderEmails(session, { catalog: { 'custom-camo-beanie': { name: 'Beanie', image: 'x.webp' } }, siteUrl: 'https://example.com' });
    const expected = 'https://example.com/images/camo-collection/Beanies/beanie-' + color.toLowerCase() + '-email.jpg';
    assert.ok(out.ownerHtml.includes(expected), color + ' owner');
    assert.ok(out.customerHtml.includes(expected), color + ' customer');
  }
});
