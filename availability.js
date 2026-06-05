(function () {
  const STORAGE_KEY = 'flffAvailability';

  // Shared cross-device availability store (jsonblob.com — free, no login)
  // This lets admin changes on any device instantly affect the customer menu.
  const BLOB_URL = 'https://jsonblob.com/api/jsonBlob/019e956a-e162-77d5-9400-4a48d15e920a';

  const MENU_ITEMS = [
    'Exclusive White Rice',
    'Swallow',
    'Exclusive Jollof Rice',
    'Exclusive Fried Rice',
    'Stir Fry Spag',
    'Special Noodles',
    'Boiled Yam',
    'Hot Moi Moi',
    'Beans',
    'Coleslaw',
    'Ewedu',
    'Gbegiri',
    'Abula',
    'Egusi',
    'Efo Riro',
    'Okra',
    'Stew',
    'Fried Egg',
    'Boiled Egg',
    'Beef',
    'Fish',
    'Chicken',
    'Bread',
    'Goat Meat',
    'Ponmo',
    'Plantain',
    'Assorted Meat',
    'Package 1: Ultimate Feast',
    'Package 2: Campus Special'
  ];

  function normalizeItemName(name) {
    if (!name) return '';
    if (name.startsWith('Swallow (')) return 'Swallow';
    if (name.startsWith('Fish (')) return 'Fish';
    if (name.startsWith('Chicken (')) return 'Chicken';
    if (name.startsWith('Bread (')) return 'Bread';
    if (name.startsWith('Fried Egg (')) return 'Fried Egg';
    if (name.startsWith('Package 1:')) return 'Package 1: Ultimate Feast';
    if (name.startsWith('Package 2:')) return 'Package 2: Campus Special';
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
    pushToBlob(map);
  }

  function pushToBlob(map) {
    fetch(BLOB_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(map)
    }).catch(() => {});
  }

  // Pull latest state from the shared blob, update localStorage, then call callback
  function syncFromBlob(callback) {
    fetch(BLOB_URL)
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data && typeof data === 'object') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
        if (callback) callback();
      })
      .catch(() => {
        if (callback) callback();
      });
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
    setAllAvailability,
    syncFromBlob,
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.menu-item')) {
      // Pull latest availability from shared store before rendering menu
      syncFromBlob(() => applyMenuAvailabilityState());
    }

    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('adminPassword');
    if (togglePassword && passwordInput) {
      togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '🙈';
      });
    }
  });
})();
