// script.js
/**
 * Initializes the vertical section navigation controls.
 * Binds next/previous buttons and keeps their state synced with scroll position.
 * @returns {void}
 */
function initSectionNavigation() {
  const container = document.querySelector('.scroll-container');
  const sections = Array.from(document.querySelectorAll('.scroll-container .section'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!container || !sections.length || !prevBtn || !nextBtn) {
    return;
  }

  let current = 0;

  /**
   * Updates previous/next button visibility according to the current section index.
   * @returns {void}
   */
  function updateButtons() {
    prevBtn.classList.toggle('hidden', current === 0);
    nextBtn.classList.toggle('hidden', current === sections.length - 1);
  }

  /**
   * Scrolls to a target section by index and updates navigation state.
   * @param {number} index - Target section index.
   * @returns {void}
   */
  function scrollTo(index) {
    sections[index].scrollIntoView({ behavior: 'smooth' });
    current = index;
    updateButtons();
  }

  prevBtn.addEventListener('click', () => scrollTo(current - 1));
  nextBtn.addEventListener('click', () => scrollTo(current + 1));

  container.addEventListener('scroll', () => {
    const scrollTop = container.scrollTop;
    sections.forEach((section, index) => {
      if (Math.abs(section.offsetTop - scrollTop) < section.clientHeight / 2) {
        current = index;
      }
    });
    updateButtons();
  });

  updateButtons();
}

/**
 * Initializes the hero logo easter egg animation and keyboard/mouse triggers.
 * @returns {void}
 */
function initLogoEasterEgg() {
  const trigger = document.getElementById('trigger-logo');
  const egg = document.getElementById('easter-egg');

  if (!trigger || !egg) {
    return;
  }

  const hLines = egg.querySelectorAll('.h-line');
  const vLines = egg.querySelectorAll('.v-line');
  const squares = egg.querySelectorAll('.square');
  const letters = egg.querySelector('.letters');

  if (!letters) {
    return;
  }

  /**
   * Replays all forward animation tracks from the initial state.
   * @returns {void}
   */
  function resetAnimations() {
    hLines.forEach((line) => {
      line.style.animation = 'none';
      line.offsetHeight;
      line.style.animation = 'draw-h 0.8s forwards';
    });

    vLines.forEach((line) => {
      line.style.animation = 'none';
      line.offsetHeight;
      line.style.animation = 'draw-v 0.8s forwards';
    });

    squares.forEach((square, index) => {
      square.style.animation = 'none';
      square.offsetHeight;
      square.style.animation = `pop 0.4s ${1.8 + index * 0.4}s forwards`;
    });

    letters.style.animation = 'none';
    letters.offsetHeight;
    letters.style.animation = 'rise 0.8s ease-out 2.6s forwards';
  }

  /**
   * Plays reverse tracks to hide the easter egg sequence.
   * @returns {void}
   */
  function reverseAnimations() {
    letters.style.animation = 'rise-reverse 0.5s forwards';

    squares.forEach((square, index) => {
      square.style.animation = `pop-reverse 0.3s ${0.2 + index * 0.2}s forwards`;
    });

    hLines.forEach((line) => {
      line.style.animation = 'draw-h-reverse 0.4s 0.6s forwards';
    });

    vLines.forEach((line) => {
      line.style.animation = 'draw-v-reverse 0.4s 0.6s forwards';
    });
  }

  /**
   * Runs a full easter egg cycle (forward then reverse).
   * @returns {void}
   */
  function playEasterEgg() {
    resetAnimations();
    egg.classList.add('visible');

    setTimeout(() => {
      reverseAnimations();
      setTimeout(() => egg.classList.remove('visible'), 800);
    }, 4200);
  }

  trigger.addEventListener('dblclick', playEasterEgg);
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      playEasterEgg();
    }
  });
}

/**
 * Toggles the mobile navigation drawer and syncs ARIA state.
 * @returns {void}
 */
function initMobileNavigation() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');

  if (!toggle || !nav) {
    return;
  }

  /**
   * @param {boolean} open
   */
  function setNavOpen(open) {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    const icon = toggle.querySelector('i');
    if (icon) {
      icon.className = open ? 'fas fa-times' : 'fas fa-bars';
    }
  }

  toggle.addEventListener('click', () => {
    setNavOpen(!document.body.classList.contains('nav-open'));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setNavOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setNavOpen(false);
    }
  });

  document.addEventListener('click', (event) => {
    if (!document.body.classList.contains('nav-open')) {
      return;
    }
    const target = event.target;
    if (target instanceof Node && (nav.contains(target) || toggle.contains(target))) {
      return;
    }
    setNavOpen(false);
  });
}

let hasInitialized = false;

/**
 * Bootstraps all page behaviors exactly once.
 * @returns {void}
 */
function initSite() {
  if (hasInitialized) {
    return;
  }
  hasInitialized = true;
  initSectionNavigation();
  initMobileNavigation();
  initLogoEasterEgg();
}

document.addEventListener('site:components-loaded', initSite);
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('[data-include]')) {
    initSite();
  }
});
