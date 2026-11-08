// Chụp bảng trắng ở cuối các slide có viết bảng → bang/slideNN.jpg (dùng trong kịch bản .md).
import { spawnSync } from "child_process";
import { mkdirSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const src = readFileSync(join(ROOT, "build/timeline.js"), "utf8");
const TL = JSON.parse(src.slice(src.indexOf("{"), src.lastIndexOf("}") + 1));
export const BOARD_SLIDES = [6, 7, 18, 21, 23, 24];
const at = BOARD_SLIDES.map((n) => {
  const next = TL.slides.find((s) => s.n === n + 1);
  return +(next.t0 + 1.5).toFixed(2);
});
const r = spawnSync("node", [join(ROOT, "tools/render.mjs"), "--stills", at.join(",")], { stdio: "inherit" });
if (r.status !== 0) throw new Error("render stills failed");
mkdirSync(join(ROOT, "bang"), { recursive: true });
BOARD_SLIDES.forEach((n, i) => {
  spawnSync("ffmpeg", ["-loglevel", "error", "-y", "-i", join(ROOT, `build/stills/t${at[i]}.jpg`), "-vf", "crop=620:524:1288:288", "-q:v", "2", join(ROOT, `bang/slide${String(n).padStart(2, "0")}.jpg`)]);
});
console.log("bảng:", BOARD_SLIDES.map((n) => `bang/slide${String(n).padStart(2, "0")}.jpg`).join(", "));
