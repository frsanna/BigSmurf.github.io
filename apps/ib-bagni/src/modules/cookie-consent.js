/**
 * Banner cookie minimale con consenso persistente.
 *
 * Gli analytics (vedi blocco GA4 commentato in index.html) si attivano
 * soltanto dopo un consenso esplicito. Finché non viene configurato un ID,
 * loadAnalytics() resta una no-op sicura.
 *
 * @returns {void}
 */
const STORAGE_KEY = "ib-cookie-consent";

export function initCookieConsent() {
  const banner = document.getElementById("cookie-banner");

  if (!banner) {
    return;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === "accept") {
    loadAnalytics();
    return;
  }

  if (stored === "reject") {
    return;
  }

  banner.hidden = false;

  banner.addEventListener("click", (event) => {
    const choice = event.target.closest("[data-cookie]")?.dataset.cookie;

    if (!choice) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, choice);
    banner.hidden = true;

    if (choice === "accept") {
      loadAnalytics();
    }
  });
}

/**
 * Attiva Google Analytics solo se è stato configurato un ID e gtag è presente.
 *
 * @returns {void}
 */
function loadAnalytics() {
  const id = window.__ibAnalyticsId;

  if (!id || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("js", new Date());
  window.gtag("config", id);
}
