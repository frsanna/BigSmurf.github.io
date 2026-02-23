const storageKey = "customRules";
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

async function loadCustomRules() {
  const { customRules } = await chrome.storage.sync.get(storageKey);
  const raw = Array.isArray(customRules) ? customRules : [];

  return raw
    .map((rule, index) => RuleUtils.normalizeRule(rule, index))
    .filter((rule) => RuleUtils.isValidRule(rule));
}

async function persistCustomRules(rules) {
  await chrome.storage.sync.set({ [storageKey]: rules });
}

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

function isGlobalScope() {
  return elements.scope.value === "global";
}

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

function scopeLabel(domain) {
  return domain === "*" ? "Global" : "Site";
}

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

function applyFilter(rules) {
  const filter = elements.domainFilter.value || "__all__";

  return rules
    .filter((rule) => filter === "__all__" || rule.domain === filter)
    .sort((a, b) => a.domain.localeCompare(b.domain) || b.createdAt - a.createdAt);
}

function updateCounter(visibleRules, allRules) {
  elements.count.textContent = `${visibleRules.length} rule(s) shown out of ${allRules.length} total`;
}

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

function clearFormAfterSave(savedRule) {
  elements.selectors.value = "";
  elements.classes.value = "";

  if (!isGlobalScope()) {
    elements.domain.value = state.currentDomain || savedRule.domain;
  }
}

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
