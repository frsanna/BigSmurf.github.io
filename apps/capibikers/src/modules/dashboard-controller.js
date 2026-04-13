import { renderRideSpotList } from "../components/ride-spot-list.js";
import { buildSpotStats } from "../utils/geo.js";

/**
 * @param {ParentNode} root
 */
export function createDashboardController(root) {
  const statsNode = root.querySelector("[data-stats]");
  const listNode = root.querySelector("[data-spot-list]");
  const chipsNode = root.querySelector("[data-map-chips]");

  /**
   * @param {import("../data/ride-spots.config.js").rideSpotsConfig["spots"]} spots
   */
  function render(spots) {
    const stats = buildSpotStats(spots);

    statsNode.innerHTML = `
      <article class="stat-card">
        <strong>${stats.spotCount}</strong>
        <span>ride spots tracked</span>
      </article>
      <article class="stat-card">
        <strong>${stats.continentCount}</strong>
        <span>continents disturbed</span>
      </article>
      <article class="stat-card">
        <strong>${stats.countryCount}</strong>
        <span>countries bragged about</span>
      </article>
    `;

    chipsNode.innerHTML = [
      `<span class="chip">Config source: static adapter</span>`,
      `<span class="chip">Replace demo data when ready</span>`,
      stats.hasDemo ? `<span class="chip">Current map contains demo spots</span>` : "",
    ].join("");

    listNode.innerHTML = renderRideSpotList(spots);
  }

  /**
   * @param {string} spotId
   */
  function setActiveSpot(spotId) {
    const cards = listNode.querySelectorAll("[data-spot-id]");
    cards.forEach((card) => {
      card.classList.toggle("is-active", card.getAttribute("data-spot-id") === spotId);
    });
  }

  /**
   * @param {(spotId: string) => void} callback
   */
  function onSpotSelect(callback) {
    listNode.addEventListener("click", (event) => {
      const card = event.target.closest("[data-spot-id]");
      if (!(card instanceof HTMLElement)) {
        return;
      }

      callback(card.getAttribute("data-spot-id"));
    });
  }

  return {
    render,
    setActiveSpot,
    onSpotSelect,
  };
}
