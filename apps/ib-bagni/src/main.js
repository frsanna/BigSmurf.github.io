import { initHeaderState } from "./modules/header.js";
import { initInstagramGallery } from "./modules/gallery.js";
import { initInfoCardSections } from "./modules/info-sections.js";
import { initMobileMenu } from "./modules/mobile-menu.js";
import { observeRevealItems } from "./modules/reveal.js";
import { initParallax } from "./modules/parallax.js";
import { initCookieConsent } from "./modules/cookie-consent.js";

/**
 * Boot the static site UI.
 *
 * @returns {Promise<void>}
 */
async function initSite() {
  await initInfoCardSections();
  observeRevealItems();
  initHeaderState();
  initMobileMenu();
  initParallax();
  initCookieConsent();
  await initInstagramGallery();
}

initSite();
