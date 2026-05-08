let cart = JSON.parse(localStorage.getItem('flffCart')) || [];
let selectedMenuItem = null;

function saveCart() {
  localStorage.setItem('flffCart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(itemName, price, quantity = 1) {
  if (window.DishAvailability && !window.DishAvailability.isItemAvailable(itemName)) {
    alert('Sorry, this meal is currently unavailable.');
    return;
  }

  const safeQuantity = Math.max(1, parseInt(quantity, 10) || 1);
  const existingItem = cart.find(item => item.name === itemName);
  if (existingItem) {
    existingItem.quantity += safeQuantity;
  } else {
    cart.push({ name: itemName, price: price, quantity: safeQuantity });
  }
  saveCart();
  showCartNotification(safeQuantity);
}

function removeFromCart(itemName) {
  cart = cart.filter(item => item.name !== itemName);
  saveCart();
}

function updateQuantity(itemName, quantity) {
  const item = cart.find(item => item.name === itemName);
  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCart();
  }
}

function clearCart() {
  cart = [];
  saveCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : 0;
    return sum + price * item.quantity;
  }, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getDeliveryFee() {
  return 300;
}

function updateCartUI() {
  const cartIcon = document.getElementById('floatingCart');
  const cartCount = document.getElementById('cartItemCount');
  const count = getCartCount();

  if (cartCount) {
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
  }

  if (cartIcon && count === 0) {
    cartIcon.style.display = 'none';
  } else if (cartIcon) {
    cartIcon.style.display = 'flex';
  }
}

function showCartNotification(quantity = 1) {
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.textContent = `${quantity} item${quantity > 1 ? 's' : ''} added to cart ✓`;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function openQuantitySelector(itemName, price) {
  const modal = document.getElementById('quantityModal');
  const overlay = document.getElementById('quantityOverlay');
  const qtyInput = document.getElementById('itemQty');
  const modalTitle = document.getElementById('quantityModalTitle');

  selectedMenuItem = { name: itemName, price: price };

  if (qtyInput) {
    qtyInput.value = '1';
  }
  if (modalTitle) {
    modalTitle.textContent = `Select Quantity - ${itemName}`;
  }
  if (modal) {
    modal.classList.add('open');
  }
  if (overlay) {
    overlay.classList.add('open');
  }
}

function closeQuantitySelector() {
  const modal = document.getElementById('quantityModal');
  const overlay = document.getElementById('quantityOverlay');
  if (modal) {
    modal.classList.remove('open');
  }
  if (overlay) {
    overlay.classList.remove('open');
  }
  selectedMenuItem = null;
}

function incrementItemQty() {
  const input = document.getElementById('itemQty');
  if (!input) return;
  input.value = Math.max(1, (parseInt(input.value, 10) || 1) + 1);
}

function decrementItemQty() {
  const input = document.getElementById('itemQty');
  if (!input) return;
  input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
}

function addSelectedItemToCart() {
  if (!selectedMenuItem) {
    return;
  }
  const qtyInput = document.getElementById('itemQty');
  const quantity = Math.max(1, parseInt(qtyInput?.value, 10) || 1);

  addToCart(selectedMenuItem.name, selectedMenuItem.price, quantity);
  closeQuantitySelector();
}

function openCart() {
  const modal = document.getElementById('cartModal');
  if (modal) {
    renderCartModal();
    modal.classList.add('open');
  }
}

function closeCart() {
  const modal = document.getElementById('cartModal');
  if (modal) {
    modal.classList.remove('open');
  }
}

function renderCartModal() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Your cart is empty</p>';
    if (cartTotal) cartTotal.textContent = '₦0';
    return;
  }

  cartItems.innerHTML = cart
    .map(
      item => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <p>₦${item.price}</p>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="updateQuantity('${item.name.replace(/'/g, "\\'")}', ${item.quantity - 1})">−</button>
        <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.name.replace(/'/g, "\\'")}', this.value)" />
        <button class="qty-btn" onclick="updateQuantity('${item.name.replace(/'/g, "\\'")}', ${item.quantity + 1})">+</button>
      </div>
      <strong>₦${item.price * item.quantity}</strong>
      <button class="remove-btn" onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')">✕</button>
    </div>
  `
    )
    .join('');

  const feeRow = `
    <div class="cart-item cart-item-fee">
      <div>
        <strong>Delivery Fee</strong>
        <p>Non-editable</p>
      </div>
      <strong>₦${getDeliveryFee()}</strong>
    </div>
  `;

  cartItems.innerHTML += feeRow;

  if (cartTotal) {
    cartTotal.textContent = `₦${(getCartTotal() + getDeliveryFee()).toLocaleString()}`;
  }
}

function submitOrder() {
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }

  const location = document.getElementById('orderLocation')?.value || 'Queen Idia Hall, University of Ibadan';
  const name = document.getElementById('orderName')?.value || 'Customer';
  const phone = document.getElementById('orderPhone')?.value || 'No phone provided';

  const orderList = cart.map(item => `- ${item.quantity}x ${item.name} (₦${item.price * item.quantity})`).join('\n');
  const deliveryFee = getDeliveryFee();
  const total = getCartTotal() + deliveryFee;

  const message = `Hello, Five Loaves and Two Fish.\nMy order is:\n${orderList}\n- Delivery Fee (₦${deliveryFee})\n\nMy location is ${location}\nMy phone number is ${phone}\nTotal amount is ₦${total}\n\nCan I have your account details?`;

  const encoded = encodeURIComponent(message);
  const phoneNumber = '2348030735623';

  // Open WhatsApp with the order message
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encoded}`;

  // Redirect to WhatsApp (simplest and most reliable method)
  window.location.href = whatsappURL;

  // Clear cart after redirect
  clearCart();
  closeCart();
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  const cartIcon = document.getElementById('floatingCart');
  if (cartIcon) {
    cartIcon.addEventListener('click', openCart);
  }

  const closeBtn = document.getElementById('closeCartModal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCart);
  }

  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    cartModal.addEventListener('click', event => {
      if (event.target === cartModal) {
        closeCart();
      }
    });
  }
});

