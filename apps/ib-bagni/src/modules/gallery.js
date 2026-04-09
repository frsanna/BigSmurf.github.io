import { renderGalleryCard } from "../components/gallery-card.js";
import { getFallbackGalleryItems } from "../services/content-service.js";
import { observeRevealItems } from "./reveal.js";

/**
 * Load the gallery manifest and render a local fallback when unavailable.
 *
 * @returns {Promise<void>}
 */
export async function initInstagramGallery() {
  const container = document.getElementById("instagram-gallery");

  if (!container) {
    return;
  }

  container.innerHTML = '<div class="gallery-loading">Caricamento galleria...</div>';

  try {
    const response = await fetch("assets/gallery/gallery-data.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Gallery manifest unavailable");
    }

    const items = await response.json();
    const fragment = document.createDocumentFragment();
    items.forEach((item, index) => fragment.appendChild(renderGalleryCard(item, index)));
    container.replaceChildren(fragment);
  } catch (error) {
    const fallbackItems = await getFallbackGalleryItems();
    const fragment = document.createDocumentFragment();
    fallbackItems.forEach((item, index) => {
      fragment.appendChild(renderGalleryCard(item, index));
    });
    container.replaceChildren(fragment);
  }

  observeRevealItems(container);
}
