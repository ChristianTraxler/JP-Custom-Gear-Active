(function () {
  const FORM_ENDPOINT = null;

  const params = new URLSearchParams(window.location.search);
  const styleId = params.get('style');
  const config = (window.HAT_STYLES || {})[styleId];

  const form = document.getElementById('czForm');
  const notFound = document.getElementById('cz-not-found');

  if (!config) {
    notFound.style.display = 'block';
    Array.from(form.querySelectorAll('.cz-section, .cz-submit, .cz-fineprint')).forEach(el => el.style.display = 'none');
    document.getElementById('cz-hero-style').textContent = 'Hat';
    document.getElementById('cz-breadcrumb-style').textContent = 'Customize';
    return;
  }

  document.title = `Customize ${config.name} | JP Custom Gear`;
  document.getElementById('cz-hero-style').textContent = config.name.replace(/ Hat$/, '') + ' Hat';
  document.getElementById('cz-breadcrumb-style').textContent = config.name;
  document.getElementById('cz-suboption-label').textContent = config.subOptions.label;

  const previewImg = document.getElementById('cz-preview-img');
  previewImg.alt = config.name;

  function imageForSubOption(value) {
    return (config.subOptionImages && config.subOptionImages[value]) || config.image;
  }
  previewImg.src = imageForSubOption(config.subOptions.values[0]);

  document.getElementById('cz-summary-name').textContent = config.name;
  document.getElementById('cz-summary-tagline').textContent = config.tagline;

  // Populate color dropdown
  const colorSel = document.getElementById('cz-color');
  function colorsForSubOption(value) {
    return (config.subOptionColors && config.subOptionColors[value]) || config.colors;
  }
  function populateColors(colors) {
    const previous = colorSel.value;
    colorSel.innerHTML = '';
    colors.forEach((c, i) => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      if (c === previous || (!colors.includes(previous) && i === 0)) opt.selected = true;
      colorSel.appendChild(opt);
    });
  }
  populateColors(colorsForSubOption(config.subOptions.values[0]));

  // Populate sub-option dropdown
  const subSel = document.getElementById('cz-suboption');
  config.subOptions.values.forEach((v, i) => {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = v;
    if (i === 0) opt.selected = true;
    subSel.appendChild(opt);
  });

  // Populate patch type radios
  const patchGrid = document.getElementById('cz-patch-grid');
  config.patchTypes.forEach((p, i) => {
    const id = 'cz-patch-' + i;
    const wrap = document.createElement('label');
    wrap.className = 'cz-radio';
    wrap.innerHTML = `
      <input type="radio" name="patch" id="${id}" value="${p}" ${i === 0 ? 'checked' : ''} />
      <span class="cz-radio-box">
        <span class="cz-radio-dot"></span>
        <span class="cz-radio-text">${p}</span>
      </span>
    `;
    patchGrid.appendChild(wrap);
  });

  // Color swatch
  const swatch = document.getElementById('cz-swatch');
  function updateSwatch() {
    swatch.style.background = window.getSwatchColor(colorSel.value);
  }
  colorSel.addEventListener('change', () => { updateSwatch(); updateSummary(); });
  updateSwatch();

  // Quantity
  const qtyInput = document.getElementById('cz-qty');
  document.getElementById('cz-qty-minus').addEventListener('click', () => {
    const v = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
    qtyInput.value = v; updateSummary();
  });
  document.getElementById('cz-qty-plus').addEventListener('click', () => {
    const v = Math.min(999, (parseInt(qtyInput.value, 10) || 1) + 1);
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

  // Close when clicking the backdrop (click event lands on dialog itself, not its inner content)
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
  subSel.addEventListener('change', () => {
    previewImg.src = imageForSubOption(subSel.value);
    populateColors(colorsForSubOption(subSel.value));
    updateSwatch();
    updateSummary();
  });
  patchGrid.addEventListener('change', updateSummary);

  document.getElementById('cz-text').addEventListener('input', () => {
    if (document.getElementById('cz-text').value.trim()) hideDesignError();
  });

  function hideDesignError() {
    document.getElementById('cz-design-error').style.display = 'none';
  }

  function getSelections() {
    const patchEl = document.querySelector('input[name="patch"]:checked');
    return {
      style: config.name,
      styleId: styleId,
      color: colorSel.value,
      suboptionLabel: config.subOptions.label,
      suboption: subSel.value,
      patch: patchEl ? patchEl.value : '',
      text: document.getElementById('cz-text').value.trim(),
      logoFilename: fileInput.files && fileInput.files[0] ? fileInput.files[0].name : '',
      qty: Math.max(1, parseInt(qtyInput.value, 10) || 1),
      notes: document.getElementById('cz-notes').value.trim(),
      name: document.getElementById('cz-name').value.trim(),
      email: document.getElementById('cz-email').value.trim(),
      phone: document.getElementById('cz-phone').value.trim(),
      basePrice: config.basePrice
    };
  }

  function updateSummary() {
    const s = getSelections();
    const list = document.getElementById('cz-summary-list');
    const rows = [
      ['Color', s.color],
      [s.suboptionLabel, s.suboption],
      ['Patch', s.patch],
      ['Text', s.text || '—'],
      ['Quantity', s.qty]
    ];
    list.innerHTML = rows.map(([k, v]) => `<li><span class="cz-sum-k">${k}</span><span class="cz-sum-v">${escapeHtml(String(v))}</span></li>`).join('');

    document.getElementById('cz-price').textContent = '$25+';

    const note = document.getElementById('cz-preview-color-note');
    note.textContent = `Photo shown for reference. Your hat will be made in ${s.color}.`;
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

    try {
      sessionStorage.setItem('customizer_order', JSON.stringify({
        ...s,
        summary: formatSummary(s),
        timestamp: Date.now()
      }));
    } catch (err) {
      console.warn('sessionStorage unavailable', err);
    }

    if (typeof Cart === 'undefined') {
      // Fallback if cart not loaded — old behavior
      const q = new URLSearchParams({ source: 'customizer', product: s.style, color: s.color, qty: String(s.qty) });
      window.location.href = 'contact.html?' + q.toString();
      return;
    }

    const customizations = {
      Style: s.style,
      Color: s.color
    };
    if (s.suboptionLabel && s.suboption) customizations[s.suboptionLabel] = s.suboption;
    if (s.patch) customizations.Patch = s.patch;
    if (s.text) customizations['Custom Text'] = s.text;
    if (s.logoFilename) customizations['Logo File'] = s.logoFilename + ' (customer will email file)';
    if (s.notes) customizations.Notes = s.notes;
    if (s.name) customizations['Customer Name'] = s.name;
    if (s.email) customizations['Customer Email'] = s.email;

    Cart.addItem({
      productId: 'custom-hat',
      name: 'Custom Hat — ' + s.style,
      unitPrice: 2500, // base $25 — matches the customizer's current "$25+" display
      quantity: Number(s.qty) || 1,
      customizations,
      thumbnail: 'images/hats/salt-water-camo.png'
    });

    window.location.href = 'cart.html';
  });

  function formatSummary(s) {
    const lines = [
      `CUSTOM ${s.style.toUpperCase()} REQUEST`,
      ``,
      `Style: ${s.style}`,
      `Color: ${s.color}`,
      `${s.suboptionLabel}: ${s.suboption}`,
      `Patch Type: ${s.patch}`,
      `Quantity: ${s.qty}`,
      ``,
      `── Design ──`,
      s.text ? `Custom Text: "${s.text}"` : `Custom Text: (none)`,
      s.logoFilename ? `Logo File: ${s.logoFilename} (will be sent separately — see note below)` : `Logo File: (none)`
    ];
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
    // Build FormData with the file and POST to FORM_ENDPOINT, then show inline success.
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  updateSummary();
})();
