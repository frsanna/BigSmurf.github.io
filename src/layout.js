// Page shell: <head>, header/nav, footer. Sections come from src/sections/index.js.
const { esc } = require('./lib/html');
const { icon } = require('./lib/icons');
const { head, jsonLd } = require('./lib/seo');
const easterEgg = require('./components/easter-egg');

function header(sections) {
  const links = sections
    .filter((s) => s.nav && s.id !== 'hero')
    .map((s) => `<li><a href="#${s.id}">${esc(s.nav)}</a></li>`)
    .join('');
  return `
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-bar">
    <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="site-nav">
      <span class="sr-only">Menu</span>${icon('menu', 'icon icon-open')}${icon('close', 'icon icon-close')}
    </button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul>${links}</ul>
      <a class="btn btn-small btn-primary" href="resources/curriculum.pdf" download="Francesco-Sanna-CV.pdf">${icon('download')}CV</a>
    </nav>
  </div>
</header>`;
}

function footer(data) {
  const { person, build } = data;
  return `
<footer class="site-footer">
  <div class="wrap footer-bar">
    <p>© ${build.year} ${esc(person.name)} · ${esc(person.location)}</p>
  </div>
</footer>`;
}

function page(data, sections, { css, js }) {
  const body = sections.map((s) => s.render(data)).join('\n');
  return `<!DOCTYPE html>
<html lang="${data.site.lang}" class="no-js">
<head>
${head(data, { css, title: data.site.title, description: data.site.description })}
<script>document.documentElement.classList.replace('no-js','js')</script>
<script type="application/ld+json">
${jsonLd(data)}
</script>
<script src="${js}" defer></script>
</head>
<body>
${header(sections)}
<main id="main">
${body}
</main>
${footer(data)}
${easterEgg()}
</body>
</html>
`;
}

function notFound(data, { css }) {
  return `<!DOCTYPE html>
<html lang="${data.site.lang}">
<head>
${head(data, { css, title: `Page not found | ${data.person.name}`, description: data.site.description, robots: 'noindex', canonical: null })}
</head>
<body>
<main class="not-found wrap">
  <p class="eyebrow">404</p>
  <h1>Page not found</h1>
  <p>The page you were looking for does not exist.</p>
  <p><a class="btn btn-primary" href="/">Back to the home page</a></p>
</main>
</body>
</html>
`;
}

module.exports = { page, notFound };
