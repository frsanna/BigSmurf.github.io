const { esc } = require('../lib/html');
const { icon } = require('../lib/icons');

module.exports = {
  id: 'hero',
  nav: 'Home',
  render({ person, hero, site }) {
    const facts = hero.facts
      .map((f) => `<li><span class="fact-value">${esc(f.value)}</span><span class="fact-label">${esc(f.label)}</span></li>`)
      .join('');
    return `
<section id="hero" class="hero" aria-labelledby="hero-title">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">${esc(person.location)}</p>
      <h1 id="hero-title">${esc(person.name)}</h1>
      <p class="hero-role">${esc(person.headline)}</p>
      <p class="hero-lead">${esc(hero.lead)}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="resources/curriculum.pdf" download="Francesco-Sanna-CV.pdf">${icon('download')}Download CV</a>
        <a class="btn btn-ghost" href="#contact">Get in touch ${icon('arrow')}</a>
      </div>
    </div>
    <div class="hero-portrait">
      <div class="avatar" id="trigger-logo">
        <img src="assets/francesco-sanna.jpg" srcset="assets/francesco-sanna-280.jpg 280w, assets/francesco-sanna-360.jpg 360w, assets/francesco-sanna.jpg 560w" sizes="(max-width: 760px) 128px, clamp(200px, 30vw, 360px)" width="560" height="560" alt="Portrait of ${esc(person.name)}" fetchpriority="high" decoding="async">
      </div>
    </div>
  </div>
  <div class="wrap">
    <ul class="facts" aria-label="At a glance">${facts}</ul>
  </div>
</section>`;
  }
};
