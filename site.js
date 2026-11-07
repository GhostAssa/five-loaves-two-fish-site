// Shared page behaviour: navigation, footer, home page, menu tabs, reviews.
// Cart logic lives in cart.js; dish availability in availability.js.

const WHATSAPP_NUMBER = '2348030735623';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Mobile navigation ─────────────────────── */
function setMobileNav(open) {
  const panel = document.getElementById('mobileNavPanel');
  const overlay = document.getElementById('mobileNavOverlay');
  const toggle = document.querySelector('.nav-toggle');
  if (!panel || !overlay) return;
  panel.classList.toggle('open', open);
  overlay.classList.toggle('open', open);
  document.body.classList.toggle('nav-open', open);
  if (toggle) toggle.setAttribute('aria-expanded', String(open));
  if (open) panel.querySelector('.mobile-nav-close')?.focus();
  else if (toggle && panel.contains(document.activeElement)) toggle.focus();
}

function toggleMobileNav() {
  const panel = document.getElementById('mobileNavPanel');
  setMobileNav(!(panel && panel.classList.contains('open')));
}

document.querySelector('.nav-toggle')?.addEventListener('click', toggleMobileNav);
document.querySelector('.mobile-nav-close')?.addEventListener('click', () => setMobileNav(false));
document.getElementById('mobileNavOverlay')?.addEventListener('click', () => setMobileNav(false));
// Close the panel if the window grows past the mobile breakpoint
window.matchMedia('(min-width: 961px)').addEventListener('change', e => { if (e.matches) setMobileNav(false); });

/* Escape closes whatever is open on top */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (document.getElementById('mobileNavPanel')?.classList.contains('open')) { setMobileNav(false); return; }
  const openVariant = document.querySelector('.variant-modal.open, .variant-modal[style*="display: block"]');
  if (openVariant) {
    openVariant.querySelector('.close-btn')?.click();
    return;
  }
  if (document.getElementById('cartModal')?.classList.contains('open') && typeof closeCart === 'function') closeCart();
});

/* Nav shadow on scroll */
const mainNav = document.getElementById('mainNav');
if (mainNav) {
  const updateNav = () => mainNav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

/* Footer year */
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

/* ── Direct order form (home + order page) → WhatsApp ── */
function submitDirectOrder(event) {
  event.preventDefault();
  const form = event.target;
  if (!form.reportValidity()) return;
  const value = id => (document.getElementById(id)?.value || '').trim();
  const message =
    `Hello Five Loaves & Two Fish!\n\n` +
    `Name: ${value('directName')}\n` +
    `Phone: ${value('directPhone')}\n` +
    `Delivery: ${value('directLocation')}\n\n` +
    `Order:\n${value('directItems')}\n\n` +
    `Please confirm. Thank you!`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
}

/* ── Home: hero card parallax ──────────────── */
const heroCards = document.querySelectorAll('.hero-card');
const heroImg = document.querySelector('.hero-photo-wrap > img');
if (heroCards.length && !prefersReducedMotion) {
  let rafPending = false;
  window.addEventListener('scroll', () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      heroCards.forEach((card, i) => {
        card.style.translate = `0 -${Math.min(sy * [0.10, 0.07, 0.05][i], 60)}px`;
      });
      if (heroImg) heroImg.style.transform = `translateY(${Math.min(sy * 0.025, 16)}px)`;
      rafPending = false;
    });
  }, { passive: true });
}

/* ── Home: FAQ accordion ───────────────────── */
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.accordion-item');
    const body = document.getElementById(trigger.getAttribute('aria-controls'));
    const wasOpen = item.classList.contains('open');

    document.querySelectorAll('.accordion-item.open').forEach(open => {
      open.classList.remove('open');
      open.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      open.querySelector('.accordion-body').style.height = '0';
    });

    if (!wasOpen) {
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      body.style.height = body.scrollHeight + 'px';
    }
  });
});
// Keep an open panel sized correctly when text reflows
window.addEventListener('resize', () => {
  document.querySelectorAll('.accordion-item.open .accordion-body').forEach(body => {
    body.style.height = body.firstElementChild.offsetHeight + 'px';
  });
});

