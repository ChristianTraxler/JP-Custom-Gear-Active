// Injects a cart icon + count badge into the nav on every page.
// Depends on Cart (js/cart.js). Must be loaded AFTER cart.js.
(function () {
  'use strict';
  if (typeof Cart === 'undefined') {
    console.warn('cart-badge.js: Cart not loaded — skipping');
    return;
  }

  function mount() {
    const navRight = document.querySelector('.nav-right');
    if (!navRight) return; // page has no nav

    if (navRight.querySelector('.nav-cart')) return; // already mounted

    const link = document.createElement('a');
    link.className = 'nav-cart';
    link.href = 'cart.html';
    link.setAttribute('aria-label', 'View cart');
    link.innerHTML =
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="9" cy="21" r="1"></circle>' +
        '<circle cx="20" cy="21" r="1"></circle>' +
        '<path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"></path>' +
      '</svg>' +
      '<span class="nav-cart-count" data-cart-count hidden>0</span>';

    // Insert before the "Start Order" CTA if it exists, else at the front
    const cta = navRight.querySelector('.nav-cta');
    if (cta) navRight.insertBefore(link, cta);
    else navRight.prepend(link);

    update();
    Cart.subscribe(update);
  }

  function update() {
    const count = Cart.getItemCount();
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = String(count);
      el.hidden = count === 0;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
