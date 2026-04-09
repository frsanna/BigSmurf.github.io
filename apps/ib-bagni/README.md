# IB Bagni Ceramiche

Static showcase website for `IB Bagni Ceramiche`, designed to be published inside an existing website as a subpath such as `/apps/ib-bagni/`.

## Purpose

This project is built to:

- present the showroom and brand identity
- showcase products and design direction
- surface real Instagram content with safe local fallbacks
- push visitors toward contact and showroom visits
- work well on both desktop and mobile

## Project structure

```text
apps/ib-bagni/
├── index.html
├── styles.css
├── dist/
│   ├── app.js
│   └── styles.css
├── package.json
├── .editorconfig
├── README.md
├── sync-instagram-gallery.py
├── src/
│   ├── main.js
│   ├── components/
│   │   ├── gallery-card.js
│   │   └── info-card.js
│   ├── data/
│   │   └── site-config.js
│   ├── modules/
│   │   ├── gallery.js
│   │   ├── header.js
│   │   ├── info-sections.js
│   │   ├── mobile-menu.js
│   │   └── reveal.js
│   ├── services/
│   │   └── content-service.js
│   └── utils/
│       └── dom.js
├── styles/
│   ├── base/
│   │   ├── reset.css
│   │   ├── responsive.css
│   │   └── tokens.css
│   ├── components/
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   └── header.css
│   └── sections/
│       ├── contact.css
│       ├── content.css
│       ├── gallery.css
│       └── hero.css
├── tools/
│   ├── format-site.mjs
│   └── lint-site.mjs
└── assets/
    ├── logo-ib-bagni.jpg
    └── gallery/
        ├── gallery-data.json
        └── post-*.jpg
```

## Architecture overview

The project uses a modular static architecture.

- `index.html` is the shell and layout composition layer
- `src/main.js` is the application entry point
- `src/data/site-config.js` stores local static content
- `src/services/content-service.js` exposes a service layer for content access
- `src/components/` contains reusable UI renderers
- `src/modules/` contains behavior-oriented feature modules
- `styles.css` is only the stylesheet entry point and imports smaller CSS files
- `styles/` is split by responsibility into `base`, `components`, and `sections`

This separation makes it easier to:

- replace static content with an API later
- work on one feature without touching unrelated files
- swap visual modules without rewriting the whole page
- keep the codebase easier to onboard and maintain

## Source files vs runtime files

This project now has two layers:

### Source layer

These are the files you should edit during development:

- `src/**`
- `styles/**`
- `styles.css` as the CSS entry file
- `index.html` for page structure and top-level references

These files are modular and optimized for maintainability.

### Runtime layer

These are the files used directly by the browser in production:

- `dist/app.js`
- `dist/styles.css`

`index.html` is intentionally wired to the runtime files inside `dist/`.

This means:

- developers work on modular source files
- the published page consumes flattened runtime assets
- the website remains simple to host even without a bundler or advanced server setup

## Build workflow

After editing any source file, run:

```bash
npm run format
npm run build
npm run lint
```

Recommended order:

1. edit source files
2. run `npm run format`
3. run `npm run build`
4. run `npm run lint`
5. publish the project with updated `dist/` assets

## What gets published

At minimum, publish these paths together:

- `index.html`
- `dist/`
- `assets/`

You may also keep the source folders in the repository, but they are not required for the browser to run the site.

## HTML shell

### `index.html`

`index.html` contains:

- metadata
- SEO/Open Graph data
- the main page structure
- mount points for dynamic card sections
- the ES module entry script
 - the runtime asset references

Main dynamic mount points:

- catalog cards: `#catalog-cards`
- contact cards: `#contact-cards`
- gallery: `#instagram-gallery`

Important:

- `index.html` loads `dist/styles.css`
- `index.html` loads `dist/app.js`
- it does not load files from `src/` directly at runtime anymore

What is safe to edit here:

- section copy
- metadata
- top-level links
- JSON-LD
- section order

## JavaScript modules

### `src/main.js`

Bootstraps the source-side application:

- loads reusable info card sections
- initializes reveal animations
- initializes sticky header behavior
- initializes mobile navigation
- initializes the gallery

### `src/data/site-config.js`

Static content source for development and local runtime generation.

This is the local configuration file that currently provides:

- catalog cards
- contact cards
- gallery fallback items

If content later comes from a CMS or API, this file can be replaced or reduced without changing the UI components.

### `src/services/content-service.js`

Content access layer.

At the moment it returns cloned local data from `site-config.js`, but it is intentionally structured as a service so it can later:

- fetch remote JSON
- call an external API
- map CMS data into UI-ready structures

### `src/components/info-card.js`

Reusable renderer for the shared info card component used in:

- product catalog
- contact cards

### `src/components/gallery-card.js`

Reusable renderer for gallery cards.

### `src/modules/reveal.js`

