import { createNode } from "../utils/dom.js";

/**
 * Render a reusable information card used by catalog and contact sections.
 *
 * @param {import("../data/site-config.js").InfoCardItem} item
 * @param {"catalog" | "contact"} variant
 * @returns {HTMLElement}
 */
export function renderInfoCard(item, variant) {
  const card = createNode("article", {
    className: `info-card info-card--${variant}`,
    attrs: { "data-reveal": "" }
  });

  if (item.accent) {
    card.style.setProperty("--card-accent", item.accent);
  }

  const header = createNode("div", { className: "info-card__header" });
  const icon = createNode("div", { className: "info-card__icon" });
  const iconGlyph = createNode("i", { className: item.icon, attrs: { "aria-hidden": "true" } });
  const eyebrow = createNode("span", { className: "info-card__eyebrow", text: item.eyebrow });
  const title = createNode("h3", { className: "info-card__title", text: item.title });

  icon.appendChild(iconGlyph);
  header.append(icon, eyebrow, title);
  card.append(header, createNode("p", { text: item.description }));

  if (item.href && item.label) {
    const action = createNode("a", {
      className: "info-card__link",
      text: item.label,
      attrs: { href: item.href }
    });

    if (item.external) {
      action.target = "_blank";
      action.rel = "noreferrer";
    }

    card.appendChild(action);
  }

  return card;
}
