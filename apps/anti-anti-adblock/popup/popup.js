const storageKey = "customRules";
/** @type {{list: HTMLElement, addBtn: HTMLElement, prefillBtn: HTMLButtonElement, scope: HTMLSelectElement, domain: HTMLInputElement, selectors: HTMLInputElement, classes: HTMLInputElement, domainFilter: HTMLSelectElement, count: HTMLElement, empty: HTMLElement}} */
const elements = {
  list: document.getElementById("list"),
  addBtn: document.getElementById("add"),
  prefillBtn: document.getElementById("prefill"),
  scope: document.getElementById("scope"),
  domain: document.getElementById("domain"),
  selectors: document.getElementById("selectors"),
  classes: document.getElementById("classes"),
  domainFilter: document.getElementById("domainFilter"),
  count: document.getElementById("count"),
  empty: document.getElementById("empty")
};

const state = {
  currentDomain: ""
};

/**
 * Loads and normalizes custom rules from extension storage.
 * @returns {Promise<Array<{id: string, domain: string, selectors: string[], bodyClasses: string[], enabled: boolean, createdAt: number}>>}
 */
async function loadCustomRules() {
  const { customRules } = await chrome.storage.sync.get(storageKey);
  const raw = Array.isArray(customRules) ? customRules : [];

  return raw
    .map((rule, index) => RuleUtils.normalizeRule(rule, index))
    .filter((rule) => RuleUtils.isValidRule(rule));
}

/**
 * Persists custom rules to extension storage.
 * @param {Array<object>} rules - Rules payload.
 * @returns {Promise<void>}
 */
async function persistCustomRules(rules) {
  await chrome.storage.sync.set({ [storageKey]: rules });
}

/**
 * Detects normalized domain for the current active tab.
 * @returns {Promise<string>}
 */
async function detectCurrentDomain() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (!tab || !tab.url) return "";

    const parsed = new URL(tab.url);
    if (!/^https?:$/.test(parsed.protocol)) return "";

    return RuleUtils.normalizeDomain(parsed.hostname);
  } catch {
    return "";
  }
}

/**
 * Indicates whether popup form is in global rule mode.
 * @returns {boolean}
 */
function isGlobalScope() {
  return elements.scope.value === "global";
}

/**
 * Updates domain input state based on selected scope.
 * @returns {void}
 */
function setDomainFieldState() {
  const globalScope = isGlobalScope();
  elements.domain.disabled = globalScope;
  elements.prefillBtn.disabled = globalScope;

  if (globalScope) {
    elements.domain.value = "*";
    return;
  }

  if (elements.domain.value === "*" && state.currentDomain) {
    elements.domain.value = state.currentDomain;
  }
}

/**
 * Builds domain filter `<option>` markup from available rules.
 * @param {Array<{domain: string}>} rules - Existing rules.
 * @returns {string}
 */
function buildDomainFilterOptions(rules) {
  const uniqueDomains = [...new Set(rules.map((rule) => rule.domain))].sort((a, b) => a.localeCompare(b));
  const options = ['<option value="__all__">All domains</option>'];

  if (uniqueDomains.includes("*")) {
    options.push('<option value="*">Global only (*)</option>');
  }

  uniqueDomains
    .filter((domain) => domain !== "*")
    .forEach((domain) => {
      const safeDomain = RuleUtils.escapeHtml(domain);
      options.push(`<option value="${safeDomain}">${safeDomain}</option>`);
    });

  return options.join("");
}

/**
 * Returns a short visual label for a rule scope.
 * @param {string} domain - Rule domain.
 * @returns {string}
 */
function scopeLabel(domain) {
  return domain === "*" ? "Global" : "Site";
}

/**
 * Creates one rendered card node for a rule.
 * @param {{id: string, domain: string, selectors: string[], bodyClasses: string[], enabled: boolean}} rule - Rule data.
 * @returns {HTMLElement}
 */
function renderRuleCard(rule) {
  const safeDomain = rule.domain === "*" ? "Global rule (*)" : RuleUtils.escapeHtml(rule.domain);
  const safeSelectors = rule.selectors.map(RuleUtils.escapeHtml).join(", ");
  const safeClasses = rule.bodyClasses.map(RuleUtils.escapeHtml).join(", ");

  const node = document.createElement("article");
  node.className = "rule";
  node.innerHTML = `
    <div class="rule-head">
      <div>
        <strong>${safeDomain}</strong>
        <span class="badge">${scopeLabel(rule.domain)}</span>
      </div>
      <span class="meta">${rule.enabled ? "Enabled" : "Disabled"}</span>
    </div>
    <div class="meta"><strong>Selectors:</strong> ${safeSelectors}</div>
    <div class="meta"><strong>Classes:</strong> ${rule.bodyClasses.length ? safeClasses : "none"}</div>
    <div class="actions">
      <button type="button" class="${rule.enabled ? "" : "success"}" data-action="toggle" data-id="${rule.id}">
        ${rule.enabled ? "Disable" : "Enable"}
      </button>
      <button type="button" class="danger" data-action="delete" data-id="${rule.id}">Delete</button>
    </div>
  `;

  return node;
}

