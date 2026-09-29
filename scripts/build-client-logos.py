"""Build web-ready client logos from the white-on-black originals.

    python scripts/build-client-logos.py

Reads  public/clients/*.png|jpg   (white artwork on a black backdrop)
Writes public/clients/web/*.png   (white artwork, transparent, trimmed)

Why this exists:

1. The originals are RGB with no alpha channel. Dropped onto the site they
   carry a visible black box unless the backdrop happens to match exactly.
2. They are square-padded. Sizing by height would shrink the visible mark --
   Elan's artwork is 226px tall inside a 793px canvas.
3. next.config.js sets `images.unoptimized`, so Next does NO resizing. A 900 KB
   PNG would ship in full to render a 50px logo.

For white artwork on a black backdrop the luminance IS the alpha channel, so
the conversion is exact -- antialiased edges included. Nothing is recoloured.

After running, update the `logos` array in components/ClientMarquee.jsx with the
printed dimensions.
"""
import os
import sys

import numpy as np
from PIL import Image

SRC = "public/clients"
OUT = os.path.join(SRC, "web")

# Each logo is generated at EXACTLY 2x its on-page display height.
#
# This is deliberate and was measured. Oversizing does NOT help: a 320px file
# shown at 92 CSS px is downscaled by the browser with a cheap bilinear filter
# every frame, which is what made the fine lettering look soft. Generating at
# the device size means the browser draws it 1:1 on a 2x screen (and a clean 2:1
# on a 1x screen), with the high-quality LANCZOS downscale done once, here.
#
# These MUST match the `display` values in components/ClientMarquee.jsx.
DISPLAY_HEIGHTS = {
    "mla": 88,
    "vaayu": 92,
    "vetaas": 74,
    "praasa": 72,
    "elevare": 58,
    "elan": 32,
}
DEVICE_SCALE = 2
FALLBACK_HEIGHT = 160
FLOOR = 10.0       # luminance at or below this is backdrop, not artwork
CEIL = 235.0       # luminance at or above this is fully opaque white

EXTS = (".png", ".jpg", ".jpeg", ".webp")

# Logos whose trailing strapline is too small to ever be legible in the strip.
# Measured: Praasa's "WHERE KNOWLEDGE IS DEFINED" is 4% of the logo height, which
# is 2.4px on screen; Elevare's is 6%, or 3.5px. No amount of resolution makes
# 3px letters readable, and the mush is what reads as "low quality". Cropping to
# the mark plus the name is what the big logo strips do.
#
# NOTE: this alters a client's logo. Most brands have an official no-strapline
# lockup for small sizes -- prefer that if you can get it, and check before
# publishing a cropped mark.
STRIP_STRAPLINE = {"praasa", "elevare"}

# A trailing band smaller than this fraction of total height is a strapline,
# not the brand name. Vetaas's "VETAAS" is 18% and must survive.
STRAPLINE_MAX_FRACTION = 0.10
MIN_GAP_PX = 3


def strip_strapline(img):
    """Crop a small trailing text band, keeping the mark and the brand name.

    Finds horizontal blank rows, and if the last ink band is a small fraction of
    the total height it is treated as a strapline and removed.
    """
    alpha = np.array(img)[:, :, 3].astype(int)
    h = alpha.shape[0]
    rows = (alpha > 40).sum(axis=1)

    gaps = []
    start = None
    for i, empty in enumerate(rows == 0):
        if empty and start is None:
            start = i
        elif not empty and start is not None:
            if i - start >= MIN_GAP_PX:
                gaps.append((start, i))
            start = None
    if not gaps:
        return img, None

    ink = np.nonzero(rows)[0]
    last_gap_end = gaps[-1][1]
    band_height = ink[-1] - last_gap_end + 1
    if band_height / h > STRAPLINE_MAX_FRACTION:
        return img, None

    cropped = img.crop((0, 0, img.size[0], gaps[-1][0]))
    box = cropped.getbbox()
    if box:
        cropped = cropped.crop(box)
    return cropped, band_height


def build(name):
    path = os.path.join(SRC, name)
    rgb = np.array(Image.open(path).convert("RGB")).astype(float)

    luma = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
    # The FLOOR is what makes getbbox() able to trim: without it the backdrop
    # keeps a residual alpha of ~3 and the crop is a no-op.
    alpha = np.clip((luma - FLOOR) / (CEIL - FLOOR), 0, 1) * 255.0

    img = Image.fromarray(
        np.dstack([np.full(rgb.shape, 255.0), alpha]).astype(np.uint8), "RGBA"
    )

    box = img.getbbox()
    if box:
        img = img.crop(box)

    stripped = None
    if os.path.splitext(name)[0].lower() in STRIP_STRAPLINE:
        img, stripped = strip_strapline(img)

    slug = os.path.splitext(name)[0].lower()
    target = DISPLAY_HEIGHTS.get(slug, FALLBACK_HEIGHT // DEVICE_SCALE) * DEVICE_SCALE

    w, h = img.size
    if h != target:
        img = img.resize((max(1, round(w * target / h)), target), Image.LANCZOS)

    out_path = os.path.join(OUT, os.path.splitext(name)[0] + ".png")
    img.save(out_path, optimize=True)
    return os.path.getsize(path), os.path.getsize(out_path), img.size, stripped


def main():
    if not os.path.isdir(SRC):
        print(f"missing source directory: {SRC}")
        return 1
    os.makedirs(OUT, exist_ok=True)

    names = sorted(
        f for f in os.listdir(SRC)
        if os.path.isfile(os.path.join(SRC, f)) and f.lower().endswith(EXTS)
    )
    if not names:
        print(f"no images found in {SRC}")
        return 1

    total_in = total_out = 0
    print(f"\n{SRC}/  ->  {OUT}/\n")
    for name in names:
        size_in, size_out, (w, h), stripped = build(name)
        total_in += size_in
        total_out += size_out
        slug = os.path.splitext(name)[0]
        note = f"  (strapline removed, {stripped}px)" if stripped else ""
        print(f"  {slug:12} {w:4}x{h:<4} ratio={w / h:5.2f}  {size_out / 1024:6.1f} KB{note}")

    print(f"\n  total {total_in / 1024 / 1024:.2f} MB -> {total_out / 1024:.0f} KB")
    print("\n  Paste these into the `logos` array in components/ClientMarquee.jsx:\n")
    for name in names:
        slug = os.path.splitext(name)[0]
        with Image.open(os.path.join(OUT, slug + ".png")) as im:
            w, h = im.size
        print(f'    {{ src: "/clients/web/{slug}.png", alt: "...", w: {w}, h: {h}, display: 50 }},')
    print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
