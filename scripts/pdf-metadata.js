#!/usr/bin/env node
// Adds Author/Subject/Keywords to the Chrome-generated PDF via an incremental update
// (appends a new Info dictionary; the original bytes are left untouched).
// Usage: node scripts/pdf-metadata.js <file.pdf>
const fs = require('fs');
const path = require('path');

const file = process.argv[2];
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'content', 'profile.json'), 'utf8'));
const pdf = fs.readFileSync(file);
const text = pdf.toString('latin1');

const trailer = text.slice(text.lastIndexOf('trailer'));
const size = Number(/\/Size (\d+)/.exec(trailer)[1]);
const root = /\/Root (\d+ \d+ R)/.exec(trailer)[1];
const prev = Number(/startxref\s+(\d+)/.exec(text.slice(text.lastIndexOf('startxref')))[1]);
if (/\/XRefStm|\/Type\s*\/XRef/.test(trailer)) throw new Error('Cross-reference streams are not supported');

/** PDF text string as UTF-16BE hex, safe for any character. */
const str = (s) => `<FEFF${Buffer.from(s, 'utf16le').swap16().toString('hex').toUpperCase()}>`;
// Carry over Chrome's Producer/CreationDate from the existing Info dictionary.
const infoRef = /\/Info (\d+) 0 R/.exec(trailer);
const oldInfo = infoRef ? (new RegExp(`(?:^|\\s)${infoRef[1]} 0 obj\\s*<<([\\s\\S]*?)>>\\s*endobj`).exec(text) || [])[1] || '' : '';
const keep = ['Producer', 'CreationDate']
  .map((k) => (new RegExp(`/${k}\\s*(\\([^)]*\\)|<[0-9A-Fa-f]*>)`).exec(oldInfo) || [])[0])
  .filter(Boolean);
const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
const modDate = `(D:${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z)`;

const { person, skills, site } = data;
const info = [
  `/Title ${str(`${person.name} – ${person.headline} – CV`)}`,
  `/Author ${str(person.name)}`,
  `/Subject ${str(site.description)}`,
  `/Keywords ${str([...person.headline.split(' & '), 'Tech Lead', ...skills.flatMap((g) => g.items)].join(', '))}`,
  `/Creator ${str('francescosanna.eu build (Headless Chrome)')}`,
  `/ModDate ${modDate}`,
  ...keep
].join('\n');

const objNum = size; // new object number
const head = pdf[pdf.length - 1] === 0x0a ? '' : '\n';
const objOffset = pdf.length + Buffer.byteLength(head, 'latin1');
const obj = `${objNum} 0 obj\n<<${info}>>\nendobj\n`;
const xrefOffset = objOffset + Buffer.byteLength(obj, 'latin1');
const xref = `xref\n${objNum} 1\n${String(objOffset).padStart(10, '0')} 00000 n \ntrailer\n<</Size ${size + 1}\n/Root ${root}\n/Info ${objNum} 0 R\n/Prev ${prev}>>\nstartxref\n${xrefOffset}\n%%EOF\n`;
fs.writeFileSync(file, Buffer.concat([pdf, Buffer.from(head + obj + xref, 'latin1')]));
console.log(`Metadata written to ${path.basename(file)}`);
