// Richardson color chart: a "View Richardson Color Chart" button that opens the
// chart in a lightbox. The image is only fetched when the dialog is first opened.
(function () {
  var CHART_SRC = 'images/hats/chart/richardson-color-chart.webp';
  var CHART_ALT = 'Richardson hat color chart: 112, 168, 112PFP and 168P colors';
  var dialog = null;
  var lastTrigger = null;

  // A product (or hat style config) counts as Richardson when its name,
  // description, features or body style options mention the brand.
  function isRichardson(item) {
    if (!item) return false;
    var parts = [item.name, item.description];
    if (Array.isArray(item.features)) parts = parts.concat(item.features);
    if (item.subOptions && Array.isArray(item.subOptions.values)) parts = parts.concat(item.subOptions.values);
    return /richardson/i.test(parts.filter(Boolean).join(' '));
  }

  // The chart only covers these Richardson models, so it shows only for hats built on one.
  var CHART_MODELS = ['112', '168', '112PFP', '168P'];

  // True when a model code ("112", "168P"), or a label containing one ("Richardson 168",
  // "Structured (Standard 112)"), is a model on the chart. 256, 112P and 112FP are not.
  function fitsChart(value) {
    var codes = String(value || '').toUpperCase().match(/\b\d{3}[A-Z]*\b/g) || [];
    return codes.some(function (c) { return CHART_MODELS.indexOf(c) !== -1; });
  }

  function unmount(container) {
    if (!container) return;
    container.innerHTML = '';
    container.hidden = true;
  }

  function build() {
    dialog = document.createElement('dialog');
    dialog.className = 'rcc-dialog';
    dialog.setAttribute('aria-label', 'Richardson color chart');
    dialog.innerHTML =
      '<button type="button" class="rcc-close" aria-label="Close color chart">✕</button>' +
      '<div class="rcc-scroll"><img class="rcc-img" alt="" /></div>';
    document.body.appendChild(dialog);

    var close = function () {
      if (typeof dialog.close === 'function' && dialog.open) dialog.close();
      else dialog.removeAttribute('open');
    };
    dialog.querySelector('.rcc-close').addEventListener('click', close);
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) close();
    });
    dialog.addEventListener('close', function () {
      document.body.style.overflow = '';
      if (lastTrigger) lastTrigger.focus();
    });
  }

  function open(trigger) {
    if (!dialog) build();
    lastTrigger = trigger;
    var img = dialog.querySelector('.rcc-img');
    if (!img.getAttribute('src')) {
      img.alt = CHART_ALT;
      img.src = CHART_SRC;
    }
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    dialog.querySelector('.rcc-close').focus();
  }

  // Fill a container element with the trigger button.
  function mount(container) {
    if (!container || container.querySelector('.rcc-btn')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rcc-btn';
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.innerHTML =
      '<svg class="rcc-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>' +
      '<rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>' +
      '<span>View Richardson Color Chart</span>';
    btn.addEventListener('click', function () { open(btn); });
    container.appendChild(btn);
    container.hidden = false;
  }

  window.RichardsonChart = { isRichardson: isRichardson, fitsChart: fitsChart, mount: mount, unmount: unmount };
})();
