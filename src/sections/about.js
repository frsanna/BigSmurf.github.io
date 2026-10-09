const { esc } = require('../lib/html');

module.exports = {
  id: 'about',
  nav: 'About',
  render({ about }) {
    const paragraphs = about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('');
    const strengths = about.strengths
      .map(
        (s, i) => `
      <li class="strength">
        <span class="strength-index" aria-hidden="true">0${i + 1}</span>
        <h3>${esc(s.title)}</h3>
        <ul>${s.points.map((pt) => `<li>${esc(pt)}</li>`).join('')}</ul>
      </li>`
      )
      .join('');
    return `
<section id="about" class="section" aria-labelledby="about-title">
  <div class="wrap">
    <header class="section-head"><h2 id="about-title">About Me</h2></header>
    <div class="about-copy reveal">${paragraphs}</div>
    <ul class="strengths reveal" aria-label="Core strengths">${strengths}</ul>
  </div>
</section>`;
  }
};
