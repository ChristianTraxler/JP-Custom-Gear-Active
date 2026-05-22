'use strict';

const Stripe = require('stripe');
const { PRODUCTS } = require('../js/products.js');
const { buildLineItems } = require('./_lib/build-line-items.js');

// Lazy-init so `require()` succeeds even when env vars are unset (tests, cold deploys).
let _stripe;
function getStripe() {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return _stripe;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const shippingCents = Number(process.env.SHIPPING_RATE_CENTS) || 800;
  const shippingUpgradeAtCents = Number(process.env.SHIPPING_UPGRADE_AT_CENTS) || 10000;
  const shippingUpgradeCents = Number(process.env.SHIPPING_UPGRADE_RATE_CENTS) || 1000;
  // SITE_URL pinned in env wins (e.g. https://www.jpcustomgear.com for prod).
  // Otherwise fall back to Vercel's auto-injected VERCEL_URL so preview deploys
  // get the right success_url/cancel_url without manual env edits.
  const siteUrl = process.env.SITE_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const localPickup = body.localPickup === true;

  let payload;
  try {
    payload = buildLineItems({
      items: body.items,
      catalog: PRODUCTS,
      shippingCents,
      shippingUpgradeAtCents,
      shippingUpgradeCents,
      localPickup
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  // Filter out the shipping line if local pickup is selected (payload.shippingItem is null).
  const lineItems = [...payload.lineItems, payload.shippingItem].filter(Boolean);

  const sessionParams = {
    mode: 'payment',
    line_items: lineItems,
    shipping_address_collection: { allowed_countries: ['US'] },
    phone_number_collection: { enabled: true },
    success_url: siteUrl + '/thank-you.html?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: siteUrl + '/cart.html',
    metadata: payload.metadata
  };

  if (localPickup) {
    sessionParams.custom_text = {
      submit: { message: "Local pickup selected — we'll contact you to arrange a time and place. The address below is for billing only; no shipping will occur." }
    };
  }

  try {
    const session = await getStripe().checkout.sessions.create(sessionParams);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe session create failed:', err);
    return res.status(500).json({ error: "Couldn't start checkout, please try again." });
  }
};
