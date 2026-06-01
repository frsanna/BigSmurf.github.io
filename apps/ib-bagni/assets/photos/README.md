# Foto del sito — guida rapida

Salva qui le foto reali e collegale negli slot già predisposti in `index.html`.
Ogni slot ha un `<img>` commentato: basta **scommentarlo** e impostare `src` + `alt`.

## Slot disponibili e dimensioni consigliate

| Slot | File suggerito | Proporzione | Larghezza min. | Note |
|------|----------------|-------------|----------------|------|
| Hero (sfondo) | `assets/gallery/post-1.jpg` → tua foto | orizzontale 16:9 | ~2400px | Foto d'impatto, ambiente o dettaglio scenografico |
| Identità | `assets/photos/identita.jpg` | verticale 4:5 | ~900px | Ritratto del titolare o interno dello showroom |
| Showroom | `assets/photos/showroom.jpg` | verticale 4:5 / 5:6 | ~1000px | Ambiente reale del negozio |
| Ispirazioni 1–4 | `assets/photos/ispirazione-1..4.jpg` | verticale 3:4 | ~900px | Ambientazioni bagno coerenti con le 4 atmosfere |
| OG / social | `assets/og-image.jpg` | orizzontale 1200×630 | 1200px | Da generare dal nuovo logo (anteprime social) |

## Consigli
- Formato **JPEG** qualità ~80% (peso < 300 KB per foto) oppure **WebP** se possibile.
- `alt` sempre descrittivo e in italiano: aiuta accessibilità e SEO.
- Le foto sono caricate con `loading="lazy"` (tranne l'hero): non rallentano il primo caricamento.

## Logo
Quando arriva il logo ad alta risoluzione:
1. Sostituisci `assets/logo-ib-bagni.jpg` (idealmente SVG o PNG trasparente, lato ≥ 600px).
2. Aggiorna `favicon` / `apple-touch-icon` in `index.html`.
3. Genera `assets/og-image.jpg` (1200×630) e aggiorna i meta `og:image` / `twitter:image`.
4. Se il logo è una versione chiara pensata per fondi scuri, rimuovi `background`/`padding`
   da `.hero-brand-logo` (in `styles/sections/hero.css`) per lasciarlo libero.
