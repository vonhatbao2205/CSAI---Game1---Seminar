// Builds dist/index.html (adapted from the RMQ v2 template): pre-renders KaTeX, inlines CSS, JS, fonts,
// the π narrator shape and the pixel sprites, so the deck runs offline by double-click.
// Libraries: KaTeX (formulas), GSAP (motion), D3 (charts), Three.js (3D game tree). Videos: 3b1b/manim.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "fs";
import { createRequire } from "module";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const NM = join(HERE, "node_modules");
const require = createRequire(join(NM, "x.js"));
const katex = require("katex");
const SRC = join(HERE, "src"), DIST = join(HERE, "dist");
mkdirSync(join(DIST, "media", "posters"), { recursive: true });
const read = (p) => readFileSync(p, "utf8");
const b64 = (p) => readFileSync(p).toString("base64");

// ---- fonts: only the weights and subsets the deck uses
function fontCss(pkg, family, weights, subsets = ["latin", "latin-ext", "vietnamese"]) {
  let out = "";
  for (const w of weights) {
    const css = read(join(NM, "@fontsource", pkg, `${w}.css`));
    for (const sub of subsets) {
      const m = new RegExp(`/\\* ${pkg}-${sub}-${w}-normal \\*/[\\s\\S]*?unicode-range: ([^;]+);`).exec(css);
      const file = join(NM, "@fontsource", pkg, "files", `${pkg}-${sub}-${w}-normal.woff2`);
      if (!m || !existsSync(file)) continue;
      out += `@font-face{font-family:'${family}';font-style:normal;font-display:block;font-weight:${w};src:url(data:font/woff2;base64,${b64(file)}) format('woff2');unicode-range:${m[1]};}\n`;
    }
  }
  return out;
}
const fonts = fontCss("source-serif-4", "Source Serif 4", [400, 600])
  + fontCss("be-vietnam-pro", "Be Vietnam Pro", [400, 500, 600])
  + fontCss("jetbrains-mono", "JetBrains Mono", [400, 500, 600])
  + fontCss("press-start-2p", "Press Start 2P", [400], ["latin", "latin-ext", "greek"])
  + fontCss("vt323", "VT323", [400]);

// ---- KaTeX css with fonts inlined
let katexCss = read(join(NM, "katex/dist/katex.min.css"));
katexCss = katexCss.replace(/@font-face\{[^}]*\}/g, (block) => {
  const m = /url\(fonts\/([^)]+\.woff2)\)/.exec(block);
  if (!m) return "";
  const data = b64(join(NM, "katex/dist/fonts", m[1]));
  return block.replace(/src:[^;}]+/, `src:url(data:font/woff2;base64,${data}) format("woff2")`);
});

// ---- math: $...$ inline, $$...$$ display; <pre> blocks are left alone
let mathCount = 0;
function renderMath(html) {
  const tex = (src, display) => {
    mathCount++;
    return katex.renderToString(src.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"),
      { displayMode: display, throwOnError: true, strict: false, output: "html" });
  };
  const parts = html.split(/(<pre[\s\S]*?<\/pre>|<script[\s\S]*?<\/script>)/);
  return parts.map((p, i) => (i % 2 ? p : p
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, s) => tex(s, true))
    .replace(/\$([^$\n]+?)\$/g, (_, s) => tex(s, false)))).join("");
}

const dir = join(SRC, "slides");
const slides = readdirSync(dir).filter((f) => f.endsWith(".html")).sort().map((f) => renderMath(read(join(dir, f)))).join("\n");
const shape = read(join(HERE, "../manim/pi_shape.json"));
const sprites = read(join(HERE, "../manim/sprites.json"));
const vendor = [
  "gsap/dist/gsap.min.js",
  "d3/dist/d3.min.js",
  "three/build/three.min.js",
].map((p) => read(join(NM, p))).join("\n;\n");
const own = ["pi.js", "widgets/core.js", "widgets/tree.js", "widgets/ttt.js", "widgets/charts.js", "widgets/arena.js", "widgets/tree3d.js", "engine.js"]
  .map((f) => read(join(SRC, f))).join("\n");
const css = read(join(SRC, "deck.css"));

const content = `<div id="viewport"><div id="stage">
${slides}
<div id="narr"><svg id="pi"></svg><div id="bubble"></div></div>
<div id="hud"></div><div id="num"></div><div id="flash"></div>
<div id="nav"><button id="nav-prev" title="Quay lại (←)" aria-label="Quay lại">‹</button><button id="nav-ov" title="Tổng quan (O)" aria-label="Tổng quan">☰</button><button id="nav-next" title="Đi tiếp (→)" aria-label="Đi tiếp">›</button></div>
<div id="overview" class="overlay">
  <div class="ovhead"><h2 style="font-size:44px">Tổng quan</h2><span id="ovtime" class="small"></span></div>
  <div class="keys" style="margin-bottom:20px"><kbd>→</kbd>đi tiếp<kbd>←</kbd>quay lại<kbd>A</kbd>tự chạy<kbd>T</kbd>bản rút gọn<kbd>N</kbd>ghi chú<kbd>F</kbd>toàn màn hình<kbd>V</kbd>dừng video<kbd>J L</kbd>tua 5 giây<kbd>R</kbd>phát lại<kbd>[ ]</kbd>tốc độ video</div>
  <div id="ovgrid"></div>
</div>
<div id="notes" class="overlay"><div id="notesbox"></div></div>
</div></div>
<script>window.PI_SHAPE=${shape.trim()};window.SPRITES=${sprites.trim()};</script>
<script>${vendor}</script>
<script>${own}</script>
`;
const style = `<title>Seminar Games 1</title>\n<style>${fonts}${katexCss}${css}</style>\n`;
const page = `<!doctype html>\n<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${style}</head>\n<body>\n${content}</body></html>\n`;
writeFileSync(join(DIST, "index.html"), page);
// artifact.html: the hosted copy. The Artifact skeleton adds doctype, head and body; libraries load from CDNs
// (exact versions, same as package.json) instead of being inlined.
const cdn = ["https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js",
  "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js"].map((u) => `<script src="${u}"></script>`).join("\n");
writeFileSync(join(DIST, "artifact.html"), style + content.replace(`<script>${vendor}</script>`, cdn));
console.log(`dist/index.html ${(page.length / 1048576).toFixed(2)} MB, ${mathCount} formulas, ${(slides.match(/<section /g) || []).length} slides`);
