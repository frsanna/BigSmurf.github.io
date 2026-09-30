(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const model = CountdownLogic.create(
    typeof COUNTDOWN_CONFIG === "object" && COUNTDOWN_CONFIG ? COUNTDOWN_CONFIG : {},
  );

  const placeNode = document.getElementById("place");
  const instantNode = document.getElementById("instant");
  const readout = document.getElementById("readout");
  const statusNode = document.getElementById("status");
  const frame = document.querySelector(".frame");
  const flash = document.querySelector(".flash");
  const scratch = document.querySelector(".scratch");
  const bands = document.querySelectorAll(".band");
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

  function now() {
    return new Date(Date.now() + offset);
  }

  function render() {
    const current = now();
    const phase = model.phase(current);
    const level = model.signal(current);
    document.body.dataset.phase = phase;
    document.body.dataset.storm = level >= 0.72 ? "high" : "low";
    document.documentElement.style.setProperty("--static", level.toFixed(3));

    const showClock = phase !== "sealed" && phase !== "fault";
    readout.hidden = !showClock;
    instantNode.hidden = phase === "fault";

    if (showClock) {
      const left = model.remaining(current);
      values.days.textContent = String(left.days).padStart(2, "0");
      values.hours.textContent = String(left.hours).padStart(2, "0");
      values.minutes.textContent = String(left.minutes).padStart(2, "0");
      values.seconds.textContent = String(left.seconds).padStart(2, "0");
    }

    if (phase === "fault") {
      writeStatus("Istante illeggibile.", "fault");
    } else if (phase === "open" || phase === "sealed") {
      writeStatus(`${model.place}. ${model.instantLabel}.`, phase);
    } else {
      const left = model.remaining(current);
      writeStatus(
        `${left.days} giorni, ${left.hours} ore, ${left.minutes} minuti.`,
        `${left.days}-${left.hours}-${left.minutes}`,
      );
    }
  }

  function writeStatus(text, key) {
    if (key === statusKey) return;
    statusKey = key;
    statusNode.textContent = text;
  }

  function flickerOnce(level) {
    const roll = Math.random();
    const flashCut = 0.04 + level * 0.3;
    const tearCut = flashCut + 0.08 + level * 0.24;

    if (roll < flashCut) {
      flash.classList.add("on");
      window.setTimeout(() => flash.classList.remove("on"), 36 + level * 90);
      if (level > 0.85) disturbFrame(level);
      return;
    }

    if (roll < tearCut) {
      signalBand(level);
      if (level > 0.8 && Math.random() < 0.65) signalBand(level);
      if (level > 0.9) disturbFrame(level);
      return;
    }

    if (level > 0.35 && roll < tearCut + 0.18) {
      disturbFrame(level);
      return;
    }

    if (level > 0.2 && Math.random() < 0.3 + level * 0.3) {
      scratch.style.left = `${4 + Math.random() * 90}%`;
      scratch.classList.add("on");
      window.setTimeout(() => scratch.classList.remove("on"), 90 + level * 80);
    }

    const nodes = document.querySelectorAll("[data-flick]");
    if (!nodes.length) return;
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    const kick = 2 + level * 14;
    node.style.setProperty("--kick", `${(Math.random() < 0.5 ? -1 : 1) * kick}px`);
    node.classList.add("skip");
    window.setTimeout(() => node.classList.remove("skip"), 50 + level * 80);
  }

  function signalBand(level) {
    if (!bands.length) return;
    const band = bands[Math.floor(Math.random() * bands.length)];
    const height = 3 + level * (10 + Math.random() * 36);
    band.style.top = `${Math.random() * 94}%`;
    band.style.height = `${height}px`;
    band.style.transform = `translateX(${(Math.random() - 0.5) * 48 * level}px)`;
    band.classList.add("on");
    window.setTimeout(() => band.classList.remove("on"), 50 + level * 140);
  }

  function disturbFrame(level) {
    const x = (Math.random() - 0.5) * 28 * level;
    const y = (Math.random() - 0.5) * 10 * level;
    frame.style.transform = `translate(${x}px, ${y}px)`;
    window.setTimeout(() => {
      frame.style.transform = "";
    }, 45 + level * 70);
  }

  function waitFor(level) {
    const min = 4200 - level * 3900;
    const max = 9000 - level * 7600;
    return min + Math.random() * Math.max(140, max - min);
  }

  function scheduleWear() {
    window.clearTimeout(wearTimer);
    if (reducedMotion) return;
    const level = model.signal(now());
    if (level <= 0) return;
    wearTimer = window.setTimeout(() => {
      const nextLevel = model.signal(now());
      if (nextLevel > 0 && Math.random() <= 0.62 + nextLevel * 0.38) {
        flickerOnce(nextLevel);
      }
      scheduleWear();
    }, waitFor(level));
  }

  function startClock() {
    render();
    const delay = 1000 - (Date.now() % 1000);
    window.setTimeout(() => {
      render();
      window.setInterval(() => {
        render();
        if (!wearTimer) scheduleWear();
      }, 1000);
    }, delay);
  }

  /**
   * @param {{fault: boolean, timeZone: string, place: string}} clock
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
