(function () {
  'use strict';

  const SELECTOR = 'select.form-select, select.pdp-select';
  let uid = 0;

  function enhance(selectEl) {
    if (selectEl.dataset.csEnhanced === 'true') return;
    selectEl.dataset.csEnhanced = 'true';

    const wrap = document.createElement('div');
    wrap.className = 'cs';
    if (selectEl.classList.contains('pdp-select')) wrap.classList.add('cs--pdp');
    if (isDarkContext(selectEl)) wrap.classList.add('cs--dark');

    selectEl.parentNode.insertBefore(wrap, selectEl);
    wrap.appendChild(selectEl);

    const listId = 'cs-list-' + (++uid);

    const list = document.createElement('ul');
    list.className = 'cs-list';
    list.id = listId;
    list.setAttribute('role', 'listbox');
    list.hidden = true;
    wrap.appendChild(list);

    selectEl.setAttribute('aria-expanded', 'false');
    selectEl.setAttribute('aria-controls', listId);

    let activeIndex = -1;
    let isOpen = false;
    let typeahead = '';
    let typeaheadTimer = null;
    let renderScheduled = false;
    let suppressBlurClose = false;

    function renderOptions() {
      list.innerHTML = '';
      const options = selectEl.options;
      for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        const li = document.createElement('li');
        li.className = 'cs-option';
        li.setAttribute('role', 'option');
        li.dataset.index = String(i);
        li.id = listId + '-opt-' + i;
        li.textContent = opt.textContent;
        if (opt.disabled) li.setAttribute('aria-disabled', 'true');
        if (i === selectEl.selectedIndex) li.setAttribute('aria-selected', 'true');
        list.appendChild(li);
      }
    }

    function scheduleRender() {
      if (renderScheduled) return;
      renderScheduled = true;
      queueMicrotask(() => {
        renderScheduled = false;
        renderOptions();
      });
    }

    function syncSelected() {
      const items = list.children;
      for (let i = 0; i < items.length; i++) {
        if (i === selectEl.selectedIndex) items[i].setAttribute('aria-selected', 'true');
        else items[i].removeAttribute('aria-selected');
      }
    }

    function updateActive() {
      const items = list.children;
      for (let i = 0; i < items.length; i++) {
        if (i === activeIndex) {
          items[i].classList.add('is-active');
          selectEl.setAttribute('aria-activedescendant', items[i].id);
          const liRect = items[i].getBoundingClientRect();
          const listRect = list.getBoundingClientRect();
          if (liRect.top < listRect.top || liRect.bottom > listRect.bottom) {
            items[i].scrollIntoView({ block: 'nearest' });
          }
        } else {
          items[i].classList.remove('is-active');
        }
      }
    }

    function open() {
      if (isOpen || selectEl.disabled || selectEl.options.length === 0) return;
      isOpen = true;
      list.hidden = false;
      selectEl.setAttribute('aria-expanded', 'true');
      wrap.classList.add('is-open');
      const rect = wrap.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const listMax = 240;
      if (spaceBelow < listMax + 12 && rect.top > spaceBelow) {
        wrap.classList.add('cs-up');
      } else {
        wrap.classList.remove('cs-up');
      }
      activeIndex = selectEl.selectedIndex >= 0 ? selectEl.selectedIndex : 0;
      updateActive();
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      list.hidden = true;
      selectEl.setAttribute('aria-expanded', 'false');
      selectEl.removeAttribute('aria-activedescendant');
      wrap.classList.remove('is-open');
    }

    function selectIndex(i) {
      if (i < 0 || i >= selectEl.options.length) return;
      if (selectEl.options[i].disabled) return;
      const changed = selectEl.selectedIndex !== i;
      selectEl.selectedIndex = i;
      syncSelected();
      if (changed) selectEl.dispatchEvent(new Event('change', { bubbles: true }));
      close();
    }

    // Intercept native dropdown on pointer
    selectEl.addEventListener('mousedown', (e) => {
      e.preventDefault();
      selectEl.focus();
      isOpen ? close() : open();
    });

    // Keyboard handling on the native select itself (tabbable in every browser)
    selectEl.addEventListener('keydown', (e) => {
      const max = selectEl.options.length - 1;
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          e.preventDefault();
          if (!isOpen) { open(); return; }
          if (e.key === 'ArrowDown') activeIndex = Math.min(max, activeIndex + 1);
          else activeIndex = Math.max(0, activeIndex - 1);
          updateActive();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (!isOpen) { open(); return; }
          selectIndex(activeIndex);
          break;
        case 'Escape':
          if (isOpen) { e.preventDefault(); close(); }
          break;
        case 'Home':
          if (isOpen) { e.preventDefault(); activeIndex = 0; updateActive(); }
          break;
        case 'End':
          if (isOpen) { e.preventDefault(); activeIndex = max; updateActive(); }
          break;
        case 'Tab':
          if (isOpen) close();
          break;
        default:
          if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            typeahead += e.key.toLowerCase();
            clearTimeout(typeaheadTimer);
            typeaheadTimer = setTimeout(() => { typeahead = ''; }, 500);
            const opts = selectEl.options;
            let found = -1;
            for (let i = 0; i < opts.length; i++) {
              if (opts[i].textContent.toLowerCase().startsWith(typeahead)) { found = i; break; }
            }
            if (found >= 0) {
              if (isOpen) { activeIndex = found; updateActive(); }
              else { selectIndex(found); }
            }
          }
      }
    });

    // Prevent the native select from losing focus when clicking inside our list
    list.addEventListener('mousedown', (e) => {
      e.preventDefault();
      suppressBlurClose = true;
    });

    list.addEventListener('click', (e) => {
      const li = e.target.closest('.cs-option');
      suppressBlurClose = false;
      if (!li) { selectEl.focus(); return; }
      selectIndex(parseInt(li.dataset.index, 10));
      selectEl.focus();
    });

    list.addEventListener('mousemove', (e) => {
      const li = e.target.closest('.cs-option');
      if (!li) return;
      const i = parseInt(li.dataset.index, 10);
      if (i !== activeIndex) { activeIndex = i; updateActive(); }
    });

    selectEl.addEventListener('blur', () => {
      if (suppressBlurClose) { suppressBlurClose = false; return; }
      close();
    });

    document.addEventListener('mousedown', (e) => {
      if (!wrap.contains(e.target)) close();
    });

    selectEl.addEventListener('change', syncSelected);

    const optObserver = new MutationObserver(scheduleRender);
    optObserver.observe(selectEl, { childList: true, subtree: true, characterData: true });

    renderOptions();
  }

  function isDarkContext(selectEl) {
    let el = selectEl.parentElement;
    while (el && el !== document.body) {
      const cls = el.classList;
      if (cls.contains('contact-form') ||
          cls.contains('footer-news') ||
          cls.contains('newsletter') ||
          cls.contains('bulk-form') ||
          cls.contains('onduty')) {
        return true;
      }
      el = el.parentElement;
    }
    const bg = getComputedStyle(selectEl).backgroundColor;
    const m = bg.match(/\d+(\.\d+)?/g);
    if (m && m.length >= 3) {
      const r = parseFloat(m[0]), g = parseFloat(m[1]), b = parseFloat(m[2]);
      const a = m.length >= 4 ? parseFloat(m[3]) : 1;
      if (a > 0.1) {
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        if (luma < 128) return true;
      }
    }
    return false;
  }

  function enhanceAll(root) {
    (root || document).querySelectorAll(SELECTOR).forEach(enhance);
  }

  function init() {
    enhanceAll();
    const docObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (n.matches && n.matches(SELECTOR)) enhance(n);
          if (n.querySelectorAll) n.querySelectorAll(SELECTOR).forEach(enhance);
        });
      }
    });
    docObserver.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.CustomSelect = { enhance, enhanceAll };
})();