// Swallow Variant Selector
function openSwallowSelector() {
  if (window.DishAvailability && !window.DishAvailability.isItemAvailable('Swallow')) {
    alert('Sorry, Swallow is currently unavailable.');
    return;
  }
  const modal = document.getElementById('swallowModal');
  const overlay = document.getElementById('swallowOverlay');
  if (modal) {
    modal.classList.add('open');
  }
  if (overlay) {
    overlay.classList.add('open');
  }
}

function closeSwallowSelector() {
  const modal = document.getElementById('swallowModal');
  const overlay = document.getElementById('swallowOverlay');
  if (modal) {
    modal.classList.remove('open');
  }
  if (overlay) {
    overlay.classList.remove('open');
  }
}

function incrementSwallowQty() {
  const input = document.getElementById('swallowQty');
  input.value = Math.max(1, parseInt(input.value) + 1);
}

function decrementSwallowQty() {
  const input = document.getElementById('swallowQty');
  input.value = Math.max(1, parseInt(input.value) - 1);
}

function addSwallowToCart() {
  const selected = document.querySelector('input[name="swallowType"]:checked');
  const qty = parseInt(document.getElementById('swallowQty').value) || 1;

  if (!selected) {
    alert('Please select a swallow type');
    return;
  }

  const swallowType = selected.value;
  const itemName = `Swallow (${swallowType})`;

  addToCart(itemName, 200, qty);

  closeSwallowSelector();
  document.getElementById('swallowQty').value = '1';
}

// Fish Variant Selector
function openFishSelector() {
  if (window.DishAvailability && !window.DishAvailability.isItemAvailable('Fish')) {
    alert('Sorry, Fish is currently unavailable.');
    return;
  }
  const modal = document.getElementById('fishModal');
  const overlay = document.getElementById('fishOverlay');
  if (modal) {
    modal.classList.add('open');
  }
  if (overlay) {
    overlay.classList.add('open');
  }
}

function closeFishSelector() {
  const modal = document.getElementById('fishModal');
  const overlay = document.getElementById('fishOverlay');
  if (modal) {
    modal.classList.remove('open');
  }
  if (overlay) {
    overlay.classList.remove('open');
  }
}

