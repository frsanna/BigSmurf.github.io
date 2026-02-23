// build-inline-components.js
const fs = require('fs');
const path = require('path');

/** Absolute path to the components directory. */
const componentsDir = path.join(__dirname, 'components');
/** Output file used as inline fallback for file:// mode. */
const outputFile = path.join(__dirname, 'components-inline.js');

/** Sorted list of partial HTML component filenames. */
const files = fs.readdirSync(componentsDir)
  .filter((file) => file.endsWith('.html'))
  .sort();

/** @type {Record<string, string>} Component-path to HTML markup map. */
const map = {};
for (const file of files) {
  const key = `components/${file}`;
  map[key] = fs.readFileSync(path.join(componentsDir, file), 'utf8');
}

/** Final JS payload written to `components-inline.js`. */
const output = [
  '// components-inline.js',
  '// Auto-generated fallback for file:// local testing',
  `window.__INLINE_COMPONENTS = ${JSON.stringify(map, null, 2)};`,
  ''
].join('\n');

fs.writeFileSync(outputFile, output);
console.log(`Generated ${path.basename(outputFile)} with ${files.length} component(s).`);
