// Mobile drawer
const burger = document.getElementById('burgerBtn');
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('drawerOverlay');
const closeBtn = document.getElementById('drawerClose');
if (burger && drawer && overlay && closeBtn) {
  const openDrawer = () => { drawer.classList.add('open'); overlay.classList.add('open'); };
  const closeDrawer = () => { drawer.classList.remove('open'); overlay.classList.remove('open'); };
  burger.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
}

// Scroll-triggered fade-ins
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// Scroll-to-top button
(function () {
  const btn = document.createElement('button');
  btn.className = 'scroll-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>';
  document.body.appendChild(btn);
  const toggle = () => btn.classList.toggle('visible', window.scrollY > 320);
  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  toggle();
})();

// Subscribe form — posts to jpcustomgear@gmail.com via Web3Forms
document.querySelectorAll('.footer-news-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const form = btn.closest('.footer-news-form');
    const input = form.querySelector('.footer-news-input');
    const email = (input.value || '').trim();
    if (!email) { alert('Please enter your email address.'); return; }
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Subscribing…';
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: 'b6457cd6-33e7-4d8f-9a91-68f30e66fd15',
        subject: 'New Newsletter Subscriber',
        from_name: 'JP Custom Gear Website',
        email: email,
        source: 'Footer subscribe — ' + location.pathname
      })
    })
    .then(async r => {
      const text = await r.text();
      let data;
      try { data = JSON.parse(text); }
      catch (e) { throw new Error('Non-JSON response: ' + text.slice(0, 200)); }
      if (!r.ok || !data.success) throw new Error(data.message || ('HTTP ' + r.status));
      return data;
    })
    .then(() => {
      input.value = '';
      btn.textContent = 'Subscribed ✓';
      setTimeout(() => { btn.disabled = false; btn.textContent = orig; }, 2500);
    })
    .catch((err) => {
      console.error('Web3Forms error:', err);
      btn.disabled = false;
      btn.textContent = orig;
      alert('Sorry — there was a problem. Please try again or email jpcustomgear@gmail.com.');
    });
  });
});
