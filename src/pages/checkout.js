import { getCart, getSubtotal, clearCart } from '../store/cart.js';
import { content } from '../content.js';
import { showToast } from '../components/toast.js';

export function renderCheckout() {
  const items = getCart();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return `
      <div class="subpage">
        <div class="confirmation-card">
          <h1 style="font-weight: 300; font-size: 32px; margin: 0 0 16px;">YOUR BAG IS EMPTY</h1>
          <p class="dim" style="margin-bottom: 30px;">Add pieces from the collection before proceeding to checkout.</p>
          <a class="cta" href="/shop" data-link style="justify-content: center;">Explore DROP_001</a>
        </div>
      </div>
    `;
  }

  return `
    <div class="subpage" id="checkout-view">
      <div style="margin-bottom: clamp(30px, 6vw, 50px);">
        <span class="tiny dim" style="letter-spacing: .2em;">${content.checkout.demoNotice}</span>
        <h1 class="subpage-title" style="margin: 8px 0 0;">${content.checkout.headline}</h1>
      </div>

      <div class="form-grid">
        <div class="form-card">
          <form id="checkout-form" novalidate>
            <div class="form-field">
              <label for="checkout-name">RECIPIENT NAME</label>
              <input type="text" id="checkout-name" class="form-input" placeholder="e.g. Maya Lin" required />
              <span class="field-error" id="err-co-name" hidden>Name is required.</span>
            </div>

            <div class="form-field">
              <label for="checkout-email">DISPATCH EMAIL</label>
              <input type="email" id="checkout-email" class="form-input" placeholder="e.g. maya@domain.com" required />
              <span class="field-error" id="err-co-email" hidden>Valid email required for dispatch notification.</span>
            </div>

            <div class="form-field">
              <label for="checkout-address">SHIPPING ADDRESS</label>
              <input type="text" id="checkout-address" class="form-input" placeholder="Street and unit number" required />
              <span class="field-error" id="err-co-address" hidden>Shipping address is required.</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-field">
                <label for="checkout-city">CITY</label>
                <input type="text" id="checkout-city" class="form-input" placeholder="e.g. Berlin" required />
                <span class="field-error" id="err-co-city" hidden>City required.</span>
              </div>
              <div class="form-field">
                <label for="checkout-zip">POSTAL CODE</label>
                <input type="text" id="checkout-zip" class="form-input" placeholder="e.g. 10115" required />
                <span class="field-error" id="err-co-zip" hidden>Postal code required.</span>
              </div>
            </div>

            <div class="form-field">
              <label for="checkout-country">COUNTRY / REGION</label>
              <input type="text" id="checkout-country" class="form-input" placeholder="e.g. Germany" required />
              <span class="field-error" id="err-co-country" hidden>Country is required.</span>
            </div>

            <div style="margin-top: 32px;">
              <button type="submit" class="cta" style="width: 100%; justify-content: space-between;">
                Place Order (Demo)
              </button>
            </div>
          </form>
        </div>

        <div class="form-summary">
          <h3 style="margin: 0 0 20px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;">
            ORDER MANIFEST
          </h3>
          <div class="summary-items">
            ${items.map(item => `
              <div class="summary-line">
                <span>${item.qty} × ${item.product.name} (${item.colorway}/${item.size})</span>
                <span>$${item.product.price * item.qty}</span>
              </div>
            `).join('')}
          </div>
          <div class="summary-line">
            <span>DISPATCH SHIPPING</span>
            <span>$0.00 (STANDARD COMPLIMENTARY)</span>
          </div>
          <div class="summary-total">
            <span>TOTAL PROTOCOL</span>
            <span>$${subtotal}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initCheckout() {
  const form = document.getElementById('checkout-form');
  const view = document.getElementById('checkout-view');
  if (!form) return;

  const nameInput = document.getElementById('checkout-name');
  const emailInput = document.getElementById('checkout-email');
  const addrInput = document.getElementById('checkout-address');
  const cityInput = document.getElementById('checkout-city');
  const zipInput = document.getElementById('checkout-zip');
  const countryInput = document.getElementById('checkout-country');

  const errName = document.getElementById('err-co-name');
  const errEmail = document.getElementById('err-co-email');
  const errAddr = document.getElementById('err-co-address');
  const errCity = document.getElementById('err-co-city');
  const errZip = document.getElementById('err-co-zip');
  const errCountry = document.getElementById('err-co-country');

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      nameInput.classList.add('invalid');
      errName.hidden = false;
      valid = false;
    } else {
      nameInput.classList.remove('invalid');
      errName.hidden = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add('invalid');
      errEmail.hidden = false;
      valid = false;
    } else {
      emailInput.classList.remove('invalid');
      errEmail.hidden = true;
    }

    if (!addrInput.value.trim()) {
      addrInput.classList.add('invalid');
      errAddr.hidden = false;
      valid = false;
    } else {
      addrInput.classList.remove('invalid');
      errAddr.hidden = true;
    }

    if (!cityInput.value.trim()) {
      cityInput.classList.add('invalid');
      errCity.hidden = false;
      valid = false;
    } else {
      cityInput.classList.remove('invalid');
      errCity.hidden = true;
    }

    if (!zipInput.value.trim()) {
      zipInput.classList.add('invalid');
      errZip.hidden = false;
      valid = false;
    } else {
      zipInput.classList.remove('invalid');
      errZip.hidden = true;
    }

    if (!countryInput.value.trim()) {
      countryInput.classList.add('invalid');
      errCountry.hidden = false;
      valid = false;
    } else {
      countryInput.classList.remove('invalid');
      errCountry.hidden = true;
    }

    if (valid && view) {
      const orderNum = `${content.checkout.orderPrefix}${Math.floor(100000 + Math.random() * 900000)}`;
      const customerName = nameInput.value.trim();
      const customerEmail = emailInput.value.trim();
      const totalAmount = getSubtotal();

      clearCart();
      showToast('Order confirmed! Cart cleared.');

      view.innerHTML = `
        <div class="confirmation-card">
          <span class="tiny dim">${content.checkout.demoNotice}</span>
          <h1 style="font-weight: 300; font-size: clamp(28px, 4vw, 44px); margin: 12px 0;">
            ${content.checkout.successTitle}
          </h1>
          <div class="order-badge">${orderNum}</div>
          <p style="color: var(--chalk); font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Thank you, <b>${customerName}</b>. Your order protocol has been logged for shipping dispatch to <b>${cityInput.value.trim()}, ${countryInput.value.trim()}</b>. A confirmation dispatch note was sent to <b>${customerEmail}</b>.
          </p>
          <div style="border: 2px solid var(--c2); padding: 16px; margin-bottom: 32px; background: rgba(0,0,0,0.4);">
            <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--chalk);">
              <span>SETTLED TOTAL (DEMO)</span>
              <span>$${totalAmount}</span>
            </div>
          </div>
          <a class="cta" href="/shop" data-link style="justify-content: center;">
            Return to Shop
          </a>
        </div>
      `;
    }
  });
}
