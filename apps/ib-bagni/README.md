# IB Bagni Ceramiche

Static showcase website for `IB Bagni Ceramiche`, designed to be published inside an existing website as a subpath such as `/apps/ib-bagni/`.

This project is intentionally structured in two layers:

- a modular source layer for development and maintenance
- a flat runtime layer for reliable publishing

The goal is to keep the codebase easy to evolve without making the final website harder to host.

## Quick Start

### 1. Edit the source files

Work on:

- `index.html`
- `src/**`
- `styles/**`
- `styles.css`

### 2. Regenerate runtime assets

From the project root:

```bash
npm run format
npm run build
npm run lint
```

### 3. Publish the website

Make sure these paths are deployed together:

- `index.html`
- `dist/`
- `assets/`

The browser uses the generated runtime files inside `dist/`.

## Project Goals

This website is built to:

- present the showroom and business identity
- highlight bathroom products, finishes and design inspiration
- keep a premium and conversion-oriented visual direction
- support both desktop and mobile visitors
- keep the gallery visually strong even if Instagram data is unavailable
- stay maintainable for future developers

## High-Level Architecture

The project is not a framework app and does not require a bundler at runtime.

Instead, it uses:

- modular source files for maintainability
- a very small local build step for runtime compatibility
- static HTML as the delivery shell

In practical terms:

- developers edit modular files
- `npm run build` generates browser-ready files
- `index.html` references only runtime assets

## Environment Requirements

Recommended local tooling:

- Node.js 20+
- npm 10+
- Python 3

Node.js and npm are used for:

- formatting
- building runtime assets
- linting

Python is used only for the optional Instagram gallery sync script.

The published website itself does not require Node.js or Python on the server.

## Source Files vs Runtime Files

This distinction is critical.

### Source Layer

These files are meant to be edited:

- `src/**`
- `styles/**`
- `styles.css`
- `index.html`

This layer is optimized for:

- readability
- modularity
- reusability
- future extension

### Runtime Layer

These files are generated and loaded by the browser:

- `dist/app.js`
- `dist/styles.css`

This layer is optimized for:

- simple hosting
- fewer moving parts in production
- reliable asset loading

Generated runtime artifacts:

- `dist/app.js`
- `dist/styles.css`

### Important Rule

Do not treat `dist/` as the primary source of truth.

If you need to change behavior or styling:

1. edit the modular source files
2. rebuild
3. verify the generated runtime output

## Project Structure

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
│   ├── build-site.mjs
│   ├── format-site.mjs
│   └── lint-site.mjs
└── assets/
    ├── logo-ib-bagni.jpg
    └── gallery/
        ├── gallery-data.json
        └── post-*.jpg
