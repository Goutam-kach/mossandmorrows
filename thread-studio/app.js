(() => {
  'use strict';
  const config = window.STUDIO_CONFIG;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const icons = () => window.lucide?.createIcons();
  const setIcon = (button, name) => {
    button.replaceChildren();
    const icon = document.createElement('i');
    icon.dataset.lucide = name;
    button.append(icon);
    icons();
  };
  document.title = `${config.brand} | A thread of something lovely`;
  document.querySelector('[data-brand]').textContent = config.brand;
  const brandParts = config.brand.split('&');
  if (brandParts.length === 2) {
    const heading = document.querySelector('[data-brand]');
    const emphasis = document.createElement('em');
    emphasis.textContent = `& ${brandParts[1].trim()}.`;
    heading.replaceChildren(document.createTextNode(brandParts[0].trim()), document.createElement('br'), emphasis);
  }
  document.querySelector('[data-wordmark]').textContent = config.wordmark;
  document.querySelector('[data-wordmark]').setAttribute('aria-label', `${config.brand} home`);
  document.querySelector('[data-footer-brand]').textContent = `${config.brand}.`;
  document.querySelector('[data-brand-inline]').textContent = config.brand;
  document.querySelector('[data-signature]').textContent = config.brand;
  document.querySelector('#year').textContent = new Date().getFullYear();
  document.querySelectorAll('[data-email]').forEach(link => {
    link.href = `mailto:${config.email}`;
    if (link.classList.contains('contact-email')) link.textContent = config.email;
  });
  document.querySelectorAll('[data-image]').forEach(image => { image.src = config.images[image.dataset.image]; });
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  function closeMenu() {
    if (menu.getAttribute('aria-expanded') === 'false') return;
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open menu');
    navigation.classList.remove('open');
    setIcon(menu, 'menu');
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navigation.classList.toggle('open', open);
    setIcon(menu, open ? 'x' : 'menu');
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => { if (!event.composedPath().includes(document.querySelector('.site-header'))) closeMenu(); });
  const preview = document.querySelector('#image-dialog');
  let selectedProduct;
  function inquire(product) {
    document.querySelector('#piece').value = product.inquiry;
    document.querySelector('#inquiry').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    document.querySelector('#name').focus({ preventScroll: true });
  }
  const productGrid = document.querySelector('#products');
  config.products.forEach((product, index) => {
    const pieceSelect = document.querySelector('#piece');
    if (![...pieceSelect.options].some(option => option.value === product.inquiry)) {
      pieceSelect.add(new Option(product.inquiry, product.inquiry));
    }
    const article = document.createElement('article');
    article.className = 'product reveal';
    article.dataset.category = product.category;
    const photoButton = document.createElement('button');
    photoButton.className = 'product-image';
    photoButton.setAttribute('aria-label', `Enlarge ${product.title}`);
    const image = new Image();
    image.src = product.image;
    image.alt = product.alt;
    image.loading = 'lazy';
    image.width = 900;
    image.height = 1125;
    const number = document.createElement('span');
    number.className = 'product-index';
    number.textContent = String(index + 1).padStart(2, '0');
    const expand = document.createElement('span');
    expand.className = 'product-expand';
    expand.innerHTML = '<i data-lucide="plus"></i>';
    photoButton.append(image, number, expand);
    photoButton.addEventListener('click', () => {
      selectedProduct = product;
      document.querySelector('#preview-image').src = product.image;
      document.querySelector('#preview-image').alt = product.alt;
      document.querySelector('#preview-title').textContent = product.title;
      preview.showModal();
      document.body.classList.add('modal-open');
    });
    const info = document.createElement('div');
    info.className = 'product-info';
    const text = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = product.title;
    const label = document.createElement('p');
    label.textContent = product.label;
    text.append(title, label);
    const orderButton = document.createElement('button');
    orderButton.className = 'icon-button';
    orderButton.setAttribute('aria-label', `Inquire about ${product.title}`);
    orderButton.title = `Inquire about ${product.title}`;
    orderButton.innerHTML = '<i data-lucide="arrow-up-right"></i>';
    orderButton.addEventListener('click', () => inquire(product));
    info.append(text, orderButton);
    article.append(photoButton, info);
    productGrid.append(article);
  });
  document.querySelector('[data-filter="all"] span').textContent = String(config.products.length).padStart(2, '0');
  document.querySelector('.collection-count').textContent = `${String(config.products.length).padStart(2, '0')} STUDIES`;
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(filter => {
      filter.classList.toggle('active', filter === button);
      filter.setAttribute('aria-pressed', String(filter === button));
    });
    let count = 0;
    productGrid.querySelectorAll('.product').forEach(product => {
      const visible = button.dataset.filter === 'all' || product.dataset.category === button.dataset.filter;
      product.hidden = !visible;
      if (visible) {
        count++;
        product.classList.add('visible');
        if (!reducedMotion.matches) product.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'ease-out' });
      }
    });
    document.querySelector('.collection-count').textContent = `${String(count).padStart(2, '0')} ${count === 1 ? 'STUDY' : 'STUDIES'}`;
  }));
  document.querySelector('.lightbox-close').addEventListener('click', () => preview.close());
  preview.addEventListener('click', event => {
    const bounds = preview.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) preview.close();
  });
  preview.addEventListener('close', () => document.body.classList.remove('modal-open'));
  document.querySelector('#preview-inquire').addEventListener('click', () => { preview.close(); inquire(selectedProduct); });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  document.body.classList.add('js-motion');
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  const header = document.querySelector('.site-header');
  const journey = document.querySelector('.journey');
  const steps = [...document.querySelectorAll('.journey-step')];
  const tools = document.querySelector('.scene-tools');
  const studioImage = document.querySelector('.studio-image');
  let scrollQueued = false;
  let currentStep = -1;
  function updateScroll() {
    scrollQueued = false;
    header.classList.toggle('scrolled', scrollY > 24);
    const bounds = journey.getBoundingClientRect();
    const journeyEnd = scrollY + bounds.bottom - innerHeight;
    const progress = Math.max(0, Math.min(1, scrollY / Math.max(1, journeyEnd)));
    journey.style.setProperty('--progress', progress);
    const nextStep = progress < 1 / 3 ? 0 : progress < .52 ? 1 : 2;
    journey.dataset.stage = String(nextStep);
    if (nextStep !== currentStep) {
      steps.forEach((step, index) => { step.classList.toggle('is-current', index === nextStep); step.inert = index !== nextStep; });
      document.querySelector('#step-number').textContent = `0${nextStep + 1}`;
      currentStep = nextStep;
    }
    tools.classList.remove('is-hidden');
    window.threadScene?.setScroll(progress, {
      scrollY,
      journeyEnd
    });
    if (!reducedMotion.matches && !document.body.classList.contains('motion-paused')) {
      const offset = Math.max(-12, Math.min(0, (studioImage.getBoundingClientRect().top / innerHeight) * -10));
      studioImage.style.setProperty('--photo-offset', `${offset}%`);
    }
  }
  function scheduleScroll() { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); } }
  addEventListener('scroll', scheduleScroll, { passive: true });
  addEventListener('resize', scheduleScroll);
  new ResizeObserver(scheduleScroll).observe(document.querySelector('main'));
  let paused = reducedMotion.matches;
  const motionButton = document.querySelector('#motion-toggle');
  function setPaused(value) {
    paused = value;
    document.body.classList.toggle('motion-paused', value);
    motionButton.setAttribute('aria-pressed', String(value));
    motionButton.setAttribute('aria-label', value ? 'Play animation' : 'Pause animation');
    motionButton.title = value ? 'Play animation' : 'Pause animation';
    setIcon(motionButton, value ? 'play' : 'pause');
    window.threadScene?.setPaused(value);
  }
  motionButton.addEventListener('click', () => setPaused(!paused));
  reducedMotion.addEventListener('change', event => setPaused(event.matches));
  const expandButton = document.querySelector('#scene-expand');
  const focusTargets = [document.querySelector('header'), document.querySelector('main'), document.querySelector('footer')];
  function setExpanded(expanded) {
    document.body.classList.toggle('scene-focused', expanded);
    focusTargets.forEach(element => { element.inert = expanded; });
    expandButton.setAttribute('aria-pressed', String(expanded));
    expandButton.setAttribute('aria-label', expanded ? 'Minimize yarn scene' : 'Expand yarn scene');
    expandButton.title = expanded ? 'Minimize yarn scene' : 'Expand yarn scene';
    setIcon(expandButton, expanded ? 'minimize' : 'maximize');
    window.threadScene?.setExpanded(expanded);
  }
  expandButton.addEventListener('click', () => setExpanded(!document.body.classList.contains('scene-focused')));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); if (preview.open) preview.close(); setExpanded(false); } });
  const form = document.querySelector('#inquiry-form');
  const status = form.querySelector('.form-status');
  const fallback = form.querySelector('.email-fallback');
  const endpoint = config.formspreeId ? `https://formspree.io/f/${encodeURIComponent(config.formspreeId)}` : '';
  form.action = endpoint || `mailto:${config.email}`;
  if (!endpoint) form.enctype = 'text/plain';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const subject = `${config.brand}: ${values.get('piece')}`;
    const body = `Name: ${values.get('name')}\nEmail: ${values.get('email')}\nPiece: ${values.get('piece')}\n\n${values.get('message')}`;
    const emailUrl = `mailto:${config.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    fallback.href = emailUrl;
    fallback.hidden = false;
    if (!endpoint) {
      status.textContent = 'Your message is ready. Open your email app below, then send it there.';
      return;
    }
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    status.textContent = 'Sending your little idea...';
    try {
      const response = await fetch(endpoint, { method: 'POST', body: values, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Inquiry could not be sent');
      status.textContent = 'Thank you. Your idea is in our inbox.';
      fallback.hidden = true;
      form.reset();
    } catch {
      status.textContent = 'We could not send that just now. You can email us using the link below.';
    } finally { submit.disabled = false; }
  });
  setPaused(paused);
  icons();
  updateScroll();
})();