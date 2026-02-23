// include-components.js
(() => {
  function getInlineComponent(source) {
    if (!window.__INLINE_COMPONENTS) {
      return null;
    }
    return window.__INLINE_COMPONENTS[source] || null;
  }

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
