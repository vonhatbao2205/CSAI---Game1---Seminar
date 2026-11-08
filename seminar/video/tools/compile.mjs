// Từ script.mjs: tạo giọng đọc (edge-tts), xếp lịch mọi câu nói và hành động, rồi ghi
//   ../kich_ban_phan1_Bao.md   kịch bản để học thuộc (có mốc thời gian, chỗ bấm →, chỗ chỉ, chỗ viết bảng)
//   build/timeline.js          dữ liệu cho cảnh video (scene/index.html)
//   build/narration.wav        lời đọc đã ghép
// Usage: node tools/compile.mjs [--no-tts]
import { spawnSync } from "child_process";
import { createHash } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { BOARD, LAST_SLIDE, META, SEQS, SLIDES } from "../script.mjs";
import { itemDur, itemGeom } from "../lib/board.mjs";
import { parseSay } from "../lib/parse.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const BUILD = join(ROOT, "build");
const MD_OUT = join(ROOT, "..", "kich_ban_phan1_Bao.md");
mkdirSync(join(BUILD, "tts"), { recursive: true });

// số bước (step tối đa) của từng slide trong deck — để kiểm tra số lần bấm →
const MAXSTEP = { 1: 0, 2: 2, 3: 5, 4: 2, 5: 2, 6: 3, 7: 3, 8: 2, 9: 2, 10: 2, 11: 3, 12: 2, 13: 1, 14: 1, 15: 2, 16: 2, 17: 2, 18: 3, 19: 2, 20: 2, 21: 2, 22: 0, 23: 1, 24: 2, 25: 3, 26: 0 };
const HOME_X = 1258, SR = 24000, FPS = META.fps;
const VIDEO_DUR = 35.23;
const LOOK = { class: "nhìn lớp", screen: "nhìn màn chiếu", board: "nhìn bảng" };
const GEST = { open: "mở hai tay về phía lớp", raise: "giơ tay lên", think: "tay chạm cằm", shrug: "nhún vai" };
const SEQTXT = { up: "kéo thanh trượt q lên gần 1", down: "kéo q về 0", mid: "thả q về 0,5", mc10: "", mc1000: "" };
const PBTXT = { rows: "ba dòng giả định trên bảng", oppnodes: "ba hình tròn trên bảng", tree: "cây ba hộp trên bảng" };

// ------------------------------------------------------------------ 1. parse + TTS
const slides = SLIDES.map((s) => ({ ...s, items: parseSay(s.say) }));
const sid = (text) => createHash("sha1").update(`${META.voice}|${META.rate}|${text}`).digest("hex").slice(0, 16);
const jobs = new Map();
for (const s of slides) for (const it of s.items) if (it.type === "sentence" && it.tts) { it.id = sid(it.tts); jobs.set(it.id, { id: it.id, text: it.tts, voice: META.voice, rate: META.rate }); }
writeFileSync(join(BUILD, "tts_jobs.json"), JSON.stringify([...jobs.values()], null, 1));
if (!process.argv.includes("--no-tts")) {
  const r = spawnSync("uv", ["run", "--quiet", "--with", "edge-tts", "python", join(ROOT, "tools/tts.py")], { stdio: "inherit", cwd: ROOT });
  if (r.status !== 0) throw new Error("TTS failed");
}

// word timings for a sentence
function timing(it) {
  const j = JSON.parse(readFileSync(join(BUILD, "tts", it.id + ".json"), "utf8"));
  const words = [];
  let cur = 0;
  for (const w of j.words) {
    const idx = it.tts.indexOf(w.t, cur);
    if (idx < 0) continue;
    words.push({ pos: idx, o: w.o, e: w.o + w.d });
    cur = idx + w.t.length;
  }
  const clip0 = Math.max(0, j.words[0].o - 0.06);
  const last = j.words[j.words.length - 1];
  const clip1 = last.o + last.d + 0.16;
  const rel = (off) => { for (const w of words) if (w.pos >= off) return w.o - clip0; return last.o + last.d - clip0; };
  return { words, clip0, clip1, speech: last.o + last.d - clip0, rel };
}