Handles reveal-on-scroll animation behavior.

### `src/modules/header.js`

Handles sticky header state on scroll.

### `src/modules/mobile-menu.js`

Handles mobile navigation drawer interactions and ARIA state.

### `src/modules/info-sections.js`

Loads content from the service layer and renders:

- catalog cards
- contact cards

### `src/modules/gallery.js`

Loads `assets/gallery/gallery-data.json` and falls back to local gallery data if the manifest is unavailable.

### `src/utils/dom.js`

Contains small DOM utility helpers used across components.

## CSS structure

### `styles.css`

Entry stylesheet only.

It imports smaller files so the visual system is modular instead of monolithic.

### `styles/base/`

- `tokens.css`: design tokens such as colors, spacing primitives, shadow and radius
- `reset.css`: global base rules and shared layout primitives
- `responsive.css`: breakpoints and adaptive behavior

### `styles/components/`

- `header.css`: top bar and navigation UI
- `buttons.css`: shared button styles
- `cards.css`: reusable card system and shared card variants

### `styles/sections/`

- `hero.css`: hero layout and visual stage
- `content.css`: showroom, intro, inspirations and social strip sections
- `gallery.css`: gallery layout and overlays
- `contact.css`: contact area, CTA panel and contact strip

## Reusable components

### Shared info card

The `info-card` component is the shared building block for:

- catalog cards
- contact cards

Content is not hardcoded in HTML anymore.
It is rendered from structured data through the component layer.

Supported fields:

- `icon`
- `eyebrow`
- `title`
- `description`
- `href`
- `label`
- `external`
- `accent`

To update card content:

- catalog cards: edit `siteConfig.catalogCards`
- contact cards: edit `siteConfig.contactCards`

## Gallery flow

The gallery works in this order:

1. try to load `assets/gallery/gallery-data.json`
2. if loading fails, use local fallback items from the content service

This ensures the website never looks empty.

### Related files

- `assets/gallery/gallery-data.json`
- `assets/gallery/post-*.jpg`
- `sync-instagram-gallery.py`
- `src/modules/gallery.js`
- `src/components/gallery-card.js`

## Editing guide

### Update logo

Replace:

- `assets/logo-ib-bagni.jpg`

If the final logo has different proportions, review:

- `styles/components/header.css`

### Update contact details

Review and update:

- header links in `index.html`
- CTA links in `index.html`
- `siteConfig.contactCards` in `src/data/site-config.js`
- contact strip in `index.html`
- JSON-LD in `index.html`

### Update colors

Use:

- `styles/base/tokens.css`

Main design tokens:

- `--bg`
- `--surface`
- `--ink`
- `--muted`
- `--amber`
- `--copper`
- `--olive`
- `--teal`

Avoid scattering hardcoded colors across unrelated files when a token can be reused.

## Future API or CMS integration

The project is already structured for future content externalization.

Suggested path:

1. keep UI components unchanged
2. replace `content-service.js` logic with remote fetch calls
3. normalize remote payloads into the same shape currently used by `site-config.js`
4. keep `site-config.js` as local fallback or development seed data

This means the rendering layer does not need to care whether content is local or remote.

## Runtime build files

### `dist/app.js`

Generated runtime JavaScript file.

This file is produced from the modular source tree and is the file loaded by the page in production.

Do not edit it manually unless you are debugging a generated artifact.

### `dist/styles.css`

Generated runtime stylesheet.

This file is built from the split CSS architecture and is the stylesheet loaded by the page in production.

Do not edit it manually unless you are debugging a generated artifact.

## Linting and formatting

Run inside the project directory:

```bash
npm run format
npm run build
npm run lint
```

### Scripts

- `format`: normalizes line endings, tabs and trailing whitespace
- `build`: generates `dist/app.js` and `dist/styles.css` from the modular source files
- `lint`: checks final newlines, trailing spaces, tab indentation, JSON validity and JavaScript syntax

## Developer notes

- The project is plain static HTML/CSS/JS and does not require a bundler.
- JavaScript source uses native ES modules.
- Styles are split into imported CSS files for surgical maintenance.
- Production runtime uses generated flat assets in `dist/`.
- Shared UI patterns should be implemented as reusable components first, not duplicated in HTML.
- The gallery must always keep a local fallback.
- Mobile should always be tested after spacing or typography changes.

## Publishing

The website can be deployed to:

- a traditional hosting environment
- Netlify
- Vercel
- GitHub Pages
- a subdirectory of an existing website

Important requirement:

- relative paths between `index.html`, `dist/` and `assets/` must remain valid

## Pre-release checklist

- replace the temporary logo with the final high-resolution asset
- verify phone, email, Maps and Instagram links
- verify mobile layout and hamburger navigation
- verify gallery fallback behavior
- confirm business copy
- run `npm run format`
- run `npm run build`
- run `npm run lint`
