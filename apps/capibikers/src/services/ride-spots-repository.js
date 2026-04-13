/**
 * Abstract repository for portal content.
 * A future implementation can pull from a database or remote API.
 */
export class RideSpotsRepository {
  /**
   * Return portal metadata and ride spots.
   *
   * @returns {Promise<import("../data/ride-spots.config.js").rideSpotsConfig>}
   */
  async getPortalData() {
    throw new Error("RideSpotsRepository.getPortalData() must be implemented.");
  }
}
