import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const projectRoot = resolve(process.cwd());
const allowedExtensions = new Set([".html", ".css", ".js", ".json", ".mjs"]);
const ignoredDirectories = new Set(["assets", "__pycache__"]);
const files = [];
const issues = [];

function collectFiles(directoryPath) {
  const entries = readdirSync(directoryPath, { withFileTypes: true });

  entries.forEach((entry) => {
    const absolutePath = join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        collectFiles(absolutePath);
      }
      return;
    }

    if (allowedExtensions.has(extname(entry.name))) {
      files.push(absolutePath);
    }
  });
}

function report(filePath, message) {
  issues.push(`${filePath.replace(`${projectRoot}/`, "")}: ${message}`);
}

collectFiles(projectRoot);

files.forEach((filePath) => {
  const source = readFileSync(filePath, "utf8");

  if (source.includes("\r")) {
    report(filePath, "uses CRLF line endings");
  }

  if (!source.endsWith("\n")) {
    report(filePath, "is missing a final newline");
  }

  const lines = source.split("\n");
  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    if (/\t/.test(line)) {
      report(filePath, `line ${lineNumber} contains tab indentation`);
    }

    if (/[ \t]+$/.test(line)) {
      report(filePath, `line ${lineNumber} contains trailing whitespace`);
    }
  });

  if (extname(filePath) === ".json") {
    try {
      JSON.parse(source);
    } catch (error) {
      report(filePath, `contains invalid JSON: ${error.message}`);
    }
  }

  if (extname(filePath) === ".js" || extname(filePath) === ".mjs") {
    try {
      execFileSync(process.execPath, ["--check", filePath], {
        stdio: "pipe"
      });
    } catch (error) {
      report(filePath, `contains invalid JavaScript: ${error.stderr?.toString().trim() || error.message}`);
    }
  }
});

if (issues.length) {
  console.error("Lint failed:\n");
  issues.forEach((issue) => console.error(`- ${issue}`));
  process.exit(1);
}

console.log(`Lint passed for ${files.length} files.`);
