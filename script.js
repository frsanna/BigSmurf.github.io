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
 * Restarts a CSS animation on an element.
 * @param {HTMLElement} element
 * @param {string} animation
 */
function restartAnimation(element, animation) {
  element.style.animation = 'none';
  element.offsetHeight;
  element.style.animation = animation;
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
  const tagline = egg.querySelector('.egg-tagline');
  const hint = egg.querySelector('.egg-hint');
  const eggCta = egg.querySelector('.egg-cta');
  const backdrop = egg.querySelector('[data-egg-close]');
  const letterF = egg.querySelector('.letter-f');
  const letterS = egg.querySelector('.letter-s');

  if (!letters || !tagline || !hint) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const displayMs = prefersReducedMotion ? 2800 : 6400;
  const reverseDelayMs = prefersReducedMotion ? 400 : 700;

  /**
   * Replays all forward animation tracks from the initial state.
   * @returns {void}
   */
  function resetAnimations() {
    hLines.forEach((line) => restartAnimation(line, 'draw-h 0.8s forwards'));
    vLines.forEach((line) => restartAnimation(line, 'draw-v 0.8s forwards'));

    squares.forEach((square, index) => {
      restartAnimation(square, `pop 0.4s ${1.8 + index * 0.4}s forwards`);
    });

    [letters, tagline, hint, eggCta, letterF, letterS].forEach((el) => {
      if (el) {
        el.style.animation = 'none';
        el.style.opacity = '0';
      }
    });
    letters.style.transform = 'translateY(12px) scale(0.92)';
    tagline.style.transform = 'translateY(8px)';
    hint.style.transform = 'translateY(8px)';
    if (eggCta) {
      eggCta.style.transform = 'translateY(8px)';
    }
    if (letterF) {
      letterF.style.transform = 'translateX(8px)';
    }
    if (letterS) {
      letterS.style.transform = 'translateX(-8px)';
    }

    letters.offsetHeight;
    if (!prefersReducedMotion) {
      restartAnimation(letters, 'egg-letters-in 0.75s cubic-bezier(0.22, 1, 0.36, 1) 1.9s forwards');
      if (letterF) {
        restartAnimation(letterF, 'egg-letter-merge 0.55s ease 2.35s forwards');
      }
      if (letterS) {
        restartAnimation(letterS, 'egg-letter-merge 0.55s ease 2.35s forwards');
      }
      restartAnimation(tagline, 'egg-caption-in 0.55s ease 2.65s forwards');
      restartAnimation(hint, 'egg-caption-in 0.55s ease 2.95s forwards');
      if (eggCta) {
        restartAnimation(eggCta, 'egg-caption-in 0.55s ease 3.25s forwards');
      }
    } else {
      letters.style.opacity = '1';
      letters.style.transform = 'none';
      tagline.style.opacity = '1';
      tagline.style.transform = 'none';
      hint.style.opacity = '1';
      hint.style.transform = 'none';
      if (eggCta) {
        eggCta.style.opacity = '1';
        eggCta.style.transform = 'none';
      }
      if (letterF) {
        letterF.style.transform = 'none';
      }
      if (letterS) {
        letterS.style.transform = 'none';
      }
    }
  }

  /**
   * Plays reverse tracks to hide the easter egg sequence.
   * @returns {void}
   */
  function reverseAnimations() {
    if (eggCta) {
      restartAnimation(eggCta, 'egg-caption-out 0.3s forwards');
    }
    restartAnimation(hint, 'egg-caption-out 0.35s 0.05s forwards');
    restartAnimation(tagline, 'egg-caption-out 0.35s 0.1s forwards');
    restartAnimation(letters, 'egg-caption-out 0.4s 0.15s forwards');

    squares.forEach((square, index) => {
      restartAnimation(square, `pop-reverse 0.3s ${0.25 + index * 0.15}s forwards`);
    });

    hLines.forEach((line) => restartAnimation(line, 'draw-h-reverse 0.4s 0.55s forwards'));
    vLines.forEach((line) => restartAnimation(line, 'draw-v-reverse 0.4s 0.55s forwards'));
  }

  let hideTimer = null;
  let reverseTimer = null;

  /**
   * Hides the easter egg overlay.
   * @param {boolean} [animate=true]
   * @returns {void}
   */
  function closeEasterEgg(animate = true) {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    if (reverseTimer) {
      clearTimeout(reverseTimer);
      reverseTimer = null;
    }

    if (!egg.classList.contains('visible')) {
      return;
    }

    if (animate) {
      reverseAnimations();
      hideTimer = setTimeout(() => {
        egg.classList.remove('visible');
        egg.setAttribute('aria-hidden', 'true');
      }, reverseDelayMs);
      return;
    }

    egg.classList.remove('visible');
    egg.setAttribute('aria-hidden', 'true');
  }

  /**
   * Runs a full easter egg cycle (forward then reverse).
   * @returns {void}
   */
  function playEasterEgg() {
    closeEasterEgg(false);

    resetAnimations();
    egg.classList.add('visible');
    egg.setAttribute('aria-hidden', 'false');

    reverseTimer = setTimeout(() => closeEasterEgg(true), displayMs);
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => closeEasterEgg(true));
  }
  if (eggCta) {
    eggCta.addEventListener('click', () => closeEasterEgg(false));
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && egg.classList.contains('visible')) {
      closeEasterEgg(true);
    }
  });

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
