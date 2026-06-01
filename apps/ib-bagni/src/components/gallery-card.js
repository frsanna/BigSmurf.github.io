import { createNode } from "../utils/dom.js";

// La prima tile è grande (2×2); le altre riempiono una griglia 3×3 senza buchi.
const galleryLayoutClasses = [
  "gallery-card gallery-card-xl",
  "gallery-card",
  "gallery-card",
  "gallery-card",
  "gallery-card",
  "gallery-card"
];

/**
 * Render one gallery card.
 *
 * @param {import("../data/site-config.js").GalleryItem} item
 * @param {number} index
 * @returns {HTMLElement}
 */
export function renderGalleryCard(item, index) {
  const card = createNode("a", {
    className: galleryLayoutClasses[index] || "gallery-card",
    attrs: {
      href: item.postUrl,
      target: "_blank",
      rel: "noreferrer",
      "data-reveal": ""
    }
  });

  const image = createNode("img", {
    attrs: {
      src: item.image,
      alt: item.alt,
      loading: "lazy"
    }
  });

  const copy = createNode("div", { className: "gallery-copy" });
  copy.append(
    createNode("span", { text: item.label }),
    createNode("strong", { text: item.title })
  );

  card.append(image, copy);
  return card;
}
