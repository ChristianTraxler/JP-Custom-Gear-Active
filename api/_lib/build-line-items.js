// Pure function: validates cart against catalog and produces Stripe line_items + metadata.
// Throws Error with a user-safe message on validation failure.
'use strict';

const MAX_LINES = 50;
const MAX_METADATA_VALUE = 500;

function buildLineItems({ items, catalog, shippingCents }) {
  if (!Array.isArray(items)) throw new Error('items must be an array');
  if (items.length === 0) throw new Error('empty cart');
  if (items.length > MAX_LINES) throw new Error('too many line items (max 50)');

  const lineItems = items.map((item, idx) => {
    const product = catalog[item.productId];
    if (!product) throw new Error('unknown product: ' + item.productId);
    const qty = Number(item.quantity);
    if (!Number.isFinite(qty) || qty < 1 || qty > 99) {
      throw new Error('invalid quantity for item ' + idx + ' (must be 1..99)');
    }
    return {
      price_data: {
        currency: 'usd',
        unit_amount: product.priceCents,
        product_data: { name: product.name }
      },
      quantity: qty
    };
  });

  const shippingItem = {
    price_data: {
      currency: 'usd',
      unit_amount: Number(shippingCents) || 0,
      product_data: { name: 'Shipping' }
    },
    quantity: 1
  };

  // Encode customizations + productId into Stripe metadata.
  const metadata = {};
  items.forEach((item, idx) => {
    const payload = JSON.stringify({
      productId: item.productId,
      customizations: item.customizations || {}
    });
    metadata['item_' + idx] = payload.length > MAX_METADATA_VALUE
      ? payload.slice(0, MAX_METADATA_VALUE - 1) + '…'
      : payload;
  });

  return { lineItems, shippingItem, metadata };
}

module.exports = { buildLineItems };
