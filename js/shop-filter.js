(function () {
  const filterEl = document.querySelector('.shop-filter');
  const grid = document.getElementById('productGrid');
  const productChips = document.querySelector('.shop-filter-chips');
  const hatChips = document.querySelector('.shop-subfilter-chips');
  const countEl = document.getElementById('shopFilterCount');

  if (!filterEl || !grid || !productChips || !hatChips || !countEl) return;

  const cards = Array.from(grid.querySelectorAll('.product-card'));
  const totalCount = cards.length;

  let productFilter = 'all';
  let hatFilter = 'all';

  function setActiveChip(container, attr, value) {
    container.querySelectorAll('.shop-filter-chip').forEach(chip => {
      chip.classList.toggle('is-active', chip.getAttribute(attr) === value);
    });
  }

  function apply() {
    if (productFilter === 'all') {
      grid.removeAttribute('data-product-filter');
      filterEl.removeAttribute('data-product-active');
    } else {
      grid.setAttribute('data-product-filter', productFilter);
      filterEl.setAttribute('data-product-active', productFilter);
    }

    if (productFilter === 'hat' && hatFilter !== 'all') {
      grid.setAttribute('data-active-filter', hatFilter);
    } else {
      grid.removeAttribute('data-active-filter');
    }

    let visible = totalCount;
    if (productFilter !== 'all') {
      visible = cards.filter(c => c.getAttribute('data-product-type') === productFilter).length;
      if (productFilter === 'hat' && hatFilter !== 'all') {
        visible = cards.filter(c => {
          if (c.getAttribute('data-product-type') !== 'hat') return false;
          const types = (c.getAttribute('data-hat-type') || '').split(/\s+/);
          return types.includes(hatFilter);
        }).length;
      }
    }
    countEl.textContent = `Showing ${visible} products`;
  }

  productChips.addEventListener('click', function (e) {
    const chip = e.target.closest('.shop-filter-chip');
    if (!chip) return;
    productFilter = chip.getAttribute('data-product');
    hatFilter = 'all';
    setActiveChip(productChips, 'data-product', productFilter);
    setActiveChip(hatChips, 'data-hat', 'all');
    apply();
  });

  hatChips.addEventListener('click', function (e) {
    const chip = e.target.closest('.shop-filter-chip');
    if (!chip) return;
    hatFilter = chip.getAttribute('data-hat');
    setActiveChip(hatChips, 'data-hat', hatFilter);
    apply();
  });
})();
