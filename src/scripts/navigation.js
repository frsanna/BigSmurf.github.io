// Mobile menu, sticky-header state and scroll-spy for the main navigation.
function initNavigation() {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!header || !toggle || !nav) {
    return;
  }

  function setOpen(open) {
    root.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', () => setOpen(!root.classList.contains('nav-open')));
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && root.classList.contains('nav-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (root.classList.contains('nav-open') && !header.contains(event.target)) {
      setOpen(false);
    }
  });

  // Close the menu when keyboard focus leaves the header.
  header.addEventListener('focusout', (event) => {
    if (root.classList.contains('nav-open') && !header.contains(event.relatedTarget)) {
      setOpen(false);
    }
  });

  // Past the hero's top area the inline links are gone: switch to the floating menu.
  const onScroll = () => {
    const scrolled = window.scrollY > 160;
    if (!scrolled && root.classList.contains('scrolled')) {
      setOpen(false);
    }
    root.classList.toggle('scrolled', scrolled);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scroll-spy: highlight the link of the section in view.
  const links = new Map(
    Array.from(nav.querySelectorAll('a[href^="#"]')).map((a) => [a.getAttribute('href').slice(1), a])
  );
  if (!('IntersectionObserver' in window)) {
    return;
  }
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        links.forEach((a) => a.removeAttribute('aria-current'));
        const active = links.get(entry.target.id);
        if (active) {
          active.setAttribute('aria-current', 'location');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  document.querySelectorAll('main > section[id]').forEach((section) => spy.observe(section));
}

// Fade-in of content blocks as they enter the viewport.
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px' }
  );
  // Items already in view stay visible; only the ones below the fold animate in.
  // Read all positions first, then write, to avoid layout thrashing.
  const viewport = window.innerHeight;
  const inView = Array.from(items, (el) => el.getBoundingClientRect().top < viewport);
  items.forEach((el, i) => {
    if (inView[i]) {
      el.classList.add('is-visible');
    }
    observer.observe(el);
  });
  document.documentElement.classList.add('reveal-ready');
}
