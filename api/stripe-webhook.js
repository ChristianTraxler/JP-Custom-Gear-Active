'use strict';

const Stripe = require('stripe');
const { Resend } = require('resend');
const { renderOrderEmails } = require('./_lib/render-order-emails.js');
const { PRODUCTS } = require('../js/products.js');

let _stripe, _resend;
function getStripe() {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return _stripe;
}
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) return res.status(400).json({ error: 'Missing stripe-signature' });

  let event;
  try {
    const raw = await readRawBody(req);
    event = getStripe().webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event.type !== 'checkout.session.completed') {
    // Acknowledge unhandled events so Stripe doesn't retry.
    return res.status(200).json({ received: true, ignored: event.type });
  }

  let session;
  try {
    session = await getStripe().checkout.sessions.retrieve(event.data.object.id, {
      expand: ['line_items']
    });
  } catch (err) {
    console.error('Failed to retrieve session:', err);
    return res.status(200).json({ received: true, error: 'retrieve_failed' });
  }

  const emails = renderOrderEmails(session, {
    catalog: PRODUCTS,
    siteUrl: process.env.SITE_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
  });
  const fromAddr = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const ownerAddr = process.env.ORDER_NOTIFICATION_EMAIL;
  const customerAddr = session.customer_details && session.customer_details.email;

  // Resend's SDK resolves with { data, error } instead of throwing on API
  // errors (e.g. domain not verified, 403 from test sender). Inspect both.
  async function send(label, payload) {
    try {
      const result = await getResend().emails.send(payload);
      if (result && result.error) {
        console.error(`${label} email rejected by Resend:`, result.error);
      } else {
        console.log(`${label} email sent OK:`, result && result.data && result.data.id);
      }
      return result;
    } catch (err) {
      console.error(`${label} email threw:`, err);
      return { error: err };
    }
  }

  // Reply-To routing: owner replies go to the customer (one-click reply to
  // buyer); customer replies go to the shop inbox (no inbox at fromAddr).
  const ownerSend = ownerAddr
    ? send('Owner', {
        from: fromAddr,
        to: ownerAddr,
        replyTo: customerAddr || ownerAddr,
        subject: emails.ownerSubject,
        html: emails.ownerHtml,
        text: emails.ownerText
      })
    : Promise.resolve({ error: 'ORDER_NOTIFICATION_EMAIL not set' });

  const customerSend = customerAddr
    ? send('Customer', {
        from: fromAddr,
        to: customerAddr,
        replyTo: ownerAddr || fromAddr,
        subject: emails.customerSubject,
        html: emails.customerHtml,
        text: emails.customerText
      })
    : Promise.resolve({ error: 'customer email missing' });

  await Promise.all([ownerSend, customerSend]);

  // Always 200 to Stripe — payment is captured, retrying doesn't help.
  return res.status(200).json({ received: true });
}

// Tell Vercel not to parse the body — we need raw bytes for signature verification.
// MUST be assigned after `handler` is named so it lands on the actual exported function.
handler.config = { api: { bodyParser: false } };

module.exports = handler;
