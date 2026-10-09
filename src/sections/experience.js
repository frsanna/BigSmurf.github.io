const { esc } = require('../lib/html');

const MONTHS = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };

/** Wraps "Sep 2024" / "2010" in a machine-readable <time>; leaves "Present" as text. */
function time(label) {
  const m = /^(?:([A-Z][a-z]{2}) )?(\d{4})$/.exec(label);
  if (!m) return esc(label);
  const iso = m[1] ? `${m[2]}-${MONTHS[m[1]]}` : m[2];
  return `<time datetime="${iso}">${esc(label)}</time>`;
}

module.exports = {
  id: 'experience',
  nav: 'Experience',
  render({ experience }) {
    const items = experience
      .map((job) => {
        const bullets = job.bullets.map((b) => `<li>${esc(b.text)}</li>`).join('');
        return `
      <li class="job reveal">
        <p class="job-dates">${time(job.start)} – ${time(job.end)}</p>
        <div class="job-body">
          <h3>${esc(job.role)}</h3>
          <p class="job-company">${esc(job.company)}</p>${job.note ? `\n          <p class="job-note">${esc(job.note)}</p>` : ''}
          <ul>${bullets}</ul>
        </div>
      </li>`;
      })
      .join('');
    return `
<section id="experience" class="section section-alt" aria-labelledby="experience-title">
  <div class="wrap">
    <header class="section-head"><h2 id="experience-title">Experience</h2></header>
    <ol class="timeline">${items}</ol>
  </div>
</section>`;
  }
};