// ------------------------------------------------------------------ 2. schedule
const ev = { pauses: [], press: [], proj: [{ t: 0, key: "s01_0" }], laser: [], look: [], gest: [], hands: [], pb: [], draws: [], erases: [], subs: [], audio: [], seqs: [], video: null, slides: [] };
const md = []; // per slide: { n, title, t0, t1, blocks:[{t, html}] }
let T = 1.2, boardBusy = -99, lastBoardEnd = -99, videoStart = -1, videoEnd = -1, seqEnd = -1;
let curSlide = 1, curStep = 0;
const boardItems = []; // all drawn items with absolute times
const stand = (penX) => Math.max(1236, Math.min(1790, penX - 120));
const penScene = (p) => [BOARD.rect.x + p[0], BOARD.rect.y + p[1]];
const sessions = []; // board visits: {t0 (arrive), t1 (done), walkFrom}

const keyFor = (n, st) => {
  if (n === 24 && st === 1) return "mc10_00";
  if (n === 24 && st === 2) return "mc10_10";
  return `s${String(n).padStart(2, "0")}_${st}`;
};
function press(t) {
  if (curStep < MAXSTEP[curSlide]) curStep++;
  else { curSlide++; curStep = 0; }
  ev.press.push({ t, n: curSlide, step: curStep });
  ev.proj.push({ t: t + 0.12, key: keyFor(curSlide, curStep) });
}
function boardStart(t, firstPen) {
  // returns time the pen can touch the board (walking there first if needed)
  if (t > lastBoardEnd + 6.0) {
    const x = stand(penScene(firstPen)[0]);
    const walk = Math.min(2.2, Math.max(0.7, Math.abs(x - HOME_X) / 300 + 0.35));
    const t0 = Math.max(t, boardBusy + 0.6);
    sessions.push({ walk0: t0, t0: t0 + walk, t1: t0 + walk });
    return t0 + walk;
  }
  return Math.max(t, boardBusy + 0.1);
}
function scheduleDraw(name, t) {
  const g = BOARD.groups[name];
  if (!g) throw new Error("no board group " + name);
  const items = g.items.map((it) => ({ ...it, g: itemGeom(it), dur: itemDur(it) }));
  let c = boardStart(t, items[0].g.a), prev = null;
  const g0 = c;
  for (const it of items) {
    if (prev) c += 0.1 + Math.hypot(it.g.a[0] - prev.g.b[0], it.g.a[1] - prev.g.b[1]) / 1400;
    it.t0 = c; it.t1 = c + it.dur; c = it.t1; prev = it;
    boardItems.push(it);
  }
  ev.draws.push({ name, label: g.label, t0: g0, t1: c });
  boardBusy = lastBoardEnd = c;
  sessions[sessions.length - 1].t1 = c;
  return { t0: g0, t1: c };
}
function scheduleErase(zones, t) {
  const rects = zones.map((z) => BOARD.zones[z]);
  const t0 = boardStart(t, [rects[0][0] + 40, rects[0][1] + 20]);
  const dur = 1.25 * zones.length;
  for (const it of boardItems) {
    if (it.erase0 !== undefined || it.t1 > t0) continue;
    const [bx, by, bw, bh] = it.g.bbox, cx = bx + bw / 2, cy = by + bh / 2;
    const ri = rects.findIndex(([x, y, w, h]) => cx >= x && cx <= x + w && cy >= y && cy <= y + h);
    if (ri < 0) continue;
    const [x, , w] = rects[ri];
    const zt0 = t0 + ri * 1.25;
    it.erase0 = zt0 + 0.15 + ((cx - x) / w) * 0.9;
  }
  ev.erases.push({ zones: rects, t0, t1: t0 + dur, label: "xóa " + zones.map((z) => ({ rows: "vùng giữa", foot: "vùng dưới", tree: "vùng cây" })[z]).join(", ") });
  boardBusy = lastBoardEnd = t0 + dur;
  sessions[sessions.length - 1].t1 = t0 + dur;
}

