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

  // Past the hero, pin the bar. Close a mobile menu that was open when returning to the top.
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
