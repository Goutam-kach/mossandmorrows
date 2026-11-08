const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  primaryNav?.classList.toggle('is-open', !isOpen);
});

primaryNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('is-open');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    menuToggle?.setAttribute('aria-expanded', 'false');
    primaryNav?.classList.remove('is-open');
  }
});

document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('.filter-button').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('.product-card').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});

document.querySelectorAll('.product-image-link, .product-ask').forEach((link) => {
  link.addEventListener('click', () => {
    const card = link.closest('.product-card');
    const title = card?.querySelector('h3')?.textContent;
    const pieceSelect = document.querySelector('#piece');
    if (title && pieceSelect) {
      const option = Array.from(pieceSelect.options).find((item) => item.textContent === title);
      if (option) pieceSelect.value = option.value || option.textContent;
    }
  });
});

const orderForm = document.querySelector('#order-form');
orderForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!orderForm.reportValidity()) return;

  const formData = new FormData(orderForm);
  const subject = `Custom crochet enquiry: ${formData.get('piece')}`;
  const body = [
    `Name: ${formData.get('name')}`,
    `Email: ${formData.get('email')}`,
    `Piece: ${formData.get('piece')}`,
    '',
    'Details:',
    formData.get('details'),
  ].join('\n');
  const mailto = `mailto:hello@morrowandmoss.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.querySelector('#form-status').textContent = 'Opening your email app with your note ready to send.';
  window.location.href = mailto;
});

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