const FREE = new Set(["press", "point", "pointBoard", "gesture", "video", "seq"]);
for (const s of slides) {
  const slideStart = curSlide === s.n ? 0 : T;
  const mdS = { n: s.n, title: s.title, part: s.part, opt: s.opt, blocks: [], draws: [] };
  let first = true, block = null;
  const newBlock = (t, lead) => { block = { t, parts: lead ? [lead] : [] }; mdS.blocks.push(block); };
  for (const it of s.items) {
    if (it.type === "pause") {
      ev.pauses.push({ t: T, dur: it.v });
      T += it.v;
      if (!block) newBlock(T, "");
      block.parts.push(`*(dừng ~${it.v} giây, chờ lớp trả lời)*`);
      continue;
    }
    const tm = it.tts ? timing(it) : { speech: 0, rel: () => 0, clip0: 0, clip1: 0 };
    let start = T + (it.para ? 0.35 : 0);
    const marks = it.marks;
    if (marks.some((m) => FREE.has(m.k) || (m.k === "look" && m.v !== "board"))) start = Math.max(start, boardBusy + 0.35);
    for (const m of marks) if (m.k === "at") start = Math.max(start, videoStart + m.v);
    const firstBoard = marks.find((m) => m.k === "draw" || m.k === "erase");
    if (firstBoard) start = Math.max(start, boardBusy - tm.rel(firstBoard.off));
    const leadPress = marks.some((m) => m.k === "press" && m.off === 0);
    const speech0 = start + (leadPress ? (first ? 0.85 : 0.5) : 0);
    if (leadPress || it.para || !block) newBlock(start, "");
    // marks
    for (const m of marks) {
      const t = m.off === 0 && m.k === "press" ? start : speech0 + tm.rel(m.off);
      m.t = t;
      if (m.k === "press") { press(t); m.to = curSlide; }
      else if (m.k === "point") {
        const tg = s.targets[m.v];
        if (!tg) throw new Error(`slide ${s.n}: no target ${m.v}`);
        ev.laser.push({ t, box: tg.box, label: tg.label });
      } else if (m.k === "pointBoard") ev.pb.push({ t, dur: 2.4, box: BOARD.points[m.v], label: PBTXT[m.v] });
      else if (m.k === "look") ev.look.push({ t, v: m.v });
      else if (m.k === "gesture") ev.gest.push({ t, v: m.v, dur: m.v === "raise" ? 2.0 : 1.7 });
      else if (m.k === "hands") ev.hands.push({ t: t + 0.5, n: m.v, dur: 2.6 });
      else if (m.k === "video") { videoStart = t; videoEnd = t + VIDEO_DUR; ev.video = { t, dur: VIDEO_DUR, n: s.n }; }
      else if (m.k === "seq") {
        const q = SEQS[m.v];
        const lead = q.lead ?? 0.05;
        q.frames.forEach((f, i) => ev.proj.push({ t: t + lead + i * q.dt, key: f }));
        seqEnd = t + lead + q.frames.length * q.dt;
        ev.seqs.push({ t, name: m.v, t1: seqEnd });
      } else if (m.k === "draw") { const r = scheduleDraw(m.v, t); mdS.draws.push(m.v); m.t1 = r.t1; }
      else if (m.k === "erase") scheduleErase(m.v, t);
    }
    let end = speech0 + tm.speech;
    if (it.tts) {
      ev.audio.push({ id: it.id, t: speech0, c0: tm.clip0, c1: tm.clip1 });
      splitSub(it, tm, speech0).forEach((x) => ev.subs.push(x));
    }
    block.parts.push(renderMd(it, s));
    T = end + (/[?]$/.test(it.disp) ? 0.75 : 0.42);
    first = false;
  }
  T = Math.max(T, boardBusy + 0.5, videoEnd + 0.5, seqEnd + 0.4) + 0.7;
  const t0 = s.n === 1 ? 0 : ev.press.find((p) => p.n === s.n)?.t ?? slideStart;
  ev.slides.push({ n: s.n, title: s.title, part: s.part, t0, max: MAXSTEP[s.n] });
  mdS.t0 = t0;
  md.push(mdS);
}
const DURATION = T + 2.5;
ev.slides.push({ n: LAST_SLIDE, title: "Expectimax (bạn Hoàng)", part: "Expectimax", t0: ev.press[ev.press.length - 1].t, max: 0 });
for (let i = 0; i < md.length; i++) md[i].t1 = i + 1 < md.length ? md[i + 1].t0 : ev.press[ev.press.length - 1].t;

// press-count check
const pressPerSlide = {};
for (const p of ev.press) pressPerSlide[p.n] = (pressPerSlide[p.n] || 0) + 1;
for (const s of SLIDES) {
  const want = MAXSTEP[s.n] + (s.n === 1 ? 0 : 1);
  if ((pressPerSlide[s.n] || 0) !== want) console.warn(`! slide ${s.n}: ${pressPerSlide[s.n] || 0} lần bấm, deck có ${want}`);
}

