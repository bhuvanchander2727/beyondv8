// Cart state store with localStorage persistence and event broadcasting

const CART_KEY = 'beyond_cart';

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read cart from localStorage:', err);
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save cart to localStorage:', err);
  }
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: { items } }));
}

export function addItem(product, colorway, size, qty = 1) {
  const items = getCart();
  const existingIndex = items.findIndex(
    item => item.product.id === product.id && item.colorway === colorway && item.size === size
  );

  if (existingIndex > -1) {
    items[existingIndex].qty += qty;
  } else {
    items.push({ product, colorway, size, qty });
  }

  saveCart(items);
  return items;
}

export function updateQty(index, delta) {
  const items = getCart();
  if (items[index]) {
    items[index].qty += delta;
    if (items[index].qty <= 0) {
      items.splice(index, 1);
    }
    saveCart(items);
  }
  return items;
}

export function removeItem(index) {
  const items = getCart();
  if (items[index]) {
    items.splice(index, 1);
    saveCart(items);
  }
  return items;
}

export function clearCart() {
  saveCart([]);
}

export function getItemCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

export function getSubtotal() {
  return getCart().reduce((sum, item) => sum + item.product.price * item.qty, 0);
}
