import { siteConfig } from "../data/site-config.js";

/**
 * Return catalog cards from the active content source.
 *
 * @returns {Promise<import("../data/site-config.js").InfoCardItem[]>}
 */
export async function getCatalogCards() {
  return structuredClone(siteConfig.catalogCards);
}

/**
 * Return contact cards from the active content source.
 *
 * @returns {Promise<import("../data/site-config.js").InfoCardItem[]>}
 */
export async function getContactCards() {
  return structuredClone(siteConfig.contactCards);
}

/**
 * Return gallery fallback items from the active content source.
 *
 * @returns {Promise<import("../data/site-config.js").GalleryItem[]>}
 */
export async function getFallbackGalleryItems() {
  return structuredClone(siteConfig.fallbackGalleryItems);
}
