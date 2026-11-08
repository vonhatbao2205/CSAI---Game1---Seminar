#!/usr/bin/env bash
# Dựng lại kịch bản và video phần 1 từ script.mjs.
#   ./build.sh            kịch bản .md + video đầy đủ (~10 phút)
#   ./build.sh --script   chỉ kịch bản .md (và giọng đọc)
set -euo pipefail
cd "$(dirname "$0")"
[ -d node_modules ] || npm install --no-audit --no-fund
node tools/compile.mjs
[ "${1:-}" = "--script" ] && exit 0
[ -f build/proj/s26_0.jpg ] || node tools/capture.mjs
node tools/boards.mjs
node tools/render.mjs
