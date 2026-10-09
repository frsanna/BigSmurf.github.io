const { esc } = require('../lib/html');
const { icon } = require('../lib/icons');

module.exports = {
  id: 'education',
  nav: 'Education',
  render({ education }) {
    const degrees = education.degrees.map((d) => `<li>${icon('cap')}<span>${esc(d.text)}</span></li>`).join('');
    const extra = education.additional
      .map(
        (a) => `<li>${icon('badge')}<a href="${esc(a.href)}" target="_blank" rel="noopener noreferrer">${esc(a.text)}</a></li>`
      )
      .join('');
    return `
<section id="education" class="section" aria-labelledby="education-title">
  <div class="wrap">
    <header class="section-head"><h2 id="education-title">Education &amp; Certifications</h2></header>
    <ul class="edu-list reveal">${degrees}</ul>
    <p class="edu-label">Certifications</p>
    <ul class="edu-list reveal">${extra}</ul>
  </div>
</section>`;
  }
};
