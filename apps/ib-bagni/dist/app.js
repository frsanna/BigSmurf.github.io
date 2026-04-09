/**
 * @typedef {Object} InfoCardItem
 * @property {string} icon
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} description
 * @property {string} [href]
 * @property {string} [label]
 * @property {boolean} [external]
 * @property {string} [accent]
 */

/**
 * @typedef {Object} GalleryItem
 * @property {string} label
 * @property {string} title
 * @property {string} alt
 * @property {string} image
 * @property {string} postUrl
 */

/**
 * Static content configuration.
 * This module acts as the local content source and can later be replaced
 * or extended by an external CMS/API layer without changing UI modules.
 *
 * @type {{
 *   catalogCards: InfoCardItem[],
 *   contactCards: InfoCardItem[],
 *   fallbackGalleryItems: GalleryItem[]
 * }}
 */
const siteConfig = {
  catalogCards: [
    {
      icon: "fa-solid fa-border-all",
      eyebrow: "Superfici",
      title: "Mattonelle e rivestimenti",
      description:
        "Collezioni per pareti e pavimenti capaci di impostare subito atmosfera, proporzioni e carattere del bagno.",
      accent: "#c6924d"
    },
    {
      icon: "fa-solid fa-sink",
      eyebrow: "Bagno",
      title: "Sanitari e lavabi",
      description:
        "Elementi essenziali scelti per lavorare bene sia in spazi raccolti sia in ambienti piu ampi e scenografici.",
      accent: "#5f7482"
    },
    {
      icon: "fa-solid fa-shower",
      eyebrow: "Comfort",
      title: "Docce e piatti doccia",
      description:
        "Configurazioni pulite, pratiche e contemporanee per costruire una zona doccia bella da vedere e comoda da vivere.",
      accent: "#7d8770"
    },
    {
      icon: "fa-solid fa-compass-drafting",
      eyebrow: "Consulenza",
      title: "Abbinamenti e orientamento",
      description:
        "Supporto nella scelta di materiali, tonalita e finiture per dare continuita visiva a tutto l'ambiente.",
      accent: "#bf8867"
    },
    {
      icon: "fa-solid fa-plus",
      eyebrow: "Showroom",
      title: "Molto altro da scoprire",
      description:
        "Complementi, dettagli coordinati e soluzioni da valutare dal vivo per trovare la combinazione giusta per ogni progetto.",
      accent: "#8f6f5a"
    }
  ],
  contactCards: [
    {
      icon: "fa-solid fa-location-dot",
      eyebrow: "Visita",
      title: "Vieni in negozio",
      description:
        "Nuoro Pratosardo lotto 6. Il modo migliore per capire materiali, finiture e proporzioni e vedere tutto da vicino.",
      href:
        "https://www.google.it/maps/place/IB.BAGNI+Ceramiche/@40.3230337,9.2667657,866m/data=!3m2!1e3!4b1!4m6!3m5!1s0x12de814f11c22a47:0x5925cd0268fe26f5!8m2!3d40.3230337!4d9.2693406!16s%2Fg%2F1xb0n1v2?entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D",
      label: "Apri in Google Maps",
      external: true,
      accent: "#c6924d"
    },
    {
      icon: "fa-solid fa-phone-volume",
      eyebrow: "Contatto diretto",
      title: "Chiama subito",
      description:
        "Per disponibilita, primi consigli e un orientamento rapido sulle soluzioni piu adatte al tuo bagno.",
      href: "tel:+390784294074",
      label: "0784 294074",
      accent: "#5f7482"
    },
    {
      icon: "fa-solid fa-envelope-open-text",
      eyebrow: "Aggiornamenti",
      title: "Mail e Instagram",
      description:
        "Per richieste veloci, aggiornamenti visivi e un primo contatto prima della visita in showroom.",
      href: "mailto:ib.bagni.ceramiche@gmail.com",
      label: "ib.bagni.ceramiche@gmail.com",
      accent: "#7d8770"
    }
  ],
  fallbackGalleryItems: [
    {
      label: "Docce",
      title: "Materie compatte e finiture contemporanee",
      alt: "Piatto doccia esposto nello showroom IB Bagni Ceramiche",
      image: "assets/gallery/post-1.jpg",
      postUrl: "https://www.instagram.com/p/DWqQ19aOJ-i/"
    },
    {
      label: "Ristrutturazioni",
      title: "Interventi che mostrano subito il valore del risultato finale",
      alt: "Prima e dopo di un bagno pubblicato da IB Bagni Ceramiche",
      image: "assets/gallery/post-3.jpg",
      postUrl: "https://www.instagram.com/p/DVGaJCnDLw8/"
    },
    {
      label: "Dettagli",
      title: "Texture e accenti capaci di dare carattere all'ambiente",
      alt: "Dettaglio di rivestimento decorativo pubblicato da IB Bagni Ceramiche",
      image: "assets/gallery/post-4.jpg",
      postUrl: "https://www.instagram.com/p/DU2f8OPDU0A/"
    },
    {
      label: "Superfici",
      title: "Campioni e finiture da confrontare con immediatezza in showroom",
      alt: "Campioni e superfici bagno in showroom",
      image: "assets/gallery/post-6.jpg",
      postUrl: "https://www.instagram.com/p/DT-VVt8jIeA/"
    },
    {
      label: "Decori",
      title: "Superfici decorative per introdurre ritmo, colore e personalita",
      alt: "Decoro ceramico pubblicato su Instagram da IB Bagni Ceramiche",
      image: "assets/gallery/post-2.jpg",
      postUrl: "https://www.instagram.com/p/DVYCdH_jBBG/"
    },
    {
      label: "Progetto",
      title: "Render e immagini utili per orientare la scelta finale",
      alt: "Render bagno pubblicato da IB Bagni Ceramiche",
      image: "assets/gallery/post-5.jpg",
      postUrl: "https://www.instagram.com/p/DUIzXbaDAID/"
    }
  ]
};


