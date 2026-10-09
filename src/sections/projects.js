const { esc } = require('../lib/html');

module.exports = {
  id: 'projects',
  nav: 'Projects',
  render({ projects }) {
    const cards = projects.items
      .map(
        (p) => `
      <article class="card reveal">
        <h3>${esc(p.name)}</h3>
        ${p.stack ? `<p class="stack">${esc(p.stack)}</p>` : ''}
        <p>${esc(p.text)}</p>
      </article>`
      )
      .join('');
    return `
<section id="projects" class="section" aria-labelledby="projects-title">
  <div class="wrap">
    <header class="section-head"><h2 id="projects-title">Key Projects</h2></header>
    <div class="cards">${cards}</div>
  </div>
</section>`;
  }
};
