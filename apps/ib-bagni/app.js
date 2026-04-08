function initRevealAnimations() {
  const revealItems = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealItems.forEach((item) => observer.observe(item));
    return;
  }

  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const fallbackGalleryItems = [
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
];

function renderGalleryItem(item, index) {
  const card = document.createElement("a");
  const layoutClasses = [
    "gallery-card gallery-card-xl",
    "gallery-card gallery-card-sm",
    "gallery-card gallery-card-sm",
    "gallery-card gallery-card-wide",
    "gallery-card gallery-card-sm",
    "gallery-card gallery-card-sm"
  ];

  card.className = layoutClasses[index] || "gallery-card gallery-card-sm";
  card.href = item.postUrl;
  card.target = "_blank";
  card.rel = "noreferrer";
  card.setAttribute("data-reveal", "");

  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.alt;
  image.loading = "lazy";

  const copy = document.createElement("div");
  copy.className = "gallery-copy";

  const label = document.createElement("span");
  label.textContent = item.label;

  const title = document.createElement("strong");
  title.textContent = item.title;

  copy.append(label, title);
  card.append(image, copy);
  return card;
}

async function initInstagramGallery() {
  const container = document.getElementById("instagram-gallery");

  if (!container) {
    return;
  }

  container.innerHTML = '<div class="gallery-loading">Caricamento galleria…</div>';

  try {
    const response = await fetch("assets/gallery/gallery-data.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Gallery manifest unavailable");
    }

    const items = await response.json();
    container.innerHTML = "";
    items.forEach((item, index) => {
      container.appendChild(renderGalleryItem(item, index));
    });
    initRevealAnimations();
  } catch (error) {
    container.innerHTML = "";
    fallbackGalleryItems.forEach((item, index) => {
      container.appendChild(renderGalleryItem(item, index));
    });
    initRevealAnimations();
  }
}

initRevealAnimations();
initInstagramGallery();
