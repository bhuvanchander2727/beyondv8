import { content } from '../content.js';
import { showToast } from '../components/toast.js';

export function renderContact() {
  return `
    <div class="subpage">
      <div style="margin-bottom: clamp(30px, 6vw, 60px);">
        <h1 class="subpage-title" style="margin: 0 0 16px;">${content.contact.headline}</h1>
        <p class="dim" style="font-size: 16px; margin: 0;">${content.contact.subtitle}</p>
      </div>

      <div class="form-grid">
        <div class="form-card" id="contact-form-container">
          <form id="contact-form" novalidate>
            <div class="form-field">
              <label for="contact-name">FULL NAME / CALLSIGN</label>
              <input type="text" id="contact-name" class="form-input" placeholder="e.g. Alex Vance" required />
              <span class="field-error" id="err-name" hidden>Name must be at least 2 characters.</span>
            </div>

            <div class="form-field">
              <label for="contact-email">EMAIL DISPATCH</label>
              <input type="email" id="contact-email" class="form-input" placeholder="e.g. alex@sector.io" required />
              <span class="field-error" id="err-email" hidden>Please provide a valid email address.</span>
            </div>

            <div class="form-field">
              <label for="contact-subject">INQUIRY CATEGORY</label>
              <select id="contact-subject" class="form-input" style="cursor: pointer;" required>
                <option value="">Select subject...</option>
                <option value="order">Order Dispatch Inquiry</option>
                <option value="wholesale">Stockist / Wholesale Study</option>
                <option value="press">Editorial / Press Inquiry</option>
                <option value="other">General Transmission</option>
              </select>
              <span class="field-error" id="err-subject" hidden>Please select a subject category.</span>
            </div>

            <div class="form-field">
              <label for="contact-message">TRANSMISSION CONTENT</label>
              <textarea id="contact-message" class="form-input" rows="5" placeholder="Enter message text..." style="resize: vertical; min-height: 120px;" required></textarea>
              <span class="field-error" id="err-message" hidden>Message must be at least 10 characters.</span>
            </div>

            <div style="margin-top: 30px;">
              <button type="submit" class="cta" style="width: 100%; justify-content: space-between;">
                Send Transmission
              </button>
            </div>
          </form>
        </div>

        <div class="form-summary">
          <h3 style="margin: 0 0 16px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;">
            DIRECT CHANNEL
          </h3>
          <p style="color: var(--c4); line-height: 1.6; font-size: 14px; margin-bottom: 24px;">
            ${content.contact.emailPrompt}
          </p>
          <div style="border-top: 1px solid var(--c2); padding-top: 20px;">
            <span class="tiny dim" style="display: block; margin-bottom: 8px;">STUDIO LOCATION</span>
            <p style="margin: 0; color: var(--chalk); font-weight: 600;">
              Industrial Sector 04 / Concrete Study
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initContact() {
  const form = document.getElementById('contact-form');
  const container = document.getElementById('contact-form-container');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  const errName = document.getElementById('err-name');
  const errEmail = document.getElementById('err-email');
  const errSubject = document.getElementById('err-subject');
  const errMessage = document.getElementById('err-message');

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      nameInput.classList.add('invalid');
      errName.hidden = false;
      valid = false;
    } else {
      nameInput.classList.remove('invalid');
      errName.hidden = true;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add('invalid');
      errEmail.hidden = false;
      valid = false;
    } else {
      emailInput.classList.remove('invalid');
      errEmail.hidden = true;
    }

    // Validate Subject
    if (!subjectInput.value) {
      subjectInput.classList.add('invalid');
      errSubject.hidden = false;
      valid = false;
    } else {
      subjectInput.classList.remove('invalid');
      errSubject.hidden = true;
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      messageInput.classList.add('invalid');
      errMessage.hidden = false;
      valid = false;
    } else {
      messageInput.classList.remove('invalid');
      errMessage.hidden = true;
    }

    if (valid && container) {
      showToast('Transmission dispatched successfully.');
      container.innerHTML = `
        <div style="text-align: center; padding: 30px 10px;">
          <span class="order-badge">${content.contact.successTitle}</span>
          <p style="color: var(--chalk); font-size: 16px; line-height: 1.6; margin: 20px 0 30px;">
            ${content.contact.successMessage}
          </p>
          <button class="btn-sec" id="contact-reset-btn" type="button">
            Send Another Message
          </button>
        </div>
      `;

      const resetBtn = document.getElementById('contact-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          initContact();
        });
      }
    }
  });
}
