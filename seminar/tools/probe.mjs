// Open one slide/step in headless Brave, evaluate an expression, optionally save a screenshot.
// Usage: node probe.mjs <slide> <step> "<js expression>" [out.jpg]
// Use @/path/to/check.js to evaluate a script from a file.
import { spawn } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHROME = process.env.CHROME || "/run/current-system/sw/bin/brave";
const [slide, step, expr, shot] = process.argv.slice(2);
const PORT = 9900 + Math.floor(Math.random() * 400);
const prof = `/tmp/games1-probe-profile-${PORT}`;
const chrome = spawn(CHROME, ["--headless=new", "--no-sandbox", `--remote-debugging-port=${PORT}`, "--window-size=1920,1080", "--hide-scrollbars",
  "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--autoplay-policy=no-user-gesture-required", `--user-data-dir=${prof}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 60 && !target; i++) { await sleep(250); try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === "page"); } catch (e) { /* not up */ } }
if (!target) { chrome.kill(); throw new Error(`Cannot start ${CHROME} for the browser probe`); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => { ws.onopen = r; });
let id = 0; const pending = new Map();
ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } if (m.method === "Runtime.exceptionThrown") console.log("EXC", m.params.exceptionDetails.exception?.description); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (r.result.exceptionDetails) { ws.close(); chrome.kill(); throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); }
  return r.result.result.value;
};
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: "file://" + (process.env.PAGE || resolve(HERE, "../deck/dist/index.html")) });
await sleep(1200);
await ev(`deck.goto(${+slide - 1}, ${+step || 0})`);
await sleep(+(process.env.WAIT || 1500));
if (expr) console.log(JSON.stringify(await ev(expr.startsWith("@") ? readFileSync(expr.slice(1), "utf8") : expr), null, 1));
if (shot) { const img = await send("Page.captureScreenshot", { format: "jpeg", quality: 80 }); writeFileSync(shot, Buffer.from(img.result.data, "base64")); }
ws.close(); chrome.kill(); process.exit(0);
