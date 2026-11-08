#!/usr/bin/env bash
# Render every scene (light theme, matches the deck) and write mp4 + poster into the deck.
# Usage: ./render_all.sh [quality-flag] [out-dir]
#   ./render_all.sh -l /tmp/preview      (480p, fast)
#   ./render_all.sh --hd                 (1080p, final, into ../deck/dist/media)
#   SCENES="M01_GameEval M04_Minimax" ./render_all.sh --hd
set -uo pipefail
cd "$(dirname "$0")"
source ./env.sh
Q="${1:---hd}"
OUT="${2:-../deck/dist/media}"
RAW="$(mktemp -d)"
mkdir -p "$OUT/posters" logs
SCENES="${SCENES:-$(grep -oE '^class (M[0-9]+_[A-Za-z0-9]+)' scenes.py | awk '{print $2}')}"
for s in $SCENES; do
  ( manimgl scenes.py "$s" -w $Q --video_dir "$RAW" > "logs/$s.log" 2>&1 \
      && ffmpeg -v error -y -i "$RAW/$s.mp4" -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart -an "$OUT/$s.mp4" \
      && ffmpeg -v error -y -sseof -0.6 -i "$OUT/$s.mp4" -frames:v 1 -q:v 3 "$OUT/posters/$s.jpg" \
      && echo "ok   $s" || echo "FAIL $s (see manim/logs/$s.log)" ) &
  while [ "$(jobs -rp | wc -l)" -ge 4 ]; do sleep 1; done
done
wait
rm -rf "$RAW"
