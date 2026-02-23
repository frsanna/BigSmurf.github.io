// build-inline-components.js
const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');
const outputFile = path.join(__dirname, 'components-inline.js');

const files = fs.readdirSync(componentsDir)
  .filter((file) => file.endsWith('.html'))
  .sort();

const map = {};
for (const file of files) {
  const key = `components/${file}`;
  map[key] = fs.readFileSync(path.join(componentsDir, file), 'utf8');
}

const output = [
  '// components-inline.js',
  '// Auto-generated fallback for file:// local testing',
  `window.__INLINE_COMPONENTS = ${JSON.stringify(map, null, 2)};`,
  ''
].join('\n');

fs.writeFileSync(outputFile, output);
console.log(`Generated ${path.basename(outputFile)} with ${files.length} component(s).`);
