(function () {
  // Pricing mirrors js/custom-pricing.js ('custom-hoodie'), which is the checkout authority.
  const HOODIE_CONFIG = {
    name: "Custom Independent Trading Co. Camo Hoodie",
    // Pattern labels are sent as the "Pattern" cart field and read by api/_lib/build-line-items.js.
    patterns: {
      duck: {
        label: "Duck Camo",
        title: "Custom Independent Trading Co. Duck Camo Hoodie",
        image: "images/camo-reserve/hoodies/duck-camo-hoodie.webp",
        hero: "Stand out with our Independent Trading Co. Duck Camo Hoodie! Featuring a rugged duck camo pattern, this hoodie delivers the perfect combination of comfort, style, and outdoor attitude.",
        about: "Whether you're headed to hunting camp, spending the weekend outdoors, or just looking for a standout everyday hoodie, this one has you covered!",
        feature: "Bold duck camo pattern"
      },
      washed: {
        label: "Washed Camo",
        title: "Custom Independent Trading Co. Washed Camo Hoodie",
        image: "images/camo-reserve/hoodies/washed-camo-hoodie.webp",
        hero: "Stand out with our Independent Trading Co. Washed Camo Hoodie! Featuring a rugged, vintage-inspired washed camo pattern, this hoodie delivers the perfect combination of comfort, style, and outdoor attitude.",
        about: "Whether you're headed to hunting camp, spending the weekend outdoors, or just looking for a comfortable everyday hoodie, this one has you covered!",
        feature: "Distinctive washed camo pattern"
      },
      desert: {
        label: "Desert Duck Camo",
        title: "Custom Independent Trading Co. Desert Duck Camo Hoodie",
        image: "images/camo-reserve/hoodies/desert-duck-camo-hoodie.webp",
        hero: "Stand out with our Independent Trading Co. Desert Duck Camo Hoodie! Featuring a rugged desert-inspired duck camo pattern in shades of tan, brown, and beige, this hoodie delivers the perfect combination of comfort, style, and outdoor attitude.",
        about: "Whether you're headed to hunting camp, spending the weekend outdoors, or just looking for a standout everyday hoodie, this one has you covered!",
        feature: "Bold desert duck camo pattern"
      }
    },
    sizes: ["S", "M", "L", "XL", "2XL"],
    placements: ["Front", "Back", "Front + Back"],
    blankPriceCents: 4000,   // $40.00
    customPriceCents: 4500   // $45.00 (all placements)
  };

  const form = document.getElementById('czForm');

  // Camo pattern: preselect from ?style=duck|washed|desert, swap photo and copy on change
  const patternGrid = document.getElementById('cz-pattern-grid');
  const patternKeys = Object.keys(HOODIE_CONFIG.patterns);
  let startKey = 'duck';
  try {
    const q = new URLSearchParams(window.location.search).get('style');
    if (q && HOODIE_CONFIG.patterns[q]) startKey = q;
  } catch (err) { /* keep default */ }

  patternKeys.forEach((k, i) => {
    const wrap = document.createElement('label');
    wrap.className = 'cz-radio';
    wrap.innerHTML = `
      <input type="radio" name="pattern" id="cz-pattern-${k}" value="${k}" ${k === startKey ? 'checked' : ''} />
      <span class="cz-radio-box">
        <span class="cz-radio-dot"></span>
        <span class="cz-radio-text">${HOODIE_CONFIG.patterns[k].label}</span>
      </span>
    `;
    patternGrid.appendChild(wrap);
  });

  function currentPattern() {
    const el = document.querySelector('input[name="pattern"]:checked');
    return HOODIE_CONFIG.patterns[el ? el.value : startKey];
  }

  function applyPattern() {
    const p = currentPattern();
    document.title = `Customize Your ${p.label} Hoodie | JP Custom Gear`;
    document.getElementById('cz-crumb').textContent = p.label + ' Hoodie';
    document.getElementById('cz-hero-desc').textContent = p.hero;
    document.getElementById('cz-about-desc').textContent = p.about;
    document.getElementById('cz-feat-pattern').textContent = p.feature;
    const img = document.getElementById('cz-preview-img');
    img.src = p.image;
    img.alt = p.title;
  }
  patternGrid.addEventListener('change', () => { applyPattern(); updateSummary(); });

  // Populate Size dropdown (required, starts unselected)
  const sizeSel = document.getElementById('cz-size');
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select a size';
  placeholder.selected = true;
  sizeSel.appendChild(placeholder);
  HOODIE_CONFIG.sizes.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    sizeSel.appendChild(opt);
  });

  // Populate Placement radios
  const backingGrid = document.getElementById('cz-backing-grid');
  HOODIE_CONFIG.placements.forEach((b, i) => {
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

  // Blank toggle: hides placement + design fields and drops the price to the blank rate
  const blankBox = document.getElementById('cz-blank');
  const placementSection = document.getElementById('cz-placement-section');
  const designSection = document.getElementById('cz-design-section');

  function applyBlankState() {
    const blank = blankBox.checked;
    placementSection.hidden = blank;
    designSection.hidden = blank;
    if (blank) hideDesignError();
  }

  // Quantity
  const qtyInput = document.getElementById('cz-qty');
  document.getElementById('cz-qty-minus').addEventListener('click', () => {
    const v = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
    qtyInput.value = v; updateSummary();
  });
  document.getElementById('cz-qty-plus').addEventListener('click', () => {
    const v = Math.min(99, (parseInt(qtyInput.value, 10) || 1) + 1);
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

  // Uploads the chosen logo to Vercel Blob (js/logo-upload.js) and tracks its status.
  const logoUpload = LogoUpload.attach({ input: fileInput, submitButton: document.getElementById('cz-submit') });

  function setThumbImage(file) {
    if (currentObjectURL) {
      URL.revokeObjectURL(currentObjectURL);
      currentObjectURL = null;
    }
    const isImage = /^image\//.test(file.type) || /\.(png|jpe?g)$/i.test(file.name);
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
    logoUpload.reset();
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
  document.getElementById('cz-text').addEventListener('input', updateSummary);
  sizeSel.addEventListener('change', () => { hideSizeError(); updateSummary(); });
  backingGrid.addEventListener('change', updateSummary);
  blankBox.addEventListener('change', () => { applyBlankState(); updateSummary(); });

  document.getElementById('cz-text').addEventListener('input', () => {
    if (document.getElementById('cz-text').value.trim()) hideDesignError();
  });

  function hideDesignError() {
    document.getElementById('cz-design-error').style.display = 'none';
  }

  function hideSizeError() {
    document.getElementById('cz-size-error').style.display = 'none';
  }

  function getSelections() {
    const blank = blankBox.checked;
    const backingEl = document.querySelector('input[name="backing"]:checked');
    return {
      product: currentPattern().title,
      pattern: currentPattern().label,
      thumbnail: currentPattern().image,
      size: sizeSel.value,
      blank: blank,
      placement: blank ? '' : (backingEl ? backingEl.value : ''),
      text: blank ? '' : document.getElementById('cz-text').value.trim(),
      logoFilename: !blank && fileInput.files && fileInput.files[0] ? fileInput.files[0].name : '',
      qty: Math.max(1, Math.min(99, parseInt(qtyInput.value, 10) || 1)),
      notes: document.getElementById('cz-notes').value.trim()
    };
  }

  function calcUnitPrice(s) {
    const cents = s.blank ? HOODIE_CONFIG.blankPriceCents : HOODIE_CONFIG.customPriceCents;
    return cents / 100; // dollars
  }

  function updateSummary() {
    const s = getSelections();
    const list = document.getElementById('cz-summary-list');
    const rows = [
      ['Pattern', s.pattern],
      ['Size', s.size || '—'],
      ['Type', s.blank ? 'Blank' : 'Customized']
    ];
    if (!s.blank) {
      rows.push(['Placement', s.placement], ['Text', s.text || '—']);
    }
    rows.push(['Quantity', s.qty]);
    list.innerHTML = rows.map(([k, v]) => `<li><span class="cz-sum-k">${k}</span><span class="cz-sum-v">${escapeHtml(String(v))}</span></li>`).join('');

    const price = calcUnitPrice(s) * s.qty;
    const priceStr = Number.isInteger(price) ? price.toLocaleString() : price.toFixed(2);
    document.getElementById('cz-price').textContent = '$' + priceStr;
  }

  // Submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const s = getSelections();

    // Hold the order while a logo is uploading or if its upload failed.
    const logoBlock = logoUpload.blockReason();
    if (logoBlock) {
      fileInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    let firstError = null;
    if (!s.size) {
      document.getElementById('cz-size-error').style.display = 'block';
      firstError = firstError || sizeSel;
    }
    if (!s.blank && !s.text && !s.logoFilename) {
      document.getElementById('cz-design-error').style.display = 'block';
      firstError = firstError || document.getElementById('cz-text');
    }

    if (firstError) {
      firstError.focus();
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (typeof Cart === 'undefined') {
      // Fallback if cart not loaded
      window.location.href = 'contact.html';
      return;
    }

    // Keys are the Title-cased labels the checkout/webhook read back.
    // "Blank" = "Yes" drives the $40 price in js/custom-pricing.js; omitted when customized.
    const customizations = { 'Pattern': s.pattern, 'Size': s.size };
    if (s.blank) {
      customizations['Blank'] = 'Yes';
    } else {
      customizations['Placement'] = s.placement;
      if (s.text) customizations['Text'] = s.text;
      if (s.logoFilename) customizations['Logo Filename'] = s.logoFilename;
      if (logoUpload.getUrl()) customizations['Logo URL'] = logoUpload.getUrl();
    }
    if (s.notes) customizations['Notes'] = s.notes;

    Cart.addItem({
      productId: 'custom-hoodie',
      name: s.product,
      unitPrice: Math.round(calcUnitPrice(s) * 100), // exact price for this config; checkout recomputes (js/custom-pricing.js)
      quantity: s.qty,
      customizations,
      thumbnail: s.thumbnail
    });

    window.location.href = 'cart.html';
  });

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  applyPattern();
  applyBlankState();
  updateSummary();
})();
