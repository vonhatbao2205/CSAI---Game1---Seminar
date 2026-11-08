#!/usr/bin/env python3
"""Pixel characters for the Games 1 deck: the Agent (a small robot, blue team) and the Opponent
(beanie and scarf, pink team). Original designs drawn on a 28x32 grid.

Writes sprites.json (read by the web deck and by scenes.py) and sprites_preview.png.

    python3 sprites.py
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
W, H = 28, 32
OFF = 1  # one free pixel around the art for the outline

PALETTE = {
    "k": "#262A33",  # outline
    "w": "#FBFAF3",  # body
    "s": "#D5D0C3",  # shade
    "v": "#1D2B3A",  # visor
    "g": "#66D9E8",  # visor glow
    "y": "#FFD43B",  # bulb, lights
    "A": "#1C7ED6",  # agent team
    "a": "#74C0FC",
    "O": "#D6336C",  # opponent team
    "o": "#FAA2C1",
}
POSES = ["idle", "raiseR", "raiseL", "cheer"]
MOODS = ["normal", "happy", "sad", "think"]


def blank():
    return [["." for _ in range(W)] for _ in range(H)]


def put(g, x, y, c):
    x, y = x + OFF, y + OFF
    if 0 <= x < W and 0 <= y < H:
        g[y][x] = c


def rect(g, x0, y0, x1, y1, c, cut=()):
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if (x, y) not in cut:
                put(g, x, y, c)


def corners(x0, y0, x1, y1):
    return {(x0, y0), (x1, y0), (x0, y1), (x1, y1)}


def legs(g, team):
    rect(g, 8, 24, 11, 27, "w")
    rect(g, 14, 24, 17, 27, "w")
    rect(g, 11, 24, 11, 27, "s")
    rect(g, 17, 24, 17, 27, "s")
    rect(g, 7, 28, 11, 29, team, cut={(7, 29)})
    rect(g, 14, 28, 18, 29, team, cut={(18, 29)})


def arms(g, pose):
    """Arms are separated from the body by one pixel, which becomes outline."""
    if pose in ("idle", "raiseL"):
        rect(g, 20, 16, 21, 22, "w"); rect(g, 21, 16, 21, 22, "s"); rect(g, 20, 23, 21, 23, "s")
    if pose in ("idle", "raiseR"):
        rect(g, 4, 16, 5, 22, "w"); rect(g, 5, 16, 5, 22, "s"); rect(g, 4, 23, 5, 23, "s")
    if pose == "raiseR":   # arm out to the viewer's right, hand up: the sign stick starts at the hand
        rect(g, 20, 16, 24, 17, "w"); rect(g, 20, 17, 24, 17, "s"); rect(g, 24, 14, 25, 17, "s")
    if pose == "raiseL":
        rect(g, 1, 16, 5, 17, "w"); rect(g, 1, 17, 5, 17, "s"); rect(g, 0, 14, 1, 17, "s")
    if pose == "cheer":
        rect(g, 2, 9, 3, 16, "w"); rect(g, 2, 8, 3, 8, "s")
        rect(g, 22, 9, 23, 16, "w"); rect(g, 22, 8, 23, 8, "s")
        rect(g, 4, 16, 5, 17, "w"); rect(g, 20, 16, 21, 17, "w")


def agent_face(g, mood):
    if mood in ("normal",):
        rect(g, 9, 7, 10, 8, "g"); rect(g, 15, 7, 16, 8, "g"); rect(g, 11, 10, 14, 10, "g")
    elif mood == "happy":
        for x, y in [(8, 8), (9, 7), (10, 8), (15, 8), (16, 7), (17, 8), (10, 10), (15, 10)]:
            put(g, x, y, "g")
        rect(g, 11, 11, 14, 11, "g")
    elif mood == "sad":
        rect(g, 9, 8, 10, 8, "g"); rect(g, 15, 8, 16, 8, "g")
        put(g, 10, 11, "g"); rect(g, 11, 10, 14, 10, "g"); put(g, 15, 11, "g")
    elif mood == "think":
        rect(g, 10, 7, 11, 7, "g"); rect(g, 16, 7, 17, 7, "g"); rect(g, 12, 10, 14, 10, "g")


def opp_face(g, mood):
    if mood == "normal":
        rect(g, 9, 9, 9, 10, "k"); rect(g, 16, 9, 16, 10, "k"); rect(g, 12, 12, 13, 12, "k")
    elif mood == "happy":
        for x, y in [(8, 10), (9, 9), (10, 10), (15, 10), (16, 9), (17, 10), (11, 12), (12, 13), (13, 13), (14, 12)]:
            put(g, x, y, "k")
        put(g, 7, 12, "o"); put(g, 18, 12, "o")
    elif mood == "sad":
        rect(g, 9, 10, 10, 10, "k"); rect(g, 15, 10, 16, 10, "k")
        put(g, 11, 13, "k"); rect(g, 12, 12, 13, 12, "k"); put(g, 14, 13, "k")
    elif mood == "think":
        put(g, 10, 9, "k"); put(g, 17, 9, "k"); rect(g, 12, 12, 13, 12, "k"); put(g, 14, 12, "k")


def agent(pose, mood):
    g = blank()
    rect(g, 11, 0, 14, 1, "y", cut={(11, 0), (14, 0)})           # bulb
    rect(g, 12, 2, 13, 3, "s")                                    # antenna
    rect(g, 5, 4, 20, 13, "w", cut=corners(5, 4, 20, 13))         # head
    rect(g, 19, 5, 19, 12, "s")
    rect(g, 7, 6, 18, 11, "v", cut=corners(7, 6, 18, 11))         # visor
    agent_face(g, mood)
    rect(g, 4, 8, 4, 9, "A"); rect(g, 21, 8, 21, 9, "A")          # ear bolts
    rect(g, 11, 14, 14, 14, "s")                                  # neck
    rect(g, 7, 15, 18, 23, "w", cut={(7, 23), (18, 23)})          # body
    rect(g, 18, 16, 18, 22, "s")
    rect(g, 9, 17, 16, 20, "A", cut=corners(9, 17, 16, 20))       # chest panel
    put(g, 10, 18, "y"); put(g, 12, 18, "a"); rect(g, 10, 19, 15, 19, "a")
    rect(g, 7, 22, 18, 22, "s")                                   # belt
    legs(g, "A")
    arms(g, pose)
    return g


def opponent(pose, mood):
    g = blank()
    rect(g, 11, 0, 14, 1, "o", cut={(11, 0), (14, 0)})            # pom-pom
    rect(g, 9, 2, 16, 2, "O"); rect(g, 7, 3, 18, 3, "O"); rect(g, 6, 4, 19, 5, "O")
    rect(g, 8, 3, 8, 5, "o"); rect(g, 12, 2, 12, 5, "o"); rect(g, 16, 3, 16, 5, "o")   # knit ribs
    rect(g, 5, 6, 20, 6, "o")                                     # hat band
    rect(g, 5, 7, 20, 12, "w"); rect(g, 6, 13, 19, 13, "w"); rect(g, 8, 14, 17, 14, "w")   # face
    rect(g, 19, 8, 19, 12, "s")
    opp_face(g, mood)
    rect(g, 7, 16, 18, 23, "w", cut={(7, 23), (18, 23)})          # body
    rect(g, 18, 16, 18, 22, "s")
    rect(g, 7, 15, 18, 15, "O"); rect(g, 15, 16, 16, 19, "O"); put(g, 15, 19, "o")      # scarf
    rect(g, 7, 22, 18, 22, "s")
    legs(g, "O")
    arms(g, pose)
    return g


def outline(g):
    out = [row[:] for row in g]
    for y in range(H):
        for x in range(W):
            if g[y][x] != ".":
                continue
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    xx, yy = x + dx, y + dy
                    if 0 <= xx < W and 0 <= yy < H and g[yy][xx] != "." and g[yy][xx] != "k":
                        out[y][x] = "k"
    return out


def main():
    frames = {}
    for who, fn in (("agent", agent), ("opp", opponent)):
        for p in POSES:
            for m in MOODS:
                frames[f"{who}_{p}_{m}"] = ["".join(r) for r in outline(fn(p, m))]
    # sign stick anchors (pixel coords incl. the outline offset): top of the raised hand
    anchors = {"raiseR": [25 + OFF + 0.5, 14 + OFF], "raiseL": [0 + OFF + 0.5, 14 + OFF]}
    data = {"w": W, "h": H, "palette": PALETTE, "frames": frames, "anchors": anchors}
    (HERE / "sprites.json").write_text(json.dumps(data, separators=(",", ":")))
    try:
        from PIL import Image
    except ImportError:
        return
    sc, keys = 6, [f"{w}_{p}_{m}" for w in ("agent", "opp") for p in POSES for m in ("normal", "happy")]
    img = Image.new("RGB", (len(keys) // 2 * (W + 2) * sc, 2 * (H + 2) * sc), "#FAFAF7")
    for i, k in enumerate(keys):
        ox, oy = (i % (len(keys) // 2)) * (W + 2) * sc, (i // (len(keys) // 2)) * (H + 2) * sc
        for y, row in enumerate(frames[k]):
            for x, c in enumerate(row):
                if c != ".":
                    col = PALETTE[c]
                    for yy in range(sc):
                        for xx in range(sc):
                            img.putpixel((ox + x * sc + xx, oy + y * sc + yy), tuple(int(col[j:j + 2], 16) for j in (1, 3, 5)))
    img.save(HERE / "sprites_preview.png")


if __name__ == "__main__":
    main()
