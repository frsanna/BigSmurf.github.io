const storageKey = "customRules";

/**
 * Loads and validates user custom rules from extension storage.
 * @returns {Promise<Array<{domain: string, selectors: string[], bodyClasses: string[]}>>}
 */
async function loadCustomRules() {
  const { customRules } = await chrome.storage.sync.get(storageKey);
  const raw = Array.isArray(customRules) ? customRules : [];

  return raw
    .map((rule, index) => RuleUtils.normalizeRule(rule, index))
    .filter((rule) => rule.enabled && RuleUtils.isValidRule(rule));
}

/**
 * Returns the merged set of built-in and custom rules.
 * @returns {Promise<Array<{domain: string, selectors: string[], bodyClasses: string[]}>>}
 */
async function getAllRules() {
  const customRules = await loadCustomRules();
  return [...DEFAULT_RULES, ...customRules];
}

/**
 * Returns normalized hostname for the current page.
 * @returns {string}
 */
function normalizeCurrentHostname() {
  return window.location.hostname.replace(/^www\./, "");
}

/**
 * Filters and maps rules that apply to the current hostname.
 * @param {Array<{domain: string, selectors: string[], bodyClasses: string[]}>} rules - Available rules.
 * @param {string} hostname - Current hostname.
 * @returns {Array<{selectors: string[], bodyClasses: string[]}>}
 */
function matchRulesForDomain(rules, hostname) {
  return rules
    .filter((rule) => rule.domain === "*" || hostname.includes(rule.domain))
    .map((rule) => ({ selectors: rule.selectors, bodyClasses: rule.bodyClasses }));
}

/**
 * Removes all nodes matching each selector.
 * @param {string[]} selectors - CSS selectors.
 * @returns {void}
 */
function removeMatchingNodes(selectors) {
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => node.remove());
  });
}

/**
 * Removes CSS classes from both body and root element.
 * @param {string[]} classes - Class names.
 * @returns {void}
 */
function removeBodyClasses(classes) {
  classes.forEach((className) => {
    document.body.classList.remove(className);
    document.documentElement.classList.remove(className);
  });
}

/**
 * Restores native page scroll after overlay removal.
 * @returns {void}
 */
function restorePageScroll() {
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}

/**
 * Applies all cleanup actions for current-domain rules.
 * @param {Array<{selectors: string[], bodyClasses: string[]}>} rulesForDomain - Matching rules.
 * @returns {void}
 */
function cleanPage(rulesForDomain) {
  rulesForDomain.forEach((rule) => {
    removeMatchingNodes(rule.selectors);
    removeBodyClasses(rule.bodyClasses);
  });

  restorePageScroll();
}

/**
 * Starts mutation observer to keep anti-overlay cleanup active.
 * @param {Array<{selectors: string[], bodyClasses: string[]}>} rulesForDomain - Matching rules.
 * @returns {void}
 */
function startObserver(rulesForDomain) {
  const observer = new MutationObserver((mutations) => {
    const hasAddedNodes = mutations.some((mutation) => mutation.addedNodes && mutation.addedNodes.length > 0);
    if (hasAddedNodes) {
      cleanPage(rulesForDomain);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  cleanPage(rulesForDomain);
}

/**
 * Executes callback immediately if DOM is ready, otherwise on DOMContentLoaded.
 * @param {() => void} callback - Ready callback.
 * @returns {void}
 */
function runWhenReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
    return;
  }

  callback();
}

/**
 * Initializes content script behavior for current tab/domain.
 * @returns {Promise<void>}
 */
async function bootstrap() {
  const hostname = normalizeCurrentHostname();
  const allRules = await getAllRules();
  const rulesForDomain = matchRulesForDomain(allRules, hostname);

  if (!rulesForDomain.length) {
    return;
  }

  runWhenReady(() => startObserver(rulesForDomain));
}

bootstrap();
