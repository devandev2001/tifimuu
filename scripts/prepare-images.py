"""Reproducible asset pipeline for Tiffimu character + logo images.

Reads untouched source art from assets/source/ and writes transparent
web copies into public/characters/ (plus a logo + app icon).

Run:  python3 scripts/prepare-images.py

Uses border flood-fill background removal (Pillow) so interior whites
(like the mascot shirt) stay opaque while flat studio backgrounds go
transparent. Prefer rembg when available for trickier edges.
"""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "source"
CHAR_OUT = ROOT / "public" / "characters"
IMG_OUT = ROOT / "public" / "images"


def flood_fill_transparent(img: Image.Image, tolerance: int) -> Image.Image:
    """Make the border-connected background transparent."""
    rgba = img.convert("RGBA")
    width, height = rgba.size
    pixels = rgba.load()
    bg = pixels[0, 0][:3]

    def is_bg(px: tuple[int, ...]) -> bool:
        return all(abs(px[i] - bg[i]) <= tolerance for i in range(3))

    seen = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        idx = y * width + x
        if seen[idx]:
            continue
        seen[idx] = 1
        px = pixels[x, y]
        if not is_bg(px):
            continue
        pixels[x, y] = (px[0], px[1], px[2], 0)
        if x > 0:
            queue.append((x - 1, y))
        if x < width - 1:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y < height - 1:
            queue.append((x, y + 1))
    return rgba


def trim(img: Image.Image, padding: int = 8) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    left = max(bbox[0] - padding, 0)
    top = max(bbox[1] - padding, 0)
    right = min(bbox[2] + padding, img.width)
    bottom = min(bbox[3] + padding, img.height)
    return img.crop((left, top, right, bottom))


def save(img: Image.Image, dest: Path, max_height: int | None = None) -> None:
    if max_height and img.height > max_height:
        ratio = max_height / img.height
        img = img.resize((round(img.width * ratio), max_height), Image.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, optimize=True)
    # Transparency sanity: corners must be fully transparent for cutouts.
    sample = img.convert("RGBA")
    corners = [
        sample.getpixel((0, 0))[3],
        sample.getpixel((sample.width - 1, 0))[3],
        sample.getpixel((0, sample.height - 1))[3],
        sample.getpixel((sample.width - 1, sample.height - 1))[3],
    ]
    print(
        f"wrote {dest.relative_to(ROOT)}  {img.size}  "
        f"corner_alphas={corners}"
    )


def main() -> None:
    CHAR_OUT.mkdir(parents=True, exist_ok=True)
    IMG_OUT.mkdir(parents=True, exist_ok=True)

    # Mascot with tiffin carrier (white studio background).
    mascot = Image.open(SRC / "mascot-full.png")
    mascot_cut = trim(flood_fill_transparent(mascot, tolerance=28))
    save(mascot_cut, CHAR_OUT / "mascot-tiffin.png", max_height=900)
    save(mascot_cut, IMG_OUT / "mascot-tiffin.png", max_height=900)

    # Alternate full-body pose (also white bg).
    alt = Image.open(SRC / "mascot-full-alt.png")
    alt_cut = trim(flood_fill_transparent(alt, tolerance=28))
    save(alt_cut, CHAR_OUT / "mascot-wave.png", max_height=900)

    # Cook / soup-pot mascot (lime studio background).
    soup = Image.open(SRC / "mascot-soup-pot.png")
    soup_cut = trim(flood_fill_transparent(soup, tolerance=18))
    save(soup_cut, CHAR_OUT / "mascot-cook.png", max_height=900)
    save(soup_cut, IMG_OUT / "mascot-soup.png", max_height=900)

    # Logo lockup — keep brand pistachio field (do not cut out).
    logo = Image.open(SRC / "tiffimu-logo.png").convert("RGB")
    logo_path = CHAR_OUT / "logo.png"
    logo.save(logo_path, optimize=True)
    logo.save(IMG_OUT / "logo.png", optimize=True)
    print(f"wrote {logo_path.relative_to(ROOT)}  {logo.size}")

    # Square head crop for favicon / footer.
    face = Image.open(SRC / "mascot-soup-pot.png").convert("RGB")
    icon = face.crop((330, 120, 730, 520)).resize((256, 256), Image.LANCZOS)
    icon_cut = trim(flood_fill_transparent(icon, tolerance=22))
    save(icon_cut, CHAR_OUT / "mascot-head.png")
    save(icon_cut, IMG_OUT / "mascot-head.png")
    icon.save(ROOT / "src" / "app" / "icon.png", optimize=True)
    print("wrote src/app/icon.png", icon.size)


if __name__ == "__main__":
    main()
