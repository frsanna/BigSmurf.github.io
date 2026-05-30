/**
 * Subtle scroll-driven parallax for decorative elements.
 *
 * Usage: add `data-parallax` (defaults to speed 0.32) or
 * `data-parallax="0.5"` for a custom multiplier.
 * Elements translate vertically at (scrollY - sectionTop) * speed.
 *
 * Automatically disabled for `prefers-reduced-motion: reduce`.
 *
 * @returns {void}
 */
export function initParallax() {
  const items = document.querySelectorAll("[data-parallax]");

  if (!items.length) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  function tick() {
    const scrollY = window.scrollY;

    items.forEach((el) => {
      const section = el.closest("section") || el.parentElement;
      const speed = parseFloat(el.dataset.parallax) || 0.32;
      const offset = (scrollY - section.offsetTop) * speed;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  }

  window.addEventListener("scroll", tick, { passive: true });
  window.addEventListener("resize", tick, { passive: true });
  tick();
}
