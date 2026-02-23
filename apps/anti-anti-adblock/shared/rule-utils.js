(function initRuleUtils(globalScope) {
  /**
   * Splits a comma-separated string into a trimmed non-empty string array.
   * @param {string} value - Comma-separated input string.
   * @returns {string[]}
   */
  function splitCsv(value) {
    return String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  /**
   * Normalizes a domain or URL fragment into canonical hostname format.
   * @param {string} domain - Raw domain string.
   * @returns {string}
   */
  function normalizeDomain(domain) {
    return String(domain || "")
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/.*$/, "");
  }

  /**
   * Normalizes selector/class arrays by trimming values and removing empties.
   * @param {{selectors?: unknown, bodyClasses?: unknown}} rule - Partial rule object.
   * @returns {{selectors: string[], bodyClasses: string[]}}
   */
  function sanitizeRuleArrays(rule) {
    const selectors = Array.isArray(rule.selectors)
      ? rule.selectors.map((item) => String(item).trim()).filter(Boolean)
      : [];
    const bodyClasses = Array.isArray(rule.bodyClasses)
      ? rule.bodyClasses.map((item) => String(item).trim()).filter(Boolean)
      : [];

    return { selectors, bodyClasses };
  }

  /**
   * Builds a deterministic legacy id for rules without explicit ids.
   * @param {number} index - Rule index fallback.
   * @param {string} domain - Normalized domain.
   * @param {string[]} selectors - CSS selectors.
   * @param {string[]} bodyClasses - Body classes to remove.
   * @returns {string}
   */
  function makeLegacyId(index, domain, selectors, bodyClasses) {
    return `legacy-${index}-${domain}-${selectors.join("|")}-${bodyClasses.join("|")}`;
  }

  /**
   * Converts an arbitrary rule input into normalized rule shape.
   * @param {any} rule - Input rule.
   * @param {number} fallbackIndex - Index used for fallback id generation.
   * @returns {{id: string, domain: string, selectors: string[], bodyClasses: string[], enabled: boolean, createdAt: number}}
   */
  function normalizeRule(rule, fallbackIndex) {
    const { selectors, bodyClasses } = sanitizeRuleArrays(rule || {});
    const domain = rule && rule.domain === "*" ? "*" : normalizeDomain(rule && rule.domain);

    return {
      id: rule && rule.id ? String(rule.id) : makeLegacyId(fallbackIndex, domain, selectors, bodyClasses),
      domain,
      selectors,
      bodyClasses,
      enabled: !rule || rule.enabled !== false,
      createdAt: Number.isFinite(rule && rule.createdAt) ? rule.createdAt : 0
    };
  }

  /**
   * Validates a normalized rule.
   * @param {{domain?: string, selectors?: string[]}|null|undefined} rule - Rule candidate.
   * @returns {boolean}
   */
  function isValidRule(rule) {
    return !!rule && (rule.domain === "*" || !!rule.domain) && Array.isArray(rule.selectors) && rule.selectors.length > 0;
  }

  /**
   * Escapes text for safe HTML interpolation.
   * @param {string} value - Raw text.
   * @returns {string}
   */
  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  globalScope.RuleUtils = {
    splitCsv,
    normalizeDomain,
    normalizeRule,
    isValidRule,
    escapeHtml
  };
})(globalThis);
