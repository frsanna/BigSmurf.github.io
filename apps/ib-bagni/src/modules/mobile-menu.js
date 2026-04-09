/**
 * Initialize the mobile navigation drawer and keep aria state in sync.
 *
 * @returns {void}
 */
export function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const panel = document.querySelector(".nav-panel");
  const links = document.querySelectorAll(".topnav a, .nav-cta a");

  if (!toggle || !panel) {
    return;
  }

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    document.body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    if (document.body.classList.contains("menu-open")) {
      closeMenu();
      return;
    }

    openMenu();
  });

  links.forEach((link) => link.addEventListener("click", closeMenu));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}