/**
 * Return catalog cards from the active content source.
 *
 * @returns {Promise<import("../data/site-config.js").InfoCardItem[]>}
 */
async function getCatalogCards() {
  return structuredClone(siteConfig.catalogCards);
}

/**
 * Return contact cards from the active content source.
 *
 * @returns {Promise<import("../data/site-config.js").InfoCardItem[]>}
 */
async function getContactCards() {
  return structuredClone(siteConfig.contactCards);
}

/**
 * Return gallery fallback items from the active content source.
 *
 * @returns {Promise<import("../data/site-config.js").GalleryItem[]>}
 */
async function getFallbackGalleryItems() {
  return structuredClone(siteConfig.fallbackGalleryItems);
}

/**
 * Create a DOM node with optional classes, text, HTML and attributes.
 *
 * @param {string} tagName
 * @param {{
 *   className?: string,
 *   text?: string,
 *   html?: string,
 *   attrs?: Record<string, string>
 * }} [options]
 * @returns {HTMLElement}
 */
function createNode(tagName, { className, text, html, attrs } = {}) {
  const node = document.createElement(tagName);

  if (className) {
    node.className = className;
  }

  if (text) {
    node.textContent = text;
  }

  if (html) {
    node.innerHTML = html;
  }

  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      node.setAttribute(key, value);
    });
  }

  return node;
}


/**
 * Render a reusable information card used by catalog and contact sections.
 *
 * @param {import("../data/site-config.js").InfoCardItem} item
 * @param {"catalog" | "contact"} variant
 * @returns {HTMLElement}
 */
function renderInfoCard(item, variant) {
  const card = createNode("article", {
    className: `info-card info-card--${variant}`,
    attrs: { "data-reveal": "" }
  });

  if (item.accent) {
    card.style.setProperty("--card-accent", item.accent);
  }

  const header = createNode("div", { className: "info-card__header" });
  const icon = createNode("div", { className: "info-card__icon" });
  const iconGlyph = createNode("i", { className: item.icon, attrs: { "aria-hidden": "true" } });
  const eyebrow = createNode("span", { className: "info-card__eyebrow", text: item.eyebrow });
  const title = createNode("h3", { className: "info-card__title", text: item.title });

  icon.appendChild(iconGlyph);
  header.append(icon, eyebrow, title);
  card.append(header, createNode("p", { text: item.description }));

  if (item.href && item.label) {
    const action = createNode("a", {
      className: "info-card__link",
      text: item.label,
      attrs: { href: item.href }
    });

    if (item.external) {
      action.target = "_blank";
      action.rel = "noreferrer";
    }

    card.appendChild(action);
  }

  return card;
}


