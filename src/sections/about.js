const { esc } = require('../lib/html');

module.exports = {
  id: 'about',
  nav: 'About',
  render({ about }) {
    const paragraphs = about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('');
    return `
<section id="about" class="section" aria-labelledby="about-title">
  <div class="wrap">
    <header class="section-head"><h2 id="about-title">About Me</h2></header>
    <div class="about-copy">${paragraphs}</div>
  </div>
</section>`;
  }
};
