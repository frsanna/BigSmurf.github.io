import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const projectRoot = resolve(process.cwd());
const distDir = resolve(projectRoot, "dist");

const cssSources = [
  "styles/base/tokens.css",
  "styles/base/reset.css",
  "styles/components/header.css",
  "styles/components/buttons.css",
  "styles/sections/hero.css",
  "styles/sections/content.css",
  "styles/components/cards.css",
  "styles/sections/gallery.css",
  "styles/sections/contact.css",
  "styles/base/responsive.css"
];

const jsSources = [
  "src/data/site-config.js",
  "src/services/content-service.js",
  "src/utils/dom.js",
  "src/components/info-card.js",
  "src/components/gallery-card.js",
  "src/modules/reveal.js",
  "src/modules/header.js",
  "src/modules/mobile-menu.js",
  "src/modules/info-sections.js",
  "src/modules/gallery.js",
  "src/main.js"
];

function readSource(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8").trim();
}

function ensureDirectory(directoryPath) {
  mkdirSync(directoryPath, { recursive: true });
}

function buildCss() {
  const output = cssSources
    .map((filePath) => `/* ${filePath} */\n${readSource(filePath)}`)
    .join("\n\n");

  return `${output}\n`;
}

function buildJs() {
  const output = jsSources
    .map((filePath) =>
      readSource(filePath)
        .replace(/^import\s.+?;\n?/gm, "")
        .replace(/^export\s+/gm, "")
    )
    .join("\n\n");

  return `${output}\n`;
}

ensureDirectory(distDir);
writeFileSync(resolve(distDir, "styles.css"), buildCss());
writeFileSync(resolve(distDir, "app.js"), buildJs());

console.log("Build completed.");
