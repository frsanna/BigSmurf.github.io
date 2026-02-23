const storageKey = "customRules";

async function loadCustomRules() {
  const { customRules } = await chrome.storage.sync.get(storageKey);
  const raw = Array.isArray(customRules) ? customRules : [];

  return raw
    .map((rule, index) => RuleUtils.normalizeRule(rule, index))
    .filter((rule) => rule.enabled && RuleUtils.isValidRule(rule));
}

async function getAllRules() {
  const customRules = await loadCustomRules();
  return [...DEFAULT_RULES, ...customRules];
}

function normalizeCurrentHostname() {
  return window.location.hostname.replace(/^www\./, "");
}

function matchRulesForDomain(rules, hostname) {
  return rules
    .filter((rule) => rule.domain === "*" || hostname.includes(rule.domain))
    .map((rule) => ({ selectors: rule.selectors, bodyClasses: rule.bodyClasses }));
}

function removeMatchingNodes(selectors) {
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => node.remove());
  });
}

function removeBodyClasses(classes) {
  classes.forEach((className) => {
    document.body.classList.remove(className);
    document.documentElement.classList.remove(className);
  });
}

function restorePageScroll() {
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}

function cleanPage(rulesForDomain) {
  rulesForDomain.forEach((rule) => {
    removeMatchingNodes(rule.selectors);
    removeBodyClasses(rule.bodyClasses);
  });

  restorePageScroll();
}

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

function runWhenReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
    return;
  }

  callback();
}

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
