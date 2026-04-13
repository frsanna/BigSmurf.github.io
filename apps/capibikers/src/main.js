import { renderAppShell } from "./components/app-shell.js";
import { rideSpotsConfig } from "./data/ride-spots.config.js";
import { createDashboardController } from "./modules/dashboard-controller.js";
import { createMapController } from "./modules/map-controller.js";
import { StaticRideSpotsRepository } from "./services/static-ride-spots-repository.js";

/**
 * Boot the Capibikers portal.
 *
 * @returns {Promise<void>}
 */
async function init() {
  const root = document.getElementById("app");
  const repository = new StaticRideSpotsRepository(rideSpotsConfig);
  const portalData = await repository.getPortalData();

  root.innerHTML = renderAppShell(portalData);

  const map = createMapController(root);
  const dashboard = createDashboardController(root);

  map.render(portalData.spots);
  dashboard.render(portalData.spots);

  const firstSpot = portalData.spots[0];
  if (firstSpot) {
    map.setActiveSpot(firstSpot.id);
    dashboard.setActiveSpot(firstSpot.id);
  }

  const syncSelection = (spotId) => {
    map.centerOnSpot(spotId);
    map.setActiveSpot(spotId);
    dashboard.setActiveSpot(spotId);
  };

  map.onSpotSelect(syncSelection);
  dashboard.onSpotSelect(syncSelection);
}

init();
