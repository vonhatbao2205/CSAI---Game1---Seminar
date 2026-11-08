// Cảnh lớp học. renderAt(t) vẽ đúng khung hình tại thời điểm t (giây), không phụ thuộc khung trước,
// nên có thể render song song. Mở scene/index.html?play để xem thử với âm thanh.
(() => {
  const TL = window.TL;
  const NS = "http://www.w3.org/2000/svg";
  const $ = (id) => document.getElementById(id);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, u) => a + (b - a) * u;
  const lerp2 = (p, q, u) => [lerp(p[0], q[0], u), lerp(p[1], q[1], u)];
  const ss = (u) => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); };
  const noise = (t, s) => Math.sin(t * 1.7 + s) * 0.5 + Math.sin(t * 2.9 + s * 1.3) * 0.3 + Math.sin(t * 4.3 + s * 2.1) * 0.2;
  const SCREEN = { x: 24, y: 22, w: 1240, h: 698 }, K = 1240 / 1920, GROUND = 1048, BR = TL.board, HOME = TL.home;
  const COLORS = { ink: "#1e2a4a", blue: "#1f5fbf", red: "#c62828", green: "#1b7f3a", purple: "#6a3fb5", gray: "#6b7280" };
  const lastIdx = (arr, t, key = "t") => { let lo = 0, hi = arr.length - 1, r = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (arr[m][key] <= t) { r = m; lo = m + 1; } else hi = m - 1; } return r; };
  const fmt = (t) => { const s = Math.max(0, Math.floor(t)); return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
  const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (parent) parent.appendChild(e); return e; };
  const slideXY = (x, y) => [SCREEN.x + x * K, SCREEN.y + y * K];
  let rng = 12345;
  const rand = () => { rng = (rng * 1103515245 + 12345) & 0x7fffffff; return rng / 0x7fffffff; };

  // ------------------------------------------------------------ slides & presses
  const presses = TL.press;
  const slideAt = (t) => { const i = lastIdx(presses, t); return i < 0 ? { n: 1, step: 0 } : presses[i]; };
  const slideInfo = Object.fromEntries(TL.slides.map((s) => [s.n, s]));

  // ------------------------------------------------------------ board items
  const boardG = $("board");
  const items = TL.items.map((it, i) => ({ ...it, i }));
  const wobble = (pts, amp, seed) => {
    const out = [pts[0]];
    for (let k = 1; k < pts.length; k++) {
      const [x1, y1] = pts[k - 1], [x2, y2] = pts[k];
      const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
      const n = Math.max(1, Math.round(d / 45));
      for (let j = 1; j <= n; j++) {
        const u = j / (n + 1), o = amp * Math.sin(seed * 7.1 + k * 3.3 + j * 2.1);
        out.push([x1 + dx * u + nx * o, y1 + dy * u + ny * o]);
      }
      out.push([x2, y2]);
    }
    return out;
  };
  const toD = (pts) => "M" + pts.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" L");
  const smoothD = (pts) => {
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let k = 1; k < pts.length - 1; k++) {
      const mx = (pts[k][0] + pts[k + 1][0]) / 2, my = (pts[k][1] + pts[k + 1][1]) / 2;
      d += ` Q${pts[k][0].toFixed(1)},${pts[k][1].toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
    }
    const L = pts[pts.length - 1];
    return d + ` L${L[0].toFixed(1)},${L[1].toFixed(1)}`;
  };
  function buildBoard() {
    const defs = el("defs", {}, boardG);
    for (const it of items) {
      const color = COLORS[it.c] || it.c;
      if (it.k === "text") {
        const cp = el("clipPath", { id: "cp" + it.i }, defs);
        it.clip = el("rect", { x: 0, y: it.y - it.size * 1.1, height: it.size * 1.6, width: 0 }, cp);
        it.el = el("text", { x: it.x, y: it.y, "font-size": it.size + 4, fill: color, "text-anchor": it.anchor || "start", "clip-path": `url(#cp${it.i})` }, boardG);
        it.el.textContent = it.s;
        it.w = it.el.getComputedTextLength();
        it.x0 = it.anchor === "middle" ? it.x - it.w / 2 : it.x;
        it.clip.setAttribute("x", it.x0 - 6);
        it.start = [it.x0, it.y - it.size * 0.35]; it.end = [it.x0 + it.w, it.y - it.size * 0.35];
      } else {
        let pts;
        if (it.k === "circle") {
          pts = [];
          const ph = 0.4 + it.i;
          for (let k = 0; k <= 44; k++) {
            const a = -Math.PI / 2 + (k / 40) * Math.PI * 2;
            const r = it.r * (1 + 0.03 * Math.sin(3 * a + ph));
            pts.push([it.cx + r * Math.cos(a), it.cy + r * Math.sin(a)]);
          }
          it.el = el("path", { d: smoothD(pts) }, boardG);
        } else {
          pts = it.closed ? [...it.pts, it.pts[0], lerp2(it.pts[0], it.pts[1], 0.08)] : it.pts;
          it.el = el("path", { d: toD(wobble(pts, 1.1, it.i)) }, boardG);
        }
        it.el.setAttribute("fill", "none"); it.el.setAttribute("stroke", color);
        it.el.setAttribute("stroke-width", it.w || 3); it.el.setAttribute("stroke-linecap", "round"); it.el.setAttribute("stroke-linejoin", "round");
        it.len = it.el.getTotalLength();
        it.el.setAttribute("stroke-dasharray", `${it.len} ${it.len}`);
        const p0 = it.el.getPointAtLength(0), p1 = it.el.getPointAtLength(it.len);
        it.start = [p0.x, p0.y]; it.end = [p1.x, p1.y];
      }
      it.color = color;
      it.el.setAttribute("opacity", 0);
    }
  }
  const pointOf = (it, u) => {
    if (it.k === "text") return [it.x0 + it.w * u, it.y - it.size * 0.35 + 3 * Math.sin(u * it.w / 5)];
    const p = it.el.getPointAtLength(it.len * u);
    return [p.x, p.y];
  };
  function drawBoard(t) {
    for (const it of items) {
      if (t < it.t0) { it.el.setAttribute("opacity", 0); continue; }
      const u = clamp((t - it.t0) / (it.t1 - it.t0), 0, 1);
      let op = 1;
      if (it.e0 !== undefined && it.e0 !== null && t >= it.e0) op = 1 - ss((t - it.e0) / 0.3);
      it.el.setAttribute("opacity", op.toFixed(3));
      if (it.k === "text") it.clip.setAttribute("width", ((it.w + 12) * u).toFixed(1));
      else it.el.setAttribute("stroke-dashoffset", (it.len * (1 - u)).toFixed(2));
    }
  }

  // pen actions (drawing + erasing) in time order
  let pen = [];
  const eraserPt = (e, t) => {
    const zi = clamp(Math.floor((t - e.t0) / 1.25), 0, e.zones.length - 1);
    const [zx, zy, zw, zh] = e.zones[zi];
    const u = clamp((t - e.t0 - zi * 1.25) / 1.25, 0, 1);
    return [zx + 40 + (zw - 90) * u, zy + zh / 2 + (zh / 2 - 22) * Math.sin(u * Math.PI * 7)];
  };
  function buildPen() {
    pen = [
      ...items.map((it) => ({ t0: it.t0, t1: it.t1, mode: "marker", color: it.color, at: (t) => pointOf(it, clamp((t - it.t0) / (it.t1 - it.t0), 0, 1)), start: it.start, end: it.end })),
      ...TL.erases.map((e) => ({ t0: e.t0, t1: e.t1, mode: "eraser", at: (t) => eraserPt(e, t), start: eraserPt(e, e.t0), end: eraserPt(e, e.t1) })),
    ].sort((a, b) => a.t0 - b.t0);
  }
  function penAt(t) {
    const i = lastIdx(pen, t, "t0");
    if (i < 0) return null;
    const a = pen[i];
    if (t <= a.t1) return { pt: a.at(t), mode: a.mode, color: a.color, down: true };
    const nx = pen[i + 1];
    if (nx && nx.t0 - a.t1 < 1.6) {
      const u = ss((t - a.t1) / (nx.t0 - a.t1));
      const p = lerp2(a.end, nx.start, u);
      return { pt: [p[0], p[1] - 10 * Math.sin(u * Math.PI)], mode: nx.mode, color: nx.color, down: false };
    }
    return { pt: a.end, mode: a.mode, color: a.color, down: false, idle: t - a.t1 };
  }
  // back view while writing
  let backIv = [];
  function buildBack() {
    for (const p of pen) {
      const a = p.t0 - 0.35, b = p.t1 + 0.35;
      const L = backIv[backIv.length - 1];
      if (L && a - L.b < 1.0) L.b = Math.max(L.b, b); else backIv.push({ a, b });
    }
  }
  const backAt = (t) => { const i = lastIdx(backIv, t, "a"); return i >= 0 && t <= backIv[i].b ? backIv[i] : null; };

  // ------------------------------------------------------------ position (walking to the board and back)
  const sessions = [];
  for (let i = 0; i + 1 < TL.walks.length; i += 2) {
    const to = TL.walks[i], back = TL.walks[i + 1];
    sessions.push({ a: to.t0, b: to.t1, c: back.t0, d: back.t1 });
  }
  const standOf = (pt) => clamp(BR.x + pt[0] - 118, 1236, 1790);
  function standRaw(t, s) {
    const first = pen.find((p) => p.t0 >= s.b - 0.05);
    if (first && t < first.t0) return standOf(first.start);
    const p = penAt(t);
    return p ? standOf(p.pt) : HOME;
  }
  function standSmooth(t, s) { let sum = 0; for (let k = 0; k < 7; k++) sum += standRaw(t - k * 0.1, s); return sum / 7; }
  function posX(t) {
    for (const s of sessions) {
      if (t < s.a || t > s.d) continue;
      if (t < s.b) return lerp(HOME, standSmooth(s.b, s), ss((t - s.a) / (s.b - s.a)));
      if (t <= s.c) return standSmooth(t, s);
      return lerp(standSmooth(s.c, s), HOME, ss((t - s.c) / (s.d - s.c)));
    }
    return HOME;
  }

  // ------------------------------------------------------------ laser
  let laser = [];
  function buildLaser() {
    laser = TL.laser.map((e, i, arr) => {
      let end = e.t + 3.4;
      if (arr[i + 1]) end = Math.min(end, arr[i + 1].t);
      const n = slideAt(e.t).n;
      const pc = presses.find((p) => p.t > e.t && p.n !== n);
      if (pc) end = Math.min(end, pc.t + 0.15);
      const bw = backIv.find((b) => b.a > e.t);
      if (bw) end = Math.min(end, bw.a);
      return { ...e, end };
    });
    laser.forEach((e, i) => { e.cont = i > 0 && laser[i - 1].end >= e.t - 0.05; });
  }
  function laserAt(t) {
    const i = lastIdx(laser, t);
    if (i < 0) return null;
    const e = laser[i];
    if (t > e.end + 0.25) return null;
    const out = t > e.end ? 1 - ss((t - e.end) / 0.22) : 1;
    const vis = (e.cont ? 1 : ss((t - e.t) / 0.15)) * out;
    let box = e.box;
    if (e.cont) { const u = ss((t - e.t) / 0.32); box = e.box.map((v, k) => lerp(laser[i - 1].box[k], v, u)); }
    const hv = (e.cont ? 1 : ss((t - e.t) / 0.25)) * out;
    const c = [box[0] + box[2] / 2 + 3 * noise(t * 2.1, 1), box[1] + box[3] / 2 + 3 * noise(t * 2.3, 4)];
    return { i, e, vis, hv, box, c, age: t - e.t };
  }

  // ------------------------------------------------------------ misc tracks
  const activeAt = (arr, t, dur) => { const i = lastIdx(arr, t); if (i < 0) return null; const e = arr[i]; const d = dur ?? e.dur; return t <= e.t + d ? e : null; };
  const gestW = (e, t) => ss((t - e.t) / 0.3) * (1 - ss((t - (e.t + e.dur - 0.3)) / 0.3));
  const subs = TL.subs;
  const speakingRaw = (t) => { const i = lastIdx(subs, t + 0.25, "t0"); return i >= 0 && t <= subs[i].t1 + 0.4 ? 1 : 0; };
  const env = TL.env;
  const envAt = (t) => { const f = t * TL.fps; const i = Math.floor(f); const a = env[i] || 0, b = env[i + 1] || 0; return lerp(a, b, f - i); };
  const speakAt = (t) => { let s = 0, e = 0; for (let k = 0; k < 6; k++) { s += speakingRaw(t - k * 0.1); e += envAt(t - k * 0.1); } return 0.7 * (s / 6) + 0.3 * Math.min(1, (e / 6) * 1.6); };
  const blinks = []; for (let t = 1.3; t < TL.duration + 5; t += 2.2 + 3.2 * rand()) blinks.push(t);
  const blinkAt = (t) => { const i = lastIdx(blinks.map((b) => ({ t: b })), t); if (i < 0) return 0; const u = (t - blinks[i]) / 0.16; return u >= 0 && u <= 1 ? 1 - Math.abs(u * 2 - 1) : 0; };
  const blinkObjs = blinks.map((b) => ({ t: b }));
  const blinkFast = (t) => { const i = lastIdx(blinkObjs, t); if (i < 0) return 0; const u = (t - blinks[i]) / 0.16; return u >= 0 && u <= 1 ? 1 - Math.abs(u * 2 - 1) : 0; };

  // ------------------------------------------------------------ character control
  const R = window.Character.reach;
  const toLocal = (sx, sy, x) => [sx - x, sy - GROUND];
  const aimAt = (sh, target, frac) => { const dx = target[0] - sh[0], dy = target[1] - sh[1], d = Math.hypot(dx, dy) || 1; const L = Math.min(d, R * frac); return [sh[0] + (dx / d) * L, sh[1] + (dy / d) * L]; };
  function rawHands(t, x, back, speak) {
    const base = {
      L: [-54 + 3 * noise(t * 0.5, 3), lerp(-308, -350, speak) + 6 * noise(t * 0.7, 5)],
      R: [lerp(58, 46, speak) + 14 * speak * Math.sin(t * 2.2 + noise(t * 0.3, 2)), lerp(-308, -372, speak) - 20 * speak * Math.abs(Math.sin(t * 1.6 + 0.5))],
    };
    if (back) return { L: [-58, -302], R: base.R };
    let L = base.L, Rh = base.R;
    const shL = [window.Character.SHOULDER.L[0], window.Character.SHOULDER.L[1]];
    const shR = [window.Character.SHOULDER.R[0], window.Character.SHOULDER.R[1]];
    // gestures
    const g = activeAt(TL.gest, t);
    if (g) {
      const w = gestW(g, t);
      if (g.v === "raise") Rh = lerp2(Rh, [82, -742], w);
      else if (g.v === "open") { Rh = lerp2(Rh, [132, -398], w); L = lerp2(L, [-132, -398], w); }
      else if (g.v === "think") Rh = lerp2(Rh, [16, -548], w);
      else if (g.v === "shrug") { Rh = lerp2(Rh, [114, -360], w); L = lerp2(L, [-114, -360], w); }
    }
    const pb = activeAt(TL.pb, t);
    if (pb) {
      const w = ss((t - pb.t) / 0.3) * (1 - ss((t - (pb.t + pb.dur - 0.3)) / 0.3));
      const tgt = toLocal(BR.x + pb.box[0] + pb.box[2] / 2, BR.y + pb.box[1] + pb.box[3] / 2, x);
      Rh = lerp2(Rh, aimAt(shR, tgt, 0.95), w);
    }
    const la = laserAt(t);
    if (la) {
      const w = la.e.cont ? la.vis : ss((t - (la.e.t - 0.25)) / 0.3) * (t > la.e.end ? 1 - ss((t - la.e.end) / 0.25) : 1);
      const [sx, sy] = slideXY(la.c[0], la.c[1]);
      L = lerp2(L, aimAt(shL, toLocal(sx, sy, x), 0.93), w);
    }
    // clicker press: tiny thumb dip
    const pi = lastIdx(presses, t);
    if (pi >= 0 && t - presses[pi].t < 0.2) L = [L[0], L[1] + 5 * Math.sin(((t - presses[pi].t) / 0.2) * Math.PI)];
    return { L, R: Rh };
  }
  function yawRaw(t, v) {
    if (backAt(t)) return 0;
    if (activeAt(TL.pb, t)) return 0.75;
    const li = lastIdx(TL.look, t), lk = li >= 0 ? TL.look[li] : null;
    const la = laserAt(t);
    const lt = la ? la.e.t : -99;
    if (la && la.age < 1.7 && (!lk || lt >= lk.t)) return -0.85;
    if (lk && t - lk.t < 2.4) return { class: 0, screen: -0.85, board: 0.85 }[lk.v] ?? 0;
    if (Math.abs(v) > 40) return 0.45 * Math.sign(v);
    return 0.12 * noise(t * 0.3, 1);
  }

  // ------------------------------------------------------------ audience
  const audL = $("audL");
  const AUD = [
    { x: 150, y: 1046, s: 1.04, shirt: "#3d4a5c", hair: "#16130f" },
    { x: 415, y: 1066, s: 1.12, shirt: "#8a5a44", hair: "#231a14" },
    { x: 690, y: 1040, s: 0.98, shirt: "#2f5d50", hair: "#0f0d0c" },
    { x: 955, y: 1070, s: 1.15, shirt: "#5b4e7a", hair: "#1d1712" },
  ];
  const ORDER = [1, 3, 0, 2];
  function buildAudience() {
    for (const [k, a] of AUD.entries()) {
      const g = el("g", { transform: `translate(${a.x},${a.y}) scale(${a.s})` }, audL);
      a.arm = el("line", { stroke: a.shirt, "stroke-width": 20, "stroke-linecap": "round" }, g);
      a.hand = el("circle", { r: 11, fill: "#e8bf98" }, g);
      el("path", { d: "M-74,70 Q-70,4 0,-4 Q70,4 74,70 Z", fill: a.shirt }, g);
      el("rect", { x: -12, y: -22, width: 24, height: 22, fill: "#d9ad86" }, g);
      a.head = el("g", {}, g);
      el("ellipse", { cx: -33, cy: -46, rx: 6, ry: 10, fill: "#d9ad86" }, a.head);
      el("ellipse", { cx: 33, cy: -46, rx: 6, ry: 10, fill: "#d9ad86" }, a.head);
      el("ellipse", { cx: 0, cy: -50, rx: 34, ry: 40, fill: a.hair }, a.head);
      a.side = k % 2 ? 1 : -1;
    }
  }
  function drawAudience(t) {
    const h = activeAt(TL.hands, t);
    AUD.forEach((a, k) => {
      const rank = ORDER.indexOf(k);
      let w = 0;
      if (h && rank < Math.min(4, h.n)) { const t0 = h.t + rank * 0.18; w = ss((t - t0) / 0.3) * (1 - ss((t - (h.t + h.dur - 0.3)) / 0.3)); }
      const sh = [a.side * 40, 10], up = [a.side * 58, -152];
      const hp = lerp2([a.side * 46, 40], up, w);
      a.arm.setAttribute("x1", sh[0]); a.arm.setAttribute("y1", sh[1]); a.arm.setAttribute("x2", hp[0].toFixed(1)); a.arm.setAttribute("y2", hp[1].toFixed(1));
      a.hand.setAttribute("cx", hp[0].toFixed(1)); a.hand.setAttribute("cy", (hp[1] - 8).toFixed(1));
      a.arm.setAttribute("opacity", w > 0.02 ? 1 : 0); a.hand.setAttribute("opacity", w > 0.02 ? 1 : 0);
      a.head.setAttribute("transform", `rotate(${(2.5 * noise(t * 0.25, k * 3)).toFixed(2)},0,-20)`);
    });
  }

  // ------------------------------------------------------------ panel
  const PARTS = [["Mở đầu", 1], ["Overview", 4], ["Modeling", 9], ["Game evaluation", 20]];
  const pBar = $("p-bar");
  const BARW = 552;
  let partSegs = [];
  function buildPanel() {
    const ts = PARTS.map(([name, n]) => ({ name, t0: slideInfo[n].t0 }));
    ts.forEach((p, i) => { p.t1 = i + 1 < ts.length ? ts[i + 1].t0 : TL.duration; });
    partSegs = ts.map((p) => {
      const x = (p.t0 / TL.duration) * BARW, w = ((p.t1 - p.t0) / TL.duration) * BARW - 3;
      const seg = document.createElement("div"); seg.className = "seg"; seg.style.left = x + "px"; seg.style.width = w + "px"; pBar.appendChild(seg);
      const lab = document.createElement("div"); lab.className = "lab"; lab.style.left = x + "px"; lab.textContent = p.name; pBar.appendChild(lab);
      return { ...p, seg };
    });
    const fill = document.createElement("div"); fill.className = "fill"; fill.id = "p-fill"; pBar.appendChild(fill);
  }
  const SEQTXT = { up: "Kéo thanh trượt q lên gần 1", down: "Kéo q về 0", mid: "Thả q về 0,5", mc10: "Deck tự chơi 10 ván", mc1000: "Deck tự chơi thêm 1000 ván" };
  const BADGE = { press: ["BẤM →", "#ffd166"], draw: ["VIẾT BẢNG", "#86efac"], walk: ["ĐI TỚI BẢNG", "#86efac"], erase: ["XÓA BẢNG", "#fca5a5"], video: ["VIDEO", "#c4b5fd"], pause: ["HỎI LỚP", "#f9a8d4"], pb: ["CHỈ BẢNG", "#93c5fd"], raise: ["GIƠ TAY", "#f9a8d4"], point: ["CHỈ", "#fdba74"], seq: ["THAO TÁC", "#fde68a"], talk: ["NÓI", "#cbd5e1"], look: ["NHÌN", "#cbd5e1"] };
  let lastPanel = "";
  function cueAt(t) {
    const pi = lastIdx(presses, t + 0.15);
    if (pi >= 0 && t - presses[pi].t < 0.9) {
      const p = presses[pi], prev = pi > 0 ? presses[pi - 1] : { n: 1 };
      return ["press", p.n !== prev.n ? `Sang slide ${p.n}: ${slideInfo[p.n]?.title || ""}` : `Bước ${p.step + 1}/${(slideInfo[p.n]?.max ?? 0) + 1} của slide`];
    }
    for (const s of sessions) if (t >= s.a && t < s.b) return ["walk", "Đi tới bảng, cầm bút"];
    const d = TL.draws.find((g) => t >= g.t0 && t <= g.t1);
    if (d) return ["draw", d.label];
    const e = TL.erases.find((g) => t >= g.t0 && t <= g.t1);
    if (e) return ["erase", e.label];
    if (TL.video && t >= TL.video.t && t <= TL.video.t + TL.video.dur) return ["video", "Video manim tự chạy, nói theo phụ đề"];
    const pa = activeAt(TL.pauses, t);
    if (pa) return ["pause", "Dừng lại, chờ lớp trả lời"];
    const pb = activeAt(TL.pb, t);
    if (pb) return ["pb", pb.label];
    const sq = TL.seqs.find((q) => t >= q.t && t <= q.t1);
    if (sq && SEQTXT[sq.name]) return ["seq", SEQTXT[sq.name]];
    const g = activeAt(TL.gest, t);
    if (g && g.v === "raise") return ["raise", "Giơ tay làm mẫu, mời lớp giơ tay"];
    const la = laserAt(t);
    if (la && t <= la.e.end) return ["point", la.e.label];
    const li = lastIdx(TL.look, t);
    if (li >= 0 && t - TL.look[li].t < 1.5) return ["look", { class: "Quay lại nhìn cả lớp", screen: "Nhìn lên màn chiếu", board: "Nhìn sang bảng" }[TL.look[li].v]];
    return ["talk", "Nói với lớp, giao tiếp bằng mắt"];
  }
  function drawPanel(t) {
    const sl = slideAt(t);
    const info = slideInfo[sl.n] || { title: "", max: 0, part: "" };
    const [kind, text] = cueAt(t);
    const np = presses.find((p) => p.t > t);
    let next = "";
    if (np && np.t - t < 8) next = `Bấm → sau ${(np.t - t).toFixed(1).replace(".", ",")} s`;
    else { const nd = TL.draws.find((g) => g.t0 > t && g.t0 - t < 8); if (nd) next = `Sắp viết bảng: ${nd.label}`; }
    const key = [sl.n, sl.step, fmt(t), kind, text, next].join("|");
    if (key !== lastPanel) {
      lastPanel = key;
      $("p-slide").textContent = `SLIDE ${sl.n}/64 · BƯỚC ${sl.step + 1}/${info.max + 1}`;
      $("p-time").textContent = `${fmt(t)} / ${fmt(TL.duration)}`;
      $("p-title").textContent = `${info.part} · ${info.title}`;
      $("p-badge").textContent = BADGE[kind][0];
      $("p-badge").style.background = BADGE[kind][1];
      $("p-text").textContent = text;
      $("p-next").textContent = next;
    }
    $("p-fill").style.width = ((t / TL.duration) * BARW).toFixed(1) + "px";
    partSegs.forEach((p) => p.seg.classList.toggle("on", t >= p.t0 && t < p.t1));
  }

  // ------------------------------------------------------------ projector
  const proj = TL.proj;
  const imgA = $("imgA"), imgB = $("imgB");
  const M01N = TL.video ? Math.floor(TL.video.dur * 25) : 0;
  const afterVideo = TL.video ? proj.find((p) => p.t > TL.video.t + 0.3) : null;
  const srcOf = (k) => `../build/proj/${k}.jpg`;
  function projState(t) {
    if (TL.video && t >= TL.video.t && (!afterVideo || t < afterVideo.t)) {
      const f = clamp(Math.floor((t - TL.video.t) * 25) + 1, 1, M01N);
      return { src: `../build/proj/m01/f${String(f).padStart(4, "0")}.jpg`, prev: null, fade: 1 };
    }
    const i = Math.max(0, lastIdx(proj, t));
    const cur = proj[i], prev = i > 0 ? proj[i - 1] : null;
    let fade = 1;
    if (prev && /^s\d\d_/.test(cur.key) && t - cur.t < 0.25) fade = ss((t - cur.t) / 0.25);
    return { src: srcOf(cur.key), prev: fade < 1 ? srcOf(prev.key) : null, fade };
  }
  async function setSrc(img, src) { if (img._src === src) return; img._src = src; img.src = src; try { await img.decode(); } catch (e) { /* missing frame */ } }

  // ------------------------------------------------------------ main
  let CH;
  window.sceneReady = (async () => {
    await document.fonts.ready;
    await Promise.all([...document.fonts].map((f) => f.load().catch(() => null)));
    buildBoard(); buildPen(); buildBack(); buildLaser(); buildAudience(); buildPanel();
    CH = window.Character.build($("charL"));
    return true;
  })();

  window.renderAt = async (t) => {
    // projector
    const st = projState(t);
    const loads = [setSrc(imgB, st.src)];
    if (st.prev) loads.push(setSrc(imgA, st.prev));
    await Promise.all(loads);
    imgB.style.opacity = st.fade;
    imgA.style.display = st.prev ? "block" : "none";
    // laser + highlight
    const la = laserAt(t);
    const hl = $("hl"), lz = $("laser");
    if (la) {
      const [bx, by, bw, bh] = la.box;
      hl.style.left = (bx * K - 6) + "px"; hl.style.top = (by * K - 6) + "px"; hl.style.width = (bw * K + 6) + "px"; hl.style.height = (bh * K + 6) + "px";
      hl.style.opacity = (la.hv * (0.85 + 0.15 * Math.sin(t * 5))).toFixed(3);
      lz.style.left = (la.c[0] * K) + "px"; lz.style.top = (la.c[1] * K) + "px"; lz.style.opacity = la.vis.toFixed(3);
    } else { hl.style.opacity = 0; lz.style.opacity = 0; }
    const pi = lastIdx(presses, t);
    const kc = $("keycap");
    if (pi >= 0 && t - presses[pi].t < 0.7) { const u = (t - presses[pi].t) / 0.7; kc.style.opacity = (1 - ss((u - 0.6) / 0.4)).toFixed(3); kc.style.transform = `scale(${(1 + 0.18 * Math.sin(Math.min(1, u * 3) * Math.PI)).toFixed(3)})`; }
    else kc.style.opacity = 0;
    // board
    drawBoard(t);
    // character
    const x = posX(t);
    const v = (posX(t + 0.04) - posX(t - 0.04)) / 0.08;
    const bi = backAt(t);
    const back = !!bi;
    let sx = 1;
    for (const b of backIv) for (const edge of [b.a, b.b]) { const d = Math.abs(t - edge); if (d < 0.2) sx = Math.min(sx, 1 - 0.3 * (1 - d / 0.2)); }
    const speak = speakAt(t);
    const walk = clamp(Math.abs(v) / 140, 0, 1);
    const phase = x / 26;
    const feet = {
      L: [-24 + walk * 16 * Math.sin(phase), -walk * 18 * Math.max(0, Math.sin(phase + Math.PI / 2))],
      R: [24 + walk * 16 * Math.sin(phase + Math.PI), -walk * 18 * Math.max(0, Math.sin(phase + Math.PI * 1.5))],
    };
    // smoothed non-writing hand targets
    const acc = { L: [0, 0], R: [0, 0] };
    const N = 5;
    for (let k = 0; k < N; k++) {
      const tk = t - k * 0.06;
      const h = rawHands(tk, posX(tk), !!backAt(tk), speakAt(tk));
      acc.L[0] += h.L[0] / N; acc.L[1] += h.L[1] / N; acc.R[0] += h.R[0] / N; acc.R[1] += h.R[1] / N;
    }
    let hands = acc;
    let propR = null, propColor = null;
    const pa = penAt(t);
    if (bi && pa) {
      const wW = ss((t - bi.a) / 0.3) * ss((bi.b - t) / 0.3);
      const tip = toLocal(BR.x + pa.pt[0], BR.y + pa.pt[1], x);
      const sh = window.Character.SHOULDER.R;
      const dx = tip[0] - sh[0], dy = tip[1] - sh[1], d = Math.hypot(dx, dy) || 1;
      const off = pa.mode === "eraser" ? 20 : 30;
      const hand = [tip[0] - (dx / d) * off, tip[1] - (dy / d) * off];
      hands = { L: acc.L, R: lerp2(acc.R, hand, wW) };
      propR = pa.mode === "eraser" ? "eraser" : "marker";
      propColor = pa.color;
    }
    let yaw = 0;
    for (let k = 0; k < 6; k++) { const tk = t - k * 0.06; const vk = (posX(tk + 0.04) - posX(tk - 0.04)) / 0.08; yaw += yawRaw(tk, vk) / 6; }
    const env0 = envAt(t), mouth = back ? 0 : clamp((Math.max(env0, envAt(t - 0.04)) - 0.07) / 0.55, 0, 1);
    const pausing = activeAt(TL.pauses, t);
    const gst = activeAt(TL.gest, t);
    const pose = {
      x, sx, back, feet, hands, yaw,
      bob: -walk * 5 * Math.abs(Math.sin(phase)) + 1.2 * Math.sin(t * 1.8),
      sway: (1 - walk) * 3 * Math.sin(t * 0.55),
      tilt: -yaw * 3 + 1.6 * noise(t * 0.6, 9) * speak,
      mouth, blink: blinkFast(t), brow: pausing || (gst && gst.v === "raise") ? 1 : 0.35 * speak,
      shrug: gst && gst.v === "shrug" ? gestW(gst, t) : 0,
      propL: back ? null : "clicker", propR, propColor,
    };
    window.Character.draw(CH, pose);
    drawAudience(t);
    // subtitles
    const si = lastIdx(subs, t + 0.05, "t0");
    const sub = si >= 0 && t <= subs[si].t1 + 0.35 ? subs[si].text : "";
    const sEl = $("subtext");
    if (sEl.textContent !== sub) sEl.textContent = sub;
    drawPanel(t);
  };

  // ------------------------------------------------------------ preview
  const q = new URLSearchParams(location.search);
  const fit = () => { const k = Math.min(innerWidth / 1920, innerHeight / 1080); $("stage").style.transform = `scale(${k})`; };
  if (q.has("play") || q.has("t")) { fit(); addEventListener("resize", fit); }
  if (q.has("t")) window.sceneReady.then(() => window.renderAt(+q.get("t")));
  if (q.has("play")) {
    const au = new Audio("../build/narration.wav");
    au.currentTime = +(q.get("play") || 0);
    const tick = async () => { await window.renderAt(au.currentTime); requestAnimationFrame(tick); };
    window.sceneReady.then(() => { window.renderAt(au.currentTime); addEventListener("click", () => { au.paused ? au.play() : au.pause(); }); tick(); });
  }
})();
