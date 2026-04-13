import { RideSpotsRepository } from "./ride-spots-repository.js";

/**
 * Local config-backed implementation.
 */
export class StaticRideSpotsRepository extends RideSpotsRepository {
  /**
   * @param {import("../data/ride-spots.config.js").rideSpotsConfig} config
   */
  constructor(config) {
    super();
    this.config = config;
  }

  /**
   * @returns {Promise<import("../data/ride-spots.config.js").rideSpotsConfig>}
   */
  async getPortalData() {
    return structuredClone(this.config);
  }
}
