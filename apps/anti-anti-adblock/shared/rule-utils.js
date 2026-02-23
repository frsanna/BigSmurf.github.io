(function initRuleUtils(globalScope) {
  function splitCsv(value) {
    return String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function normalizeDomain(domain) {
    return String(domain || "")
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/.*$/, "");
  }

  function sanitizeRuleArrays(rule) {
    const selectors = Array.isArray(rule.selectors)
      ? rule.selectors.map((item) => String(item).trim()).filter(Boolean)
      : [];
    const bodyClasses = Array.isArray(rule.bodyClasses)
      ? rule.bodyClasses.map((item) => String(item).trim()).filter(Boolean)
      : [];

    return { selectors, bodyClasses };
  }

  function makeLegacyId(index, domain, selectors, bodyClasses) {
    return `legacy-${index}-${domain}-${selectors.join("|")}-${bodyClasses.join("|")}`;
  }

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

  function isValidRule(rule) {
    return !!rule && (rule.domain === "*" || !!rule.domain) && Array.isArray(rule.selectors) && rule.selectors.length > 0;
  }

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
