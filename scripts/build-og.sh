#!/usr/bin/env bash
# Renders the 1200x630 social preview image to src/assets/og-image.png.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
TMP="$ROOT/.cache/og"
mkdir -p "$TMP"
cp "$ROOT/src/assets/francesco-sanna.jpg" "$ROOT/src/assets/fonts/dm-sans-latin-wght-normal.woff2" "$TMP/"
node -e '
const d=require(process.argv[1]);const e=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
require("fs").writeFileSync(process.argv[2],`<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:D;src:url(dm-sans-latin-wght-normal.woff2)}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;font-family:D,sans-serif;background:#0c1f1d;color:#eef5f3;display:flex;align-items:center;gap:64px;padding:0 88px;position:relative;overflow:hidden}
body:before{content:"";position:absolute;right:-180px;top:-260px;width:820px;height:820px;background:radial-gradient(circle,rgba(42,157,143,.35) 0,transparent 60%)}
.t{position:relative;flex:1}.b{font-weight:700;font-size:34px;letter-spacing:-.05em;margin-bottom:36px}.b i{font-style:normal;color:#e76f51}.b span{color:#1f7a70}
h1{font-size:84px;line-height:1;letter-spacing:-.045em;font-weight:700}h2{font-size:33px;color:#5ccbbb;font-weight:600;margin:20px 0 28px}
p{font-size:25px;line-height:1.38;color:#a9c2bd;max-width:640px}.bar{width:72px;height:6px;border-radius:3px;background:#e76f51;margin-bottom:28px}
.p{position:relative;width:340px;height:340px}.p:after{content:"";position:absolute;inset:-16px;border-radius:50%;border:4px solid #2a9d8f;border-right-color:#e76f51;border-bottom-color:#e76f51;transform:rotate(-20deg)}img{width:340px;height:340px;border-radius:50%;object-fit:cover}
</style><div class="t"><div class="bar"></div><h1>${e(d.person.name)}</h1><h2>${e(d.person.headline)}</h2><p>${e(d.hero.lead)}</p></div><div class="p"><img src="francesco-sanna.jpg" alt=""></div>`);
' "$ROOT/src/content/profile.json" "$TMP/og.html"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 \
  --screenshot="$TMP/og.png" "file://$TMP/og.html" 2>/dev/null
sips -s format jpeg -s formatOptions 82 "$TMP/og.png" --out "$ROOT/src/assets/og-image.jpg" >/dev/null
echo "Wrote src/assets/og-image.jpg"
