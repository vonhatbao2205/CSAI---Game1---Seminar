/* Game trees in SVG: one renderer, shapes as in CS188 (MAX ▲, MIN ▼, expectation ●, terminal ■),
   plus the widgets built on the three-box game and on small minimax trees. */
(function () {
  "use strict";
  const { h, sv, F, fmt, $, $$ } = G;

  // ------------------------------------------------------------------ renderer
  // spec: {id, k: max|min|chance|eval|opp|term, v, op, kids: [{a, p, n}]}
  G.drawTree = function (host, spec, o = {}) {
    const Wd = o.w || 1100, Ht = o.h || 480, r = o.r || 42, lr = o.lr || 34, fs = o.fs || 27;
    const padX = o.padX !== undefined ? o.padX : Math.max(lr, r) + 24, padT = o.padT || r * 1.15 + 6, padB = o.padB || lr + 6;
    const all = [];
    let leaves = 0, depth = 0;
    (function walk(n, d, parent, edge) {
      n.d = d; n.parent = parent; n.edge = edge; depth = Math.max(depth, d); all.push(n);
      if (!n.kids || !n.kids.length) n.lx = leaves++;
      else { n.kids.forEach((k) => walk(k.n, d + 1, n, k)); n.lx = n.kids.reduce((s, k) => s + k.n.lx, 0) / n.kids.length; }
    })(spec, 0, null, null);
    const X = (n) => (leaves > 1 ? padX + (n.lx * (Wd - 2 * padX)) / (leaves - 1) : Wd / 2);
    const Y = (n) => (depth ? padT + (n.d * (Ht - padT - padB)) / depth : Ht / 2);
    const svg = sv("svg", { class: "gt", width: Wd, height: Ht, viewBox: `0 0 ${Wd} ${Ht}` });
    const gE = sv("g"), gN = sv("g");
    svg.append(gE, gN);
    const nodes = {}, edges = {};
    const top = (n) => (n.k === "term" ? lr : n.k === "max" ? r * 1.05 : n.k === "min" ? r * 0.78 : r * 0.95);
    const bot = (n) => (n.k === "term" ? lr : n.k === "max" ? r * 0.78 : n.k === "min" ? r * 1.05 : r * 0.95);
    function shape(n) {
      const k = n.k;
      if (k === "max") return sv("path", { class: "sh", d: `M0,${-r * 1.05}L${r * 1.15},${r * 0.78}L${-r * 1.15},${r * 0.78}Z`, "stroke-linejoin": "round" });
      if (k === "min") return sv("path", { class: "sh", d: `M${-r * 1.15},${-r * 0.78}L${r * 1.15},${-r * 0.78}L0,${r * 1.05}Z`, "stroke-linejoin": "round" });
      if (k === "term") return sv("rect", { class: "sh", x: -lr, y: -lr, width: 2 * lr, height: 2 * lr, rx: 8 });
      return sv("circle", { class: "sh", r: r * 0.95 });
    }
    const vy = (n) => (n.k === "max" ? r * 0.3 : n.k === "min" ? -r * 0.3 : 0);
    all.forEach((n) => {
      n.x = X(n); n.y = Y(n);
      if (n.parent) {
        const p = n.parent, g = sv("g", { class: "te" });
        const x1 = p.x, y1 = p.y + bot(p), x2 = n.x, y2 = n.y - top(n);
        const line = sv("line", { x1, y1, x2, y2 });
        g.appendChild(line);
        const e = { g, line, x1, y1, x2, y2 };
        const side = x2 < x1 - 4 ? -1 : x2 > x1 + 4 ? 1 : 0;
        if (n.edge.a !== undefined && n.edge.a !== "") {
          const mx = x1 + (x2 - x1) * 0.42, my = y1 + (y2 - y1) * 0.42;
          e.a = sv("text", { x: mx + (side <= 0 ? -16 : 16), y: my + 4, "text-anchor": side <= 0 ? "end" : "start" }, n.edge.a);
          g.appendChild(e.a);
        }
        const px = x1 + (x2 - x1) * 0.7, py = y1 + (y2 - y1) * 0.7;
        e.p = sv("text", { class: "pl", x: px + (side < 0 ? 12 : side > 0 ? -12 : 14), y: py + 4, "text-anchor": side < 0 ? "start" : side > 0 ? "end" : "start" }, n.edge.p || "");
        g.appendChild(e.p);
        gE.appendChild(g);
        edges[n.id] = e;
      }
      const g = sv("g", { class: `tn ${n.k}`, transform: `translate(${n.x},${n.y})` });
      const shp = shape(n);
      const v = sv("text", { class: "v", y: vy(n) }, n.v === undefined ? "" : fmt(n.v));
      v.style.fontSize = (n.k === "term" ? fs * 0.95 : fs) + "px";
      const op = sv("text", { class: "op", x: 0, y: -top(n) - 12 }, n.op || "");
      g.append(shp, v, op);
      if (n.nm) g.appendChild(sv("text", { class: "nm", y: bot(n) + 34 }, n.nm));
      gN.appendChild(g);
      nodes[n.id] = { n, g, shp, v, op };
    });
    host.appendChild(svg);
    const STATES = ["cur", "pick", "dim", "win", "loss", "ghost", "click"];
    const ESTATES = ["bold", "bold-max", "bold-min", "bold-chance", "dim", "hot"];
    const api = {
      svg, nodes, edges, all, spec,
      v(id, val, pop) { const N = nodes[id]; const t = val === undefined || val === null ? "" : fmt(val); if (N.v.textContent === t) return; N.v.textContent = t; if (pop) G.pop(N.v); },
      op(id, t) { nodes[id].op.textContent = t || ""; },
      k(id, k) {
        const N = nodes[id]; if (N.n.k === k) return;
        N.g.classList.remove(N.n.k); N.n.k = k; N.g.classList.add(k);
        const s = shape(N.n); N.g.replaceChild(s, N.shp); N.shp = s; N.v.setAttribute("y", vy(N.n));
        N.op.setAttribute("y", -top(N.n) - 12);
      },
      add(id, ...c) { nodes[id].g.classList.add(...c); },
      rm(id, ...c) { nodes[id].g.classList.remove(...c); },
      e(id, ...c) { if (edges[id]) edges[id].g.classList.add(...c); },
      erm(id, ...c) { if (edges[id]) edges[id].g.classList.remove(...c); },
      p(id, t) { if (edges[id]) edges[id].p.textContent = t || ""; },
      ew(id, w) { if (edges[id]) edges[id].line.style.strokeWidth = w === null ? "" : w; },
      reset() {
        Object.values(nodes).forEach((N) => N.g.classList.remove(...STATES));
        Object.values(edges).forEach((E) => { E.g.classList.remove(...ESTATES); E.line.style.strokeWidth = ""; });
      },
    };
    return api;
  };

  // ------------------------------------------------------------------ the three boxes
  const BOX = G.BOX, BX = G.BOXES;
  G.boxSpec = (opp = "chance", root = "max") => ({
    id: "r", k: root, v: "", kids: BX.map((b) => ({
      a: b, n: { id: b, k: opp, v: "", kids: BOX[b].map((u, j) => ({ a: "", n: { id: b + j, k: "term", v: u } })) },
    })),
  });
  const half = "½";
  // value of each box under an opponent rule, as fractions
  const boxVal = (b, rule) => {
    const [lo, hi] = BOX[b];
    if (rule === "min") return F(lo);
    if (rule === "max") return F(hi);
    if (rule && rule.q !== undefined) return rule.q.mul(lo).add(F(1).sub(rule.q).mul(hi));
    return F(lo + hi, 2);
  };
  G.boxVal = boxVal;

  // paint a box tree for one of the methods: eval | exp | mm (and the S6 opponent models)
  G.paintBoxes = function (t, mode, pop) {
    t.reset();
    const rule = mode === "mm" || mode === "adv" ? "min" : mode === "help" ? "max" : "avg";
    const oppK = mode === "mm" ? "min" : mode === "eval" || mode === "exp" ? "chance" : mode === "none" ? "chance" : "opp";
    const rootK = mode === "eval" ? "eval" : "max";
    t.k("r", rootK);
    const vals = {};
    BX.forEach((b) => {
      t.k(b, oppK);
      const [lo, hi] = BOX[b];
      vals[b] = boxVal(b, rule);
      t.v(b, mode === "none" ? "?" : vals[b], pop);
      t.op(b, mode === "none" ? "" : rule === "min" ? "min" : rule === "max" ? "max" : "E");
      [0, 1].forEach((j) => {
        const id = b + j, u = j ? hi : lo;
        t.p(id, rule === "avg" && mode !== "none" ? half : "");
        if (rule === "min" && u === lo) t.e(id, mode === "mm" ? "bold-min" : "bold-min");
        if (rule === "max" && u === hi) t.e(id, "bold-min");
        if (rule === "avg" && mode !== "none") t.e(id, "bold-chance");
      });
    });
    let pick;
    if (mode === "eval") pick = "A";
    else if (mode !== "none") pick = BX.reduce((a, b) => (vals[b].cmp(vals[a]) > 0 ? b : a));
    const rootV = mode === "none" ? "?" : mode === "eval" ? vals.A : vals[pick];
    t.v("r", rootV, pop);
    t.op("r", mode === "none" ? "" : mode === "eval" ? "π: luôn A" : "max");
    BX.forEach((b) => {
      t.p(b, mode === "eval" ? (b === "A" ? "1" : "0") : "");
      if (pick && b === pick) t.e(b, mode === "eval" ? "bold" : "bold");
      else if (pick) t.e(b, "dim");
    });
    if (pick) t.add(pick, "pick");
    return { vals, pick, root: rootV };
  };

  // S6 — one game, three opponent models
  W.boxModels = (el) => {
    el.classList.add("body-inner");
    el.style.cssText += ";display:flex;gap:46px;align-items:center;width:100%";
    const left = h("div", "tree-host"), right = h("div", "stack");
    right.style.cssText = "width:640px;flex:none;gap:22px";
    el.append(left, right);
    const t = G.drawTree(left, G.boxSpec("opp"), { w: 1020, h: 470, r: 46, lr: 38, fs: 29 });
    const MODELS = [
      ["help", "Số lớn (có lợi cho agent)", "max"],
      ["unif", "Mỗi số với xác suất ½", "chance"],
      ["adv", "Số nhỏ (bất lợi cho agent)", "min"],
    ];
    const btns = h("div", "btnrow");
    right.appendChild(h("div", "cap", "Đối thủ chọn:"));
    right.appendChild(btns);
    const tbl = h("table", "t cells");
    tbl.innerHTML = `<tr><th style="text-align:left">Đối thủ chọn</th><th>A</th><th>B</th><th>C</th><th>Chọn</th></tr>` +
      MODELS.map(([m, name]) => `<tr data-m="${m}"><td class="h" style="text-align:left">${{ help: "Số lớn", unif: "Xác suất ½", adv: "Số nhỏ" }[m]}</td><td class="num">·</td><td class="num">·</td><td class="num">·</td><td class="h">·</td></tr>`).join("");
    right.appendChild(tbl);
    const note = h("p", "txt", "&nbsp;");
    right.appendChild(note);
    const bmap = {};
    MODELS.forEach(([m, name, cls]) => {
      const b = h("button", `ghost ${cls}`, name);
      b.addEventListener("click", (e) => { e.stopPropagation(); set(m); b.blur(); });
      btns.appendChild(b); bmap[m] = b;
    });
    btns.style.cssText = "flex-direction:column;align-items:stretch";
    const seen = new Set();
    function set(m) {
      Object.entries(bmap).forEach(([k, b]) => b.classList.toggle("on", k === m));
      const res = G.paintBoxes(t, m || "none", true);
      if (!m) { note.innerHTML = "Sáu leaf không đổi. Value của mỗi hộp phụ thuộc cách đối thủ chọn."; return; }
      seen.add(m);
      $$("tr[data-m]", tbl).forEach((tr) => {
        const mm = tr.dataset.m, on = mm === m;
        tr.classList.toggle("pick", on);
        if (seen.has(mm)) {
          const rr = G.paintBoxes.__vals ? null : null;
          const rule = mm === "help" ? "max" : mm === "adv" ? "min" : "avg";
          const vals = BX.map((b) => boxVal(b, rule));
          const best = BX[vals.reduce((bi, v, i) => (v.cmp(vals[bi]) > 0 ? i : bi), 0)];
          tr.querySelectorAll("td").forEach((td, i) => { if (i >= 1 && i <= 3) td.textContent = fmt(vals[i - 1]); if (i === 4) td.textContent = best; });
        }
      });
      note.innerHTML = { help: "Đối thủ chọn số lớn nên hộp A có value 50.", unif: "Lấy trung bình: A = 0, B = 2, C = 5, nên chọn C.", adv: "Mỗi hộp chỉ còn số nhỏ: −50, 1, −5, nên chọn B." }[m];
    }
    set(null);
    return { step(st) { set([null, "help", "unif", "adv"][Math.min(st, 3)]); } };
  };

  // weighted average at one node: two subtrees with values v1, v2 chosen with q and 1 − q
  W.weighted = (el) => {
    const spec = { id: "r", k: "chance", v: "?", kids: [{ a: "", p: "q", n: { id: "a", k: "eval", v: "v₁" } }, { a: "", p: "1 − q", n: { id: "b", k: "eval", v: "v₂" } }] };
    const t = G.drawTree(el, spec, { w: 460, h: 250, r: 44, fs: 28, padX: 70 });
    t.e("a", "bold-chance"); t.e("b", "bold-chance");
    return {};
  };

  // S17 — the same tree, three values (static small copies)
  W.miniBoxes = (el, o) => {
    const t = G.drawTree(el, G.boxSpec(), { w: o.w || 540, h: o.h || 330, r: 34, lr: 27, fs: 23, padX: 30 });
    G.paintBoxes(t, o.mode || "exp", false);
    return {};
  };

  // S35 — compare the three methods on one tree
  W.compare3 = (el) => {
    el.style.cssText += ";display:flex;gap:44px;align-items:center;width:100%";
    const left = h("div", "tree-host"), right = h("div", "stack");
    right.style.cssText = "width:660px;flex:none;gap:22px";
    el.append(left, right);
    const t = G.drawTree(left, G.boxSpec(), { w: 1000, h: 480, r: 46, lr: 38, fs: 29 });
    const M = [["eval", "Game evaluation", "eval"], ["exp", "Expectimax", "chance"], ["mm", "Minimax", "min"]];
    const btns = h("div", "btnrow"); right.appendChild(btns);
    const tbl = h("table", "t");
    tbl.innerHTML = `<tr><th>Phương pháp</th><th>Node agent</th><th>Node đối thủ</th><th class="num">Root</th></tr>` +
      `<tr data-m="eval"><td class="h c-eval">Game eval.</td><td>theo π</td><td>trung bình</td><td class="num">0</td></tr>` +
      `<tr data-m="exp"><td class="h c-chance">Expectimax</td><td>max</td><td>trung bình</td><td class="num">5</td></tr>` +
      `<tr data-m="mm"><td class="h c-min">Minimax</td><td>max</td><td>min</td><td class="num">1</td></tr>`;
    right.appendChild(tbl);
    const note = h("p", "txt"); right.appendChild(note);
    const bm = {};
    M.forEach(([m, name, cls]) => {
      const b = h("button", `ghost ${cls}`, name);
      b.addEventListener("click", (e) => { e.stopPropagation(); set(m); b.blur(); });
      btns.appendChild(b); bm[m] = b;
    });
    function set(m) {
      Object.entries(bm).forEach(([k, b]) => b.classList.toggle("on", k === m));
      G.paintBoxes(t, m, true);
      $$("tr[data-m]", tbl).forEach((tr) => tr.classList.toggle("pick", tr.dataset.m === m));
      note.innerHTML = {
        eval: "Policy của agent cố định là chọn A, nên root lấy value của A.",
        exp: "Agent được chọn: max(0, 2, 5) = 5, đi C.",
        mm: "Đối thủ chọn số nhỏ: max(−50, 1, −5) = 1, chọn B.",
      }[m];
    }
    set("eval");
    return { step(st) { set(["eval", "exp", "mm"][Math.min(st, 2)]); } };
  };

  // S15 — policy: deterministic for the agent, stochastic for the opponent
  W.policyViz = (el) => {
    const t = G.drawTree(el, G.boxSpec("chance", "max"), { w: 1000, h: 440, r: 44, lr: 36, fs: 27 });
    function set(st) {
      t.reset();
      BX.forEach((b) => { t.v(b, ""); t.op(b, ""); [0, 1].forEach((j) => t.p(b + j, "")); t.p(b, ""); });
      t.v("r", ""); t.op("r", "");
      if (st >= 1) { t.op("r", "π(root) = A"); BX.forEach((b) => { t.p(b, b === "A" ? "1" : "0"); t.e(b, b === "A" ? "bold-max" : "dim"); }); }
      if (st >= 2) BX.forEach((b) => { t.op(b, "μ"); [0, 1].forEach((j) => { t.p(b + j, "½"); t.e(b + j, "bold-chance"); }); });
    }
    set(0);
    return { step: set };
  };

  // S21 — game evaluation with adjustable policies
  W.evalPlay = (el) => {
    el.style.cssText += ";display:flex;gap:40px;align-items:center;width:100%";
    const left = h("div", "tree-host"), right = h("div", "stack");
    right.style.cssText = "width:700px;flex:none;gap:20px";
    el.append(left, right);
    const t = G.drawTree(left, G.boxSpec("chance", "eval"), { w: 960, h: 470, r: 46, lr: 38, fs: 27 });
    const PRE = [["A", [1, 0, 0], "Luôn A"], ["B", [0, 1, 0], "Luôn B"], ["C", [0, 0, 1], "Luôn C"], ["U", [F(1, 3), F(1, 3), F(1, 3)], "Đều ⅓"]];
    right.appendChild(h("div", "cap", "<span class='c-eval'>Policy π của agent</span> tại root"));
    const pb = h("div", "btnrow"); right.appendChild(pb);
    const bm = {};
    PRE.forEach(([k, , name]) => { const b = h("button", "ghost eval", name); b.addEventListener("click", (e) => { e.stopPropagation(); setA(k); b.blur(); }); pb.appendChild(b); bm[k] = b; });
    right.appendChild(h("div", "cap", "<span class='c-chance'>Policy μ của đối thủ</span>: xác suất chọn số nhỏ"));
    const ctl = h("div", "ctl");
    const rng = h("input", "chance wide"); rng.type = "range"; rng.min = 0; rng.max = 20; rng.value = 10;
    const lab = h("span", "readout", "q = 0,5");
    ctl.append(rng, lab); right.appendChild(ctl);
    const out = h("div", "key eval"); out.style.padding = "18px 26px";
    right.appendChild(out);
    let A = "A", q = F(1, 2);
    rng.addEventListener("input", () => { q = F(+rng.value, 20); paint(true); });
    function setA(k) { A = k; Object.entries(bm).forEach(([kk, b]) => b.classList.toggle("on", kk === k)); paint(true); }
    const show = (x) => (x.d <= 3 ? fmt(x) : G.vn(x.v, 2));
    function paint(pop) {
      t.reset();
      lab.textContent = "q = " + G.vn(q.v, 2);
      const pa = PRE.find((p) => p[0] === A)[1].map((x) => F(x instanceof G.Fr ? x.n : x, x instanceof G.Fr ? x.d : 1));
      const vals = BX.map((b) => boxVal(b, { q }));
      BX.forEach((b, i) => {
        t.v(b, show(vals[i]), pop); t.op(b, "E");
        t.p(b + "0", G.vn(q.v, 2)); t.p(b + "1", G.vn(1 - q.v, 2));
        t.ew(b + "0", 2 + 9 * q.v); t.ew(b + "1", 2 + 9 * (1 - q.v));
        t.e(b + "0", "bold-chance"); t.e(b + "1", "bold-chance");
        t.p(b, pa[i].toString());
        if (pa[i].n === 0) t.e(b, "dim"); else { t.e(b, "bold"); t.ew(b, 3 + 8 * pa[i].v); }
      });
      const root = pa.reduce((s, p, i) => s.add(p.mul(vals[i])), F(0));
      t.v("r", show(root), pop); t.op("r", "π");
      out.innerHTML = `<div class="readout"><span class="lbl">Root:</span> V = ${pa.map((p, i) => `${p.toString()}·${show(vals[i])}`).join(" + ").replace(/\+ −/g, "− ")} = <b class="c-eval">${show(root)}</b></div>`;
    }
    setA("A");
    return { step(st) { if (st === 0) { rng.value = 10; q = F(1, 2); setA("A"); } if (st === 1) { rng.value = 10; q = F(1, 2); setA("U"); } } };
  };

  // S44 — the face-off table: each cell is a game evaluation of two fixed policies
  W.faceoff = (el) => {
    el.style.cssText += ";display:flex;gap:40px;align-items:center;width:100%";
    const left = h("div", "stack"), right = h("div", "tree-host");
    left.style.cssText = "width:760px;flex:none;gap:22px";
    el.append(left, right);
    const tbl = h("table", "t fo");
    tbl.innerHTML = `<tr><th style="font-size:24px">Agent \\ Đối thủ</th><th style="text-align:center"><span class="c-min">π<sub>min</sub></span><br><span style="font-size:21px">chọn số nhỏ</span></th><th style="text-align:center"><span class="c-chance">π<sub>7</sub></span><br><span style="font-size:21px">chọn đều</span></th></tr>` +
      `<tr><td class="h"><span class="c-max">π<sub>max</sub></span> <span class="c-muted" style="font-size:24px">→ B</span></td><td class="cell" data-c="0">?</td><td class="cell" data-c="1">?</td></tr>` +
      `<tr><td class="h"><span class="c-chance">π<sub>E</sub></span> <span class="c-muted" style="font-size:24px">→ C</span></td><td class="cell" data-c="2">?</td><td class="cell" data-c="3">?</td></tr>`;
    left.appendChild(tbl);
    const out = h("div", "key"); out.style.cssText = "padding:18px 24px;min-height:150px";
    left.appendChild(out);
    const t = G.drawTree(right, G.boxSpec("chance"), { w: 900, h: 450, r: 44, lr: 36, fs: 27 });
    const CELLS = [
      { a: "B", o: "min", v: "1", f: "V(π<sub>max</sub>, π<sub>min</sub>) = 1·[1·1 + 0·3] = <b>1</b>", n: "Cả hai theo Minimax, nên kết quả bằng Minimax value của game." },
      { a: "B", o: "avg", v: "2", f: "V(π<sub>max</sub>, π<sub>7</sub>) = 1·[½·1 + ½·3] = <b>2</b>", n: "Agent vẫn chọn B, chỉ đối thủ đổi sang chọn đều." },
      { a: "C", o: "min", v: "−5", f: "V(π<sub>E</sub>, π<sub>min</sub>) = 1·[1·(−5) + 0·15] = <b>−5</b>", n: "π<sub>E</sub> vẫn chọn C vì được tính cho π<sub>7</sub>, nhưng đối thủ chọn số nhỏ." },
      { a: "C", o: "avg", v: "5", f: "V(π<sub>E</sub>, π<sub>7</sub>) = 1·[½·(−5) + ½·15] = <b>5</b>", n: "π<sub>E</sub> gặp đúng đối thủ mà nó được tối ưu cho." },
    ];
    const cells = $$("td.cell", tbl);
    const shown = new Set();
    cells.forEach((c) => c.addEventListener("click", (e) => { e.stopPropagation(); sel(+c.dataset.c); }));
    function sel(i) {
      cells.forEach((c) => c.classList.toggle("sel", +c.dataset.c === i));
      t.reset();
      if (i === null) {
        BX.forEach((b) => { t.v(b, ""); t.op(b, ""); t.p(b, ""); [0, 1].forEach((j) => t.p(b + j, "")); });
        t.v("r", ""); t.op("r", "");
        out.innerHTML = `<p class="txt">Cố định policy của hàng (agent) và của cột (đối thủ), rồi tính expected utility.</p>`;
        return;
      }
      shown.add(i);
      cells.forEach((c) => { const k = +c.dataset.c; c.textContent = shown.has(k) ? CELLS[k].v : "?"; });
      const C = CELLS[i];
      BX.forEach((b) => {
        const v = boxVal(b, C.o === "min" ? "min" : "avg");
        t.k(b, C.o === "min" ? "min" : "chance");
        t.v(b, v, true); t.op(b, C.o === "min" ? "π_min" : "π₇");
        const [lo] = BOX[b];
        [0, 1].forEach((j) => {
          if (C.o === "avg") { t.p(b + j, "½"); t.e(b + j, "bold-chance"); }
          else { t.p(b + j, ""); if (j === 0) t.e(b + j, "bold-min"); else t.e(b + j, "dim"); }
        });
        t.p(b, b === C.a ? "1" : "0");
        t.e(b, b === C.a ? "bold" : "dim");
      });
      t.k("r", "max");
      t.v("r", C.v, true); t.op("r", C.a === "B" ? "π_max" : "π_E");
      t.add(C.a, "pick");
      out.innerHTML = `<div class="readout" style="font-size:29px">${C.f}</div><p class="txt" style="margin-top:8px">${C.n}</p>`;
    }
    sel(null);
    return { step(st) { if (st === 0) { shown.clear(); sel(null); } else { for (let k = 0; k < st; k++) shown.add(k); sel(Math.min(st, 4) - 1); } } };
  };

  // ------------------------------------------------------------------ generic minimax trees
  // build a spec from nested arrays: numbers are leaves; levels alternate starting with `first`
  G.nestSpec = function (arr, first = "max", names = null) {
    let id = 0;
    const flip = (k) => (k === "max" ? "min" : "max");
    function mk(x, k, label) {
      const n = { id: "n" + id++, v: "" };
      if (typeof x === "number") { n.k = "term"; n.v = x; n.u = x; }
      else { n.k = k; n.kids = x.map((c, i) => ({ a: label ? label(i, n) : "", n: mk(c, flip(k), null) })); }
      return n;
    }
    const root = mk(arr, first, names ? (i) => names[i] : null);
    return root;
  };
  G.evalSpec = function (n, mode) { // mode: mm | exp ; returns Fr, stores n.val
    if (n.k === "term") return (n.val = F(n.u));
    const vals = n.kids.map((c) => G.evalSpec(c.n, mode));
    if (n.k === "max") n.val = G.fmax(vals);
    else n.val = mode === "exp" ? G.fmean(vals) : G.fmin(vals);
    return n.val;
  };

  // S38 — step through the recursion (postorder DFS), with call stack and pseudocode
  W.stepper = (el) => {
    el.style.cssText += ";display:flex;gap:36px;align-items:flex-start;width:100%";
    const left = h("div", "stack"), right = h("div", "stack");
    left.style.cssText = "flex:1;min-width:0;gap:16px;align-items:center";
    right.style.cssText = "width:790px;flex:none;gap:16px";
    el.append(left, right);
    const host = h("div", "tree-host"); left.appendChild(host);
    const ctl = h("div", "btnrow"); left.appendChild(ctl);
    const code = h("pre", "code sm"); code.style.fontSize = "25px";
    right.appendChild(code);
    const stackEl = h("div", "stackpanel"); right.appendChild(stackEl);
    let leaves = [3, 5, 4, 6, 7, 6, -2, 20, 12];
    let mode = "mm", t, spec, events = [], ev = 0, timer = null;
    const mk = (txt, cls, fn) => { const b = h("button", cls, txt); b.addEventListener("click", (e) => { e.stopPropagation(); fn(); b.blur(); }); ctl.appendChild(b); return b; };
    const bMM = mk("Minimax: min", "ghost min", () => setMode("mm"));
    const bEX = mk("Expectimax: trung bình", "ghost chance", () => setMode("exp"));
    mk("Bước tiếp", "act", () => { stop(); fwd(); });
    mk("Chạy hết", "ghost", () => runAll());
    mk("Làm lại", "ghost", () => { stop(); build(); });
    mk("Đổi leaf ngẫu nhiên", "ghost", () => { stop(); leaves = leaves.map(() => Math.round(Math.random() * 30 - 8)); build(); });
    const LINES = (m) => [
      `<span class="k">def</span> <span class="f">value</span>(s):`,
      `    <span class="k">if</span> IsEnd(s): <span class="k">return</span> Utility(s)`,
      `    vals = [<span class="f">value</span>(Succ(s,a)) <span class="k">for</span> a <span class="k">in</span> Actions(s)]`,
      `    <span class="k">if</span> Player(s) == agent: <span class="k">return</span> <span class="f">max</span>(vals)`,
      m === "mm" ? `    <span class="k">return</span> <span class="f diff2">min</span>(vals)          <span class="m"># Minimax</span>` : `    <span class="k">return</span> <span class="f diff">sum(μ(s,a)·v)</span>     <span class="m"># Expectimax</span>`,
    ];
    function paintCode(line) {
      code.innerHTML = LINES(mode).map((l, i) => (i === line ? `<span class="hl">${l}</span>` : l)).join("\n");
    }
    function build() {
      host.innerHTML = "";
      spec = G.nestSpec([leaves.slice(0, 3), leaves.slice(3, 6), leaves.slice(6, 9)], "max", ["A", "B", "C"]);
      spec.kids.forEach((c) => { if (mode === "exp") c.n.k = "chance"; });
      t = G.drawTree(host, spec, { w: 920, h: 440, r: 44, lr: 34, fs: 27 });
      G.evalSpec(spec, mode);
      events = [];
      (function walk(n, stack) {
        const st = [...stack, n];
        events.push({ type: "call", n, st });
        if (n.k === "term") { events.push({ type: "ret", n, st }); return; }
        n.kids.forEach((c) => walk(c.n, st));
        events.push({ type: "agg", n, st });
      })(spec, []);
      ev = 0;
      t.all.forEach((n) => { if (n.k !== "term") t.v(n.id, ""); else t.add(n.id, "ghost"); });
      paintCode(-1);
      stackEl.innerHTML = `<div class="top">Bấm Bước tiếp để gọi value(root)</div>`;
    }
    function fwd() {
      if (ev >= events.length) return false;
      const E = events[ev++];
      t.all.forEach((n) => t.rm(n.id, "cur"));
      t.add(E.n.id, "cur");
      if (E.n.parent) t.e(E.n.id, "hot");
      const name = (n) => (n === spec ? "root" : n.edge && n.edge.a ? n.edge.a : n.k === "term" ? `leaf ${fmt(n.u)}` : "…");
      const partial = (n) => n.kids ? n.kids.filter((c) => c.n._done).map((c) => fmt(c.n.val)) : [];
      if (E.type === "call") { paintCode(0); }
      if (E.type === "ret") { E.n._done = true; t.rm(E.n.id, "ghost"); G.pop(t.nodes[E.n.id].v); paintCode(1); }
      if (E.type === "agg") {
        E.n._done = true; t.v(E.n.id, E.n.val, true);
        paintCode(E.n.k === "max" ? 3 : 4);
        if (E.n.kids) {
          const best = E.n.kids.find((c) => c.n.val.eq(E.n.val));
          E.n.kids.forEach((c) => { t.erm(c.n.id, "hot"); if (E.n.k === "max" && c === best) t.e(c.n.id, "bold"); else if (E.n.k === "min" && c === best) t.e(c.n.id, "bold-min"); else if (E.n.k === "chance") t.e(c.n.id, "bold-chance"); });
        }
      }
      stackEl.innerHTML = E.st.map((n, i) => {
        const vs = partial(n);
        const tail = n.k === "term" ? (E.type === "ret" && i === E.st.length - 1 ? ` → <b>${fmt(n.u)}</b>` : "") : `  vals = [${vs.join(", ")}]` + (E.type === "agg" && n === E.n ? ` → <b>${fmt(n.val)}</b>` : "");
        return `<div class="${i === E.st.length - 1 ? "top" : ""}">value(${name(n)})${tail}</div>`;
      }).join("");
      if (ev >= events.length) stackEl.innerHTML += `<div>Xong: root = <b>${fmt(spec.val)}</b>, chọn <b>${spec.kids.find((c) => c.n.val.eq(spec.val)).a}</b></div>`;
      return true;
    }
    function stop() { clearInterval(timer); timer = null; }
    function runAll() { stop(); timer = setInterval(() => { if (!fwd()) stop(); }, 420); }
    function setMode(m) { stop(); mode = m; bMM.classList.toggle("on", m === "mm"); bEX.classList.toggle("on", m === "exp"); build(); }
    setMode("mm");
    return {
      step(st) { if (st === 0) setMode("mm"); if (st === 1) { setMode("mm"); runAll(); } if (st === 2) { setMode("exp"); runAll(); } },
      leave: stop,
    };
  };

  // S47 — the guarantee: agent keeps π_max, opponent does anything; the minimax value never drops
  W.guarantee = (el) => {
    el.style.cssText += ";display:flex;gap:36px;align-items:center;width:100%";
    const left = h("div", "stack"), right = h("div", "stack");
    left.style.cssText = "flex:1;min-width:0;gap:16px;align-items:center";
    right.style.cssText = "width:560px;flex:none;gap:18px";
    el.append(left, right);
    const host = h("div", "tree-host"); left.appendChild(host);
    const ctl = h("div", "btnrow"); left.appendChild(ctl);
    const L = [[[[3, 9], [-2, 6]], [[8, 1], [4, 7]]], [[[-5, 12], [2, 0]], [[10, -1], [5, 11]]]];
    const spec = G.nestSpec(L, "max");
    G.evalSpec(spec, "mm");
    const t = G.drawTree(host, spec, { w: 1130, h: 470, r: 30, lr: 26, fs: 22, padX: 30 });
    t.all.forEach((n) => t.v(n.id, n.val));
    const chain = h("div", "readout"); chain.style.cssText = "font-size:30px;min-height:110px";
    const note = h("p", "txt");
    right.append(h("div", "cap", "Minimax value dọc đường chơi"), chain, note);
    let busy = false, path = [], runId = 0;
    function cancel() { runId++; busy = false; }
    const mk = (txt, cls, fn) => { const b = h("button", cls, txt); b.addEventListener("click", (e) => { e.stopPropagation(); fn(); b.blur(); }); ctl.appendChild(b); return b; };
    mk("Đối thủ chơi ngẫu nhiên", "act", () => play("rand"));
    mk("Đối thủ chơi tối ưu", "ghost min", () => play("opt"));
    mk("Agent đi sai một nước", "ghost", () => play("slip"));
    function clear() { t.reset(); path = []; chain.innerHTML = ""; }
    async function play(kind) {
      if (busy) return; busy = true; clear();
      const run = ++runId;
      let n = spec, slipped = false;
      path.push(n); t.add(n.id, "cur"); paintChain(false);
      while (n.kids) {
        await G.sleep(650);
        if (run !== runId) return;
        let c;
        if (n.k === "max") {
          const best = n.kids.find((k) => k.n.val.eq(n.val));
          c = best;
          if (kind === "slip" && !slipped && n.d === 2) { const worse = n.kids.find((k) => k !== best); if (worse) { c = worse; slipped = true; } }
        } else c = kind === "opt" ? n.kids.find((k) => k.n.val.eq(n.val)) : n.kids[Math.floor(Math.random() * n.kids.length)];
        t.rm(n.id, "cur");
        t.e(c.n.id, n.k === "max" ? (slipped && c.n.val.cmp(n.val) < 0 ? "hot" : "bold-max") : "bold-min");
        n = c.n; path.push(n); t.add(n.id, "cur");
        paintChain(slipped);
      }
      const ok = path[path.length - 1].val.cmp(spec.val) >= 0;
      note.innerHTML = kind === "slip"
        ? `Agent rời policy ở tầng MAX thứ hai: value có thể <span class="c-loss">giảm</span> và lower bound ${fmt(spec.val)} không còn.`
        : `Utility cuối là ${fmt(path[path.length - 1].val)} ${ok ? "≥" : "<"} V(root) = ${fmt(spec.val)}. Value không giảm ở bước nào.`;
      busy = false;
    }
    function paintChain(slipped) {
      chain.innerHTML = path.map((n, i) => {
        const dropped = i > 0 && n.val.cmp(path[i - 1].val) < 0;
        const lbl = n.k === "term" ? "U" : n.k === "max" ? "▲" : "▼";
        return `<span class="${dropped ? "c-loss" : i === path.length - 1 ? "c-win" : ""}">${lbl}${fmt(n.val)}</span>`;
      }).join(` <span class="c-muted">→</span> `);
    }
    const intro = "Bấm một nút để chơi thử. Agent theo π<sub>max</sub> (edge xanh), đối thủ chọn tùy ý (edge hồng).";
    note.innerHTML = intro;
    return {
      step(st) {
        cancel();
        if (st === 0) { clear(); note.innerHTML = intro; }
        if (st === 1) play("rand");
        if (st === 2) play("slip");
      },
      leave: cancel,
    };
  };

  // quiz 5 (CS188 Lecture 7, p.18): values hidden until the answer step
  W.quizTree = (el) => {
    const spec = G.nestSpec([[3, 12, 8], [2, 4, 6], [14, 5, 2]], "max");
    G.evalSpec(spec, "mm");
    const t = G.drawTree(el, spec, { w: 600, h: 400, r: 38, lr: 26, fs: 23, padX: 30 });
    return {
      step(st) {
        t.reset();
        t.all.forEach((n) => { if (n.k !== "term") t.v(n.id, st >= 2 ? n.val : "?", st >= 2); });
        if (st >= 2) {
          spec.kids.forEach((c) => { const m = c.n.kids.find((k) => k.n.val.eq(c.n.val)); t.e(m.n.id, "bold-min"); });
          t.e(spec.kids[0].n.id, "bold"); t.add(spec.kids[0].n.id, "pick");
        }
      },
    };
  };
})();
