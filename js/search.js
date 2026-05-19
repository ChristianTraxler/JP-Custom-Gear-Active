// Product search — dropdown + submit to shop.html?q=
(function () {
  if (typeof PRODUCTS === 'undefined') return;

  const INDEX = Object.entries(PRODUCTS).map(([slug, p]) => ({
    slug,
    name: p.name,
    tag: p.tag,
    tagLower: p.tag.toLowerCase(),
    price: p.price,
    image: p.image,
    category: p.category,
    haystack: [p.name, p.tag, p.category, p.description, (p.features || []).join(' ')]
      .join(' ')
      .toLowerCase()
  }));

  const TAG_SET = new Set(INDEX.map(i => i.tagLower));

  function search(query, limit) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const rawTerms = q.split(/\s+/).filter(Boolean);

    const tagTerms = new Set();
    const textTerms = [];
    for (const t of rawTerms) {
      const singular = t.length > 2 && t.endsWith('s') ? t.slice(0, -1) : t;
      if (TAG_SET.has(t)) tagTerms.add(t);
      else if (TAG_SET.has(singular)) tagTerms.add(singular);
      else textTerms.push(t);
    }

    const scored = [];
    for (const item of INDEX) {
      if (tagTerms.size > 0 && !tagTerms.has(item.tagLower)) continue;

      let score = tagTerms.size * 3;
      let allMatch = true;
      for (const t of textTerms) {
        if (!item.haystack.includes(t)) { allMatch = false; break; }
        if (item.name.toLowerCase().includes(t)) score += 3;
        if (item.category.toLowerCase().includes(t)) score += 2;
        score += 1;
      }
      if (allMatch) scored.push({ item, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit || 6).map(s => s.item);
  }

  function initSearch(form) {
    if (!form || form.dataset.searchReady === '1') return;
    form.dataset.searchReady = '1';

    const input = form.querySelector('input[name="q"]');
    const dropdown = form.querySelector('.nav-search-dropdown');
    if (!input || !dropdown) return;

    let activeIndex = -1;
    let currentResults = [];
    let debounceId = null;

    function closeDropdown() {
      dropdown.hidden = true;
      dropdown.innerHTML = '';
      activeIndex = -1;
      currentResults = [];
    }

    function renderResults(results, q) {
      if (!results.length) {
        dropdown.innerHTML =
          '<div class="nav-search-empty">No matches for "' + escapeHtml(q) + '"</div>' +
          '<button type="submit" class="nav-search-all">Search all products →</button>';
        dropdown.hidden = false;
        return;
      }
      const rows = results.map((r, i) =>
        '<a class="nav-search-row" href="product.html?id=' + encodeURIComponent(r.slug) + '" data-i="' + i + '">' +
          '<img class="nav-search-thumb" src="' + escapeAttr(r.image) + '" alt="" loading="lazy" />' +
          '<div class="nav-search-meta">' +
            '<div class="nav-search-name">' + escapeHtml(r.name) + '</div>' +
            '<div class="nav-search-sub"><span>' + escapeHtml(r.tag) + '</span> · <span>' + escapeHtml(r.category) + '</span></div>' +
          '</div>' +
          '<div class="nav-search-price">$' + r.price + '</div>' +
        '</a>'
      ).join('');
      dropdown.innerHTML = rows +
        '<button type="submit" class="nav-search-all">See all results for "' + escapeHtml(q) + '" →</button>';
      dropdown.hidden = false;
    }

    function updateActive() {
      const rows = dropdown.querySelectorAll('.nav-search-row');
      rows.forEach((row, i) => row.classList.toggle('active', i === activeIndex));
      const active = rows[activeIndex];
      if (active) active.scrollIntoView({ block: 'nearest' });
    }

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }
    function escapeAttr(s) { return escapeHtml(s); }

    input.addEventListener('input', () => {
      clearTimeout(debounceId);
      const q = input.value;
      if (!q.trim()) { closeDropdown(); return; }
      debounceId = setTimeout(() => {
        currentResults = search(q, 6);
        activeIndex = -1;
        renderResults(currentResults, q.trim());
      }, 120);
    });

    input.addEventListener('focus', () => {
      if (input.value.trim()) {
        currentResults = search(input.value, 6);
        renderResults(currentResults, input.value.trim());
      }
    });

    input.addEventListener('keydown', (e) => {
      const rows = dropdown.querySelectorAll('.nav-search-row');
      if (e.key === 'ArrowDown') {
        if (!rows.length) return;
        e.preventDefault();
        activeIndex = (activeIndex + 1) % rows.length;
        updateActive();
      } else if (e.key === 'ArrowUp') {
        if (!rows.length) return;
        e.preventDefault();
        activeIndex = activeIndex <= 0 ? rows.length - 1 : activeIndex - 1;
        updateActive();
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && rows[activeIndex]) {
          e.preventDefault();
          window.location.href = rows[activeIndex].getAttribute('href');
        }
      } else if (e.key === 'Escape') {
        closeDropdown();
        input.blur();
      }
    });

    document.addEventListener('click', (e) => {
      if (!form.contains(e.target)) closeDropdown();
    });
  }

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(() => {
    document.querySelectorAll('.nav-search').forEach(initSearch);
    applyShopFilter();
  });

  // Shop page: filter product cards by ?q=
  function applyShopFilter() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;
    const params = new URLSearchParams(window.location.search);
    const q = (params.get('q') || '').trim();
    if (!q) return;

    const matchingSlugs = new Set(search(q, 999).map(r => r.slug));
    const cards = grid.querySelectorAll('.product-card');
    let visible = 0;
    cards.forEach(card => {
      const href = card.getAttribute('href') || '';
      const m = href.match(/[?&]id=([^&]+)/);
      const slug = m ? decodeURIComponent(m[1]) : '';
      if (matchingSlugs.has(slug)) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    const banner = document.createElement('div');
    banner.className = 'search-results-banner';
    if (visible === 0) {
      banner.innerHTML =
        '<div><strong>No products found</strong> for "' +
        escapeText(q) + '". Try a different search or <a href="shop.html">view all products</a>.</div>';
    } else {
      banner.innerHTML =
        '<div>Showing <strong>' + visible + '</strong> result' + (visible === 1 ? '' : 's') +
        ' for "<em>' + escapeText(q) + '</em>" · <a href="shop.html">clear search</a></div>';
    }
    grid.parentNode.insertBefore(banner, grid);
  }

  function escapeText(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }
})();