/**
 * Applies selected domain filter and ordering.
 * @param {Array<{domain: string, createdAt: number}>} rules - Rules collection.
 * @returns {Array<any>}
 */
function applyFilter(rules) {
  const filter = elements.domainFilter.value || "__all__";

  return rules
    .filter((rule) => filter === "__all__" || rule.domain === filter)
    .sort((a, b) => a.domain.localeCompare(b.domain) || b.createdAt - a.createdAt);
}

/**
 * Updates summary counter text.
 * @param {Array<any>} visibleRules - Filtered rules.
 * @param {Array<any>} allRules - Full rules list.
 * @returns {void}
 */
function updateCounter(visibleRules, allRules) {
  elements.count.textContent = `${visibleRules.length} rule(s) shown out of ${allRules.length} total`;
}

/**
 * Renders current rules list and filter options.
 * @returns {Promise<void>}
 */
async function renderRules() {
  const rules = await loadCustomRules();
  const previousFilter = elements.domainFilter.value;

  elements.domainFilter.innerHTML = buildDomainFilterOptions(rules);
  if ([...elements.domainFilter.options].some((option) => option.value === previousFilter)) {
    elements.domainFilter.value = previousFilter;
  }

  const visible = applyFilter(rules);

  elements.list.innerHTML = "";
  visible.forEach((rule) => elements.list.appendChild(renderRuleCard(rule)));

  elements.empty.hidden = visible.length > 0;
  updateCounter(visible, rules);
}

/**
 * Reads form values and returns a normalized rule object.
 * @returns {{id: string, domain: string, selectors: string[], bodyClasses: string[], enabled: boolean, createdAt: number}}
 */
function readFormRule() {
  const globalScope = isGlobalScope();
  const domain = globalScope ? "*" : RuleUtils.normalizeDomain(elements.domain.value);
  const selectors = RuleUtils.splitCsv(elements.selectors.value);
  const bodyClasses = RuleUtils.splitCsv(elements.classes.value);

  return {
    id: `rule-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    domain,
    selectors,
    bodyClasses,
    enabled: true,
    createdAt: Date.now()
  };
}

/**
 * Clears form fields after successful save.
 * @param {{domain: string}} savedRule - Recently saved rule.
 * @returns {void}
 */
function clearFormAfterSave(savedRule) {
  elements.selectors.value = "";
  elements.classes.value = "";

  if (!isGlobalScope()) {
    elements.domain.value = state.currentDomain || savedRule.domain;
  }
}

/**
 * Handles create-rule action from form controls.
 * @returns {Promise<void>}
 */
async function handleAddRule() {
  const newRule = readFormRule();

  if (!RuleUtils.isValidRule(newRule)) {
    alert("Please provide a domain (or global scope) and at least one CSS selector.");
    return;
  }

  const rules = await loadCustomRules();
  rules.push(newRule);

  await persistCustomRules(rules);
  clearFormAfterSave(newRule);
  await renderRules();
}

/**
 * Handles toggle/delete actions from list action buttons.
 * @param {MouseEvent} event - Click event.
 * @returns {Promise<void>}
 */
async function handleRuleActions(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;
  const rules = await loadCustomRules();
  const index = rules.findIndex((rule) => rule.id === id);

  if (index < 0) return;

  if (action === "delete") {
    rules.splice(index, 1);
  }

  if (action === "toggle") {
    rules[index].enabled = !rules[index].enabled;
  }

  await persistCustomRules(rules);
  await renderRules();
}

/**
 * Binds all popup DOM event listeners.
 * @returns {void}
 */
function wireEvents() {
  elements.scope.addEventListener("change", setDomainFieldState);
  elements.prefillBtn.addEventListener("click", () => {
    if (state.currentDomain) {
      elements.domain.value = state.currentDomain;
    }
  });

  elements.addBtn.addEventListener("click", handleAddRule);
  elements.domainFilter.addEventListener("change", renderRules);
  elements.list.addEventListener("click", handleRuleActions);
}

/**
 * Bootstraps popup with detected domain, listeners, and initial render.
 * @returns {Promise<void>}
 */
async function bootstrap() {
  state.currentDomain = await detectCurrentDomain();
  if (state.currentDomain) {
    elements.domain.value = state.currentDomain;
  }

  setDomainFieldState();
  wireEvents();
  await renderRules();
}

bootstrap();
