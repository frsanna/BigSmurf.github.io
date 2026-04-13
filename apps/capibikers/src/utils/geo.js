/**
 * Project latitude/longitude to a percentage position on an equirectangular map.
 *
 * @param {number} lat
 * @param {number} lng
 * @returns {{x: number, y: number}}
 */
export function projectLatLngToPercent(lat, lng) {
  const clampedLat = Math.max(-85, Math.min(85, lat));
  const normalizedLng = ((lng + 180) % 360 + 360) % 360;

  return {
    x: normalizedLng / 360,
    y: (90 - clampedLat) / 180,
  };
}

/**
 * Build summary stats for the sidebar.
 *
 * @param {import("../data/ride-spots.config.js").rideSpotsConfig["spots"]} spots
 * @returns {{spotCount: number, continentCount: number, countryCount: number, hasDemo: boolean}}
 */
export function buildSpotStats(spots) {
  return {
    spotCount: spots.length,
    continentCount: new Set(spots.map((spot) => spot.continent)).size,
    countryCount: new Set(spots.map((spot) => spot.country)).size,
    hasDemo: spots.some((spot) => spot.isDemo),
  };
}
