// Minimal localStorage shim for Node-side tests.
// Attaches to globalThis so the cart module sees `localStorage`.
function makeStore() {
  const data = new Map();
  return {
    getItem(k) { return data.has(k) ? data.get(k) : null; },
    setItem(k, v) { data.set(k, String(v)); },
    removeItem(k) { data.delete(k); },
    clear() { data.clear(); }
  };
}

function install() {
  globalThis.localStorage = makeStore();
  // Make `window` point at globalThis so browser-style `window.X = api` writes
  // to the same place Node tests read from via `globalThis.X`.
  if (typeof globalThis.window === 'undefined') globalThis.window = globalThis;
  globalThis.window.dispatchEvent = globalThis.window.dispatchEvent || (() => {});
  globalThis.window.addEventListener = globalThis.window.addEventListener || (() => {});
}

function reset() {
  globalThis.localStorage.clear();
}

module.exports = { install, reset };
