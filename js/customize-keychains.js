(function () {
  const FORM_ENDPOINT = null;

  const KEYCHAIN_CONFIG = {
    name: "Custom Keychain",
    tagline: "Built to your spec",
    types: [
      "Leatherette (Engraved)"
    ],
    shapes: [
      "Rectangle",
      "Square",
      "Circle",
      "Oval",
      "Shield",
      "House Shape",
      "Custom Die-Cut"
    ],
    sizes: [
      '1.5"',
      '2"',
      '2.5"',
      '3"',
      'Custom Size'
    ],
    backings: [
      "Split Ring",
      "Swivel Clip",
      "Carabiner",
      "Lobster Clasp",
      "Bottle Opener"
    ],
    basePrice: 6,
    typeMultiplier: {
      "Leatherette (Engraved)": 1.0
    },
    sizeMultiplier: {
      '1.5"': 0.85,
      '2"': 1.0,
      '2.5"': 1.15,
      '3"': 1.3,
      'Custom Size': 1.25
    }
  };

  const form = document.getElementById('czForm');

  document.title = `Customize Your Keychain | JP Custom Gear`;

  // Material — single fixed option, rendered as a static pill in HTML
  const typeEl = document.getElementById('cz-type');
  const typeValue = (typeEl && typeEl.dataset.value) || KEYCHAIN_CONFIG.types[0];

  // Populate shape dropdown
  const shapeSel = document.getElementById('cz-shape');
  if (shapeSel) {
    KEYCHAIN_CONFIG.shapes.forEach((s, i) => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      if (i === 0) opt.selected = true;
      shapeSel.appendChild(opt);
    });
  }

  // Populate size dropdown
  const sizeSel = document.getElementById('cz-size');
  if (sizeSel) {
    KEYCHAIN_CONFIG.sizes.forEach((s, i) => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      if (i === 1) opt.selected = true; // Default to 2"
      sizeSel.appendChild(opt);
    });
  }

  // Populate hardware radios
  const backingGrid = document.getElementById('cz-backing-grid');
  if (backingGrid) {
    KEYCHAIN_CONFIG.backings.forEach((b, i) => {
      const id = 'cz-backing-' + i;
      const wrap = document.createElement('label');
      wrap.className = 'cz-radio';
      wrap.innerHTML = `
        <input type="radio" name="backing" id="${id}" value="${b}" ${i === 0 ? 'checked' : ''} />
        <span class="cz-radio-box">
          <span class="cz-radio-dot"></span>
          <span class="cz-radio-text">${b}</span>
        </span>
      `;
      backingGrid.appendChild(wrap);
    });
  }

  // Quantity
  const qtyInput = document.getElementById('cz-qty');
  document.getElementById('cz-qty-minus').addEventListener('click', () => {
    const v = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
    qtyInput.value = v; updateSummary();
  });
  document.getElementById('cz-qty-plus').addEventListener('click', () => {
    const v = Math.min(9999, (parseInt(qtyInput.value, 10) || 1) + 1);
    qtyInput.value = v; updateSummary();
  });
  qtyInput.addEventListener('input', updateSummary);

  // File upload
  const fileInput = document.getElementById('cz-logo');
  const fileText = document.getElementById('cz-file-text');
  const fileClear = document.getElementById('cz-file-clear');
  const logoThumb = document.getElementById('cz-logo-thumb');
  const logoThumbName = document.getElementById('cz-logo-thumb-name');
  const logoThumbImg = document.getElementById('cz-logo-thumb-img');
  const logoThumbIcon = document.getElementById('cz-logo-thumb-icon');
  const logoThumbBtn = document.getElementById('cz-logo-thumb-imgbtn');
  const lightbox = document.getElementById('cz-lightbox');
  const lightboxImg = document.getElementById('cz-lightbox-img');
  const lightboxFilename = document.getElementById('cz-lightbox-filename');
  let currentObjectURL = null;

  function setThumbImage(file) {
    if (currentObjectURL) {
      URL.revokeObjectURL(currentObjectURL);
      currentObjectURL = null;
    }
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

  // Lightbox
  logoThumbBtn.addEventListener('click', () => {
    if (!currentObjectURL) return;
    lightboxImg.src = currentObjectURL;
    lightboxFilename.textContent = (fileInput.files && fileInput.files[0]) ? fileInput.files[0].name : '';
    if (typeof lightbox.showModal === 'function') {
      lightbox.showModal();
    } else {
      lightbox.setAttribute('open', '');
    }
  });

  function closeLightbox() {
    if (typeof lightbox.close === 'function' && lightbox.open) lightbox.close();
    else lightbox.removeAttribute('open');
  }

  document.getElementById('cz-lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('cz-lightbox-confirm').addEventListener('click', closeLightbox);
  document.getElementById('cz-lightbox-replace').addEventListener('click', () => {
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
      hideDesignError();
    } else {
      resetFile();
    }
    updateSummary();
  });

  fileClear.addEventListener('click', () => { resetFile(); updateSummary(); });

  function resetFile() {
    fileInput.value = '';
    fileText.textContent = 'Choose file…';
    fileClear.style.display = 'none';
    logoThumb.style.display = 'none';
    logoThumb.classList.remove('cz-logo-thumb--has-image');
    if (currentObjectURL) {
      URL.revokeObjectURL(currentObjectURL);
      currentObjectURL = null;
    }
    logoThumbImg.removeAttribute('src');
    logoThumbBtn.style.display = 'none';
    logoThumbIcon.style.display = 'inline-flex';
  }

  // Other inputs
  ['cz-text', 'cz-notes'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateSummary);
  });
  if (shapeSel) shapeSel.addEventListener('change', updateSummary);
  if (sizeSel) sizeSel.addEventListener('change', updateSummary);
  if (backingGrid) backingGrid.addEventListener('change', updateSummary);

  document.getElementById('cz-text').addEventListener('input', () => {
    if (document.getElementById('cz-text').value.trim()) hideDesignError();
  });

  function hideDesignError() {
    document.getElementById('cz-design-error').style.display = 'none';
  }

  function getSelections() {
    const backingEl = document.querySelector('input[name="backing"]:checked');
    return {
      product: KEYCHAIN_CONFIG.name,
      type: typeValue,
      shape: shapeSel ? shapeSel.value : '',
      size: sizeSel ? sizeSel.value : '',
      backing: backingEl ? backingEl.value : '',
      text: document.getElementById('cz-text').value.trim(),
      logoFilename: fileInput.files && fileInput.files[0] ? fileInput.files[0].name : '',
      qty: Math.max(1, parseInt(qtyInput.value, 10) || 1),
      notes: document.getElementById('cz-notes').value.trim(),
      name: document.getElementById('cz-name').value.trim(),
      email: document.getElementById('cz-email').value.trim(),
      phone: document.getElementById('cz-phone').value.trim()
    };
  }

  function calcUnitPrice(s) {
    const tMult = KEYCHAIN_CONFIG.typeMultiplier[s.type] || 1.0;
    const sMult = KEYCHAIN_CONFIG.sizeMultiplier[s.size] || 1.0;
    return Math.max(3, Math.round(KEYCHAIN_CONFIG.basePrice * tMult * sMult));
  }

  function updateSummary() {
    const s = getSelections();
    const list = document.getElementById('cz-summary-list');
    const rows = [
      ['Material', s.type],
      ['Shape', s.shape],
      ['Size', s.size],
      ['Hardware', s.backing],
      ['Text', s.text || '—'],
      ['Quantity', s.qty]
    ].filter(([, v]) => v !== '' && v != null);
    list.innerHTML = rows.map(([k, v]) => `<li><span class="cz-sum-k">${k}</span><span class="cz-sum-v">${escapeHtml(String(v))}</span></li>`).join('');

    const unit = calcUnitPrice(s);
    const price = unit * s.qty;
    document.getElementById('cz-price').textContent = '$' + price.toLocaleString() + '+';
  }

  // Submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const s = getSelections();

    let firstError = null;
    if (!s.name) firstError = firstError || document.getElementById('cz-name');
    if (!s.email) firstError = firstError || document.getElementById('cz-email');
    if (!s.text && !s.logoFilename) {
      document.getElementById('cz-design-error').style.display = 'block';
      firstError = firstError || document.getElementById('cz-text');
    }

    if (firstError) {
      firstError.focus();
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const summary = formatSummary(s);
    try {
      sessionStorage.setItem('customizer_order', JSON.stringify({
        ...s,
        style: s.product,
        styleId: 'keychains',
        summary: summary,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.warn('sessionStorage unavailable', err);
    }

    if (typeof Cart === 'undefined') {
      // Fallback if cart not loaded — old behavior
      window.location.href = 'contact.html';
      return;
    }

    const customizations = {};
    // Map every field from getSelections() (`s`) into customizations.
    // Iterate `s` keys so we don't drop any customizer-specific fields.
    Object.entries(s).forEach(([k, v]) => {
      if (v === '' || v == null) return;
      // Pretty-print key: camelCase → "Camel Case"
      const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
      customizations[label] = v;
    });

    Cart.addItem({
      productId: 'custom-keychain',
      name: 'Custom Keychain',
      unitPrice: 1000,
      quantity: Number(s.qty || s.quantity) || 1,
      customizations,
      thumbnail: 'images/keychains/keychain-westward-farms.png'
    });

    window.location.href = 'cart.html';
  });

  function formatSummary(s) {
    const lines = [
      `CUSTOM KEYCHAIN REQUEST`,
      ``,
      `Material: ${s.type}`,
      s.shape ? `Shape: ${s.shape}` : null,
      s.size ? `Size: ${s.size}` : null,
      s.backing ? `Hardware: ${s.backing}` : null,
      `Quantity: ${s.qty}`,
      ``,
      `── Design ──`,
      s.text ? `Custom Text: "${s.text}"` : `Custom Text: (none)`,
      s.logoFilename ? `Logo File: ${s.logoFilename} (will be sent separately — see note below)` : `Logo File: (none)`
    ].filter(Boolean);
    if (s.notes) {
      lines.push(``, `── Notes ──`, s.notes);
    }
    if (s.logoFilename) {
      lines.push(``, `── Important ──`, `Please reply to this email with the logo file (${s.logoFilename}) attached so we can build your proof.`);
    }
    return lines.join('\n');
  }

  function submitDirect(s) {
    // Placeholder for Formspree / Basin / Web3Forms upgrade.
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  updateSummary();
})();
