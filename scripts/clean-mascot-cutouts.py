"""Rebuild splash mascot cutouts: rembg + solidify body + green despill.

Root cause of prior broken legs/cloth:
  morphological close + large hole-fill bridged the gap BETWEEN the legs and
  painted tan blobs into crotch space. This pass never bridges legs.

Walk model: u2net_human_seg (better feet retention).
Front model: u2net on a mid-gray plate (keeps mint tiffin; human_seg ate it).

Sources:
  - assets/source/mascot-full.png → public/characters/mascot-tiffin-v2.png
  - Cursor assets mascot-walk-side + walk-01..03 → public/characters/walk/
"""

from __future__ import annotations

import shutil
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent.parent
BACKUP = ROOT / ".asset-backups" / "characters-pre-clean"
CHAR = ROOT / "public" / "characters"
WALK_OUT = CHAR / "walk"

ASSET_DIR = Path(
    "/Users/devandev/.cursor/projects/Users-devandev-tiffin-website/assets"
)
WALK_SOURCES = [
    ("walk_00.png", ASSET_DIR / "mascot-walk-side.png"),
    ("walk_01.png", ASSET_DIR / "walk-01.png"),
    ("walk_02.png", ASSET_DIR / "walk-02.png"),
    ("walk_03.png", ASSET_DIR / "walk-03.png"),
]

SESSION_WALK = new_session("u2net_human_seg")
SESSION_FRONT = new_session("u2net")