const galleryLayoutClasses = [
  "gallery-card gallery-card-xl",
  "gallery-card gallery-card-sm",
  "gallery-card gallery-card-sm",
  "gallery-card gallery-card-wide",
  "gallery-card gallery-card-sm",
  "gallery-card gallery-card-sm"
];

/**
 * Render one gallery card.
 *
 * @param {import("../data/site-config.js").GalleryItem} item
 * @param {number} index
 * @returns {HTMLElement}
 */
function renderGalleryCard(item, index) {
  const card = createNode("a", {
    className: galleryLayoutClasses[index] || "gallery-card gallery-card-sm",
    attrs: {
      href: item.postUrl,
      target: "_blank",
      rel: "noreferrer",
      "data-reveal": ""
    }
  });

  const image = createNode("img", {
    attrs: {
      src: item.image,
      alt: item.alt,
      loading: "lazy"
    }
  });

  const copy = createNode("div", { className: "gallery-copy" });
  copy.append(
    createNode("span", { text: item.label }),
    createNode("strong", { text: item.title })
  );

  card.append(image, copy);
  return card;
}

/**
 * Attach reveal animation observers to all not-yet-visible elements inside a scope.
 *
 * @param {ParentNode} [scope=document]
 * @returns {void}
 */
function observeRevealItems(scope = document) {
  const revealItems = scope.querySelectorAll("[data-reveal]:not(.is-visible)");

  if (!revealItems.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

/**
 * Toggle sticky header styles once the visitor starts scrolling.
 *
 * @returns {void}
 */
function initHeaderState() {
  const header = document.querySelector("[data-header]");

  if (!header) {
    return;
  }

  const syncHeader = () => {
    header.classList.toggle("is-sticky", window.scrollY > 24);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
}

/**
 * Initialize the mobile navigation drawer and keep aria state in sync.
 *
 * @returns {void}
 */
function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const panel = document.querySelector(".nav-panel");
  const links = document.querySelectorAll(".topnav a, .nav-cta a");

  if (!toggle || !panel) {
    return;
  }

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    document.body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    if (document.body.classList.contains("menu-open")) {
      closeMenu();
      return;
    }

    openMenu();
  });

  links.forEach((link) => link.addEventListener("click", closeMenu));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}


/**
 * Render a list of reusable information cards inside a target container.
 *
 * @param {string} containerId
 * @param {import("../data/site-config.js").InfoCardItem[]} items
 * @param {"catalog" | "contact"} variant
 * @returns {void}
 */
function renderInfoCards(containerId, items, variant) {
  const container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((item) => fragment.appendChild(renderInfoCard(item, variant)));
  container.replaceChildren(fragment);
}

/**
 * Populate the catalog and contact sections from the content service layer.
 *
 * @returns {Promise<void>}
 */
async function initInfoCardSections() {
  const [catalogCards, contactCards] = await Promise.all([
    getCatalogCards(),
    getContactCards()
  ]);

  renderInfoCards("catalog-cards", catalogCards, "catalog");
  renderInfoCards("contact-cards", contactCards, "contact");
}


/**
 * Load the gallery manifest and render a local fallback when unavailable.
 *
 * @returns {Promise<void>}
 */
async function initInstagramGallery() {
  const container = document.getElementById("instagram-gallery");

  if (!container) {
    return;
  }

  container.innerHTML = '<div class="gallery-loading">Caricamento galleria...</div>';

  try {
    const response = await fetch("assets/gallery/gallery-data.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Gallery manifest unavailable");
    }

    const items = await response.json();
    const fragment = document.createDocumentFragment();
    items.forEach((item, index) => fragment.appendChild(renderGalleryCard(item, index)));
    container.replaceChildren(fragment);
  } catch (error) {
    const fallbackItems = await getFallbackGalleryItems();
    const fragment = document.createDocumentFragment();
    fallbackItems.forEach((item, index) => {
      fragment.appendChild(renderGalleryCard(item, index));
    });
    container.replaceChildren(fragment);
  }

  observeRevealItems(container);
}


/**
 * Boot the static site UI.
 *
 * @returns {Promise<void>}
 */
async function initSite() {
  await initInfoCardSections();
  observeRevealItems();
  initHeaderState();
  initMobileMenu();
  await initInstagramGallery();
}

initSite();
