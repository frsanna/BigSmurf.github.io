/**
 * Reveal the floating pill header once the user has scrolled
 * past ~65 % of the hero section height.
 *
 * The header starts with opacity 0 / pointer-events none (CSS default)
 * and receives the "is-visible" class when the threshold is crossed.
 *
 * @returns {void}
 */
export function initHeaderState() {
  const header = document.querySelector("[data-header]");

  if (!header) {
    return;
  }

  const hero = document.querySelector(".hero");

  const getThreshold = () =>
    hero ? hero.offsetHeight * 0.65 : window.innerHeight * 0.65;

  const syncHeader = () => {
    header.classList.toggle("is-visible", window.scrollY > getThreshold());
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
  window.addEventListener("resize", syncHeader, { passive: true });
}
