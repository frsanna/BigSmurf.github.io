// Printable CV (A4), rendered from the same content as the website.
// The PDF is produced by scripts/build-pdf.sh with headless Chrome.
const { esc } = require('./lib/html');

function render(data) {
  const { person, about, experience, projects, skills, education, gdpr, site } = data;
  const skillLines = skills
    .map((g) => `<p class="skills-line"><strong>${esc(g.group)}:</strong> ${g.items.map(esc).join(', ')}</p>`)
    .join('');
  const jobs = experience
    .map((j) => {
      const bullets = j.bullets.filter((b) => b.short).map((b) => `<li>${esc(b.short)}</li>`).join('');
      return `
      <article class="job">
        <div class="job-head">
          <h3 class="job-title">${esc(j.role)}</h3>
          <p class="job-dates">${esc(j.start)} – ${esc(j.end)}</p>
        </div>
        <p class="company">${esc(j.company)}</p>
        ${j.note ? `<p class="job-note">${esc(j.note)}</p>` : ''}
        <ul>${bullets}</ul>
      </article>`;
    })
    .join('');
  const projectLines = projects.items
    .filter((p) => p.pdf)
    .map((p) => `<p><strong>${esc(p.pdfName)}.</strong> ${esc(p.pdf)}</p>`)
    .join('');
  const certs = education.additional
    .map((a) => `<p>${esc(a.text)} · <a href="${esc(a.href)}">${esc(a.href.replace(/^https:\/\//, ''))}</a></p>`)
    .join('');

  return `<!doctype html>
<html lang="${site.lang}">
<head>
<meta charset="utf-8">
<title>${esc(person.name)} – ${esc(person.headline)} – CV</title>
<meta name="author" content="${esc(person.name)}">
<meta name="description" content="${esc(site.description)}">
<meta name="keywords" content="${esc(skills.flatMap((g) => g.items).join(', '))}">
<link rel="stylesheet" href="pdf.css">
</head>
<body>
<div class="cv">
  <header class="cv-header">
    <h1>${esc(person.name)}</h1>
    <p class="headline">${esc(person.headline)}</p>
    <p class="contact">
      ${esc(person.location)}<br>
      <a href="mailto:${esc(person.email)}">${esc(person.email)}</a> · <a href="${esc(person.linkedin)}">${esc(person.linkedinLabel)}</a> · <a href="${esc(site.url)}">${esc(person.websiteLabel)}</a><br>
      ${esc(person.workSetup)} · Languages: ${esc(person.languages)}
    </p>
  </header>
  <section><h2>Profile</h2><p class="summary">${esc(about.pdfSummary)}</p></section>
  <section><h2>Experience</h2>${jobs}</section>
  <section><h2>Skills</h2>${skillLines}</section>
  <section class="projects"><h2>${projects.items.filter((p) => p.pdf).length > 1 ? 'Selected projects' : 'Selected project'}</h2>${projectLines}</section>
  <section><h2>Education</h2>${education.degrees.map((d) => `<p>${esc(d.text)}</p>`).join('')}</section>
  <section><h2>Certifications</h2>${certs}</section>
  <p class="gdpr">${esc(gdpr)}</p>
</div>
</body>
</html>
`;
}

module.exports = { render };
