#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMG="$ROOT/resources/img"
SVG="$IMG/favicon.svg"

if [[ ! -f "$SVG" ]]; then
  echo "Missing $SVG" >&2
  exit 1
fi

if ! command -v rsvg-convert >/dev/null 2>&1; then
  echo "rsvg-convert is required (librsvg)." >&2
  exit 1
fi

for size in 16 32 48 180; do
  rsvg-convert -w "$size" -h "$size" "$SVG" -o "$IMG/favicon-${size}.png"
done

IMG_DIR="$IMG" python3 - <<'PY'
import os
from pathlib import Path
from PIL import Image

img_dir = Path(os.environ["IMG_DIR"])
sizes = [16, 32, 48]
images = [Image.open(img_dir / f"favicon-{s}.png").convert("RGBA") for s in sizes]
out = img_dir / "logo.ico"
images[0].save(out, format="ICO", sizes=[(s, s) for s in sizes], append_images=images[1:])
print(f"Wrote {out}")
PY

cp "$IMG/favicon-32.png" "$IMG/apple-touch-icon.png"
echo "Favicon assets updated in $IMG"
