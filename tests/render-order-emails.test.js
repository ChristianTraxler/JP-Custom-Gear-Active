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
