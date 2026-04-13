/**
 * Real ride spot seed configuration.
 *
 * @typedef {{
 *   id: string,
 *   name: string,
 *   country: string,
 *   continent: string,
 *   lat: number,
 *   lng: number,
 *   year: string,
 *   mood: string,
 *   story: string,
 *   venue: string,
 *   address: string,
 *   tags: string[],
 *   photoUrl: string,
 *   caption: string,
 *   instagramUrl: string,
 *   sourceNote: string
 * }} RideSpot
 */

/**
 * @typedef {{
 *   clubName: string,
 *   motto: string,
 *   mapHeadline: string,
 *   seasonLabel: string,
 *   intro: string,
 *   spots: RideSpot[]
 * }} RidePortalConfig
 */

/** @type {RidePortalConfig} */
export const rideSpotsConfig = {
  clubName: "Capibikers",
  motto: "Sarcastic horsepower, tactical nonsense, and suspiciously committed road trips.",
  mapHeadline: "Sardinian Recon Before Global Domination",
  seasonLabel: "Season 01: real stops loaded",
  intro:
    "The portal reads a seed configuration and can override it with local admin edits, so today it works as a static file and tomorrow it can swap to an API or database without replacing the whole UI.",
  spots: [
    {
      id: "cagliari-bodie-art",
      name: "Cagliari",
      venue: "Bodie Art",
      country: "Italy",
      continent: "Europe",
      lat: 39.2238,
      lng: 9.1282,
      year: "2026",
      mood: "Rock bunker diplomacy",
      address: "Via San Giovanni 254, Cagliari",
      story: "First official checkpoint in the city: loud attitude, strategic beverages, zero signs of moderation.",
      tags: ["night ride", "rock stop", "city checkpoint"],
      photoUrl: "",
      caption:
        "Capibikers checkpoint at Bodie Art. Add the real caption from the related Instagram post when you have it.",
      instagramUrl: "",
      sourceNote: "Seeded from location/address info. Instagram post still to be linked.",
    },
    {
      id: "monastir-bulldog-burger-store",
      name: "Monastir",
      venue: "Bulldog Hamburgeria",
      country: "Italy",
      continent: "Europe",
      lat: 39.3894,
      lng: 9.0446,
      year: "2026",
      mood: "Burger-powered operations",
      address: "Via Michelangelo Buonarroti 10, Monastir",
      story: "Supply mission disguised as dinner. Officially a burger stop, spiritually a mobile strategy summit.",
      tags: ["food stop", "pit stop", "meat diplomacy"],
      photoUrl: "",
      caption:
        "Capibikers stop at Bulldog Hamburgeria. Add the real Instagram caption and photo link when available.",
      instagramUrl: "",
      sourceNote: "Seeded from venue address. Instagram post still to be linked.",
    },
    {
      id: "santa-maria-navarrese",
      name: "Santa Maria Navarrese",
      venue: "Coastal checkpoint",
      country: "Italy",
      continent: "Europe",
      lat: 39.9903,
      lng: 9.68398,
      year: "2026",
      mood: "Sea breeze and bad decisions",
      address: "Santa Maria Navarrese, OG",
      story: "The scenic chapter: helmets on, coastline ahead, dignity left somewhere behind the last curve.",
      tags: ["coast road", "scenic ride", "salt air"],
      photoUrl: "",
      caption:
        "Capibikers coastal checkpoint in Santa Maria Navarrese. Add the matching Instagram post details when ready.",
      instagramUrl: "",
      sourceNote: "Seeded from place coordinates. Instagram post still to be linked.",
    },
  ],
};
