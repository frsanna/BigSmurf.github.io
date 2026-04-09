/**
 * Toggle sticky header styles once the visitor starts scrolling.
 *
 * @returns {void}
 */
export function initHeaderState() {
  const header = document.querySelector("[data-header]");

  if (!header) {
    return;
  }

  const syncHeader = () => {
    header.classList.toggle("is-sticky", window.scrollY > 24);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
}
