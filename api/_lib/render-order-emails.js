'use strict';

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, ch =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])
  );
}

function fmt(cents) {
  return '$' + ((Number(cents) || 0) / 100).toFixed(2);
}

function orderRef(sessionId) {
  return String(sessionId || '').slice(-8).toUpperCase();
}

function parseCustomizations(metadata) {
  // metadata.item_N → JSON { productId, customizations }
  // Sort by numeric index because Stripe doesn't guarantee key order — without
  // this, customizations could be mapped to the wrong line items in the email.
  return Object.keys(metadata || {})
    .filter(key => /^item_\d+$/.test(key))
    .sort((a, b) => parseInt(a.slice(5), 10) - parseInt(b.slice(5), 10))
    .map(key => {
      try { return JSON.parse(metadata[key]); }
      catch { return null; }
    })
    .filter(Boolean);
}

function renderAddress(a) {
  if (!a) return '';
  const parts = [a.line1, a.line2, [a.city, a.state, a.postal_code].filter(Boolean).join(', '), a.country].filter(Boolean);
  return parts.join('\n');
}

function absoluteImageUrl(siteUrl, imgPath) {
  if (!imgPath) return '';
  if (/^https?:\/\//i.test(imgPath)) return imgPath;
  const base = String(siteUrl || '').replace(/\/+$/, '');
  const path = String(imgPath).replace(/^\/+/, '');
  return base ? `${base}/${path}` : '';
}

function productImageFor(catalog, productId) {
  if (!catalog || !productId) return '';
  const p = catalog[productId];
  return p && p.image ? p.image : '';
}

function renderOrderEmails(session, opts) {
  const ref = orderRef(session.id);
  const customer = session.customer_details || {};
  const customizationsList = parseCustomizations(session.metadata);
  const lineItems = (session.line_items && session.line_items.data) || [];
  const total = fmt(session.amount_total);
  const subtotal = fmt(session.amount_subtotal);
  const isLocalPickup = !!(session.metadata && session.metadata.local_pickup === '1');
  const shipping = isLocalPickup
    ? 'Local pickup (free)'
    : fmt(session.shipping_cost && session.shipping_cost.amount_total);
  const catalog = (opts && opts.catalog) || {};
  const siteUrl = (opts && opts.siteUrl) || '';

  // Resolve a thumbnail URL per line item by aligning with the metadata index.
  // Shipping has no metadata entry, so it gets no image.
  function imgForLineIndex(idx) {
    const meta = customizationsList[idx];
    if (!meta) return '';
    const imgPath = productImageFor(catalog, meta.productId);
    return absoluteImageUrl(siteUrl, imgPath);
  }

  // ---- Owner email ----
  const ownerSubject = `New order #${ref} — ${customer.name || 'Customer'} — ${total}`;

  const itemsListHtml = lineItems.map((li, idx) => {
    const customs = customizationsList[idx] && customizationsList[idx].customizations;
    const customsHtml = customs && Object.keys(customs).length
      ? '<ul style="margin:4px 0 0 16px;color:#555;font-size:14px">' +
        Object.entries(customs).map(([k, v]) =>
          `<li><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</li>`
        ).join('') +
        '</ul>'
      : '';
    const imgUrl = imgForLineIndex(idx);
    const imgHtml = imgUrl
      ? `<img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(li.description)}" width="80" height="80" style="display:block;border-radius:6px;object-fit:cover;background:#f0ede5">`
      : '';
    return `<li style="margin-bottom:16px;list-style:none">
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="vertical-align:top;padding-right:12px">${imgHtml}</td>
        <td style="vertical-align:top">
          <strong>${escapeHtml(li.description)}</strong> — qty ${escapeHtml(li.quantity)} — ${fmt(li.amount_total)}
          ${customsHtml}
        </td>
      </tr></table>
    </li>`;
  }).join('');

  const ownerAddressLabel = isLocalPickup ? 'Billing address (LOCAL PICKUP)' : 'Ship to';
  const ownerPickupBanner = isLocalPickup
    ? `<p style="margin:12px 0;padding:10px 12px;background:#fff4cf;border-left:4px solid #d4a017;font-weight:600">⚑ Local pickup — contact customer to arrange.</p>`
    : '';

  const ownerHtml = `
<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#222;max-width:640px;margin:0 auto;padding:24px">
  <h2 style="margin:0 0 16px">New order #${escapeHtml(ref)}</h2>
  ${ownerPickupBanner}
  <p><strong>Customer:</strong> ${escapeHtml(customer.name)}<br>
     <strong>Email:</strong> ${escapeHtml(customer.email)}<br>
     <strong>Phone:</strong> ${escapeHtml(customer.phone)}</p>
  <p><strong>${escapeHtml(ownerAddressLabel)}:</strong><br>${escapeHtml(renderAddress(customer.address)).replace(/\n/g, '<br>')}</p>
  <h3>Items</h3>
  <ul style="list-style:none;padding:0">${itemsListHtml}</ul>
  <hr>
  <p>Subtotal: ${escapeHtml(subtotal)}<br>Shipping: ${escapeHtml(shipping)}<br><strong>Total: ${escapeHtml(total)}</strong></p>
  <p style="color:#888;font-size:12px">Stripe session: ${escapeHtml(session.id)}</p>
</body></html>`.trim();

  const ownerText = [
    `New order #${ref}`,
    ...(isLocalPickup ? [``, `*** LOCAL PICKUP — contact customer to arrange. ***`] : []),
    ``,
    `Customer: ${customer.name || ''}`,
    `Email: ${customer.email || ''}`,
    `Phone: ${customer.phone || ''}`,
    ``,
    `${isLocalPickup ? 'Billing address (LOCAL PICKUP)' : 'Ship to'}:`,
    renderAddress(customer.address),
    ``,
    `Items:`,
    ...lineItems.map((li, idx) => {
      const customs = customizationsList[idx] && customizationsList[idx].customizations;
      const customsTxt = customs && Object.keys(customs).length
        ? Object.entries(customs).map(([k, v]) => `    - ${k}: ${v}`).join('\n')
        : '';
      return `- ${li.description} — qty ${li.quantity} — ${fmt(li.amount_total)}\n${customsTxt}`.trimEnd();
    }),
    ``,
    `Subtotal: ${subtotal}`,
    `Shipping: ${shipping}`,
    `Total: ${total}`,
    ``,
    `Stripe session: ${session.id}`
  ].join('\n');

  // ---- Customer email ----
  const customerSubject = `Your JP Custom Gear order — #${ref}`;

  const customerItemsHtml = lineItems
    .map((li, idx) => ({ li, idx }))
    .filter(({ li }) => li.description !== 'Shipping')
    .map(({ li, idx }) => {
      const imgUrl = imgForLineIndex(idx);
      const imgHtml = imgUrl
        ? `<img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(li.description)}" width="80" height="80" style="display:block;border-radius:6px;object-fit:cover;background:#f0ede5">`
        : '';
      return `<li style="margin-bottom:16px;list-style:none">
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="vertical-align:top;padding-right:12px">${imgHtml}</td>
          <td style="vertical-align:top">${escapeHtml(li.description)} — qty ${escapeHtml(li.quantity)} — ${fmt(li.amount_total)}</td>
        </tr></table>
      </li>`;
    })
    .join('');

  const customerIntro = isLocalPickup
    ? `We've received your order <strong>#${escapeHtml(ref)}</strong>. You chose <strong>local pickup</strong> — we'll reach out shortly to arrange a time and place.`
    : `We've received your order <strong>#${escapeHtml(ref)}</strong> and we're getting it ready. Custom orders ship in 5–7 business days.`;
  const customerAddressHeading = isLocalPickup ? 'Pickup details' : 'Shipping to';
  const customerAddressBody = isLocalPickup
    ? `We'll contact you at the email or phone number above to arrange pickup.`
    : escapeHtml(renderAddress(customer.address)).replace(/\n/g, '<br>');

  const customerHtml = `
<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#222;max-width:640px;margin:0 auto;padding:24px">
  <h2 style="margin:0 0 16px">Thanks for your order, ${escapeHtml(customer.name || '')}!</h2>
  <p>${customerIntro}</p>
  <h3>Order summary</h3>
  <ul style="padding-left:0">${customerItemsHtml}</ul>
  <p>Subtotal: ${escapeHtml(subtotal)}<br>Shipping: ${escapeHtml(shipping)}<br><strong>Total: ${escapeHtml(total)}</strong></p>
  <h3>${escapeHtml(customerAddressHeading)}</h3>
  <p>${customerAddressBody}</p>
  <p>Questions? Just reply to this email.</p>
  <p>— JP Custom Gear</p>
</body></html>`.trim();

  const customerIntroText = isLocalPickup
    ? `Your order #${ref} is confirmed. You chose local pickup — we'll reach out shortly to arrange a time and place.`
    : `Your order #${ref} is confirmed. Custom orders ship in 5–7 business days.`;

  const customerText = [
    `Thanks for your order, ${customer.name || ''}!`,
    ``,
    customerIntroText,
    ``,
    `Order summary:`,
    ...lineItems.filter(li => li.description !== 'Shipping')
      .map(li => `- ${li.description} — qty ${li.quantity} — ${fmt(li.amount_total)}`),
    ``,
    `Subtotal: ${subtotal}`,
    `Shipping: ${shipping}`,
    `Total: ${total}`,
    ``,
    ...(isLocalPickup
      ? [`Pickup details:`, `We'll contact you at the email or phone number above to arrange pickup.`]
      : [`Shipping to:`, renderAddress(customer.address)]),
    ``,
    `Questions? Just reply to this email.`,
    `— JP Custom Gear`
  ].join('\n');

  return { ownerSubject, ownerHtml, ownerText, customerSubject, customerHtml, customerText };
}

module.exports = { renderOrderEmails };
