# Francesco Sanna - Personal Website

Static personal website published on GitHub Pages.

## Stack
- Plain HTML/CSS/JavaScript
- No framework
- No bundler
- No build pipeline required for deploy

## Project Structure
- `index.html`: shell page with SEO/meta tags and component placeholders
- `components/*.html`: page sections split into reusable HTML partials
- `include-components.js`: runtime loader for partials
- `components-inline.js`: local fallback map for `file://` testing
- `build-inline-components.js`: script that regenerates `components-inline.js`
- `style.css`: global styles
- `script.js`: site interactions (navigation + logo easter egg)
- `console-contact-terminal.js`: console easter egg/contact terminal
- `apps/`: standalone mini apps
- `apps/lab-archive.html`: hidden app index (not linked from main site)
- `robots.txt`: asks crawlers to skip the entire `/apps/` area

## Why `components-inline.js` Exists
When opening `index.html` directly via `file://`, browsers block `fetch()` for local files (CORS/security restrictions).

To support local testing without running a server:
- On `file://`, `include-components.js` loads HTML from `components-inline.js`
- On `http(s)://` (including GitHub Pages), it loads components via normal `fetch()` from `components/*.html`

## Rebuild Instructions
Run this every time you edit any file in `components/`:

```bash
node build-inline-components.js
```

This regenerates `components-inline.js` so local `file://` testing matches current components.

No rebuild step is required for `apps/*` pages: they are plain static HTML/CSS/JS.

### Hidden App Archive Config
Inside `apps/lab-archive.html`:
- `APPS`: catalog of available app cards
- `LOCKED_APP_IDS`: list of app ids that require key unlock

Apps not included in `LOCKED_APP_IDS` are shown by default.

## Local Testing
### Option A: Direct file open (works with fallback)
- Open `index.html` directly in browser (`file://...`)
- Make sure `components-inline.js` is up to date (run rebuild command above)

### Option B: Local server (optional)
If you prefer an HTTP environment:

```bash
python3 -m http.server 8080
```

Then open:
- `http://localhost:8080`

## Deploy (GitHub Pages)
- Push changes to the branch used by GitHub Pages
- GitHub Pages serves static files as-is

## Recommended Workflow
1. Edit component(s) under `components/`
2. Run `node build-inline-components.js`
3. Test locally (`file://` or `http://localhost:8080`)
4. Commit and push

## Notes
- Keep all user-facing text in English.
- If component markup changes, always regenerate `components-inline.js` before commit.
- Hidden app index is intentionally unlinked; access it only via direct URL.
