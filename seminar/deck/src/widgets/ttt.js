/* Tic-tac-toe widgets and the two small diagrams of the Overview/Modeling acts. Values are computed live
   by G.tttMinimax / G.tttExpectimax (exact fractions, X = agent, O = opponent). */
(function () {
  "use strict";
  const { h, sv, F, fmt, $, $$ } = G;

  // ------------------------------------------------------------------ S11: model tic-tac-toe, six components live
  W.tttModel = (el) => {
    el.style.cssText += ";display:flex;gap:36px;align-items:center;width:100%";
    const left = h("div", ""); left.style.cssText = "flex:1;min-width:0";
    const right = h("div", "stack"); right.style.cssText = "width:650px;flex:none;gap:12px";
    el.append(left, right);
    const A = G.arena(left, { h: 560, unit: 6, coins: false, left: { name: "X", sub: "agent · +1", char: "robot", team: "max" }, right: { name: "O", sub: "đối thủ · −1", char: "human", team: "min" } });
    const bd = h("div", "board lg"); A.C.appendChild(bd);
    const info = h("div", "plog", "&nbsp;"); A.C.appendChild(info);
    const tbl = h("table", "t model");
    tbl.innerHTML = [
      ["Player(s)", "pl"], ["Actions(s)", "ac"], ["Succ(s, a)", "su"], ["IsEnd(s)", "ie"], ["Utility(s)", "ut"],
    ].map(([k, id]) => `<tr><td class="h mono" style="width:220px">${k}</td><td data-k="${id}"></td></tr>`).join("");
    right.appendChild(h("div", "cap", "State s gồm bàn cờ và player đến lượt"));
    right.appendChild(tbl);
    const ctl = h("div", "btnrow"); right.appendChild(ctl);
    const mk = (t, cls, f) => { const b = h("button", cls, t); b.addEventListener("click", (e) => { e.stopPropagation(); f(); b.blur(); }); ctl.appendChild(b); };
    let b = ".........", turn = "X", hist = [];
    mk("Ván mới", "ghost", () => load(".........", "X"));
    mk("Lùi", "ghost", () => { if (hist.length) { const x = hist.pop(); b = x[0]; turn = x[1]; paint(); } });
    const cell = (k) => $(`td[data-k="${k}"]`, tbl);
    function paint(hover) {
      const end = G.tttEnd(b), w = G.winner(b), acts = G.tttActions(b);
      const hl = {};
      if (w) w.line.forEach((i) => (hl[i] = w.p === "X" ? "line" : "oline"));
      else if (!end) acts.forEach((i) => (hl[i] = "legal"));
      if (hover !== undefined && !end && b[hover] === ".") hl[hover] = "new";
      const qs = G.renderBoard(bd, hover !== undefined && !end && b[hover] === "." ? G.tttSucc(b, hover, turn) : b, hl, true);
      qs.forEach((q, i) => {
        q.addEventListener("click", (e) => { e.stopPropagation(); move(i); });
        q.addEventListener("mouseenter", () => { if (b[i] === "." && !end) paint(i); });
        q.addEventListener("mouseleave", () => { if (hover !== undefined) paint(); });
      });
      cell("pl").innerHTML = end ? `<span class="c-muted">không có (ván đã kết thúc)</span>` : `<b class="${turn === "X" ? "c-max" : "c-min"}">${turn}</b>`;
      cell("ac").innerHTML = end ? `∅ <span class="c-muted">vì IsEnd(s) đúng</span>` : `{ ${acts.join(", ")} }`;
      cell("su").innerHTML = hover !== undefined && !end && b[hover] === "." ? `đặt ${turn} vào ô ${hover}, rồi đổi lượt` : `<span class="c-muted">rê chuột lên một ô trống</span>`;
      cell("ie").innerHTML = end ? `<b class="c-cur">true</b>` + (w && b.includes(".") ? ` <span class="c-muted">(vẫn còn ô trống)</span>` : "") : "false";
      const u = G.tttU(b);
      cell("ut").innerHTML = end ? `<b class="${u > 0 ? "c-win" : u < 0 ? "c-loss" : "c-draw"}">${u > 0 ? "+1 · X thắng" : u < 0 ? "−1 · O thắng" : "0 · hòa"}</b>` : `<span class="c-muted">chỉ có ở terminal state</span>`;
      info.innerHTML = end ? (w ? `${w.p} thắng` : "Hòa") : `${turn} đến lượt`;
      if (end) { if (u > 0) { A.left.cheer(); A.right.mood("sad"); } else if (u < 0) { A.right.cheer(); A.left.mood("sad"); } else { A.left.set("idle", "normal"); A.right.set("idle", "normal"); } A.left.lower(); A.right.lower(); }
      else if (hover === undefined) {
        if (turn === "X") { A.right.lower().set("idle", "normal"); A.left.raise("X").mood("think"); }
        else { A.left.lower().set("idle", "normal"); A.right.raise("O").mood("think"); }
      }
    }
    function move(i) { if (G.tttEnd(b) || b[i] !== ".") return; hist.push([b, turn]); b = G.tttSucc(b, i, turn); turn = turn === "X" ? "O" : "X"; paint(); }
    function load(bb, t) { b = bb; turn = t; hist = []; paint(); }
    load(".........", "X");
    return { step(st) { if (st === 0) load(".........", "X"); if (st === 1) load("X...O....", "X"); if (st === 2) load("XXX.OO...", "O"); } };
  };

  // ------------------------------------------------------------------ boards on a canvas with connectors
  function boardAt(stage, b, x, y, size = "xs", hl = "", cap = "") {
    const wrap = h("div", "bwrap"); wrap.style.cssText = `position:absolute;left:${x}px;top:${y}px`;
    const bd = h("div", "board " + size); G.renderBoard(bd, b, G.parseHl(hl));
    wrap.appendChild(bd);
    if (cap) wrap.appendChild(h("div", "boardcap", cap));
    stage.appendChild(wrap);
    return wrap;
  }
  function link(svg, x1, y1, x2, y2, label, cls = "") {
    const g = sv("g", { class: "lk " + cls });
    g.appendChild(sv("line", { x1, y1, x2, y2 }));
    if (label) g.appendChild(sv("text", { x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 10, "text-anchor": "middle" }, label));
    svg.appendChild(g); return g;
  }

  // S4 — a plan is one history; a policy answers every reply
  W.planBreak = (el) => {
    const Wd = 1250, Ht = 640;
    const stage = h("div", "dstage"); stage.style.cssText = `position:relative;width:${Wd}px;height:${Ht}px;margin:0 auto`;
    const svg = sv("svg", { width: Wd, height: Ht, class: "links" }); stage.appendChild(svg);
    el.appendChild(stage);
    const BW = 150, cx = [40, 500, 960], ry = [56, 256, 456];
    [["Agent đã đi", 0], ["Đối thủ phản ứng", 1], ["Agent đi tiếp", 2]].forEach(([t, i]) => { const c = h("div", "colhead", t); c.style.left = cx[i] - 40 + "px"; c.style.width = BW + 80 + "px"; stage.appendChild(c); });
    boardAt(stage, "X........", cx[0], ry[1], "xs", "0:new", "X0");
    const O = [["X...O....", "4:new", "O4"], ["XO.......", "1:new", "O1"], ["X.......O", "8:new", "O8"]];
    const X = [["X.X.O....", "2:new", "X2"], ["XO..X....", "4:new", "X4"], ["X.X.....O", "2:new", "X2"]];
    const l1 = O.map((o, i) => link(svg, cx[0] + BW, ry[1] + 75, cx[1], ry[i] + 75, o[2], i === 0 ? "plan" : "alt"));
    const bo = O.map((o, i) => boardAt(stage, o[0], cx[1], ry[i], "xs", o[1]));
    const l2 = X.map((x, i) => link(svg, cx[1] + BW, ry[i] + 75, cx[2], ry[i] + 75, x[2], i === 0 ? "plan" : "pol"));
    const bx = X.map((x, i) => boardAt(stage, x[0], cx[2], ry[i], "xs", x[1]));
    const q = [1, 2].map((i) => { const d = h("div", "qmark", "?"); d.style.cssText = `position:absolute;left:${cx[2] + 40}px;top:${ry[i] + 20}px`; stage.appendChild(d); return d; });
    const more = h("div", "cap", "… và 5 phản ứng khác của O"); more.style.cssText = `position:absolute;left:${cx[1] - 60}px;top:${Ht - 34}px;width:300px;text-align:center`; stage.appendChild(more);
    function set(st) {
      [1, 2].forEach((i) => { bo[i].style.opacity = st >= 1 ? 1 : 0.15; l1[i].style.opacity = st >= 1 ? 1 : 0.15; });
      [1, 2].forEach((i, k) => { bx[i].style.opacity = st >= 2 ? 1 : 0; l2[i].style.opacity = st >= 2 ? 1 : 0; q[k].style.opacity = st === 1 ? 1 : 0; });
      more.style.opacity = st >= 1 ? 1 : 0;
      if (st === 1) q.forEach((d) => G.pop(d));
      if (st === 2) bx.slice(1).forEach((d) => G.pop(d));
    }
    set(0);
    return { step: set };
  };

  // S13 — two histories, one state
  W.treeVsGraph = (el) => {
    el.style.cssText += ";display:grid;grid-template-columns:1fr 1fr;gap:40px;width:100%";
    const BW = 150;
    function panel(title, merge) {
      const p = h("div", "card"); p.style.cssText = "padding:18px 22px";
      p.appendChild(h("h3", "", title));
      const Wd = 790, Ht = 470;
      const stage = h("div", ""); stage.style.cssText = `position:relative;width:${Wd}px;height:${Ht}px`;
      const svg = sv("svg", { width: Wd, height: Ht, class: "links" }); stage.appendChild(svg);
      p.appendChild(stage);
      const x = [0, 210, 420, 630], y = [20, 260];
      boardAt(stage, ".........", x[0], 140, "xs");
      const H1 = [["X........", "0:new"], ["X...O....", "4:new"], ["X.X.O....", "2:new"]];
      const H2 = [["..X......", "2:new"], ["..X.O....", "4:new"], ["X.X.O....", "0:new"]];
      const parts = [];
      [H1, H2].forEach((Hh, r) => {
        let px = x[0] + BW, py = 140 + 75;
        Hh.forEach((bh, k) => {
          const last = k === 2;
          const ty = merge && last ? 140 : y[r];
          if (merge && last && r === 1) { parts.push(link(svg, px, py, x[3], 140 + 75, ["X2", "O4", "X0"][k], "m2")); return; }
          parts.push(link(svg, px, py, x[k + 1], ty + 75, (r ? ["X2", "O4", "X0"] : ["X0", "O4", "X2"])[k], r ? "m2" : "m1"));
          const w = boardAt(stage, bh[0], x[k + 1], ty, "xs", last ? "0:same,2:same" : bh[1], last ? (merge ? "một state duy nhất" : `node ${r + 1}`) : "");
          parts.push(w);
          px = x[k + 1] + BW; py = ty + 75;
        });
      });
      return { p, parts };
    }
    const A = panel("Game tree: hai node", false), B = panel("State-space graph: một node", true);
    el.append(A.p, B.p);
    function set(st) { B.p.style.opacity = st >= 1 ? 1 : 0.12; }
    set(0);
    return { step: set };
  };

  // S50/S51 — value of every legal move on a position, for both algorithms
  W.tttValues = (el, o) => {
    el.style.cssText += ";display:flex;gap:44px;align-items:center;width:100%";
    const left = h("div", "stack"); left.style.cssText = "align-items:center;gap:16px;flex:none";
    const right = h("div", "stack"); right.style.cssText = "flex:1;min-width:0;gap:16px";
    el.append(left, right);
    const bd = h("div", "board lg"); left.appendChild(bd);
    left.appendChild(h("div", "boardcap", o.cap || "X đến lượt · O đi trước"));
    const ctl = h("div", "btnrow"); right.appendChild(ctl);
    const tbl = h("table", "t big cells"); right.appendChild(tbl);
    const note = h("p", "txt"); right.appendChild(note);
    const b = o.board, acts = G.tttActions(b);
    const mm = {}, ex = {};
    acts.forEach((a) => { const s = G.tttSucc(b, a, "X"); mm[a] = G.tttMinimax(s, "O"); ex[a] = G.tttExpectimax(s, "O"); });
    const mmBest = Math.max(...acts.map((a) => mm[a])), exBest = G.fmax(acts.map((a) => ex[a]));
    tbl.innerHTML = `<tr><th>Nước X</th>${acts.map((a) => `<th>X${a}</th>`).join("")}</tr>` +
      `<tr data-m="mm"><td class="h c-min" style="text-align:left">Minimax</td>${acts.map((a) => `<td class="num ${mm[a] === mmBest ? "win" : ""}">${fmt(mm[a])}</td>`).join("")}</tr>` +
      `<tr data-m="ex"><td class="h c-chance" style="text-align:left">Expectimax<br><span style="font-size:22px;font-weight:400">O chọn đều</span></td>${acts.map((a) => `<td class="num ${ex[a].eq(exBest) ? "win" : ""}">${fmt(ex[a])}</td>`).join("")}</tr>`;
    let mode = "mm";
    const bm = {};
    [["mm", "Minimax value", "min"], ["ex", "Expectimax value", "chance"]].forEach(([k, t, cls]) => { const btn = h("button", "ghost " + cls, t); btn.addEventListener("click", (e) => { e.stopPropagation(); set(k); btn.blur(); }); ctl.appendChild(btn); bm[k] = btn; });
    function set(m) {
      mode = m; Object.entries(bm).forEach(([k, btn]) => btn.classList.toggle("on", k === m));
      $$("tr[data-m]", tbl).forEach((tr) => tr.classList.toggle(m === "mm" ? "pick-min" : "pick-chance", tr.dataset.m === m));
      $$("tr[data-m]", tbl).forEach((tr) => { if (tr.dataset.m !== m) tr.classList.remove("pick-min", "pick-chance"); });
      const hl = {};
      acts.forEach((a) => (hl[a] = (m === "mm" ? mm[a] === mmBest : ex[a].eq(exBest)) ? "good" : (m === "mm" && mm[a] < 0 ? "threat" : "")));
      const qs = G.renderBoard(bd, b, hl, true);
      acts.forEach((a) => { const v = h("span", "val " + (m === "mm" ? (mm[a] > 0 ? "c-win" : mm[a] < 0 ? "c-loss" : "c-draw") : "c-chance"), fmt(m === "mm" ? mm[a] : ex[a])); qs[a].appendChild(v); G.pop(v); });
      note.innerHTML = (o.notes || {})[m] || "";
    }
    set("mm");
    return { step(st) { set(st >= 1 ? "ex" : "mm"); } };
  };

  // S3 — single-agent search: fewest edges is not cheapest
  W.planGraph = (el) => {
    const Wd = 1150, Ht = 470;
    const svg = sv("svg", { width: Wd, height: Ht, class: "pg" });
    el.appendChild(svg);
    const N = { s: [110, 235, "s₀"], m: [575, 70, "u"], a: [420, 400, "a"], b: [730, 400, "b"], g: [1040, 235, "G"] };
    const E = [["s", "m", 9, "p1"], ["m", "g", 9, "p1"], ["s", "a", 1, "p2"], ["a", "b", 1, "p2"], ["b", "g", 1, "p2"]];
    const eg = {};
    E.forEach(([u, v, c, p]) => {
      const [x1, y1] = N[u], [x2, y2] = N[v];
      const g = sv("g", { class: "pe " + p });
      g.appendChild(sv("line", { x1, y1, x2, y2 }));
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      g.appendChild(sv("circle", { cx: mx, cy: my, r: 26, class: "cbg" }));
      g.appendChild(sv("text", { x: mx, y: my + 1, "text-anchor": "middle", "dominant-baseline": "central" }, c));
      svg.appendChild(g); eg[u + v] = g;
    });
    Object.entries(N).forEach(([k, [x, y, lab]]) => {
      const g = sv("g", { class: "pn " + (k === "s" ? "start" : k === "g" ? "goal" : "") });
      g.appendChild(sv("circle", { cx: x, cy: y, r: 46 }));
      g.appendChild(sv("text", { x, y: y + 2, "text-anchor": "middle", "dominant-baseline": "central" }, lab));
      svg.appendChild(g);
    });
    const tag1 = sv("text", { x: 575, y: 175, class: "ptag p1t", "text-anchor": "middle" }, "2 edge · cost 9 + 9 = 18");
    const tag2 = sv("text", { x: 575, y: 462, class: "ptag p2t", "text-anchor": "middle" }, "3 edge · cost 1 + 1 + 1 = 3");
    svg.append(tag1, tag2);
    function set(st) {
      $$(".pe.p1", svg).forEach((g) => g.classList.toggle("on1", st >= 1));
      $$(".pe.p2", svg).forEach((g) => g.classList.toggle("on2", st >= 2));
      tag1.style.opacity = st >= 1 ? 1 : 0; tag2.style.opacity = st >= 2 ? 1 : 0;
    }
    set(0);
    return { step: set };
  };
})();
