const { esc } = require('../lib/html');
const { icon } = require('../lib/icons');

module.exports = {
  id: 'contact',
  nav: 'Contact',
  render({ person, contact }) {
    return `
<section id="contact" class="section section-contact" aria-labelledby="contact-title">
  <div class="wrap contact-grid">
    <div>
      <h2 id="contact-title">Contact</h2>
      <p class="contact-intro">${esc(contact.intro)}</p>
      <p class="contact-foot">${esc(contact.footnote)}</p>
    </div>
    <ul class="contact-list">
      <li>${icon('mail')}<a href="mailto:${esc(person.email)}">${esc(person.email)}</a></li>
      <li>${icon('linkedin')}<a href="${esc(person.linkedin)}" target="_blank" rel="noopener noreferrer me">LinkedIn</a></li>
      <li class="contact-meta">${icon('pin')}<span>${esc(person.location)}</span></li>
      <li class="contact-meta">${icon('language')}<span>${esc(person.languages)}</span></li>
    </ul>
  </div>
</section>`;
  }
};
