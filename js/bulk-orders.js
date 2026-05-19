(function () {
  'use strict';

  const PRODUCTS = [
    { id: 'hats',      name: 'Custom Hats',             icon: '🧢', price: '$25+',  defaultQty: 12, variantPlaceholder: 'e.g. 6 black + 6 tan, leather patch' },
    { id: 'patches',   name: 'Custom Patches',          icon: '🩹', price: '$5+',   defaultQty: 24, variantPlaceholder: 'e.g. 3" round, leatherette, gold thread' },
    { id: 'journals',  name: 'Laser Engraved Journals', icon: '📓', price: '$20+',  defaultQty: 12, variantPlaceholder: 'e.g. brown leather, name + logo' },
    { id: 'cups',      name: 'Custom Engraved Cups',    icon: '☕', price: '$20+',  defaultQty: 12, variantPlaceholder: 'e.g. 20oz tumblers, black' },
    { id: 'keychains', name: 'Leatherette Keychains',   icon: '🔑', price: '$10+',  defaultQty: 24, variantPlaceholder: 'e.g. deer silhouette, dark brown' },
    { id: 'koozies',   name: 'Custom Koozies',          icon: '🍺', price: '$8+',   defaultQty: 24, variantPlaceholder: 'e.g. camo, wedding date + names' },
    { id: 'shirts',    name: 'Custom Shirts',           icon: '👕', price: '$20+',  defaultQty: 12, variantPlaceholder: 'e.g. 6 M, 6 L, Comfort Colors sage' },
  ];

  const MIN_QTY = 12;

  // Render product cards
  const grid = document.getElementById('bulk-products');
  PRODUCTS.forEach(p => {
    const wrap = document.createElement('label');
    wrap.className = 'bulk-product';
    wrap.dataset.id = p.id;

    const hatStyleSelect = (p.id === 'hats') ? `
        <div class="bulk-qty-row">
          <label for="hat-style">Style</label>
          <select class="bulk-variant-input" id="hat-style" data-hat-style style="flex:1;">
            <option value="">Select a style…</option>
          </select>
        </div>
        <div class="bulk-qty-row">
          <label for="hat-color">Color</label>
          <select class="bulk-variant-input" id="hat-color" data-hat-color style="flex:1;" disabled>
            <option value="">Pick a style first…</option>
          </select>
        </div>
    ` : '';

    wrap.innerHTML = `
      <div class="bulk-product-row">
        <input type="checkbox" data-product-check="${p.id}" />
        <span class="bulk-product-icon">${p.icon}</span>
        <span class="bulk-product-name">${p.name}</span>
        <span class="bulk-product-price">${p.price}</span>
      </div>
      <div class="bulk-product-options" onclick="event.stopPropagation();">
        <div class="bulk-qty-row">
          <label for="qty-${p.id}">Quantity</label>
          <input class="bulk-qty-input" id="qty-${p.id}" data-product-qty="${p.id}" type="number" min="1" value="${p.defaultQty}" />
        </div>
        ${hatStyleSelect}
        <input class="bulk-variant-input" data-product-variant="${p.id}" type="text" placeholder="${p.variantPlaceholder}" />
      </div>
    `;
    grid.appendChild(wrap);
  });

  // Hat style options — match the filter chips on the shop page (112, 168, Infinity Her)
  const HAT_STYLE_OPTIONS = [
    {
      key: '112',
      name: 'Richardson 112',
      colors: ['Black/Black', 'Charcoal/Black', 'Heather Grey/Black', 'Navy/White', 'Khaki/Coffee', 'Loden/Black', 'Red/White', 'Royal/White', 'Realtree Edge Camo', 'Salt Water Camo / White', 'Salt Water Camo / Black', 'Salt Water Camo / Khaki', 'Marsh Duck / Khaki', 'Bark Duck / Black'],
    },
    {
      key: '168',
      name: 'Richardson 168',
      colors: ['Black/Black', 'Charcoal/Black', 'Heather Grey/Black', 'Navy/White', 'Khaki/Coffee', 'Loden/Black', 'Camo/Black'],
    },
    {
      key: 'infinity-her',
      name: 'Infinity Her',
      colors: ['Black', 'Charcoal', 'Navy', 'Khaki', 'White', 'Heather Grey', 'Burgundy', 'Olive', 'Pink'],
    },
  ];

  // Populate hat style + color dropdowns
  const hatStyleSel = document.querySelector('[data-hat-style]');
  const hatColorSel = document.querySelector('[data-hat-color]');
  if (hatStyleSel) {
    HAT_STYLE_OPTIONS.forEach(style => {
      const opt = document.createElement('option');
      opt.value = style.key;
      opt.textContent = style.name;
      hatStyleSel.appendChild(opt);
    });

    const stopProp = e => e.stopPropagation();
    hatStyleSel.addEventListener('click', stopProp);
    hatColorSel.addEventListener('click', stopProp);

    hatStyleSel.addEventListener('change', () => {
      const styleKey = hatStyleSel.value;
      const style = HAT_STYLE_OPTIONS.find(s => s.key === styleKey);
      hatColorSel.innerHTML = '';
      if (!style) {
        hatColorSel.disabled = true;
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'Pick a style first…';
        hatColorSel.appendChild(opt);
      } else {
        hatColorSel.disabled = false;
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Select a color…';
        hatColorSel.appendChild(placeholder);
        style.colors.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c;
          opt.textContent = c;
          hatColorSel.appendChild(opt);
        });
      }
      if (state.products.hats) {
        state.products.hats.hatStyle = hatStyleSel.options[hatStyleSel.selectedIndex]?.textContent || '';
        state.products.hats.hatStyleKey = styleKey;
        state.products.hats.hatColor = '';
        updateSummary();
      }
    });

    hatColorSel.addEventListener('change', () => {
      if (state.products.hats) {
        state.products.hats.hatColor = hatColorSel.value;
        updateSummary();
      }
    });
  }

  // Track selection
  const state = {
    products: {}, // id -> { qty, variant }
    designDesc: '',
    logoFilename: '',
    logoFile: null,
    org: '',
    deadline: '',
    notes: '',
    name: '',
    phone: '',
    email: '',
    orgType: 'Business',
  };

  // Bind product card interactions
  grid.querySelectorAll('.bulk-product').forEach(card => {
    const id = card.dataset.id;
    const checkbox = card.querySelector('[data-product-check]');
    const qtyInput = card.querySelector('[data-product-qty]');
    const variantInput = card.querySelector('[data-product-variant]');

    // Prevent qty/variant click from toggling the parent label's checkbox
    qtyInput.addEventListener('click', e => e.stopPropagation());
    variantInput.addEventListener('click', e => e.stopPropagation());

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        card.classList.add('is-selected');
        const item = { qty: parseInt(qtyInput.value, 10) || MIN_QTY, variant: variantInput.value.trim() };
        if (id === 'hats') {
          const styleSel = card.querySelector('[data-hat-style]');
          const colorSel = card.querySelector('[data-hat-color]');
          item.hatStyleKey = styleSel ? styleSel.value : '';
          item.hatStyle = styleSel ? (styleSel.options[styleSel.selectedIndex]?.textContent || '') : '';
          item.hatColor = colorSel ? colorSel.value : '';
        }
        state.products[id] = item;
      } else {
        card.classList.remove('is-selected');
        delete state.products[id];
      }
      updateSummary();
    });

    qtyInput.addEventListener('input', () => {
      if (state.products[id]) {
        state.products[id].qty = parseInt(qtyInput.value, 10) || 0;
        updateSummary();
      }
    });

    variantInput.addEventListener('input', () => {
      if (state.products[id]) {
        state.products[id].variant = variantInput.value.trim();
        updateSummary();
      }
    });
  });

  // File upload + preview + lightbox
  const fileInput = document.getElementById('bulk-logo');
  const fileText = document.getElementById('bulk-file-text');
  const fileClear = document.getElementById('bulk-file-clear');
  const logoThumb = document.getElementById('bulk-logo-thumb');
  const logoThumbName = document.getElementById('bulk-logo-thumb-name');
  const logoThumbImg = document.getElementById('bulk-logo-thumb-img');
  const logoThumbIcon = document.getElementById('bulk-logo-thumb-icon');
  const logoThumbBtn = document.getElementById('bulk-logo-thumb-imgbtn');
  const lightbox = document.getElementById('bulk-lightbox');
  const lightboxImg = document.getElementById('bulk-lightbox-img');
  const lightboxFilename = document.getElementById('bulk-lightbox-filename');

  let currentObjectURL = null;

  function setThumbImage(file) {
    if (currentObjectURL) { URL.revokeObjectURL(currentObjectURL); currentObjectURL = null; }
    const isImage = /^image\//.test(file.type) || /\.(png|jpe?g|svg)$/i.test(file.name);
    if (isImage) {
      currentObjectURL = URL.createObjectURL(file);
      logoThumbImg.src = currentObjectURL;
      logoThumbBtn.style.display = 'inline-flex';
      logoThumbIcon.style.display = 'none';
      logoThumb.classList.add('cz-logo-thumb--has-image');
    } else {
      logoThumbImg.removeAttribute('src');
      logoThumbBtn.style.display = 'none';
      logoThumbIcon.style.display = 'inline-flex';
      logoThumb.classList.remove('cz-logo-thumb--has-image');
    }
  }

  function openLightbox() {
    if (!currentObjectURL) return;
    lightboxImg.src = currentObjectURL;
    lightboxFilename.textContent = (fileInput.files && fileInput.files[0]) ? fileInput.files[0].name : '';
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
    else lightbox.setAttribute('open', '');
  }
  function closeLightbox() {
    if (typeof lightbox.close === 'function') lightbox.close();
    else lightbox.removeAttribute('open');
  }

  logoThumbBtn.addEventListener('click', openLightbox);
  document.getElementById('bulk-lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('bulk-lightbox-confirm').addEventListener('click', closeLightbox);
  document.getElementById('bulk-lightbox-replace').addEventListener('click', () => {
    closeLightbox();
    fileInput.click();
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      fileText.textContent = file.name;
      fileClear.style.display = 'inline-flex';
      logoThumb.style.display = 'flex';
      logoThumbName.textContent = file.name;
      setThumbImage(file);
      state.logoFilename = file.name;
      state.logoFile = file;
    } else {
      resetFile();
    }
    updateSummary();
  });

  fileClear.addEventListener('click', (e) => { e.preventDefault(); resetFile(); updateSummary(); });

  function resetFile() {
    fileInput.value = '';
    fileText.textContent = 'Choose file…';
    fileClear.style.display = 'none';
    logoThumb.style.display = 'none';
    logoThumb.classList.remove('cz-logo-thumb--has-image');
    if (currentObjectURL) { URL.revokeObjectURL(currentObjectURL); currentObjectURL = null; }
    logoThumbImg.removeAttribute('src');
    logoThumbBtn.style.display = 'none';
    logoThumbIcon.style.display = 'inline-flex';
    state.logoFilename = '';
    state.logoFile = null;
  }

  // Live summary
  const summaryList = document.getElementById('bulk-summary-list');
  const summaryEmpty = document.getElementById('bulk-summary-empty');
  const totalRow = document.getElementById('bulk-total-row');
  const totalQty = document.getElementById('bulk-total-qty');

  function updateSummary() {
    const selected = Object.entries(state.products);
    summaryList.innerHTML = '';
    if (selected.length === 0) {
      const li = document.createElement('li');
      li.className = 'bulk-summary-empty';
      li.textContent = 'No products selected yet.';
      summaryList.appendChild(li);
      totalRow.style.display = 'none';
      return;
    }
    let total = 0;
    selected.forEach(([id, item]) => {
      const product = PRODUCTS.find(p => p.id === id);
      total += item.qty || 0;
      const detailParts = [];
      if (id === 'hats') {
        if (item.hatStyle) detailParts.push(item.hatStyle);
        if (item.hatColor) detailParts.push(item.hatColor);
      }
      if (item.variant) detailParts.push(item.variant);
      const li = document.createElement('li');
      li.innerHTML = `<strong>${item.qty || 0}×</strong> ${product.name}` +
        (detailParts.length ? `<br><small style="color:var(--muted,#8a7a63);">${escapeHtml(detailParts.join(' · '))}</small>` : '');
      summaryList.appendChild(li);
    });
    totalRow.style.display = 'flex';
    totalQty.textContent = total;
  }

  // Submit handler
  const form = document.getElementById('bulkForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Read all field values into state
    state.designDesc = document.getElementById('bulk-design-desc').value.trim();
    state.org = document.getElementById('bulk-org').value.trim();
    state.deadline = document.getElementById('bulk-deadline').value;
    state.notes = document.getElementById('bulk-notes').value.trim();
    state.name = document.getElementById('bulk-name').value.trim();
    state.phone = document.getElementById('bulk-phone').value.trim();
    state.email = document.getElementById('bulk-email').value.trim();
    state.orgType = document.getElementById('bulk-orgtype').value;

    // Validate
    const productsErr = document.getElementById('bulk-products-error');
    productsErr.style.display = 'none';
    let firstError = null;

    if (Object.keys(state.products).length === 0) {
      productsErr.style.display = 'block';
      firstError = grid;
    }

    [['bulk-name', state.name], ['bulk-email', state.email]].forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (!val) {
        el.style.borderColor = '#c0392b';
        if (!firstError) firstError = el;
      } else {
        el.style.borderColor = '';
      }
    });

    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (firstError.focus) firstError.focus();
      return;
    }

    const summary = formatSummary();
    try {
      sessionStorage.setItem('bulk_order', JSON.stringify({
        ...state,
        logoFile: undefined, // can't serialize File
        summary: summary,
        timestamp: Date.now(),
      }));
    } catch (err) {
      console.warn('sessionStorage unavailable', err);
    }

    const totalItems = Object.values(state.products).reduce((sum, p) => sum + (p.qty || 0), 0);
    const q = new URLSearchParams({
      source: 'bulk',
      qty: String(totalItems),
    });
    window.location.href = 'contact.html?' + q.toString();
  });

  function formatSummary() {
    const lines = ['BULK ORDER REQUEST', ''];

    lines.push('── Products ──');
    Object.entries(state.products).forEach(([id, item]) => {
      const product = PRODUCTS.find(p => p.id === id);
      const detailParts = [];
      if (id === 'hats') {
        if (item.hatStyle) detailParts.push('Style: ' + item.hatStyle);
        if (item.hatColor) detailParts.push('Color: ' + item.hatColor);
      }
      if (item.variant) detailParts.push(item.variant);
      lines.push(`• ${item.qty}× ${product.name}` + (detailParts.length ? ` — ${detailParts.join(' · ')}` : ''));
    });

    const totalItems = Object.values(state.products).reduce((sum, p) => sum + (p.qty || 0), 0);
    lines.push(`Total Items: ${totalItems}`, '');

    lines.push('── Design ──');
    lines.push(state.designDesc ? `Description: ${state.designDesc}` : 'Description: (none)');
    lines.push(state.logoFilename ? `Uploaded File: ${state.logoFilename} (will be sent separately — see note below)` : 'Uploaded File: (none)');
    lines.push('');

    if (state.org || state.deadline || state.orgType) {
      lines.push('── Project ──');
      if (state.org) lines.push(`Organization / Event: ${state.org}`);
      lines.push(`Order Type: ${state.orgType}`);
      if (state.deadline) lines.push(`Need by: ${state.deadline}`);
      lines.push('');
    }

    if (state.notes) {
      lines.push('── Notes ──', state.notes, '');
    }

    if (state.logoFilename) {
      lines.push('── Important ──',
        `Please reply to this email with the design file (${state.logoFilename}) attached so we can build your proof.`);
    }

    return lines.join('\n');
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  updateSummary();
})();
