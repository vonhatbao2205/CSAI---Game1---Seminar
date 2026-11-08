// Render scene/index.html thành video: chia khung hình cho nhiều Brave headless chạy song song,
// mỗi worker đẩy JPEG vào một ffmpeg, rồi nối các đoạn và ghép âm thanh.
// Usage:
//   node tools/render.mjs                     → out/trinh_bay_phan1.mp4
//   node tools/render.mjs --stills 12.5,300   → build/stills/t12.5.jpg … (kiểm tra nhanh)
//   node tools/render.mjs --from 290 --to 320 → chỉ render một đoạn (out/preview.mp4)
//   WORKERS=8 để đổi số worker
import { spawn } from "child_process";
import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from "fs";
import { createServer } from "http";
import { extname, join, normalize } from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CHROME = process.env.CHROME || "/run/current-system/sw/bin/brave";
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const STILLS = arg("--stills");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- tiny static server (fonts and images need http, not file://)
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png", ".woff2": "font/woff2", ".wav": "audio/wav", ".json": "application/json" };
const server = createServer((req, res) => {
  const p = normalize(join(ROOT, decodeURIComponent(req.url.split("?")[0])));
  if (!p.startsWith(ROOT) || !existsSync(p) || statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TYPES[extname(p)] || "application/octet-stream" });
  createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const PORT = server.address().port;
const URL = `http://127.0.0.1:${PORT}/scene/index.html`;

const kids = [];
const cleanup = () => { for (const k of kids) { try { process.kill(-k.pid, "SIGKILL"); } catch (e) { /* gone */ } } };
process.on("exit", cleanup);
process.on("SIGINT", () => { cleanup(); process.exit(130); });

async function openPage(tag) {
  const port = 9800 + Math.floor(Math.random() * 900);
  const prof = join(ROOT, "build/.profiles", `render-${tag}-${port}`);
  const ch = spawn(CHROME, ["--headless=new", "--no-sandbox", `--remote-debugging-port=${port}`, "--window-size=1920,1080", "--hide-scrollbars", "--disable-gpu",
    "--force-device-scale-factor=1", "--autoplay-policy=no-user-gesture-required", `--user-data-dir=${prof}`, "about:blank"], { stdio: "ignore", detached: true });
  kids.push(ch);
  let target;
  for (let i = 0; i < 80 && !target; i++) { await sleep(250); try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch (e) { /* starting */ } }
  if (!target) throw new Error("cannot start browser");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } if (m.method === "Runtime.exceptionThrown") console.error(`[${tag}]`, m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expression) => { const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }); if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result.result.value; };
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: URL });
  for (let i = 0; i < 100; i++) { await sleep(200); try { if (await ev("!!window.sceneReady")) break; } catch (e) { /* loading */ } }
  await ev("window.sceneReady");
  const grab = async (t, q = 90) => { await ev(`window.renderAt(${t})`); const r = await send("Page.captureScreenshot", { format: "jpeg", quality: q, optimizeForSpeed: true }); return Buffer.from(r.result.data, "base64"); };
  return { ev, grab, close: () => { ws.close(); try { process.kill(-ch.pid, "SIGKILL"); } catch (e) { /* gone */ } } };
}

const TLsrc = (await import("fs")).readFileSync(join(ROOT, "build/timeline.js"), "utf8");
const TL = JSON.parse(TLsrc.slice(TLsrc.indexOf("{"), TLsrc.lastIndexOf("}") + 1));
const FPS = TL.fps;

if (STILLS) {
  mkdirSync(join(ROOT, "build/stills"), { recursive: true });
  const pg = await openPage("still");
  for (const t of STILLS.split(",").map(Number)) {
    const buf = await pg.grab(t, 88);
    writeFileSync(join(ROOT, `build/stills/t${t}.jpg`), buf);
  }
  pg.close(); server.close();
  console.log("stills:", STILLS);
  process.exit(0);
}

const from = +(arg("--from") ?? 0), to = +(arg("--to") ?? TL.duration);
const F0 = Math.floor(from * FPS), F1 = Math.ceil(to * FPS);
const W = +(process.env.WORKERS || 8);
const per = Math.ceil((F1 - F0) / W);
const segDir = join(ROOT, "build/segments");
mkdirSync(segDir, { recursive: true });
const t0 = Date.now();
let done = 0;
const progress = setInterval(() => { const s = (Date.now() - t0) / 1000; process.stdout.write(`\r${done}/${F1 - F0} khung · ${(done / s).toFixed(1)} fps · ${s.toFixed(0)} s   `); }, 5000);

async function worker(k) {
  const a = F0 + k * per, b = Math.min(F1, a + per);
  if (a >= b) return null;
  const out = join(segDir, `seg${String(k).padStart(2, "0")}.mp4`);
  const pg = await openPage("w" + k);
  const ff = spawn("ffmpeg", ["-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-tune", "animation", out], { stdio: ["pipe", "inherit", "inherit"] });
  for (let f = a; f < b; f++) {
    const buf = await pg.grab(f / FPS);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    done++;
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  pg.close();
  return out;
}
const segs = (await Promise.all([...Array(W).keys()].map(worker))).filter(Boolean);
clearInterval(progress);
server.close();
const list = join(segDir, "list.txt");
writeFileSync(list, segs.map((s) => `file '${s}'`).join("\n"));
mkdirSync(join(ROOT, "out"), { recursive: true });
const full = from === 0 && to >= TL.duration;
const outFile = join(ROOT, "out", full ? "trinh_bay_phan1.mp4" : "preview.mp4");
await new Promise((r, j) => {
  const ff = spawn("ffmpeg", ["-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", list, "-ss", String(from), "-t", String(to - from), "-i", join(ROOT, "build/narration.wav"),
    "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", "-shortest", outFile], { stdio: "inherit" });
  ff.on("close", (c) => (c === 0 ? r() : j(new Error("ffmpeg mux failed"))));
});
console.log(`\nxong: ${outFile} · ${((Date.now() - t0) / 60000).toFixed(1)} phút`);
process.exit(0);
