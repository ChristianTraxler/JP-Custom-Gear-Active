// Renders /cart.html and handles the Checkout button.
(function () {
  'use strict';
  if (typeof Cart === 'undefined') {
    console.error('cart-page.js: Cart not loaded');
    return;
  }

  const linesEl = document.getElementById('cart-lines');
  const bodyEl = document.getElementById('cart-body');
  const emptyEl = document.getElementById('cart-empty');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('cart-checkout');
  const errorEl = document.getElementById('cart-error');

  if (!linesEl) return; // not on cart page

  function fmt(cents) { return '$' + (cents / 100).toFixed(2); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, ch => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[ch]));
  }

  function renderCustomizations(c) {
    if (!c || typeof c !== 'object') return '';
    const entries = Object.entries(c).filter(([, v]) => v !== '' && v != null);
    if (entries.length === 0) return '';
    return entries.map(([k, v]) =>
      `<span><strong>${escapeHtml(k)}:</strong> ${escapeHtml(String(v))}</span>`
    ).join('');
  }

  function render() {
    const cart = Cart.getCart();
    if (cart.items.length === 0) {
      bodyEl.hidden = true;
      emptyEl.hidden = false;
      return;
    }
    bodyEl.hidden = false;
    emptyEl.hidden = true;

    linesEl.innerHTML = cart.items.map(item => `
      <li class="cart-line" data-line-id="${escapeHtml(item.lineId)}">
        <img class="cart-line-thumb" src="${escapeHtml(item.thumbnail || 'images/J.PATS.png')}" alt="" />
        <div class="cart-line-body">
          <h3>${escapeHtml(item.name)}</h3>
          <div class="cart-line-customs">${renderCustomizations(item.customizations)}</div>
          <div class="cart-line-controls">
            <label>Qty
              <input class="cart-qty-input" type="number" min="1" max="99" value="${item.quantity}" data-line-qty="${escapeHtml(item.lineId)}" />
            </label>
            <button class="cart-remove-btn" type="button" data-line-remove="${escapeHtml(item.lineId)}">Remove</button>
          </div>
        </div>
        <div class="cart-line-price">${fmt(item.unitPrice * item.quantity)}</div>
      </li>
    `).join('');

    const subtotal = Cart.getTotalCents();
    subtotalEl.textContent = fmt(subtotal);
    totalEl.textContent = fmt(subtotal); // shipping added at Stripe Checkout
  }

  linesEl.addEventListener('click', e => {
    const removeId = e.target.getAttribute('data-line-remove');
    if (removeId) Cart.removeItem(removeId);
  });

  linesEl.addEventListener('change', e => {
    const qtyId = e.target.getAttribute('data-line-qty');
    if (qtyId) Cart.updateQuantity(qtyId, parseInt(e.target.value, 10));
  });

  checkoutBtn.addEventListener('click', async () => {
    const cart = Cart.getCart();
    if (cart.items.length === 0) return;

    checkoutBtn.disabled = true;
    errorEl.hidden = true;
    checkoutBtn.textContent = 'Starting checkout…';

    try {
      const resp = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            customizations: i.customizations
          }))
        })
      });

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body.error || `Checkout failed (${resp.status})`);
      }
      const { url } = await resp.json();
      if (!url) throw new Error('Checkout response missing URL');
      window.location.href = url;
    } catch (err) {
      errorEl.textContent = err.message || 'Could not start checkout. Please try again.';
      errorEl.hidden = false;
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = 'Checkout';
    }
  });

  Cart.subscribe(render);
  render();
})();
