// <head> metadata and structured data, generated from content/profile.json.
const { esc } = require('./html');

function jsonLd(data) {
  const { site, person, skills, education, experience } = data;
  const current = experience[0];
  const knowsAbout = skills.flatMap((g) => g.items);
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${site.url}#profile`,
        url: site.url,
        name: site.title,
        description: site.description,
        inLanguage: site.lang,
        dateModified: data.build.date,
        mainEntity: { '@id': `${site.url}#person` }
      },
      {
        '@type': 'Person',
        '@id': `${site.url}#person`,
        name: person.name,
        jobTitle: person.headline,
        description: site.description,
        url: site.url,
        email: person.email,
        image: `${site.url}assets/francesco-sanna.jpg`,
        address: { '@type': 'PostalAddress', addressLocality: 'Cagliari', addressCountry: 'IT' },
        knowsLanguage: person.languages.split(', '),
        worksFor: {
          '@type': 'Organization',
          name: current.org || current.company,
          ...(current.parentOrg ? { parentOrganization: { '@type': 'Organization', name: current.parentOrg } } : {})
        },
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Cagliari' },
        hasCredential: [
          ...education.degrees.map((d) => ({
            '@type': 'EducationalOccupationalCredential',
            name: d.text,
            credentialCategory: 'degree',
            recognizedBy: { '@type': 'CollegeOrUniversity', name: 'University of Cagliari' }
          })),
          ...education.additional.map((a) => ({
          '@type': 'EducationalOccupationalCredential',
          name: a.text,
          credentialCategory: 'certificate',
          url: a.href
          }))
        ],
        knowsAbout,
        sameAs: [person.linkedin]
      }
    ]
  };
  // Escape "<" so the JSON can never close the script tag.
  return JSON.stringify(graph, null, 2).replace(/</g, '\\u003c');
}

// All local URLs are root-absolute so the same <head> works on nested 404 paths.
function head(data, { css, title, description, canonical = data.site.url, robots = 'index, follow' }) {
  const { site, person } = data;
  const og = `${site.url}assets/og-image.jpg`;
  const social = canonical
    ? `
<link rel="canonical" href="${esc(canonical)}">
<link rel="alternate" type="application/pdf" href="${site.url}resources/curriculum.pdf" title="${esc(person.name)} – CV (PDF)">
<meta property="og:type" content="profile">
<meta property="og:site_name" content="${esc(person.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(site.ogDescription)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(person.name)}, ${esc(person.headline)}">
<meta property="og:locale" content="${site.locale}">
<meta property="profile:first_name" content="Francesco">
<meta property="profile:last_name" content="Sanna">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(site.ogDescription)}">
<meta name="twitter:image" content="${og}">
<meta name="twitter:image:alt" content="${esc(person.name)}, ${esc(person.headline)}">`
    : '';
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="author" content="${esc(person.name)}">
<meta name="robots" content="${robots}">
<meta name="theme-color" content="${site.themeColor}">
<meta name="color-scheme" content="light">${social}
<link rel="icon" href="/resources/img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/resources/img/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/resources/img/favicon-180.png" sizes="180x180">
<link rel="preload" href="/assets/fonts/dm-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${css}">`;
}

module.exports = { head, jsonLd };
