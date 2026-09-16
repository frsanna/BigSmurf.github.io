#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HTML="$ROOT/resources/curriculum-export.html"
OUT="$ROOT/resources/curriculum.pdf"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

if [[ ! -f "$HTML" ]]; then
  echo "Missing $HTML" >&2
  exit 1
fi

if [[ ! -x "$CHROME" ]]; then
  echo "Google Chrome not found at $CHROME" >&2
  exit 1
fi

"$CHROME" \
  --headless=new \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="$OUT" \
  "file://$HTML"

echo "Wrote $OUT"
