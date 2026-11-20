const { esc } = require('../lib/html');

module.exports = {
  id: 'practice',
  render({ practice }) {
    const rows = practice
      .map((row) => {
        const body = row.text
          ? `<p class="practice-text">${esc(row.text)}</p>`
          : `<p>${row.points.map((point) => `<span>${esc(point)}</span>`).join('')}</p>`;
        return `
      <li class="practice-row">
        <h3>${esc(row.title)}</h3>
        ${body}
      </li>`;
      })
      .join('');
    return `
<section id="practice" class="section section-practice" aria-labelledby="practice-title">
  <div class="wrap">
    <h2 id="practice-title" class="sr-only">Practice</h2>
    <ul class="practice">${rows}</ul>
  </div>
</section>`;
  }
};
