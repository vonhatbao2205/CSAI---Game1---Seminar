/* Shared helpers for the Games 1 widgets. Every number a widget shows is computed by the algorithm named on its
   slide (exact fractions, the same recursions as research_notes/.../verify_examples.py). */
(function () {
  "use strict";
  const G = (window.G = {});
  const W = (window.W = {});
  G.$ = (s, r = document) => r.querySelector(s);
  G.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  G.h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
  const NS = "http://www.w3.org/2000/svg";
  G.sv = (tag, attrs = {}, text) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    return e;
  };
  G.css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  G.MINUS = "−";
  // Vietnamese number format: decimal comma, dot for thousands, real minus sign
  G.vn = (x, d = 2) => {
    if (x === Infinity) return "+∞";
    if (x === -Infinity) return G.MINUS + "∞";
    const s = Number(x).toLocaleString("vi-VN", { maximumFractionDigits: d });
    return s.replace("-", G.MINUS);
  };
  G.sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ---------------------------------------------------------------- exact fractions
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  class Fr {
    constructor(n, d = 1) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); this.n = n / g; this.d = d / g; }
    static of(x) { return x instanceof Fr ? x : new Fr(x, 1); }
    add(o) { o = Fr.of(o); return new Fr(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { o = Fr.of(o); return new Fr(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { o = Fr.of(o); return new Fr(this.n * o.n, this.d * o.d); }
    div(o) { o = Fr.of(o); return new Fr(this.n * o.d, this.d * o.n); }
    cmp(o) { o = Fr.of(o); return this.n * o.d - o.n * this.d; }
    eq(o) { return this.cmp(o) === 0; }
    get v() { return this.n / this.d; }
    toString() { const s = (this.n < 0 ? G.MINUS : "") + Math.abs(this.n).toLocaleString("vi-VN"); return this.d === 1 ? s : `${s}/${this.d}`; }
  }
  G.Fr = Fr;
  G.F = (n, d = 1) => new Fr(n, d);
  G.fmt = (x) => (x instanceof Fr ? x.toString() : typeof x === "number" ? G.vn(x) : String(x));
  G.fmax = (arr) => arr.map((x) => Fr.of(x)).reduce((a, b) => (b.cmp(a) > 0 ? b : a));
  G.fmin = (arr) => arr.map((x) => Fr.of(x)).reduce((a, b) => (b.cmp(a) < 0 ? b : a));
  G.fmean = (arr) => arr.reduce((a, b) => a.add(b), G.F(0)).div(arr.length);

  // ---------------------------------------------------------------- the three boxes (CS221 games1.pdf p.5)
  G.BOX = { A: [-50, 50], B: [1, 3], C: [-5, 15] };
  G.BOXES = ["A", "B", "C"];

  // ---------------------------------------------------------------- tic-tac-toe
  const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  G.LINES = LINES;
  G.winner = (b) => { for (const [i, j, k] of LINES) if (b[i] !== "." && b[i] === b[j] && b[j] === b[k]) return { p: b[i], line: [i, j, k] }; return null; };
  G.tttEnd = (b) => !!G.winner(b) || !b.includes(".");
  G.tttU = (b) => { const w = G.winner(b); return w ? (w.p === "X" ? 1 : -1) : 0; };
  G.tttActions = (b) => (G.tttEnd(b) ? [] : [...b].map((c, i) => (c === "." ? i : -1)).filter((i) => i >= 0));
  G.tttSucc = (b, a, p) => b.slice(0, a) + p + b.slice(a + 1);
  const memoMM = new Map(), memoEX = new Map();
  // value from X's point of view; X = agent (max); O = min (minimax) or uniform random (expectimax)
  G.tttMinimax = function mm(b, p) {
    const key = b + p; if (memoMM.has(key)) return memoMM.get(key);
    let v;
    if (G.tttEnd(b)) v = G.tttU(b);
    else { const vals = G.tttActions(b).map((a) => mm(G.tttSucc(b, a, p), p === "X" ? "O" : "X")); v = p === "X" ? Math.max(...vals) : Math.min(...vals); }
    memoMM.set(key, v); return v;
  };
  G.tttExpectimax = function ex(b, p) {
    const key = b + p; if (memoEX.has(key)) return memoEX.get(key);
    let v;
    if (G.tttEnd(b)) v = G.F(G.tttU(b));
    else { const vals = G.tttActions(b).map((a) => ex(G.tttSucc(b, a, p), p === "X" ? "O" : "X")); v = p === "X" ? G.fmax(vals) : G.fmean(vals); }
    memoEX.set(key, v); return v;
  };

  // static boards: <div class="board" data-board="...O.XXOO" data-hl="4:new,2:threat" data-idx></div>
  G.renderBoard = function (el, b, hl = {}, showIdx = false) {
    el.innerHTML = "";
    el._q = [...b].map((c, i) => {
      const q = G.h("div", "q" + (c === "X" ? " x" : c === "O" ? " o" : ""), c === "." ? "" : c);
      if (showIdx) q.appendChild(G.h("span", "ix", String(i)));
      if (hl[i]) hl[i].split(" ").forEach((k) => q.classList.add(k));
      el.appendChild(q); return q;
    });
    return el._q;
  };
  G.parseHl = (s) => { const o = {}; (s || "").split(",").map((x) => x.trim()).filter(Boolean).forEach((m) => { const [i, c] = m.split(":"); o[+i] = (o[+i] ? o[+i] + " " : "") + c; }); return o; };

  // the engine calls these two on every slide it mounts / steps
  window.mountArrays = function (scope) {
    G.$$(".board[data-board]", scope).forEach((e) => {
      if (e._q) return;
      G.renderBoard(e, e.dataset.board, G.parseHl(e.dataset.hl), e.dataset.idx !== undefined);
    });
  };
  window.applyMarks = function (e, st) {
    if (!e._q) return;
    const marks = JSON.parse(e.dataset.marks);
    let best = null;
    Object.keys(marks).map(Number).sort((a, b) => a - b).forEach((k) => { if (k <= st) best = k; });
    const m = best !== null ? marks[best] : null;
    const board = m && typeof m === "object" && m.board ? m.board : e.dataset.board;
    const hl = m === null ? e.dataset.hl : typeof m === "object" ? m.hl || "" : m;
    G.renderBoard(e, board, G.parseHl(hl), e.dataset.idx !== undefined);
  };

  // little GSAP helpers (fall back to plain updates if GSAP is missing)
  G.pop = function (el) {
    if (window.gsap && el) gsap.fromTo(el, { scale: 0.55, opacity: 0.15, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2)" });
  };
  G.countTo = function (el, to, ms = 1400, fmt = (x) => Math.round(x).toLocaleString("vi-VN")) {
    if (!window.gsap) { el.textContent = fmt(to); return; }
    const o = { v: 0 };
    gsap.to(o, { v: to, duration: ms / 1000, ease: "power2.out", onUpdate: () => { el.textContent = fmt(o.v); } });
  };

  // ---------------------------------------------------------------- title / closing π
  W.bigpi = (el, o) => {
    const svg = G.sv("svg", {});
    el.appendChild(svg);
    const p = window.makePi(svg, { mood: o.mood || "happy" });
    return { enter() { p.look(1200, 300); } };
  };
})();
