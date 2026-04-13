(function () {
  const portalData = structuredClone(window.CapibikersPortalData || {});
  const codexEntries = structuredClone(window.CapibikersCodex || []);
  const root = document.getElementById("app");

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function toRad(value) {
    return (value * Math.PI) / 180;
  }

  function haversineDistanceKm(a, b) {
    const earthRadius = 6371;
    const deltaLat = toRad(b.lat - a.lat);
    const deltaLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const arc =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

    return 2 * earthRadius * Math.asin(Math.sqrt(arc));
  }

  function formatKm(value) {
    return new Intl.NumberFormat("it-IT", {
      maximumFractionDigits: 0,
    }).format(value);
  }

  function pickCodexEntry(entries) {
    if (!entries.length) {
      return null;
    }

    return entries[Math.floor(Math.random() * entries.length)];
  }

  function buildSuggestedNextStop(spots, candidates) {
    if (!spots.length || !candidates.length) {
      return null;
    }

    const firstSpot = spots[0];
    const latestSpot = spots[spots.length - 1];
    const visited = new Set(spots.map((spot) => slugify(spot.name)));
    const currentReach = haversineDistanceKm(firstSpot, latestSpot);

    const ranked = candidates
      .filter((candidate) => !visited.has(slugify(candidate.name)))
      .map((candidate) => {
        const fromLatest = haversineDistanceKm(latestSpot, candidate);
        const fromFirst = haversineDistanceKm(firstSpot, candidate);
        const progressGain = fromFirst - currentReach;
        const distanceSweetSpot = 110 - Math.abs(110 - fromLatest);
        const score =
          progressGain * 0.75 +
          distanceSweetSpot * 0.55 +
          (candidate.country === latestSpot.country ? 24 : 0);

        return {
          ...candidate,
          score,
          fromLatest,
        };
      })
      .sort((left, right) => right.score - left.score);

    return ranked[0] || null;
  }

  function buildStats(spots, candidates) {
    const totalKm = spots.slice(1).reduce((sum, spot, index) => {
      return sum + haversineDistanceKm(spots[index], spot);
    }, 0);

    return {
      totalKm,
      countryCount: new Set(spots.map((spot) => spot.country)).size,
      nextSuggestion: buildSuggestedNextStop(spots, candidates),
    };
  }

  function buildPopupHtml(spot) {
    const imageSection = spot.photoUrl
      ? `<img class="leaflet-popup__image" src="${spot.photoUrl}" alt="${spot.name} - ${spot.venue}" />`
      : "";

    const captionSection = spot.caption ? `<p class="leaflet-popup__copy">${spot.caption}</p>` : "";
    const instagramAction = spot.instagramUrl
      ? `<a class="popup-link" href="${spot.instagramUrl}" target="_blank" rel="noopener noreferrer">Apri il post Instagram</a>`
      : "";

    return `
      <article class="leaflet-popup-card">
        ${imageSection}
        <div class="leaflet-popup__body">
          <p class="leaflet-popup__eyebrow">${spot.country} · ${spot.year}</p>
          <h3>${spot.name}</h3>
          <p class="leaflet-popup__venue">${spot.venue}</p>
          <p class="leaflet-popup__copy">${spot.story}</p>
          ${captionSection}
          <p class="leaflet-popup__address">${spot.address}</p>
          <div class="leaflet-popup__actions">
            ${instagramAction}
            <a class="popup-link popup-link--ghost" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${spot.lat},${spot.lng}`)}" target="_blank" rel="noopener noreferrer">Apri su Maps</a>
          </div>
        </div>
      </article>
    `;
  }

  function renderCodexCard(entry) {
    if (!entry) {
      return "";
    }

    return `
      <section class="codex-card">
        <p class="codex-card__kicker">Codex Capibarae</p>
        <h2>${entry.title}</h2>
        <p>${entry.text}</p>
      </section>
    `;
  }

  function renderShell(data) {
    const stats = buildStats(data.spots, data.suggestionCandidates || []);
    const codexEntry = pickCodexEntry(codexEntries);

    root.innerHTML = `
      <main class="portal-shell">
        <header class="site-header" data-header>
          <a class="site-brand" href="#top" aria-label="Capibikers home">
            <img src="./assets/capibikers-logo.png" alt="Logo ufficiale Capibikers" />
            <div class="site-brand__copy">
              <strong>${data.clubName}</strong>
              <span>${data.claim}</span>
            </div>
          </a>
          <nav class="site-nav site-nav--desktop" aria-label="Capibikers sections">
            <a href="#ride-map">Mappamondo</a>
            <a href="#codex">Codex</a>
            <a href="${data.instagramProfileUrl}" target="_blank" rel="noopener noreferrer">Instagram</a>
          </nav>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-label="Apri menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div class="nav-panel">
            <button class="nav-close" type="button" aria-label="Chiudi menu">×</button>
            <div class="nav-panel__wash" aria-hidden="true">
              <img src="./assets/capibikers-logo.png" alt="" />
            </div>
            <div class="nav-panel__approved" aria-hidden="true">
              <img src="./assets/capibikers-approved.png" alt="" />
            </div>
            <div class="nav-panel__intro">
              <p class="nav-panel__eyebrow">Capibikers mobile menu</p>
              <h2>Muoviti nel portale</h2>
              <p>Roadbook, codex e Instagram del branco, senza perdersi in mezzo alla mappa.</p>
            </div>
            <nav class="site-nav site-nav--mobile" aria-label="Capibikers sections">
              <a href="#ride-map">Mappamondo</a>
              <a href="#codex">Codex</a>
              <a href="${data.instagramProfileUrl}" target="_blank" rel="noopener noreferrer">Instagram</a>
            </nav>
          </div>
        </header>

        <section class="hero-stage" id="top">
          <div class="hero-stage__copy">
            <p class="hero-stage__kicker">Portale ufficiale dei Capibikers</p>
            <h1>${data.clubName}</h1>
            <p class="hero-stage__claim">${data.claim}</p>
            <p class="hero-stage__intro">${data.intro}</p>
            <div class="hero-stage__actions">
              <a class="portal-button portal-button--solid" href="#ride-map">Vai al mappamondo</a>
              <a class="portal-button portal-button--ghost" href="#codex">Apri il Codex</a>
            </div>
          </div>
        </section>

        <section class="stats-ribbon">
          <div class="ribbon-story">
            <p class="ribbon-story__label">Dal Codex Capibarae</p>
            <h2>${data.headline}</h2>
            <p>${data.subheadline}</p>
          </div>
          <dl class="ribbon-stats">
            <div>
              <dt>Tappe</dt>
              <dd>${data.spots.length}</dd>
            </div>
            <div>
              <dt>Km</dt>
              <dd>${formatKm(stats.totalKm)}</dd>
            </div>
            <div>
              <dt>Nazioni</dt>
              <dd>${stats.countryCount}</dd>
            </div>
          </dl>
        </section>

        <section class="portal-grid">
          <section class="map-panel" id="ride-map">
            <div class="section-head">
              <div>
                <p class="section-head__kicker">Mappamondo del branco</p>
                <h2>Dove siamo passati</h2>
              </div>
              <p class="section-head__note">Ogni tappa e un posto vero. Ogni prossima meta e un problema futuro.</p>
            </div>
            <div id="leaflet-map" class="leaflet-map" aria-label="Capibikers world map"></div>
          </section>

          <aside class="side-panel">
            <section class="side-card side-card--oracle">
              <p class="section-head__kicker">Oracolo del giro</p>
              <h3>${stats.nextSuggestion ? "Prossima meta suggerita" : "Meta in arrivo"}</h3>
              ${
                stats.nextSuggestion
                  ? `
                    <p class="side-card__meta">${stats.nextSuggestion.name}, ${stats.nextSuggestion.country}</p>
                    <p>${stats.nextSuggestion.reason}</p>
                    <p class="side-card__footnote">Distanza dalla tappa piu recente: circa ${formatKm(stats.nextSuggestion.fromLatest)} km.</p>
                  `
                  : `<p>Appena il branco allunga il percorso, l'oracolo torna a parlare.</p>`
              }
            </section>

            <section class="side-card side-card--stops">
              <div class="side-card__head">
                <div>
                  <p class="section-head__kicker">Tappe ufficiali</p>
                  <h3>Roadbook del branco</h3>
                </div>
              </div>
              <div class="ride-list" data-ride-list>
                ${data.spots
                  .map(
                    (spot, index) => `
                      <button class="ride-stop" type="button" data-spot-id="${spot.id}">
                        <span class="ride-stop__index">${String(index + 1).padStart(2, "0")}</span>
                        <div class="ride-stop__copy">
                          <strong>${spot.name}</strong>
                          <span>${spot.venue}</span>
                          <small>${spot.address}</small>
                        </div>
                      </button>
                    `,
                  )
                  .join("")}
              </div>
            </section>
          </aside>
        </section>

        <section class="codex-wrap" id="codex">
          ${renderCodexCard(codexEntry)}
        </section>
      </main>
    `;
  }

  function buildMap(data) {
    const map = L.map("leaflet-map", {
      zoomControl: true,
      minZoom: 2,
      worldCopyJump: false,
    }).setView([37, 9], 5);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    const markerIcon = L.divIcon({
      className: "capibikers-marker",
      html: `
        <div class="capibikers-marker__pin">
          <div class="capibikers-marker__badge">
            <img src="./assets/capibikers-logo.png" alt="" />
          </div>
        </div>
      `,
      iconSize: [38, 50],
      iconAnchor: [19, 46],
      popupAnchor: [0, -40],
    });

    const markers = new Map();
    const routeCoordinates = [];

    data.spots.forEach((spot) => {
      const marker = L.marker([spot.lat, spot.lng], { icon: markerIcon })
        .addTo(map)
        .bindPopup(buildPopupHtml(spot), {
          maxWidth: 340,
          className: "capibikers-popup",
        });

      markers.set(spot.id, marker);
      routeCoordinates.push([spot.lat, spot.lng]);
    });

    if (routeCoordinates.length > 1) {
      L.polyline(routeCoordinates, {
        color: "#d3412f",
        weight: 4,
        opacity: 0.88,
        dashArray: "10 8",
      }).addTo(map);
    }

    if (routeCoordinates.length) {
      map.fitBounds(routeCoordinates, {
        padding: [40, 40],
      });
    }

    root.querySelector("[data-ride-list]").addEventListener("click", (event) => {
      const button = event.target.closest("[data-spot-id]");
      if (!(button instanceof HTMLElement)) {
        return;
      }

      const marker = markers.get(button.getAttribute("data-spot-id"));
      if (!marker) {
        return;
      }

      map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 8), {
        duration: 0.85,
      });
      marker.openPopup();

      root.querySelectorAll(".ride-stop").forEach((node) => {
        node.classList.toggle("is-active", node === button);
      });
    });
  }

  function initMobileMenu() {
    const toggle = root.querySelector(".menu-toggle");
    const panel = root.querySelector(".nav-panel");
    const closeButton = root.querySelector(".nav-close");
    const links = panel?.querySelectorAll(".site-nav--mobile a");

    if (!toggle || !panel) {
      return;
    }

    const closeMenu = () => {
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
    };

    const openMenu = () => {
      document.body.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
      panel.scrollTop = 0;
    };

    panel.setAttribute("aria-hidden", "true");

    toggle.addEventListener("click", () => {
      if (document.body.classList.contains("menu-open")) {
        closeMenu();
        return;
      }

      openMenu();
    });

    links.forEach((link) => link.addEventListener("click", closeMenu));
    closeButton?.addEventListener("click", () => {
      closeMenu();
      toggle.focus();
    });

    panel.addEventListener("click", (event) => {
      if (event.target === panel) {
        closeMenu();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  function initHeaderState() {
    const header = root.querySelector("[data-header]");

    if (!header) {
      return;
    }

    const syncHeader = () => {
      header.classList.toggle("is-sticky", window.scrollY > 24);
    };

    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
  }

  function init() {
    if (!portalData.spots?.length) {
      root.innerHTML = "<p>Capibikers data source is empty.</p>";
      return;
    }

    renderShell(portalData);
    initHeaderState();
    initMobileMenu();
    buildMap(portalData);
  }

  init();
})();