function incrementFishQty() {
  const input = document.getElementById('fishQty');
  input.value = Math.max(1, parseInt(input.value) + 1);
}

function decrementFishQty() {
  const input = document.getElementById('fishQty');
  input.value = Math.max(1, parseInt(input.value) - 1);
}

function addFishToCart() {
  const selected = document.querySelector('input[name="fishPrice"]:checked');
  const qty = parseInt(document.getElementById('fishQty').value) || 1;

  if (!selected) {
    alert('Please select a fish size');
    return;
  }

  const price = parseInt(selected.value);
  const priceLabel = {
    '200': 'Small',
    '300': 'Medium',
    '400': 'Large',
    '500': 'Extra Large'
  }[selected.value];
  const itemName = `Fish (${priceLabel} - ₦${price})`;

  addToCart(itemName, price, qty);

  closeFishSelector();
  document.getElementById('fishQty').value = '1';
}

// Chicken Variant Selector
function openChickenSelector() {
  if (window.DishAvailability && !window.DishAvailability.isItemAvailable('Chicken')) {
    alert('Sorry, Chicken is currently unavailable.');
    return;
  }
  const modal = document.getElementById('chickenModal');
  const overlay = document.getElementById('chickenOverlay');
  if (modal) {
    modal.classList.add('open');
  }
  if (overlay) {
    overlay.classList.add('open');
  }
}

function closeChickenSelector() {
  const modal = document.getElementById('chickenModal');
  const overlay = document.getElementById('chickenOverlay');
  if (modal) {
    modal.classList.remove('open');
  }
  if (overlay) {
    overlay.classList.remove('open');
  }
}

function incrementChickenQty() {
  const input = document.getElementById('chickenQty');
  input.value = Math.max(1, parseInt(input.value) + 1);
}

function decrementChickenQty() {
  const input = document.getElementById('chickenQty');
  input.value = Math.max(1, parseInt(input.value) - 1);
}

function addChickenToCart() {
  const selected = document.querySelector('input[name="chickenPrice"]:checked');
  const qty = parseInt(document.getElementById('chickenQty').value) || 1;

  if (!selected) {
    alert('Please select a chicken portion');
    return;
  }

  const price = parseInt(selected.value);
  const priceLabel = {
    '500': 'Small',
    '700': 'Medium',
    '1000': 'Large',
    '1200': 'Extra Large'
  }[selected.value];
  const itemName = `Chicken (${priceLabel} - ₦${price})`;

  addToCart(itemName, price, qty);

  closeChickenSelector();
  document.getElementById('chickenQty').value = '1';
}

function openEggSelector() {
  if (window.DishAvailability && !window.DishAvailability.isItemAvailable('Fried Egg')) {
    alert('Sorry, Fried Egg is currently unavailable.');
    return;
  }
  const modal = document.getElementById('eggModal');
  const overlay = document.getElementById('eggOverlay');
  const qtyInput = document.getElementById('eggQty');
  if (qtyInput) {
    qtyInput.value = '1';
  }
  if (modal) {
    modal.classList.add('open');
  }
  if (overlay) {
    overlay.classList.add('open');
  }
}

function closeEggSelector() {
  const modal = document.getElementById('eggModal');
  const overlay = document.getElementById('eggOverlay');
  if (modal) {
    modal.classList.remove('open');
  }
  if (overlay) {
    overlay.classList.remove('open');
  }
}

function incrementEggQty() {
  const input = document.getElementById('eggQty');
  if (!input) return;
  input.value = Math.max(1, (parseInt(input.value, 10) || 1) + 1);
}

function decrementEggQty() {
  const input = document.getElementById('eggQty');
  if (!input) return;
  input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
}

function addEggToCart() {
  const selected = document.querySelector('input[name="eggPrice"]:checked');
  const qty = parseInt(document.getElementById('eggQty').value, 10) || 1;
  if (!selected) {
    alert('Please select an egg option');
    return;
  }
  const price = parseInt(selected.value, 10);
  const itemName = selected.value === '700' ? 'Fried Egg (2 eggs)' : 'Fried Egg (1 egg)';
  addToCart(itemName, price, qty);
  closeEggSelector();
  const qtyInput = document.getElementById('eggQty');
  if (qtyInput) qtyInput.value = '1';
}
