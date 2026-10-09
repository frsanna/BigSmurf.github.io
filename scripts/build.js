#!/usr/bin/env node
// Static site build for GitHub Pages. No dependencies: Node >= 18.
//
//   src/content/profile.json   single source of truth (site + PDF)
//   src/sections/*.js          one module per page section (see src/sections/index.js)
//   src/styles, src/scripts    concatenated in the order of their index.json
//
// Output: dist/ (deployed as-is) and .cache/cv/ (HTML used to print the PDF).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const CACHE = path.join(ROOT, '.cache', 'cv');

const read = (p) => fs.readFileSync(p, 'utf8');
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');
const write = (p, s) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
};
// Never ship OS junk or app-level tooling files.
const SKIP = new Set(['.DS_Store', '.claude', '.editorconfig', 'package.json', 'package-lock.json', 'node_modules', 'tools', 'Untitled.png']);
const SKIP_EXT = new Set(['.md', '.py', '.sh']);
const copy = (from, to) =>
  fs.cpSync(path.join(ROOT, from), path.join(DIST, to ?? from), {
    recursive: true,
    filter: (src) => !SKIP.has(path.basename(src)) && !SKIP_EXT.has(path.extname(src))
  });

/** Date of the last commit touching the content (stable across rebuilds); falls back to today. */
function contentDate() {
  try {
    const out = require('child_process')
      .execSync('git log -1 --format=%cs -- src/content src/sections src/layout.js src/pdf.js', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    return out || null;
  } catch {
    return null;
  }
}

/** Concatenates the files listed in <dir>/index.json. */
function bundle(dir) {
  const files = JSON.parse(read(path.join(dir, 'index.json')));
  return files.map((f) => `/* ${f} */\n${read(path.join(dir, f)).trim()}\n`).join('\n');
}

/** Very small CSS minifier: comments and redundant whitespace only. */
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function build() {
  const data = JSON.parse(read(path.join(SRC, 'content', 'profile.json')));
  const now = new Date();
  data.build = { date: contentDate() || now.toISOString().slice(0, 10), year: now.getFullYear() };

  const sections = require(path.join(SRC, 'sections'));
  const ids = new Set();
  for (const s of sections) {
    if (ids.has(s.id)) throw new Error(`Duplicate section id "${s.id}"`);
    ids.add(s.id);
  }

  fs.rmSync(DIST, { recursive: true, force: true });

  // Assets with content hash, so GitHub Pages caching never serves stale CSS/JS.
  const css = minifyCss(bundle(path.join(SRC, 'styles')).replace(/\.\.\/assets\//g, ''));
  const contact = {
    email: data.person.email,
    location: data.person.location,
    workSetup: data.person.workSetup,
    linkedin: data.person.linkedin
  };
  const js = `(()=>{\n'use strict';\nwindow.__FS_CONTACT=${JSON.stringify(contact)};\n${bundle(path.join(SRC, 'scripts'))}})();\n`;
  const cssName = `assets/site.${hash(css).slice(0, 10)}.css`;
  const jsName = `assets/site.${hash(js).slice(0, 10)}.js`;
  write(path.join(DIST, cssName), css);
  write(path.join(DIST, jsName), js);

  const { page, notFound } = require(path.join(SRC, 'layout'));
  write(path.join(DIST, 'index.html'), page(data, sections, { css: `/${cssName}`, js: `/${jsName}` }));
  write(path.join(DIST, '404.html'), notFound(data, { css: `/${cssName}` }));

  // Static files.
  copy('src/assets', 'assets');
  for (const img of ['favicon.svg', 'favicon-16.png', 'favicon-32.png', 'favicon-48.png', 'favicon-180.png', 'apple-touch-icon.png']) {
    copy(`resources/img/${img}`);
  }
  copy('resources/img/logo.ico', 'favicon.ico');
  copy('resources/curriculum.pdf');
  copy('apps');
  copy('CNAME');
  write(path.join(DIST, '.nojekyll'), '');
  write(
    path.join(DIST, 'robots.txt'),
    `User-agent: *\nDisallow: /apps/\n\nSitemap: ${data.site.url}sitemap.xml\n`
  );
  write(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${data.site.url}</loc>
    <lastmod>${data.build.date}</lastmod>
  </url>
</urlset>
`
  );

  // CV source for the PDF (printed by scripts/build-pdf.sh).
  const cvHtml = require(path.join(SRC, 'pdf')).render(data);
  write(path.join(CACHE, 'index.html'), cvHtml);
  fs.copyFileSync(path.join(SRC, 'styles', 'pdf.css'), path.join(CACHE, 'pdf.css'));
  const cvHash = hash(cvHtml + read(path.join(SRC, 'styles', 'pdf.css')));
  write(path.join(CACHE, 'source.sha256'), `${cvHash}\n`);

  const stampFile = path.join(ROOT, 'resources', 'curriculum.sha256');
  const stamp = fs.existsSync(stampFile) ? read(stampFile).trim() : '';
  const pdfInSync = stamp === cvHash;

  console.log(`Built dist/ with ${sections.length} sections (${cssName}, ${jsName}).`);
  if (!pdfInSync) {
    const msg = 'resources/curriculum.pdf is out of date with src/content. Run: npm run pdf';
    if (process.argv.includes('--strict')) {
      console.error(`ERROR: ${msg}`);
      process.exit(1);
    }
    console.warn(`WARNING: ${msg}`);
  }
}

build();
