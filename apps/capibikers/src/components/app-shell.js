import { renderMapScene } from "./map-scene.js";

/**
 * @param {{
 *   clubName: string,
 *   motto: string,
 *   mapHeadline: string,
 *   seasonLabel: string,
 *   intro: string
 * }} portalData
 * @returns {string}
 */
export function renderAppShell(portalData) {
  return `
    <main class="portal">
      <section class="hero">
        <article class="hero-card">
          <span class="eyebrow">${portalData.seasonLabel}</span>
          <div class="hero-copy">
            <h1>${portalData.clubName}</h1>
            <p><strong>${portalData.mapHeadline}.</strong> ${portalData.motto} Built as a playful command center where every stop becomes a badge on the map and every badge feels like a suspiciously confident expedition report.</p>
            <div class="hero-actions">
              <a class="button button--primary" href="#ride-map">Open ride map</a>
              <a class="button button--secondary" href="https://www.instagram.com/capibikersofficial/" target="_blank" rel="noopener noreferrer">Instagram HQ</a>
            </div>
          </div>
        </article>

        <div class="hero-side">
          <article class="hero-card badge-card">
            <img src="./assets/capibikers-badge.svg" alt="Custom Capibikers badge" />
            <div>
              <span class="eyebrow">Custom Badge</span>
              <p>Ho creato un badge originale in SVG con casco, corna e palette calda da road cult ironico. Lo stesso linguaggio visivo viene ripreso nei pin sulla mappa.</p>
            </div>
          </article>

          <article class="hero-card quote-card">
            <span class="eyebrow">Portal Logic</span>
            <p>${portalData.intro} <strong>Quindi il giorno in cui vorrai attaccarlo a un database non dovremo riscrivere la mappa.</strong></p>
          </article>
        </div>
      </section>

      <section class="portal-grid" id="ride-map">
        ${renderMapScene()}
        <aside class="sidebar">
          <section class="panel">
            <div class="panel-header">
              <div>
                <h2>Ride Ledger</h2>
                <p>Every glorious checkpoint, ranked by geography and attitude.</p>
              </div>
            </div>
            <div class="stats" data-stats></div>
          </section>

          <section class="panel">
            <div class="panel-header">
              <div>
                <h2>Route Stories</h2>
                <p>Click a card to focus the badge on the map.</p>
              </div>
            </div>
            <div class="list" data-spot-list></div>
            <p class="footer-note">Aggiorna i punti in <code>src/data/ride-spots.config.js</code>. La UI legge tutto tramite un repository astratto, non direttamente dal rendering.</p>
          </section>
        </aside>
      </section>
    </main>
  `;
}
