(function () {
  const WEAR = {
    calm: { start: 20000, min: 4200, max: 11000, chance: 0.4, flash: 0.08 },
    worn: { start: 16000, min: 2600, max: 7200, chance: 0.55, flash: 0.12 },
    dark: { start: 12000, min: 1400, max: 4600, chance: 0.7, flash: 0.18 },
    critical: { start: 8000, min: 520, max: 2100, chance: 0.88, flash: 0.28 },
    open: { start: 18000, min: 3000, max: 8600, chance: 0.42, flash: 0.1 },
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const model = CountdownLogic.create(
    typeof COUNTDOWN_CONFIG === "object" && COUNTDOWN_CONFIG ? COUNTDOWN_CONFIG : {},
  );

  const placeNode = document.getElementById("place");
  const instantNode = document.getElementById("instant");
  const readout = document.getElementById("readout");
  const statusNode = document.getElementById("status");
  const flash = document.querySelector(".flash");
  const scratch = document.querySelector(".scratch");
  const values = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]'),
  };

  placeNode.textContent = model.place;
  instantNode.textContent = model.instantLabel;
  document.title = model.place || "Countdown";

  const offset = readPreviewOffset(model);
  let wearTimer = 0;
  let statusKey = "";
  const dwellStarted = performance.now();

  function now() {
    return new Date(Date.now() + offset);
  }

  function render() {
    const current = now();
    const phase = model.phase(current);
    document.body.dataset.phase = phase;

    const counting = phase !== "open" && phase !== "sealed" && phase !== "fault";
    readout.hidden = !counting;
    instantNode.hidden = phase === "fault";

    if (counting) {
      const left = model.remaining(current);
      values.days.textContent = String(left.days).padStart(2, "0");
      values.hours.textContent = String(left.hours).padStart(2, "0");
      values.minutes.textContent = String(left.minutes).padStart(2, "0");
      values.seconds.textContent = String(left.seconds).padStart(2, "0");
      writeStatus(
        `${left.days} giorni, ${left.hours} ore, ${left.minutes} minuti.`,
        `${left.days}-${left.hours}-${left.minutes}`,
      );
    } else if (phase === "fault") {
      writeStatus("Istante illeggibile.", "fault");
    } else {
      writeStatus(`${model.place}. ${model.instantLabel}.`, phase);
    }
  }

  function writeStatus(text, key) {
    if (key === statusKey) return;
    statusKey = key;
    statusNode.textContent = text;
  }

  function flickerOnce(phase) {
    const profile = WEAR[phase];
    if (!profile) return;
    const roll = Math.random();
    if (roll < profile.flash) {
      flash.classList.add("on");
      window.setTimeout(() => flash.classList.remove("on"), 40 + Math.random() * 70);
      return;
    }
    if (roll < profile.flash + 0.22) {
      scratch.style.left = `${6 + Math.random() * 88}%`;
      scratch.classList.add("on");
      window.setTimeout(() => scratch.classList.remove("on"), 160);
      return;
    }
    const nodes = document.querySelectorAll("[data-flick]");
    if (!nodes.length) return;
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    node.classList.add("skip");
    window.setTimeout(() => node.classList.remove("skip"), 50 + Math.random() * 90);
  }

  function scheduleWear() {
    window.clearTimeout(wearTimer);
    if (reducedMotion) return;
    const phase = document.body.dataset.phase;
    const profile = WEAR[phase];
    if (!profile) return;
    const elapsed = performance.now() - dwellStarted;
    const wait =
      elapsed < profile.start
        ? profile.start - elapsed
        : profile.min + Math.random() * (profile.max - profile.min);
    wearTimer = window.setTimeout(() => {
      const currentPhase = document.body.dataset.phase;
      const currentProfile = WEAR[currentPhase];
      if (currentProfile && Math.random() <= currentProfile.chance) {
        flickerOnce(currentPhase);
      }
      scheduleWear();
    }, wait);
  }

  function startClock() {
    render();
    const delay = 1000 - (Date.now() % 1000);
    window.setTimeout(() => {
      render();
      window.setInterval(render, 1000);
    }, delay);
  }

  /**
   * @param {{fault: boolean, timeZone: string}} clock
   * @returns {number}
   */
  function readPreviewOffset(clock) {
    const at = new URLSearchParams(window.location.search).get("at");
    if (!at || clock.fault) return 0;
    const preview = CountdownLogic.create({
      place: clock.place,
      timeZone: clock.timeZone,
      target: at,
    });
    if (preview.fault || !preview.target) return 0;
    return preview.target.getTime() - Date.now();
  }

  startClock();
  scheduleWear();
})();