/* ── Menu: category tabs + scroll spy ──────── */
const menuTabs = Array.from(document.querySelectorAll('.menu-tab'));
if (menuTabs.length) {
  const slider = document.getElementById('tabSlider');
  const tabsBar = document.getElementById('menuTabsBar');
  const sections = menuTabs.map(tab => document.getElementById(tab.dataset.section));

  const stickyOffset = () => {
    const navWrap = document.querySelector('.nav-wrap');
    return (navWrap ? navWrap.offsetHeight : 0) + (tabsBar ? tabsBar.offsetHeight : 0);
  };

  const setActiveTab = (tab, scrollIntoView) => {
    menuTabs.forEach(t => {
      const active = t === tab;
      t.classList.toggle('active', active);
      t.setAttribute('aria-current', active ? 'true' : 'false');
    });
    if (slider && tab) {
      slider.style.left = tab.offsetLeft + 'px';
      slider.style.width = tab.offsetWidth + 'px';
    }
    // Keep the active tab visible when the track scrolls sideways on small screens
    if (scrollIntoView && tab) {
      const track = tab.parentElement;
      const target = tab.offsetLeft - (track.clientWidth - tab.offsetWidth) / 2;
      track.scrollTo({ left: target, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  // While a tab-triggered scroll is running, don't let the scroll spy flip tabs mid-way
  let spyLocked = false;
  let spyUnlockTimer = null;
  const unlockSpy = () => { spyLocked = false; clearTimeout(spyUnlockTimer); };
  window.addEventListener('scrollend', unlockSpy);

  menuTabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      const section = sections[i];
      if (!section) return;
      setActiveTab(tab, true);
      spyLocked = true;
      clearTimeout(spyUnlockTimer);
      spyUnlockTimer = setTimeout(unlockSpy, 2500);
      const top = section.getBoundingClientRect().top + window.scrollY - stickyOffset() + 1;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', '#' + section.id);
    });
  });

  const spy = () => {
    if (spyLocked) return;
    const line = stickyOffset() + 40;
    let current = menuTabs[0];
    sections.forEach((section, i) => {
      if (section && section.getBoundingClientRect().top <= line) current = menuTabs[i];
    });
    if (!current.classList.contains('active')) setActiveTab(current, true);
  };

  window.addEventListener('scroll', spy, { passive: true });
  window.addEventListener('resize', () => setActiveTab(document.querySelector('.menu-tab.active'), false));
  window.addEventListener('load', () => {
    // Honour deep links such as menu.html#dishes from the home page
    const fromHash = menuTabs.find(t => '#' + t.dataset.section === location.hash);
    if (fromHash) fromHash.click();
    else setActiveTab(document.querySelector('.menu-tab.active') || menuTabs[0], false);
  });
  document.fonts?.ready.then(() => setActiveTab(document.querySelector('.menu-tab.active'), false));
}

/* ── Reviews: rating, submit, share ────────── */
const ratingSelector = document.getElementById('ratingSelector');
if (ratingSelector) {
  const REVIEWS_KEY = 'flffReviews';
  const stars = ratingSelector.querySelectorAll('.star');
  const ratingInput = document.getElementById('reviewRating');
  const reviewsList = document.getElementById('reviewsList');
  let currentRating = 5;

  const paintStars = rating => stars.forEach(s => {
    const on = Number(s.dataset.rating) <= rating;
    s.classList.toggle('active', on);
    s.setAttribute('aria-pressed', String(Number(s.dataset.rating) === rating));
  });

  stars.forEach(star => {
    star.addEventListener('click', () => {
      currentRating = Number(star.dataset.rating);
      ratingInput.value = currentRating;
      paintStars(currentRating);
    });
    star.addEventListener('mouseenter', () => paintStars(Number(star.dataset.rating)));
  });
  ratingSelector.addEventListener('mouseleave', () => paintStars(currentRating));
  paintStars(currentRating);

  const buildReviewCard = ({ name, rating, text, date }) => {
    const card = document.createElement('article');
    card.className = 'review-card';
    const top = document.createElement('div');
    top.className = 'review-top';
    const nameEl = document.createElement('span');
    nameEl.className = 'review-name';
    nameEl.textContent = name;
    const dateEl = document.createElement('span');
    dateEl.className = 'review-date';
    dateEl.textContent = date;
    top.append(nameEl, dateEl);
    const starsEl = document.createElement('div');
    starsEl.className = 'review-stars';
    starsEl.setAttribute('aria-label', `${rating} out of 5 stars`);
    starsEl.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const textEl = document.createElement('p');
    textEl.className = 'review-text';
    textEl.textContent = `“${text}”`;
    card.append(top, starsEl, textEl);
    return card;
  };

  const loadReviews = () => {
    try { return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || []; } catch { return []; }
  };

  // Reviews left on this device stay visible on return visits
  loadReviews().forEach(r => reviewsList.prepend(buildReviewCard(r)));

  window.submitReview = function (event) {
    event.preventDefault();
    const form = event.target;
    if (!form.reportValidity()) return;
    const review = {
      name: document.getElementById('reviewName').value.trim(),
      rating: Math.min(5, Math.max(1, Number(ratingInput.value) || 5)),
      text: document.getElementById('reviewText').value.trim(),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    if (!review.name || !review.text) return;

    const saved = loadReviews();
    saved.push(review);
    try { localStorage.setItem(REVIEWS_KEY, JSON.stringify(saved)); } catch { /* storage full or blocked */ }
    reviewsList.prepend(buildReviewCard(review));

    const msg = document.getElementById('successMessage');
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 3500);
    form.reset();
    currentRating = 5;
    ratingInput.value = 5;
    paintStars(5);
  };

  document.getElementById('reviewForm')?.addEventListener('reset', () => {
    currentRating = 5;
    ratingInput.value = 5;
    setTimeout(() => paintStars(5));
  });
}

function copyShareLink(button) {
  const url = location.origin + location.pathname.replace(/[^/]*$/, '') ;
  const text = `Check out Five Loaves & Two Fish — amazing campus food at Queen Idia Hall, UI! ${url}`;
  const done = label => {
    if (!button) return;
    const original = button.dataset.label || button.textContent;
    button.dataset.label = original;
    button.textContent = label;
    setTimeout(() => { button.textContent = original; }, 2000);
  };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => done('Copied ✓'), () => done('Copy failed'));
  } else {
    done('Copy failed');
  }
}
