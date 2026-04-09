import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const projectRoot = resolve(process.cwd());
const allowedExtensions = new Set([".html", ".css", ".js", ".json", ".mjs"]);
const ignoredDirectories = new Set(["assets", "__pycache__"]);

function collectFiles(directoryPath, result = []) {
  const entries = readdirSync(directoryPath, { withFileTypes: true });

  entries.forEach((entry) => {
    const absolutePath = join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        collectFiles(absolutePath, result);
      }
      return;
    }

    if (allowedExtensions.has(extname(entry.name))) {
      result.push(absolutePath);
    }
  });

  return result;
}

function normalizeSource(source) {
  const normalized = source
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\t/g, "  ").replace(/[ \t]+$/g, ""))
    .join("\n");

  return normalized.endsWith("\n") ? normalized : `${normalized}\n`;
}

const files = collectFiles(projectRoot);

files.forEach((filePath) => {
  const currentSource = readFileSync(filePath, "utf8");
  const nextSource = normalizeSource(currentSource);

  if (currentSource !== nextSource) {
    writeFileSync(filePath, nextSource);
    console.log(`Formatted ${filePath.replace(`${projectRoot}/`, "")}`);
  }
});
