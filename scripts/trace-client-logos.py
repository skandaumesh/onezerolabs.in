"""Trace client logos to SVG.

    python scripts/trace-client-logos.py

Reads  public/clients/*.png   (white artwork on a black backdrop)
Writes public/clients/svg/*.svg

Artwork is emitted with fill="{FILL}" so the page decides the colour:
the same file works on a dark or a light background.

WHY SVG: the browser's device pixel ratio is not always a whole number. On a
Windows display at 125% scaling DPR is 1.25, so a 92px logo occupies 115 device
pixels. No fixed-size PNG divides into that cleanly -- a 184px file is a 0.625x
downscale, the worst case for bilinear filtering, which is what made the thin
strokes look soft. A vector has no resolution, so it is exact at 1.0, 1.25, 1.5,
2.0 or anything else.
"""
import os
import sys

import cv2
import numpy as np

SRC = "public/clients"
OUT = os.path.join(SRC, "svg")

LUMA_THRESHOLD = 40      # above this is artwork, below is backdrop
FILL = "#0B0D12"          # ink; matches ozl.ink. Change here to re-theme.
SIMPLIFY = 0.5           # approxPolyDP epsilon in source px; sub-pixel at 1254px
MIN_AREA = 6             # drop specks smaller than this
STRIP_STRAPLINE = {"praasa", "elevare"}
STRAPLINE_MAX_FRACTION = 0.10
MIN_GAP_PX = 3


def load_mask(path):
    bgr = cv2.imread(path, cv2.IMREAD_COLOR)
    luma = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    return (luma > LUMA_THRESHOLD).astype(np.uint8)


def crop_to_ink(mask):
    ys, xs = np.nonzero(mask)
    return mask[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def strip_strapline(mask):
    """Drop a small trailing text band (see build-client-logos.py for why)."""
    rows = mask.sum(axis=1)
    h = len(rows)
    gaps, start = [], None
    for i, empty in enumerate(rows == 0):
        if empty and start is None:
            start = i
        elif not empty and start is not None:
            if i - start >= MIN_GAP_PX:
                gaps.append((start, i))
            start = None
    if not gaps:
        return mask, None
    ink = np.nonzero(rows)[0]
    band = ink[-1] - gaps[-1][1] + 1
    if band / h > STRAPLINE_MAX_FRACTION:
        return mask, None
    return crop_to_ink(mask[:gaps[-1][0]]), band


def to_svg(mask, slug):
    h, w = mask.shape
    contours, _ = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)

    paths, points = [], 0
    for c in contours:
        if cv2.contourArea(c) < MIN_AREA:
            continue
        pts = cv2.approxPolyDP(c, SIMPLIFY, True).reshape(-1, 2)
        if len(pts) < 3:
            continue
        points += len(pts)
        d = "M" + " ".join(f"{x},{y}" for x, y in pts) + "Z"
        paths.append(d)

    # evenodd punches the inner contours out as holes (e.g. the ring of a seal)
    body = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'width="{w}" height="{h}" fill="{FILL}" fill-rule="evenodd" '
        f'shape-rendering="geometricPrecision">'
        f'<path d="{"".join(paths)}"/></svg>'
    )
    return body, len(paths), points, (w, h)


def main():
    os.makedirs(OUT, exist_ok=True)
    names = sorted(f for f in os.listdir(SRC)
                   if os.path.isfile(os.path.join(SRC, f)) and f.lower().endswith(".png"))
    if not names:
        print("no source PNGs found")
        return 1

    print(f"\n{SRC}/  ->  {OUT}/\n")
    total = 0
    for name in names:
        slug = os.path.splitext(name)[0]
        mask = crop_to_ink(load_mask(os.path.join(SRC, name)))
        note = ""
        if slug.lower() in STRIP_STRAPLINE:
            mask, band = strip_strapline(mask)
            if band:
                note = f"  (strapline removed, {band}px)"
        svg, n_paths, n_points, (w, h) = to_svg(mask, slug)
        path = os.path.join(OUT, slug + ".svg")
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(svg)
        size = os.path.getsize(path)
        total += size
        print(f"  {slug:10} {w:5}x{h:<5} {n_paths:4} shapes, {n_points:6} points  {size/1024:7.1f} KB{note}")
    print(f"\n  total {total/1024:.0f} KB\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
