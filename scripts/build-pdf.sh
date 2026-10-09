#!/usr/bin/env bash
# Prints the CV (generated from src/content/profile.json) to resources/curriculum.pdf.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

node "$ROOT/scripts/build.js" >/dev/null
if [[ ! -x "$CHROME" ]]; then
  echo "Google Chrome not found at $CHROME (set CHROME=/path/to/chrome)" >&2
  exit 1
fi

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --generate-pdf-document-outline \
  --print-to-pdf="$ROOT/resources/curriculum.pdf" "file://$ROOT/.cache/cv/index.html" 2>/dev/null
node "$ROOT/scripts/pdf-metadata.js" "$ROOT/resources/curriculum.pdf"
cp "$ROOT/.cache/cv/source.sha256" "$ROOT/resources/curriculum.sha256"
node "$ROOT/scripts/build.js"
echo "Wrote resources/curriculum.pdf"
