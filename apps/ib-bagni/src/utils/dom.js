/**
 * Create a DOM node with optional classes, text, HTML and attributes.
 *
 * @param {string} tagName
 * @param {{
 *   className?: string,
 *   text?: string,
 *   html?: string,
 *   attrs?: Record<string, string>
 * }} [options]
 * @returns {HTMLElement}
 */
export function createNode(tagName, { className, text, html, attrs } = {}) {
  const node = document.createElement(tagName);

  if (className) {
    node.className = className;
  }

  if (text) {
    node.textContent = text;
  }

  if (html) {
    node.innerHTML = html;
  }

  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      node.setAttribute(key, value);
    });
  }

  return node;
}
