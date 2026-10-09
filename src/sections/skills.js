const { esc } = require('../lib/html');

module.exports = {
  id: 'skills',
  nav: 'Skills',
  render({ skills }) {
    const groups = skills
      .map(
        (g) => `
      <div class="skill-group reveal">
        <h3>${esc(g.group)}</h3>
        <ul class="chips">${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>`
      )
      .join('');
    return `
<section id="skills" class="section section-alt" aria-labelledby="skills-title">
  <div class="wrap">
    <header class="section-head"><h2 id="skills-title">Skills</h2></header>
    <div class="skill-groups">${groups}</div>
  </div>
</section>`;
  }
};
