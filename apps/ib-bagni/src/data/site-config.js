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
export const siteConfig = {
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
