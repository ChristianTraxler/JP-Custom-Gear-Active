const test = require('node:test');
const assert = require('node:assert/strict');
const { sanitizeLogoUrl } = require('../api/_lib/logo-url.js');
const { buildLineItems } = require('../api/_lib/build-line-items.js');
const { renderOrderEmails } = require('../api/_lib/render-order-emails.js');
const { PRODUCTS } = require('../js/products.js');
const uploadLogo = require('../api/upload-logo.js');

const GOOD = 'https://abc123def456.public.blob.vercel-storage.com/logos/my-logo-Xy12Zk.png';

function mockRes() {
  return {
    statusCode: 200, headers: {}, body: undefined,
    setHeader(k, v) { this.headers[k] = v; },
    status(c) { this.statusCode = c; return this; },
    json(b) { this.body = b; return this; }
  };
}

test('sanitizeLogoUrl accepts only https URLs on the Blob public host', () => {
  assert.equal(sanitizeLogoUrl(GOOD), GOOD);
  const bad = [
    '',
    null,
    undefined,
    123,
    'http://abc123.public.blob.vercel-storage.com/logos/a.png',
    'https://evil.example.com/logos/a.png',
    'https://public.blob.vercel-storage.com/logos/a.png',
    'https://abc.public.blob.vercel-storage.com.evil.com/a.png',
    'https://evilpublic.blob.vercel-storage.com/a.png',
    'https://user:pw@abc.public.blob.vercel-storage.com/a.png',
    'javascript:alert(1)',
    'https://abc.public.blob.vercel-storage.com/' + 'a'.repeat(500)
  ];
  bad.forEach(v => assert.equal(sanitizeLogoUrl(v), '', 'should reject ' + String(v).slice(0, 60)));
});

test('buildLineItems puts an allowed Logo URL in its own logo_N metadata key', () => {
  const { metadata } = buildLineItems({
    items: [{ productId: 'custom-hoodie', quantity: 1, customizations: { Pattern: 'Duck Camo', Size: 'L', 'Logo Filename': 'a.png', 'Logo URL': GOOD } }],
    catalog: PRODUCTS,
    shippingCents: 800
  });
  assert.equal(metadata.logo_0, GOOD);
  assert.ok(metadata.logo_0.length < 500);
  const item = JSON.parse(metadata.item_0);
  assert.equal(item.customizations['Logo URL'], undefined, 'URL is not duplicated inside item_N');
  assert.equal(item.customizations['Logo Filename'], 'a.png');
});

test('buildLineItems drops a Logo URL that is not on the Blob host', () => {
  const { metadata } = buildLineItems({
    items: [{ productId: 'custom-hoodie', quantity: 1, customizations: { Pattern: 'Duck Camo', Size: 'L', 'Logo URL': 'https://evil.example.com/x.png' } }],
    catalog: PRODUCTS,
    shippingCents: 800
  });
  assert.equal(metadata.logo_0, undefined);
  assert.ok(!metadata.item_0.includes('evil.example.com'));
});

const session = {
  id: 'cs_test_logo12345',
  amount_total: 5300,
  amount_subtotal: 4500,
  shipping_cost: { amount_total: 800 },
  customer_details: { email: 'c@example.com', name: 'Jane', phone: '+15555551234', address: { line1: '1 Main', city: 'Raleigh', state: 'NC', postal_code: '27601', country: 'US' } },
  line_items: { data: [
    { description: 'Custom Hoodie', amount_total: 4500, quantity: 1 },
    { description: 'Shipping', amount_total: 800, quantity: 1 }
  ] },
  metadata: {
    item_0: JSON.stringify({ productId: 'custom-hoodie', customizations: { Pattern: 'Duck Camo', 'Logo Filename': 'my logo.png' } }),
    logo_0: GOOD
  }
};

test('owner email shows a Download logo link and an inline preview for png', () => {
  const { ownerHtml, ownerText } = renderOrderEmails(session, { catalog: PRODUCTS, siteUrl: 'https://example.com' });
  assert.match(ownerHtml, new RegExp('<a href="' + GOOD.replace(/[.]/g, '\\.') + '"[^>]*>Download logo</a>'));
  assert.match(ownerHtml, new RegExp('<img src="' + GOOD.replace(/[.]/g, '\\.') + '" alt="Customer logo preview"'));
  assert.ok(ownerText.includes('Logo URL: ' + GOOD));
});

test('owner email links a pdf logo but does not inline it', () => {
  const pdf = 'https://abc.public.blob.vercel-storage.com/logos/art-Q1.pdf';
  const s = Object.assign({}, session, { metadata: Object.assign({}, session.metadata, { logo_0: pdf }) });
  const { ownerHtml } = renderOrderEmails(s, { catalog: PRODUCTS, siteUrl: 'https://example.com' });
  assert.ok(ownerHtml.includes('Download logo'));
  assert.ok(!ownerHtml.includes('Customer logo preview'));
});

test('email rendering ignores a logo_N value on a foreign host', () => {
  const s = Object.assign({}, session, { metadata: Object.assign({}, session.metadata, { logo_0: 'https://evil.example.com/x.png' }) });
  const { ownerHtml, ownerText } = renderOrderEmails(s, { catalog: PRODUCTS, siteUrl: 'https://example.com' });
  assert.ok(!ownerHtml.includes('evil.example.com'));
  assert.ok(!ownerText.includes('evil.example.com'));
});

test('customer email says the logo was received and does not expose the link', () => {
  const { customerHtml, customerText } = renderOrderEmails(session, { catalog: PRODUCTS, siteUrl: 'https://example.com' });
  assert.ok(customerHtml.includes('<strong>Logo:</strong> Received'));
  assert.ok(!customerHtml.includes('blob.vercel-storage.com'));
  assert.ok(!customerText.includes('blob.vercel-storage.com'));
});

test('upload-logo rejects non-POST and fails gracefully without a Blob token', async () => {
  const saved = process.env.BLOB_READ_WRITE_TOKEN;
  delete process.env.BLOB_READ_WRITE_TOKEN;
  try {
    const get = mockRes();
    await uploadLogo({ method: 'GET' }, get);
    assert.equal(get.statusCode, 405);

    const post = mockRes();
    await uploadLogo({ method: 'POST', body: {} }, post);
    assert.equal(post.statusCode, 503);
    assert.match(post.body.error, /not available/i);
  } finally {
    if (saved !== undefined) process.env.BLOB_READ_WRITE_TOKEN = saved;
  }
});
