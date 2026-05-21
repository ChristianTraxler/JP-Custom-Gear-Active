// JP Custom Gear cart — pure state, no DOM.
// Persisted in localStorage under "jpcg_cart". Browser globals: window.Cart.
// Node (tests) require()s this file and uses globalThis.Cart.
(function (root) {
  'use strict';

  const STORAGE_KEY = 'jpcg_cart';
  const MAX_QTY = 99;
  const MIN_QTY = 1;

  let state = null;
  const subscribers = new Set();

  function emptyCart() {
    return { items: [], updatedAt: Date.now() };
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyCart();
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.items)) return emptyCart();
      return parsed;
    } catch {
      return emptyCart();
    }
  }

  function save() {
    state.updatedAt = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or disabled — fail silently; in-memory state still valid.
    }
    subscribers.forEach(fn => {
      try { fn(state); } catch { /* subscriber errors don't break the cart */ }
    });
  }

  function ensureLoaded() {
    if (state === null) state = loadFromStorage();
  }

  function clampQty(n) {
    n = Number(n);
    if (!Number.isFinite(n)) return MIN_QTY;
    return Math.max(MIN_QTY, Math.min(MAX_QTY, Math.floor(n)));
  }

  function randomLineId() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  }

  function getCart() {
    ensureLoaded();
    return state;
  }

  function getItemCount() {
    ensureLoaded();
    return state.items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  }

  function getTotalCents() {
    ensureLoaded();
    return state.items.reduce((sum, i) => sum + (i.unitPrice || 0) * (i.quantity || 0), 0);
  }

  function addItem({ productId, quantity, customizations, name, unitPrice, thumbnail }) {
    ensureLoaded();
    state.items.push({
      lineId: randomLineId(),
      productId: String(productId),
      name: String(name || productId),
      unitPrice: Number(unitPrice) || 0,
      quantity: clampQty(quantity || 1),
      customizations: customizations || {},
      thumbnail: thumbnail || ''
    });
    save();
    return state;
  }

  function updateQuantity(lineId, quantity) {
    ensureLoaded();
    const idx = state.items.findIndex(i => i.lineId === lineId);
    if (idx === -1) return state;
    const q = Number(quantity);
    if (!Number.isFinite(q) || q <= 0) {
      state.items.splice(idx, 1);
    } else {
      state.items[idx].quantity = clampQty(q);
    }
    save();
    return state;
  }

  function removeItem(lineId) {
    ensureLoaded();
    state.items = state.items.filter(i => i.lineId !== lineId);
    save();
    return state;
  }

  function clearCart() {
    state = emptyCart();
    save();
  }

  function subscribe(fn) {
    subscribers.add(fn);
    return function unsubscribe() { subscribers.delete(fn); };
  }

  // Testing only — never call from app code.
  function _resetForTests(opts) {
    subscribers.clear();
    if (opts && opts.rereadFromStorage) {
      state = null;
    } else {
      state = emptyCart();
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
  }

  const api = {
    getCart, getItemCount, getTotalCents,
    addItem, updateQuantity, removeItem, clearCart,
    subscribe,
    _resetForTests
  };

  root.Cart = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
