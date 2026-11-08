#!/usr/bin/env python3
"""Contact sheets from audit screenshots: the last step of every slide, 3x3 per sheet.

    python contact.py <shots_dir> <out_dir> [--all]
"""
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw

src, out = Path(sys.argv[1]), Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
shots = {}
for p in sorted(src.glob("s*_*.jpg")):
    m = re.match(r"s(\d+)_(\d+)\.jpg", p.name)
    if m:
        shots.setdefault(int(m[1]), []).append((int(m[2]), p))
pick = []
for s in sorted(shots):
    steps = sorted(shots[s])
    pick += steps if "--all" in sys.argv else [steps[-1]]
W, H, n = 640, 360, 9
for k in range(0, len(pick), n):
    sheet = Image.new("RGB", (W * 3 + 8, H * 3 + 8), "#888")
    for i, (st, p) in enumerate(pick[k:k + n]):
        im = Image.open(p).resize((W, H))
        d = ImageDraw.Draw(im)
        d.rectangle([0, 0, 120, 26], fill="#000")
        d.text((6, 6), p.stem, fill="#fff")
        sheet.paste(im, ((i % 3) * (W + 4), (i // 3) * (H + 4)))
    sheet.save(out / f"sheet_{k // n + 1:02d}.jpg", quality=80)
print(len(pick), "shots")
