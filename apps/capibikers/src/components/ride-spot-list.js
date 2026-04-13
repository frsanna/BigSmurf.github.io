/**
 * @param {import("../data/ride-spots.config.js").rideSpotsConfig["spots"]} spots
 * @returns {string}
 */
export function renderRideSpotList(spots) {
  return spots
    .map(
      (spot) => `
        <button class="list-card" type="button" data-spot-id="${spot.id}">
          <p class="list-card__meta">${spot.continent} · ${spot.country} · ${spot.year}</p>
          <h3 class="list-card__title">${spot.name}</h3>
          <p class="list-card__story">${spot.story}</p>
          <div class="pill-row">
            <span class="pill">${spot.mood}</span>
            ${spot.tags.map((tag) => `<span class="pill">${tag}</span>`).join("")}
            ${spot.isDemo ? '<span class="pill">demo spot</span>' : ""}
          </div>
        </button>
      `,
    )
    .join("");
}
