// script.js
function initSectionNavigation() {
  const container = document.querySelector('.scroll-container');
  const sections = Array.from(document.querySelectorAll('.scroll-container .section'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!container || !sections.length || !prevBtn || !nextBtn) {
    return;
  }

  let current = 0;

  function updateButtons() {
    prevBtn.classList.toggle('hidden', current === 0);
    nextBtn.classList.toggle('hidden', current === sections.length - 1);
  }

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

let hasInitialized = false;

function initSite() {
  if (hasInitialized) {
    return;
  }
  hasInitialized = true;
  initSectionNavigation();
  initLogoEasterEgg();
}

document.addEventListener('site:components-loaded', initSite);
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('[data-include]')) {
    initSite();
  }
});
