(function () {
  const STORAGE_KEY = 'flffAvailability';
  const MENU_ITEMS = [
    'Exclusive White Rice',
    'Swallow',
    'Exclusive Jollof Rice',
    'Exclusive Fried Rice',
    'Stir Fry Spag',
    'Special Noodles',
    'Hot Moi Moi',
    'Coleslaw',
    'Ewedu',
    'Gbegiri',
    'Abula',
    'Egusi',
    'Efo Riro',
    'Okra',
    'Stew',
    'Egg',
    'Beef',
    'Fish',
    'Chicken',
    'Goat Meat',
    'Ponmo',
    'Plantain',
    'Assorted'
  ];

  function normalizeItemName(name) {
    if (!name) return '';
    if (name.startsWith('Swallow (')) return 'Swallow';
    if (name.startsWith('Fish (')) return 'Fish';
    if (name.startsWith('Chicken (')) return 'Chicken';
    if (name.startsWith('Ewedu Soup')) return 'Ewedu';
    if (name.startsWith('Gbegiri Soup')) return 'Gbegiri';
    if (name.startsWith('Abula Soup')) return 'Abula';
    if (name.startsWith('Egusi Soup')) return 'Egusi';
    if (name.startsWith('Efo Riro')) return 'Efo Riro';
    if (name.startsWith('Okra Soup')) return 'Okra';
    return name;
  }

  function getAvailabilityMap() {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const map = {};
    MENU_ITEMS.forEach(item => {
      map[item] = stored[item] !== false;
    });
    return map;
  }

  function saveAvailabilityMap(map) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  }

  function setAvailability(itemName, isAvailable) {
    const map = getAvailabilityMap();
    map[itemName] = Boolean(isAvailable);
    saveAvailabilityMap(map);
  }

  function isItemAvailable(itemName) {
    const normalized = normalizeItemName(itemName);
    const map = getAvailabilityMap();
    return map[normalized] !== false;
  }

  function applyMenuAvailabilityState() {
    const map = getAvailabilityMap();
    const cards = document.querySelectorAll('.menu-item');
    cards.forEach(card => {
      const title = card.querySelector('h3')?.textContent?.trim();
      const button = card.querySelector('.add-to-order-btn');
      if (!title || !button) return;

      const available = map[normalizeItemName(title)] !== false;
      const badge = card.querySelector('.availability-badge');
      const originalText = button.dataset.originalText || button.textContent;
      button.dataset.originalText = originalText;

      if (!available) {
        card.classList.add('unavailable');
        button.disabled = true;
        button.textContent = 'Unavailable';
        if (!badge) {
          const tag = document.createElement('span');
          tag.className = 'availability-badge';
          tag.textContent = 'Out of Stock';
          card.prepend(tag);
        }
      } else {
        card.classList.remove('unavailable');
        button.disabled = false;
        button.textContent = originalText;
        if (badge) badge.remove();
      }
    });
  }

  function renderAdminList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const map = getAvailabilityMap();

    container.innerHTML = MENU_ITEMS.map(
      item => `
      <label class="admin-item">
        <span>${item}</span>
        <input type="checkbox" data-item="${item.replace(/"/g, '&quot;')}" ${map[item] ? 'checked' : ''} />
      </label>
    `
    ).join('');

    container.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', () => {
        const item = input.getAttribute('data-item');
        setAvailability(item, input.checked);
      });
    });
  }

  function setAllAvailability(value) {
    const map = {};
    MENU_ITEMS.forEach(item => {
      map[item] = value;
    });
    saveAvailabilityMap(map);
  }

  window.DishAvailability = {
    getAvailabilityMap,
    setAvailability,
    isItemAvailable,
    applyMenuAvailabilityState,
    renderAdminList,
    setAllAvailability
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.menu-item')) {
      applyMenuAvailabilityState();
    }
  });
})();
