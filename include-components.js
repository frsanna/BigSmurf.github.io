// include-components.js
(() => {
  /**
   * Returns inline component markup if available.
   * @param {string} source - Component path key.
   * @returns {string|null}
   */
  function getInlineComponent(source) {
    if (!window.__INLINE_COMPONENTS) {
      return null;
    }
    return window.__INLINE_COMPONENTS[source] || null;
  }

  /**
   * Loads component markup from inline map (file://) or fetch (http/https).
   * @param {string} source - Component path.
   * @returns {Promise<string>}
   */
  async function loadComponentMarkup(source) {
    const isFileProtocol = window.location.protocol === 'file:';
    const inlineMarkup = getInlineComponent(source);

    if (isFileProtocol && inlineMarkup) {
      return inlineMarkup;
    }

    const response = await fetch(source, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Failed to load ${source}`);
    }
    return response.text();
  }

  /**
   * Resolves all `data-include` nodes and replaces them with component markup.
   * Dispatches `site:components-loaded` when complete.
   * @returns {Promise<void>}
   */
  async function loadComponents() {
    const includes = Array.from(document.querySelectorAll('[data-include]'));

    if (!includes.length) {
      document.dispatchEvent(new CustomEvent('site:components-loaded'));
      return;
    }

    await Promise.all(
      includes.map(async (node) => {
        const source = node.getAttribute('data-include');
        if (!source) {
          return;
        }

        try {
          node.outerHTML = await loadComponentMarkup(source);
        } catch (error) {
          node.outerHTML = `<!-- include error: ${source} -->`;
        }
      })
    );

    document.dispatchEvent(new CustomEvent('site:components-loaded'));
  }

  document.addEventListener('DOMContentLoaded', loadComponents);
})();
