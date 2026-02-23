/** @type {Array<{domain: string, selectors: string[], bodyClasses: string[]}>} */
const DEFAULT_RULES = [
  { domain: "libero.it", selectors: ["#adbModal", ".adb-modal"], bodyClasses: ["adb-lock"] },
  { domain: "ilfattoquotidiano.it", selectors: [".qc-cmp2-container", ".blocco-adv"], bodyClasses: ["no-scroll"] },
  { domain: "repubblica.it", selectors: [".paywall", "[id^='pw_']"], bodyClasses: ["locked"] },
  { domain: "corriere.it", selectors: [".paywall", ".modal-paywall"], bodyClasses: ["pw-open"] },
  { domain: "mediaset.it", selectors: ["#modal-adblock", ".adblock-detect"], bodyClasses: ["adblock-detected"] },
  { domain: "tgcom24.mediaset.it", selectors: [".adblock-overlay"], bodyClasses: ["no-scroll"] },
  { domain: "fanpage.it", selectors: [".adb-overlay", "#adblocker-modal"], bodyClasses: ["adb-active"] },
  { domain: "virgilio.it", selectors: ["#advModal", ".modal-adv"], bodyClasses: ["modal-open"] },
  { domain: "leggo.it", selectors: [".adblock-message", ".overlay-adblock"], bodyClasses: ["locked"] },
  { domain: "ilmessaggero.it", selectors: [".adblock-wall", "#blockAdblock"], bodyClasses: ["no-scroll"] },
  { domain: "tuttojuve.com", selectors: [".adb-modal"], bodyClasses: ["adb-detected"] },
  { domain: "hdblog.it", selectors: [".adblocker-detector"], bodyClasses: ["adb-detected"] },
  { domain: "tomshw.it", selectors: [".adblock-warning"], bodyClasses: ["no-scroll"] },
  { domain: "multiplayer.it", selectors: [".adblock-modal"], bodyClasses: ["modal-open"] }
];
