# Francesco Sanna - Personal Website

Static personal website and CV, deployed to GitHub Pages at https://francescosanna.eu.

## Stack
- Plain HTML/CSS/JavaScript, no framework, **no npm dependencies** (Node >= 18 only)
- A small build script turns content + section modules into static HTML (full SEO: all text is in the served HTML)
- GitHub Actions builds `dist/` and deploys it to Pages
- Self-hosted font (DM Sans, OFL) and inline SVG icons: no third-party requests

## Project structure
```
src/
  content/profile.json   ← ALL text lives here (site + PDF). Edit content only here.
  sections/              ← one module per page section + index.js (order of the page)
  layout.js              ← <head>, header/nav, footer, 404
  pdf.js                 ← printable CV template (same content as the site)
  lib/                   ← html helpers, inline icons, SEO/JSON-LD
  styles/                ← CSS partials; order in styles/index.json; pdf.css for the CV
  scripts/               ← client JS modules; order in scripts/index.json
  assets/                ← portrait, font, og-image.png
scripts/                 ← build.js, build-pdf.sh, build-og.sh, serve.js
resources/               ← curriculum.pdf (+ .sha256 sync stamp), favicons, certificates
apps/                    ← standalone mini apps, copied as-is (hidden, disallowed in robots.txt)
```

## Commands
```bash
npm run dev     # build + local server on http://localhost:8080
npm run build   # build dist/
npm run pdf     # regenerate resources/curriculum.pdf from profile.json (needs Google Chrome)
npm run og      # regenerate the 1200x630 social preview image
```

## Editing content
1. Edit `src/content/profile.json`.
2. Run `npm run pdf` so the CV PDF matches the site (CI fails if you forget: the build checks `resources/curriculum.sha256`).
3. `npm run dev`, check, commit, push to `master`.

Site bullets use `text`; the one-page PDF uses the shorter `short` / `pdf` fields of the same entries.

## Adding a section
1. Create `src/sections/<name>.js` exporting `{ id, nav, render(data) }` (copy an existing one).
2. Add `require('./<name>')` to `src/sections/index.js` at the position you want. The nav link is automatic.
3. Optional: add `src/styles/sections/<name>.css` and list it in `src/styles/index.json`.
4. Optional: put its data in `profile.json` and, if it belongs on the CV, render it in `src/pdf.js`.

## Easter eggs
- Double-click on the portrait: logo animation (intentionally no pointer cursor or hover hint).
- Browser console: contact terminal, `fsContact.help()`.

## Deploy (GitHub Pages)
One-time setup: repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Every push to `master` runs `.github/workflows/pages.yml` (build with `--strict`, upload `dist/`, deploy).

## Favicon
Source: `resources/img/favicon.svg`. Regenerate raster assets with `./resources/build-favicon.sh`.

## Notes
- Keep all user-facing text in English.
- The hidden app index (`apps/lab-archive.html`) is intentionally unlinked.
