#!/usr/bin/env python3

import json
import pathlib
import re
import urllib.request


PROFILE_USERNAME = "ib.bagni_ceramiche_nuoro"
PROFILE_URL = (
    "https://www.instagram.com/api/v1/users/web_profile_info/"
    f"?username={PROFILE_USERNAME}"
)
PROFILE_HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "x-ig-app-id": "936619743392459",
}
ROOT = pathlib.Path(__file__).resolve().parent
GALLERY_DIR = ROOT / "assets" / "gallery"
MANIFEST_PATH = GALLERY_DIR / "gallery-data.json"
POST_LIMIT = 6


def slug_to_label(caption: str) -> str:
    text = caption.lower()

    if "doccia" in text:
      return "Docce"
    if "prima e il dopo" in text or "prima e dopo" in text:
      return "Prima / dopo"
    if "render" in text:
      return "Render"
    if "paviment" in text or "rivest" in text:
      return "Superfici"
    if "decoro" in text:
      return "Decori"
    return "Showroom"


def make_title(caption: str) -> str:
    clean = re.sub(r"\s+", " ", caption).strip(" -")

    if not clean:
      return "Aggiornamenti dal profilo Instagram del negozio"

    short = clean[:92].rstrip()
    if len(clean) > 92:
      short = short.rsplit(" ", 1)[0] + "…"
    return short


def make_alt(caption: str, index: int) -> str:
    base = re.sub(r"\s+", " ", caption).strip(" -")
    if not base:
      return f"Immagine Instagram IB Bagni Ceramiche {index}"
    short = base[:110].rstrip()
    if len(base) > 110:
      short = short.rsplit(" ", 1)[0] + "…"
    return short


def fetch_json() -> dict:
    request = urllib.request.Request(PROFILE_URL, headers=PROFILE_HEADERS)
    with urllib.request.urlopen(request) as response:
        return json.loads(response.read().decode("utf-8"))


def download_file(url: str, destination: pathlib.Path) -> None:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request) as response:
        destination.write_bytes(response.read())


def main() -> None:
    payload = fetch_json()
    edges = payload["data"]["user"]["edge_owner_to_timeline_media"]["edges"][:POST_LIMIT]

    GALLERY_DIR.mkdir(parents=True, exist_ok=True)

    manifest = []

    for index, edge in enumerate(edges, start=1):
        node = edge["node"]
        caption_edges = node.get("edge_media_to_caption", {}).get("edges", [])
        caption = caption_edges[0]["node"]["text"] if caption_edges else ""
        shortcode = node["shortcode"]
        image_url = node.get("display_url") or node.get("thumbnail_src")
        image_path = GALLERY_DIR / f"post-{index}.jpg"

        download_file(image_url, image_path)

        manifest.append(
            {
                "label": slug_to_label(caption),
                "title": make_title(caption),
                "alt": make_alt(caption, index),
                "image": f"assets/gallery/post-{index}.jpg",
                "postUrl": f"https://www.instagram.com/p/{shortcode}/",
            }
        )

    MANIFEST_PATH.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Updated {len(manifest)} gallery items in {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
