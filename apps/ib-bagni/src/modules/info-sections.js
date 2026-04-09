import { renderInfoCard } from "../components/info-card.js";
import { getCatalogCards, getContactCards } from "../services/content-service.js";

/**
 * Render a list of reusable information cards inside a target container.
 *
 * @param {string} containerId
 * @param {import("../data/site-config.js").InfoCardItem[]} items
 * @param {"catalog" | "contact"} variant
 * @returns {void}
 */
function renderInfoCards(containerId, items, variant) {
  const container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((item) => fragment.appendChild(renderInfoCard(item, variant)));
  container.replaceChildren(fragment);
}

/**
 * Populate the catalog and contact sections from the content service layer.
 *
 * @returns {Promise<void>}
 */
export async function initInfoCardSections() {
  const [catalogCards, contactCards] = await Promise.all([
    getCatalogCards(),
    getContactCards()
  ]);

  renderInfoCards("catalog-cards", catalogCards, "catalog");
  renderInfoCards("contact-cards", contactCards, "contact");
}
