import { projectLatLngToPercent } from "../utils/geo.js";

const INITIAL_SCALE = 1;
const MAX_SCALE = 2.8;
const MIN_SCALE = 1;
const FOCUS_SCALE = 1.65;

/**
 * @param {ParentNode} root
 */
export function createMapController(root) {
  const board = root.querySelector("[data-map-board]");
  const viewport = root.querySelector("[data-map-viewport]");
  const pinLayer = root.querySelector("[data-map-pins]");
  const controls = root.querySelectorAll("[data-map-action]");

  /** @type {import("../data/ride-spots.config.js").rideSpotsConfig["spots"]} */
  let spots = [];
  let scale = INITIAL_SCALE;
  let translateX = 0;
  let translateY = 0;
  let dragState = null;

  function applyTransform() {
    viewport.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  function getPanBounds() {
    const width = board.clientWidth;
    const height = board.clientHeight;

    return {
      x: Math.max(0, ((scale - 1) * width) / 2),
      y: Math.max(0, ((scale - 1) * height) / 2),
    };
  }

  function clampTranslation() {
    const bounds = getPanBounds();
    translateX = Math.min(bounds.x, Math.max(-bounds.x, translateX));
    translateY = Math.min(bounds.y, Math.max(-bounds.y, translateY));
  }

  function setScale(nextScale) {
    scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale));
    clampTranslation();
    applyTransform();
  }

  function resetView() {
    scale = INITIAL_SCALE;
    translateX = 0;
    translateY = 0;
    applyTransform();
  }

  /**
   * @param {string} spotId
   */
  function setActiveSpot(spotId) {
    const pins = pinLayer.querySelectorAll("[data-spot-id]");
    pins.forEach((pin) => {
      pin.classList.toggle("is-active", pin.getAttribute("data-spot-id") === spotId);
    });
  }

  /**
   * @param {string} spotId
   */
  function centerOnSpot(spotId) {
    const spot = spots.find((entry) => entry.id === spotId);
    if (!spot) {
      return;
    }

    if (scale < FOCUS_SCALE) {
      scale = FOCUS_SCALE;
    }

    const position = projectLatLngToPercent(spot.lat, spot.lng);
    const width = board.clientWidth;
    const height = board.clientHeight;
    translateX = width / 2 - position.x * width * scale;
    translateY = height / 2 - position.y * height * scale;
    clampTranslation();
    applyTransform();
    setActiveSpot(spotId);
  }

  /**
   * @param {import("../data/ride-spots.config.js").rideSpotsConfig["spots"]} nextSpots
   */
  function render(nextSpots) {
    spots = nextSpots;
    pinLayer.innerHTML = spots
      .map((spot) => {
        const point = projectLatLngToPercent(spot.lat, spot.lng);
        return `
          <button
            class="map-pin"
            type="button"
            data-spot-id="${spot.id}"
            style="left: ${point.x * 100}%; top: ${point.y * 100}%;"
            aria-label="${spot.name}, ${spot.country}"
            title="${spot.name}"
          >
            <span class="map-pin__pulse" aria-hidden="true"></span>
            <img src="./assets/capibikers-pin.svg" alt="" aria-hidden="true" />
          </button>
        `;
      })
      .join("");
  }

  /**
   * @param {(spotId: string) => void} callback
   */
  function onSpotSelect(callback) {
    pinLayer.addEventListener("click", (event) => {
      const pin = event.target.closest("[data-spot-id]");
      if (!(pin instanceof HTMLElement)) {
        return;
      }

      callback(pin.getAttribute("data-spot-id"));
    });
  }

  controls.forEach((control) => {
    control.addEventListener("click", () => {
      const action = control.getAttribute("data-map-action");
      if (action === "zoom-in") {
        setScale(scale + 0.25);
      } else if (action === "zoom-out") {
        setScale(scale - 0.25);
      } else {
        resetView();
      }
    });
  });

  board.addEventListener("wheel", (event) => {
    event.preventDefault();
    setScale(scale + (event.deltaY < 0 ? 0.16 : -0.16));
  });

  board.addEventListener("pointerdown", (event) => {
    dragState = {
      startX: event.clientX,
      startY: event.clientY,
      baseX: translateX,
      baseY: translateY,
    };
    viewport.classList.add("is-dragging");
  });

  board.addEventListener("pointermove", (event) => {
    if (!dragState) {
      return;
    }

    translateX = dragState.baseX + event.clientX - dragState.startX;
    translateY = dragState.baseY + event.clientY - dragState.startY;
    clampTranslation();
    applyTransform();
  });

  const stopDragging = () => {
    dragState = null;
    viewport.classList.remove("is-dragging");
  };

  board.addEventListener("pointerup", stopDragging);
  board.addEventListener("pointerleave", stopDragging);
  window.addEventListener("resize", () => {
    clampTranslation();
    applyTransform();
  });

  return {
    render,
    setActiveSpot,
    centerOnSpot,
    onSpotSelect,
    resetView,
  };
}