```

## Entry Points

### `index.html`

This is the page shell.

Responsibilities:

- metadata and SEO
- Open Graph and JSON-LD
- section structure
- mount points for generated UI sections
- runtime asset references

Important:

- it loads `dist/styles.css`
- it loads `dist/app.js`
- it does not load source modules directly
- it still references `assets/**` directly for images and gallery content

Dynamic mount points:

- catalog cards: `#catalog-cards`
- contact cards: `#contact-cards`
- gallery: `#instagram-gallery`

## JavaScript Architecture

### `src/main.js`

Main application bootstrap.

Responsibilities:

- initialize info card sections
- initialize reveal behavior
- initialize sticky header
- initialize mobile navigation
- initialize the gallery

### `src/data/site-config.js`

Local static content seed.

Currently contains:

- catalog cards
- contact cards
- gallery fallback items

This file exists so content is not hardcoded inside rendering logic.

It also acts as the local fallback content source.

### `src/services/content-service.js`

Content access layer.

Today it returns local configuration data.
Tomorrow it can fetch from:

- an external JSON endpoint
- a CMS
- a REST API
- a headless backend

The UI layer should not care where content comes from.

### `src/components/`

Reusable UI renderers.

#### `info-card.js`

Shared component used by:

- catalog cards
- contact cards

#### `gallery-card.js`

Renderer for the gallery card layout.

### `src/modules/`

Feature-level behavior modules.

#### `header.js`

Sticky header state.

#### `mobile-menu.js`

Hamburger navigation behavior and ARIA state.

#### `reveal.js`

Reveal-on-scroll animation behavior.

#### `info-sections.js`

Loads and renders shared info cards into page sections.

#### `gallery.js`

Loads gallery data and applies fallback logic if needed.

Runtime logic:

1. try loading `assets/gallery/gallery-data.json`
2. if that fails, use local fallback content

### `src/utils/dom.js`

Small DOM helper utilities shared across the application.

## CSS Architecture

### `styles.css`

Single CSS entry file used only to compose the stylesheet structure.

It imports the modular source styles in the correct order.

### `styles/base/`

Foundational styles.

#### `tokens.css`

Design tokens such as:

- colors
- shadows
- radius
- sizing primitives

#### `reset.css`

Base document styles and common layout primitives.

#### `responsive.css`

Breakpoint-specific adjustments and responsive overrides.

### `styles/components/`

Shared UI building blocks.

#### `header.css`

Topbar, navigation and sticky state visuals.

#### `buttons.css`

Shared button styles and variants.

#### `cards.css`

Shared card system, including the reusable `info-card` component.

### `styles/sections/`

Page-specific layout styling.

#### `hero.css`

Hero block and stage composition.

#### `content.css`

Intro, showroom, inspiration and editorial content sections.

#### `gallery.css`

Gallery layout, image treatment and overlay content.

#### `contact.css`

Contact section, CTA panel and contact strip.

## Reusable Component System

The project avoids duplicated markup for repeated information cards.

### Shared `info-card`

Used for:

- product cards
- contact cards

Supported fields:

- `icon`
- `eyebrow`
- `title`
- `description`
- `href`
- `label`
- `external`
- `accent`

If new catalog or contact entries are needed, they should generally be added as data, not handwritten as repeated HTML.

## Content Management Guide

### Update catalog cards

Edit:

- `src/data/site-config.js`

Section:

- `siteConfig.catalogCards`

### Update contact cards

Edit:

- `src/data/site-config.js`

Section:

- `siteConfig.contactCards`

### Update gallery fallback items

Edit:

- `src/data/site-config.js`

Section:

- `siteConfig.fallbackGalleryItems`

### Update gallery manifest and gallery images

These files are usually generated or refreshed, not edited manually:

- `assets/gallery/gallery-data.json`
- `assets/gallery/post-*.jpg`

### Update static page copy

Edit:

- `index.html`

Use this for:

- hero text
- showroom text
- section intros
- metadata
- JSON-LD

## Gallery and Instagram Strategy

The gallery intentionally never depends on Instagram alone.

Runtime order:

1. try loading `assets/gallery/gallery-data.json`
2. if loading fails, use local fallback data from the content layer

This ensures the site:

- never looks empty
- stays visually strong
- remains publishable in static hosting environments

Related files:

- `assets/gallery/gallery-data.json`
- `assets/gallery/post-*.jpg`
- `sync-instagram-gallery.py`
- `src/modules/gallery.js`
- `src/components/gallery-card.js`

## Instagram Sync Script

### File

- `sync-instagram-gallery.py`

### Purpose

This script refreshes the local gallery content from the public Instagram profile.

It is a manual content sync utility.
It does not run automatically unless a developer or a future automation executes it.

### What it does

When executed, the script:

1. requests profile data from the public Instagram endpoint
2. reads the latest posts up to the configured limit
3. downloads gallery images into `assets/gallery/`
4. regenerates `assets/gallery/gallery-data.json`
5. updates the local data used by the website gallery

### Files it updates

- `assets/gallery/gallery-data.json`
- `assets/gallery/post-1.jpg`
- `assets/gallery/post-2.jpg`
- `assets/gallery/post-3.jpg`
- `assets/gallery/post-4.jpg`
- `assets/gallery/post-5.jpg`
- `assets/gallery/post-6.jpg`

### Main configuration inside the script

The script currently defines:

- `PROFILE_USERNAME`
- `PROFILE_URL`
- `PROFILE_HEADERS`
- `POST_LIMIT`

These values control:

- which account is read
- how the request is made
- how many posts are imported

### Limitations

The script depends on Instagram's current public endpoint behavior.

It may stop working if:

- the endpoint changes
- the response format changes
- the account becomes private
- Instagram rate limits or anti-bot behavior changes

Because of this, the website still keeps:

- downloaded local images
- generated local gallery JSON
- fallback gallery data in `src/data/site-config.js`

### Recommended usage

Run from the project root:

```bash
python3 sync-instagram-gallery.py
npm run build
npm run lint
```

Recommended use cases:

- before publishing updated showroom content
- after new Instagram posts should appear locally
- when aligning the gallery with the latest business content

## Branding and Design Tokens

### Update the logo

Replace:

- `assets/logo-ib-bagni.jpg`

If the final logo has different proportions or padding, review:

- `styles/components/header.css`

### Update the color palette

Primary design tokens are in:

- `styles/base/tokens.css`

Key variables:

- `--bg`
- `--surface`
- `--ink`
- `--muted`
- `--amber`
- `--copper`
- `--olive`
- `--teal`
- `--shadow`
- `--radius`

Recommended rule:

- prefer updating tokens before introducing new hardcoded colors

## Contact and Link Management

Review these locations when business data changes:

- top navigation CTA links in `index.html`
- hero CTA links in `index.html`
- contact CTA panel links in `index.html`
- `siteConfig.contactCards` in `src/data/site-config.js`
- contact strip in `index.html`
- JSON-LD inside `index.html`

Always verify:

- phone number
- email address
- Instagram URL
- Maps URL
- structured data values

## Build System

### `tools/build-site.mjs`

Generates runtime files:

- `dist/app.js`
- `dist/styles.css`

Purpose:

- keep source modular
- keep runtime flat and easy to publish

This script concatenates the modular source files into runtime assets under `dist/`.

### `tools/format-site.mjs`

Normalizes:

- line endings
- tabs
- trailing whitespace
- final newline presence

### `tools/lint-site.mjs`

Checks:

- trailing whitespace
- tab indentation
- final newline presence
- JSON validity
- JavaScript syntax validity

## Commands

Run from:

- `/Users/francesco.sanna/Documents/BigSmurf/apps/ib-bagni`

### Format

```bash
npm run format
```

### Build runtime files

```bash
npm run build
```

### Lint project files

```bash
npm run lint
```

### Sync local gallery from Instagram

```bash
python3 sync-instagram-gallery.py
```

## Recommended Development Workflow

Use this sequence after every meaningful change:

1. edit source files
2. run `npm run format`
3. run `npm run build`
4. run `npm run lint`
5. test the result

This is especially important because the browser loads runtime files, not source modules.

If gallery content has been refreshed from Instagram, use:

1. run `python3 sync-instagram-gallery.py`
2. run `npm run build`
3. run `npm run lint`
4. verify the gallery visually

## What to Publish

At minimum, publish:

- `index.html`
- `dist/`
- `assets/`

Optional but useful to keep in the repository:

- `src/`
- `styles/`
- `tools/`
- `README.md`

If the project is deployed as a plain static directory, the required runtime set is:

- HTML shell
- built JS/CSS
- images and gallery assets

## Hosting Notes

The website can be hosted on:

- a traditional static host
- Netlify
- Vercel
- GitHub Pages
- a subdirectory inside a larger website

Important requirement:

- relative paths between `index.html`, `dist/` and `assets/` must stay valid

If the site is moved into another subpath, keep the directory structure intact.

## Troubleshooting

### The page loads but styles are missing

Check:

- `dist/styles.css` exists
- `index.html` still references `dist/styles.css`
- the `dist/` folder was published

### The page loads but interactivity is broken

Check:

- `dist/app.js` exists
- `index.html` still references `dist/app.js`
- `npm run build` was executed after source changes

### Cards or gallery appear empty

Check:

- `dist/app.js` was rebuilt
- `assets/gallery/gallery-data.json` is valid JSON
- fallback gallery data still exists in `src/data/site-config.js`

### The Instagram sync script fails

Check:

- Python 3 is installed
- the account is still public
- Instagram endpoint behavior has not changed
- network access is available when running the script

If the script fails, the website can still rely on:

- previously downloaded local images
- existing `gallery-data.json`
- fallback data from `src/data/site-config.js`

### Changes in `src/` or `styles/` do not appear live

Expected behavior if `build` was not run.

Fix:

```bash
npm run build
```

### Contact cards stack unexpectedly

Check:

- `styles/components/cards.css`
- `styles/base/responsive.css`
- generated `dist/styles.css`

This layout is controlled by the reusable card grid system.

## Extension Guidelines

### If adding a new repeated card-like pattern

Prefer:

- data structure
- reusable component
- container renderer

Avoid:

- copying and pasting repeated HTML blocks into `index.html`

### If adding a new behavior

Prefer creating a new file in:

- `src/modules/`

### If adding a new reusable DOM renderer

Prefer creating a new file in:

- `src/components/`

### If adding a new content source

Prefer extending:

- `src/services/content-service.js`

Avoid coupling remote fetch logic directly inside rendering components.

## Future Improvements

Recommended future extensions:

- external CMS or API integration through the service layer
- automated Instagram sync during deploy
- modern image formats and responsive image sources
- visual regression checks
- environment-aware build behavior
- richer content schemas when the final domain is chosen
- a more durable Instagram ingestion workflow

## Developer Notes

- The project is plain static HTML/CSS/JS.
- Source JavaScript uses ES modules.
- Runtime JavaScript is flattened into a browser-ready file.
- Source CSS is split by responsibility.
- Runtime CSS is flattened into a browser-ready stylesheet.
- Shared UI should be abstracted before being duplicated.
- The local gallery fallback must always remain available.
- Mobile should be rechecked after any change to spacing, typography or card layout.
- Local cache artifacts such as `__pycache__/` should not be kept in the project tree.

## Pre-Publish Checklist

- replace the temporary logo with the final high-resolution asset
- verify phone, email, Maps and Instagram links
- verify JSON-LD values
- verify mobile layout and hamburger navigation
- verify sticky header behavior
- verify gallery fallback behavior
- confirm final business copy
- run `npm run format`
- run `npm run build`
- run `npm run lint`

## Maintenance Rule of Thumb

If you are not sure where to change something:

- structure and copy: `index.html`
- repeated content: `src/data/site-config.js`
- content retrieval logic: `src/services/content-service.js`
- reusable UI rendering: `src/components/`
- behavior: `src/modules/`
- shared styling: `styles/components/`
- section styling: `styles/sections/`
- responsive fixes: `styles/base/responsive.css`
- publishable output: `dist/`

## Cleanup Notes

Files that are safe to remove when generated locally and not needed by the project:

- `__pycache__/`
- temporary debug files
- other local cache artifacts

These files are neither source files nor publishable runtime files and should not be committed or deployed.