// board sessions → walking; merge sessions closer than 3 s
const walks = [];
for (const se of sessions) walks.push({ kind: "to", t0: se.walk0, t1: se.t0 }, { kind: "back", t0: se.t1 + 0.3, t1: se.t1 + 0.3 + 1.1 });

function splitSub(it, tm, t0) {
  const text = it.disp;
  const end = t0 + tm.speech;
  if (text.length <= 96) return [{ t0, t1: end, text }];
  // split at the comma/semicolon nearest the middle
  const cands = [...text.matchAll(/[,;:] /g)].map((m) => m.index + 1);
  if (!cands.length) return [{ t0, t1: end, text }];
  const mid = text.length / 2;
  const cut = cands.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
  const a = text.slice(0, cut).trim(), b = text.slice(cut).trim();
  // map display cut → tts offset proportionally
  const frac = cut / text.length;
  const tcut = t0 + tm.rel(Math.round(it.tts.length * frac));
  return [{ t0, t1: tcut, text: a }, { t0: tcut, t1: end, text: b }];
}

// ------------------------------------------------------------------ 3. markdown
function renderMd(it, s) {
  const cues = [...it.marks].sort((a, b) => a.doff - b.doff);
  let out = "", last = 0;
  for (const m of cues) {
    out += it.disp.slice(last, m.doff);
    last = m.doff;
    let c = "";
    if (m.k === "press") c = m.to !== s.n ? `**[→ sang slide ${m.to}${m.to === LAST_SLIDE ? " · Expectimax" : ""}]**` : `**[→]**`;
    else if (m.k === "point") c = `**[chỉ: ${s.targets[m.v].label}]**`;
    else if (m.k === "pointBoard") c = `**[chỉ lên bảng: ${PBTXT[m.v]}]**`;
    else if (m.k === "look") c = `*(${LOOK[m.v]})*`;
    else if (m.k === "gesture") c = `*(${GEST[m.v]})*`;
    else if (m.k === "draw") c = `**[✍ ${BOARD.groups[m.v].label}]**`;
    else if (m.k === "erase") c = `**[🧽 xóa bảng: ${m.v.map((z) => ({ rows: "vùng giữa", foot: "vùng dưới", tree: "vùng cây" })[z]).join(", ")}]**`;
    else if (m.k === "video") c = `**[video tự chạy, nói theo]**`;
    else if (m.k === "seq" && SEQTXT[m.v]) c = `**[${SEQTXT[m.v]}]**`;
    else if (m.k === "at") c = `<sub>⏱ giây ${m.v} của video</sub>`;
    if (c) out += (out && !out.endsWith(" ") ? " " : "") + c + " ";
  }
  out += it.disp.slice(last);
  return out.replace(/ +/g, " ").trim();
}
const fmt = (t) => { const s = Math.max(0, Math.round(t)); return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
const dur = (d) => { const s = Math.round(d); return s >= 60 ? `${Math.floor(s / 60)} phút ${s % 60 ? (s % 60) + " giây" : ""}`.trim() : `${s} giây`; };

const SKETCH = {
  6: "```text\n              ▲            agent\n           A/ |B \\C\n           ○   ○    ○      đối thủ\n          / \\ / \\  / \\\n      [−50][50][1][3][−5][15]   kết cục\n```",
  7: "```text\n              ▲            agent\n           A/ |B \\C\n           ○   ○    ○      đối thủ\n          / \\ / \\  / \\\n      [−50][50][1][3][−5][15]   kết cục\n   lớn:    50    3    15     → A\n   đều:     0    2     5     → C\n   nhỏ:   −50    1    −5     → B\n```",
  18: "```text\n   (cây + ba dòng giữ nguyên)\n   U(s): điểm của kết cục (terminal)\n   V(s): trung bình từ s, theo π và μ\n```",
  21: "```text\n              ▲ = 0        agent\n          A// |B \\C\n          (0) (2)  (5)     đối thủ\n          / \\ / \\  / \\\n      [−50][50][1][3][−5][15]   kết cục\n   V(s) = U(s)    nếu IsEnd(s)\n   V(s) = Σₐ P(a|s) · V(Succ(s, a))\n   P = π (lượt agent),  μ (lượt đối thủ)\n   A: ½·(−50) + ½·50 = 0\n   root = 1·0 + 0·2 + 0·5 = 0\n```\n(nhánh A tô đậm màu xanh: π chọn A với xác suất 1)",
  23: "```text\n              ▲ = 0  (π đều: 7/3)\n   … phần còn lại giữ nguyên\n```",
  24: "```text\n   (xóa hai dòng tính ở dưới, ghi:)\n   V̂ₙ = (1/n) · Σ U(ván i)\n   n lớn  ⇒  V̂ₙ → 0 (= V)\n```",
};

function writeMd() {
  const total = ev.press[ev.press.length - 1].t + 3;
  const L = [];
  L.push(`# Kịch bản trình bày phần 1 · Games 1 (slide 1–25)`, "");
  L.push(`*Người trình bày: ${META.presenter} · nhóm 10 · phần sau (Expectimax, Minimax) do bạn ${META.partner} trình bày.*`, "");
  L.push(`Tổng thời lượng theo video tập dượt: **${dur(total)}** (mục tiêu 25 phút, tối đa 30 phút). File này sinh từ \`video/script.mjs\` bằng \`node video/tools/compile.mjs\`; mốc thời gian khớp với video \`video/out/trinh_bay_phan1.mp4\`.`, "");
  L.push(`Video tập dượt: [video/out/trinh_bay_phan1.mp4](video/out/trinh_bay_phan1.mp4). Xem video một lượt, rồi tập lại với deck thật: bấm → đúng các chỗ **[→]**, chỉ và viết bảng đúng như nhân vật. Góc phải trên của video luôn ghi slide, bước, đồng hồ và việc cần làm ngay lúc đó.`, "");
  L.push(`Khi nói thật trước lớp, tốc độ thường chậm hơn giọng đọc máy một chút, nên thời gian thật sẽ khoảng 25–27 phút. Nếu tập thấy vượt 28 phút, xem mục **Nếu trễ giờ** ở cuối.`, "");
  L.push(`## Cách đọc kịch bản`, "");
  L.push(`| Ký hiệu | Làm gì |`, `|---|---|`);
  L.push(`| **[→]** | bấm phím → (hoặc clicker) đúng lúc này |`);
  L.push(`| **[chỉ: …]** | chỉ tay hoặc laser vào vùng đó trên màn chiếu |`);
  L.push(`| **[✍ …]** | đi tới bảng, viết/vẽ đúng nội dung đó, vừa viết vừa nói tiếp |`);
  L.push(`| **[🧽 …]** | xóa vùng bảng đó trước khi viết |`);
  L.push(`| *(nhìn lớp)*, *(dừng …)* | quay lại nhìn cả lớp; dừng chờ lớp trả lời |`, "");
  L.push(`Khung bảng: chia làm ba vùng từ trên xuống. **Vùng cây** (game ba hộp, vẽ ở slide 6, giữ tới hết phần), **vùng giữa** (ba dòng giả định, sau đó là recurrence), **vùng dưới** (ghi chú ngắn, xóa khi cần).`, "");
  L.push(`## Lịch tổng`, "");
  L.push(`| Slide | Nội dung | Bắt đầu | Thời lượng | Bảng |`, `|---:|---|---:|---:|---|`);
  for (const m of md) L.push(`| ${m.n} | ${m.title}${m.opt ? " *(có thể lướt)*" : ""} | ${fmt(m.t0)} | ${dur(m.t1 - m.t0)} | ${m.draws.length ? "✍ " + m.draws.join(", ") : ""} |`);
  L.push("");
  let part = "";
  for (const m of md) {
    if (m.part !== part) { part = m.part; L.push(`## ${part}`, ""); }
    L.push(`### Slide ${m.n} · ${m.title}`, "");
    const presses = ev.press.filter((p) => p.n === m.n).length;
    L.push(`\`${fmt(m.t0)} → ${fmt(m.t1)}\` · ${dur(m.t1 - m.t0)} · ${MAXSTEP[m.n] + 1} bước${m.n > 1 ? ` (bấm → ${presses} lần, kể cả lần vào slide)` : ""}${m.opt ? " · *có thể lướt nếu trễ giờ*" : ""}`, "");
    m.blocks.forEach((b, bi) => {
      let txt = b.parts.filter(Boolean).join(" ");
      if (bi === 0 && m.n > 1 && !txt.startsWith("**[→")) txt = `*(slide ${m.n - 1} vẫn đang chiếu)* ` + txt;
      if (txt) L.push(`\`${fmt(b.t)}\` ${txt}`, "");
    });
    if (SKETCH[m.n]) L.push(`**Bảng sau slide ${m.n}:**`, "", `![Bảng sau slide ${m.n}](video/bang/slide${String(m.n).padStart(2, "0")}.jpg)`, "", "<details><summary>Bản chữ (khi không xem được ảnh)</summary>", "", SKETCH[m.n], "", "</details>", "");
  }
  L.push(`## Nếu trễ giờ`, "");
  L.push(`- Slide 11, 15 và 25 có thể lướt: mỗi slide nói một câu chính rồi bấm qua (tiết kiệm khoảng 1 phút 30).`);
  L.push(`- Ở slide 6, bỏ phần hỏi lớp giơ tay (tiết kiệm khoảng 20 giây), nhưng vẫn vẽ cây lên bảng vì phần sau dùng lại.`);
  L.push(`- Ở slide 21, nếu bảng chật, chỉ ghi giá trị 0, 2, 5 vào ba node và “= 0” ở root, bỏ hai dòng tính ở vùng dưới.`, "");
  writeFileSync(MD_OUT, L.join("\n"));
  return total;
}
const total = writeMd();

// ------------------------------------------------------------------ 4. audio + envelope
const N = Math.ceil(DURATION * SR);
const buf = new Float32Array(N);
for (const a of ev.audio) {
  const r = spawnSync("ffmpeg", ["-loglevel", "error", "-ss", a.c0.toFixed(3), "-t", (a.c1 - a.c0).toFixed(3), "-i", join(BUILD, "tts", a.id + ".mp3"), "-f", "f32le", "-ac", "1", "-ar", String(SR), "-"], { maxBuffer: 1 << 28 });
  const pcm = new Float32Array(r.stdout.buffer, r.stdout.byteOffset, r.stdout.length / 4);
  const o = Math.round(a.t * SR);
  // short fades to avoid clicks
  const fade = Math.min(240, pcm.length >> 2);
  for (let i = 0; i < pcm.length && o + i < N; i++) {
    let g = 1;
    if (i < fade) g = i / fade; else if (i > pcm.length - fade) g = (pcm.length - i) / fade;
    buf[o + i] += pcm[i] * g;
  }
}
const wav = Buffer.alloc(44 + N * 2);
wav.write("RIFF", 0); wav.writeUInt32LE(36 + N * 2, 4); wav.write("WAVEfmt ", 8); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(SR, 24); wav.writeUInt32LE(SR * 2, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write("data", 36); wav.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++) wav.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(buf[i] * 32767))), 44 + i * 2);
writeFileSync(join(BUILD, "narration.wav"), wav);
const F = Math.ceil(DURATION * FPS), hop = SR / FPS, env = new Array(F);
for (let f = 0; f < F; f++) {
  let s = 0; const a = Math.round(f * hop), b = Math.min(N, Math.round((f + 1) * hop));
  for (let i = a; i < b; i++) s += buf[i] * buf[i];
  env[f] = Math.sqrt(s / Math.max(1, b - a));
}
const sorted = [...env].filter((x) => x > 0.005).sort((a, b) => a - b);
const ref = sorted[Math.floor(sorted.length * 0.95)] || 1;
const envN = env.map((x) => Math.round(Math.min(1, x / ref) * 100) / 100);

// ------------------------------------------------------------------ 5. timeline for the scene
const items = boardItems.map((it) => ({ k: it.k, pts: it.pts, closed: it.closed, cx: it.cx, cy: it.cy, r: it.r, x: it.x, y: it.y, s: it.s, size: it.size, c: it.c, w: it.w, anchor: it.anchor, a: it.g.a, b: it.g.b, t0: it.t0, t1: it.t1, e0: it.erase0 }));
ev.proj.sort((a, b) => a.t - b.t);
const TL = { fps: FPS, duration: DURATION, home: HOME_X, board: BOARD.rect, items, walks, ...ev, env: envN, meta: { title: META.title, presenter: META.presenter } };
writeFileSync(join(BUILD, "timeline.js"), "window.TL = " + JSON.stringify(TL) + ";\n");
console.log(`timeline: ${fmt(DURATION)} (${DURATION.toFixed(1)} s), ${ev.audio.length} câu, ${ev.press.length} lần bấm, ${items.length} nét bảng`);
console.log(`kịch bản: ${MD_OUT} · tổng ${fmt(total)}`);
