// Toast notification manager

let toastTimer = null;

export function showToast(message) {
  let el = document.getElementById('msg');
  if (!el) {
    el = document.createElement('p');
    el.id = 'msg';
    el.className = 'msg';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }

  el.textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.textContent = '';
  }, 4000);
}
