// Logo easter egg: double-click (or Enter/Space) on the portrait.
// Verbatim from the previous site.
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
  const stage = egg.querySelector('.egg-stage');

  if (!letters || !tagline || !hint) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const displayMs = 6400;
  const reverseDelayMs = prefersReducedMotion ? 400 : 700;

  /**
   * Replays all forward animation tracks from the initial state.
   * @returns {void}
   */
  function resetAnimations() {
    if (prefersReducedMotion) {
      hLines.forEach((line) => { line.style.animation = 'none'; line.style.width = '100%'; });
      vLines.forEach((line) => { line.style.animation = 'none'; line.style.height = '100%'; });
      squares.forEach((square) => { square.style.animation = 'none'; square.style.transform = 'scale(1)'; });
    } else {
      hLines.forEach((line) => { line.style.width = ''; restartAnimation(line, 'draw-h 0.8s forwards'); });
      vLines.forEach((line) => { line.style.height = ''; restartAnimation(line, 'draw-v 0.8s forwards'); });
      squares.forEach((square, index) => {
        square.style.transform = '';
        restartAnimation(square, `pop 0.4s ${1.8 + index * 0.4}s forwards`);
      });
    }

    [letters, tagline, hint, eggCta].forEach((el) => {
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
  function closeEasterEgg(animate = true, restoreFocus = true) {
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

    const hadFocus = egg.contains(document.activeElement);
    if (hadFocus && restoreFocus) {
      trigger.focus({ preventScroll: true });
    }

    if (animate && !prefersReducedMotion) {
      reverseAnimations();
      hideTimer = setTimeout(() => {
        egg.classList.remove('visible');
        egg.setAttribute('aria-hidden', 'true');
        egg.inert = true;
      }, reverseDelayMs);
      return;
    }

    egg.classList.remove('visible');
    egg.setAttribute('aria-hidden', 'true');
    egg.inert = true;
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
    egg.inert = false;
    if (stage) {
      stage.focus({ preventScroll: true });
    }
    scheduleClose();
  }

  /**
   * Auto-closes after `displayMs`, but never while the overlay is hovered or focused.
   * @returns {void}
   */
  function scheduleClose() {
    clearTimeout(reverseTimer);
    reverseTimer = setTimeout(() => {
      if (egg.matches(':hover') || egg.contains(document.activeElement) && document.activeElement !== stage) {
        scheduleClose();
        return;
      }
      closeEasterEgg(true);
    }, displayMs);
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => closeEasterEgg(true));
  }
  if (eggCta) {
    // The CTA navigates to #contact: let focus follow the link instead of jumping back to the hero.
    eggCta.addEventListener('click', () => closeEasterEgg(false, false));
  }

  // Keyboard focus leaving the overlay closes it, so focus is never hidden behind it.
  egg.addEventListener('focusout', (event) => {
    if (egg.classList.contains('visible') && event.relatedTarget && !egg.contains(event.relatedTarget)) {
      closeEasterEgg(true, false);
    }
  });

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
