// Hat builder page logic (build-hat.html). Ported from the mockup's Build.jsx.
// Pure logic and data live in js/hat-builder-core.js; the drawing is js/hat-drawing.js.
(function () {
  'use strict';

  const Core = window.HatBuilderCore;
  const Draw = window.HatDrawing;
  const $ = id => document.getElementById(id);

  const state = {
    bodyId: '112',
    color: 'Bark',
    typeId: 'leatherette',
    toneId: 'saddle',
    shape: 'wide-hex',
    size: '3"',
    text: '',
    font: 'block',
    logoName: '',
    qty: 1,
    notes: '',
    name: '',
    email: '',
    phone: ''
  };
  let logoPreviewUrl = ''; // blob: URL of an image logo, for the drawing only
  let logoUpload = null;

  const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  function current() {
    const s = Core.normalize(state);
    const body = Core.bodyById(s.bodyId);
    const type = Core.patchTypeById(s.typeId);
    const tone = type.tones.find(t => t.id === s.toneId) || type.tones[0];
    return { s, body, type, tone, shape: Core.shapeById(s.shape) };
  }

  // ---- Static bits ----
  function buildRuler() {
    let h = '';
    for (let i = 0; i < 12; i += 1) h += '<div class="bh-tick"><span class="bh-tick-l"></span><span class="bh-tick-s"></span><span class="jp-spec bh-tick-n">' + i + '</span></div>';
    document.querySelector('.bh-ruler').innerHTML = h;
  }

  // ---- Option groups ----
  function renderBodies() {
    $('bh-bodies').innerHTML = Core.BODIES.map(b =>
      '<button type="button" class="bh-body" aria-pressed="' + (state.bodyId === b.id) + '" data-body="' + b.id + '">' +
      '<span class="bh-body-txt"><span class="bh-body-name">' + esc(b.name) + '</span>' +
      '<span class="bh-body-note">' + esc(b.kind) + '. ' + esc(b.note) + '</span></span>' +
      '<span class="jp-spec bh-body-price">' + Core.money(Core.PRICE_CENTS / 100) + '</span></button>'
    ).join('');
  }

  function renderColors(c) {
    $('bh-colors').innerHTML = c.body.colors.map(name =>
      '<button type="button" class="bh-color" aria-pressed="' + (c.s.color === name) + '" aria-label="' + esc(name) + '" title="' + esc(name) + '" data-color="' + esc(name) + '">' +
      '<span style="--sw:' + esc(Draw.swatchBackground(name)) + '"></span></button>'
    ).join('');
  }

  function renderPatch(c) {
    $('bh-types').innerHTML = Core.patchTypesFor(c.body.id).map(t =>
      '<button type="button" class="jp-chip" aria-pressed="' + (c.type.id === t.id) + '" data-type="' + t.id + '">' + esc(t.name) + '</button>'
    ).join('');
    $('bh-tones').innerHTML = c.type.tones.map(t =>
      '<button type="button" class="jp-chip" aria-pressed="' + (c.tone.id === t.id) + '" data-tone="' + t.id + '">' +
      '<span class="bh-dot" style="background:linear-gradient(135deg,' + t.fill + ' 0 60%,' + t.ink + ' 60% 100%)"></span>' + esc(t.name) + '</button>'
    ).join('');
  }

  function renderShapes(c) {
    $('bh-shapes').innerHTML = Core.SHAPES.map(sh => {
      const label = sh.no ? 'No. ' + sh.no + ', ' + sh.name : sh.name;
      return '<button type="button" class="bh-shape" aria-pressed="' + (c.s.shape === sh.id) + '" aria-label="' + esc(label) + '" title="' + esc(sh.name) + '" data-shape="' + sh.id + '">' +
        '<span class="bh-shape-art">' + Draw.patchSvg({ shape: sh.id, type: c.type.id, tone: c.tone, long: 90 }) + '</span>' +
        '<span class="jp-spec bh-shape-no">' + (sh.no ? Core.pad(sh.no) : 'Own') + '</span></button>';
    }).join('');
  }

  function renderSizes(c) {
    $('bh-sizes').innerHTML = Core.SIZES.map(z =>
      '<button type="button" class="jp-chip bh-size" aria-pressed="' + (c.s.size === z) + '" data-size="' + esc(z) + '">' + esc(z) + '</button>'
    ).join('');
  }

  function renderFonts(c) {
    $('bh-fonts').innerHTML = [['block', 'Block lettering'], ['serif', 'Serif lettering']].map(f =>
      '<button type="button" class="jp-chip" aria-pressed="' + (c.s.font === f[0]) + '" data-font="' + f[0] + '">' + f[1] + '</button>'
    ).join('');
  }

  // Marks the pressed state without rebuilding (keeps keyboard focus on the clicked button).
  function setPressed(containerId, attr, value) {
    $(containerId).querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.getAttribute('data-' + attr) === value)));
  }

  function renderTickets(c) {
    const rows = Core.summaryRows(state);
    const html = rows.map(r => '<div class="jp-ticket-row"><span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span></div>').join('');
    $('bh-ticket-desk').innerHTML = html;
    $('bh-ticket-mob').innerHTML = html;
  }

  function renderDrawing(c) {
    Draw.render($('bh-draw'), {
      body: c.body,
      color: c.s.color,
      patch: {
        shape: c.s.shape,
        size: c.s.size,
        type: c.type.id,
        tone: c.tone,
        text: c.s.text,
        font: c.s.font,
        logo: logoPreviewUrl || null,
        placeholder: 'Your text'
      }
    });
  }

  function renderPrice(c) {
    const est = Core.estimateLabel(c.s.qty);
    const qty = Core.clampQty(c.s.qty);
    $('bh-cap-l').textContent = c.body.name + ' · ' + c.s.color;
    $('bh-cap-r').textContent = 'Est. ' + est;
    $('bh-bar-line').textContent = qty + ' × ' + Core.money(Core.PRICE_CENTS / 100);
    $('bh-bar-est').textContent = 'Est. ' + est;
    $('bh-add-desk').textContent = 'Add to bag · ' + est;
    $('bh-a1').textContent = Core.money(Core.PRICE_CENTS / 100) + ' per hat';
    $('bh-a7').textContent = qty >= 12 ? 'Bulk pricing applies' : 'No minimum';
    $('bh-qty-note').textContent = qty >= 12 ? 'Your quote will include bulk pricing.' : 'Bulk discounts kick in around 12 hats.';
  }

  function renderHeads(c) {
    $('bh-a2').textContent = c.s.color;
    $('bh-a3').textContent = c.type.note;
    $('bh-a4').textContent = Core.shapeLabel(c.shape) + ' · ' + c.shape.name;
    $('bh-a6').textContent = c.s.text.length + '/' + Core.MAX_TEXT;
    $('bh-notes-count').textContent = state.notes.length + '/200';
  }

  // Light update: drawing, ticket, price. Used while typing.
  function refresh() {
    const c = current();
    renderDrawing(c);
    renderTickets(c);
    renderPrice(c);
    renderHeads(c);
  }

  // Full update after a button choice.
  function refreshAll() {
    const c = current();
    state.color = c.s.color;
    state.typeId = c.s.typeId;
    state.toneId = c.s.toneId;
    renderBodies();
    renderColors(c);
    renderPatch(c);
    renderShapes(c);
    renderSizes(c);
    renderFonts(c);
    refresh();
  }

  // ---- Logo ----
  function setupLogo() {
    const input = $('bh-logo');
    const text = $('bh-file-text');
    const clear = $('bh-file-clear');
    const idle = text.textContent;
    const onBusy = api => {
      const busy = api.isUploading();
      [$('bh-add-desk'), $('bh-add-bar')].forEach(b => {
        b.disabled = busy;
        b.setAttribute('aria-disabled', String(busy));
      });
    };
    logoUpload = window.LogoUpload.attach({ input, submitButton: null, onChange: onBusy });

    function drop() {
      if (logoPreviewUrl) { URL.revokeObjectURL(logoPreviewUrl); logoPreviewUrl = ''; }
    }
    input.addEventListener('change', () => {
      drop();
      const file = input.files && input.files[0];
      if (file) {
        state.logoName = file.name;
        text.textContent = file.name;
        clear.style.display = 'inline-flex';
        // PNG, JPG and SVG preview on the patch; a PDF is listed by name only.
        if (/^image\//.test(file.type) || /\.(png|jpe?g|svg)$/i.test(file.name)) logoPreviewUrl = URL.createObjectURL(file);
        hideError('design');
      } else {
        state.logoName = '';
        text.textContent = idle;
        clear.style.display = 'none';
      }
      refresh();
    });
    clear.addEventListener('click', () => {
      drop();
      input.value = '';
      logoUpload.reset();
      state.logoName = '';
      text.textContent = idle;
      clear.style.display = 'none';
      refresh();
    });
  }

  // ---- Errors ----
  const errEls = { name: 'bh-name-error', email: 'bh-email-error', design: 'bh-design-error' };
  const errFields = { name: 'bh-name', email: 'bh-email', design: 'bh-text' };
  function showError(key, msg) {
    const el = $(errEls[key]);
    if (msg) el.textContent = msg;
    el.hidden = false;
    $(errFields[key]).setAttribute('aria-invalid', 'true');
  }
  function hideError(key) {
    $(errEls[key]).hidden = true;
    $(errFields[key]).removeAttribute('aria-invalid');
  }

  // ---- Add to bag ----
  function addToBag() {
    const block = logoUpload && logoUpload.blockReason();
    if (block) {
      $('bh-logo').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const result = Core.validate(state);
    ['name', 'email', 'design'].forEach(k => (result.errors[k] ? showError(k, result.errors[k]) : hideError(k)));
    if (!result.ok) {
      const field = $(errFields[result.first]);
      field.focus();
      field.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const logoUrl = logoUpload ? logoUpload.getUrl() : '';
    const item = Core.buildCartItem(state, { logoUrl });

    try {
      sessionStorage.setItem('customizer_order', JSON.stringify({
        style: item.name,
        color: state.color,
        qty: item.quantity,
        name: state.name.trim(),
        email: state.email.trim(),
        phone: state.phone.trim(),
        summary: Core.summaryRows(state).map(r => r[0] + ': ' + r[1]).join('\n'),
        timestamp: Date.now()
      }));
    } catch (err) { /* sessionStorage unavailable */ }

    if (typeof Cart === 'undefined') {
      const q = new URLSearchParams({ source: 'customizer', product: item.name, color: state.color, qty: String(item.quantity) });
      window.location.href = 'contact.html?' + q.toString();
      return;
    }
    Cart.addItem(item);
    window.location.href = 'cart.html';
  }

  // ---- Wiring ----
  function bind() {
    const on = (id, fn) => $(id).addEventListener('click', e => {
      const b = e.target.closest('button');
      if (b && $(id).contains(b)) fn(b);
    });
    on('bh-bodies', b => { state.bodyId = b.dataset.body; refreshAll(); });
    on('bh-colors', b => { state.color = b.dataset.color; setPressed('bh-colors', 'color', state.color); refresh(); });
    on('bh-types', b => {
      state.typeId = b.dataset.type;
      state.toneId = Core.patchTypeById(state.typeId).tones[0].id;
      refreshAll();
    });
    on('bh-tones', b => { state.toneId = b.dataset.tone; refreshAll(); });
    on('bh-shapes', b => { state.shape = b.dataset.shape; setPressed('bh-shapes', 'shape', state.shape); refresh(); });
    on('bh-sizes', b => { state.size = b.dataset.size; setPressed('bh-sizes', 'size', state.size); refresh(); });
    on('bh-fonts', b => { state.font = b.dataset.font; setPressed('bh-fonts', 'font', state.font); refresh(); });

    $('bh-text').addEventListener('input', e => {
      state.text = e.target.value;
      if (state.text.trim()) hideError('design');
      refresh();
    });

    const qty = $('bh-qty');
    const setQty = n => { state.qty = Core.clampQty(n); qty.value = state.qty; refresh(); };
    $('bh-qty-minus').addEventListener('click', () => setQty(state.qty - 1));
    $('bh-qty-plus').addEventListener('click', () => setQty(state.qty + 1));
    qty.addEventListener('input', () => {
      const digits = qty.value.replace(/\D/g, '');
      if (digits === '') return; // let the field be empty while typing
      setQty(parseInt(digits, 10));
    });
    qty.addEventListener('blur', () => { qty.value = state.qty; });

    $('bh-notes').addEventListener('input', e => { state.notes = e.target.value; renderHeads(current()); });
    $('bh-name').addEventListener('input', e => { state.name = e.target.value; if (state.name.trim()) hideError('name'); });
    $('bh-email').addEventListener('input', e => { state.email = e.target.value; if (state.email.trim()) hideError('email'); });
    $('bh-phone').addEventListener('input', e => { state.phone = e.target.value; });

    $('bhForm').addEventListener('submit', e => { e.preventDefault(); addToBag(); });
    $('bh-add-desk').addEventListener('click', addToBag);
    $('bh-add-bar').addEventListener('click', addToBag);
  }

  // Keep the footer and the back-to-top button clear of the fixed bar on phones, and keep
  // focused or scrolled-to fields out from under the sticky header, drawing and bar.
  function syncBarHeight() {
    const bar = $('bh-bar');
    const stage = document.querySelector('.bh-stage');
    const nav = document.querySelector('.navbar');
    const root = document.documentElement;
    const apply = () => {
      const phone = getComputedStyle(bar).display !== 'none';
      root.style.setProperty('--bh-bar-h', (phone ? bar.offsetHeight : 0) + 'px');
      root.style.scrollPaddingTop = phone ? nav.offsetHeight + stage.offsetHeight + 16 + 'px' : '';
      root.style.scrollPaddingBottom = phone ? bar.offsetHeight + 16 + 'px' : '';
    };
    apply();
    window.addEventListener('resize', apply);
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(apply);
      ro.observe(bar);
      ro.observe(stage);
    }
  }

  buildRuler();
  setupLogo();
  bind();
  refreshAll();
  syncBarHeight();
})();