def studio_exterior_mask(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    h, w = rgb.shape[:2]
    corners = np.vstack(
        [
            rgb[:8, :8].reshape(-1, 3),
            rgb[:8, -8:].reshape(-1, 3),
            rgb[-8:, :8].reshape(-1, 3),
            rgb[-8:, -8:].reshape(-1, 3),
        ]
    )
    bg = corners.mean(axis=0).astype(np.float32)
    dist = np.linalg.norm(rgb.astype(np.float32) - bg, axis=2)
    thresh = 14.0 if bg.mean() > 248 else 26.0
    passable = (dist < thresh).astype(np.uint8) * 255
    ff = passable.copy()
    mask = np.zeros((h + 2, w + 2), np.uint8)
    for x, y in [
        (0, 0),
        (w - 1, 0),
        (0, h - 1),
        (w - 1, h - 1),
        (w // 2, 0),
        (w // 2, h - 1),
    ]:
        if passable[y, x] == 255 and ff[y, x] != 128:
            cv2.floodFill(ff, mask, (x, y), 128)
    return ff == 128, dist, bg


def despill_green(rgba: np.ndarray) -> np.ndarray:
    out = rgba.copy()
    rgb = out[..., :3].astype(np.float32)
    alpha = out[..., 3].astype(np.float32) / 255.0
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    green_excess = g - np.maximum(r, b)

    fabric = (alpha > 0.35) & (lum > 140) & (green_excess > 5)
    pull = np.clip(green_excess, 0, 90)
    g2, r2, b2 = g.copy(), r.copy(), b.copy()
    g2[fabric] = g[fabric] - pull[fabric] * 0.95
    boost = fabric & (lum > 165)
    r2[boost] = np.minimum(255, r[boost] + pull[boost] * 0.22)
    b2[boost] = np.minimum(255, b[boost] + pull[boost] * 0.16)

    edge = (alpha > 0.05) & (alpha < 0.92) & (green_excess > 3)
    g2[edge] = g[edge] - green_excess[edge] * 0.9
    hair = (alpha > 0.08) & (lum < 90) & (green_excess > 8)
    g2[hair] = np.maximum(r[hair], b[hair]) * 0.55 + g[hair] * 0.2

    out[..., 0] = np.clip(r2, 0, 255).astype(np.uint8)
    out[..., 1] = np.clip(g2, 0, 255).astype(np.uint8)
    out[..., 2] = np.clip(b2, 0, 255).astype(np.uint8)
    return out


def harden_alpha(rgba: np.ndarray, exterior: np.ndarray, dist: np.ndarray) -> np.ndarray:
    """Solidify body (opaque sneakers) without bridging the legs."""
    out = rgba.copy()
    a = out[..., 3].astype(np.float32)
    solid = (a >= 55) & (~exterior)
    a = np.where(solid, 255.0, a)
    fringe = (a > 0) & (a < 140) & (dist < 18)
    a[fringe] = 0
    a[exterior] = 0
    out[..., 3] = np.clip(a, 0, 255).astype(np.uint8)
    return out


def soften_alpha_edge(rgba: np.ndarray, radius: float = 0.8) -> np.ndarray:
    alpha = rgba[..., 3].astype(np.float32)
    blur = cv2.GaussianBlur(alpha, (0, 0), radius)
    core = alpha > 230
    out = rgba.copy()
    out[..., 3] = np.clip(
        np.where(core, np.maximum(alpha, blur), blur), 0, 255
    ).astype(np.uint8)
    return out


def trim(rgba: Image.Image, padding: int = 4) -> Image.Image:
    bbox = rgba.getbbox()
    if not bbox:
        return rgba
    l, t, r, b = bbox
    return rgba.crop(
        (
            max(0, l - padding),
            max(0, t - padding),
            min(rgba.width, r + padding),
            min(rgba.height, b + padding),
        )
    )


def process_cutout(
    src: Path,
    *,
    session,
    max_height: int | None = 900,
    gray_plate: bool = False,
) -> Image.Image:
    raw = Image.open(src).convert("RGB")
    rgb = np.array(raw)
    exterior, dist, bg = studio_exterior_mask(rgb)

    plate = rgb.copy()
    if gray_plate or bg.mean() > 248:
        plate[exterior] = (168, 168, 168)

    rem = np.array(remove(Image.fromarray(plate), session=session).convert("RGBA"))
    rem[..., :3] = rgb
    rem = harden_alpha(rem, exterior, dist)
    rem = despill_green(rem)
    rem = soften_alpha_edge(rem)

    img = Image.fromarray(rem, "RGBA")
    img = trim(img)
    if max_height and img.height > max_height:
        ratio = max_height / img.height
        img = img.resize(
            (max(1, round(img.width * ratio)), max_height), Image.LANCZOS
        )
    return img


def backup_existing() -> None:
    BACKUP.mkdir(parents=True, exist_ok=True)
    for name in ("mascot-tiffin-v2.png", "mascot-walk-side.png"):
        src = CHAR / name
        if src.exists():
            shutil.copy2(src, BACKUP / name)
    if WALK_OUT.exists():
        dest = BACKUP / "walk"
        if dest.exists():
            shutil.rmtree(dest)
        shutil.copytree(WALK_OUT, dest)


def main() -> None:
    backup_existing()
    WALK_OUT.mkdir(parents=True, exist_ok=True)

    front_src = ROOT / "assets" / "source" / "mascot-full.png"
    print("Cleaning front from", front_src)
    front = process_cutout(
        front_src, session=SESSION_FRONT, max_height=640, gray_plate=True
    )
    front_path = CHAR / "mascot-tiffin-v2.png"
    front.save(front_path, optimize=True)
    print("wrote", front_path.relative_to(ROOT), front.size)

    cleaned: list[Image.Image] = []
    for out_name, src in WALK_SOURCES:
        if not src.exists():
            raise SystemExit(f"Missing walk source: {src}")
        print("Cleaning walk", src.name, "→", out_name)
        cleaned.append(process_cutout(src, session=SESSION_WALK, max_height=900))

    max_w = max(im.width for im in cleaned)
    max_h = max(im.height for im in cleaned)

    def pad_center(im: Image.Image) -> Image.Image:
        canvas = Image.new("RGBA", (max_w, max_h), (0, 0, 0, 0))
        canvas.paste(im, ((max_w - im.width) // 2, max_h - im.height), im)
        return canvas

    padded = [pad_center(im) for im in cleaned]

    # 8-frame ping-pong so legs visibly alternate while walking
    sequence = [0, 1, 2, 3, 2, 1, 0, 3]
    for i, idx in enumerate(sequence):
        path = WALK_OUT / f"walk_{i:02d}.png"
        padded[idx].save(path, optimize=True)
        print("wrote", path.relative_to(ROOT), padded[idx].size)

    side_path = CHAR / "mascot-walk-side.png"
    padded[0].save(side_path, optimize=True)
    print("wrote", side_path.relative_to(ROOT), padded[0].size)
    print("done")


if __name__ == "__main__":
    main()
