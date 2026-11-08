// Chụp ảnh màn chiếu từ deck (headless Brave): mọi bước của slide 1–26, chuỗi kéo thanh trượt (slide 23),
// chuỗi simulation (slide 24), và tách khung hình video manim của slide 22. Ảnh ghi vào build/proj/ (1240×698).
import { spawn, spawnSync } from "child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const RAW = join(ROOT, "build/raw"), PROJ = join(ROOT, "build/proj");
const DECK = resolve(ROOT, "../deck/dist/index.html");
const CHROME = process.env.CHROME || "/run/current-system/sw/bin/brave";
const W = 1240, H = 698;
mkdirSync(RAW, { recursive: true }); mkdirSync(PROJ, { recursive: true });
const MAXSTEP = { 1: 0, 2: 2, 3: 5, 4: 2, 5: 2, 6: 3, 7: 3, 8: 2, 9: 2, 10: 2, 11: 3, 12: 2, 13: 1, 14: 1, 15: 2, 16: 2, 17: 2, 18: 3, 19: 2, 20: 2, 21: 2, 22: 0, 23: 1, 24: 2, 25: 3, 26: 0 };

const PORT = 9400 + Math.floor(Math.random() * 300);
const chrome = spawn(CHROME, ["--headless=new", "--no-sandbox", `--remote-debugging-port=${PORT}`, "--window-size=1920,1080", "--hide-scrollbars", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
  "--autoplay-policy=no-user-gesture-required", `--user-data-dir=${join(ROOT, "build/.profiles/capture-" + PORT)}`, "about:blank"], { stdio: "ignore", detached: true });
const killChrome = () => { try { process.kill(-chrome.pid, "SIGKILL"); } catch (e) { /* gone */ } };
process.on("exit", killChrome);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 60 && !target; i++) { await sleep(250); try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === "page"); } catch (e) { /* starting */ } }
if (!target) { killChrome(); throw new Error("cannot start " + CHROME); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => { const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }); if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails)); return r.result.result.value; };
const shot = async (name) => { const img = await send("Page.captureScreenshot", { format: "png" }); writeFileSync(join(RAW, name + ".png"), Buffer.from(img.result.data, "base64")); };

await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: "file://" + DECK });
await sleep(1800);

const ONLY_MC = !!process.env.ONLY_MC;
// 1. every step of slides 1–26
for (let n = 1; n <= (ONLY_MC ? 0 : 26); n++) {
  for (let st = 0; st <= MAXSTEP[n]; st++) {
    await ev(`deck.goto(${n - 1},${st})`);
    await sleep(n === 1 || n === 16 ? 2600 : 1700);
    await shot(`s${String(n).padStart(2, "0")}_${st}`);
  }
}

// 2. slider on slide 23 (policy "Đều ⅓"): q = 0, 0.05, …, 1
await ev(`deck.goto(22,1)`); await sleep(1500);
for (let v = 0; v <= (ONLY_MC ? -1 : 20); v++) {
  await ev(`(() => { const r = deck.slides[22].querySelector('input[type=range]'); r.value = ${v}; r.dispatchEvent(new Event('input')); })()`);
  await sleep(750);
  await shot(`sl_${String(v).padStart(2, "0")}`);
}

// 3. simulation on slide 24 with a fixed seed and manual timer ticks
const SEED = +(process.env.MC_SEED || 13);
await ev(`deck.goto(23,0)`); await sleep(1200);
await ev(`(() => {
  let a = ${SEED} >>> 0;
  Math.random = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  window.__ticks = []; const real = window.setInterval;
  window.setInterval = (fn, ms) => (ms === 160 || ms === 30) ? (window.__ticks.push(fn), 900000 + window.__ticks.length) : real(fn, ms);
})()`);
await ev(`deck.next()`); await sleep(1300);
await shot("mc10_00");
for (let i = 1; i <= 10; i++) { await ev(`window.__ticks[0]()`); await sleep(160); await shot(`mc10_${String(i).padStart(2, "0")}`); }
const r10 = await ev(`deck.slides[23].querySelector('.readout').textContent`);
await ev(`deck.next()`); await sleep(300);
for (let i = 1; i <= 40; i++) { await ev(`window.__ticks[1]()`); await sleep(110); await shot(`mc1k_${String(i).padStart(2, "0")}`); }
const r1k = await ev(`deck.slides[23].querySelector('.readout').textContent`);
console.log("simulation seed", SEED, "|", r10, "|", r1k);
ws.close(); killChrome();

// 4. scale to the projector size
for (const f of readdirSync(RAW).filter((f) => f.endsWith(".png") && (!ONLY_MC || f.startsWith("mc")))) {
  spawnSync("ffmpeg", ["-loglevel", "error", "-y", "-i", join(RAW, f), "-vf", `scale=${W}:${H}:flags=lanczos`, "-q:v", "2", join(PROJ, f.replace(".png", ".jpg"))]);
}
// 5. manim video frames (slide 22) at 25 fps
mkdirSync(join(PROJ, "m01"), { recursive: true });
if (!existsSync(join(PROJ, "m01/f0001.jpg")))
  spawnSync("ffmpeg", ["-loglevel", "error", "-y", "-i", resolve(ROOT, "../deck/dist/media/M01_GameEval.mp4"), "-vf", `fps=25,scale=${W}:${H}:flags=lanczos`, "-q:v", "3", join(PROJ, "m01/f%04d.jpg")]);
console.log("proj images:", readdirSync(PROJ).length, "m01 frames:", readdirSync(join(PROJ, "m01")).length);
process.exit(0);
