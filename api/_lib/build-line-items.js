// Pure function: validates cart against catalog and produces Stripe line_items + metadata.
// Throws Error with a user-safe message on validation failure.
'use strict';

const { isCustomProduct, unitPriceCents, selectionFromCustomizations } = require('../../js/custom-pricing.js');
const { sanitizeLogoUrl } = require('./logo-url.js');

const MAX_LINES = 50;
const MAX_METADATA_VALUE = 500;

// Camo hoodie designs share one price; the chosen pattern is appended to the line item name.
const HOODIE_PATTERNS = ['Duck Camo', 'Washed Camo', 'Desert Duck Camo'];

// Camo tumbler patterns share one price too; the pattern is appended to the line item name.
const CAMO_TUMBLER_PATTERNS = ['Bone Yard Camo', 'Blackwater Camo', 'Timber Bark Camo'];

// Camo koozie patterns share one price too; the pattern is appended to the line item name.
const CAMO_KOOZIE_PATTERNS = ['Ghost Marsh Camo', 'Timber Bark Camo'];

// Camo beanie colors share one price; the color is appended to the line item name.
const CAMO_BEANIE_COLORS = ['Americana', 'Bark', 'Blaze', 'Blizzard', 'Harvest', 'Marsh', 'Sable'];

// For sized apparel (e.g. tees), the unit price depends on the chosen size
// (2X/3X cost more). The price always comes from the catalog's `sizes` table —
// the client only supplies the size label, never a price. Falls back to the base
// price when the product isn't sized or the label is missing/unrecognized.
function catalogUnitPrice(product, customizations) {
  if (Array.isArray(product.sizes) && product.sizes.length) {
    const label = customizations && customizations.Size;
    const match = label && product.sizes.find(s => s.label === label);
    if (match) return match.priceCents;
  }
  return product.priceCents;
}

function buildLineItems({ items, catalog, shippingCents, shippingUpgradeAtCents, shippingUpgradeCents, localPickup }) {
  if (!Array.isArray(items)) throw new Error('items must be an array');
  if (items.length === 0) throw new Error('empty cart');
  if (items.length > MAX_LINES) throw new Error('too many line items (max 50)');

  let subtotalCents = 0;
  const lineItems = items.map((item, idx) => {
    const product = catalog[item.productId];
    if (!product) throw new Error('unknown product: ' + item.productId);
    const qty = Number(item.quantity);
    if (!Number.isFinite(qty) || qty < 1 || qty > 99) {
      throw new Error('invalid quantity for item ' + idx + ' (must be 1..99)');
    }
    // Custom builders (tumbler/keychain/patch/hat) are priced from the customer's
    // selections via the shared pricing module — never from a client-supplied price.
    // Everything else uses the fixed catalog price.
    const unitAmount = isCustomProduct(item.productId)
      ? unitPriceCents(item.productId, selectionFromCustomizations(item.customizations))
      : catalogUnitPrice(product, item.customizations);
    subtotalCents += unitAmount * qty;
    let displayName = product.name;
    if (item.productId === 'custom-hoodie') {
      const pattern = item.customizations && item.customizations.Pattern;
      if (HOODIE_PATTERNS.includes(pattern)) displayName = 'Custom Independent Trading Co. ' + pattern + ' Hoodie';
    }
    if (item.productId === 'custom-camo-tumbler') {
      const pattern = item.customizations && item.customizations.Pattern;
      if (CAMO_TUMBLER_PATTERNS.includes(pattern)) displayName = pattern + ' 20 oz Tumbler';
    }
    if (item.productId === 'custom-camo-beanie') {
      const color = item.customizations && item.customizations.Pattern;
      if (CAMO_BEANIE_COLORS.includes(color)) displayName = 'Richardson Duck Camo Beanie - ' + color;
    }
    if (item.productId === 'custom-camo-koozie') {
      const pattern = item.customizations && item.customizations.Pattern;
      if (CAMO_KOOZIE_PATTERNS.includes(pattern)) displayName = pattern + ' Can Koozie';
    }
    return {
      price_data: {
        currency: 'usd',
        unit_amount: unitAmount,
        product_data: { name: displayName }
      },
      quantity: qty
    };
  });

  const threshold = Number(shippingUpgradeAtCents);
  const upgraded = Number(shippingUpgradeCents);
  const useUpgraded = Number.isFinite(threshold) && Number.isFinite(upgraded) && subtotalCents >= threshold;
  const resolvedShippingCents = useUpgraded ? upgraded : (Number(shippingCents) || 0);

  // Local pickup omits the shipping line entirely so the customer is not charged.
  const shippingItem = localPickup ? null : {
    price_data: {
      currency: 'usd',
      unit_amount: resolvedShippingCents,
      product_data: { name: 'Shipping' }
    },
    quantity: 1
  };

  // Encode customizations + productId into Stripe metadata.
  const metadata = {};
  // The uploaded-logo link goes in its own key (logo_N) so a long URL can never push
  // item_N past the length cap and get its JSON cut off. Only our Blob host is accepted.
  items.forEach((item, idx) => {
    const customizations = Object.assign({}, item.customizations || {});
    const logoUrl = sanitizeLogoUrl(customizations['Logo URL']);
    delete customizations['Logo URL'];
    if (logoUrl) metadata['logo_' + idx] = logoUrl;
    const payload = JSON.stringify({
      productId: item.productId,
      customizations
    });
    metadata['item_' + idx] = payload.length > MAX_METADATA_VALUE
      ? payload.slice(0, MAX_METADATA_VALUE - 1) + '…'
      : payload;
  });
  if (localPickup) metadata.local_pickup = '1';
  // Stripe allows at most 50 metadata keys per object.
  if (Object.keys(metadata).length > 50) throw new Error('too many line items with uploaded logos');

  return { lineItems, shippingItem, metadata };
}

module.exports = { buildLineItems };
