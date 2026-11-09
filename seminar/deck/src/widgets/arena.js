/* Pixel "game show" arena: original pixel characters (manim/sprites.py → window.SPRITES), a split
   blue/pink stage with a yellow centre board, signs the players raise, round-by-round scoreboards. */
(function () {
  "use strict";
  const { h, sv, F, fmt, $, $$ } = G;
  const S = () => window.SPRITES;
  const px = (s) => String(s).replace(/−/g, "-");   // the pixel font has ASCII minus only
  G.px = px;
  const TEAM = {
    max: { A: "#1C7ED6", a: "#74C0FC", O: "#1C7ED6", o: "#74C0FC" },
    min: { A: "#D6336C", a: "#FAA2C1", O: "#D6336C", o: "#FAA2C1" },
  };

  // one frame as crisp SVG rects (run-length per row); team recolours the A/a/O/o keys
  G.spriteSVG = function (key, unit, team) {
    const sp = S(), rows = sp.frames[key], pal = Object.assign({}, sp.palette, team ? TEAM[team] : {});
    const svg = sv("svg", { width: sp.w * unit, height: sp.h * unit, viewBox: `0 0 ${sp.w} ${sp.h}`, "shape-rendering": "crispEdges", class: "sprite" });
    rows.forEach((row, y) => {
      let x = 0;
      while (x < row.length) {
        const c = row[x]; let e = x + 1;
        while (e < row.length && row[e] === c) e++;
        if (c !== ".") svg.appendChild(sv("rect", { x, y, width: e - x, height: 1, fill: pal[c] }));
        x = e;
      }
    });
    return svg;
  };

  // a player: sprite + name plate + a sign on a stick held towards the centre
  // o: {char: robot|human, team: max|min, side: L|R, unit, name, sub}
  G.player = function (host, o) {
    const unit = o.unit || 8, ch = o.char === "human" ? "opp" : "agent";
    const towards = o.side === "R" ? "raiseL" : "raiseR";
    const el = h("div", "player " + (o.team || "max"));
    const fig = h("div", "fig"); fig.style.width = 28 * unit + "px"; fig.style.height = 32 * unit + "px";
    const sign = h("div", "sign");
    const stick = h("div", "stick");
    sign.appendChild(stick);
    fig.appendChild(sign);
    el.appendChild(fig);
    if (o.name) el.appendChild(h("div", "pname", o.name));
    const sub = h("div", "psub", o.sub || "");
    el.appendChild(sub);
    host.appendChild(el);
    let pose = "idle", mood = "normal";
    const anc = S().anchors[towards];
    function draw() {
      const old = $("svg.sprite", fig); if (old) old.remove();
      fig.insertBefore(G.spriteSVG(`${ch}_${pose}_${mood}`, unit, o.team), sign);
    }
    function place() { // sign bottom sits 7 units above the hand
      sign.style.left = anc[0] * unit + "px";
      sign.style.top = (anc[1] - 7) * unit + "px";
      stick.style.height = 7 * unit + "px";
    }
    draw(); place();
    const api = {
      el, fig, sub,
      set(p, m) { if (p) pose = p; if (m) mood = m; draw(); return api; },
      mood(m) { mood = m; draw(); return api; },
      say(t) { sub.innerHTML = t; return api; },
      raise(text, cls) {
        pose = towards; draw();
        sign.firstChild.nodeType === 3 && sign.firstChild.remove();
        $$(".lbl", sign).forEach((x) => x.remove());
        const l = h("span", "lbl" + (cls ? " " + cls : ""), px(text)); sign.insertBefore(l, stick);
        sign.classList.add("up");
        if (window.gsap) gsap.fromTo(sign, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(2.2)" });
        return api;
      },
      lower() { sign.classList.remove("up"); if (pose === towards) { pose = "idle"; draw(); } return api; },
      cheer() { pose = "cheer"; mood = "happy"; draw(); api.jump(); return api; },
      jump() { if (window.gsap) gsap.fromTo(fig, { y: 0 }, { y: -unit * 3, duration: 0.18, yoyo: true, repeat: 3, ease: "power1.out" }); return api; },
      shake() { if (window.gsap) gsap.fromTo(fig, { x: -unit }, { x: 0, duration: 0.4, ease: "elastic.out(1,0.3)" }); return api; },
    };
    return api;
  };

  // the stage: [left player] [centre board] [right player]
  G.arena = function (el, o = {}) {
    const ar = h("div", "arena");
    if (o.h) ar.style.height = o.h + "px";
    const L = h("div", "wing L"), C = h("div", "board-panel"), R = h("div", "wing R");
    ar.append(L, C, R);
    if (o.coins !== false) {
      const cl = h("div", "coins L", `<i></i><span>0</span>`), cr = h("div", "coins R", `<span>0</span><i></i>`);
      ar.append(cl, cr);
      ar._coins = [cl, cr];
    }
    el.appendChild(ar);
    const left = G.player(L, Object.assign({ side: "L", team: "max", char: "robot", unit: o.unit }, o.left || {}));
    const right = G.player(R, Object.assign({ side: "R", team: "min", char: "human", unit: o.unit }, o.right || {}));
    const coins = (i, v) => { if (!ar._coins) return; const s = $("span", ar._coins[i]); s.textContent = px(v); G.pop(s); };
    return { ar, L, C, R, left, right, coins };
  };

  // ------------------------------------------------------------------ S2: who decides what
  W.arenaIntro = (el) => {
    const A = G.arena(el, { h: 560, coins: false, left: { name: "AGENT", sub: "Chọn action ở lượt mình<br>để utility cao nhất" }, right: { name: "ĐỐI THỦ", sub: "Chọn action ở<br>các lượt còn lại" } });
    A.C.innerHTML = `<div class="ptitle">LƯỢT CHƠI</div><div class="turns"><span class="t max">AGENT</span><span class="ar">→</span><span class="t min">ĐỐI THỦ</span><span class="ar">→</span><span class="t max">AGENT</span><span class="ar">→</span><span class="t end">TERMINAL</span></div><div class="pq">Chọn action nào khi<br>không điều khiển<br>được mọi lượt?</div>`;
    return {
      step(st) {
        A.left.lower().mood("normal"); A.right.lower().mood("normal");
        if (st >= 1) A.left.raise("?").mood("think");
        if (st >= 2) A.right.raise("!").mood("happy");
      },
    };
  };

  // both players hold up a sign; o: {l, r, center, ls, rs, lname, rname}
  W.arenaSigns = (el, o) => {
    const A = G.arena(el, { h: o.h || 560, unit: o.unit || 7, coins: false, left: { name: o.lname || "AGENT", sub: o.ls || "" }, right: { name: o.rname || "ĐỐI THỦ", sub: o.rs || "" } });
    A.C.style.minWidth = (o.cmin || 380) + "px";
    A.C.innerHTML = `<div class="ptitle" style="font-size:${o.cfs || 72}px">${o.center || ""}</div>`;
    return { enter() { A.left.raise(o.l || "?"); A.right.raise(o.r || "?"); } };
  };

  // ------------------------------------------------------------------ S5: the three-box game, playable
  W.boxGame = (el) => {
    el.style.cssText += ";display:flex;flex-direction:column;gap:18px;width:100%";
    const A = G.arena(el, { h: 560, left: { name: "AGENT", sub: "Chọn một hộp" }, right: { name: "ĐỐI THỦ", sub: "" } });
    A.C.innerHTML = `<div class="ptitle">BA HỘP SỐ</div>`;
    const row = h("div", "chests"); A.C.appendChild(row);
    const chest = {};
    G.BOXES.forEach((b) => {
      const c = h("div", "chest", `<div class="lid"></div><div class="lt">${b}</div><div class="nums"><span>?</span><span>?</span></div>`);
      c.addEventListener("click", (e) => { e.stopPropagation(); play(b); });
      row.appendChild(c); chest[b] = c;
    });
    const log = h("div", "plog", "&nbsp;"); A.C.appendChild(log);
    const ctl = h("div", "ctl"); el.appendChild(ctl);
    ctl.appendChild(h("span", "", "Đối thủ:"));
    const P = [["help", "Chọn số lớn", "max"], ["rand", "Chọn ngẫu nhiên", "chance"], ["adv", "Chọn số nhỏ", "min"]];
    const pb = {};
    P.forEach(([k, name, cls]) => { const b = h("button", "ghost " + cls, name); b.addEventListener("click", (e) => { e.stopPropagation(); setP(k); b.blur(); }); ctl.appendChild(b); pb[k] = b; });
    const sc = h("span", "readout", ""); sc.style.marginLeft = "auto"; ctl.appendChild(sc);
    let pers = "adv", total = 0, rounds = 0, busy = false, runId = 0;
    function cancel() { runId++; busy = false; }
    function setP(k) {
      pers = k; Object.entries(pb).forEach(([kk, b]) => b.classList.toggle("on", kk === k));
      A.right.say({ help: "Chọn số <b>lớn</b>", rand: "Chọn <b>ngẫu nhiên</b>", adv: "Chọn số <b>nhỏ</b>" }[k]);
    }
    function reset() {
      total = 0; rounds = 0; A.coins(0, 0); A.coins(1, 0);
      G.BOXES.forEach((b) => { chest[b].className = "chest"; $$(".nums span", chest[b]).forEach((s) => { s.textContent = "?"; s.className = ""; }); });
      A.left.lower().mood("normal"); A.right.lower().mood("normal");
      log.innerHTML = "Bấm một hộp để chơi"; sc.textContent = "";
    }
    async function play(b, forced) {
      if (busy) return; busy = true;
      const run = ++runId;
      G.BOXES.forEach((x) => { chest[x].className = "chest"; $$(".nums span", chest[x]).forEach((s) => { s.textContent = "?"; s.className = ""; }); });
      A.right.lower().mood("normal");
      A.left.raise(b).mood("think");
      chest[b].classList.add("pick");
      await G.sleep(500);
      if (run !== runId) return;
      const [lo, hi] = G.BOX[b];
      chest[b].classList.add("open");
      const sp = $$(".nums span", chest[b]);
      sp[0].textContent = px(fmt(lo)); sp[1].textContent = px(fmt(hi));
      await G.sleep(650);
      if (run !== runId) return;
      const j = forced !== undefined ? forced : pers === "help" ? 1 : pers === "adv" ? 0 : Math.random() < 0.5 ? 0 : 1;
      const u = j ? hi : lo;
      sp[j].classList.add("chosen");
      A.right.raise(fmt(u), u < 0 ? "neg" : "pos").mood(u < 0 ? "happy" : "sad");
      A.left.mood(u > 3 ? "happy" : u < 0 ? "sad" : "normal");
      if (u > 3) A.left.jump(); if (u < 0) A.left.shake();
      total += u; rounds++;
      A.coins(0, fmt(total)); A.coins(1, fmt(-total));
      log.innerHTML = `Agent chọn <b>${b}</b> → đối thủ chọn <b>${fmt(u)}</b>. Utility của agent: <b class="${u < 0 ? "c-loss" : "c-win"}">${fmt(u)}</b>`;
      sc.innerHTML = `${rounds} ván · tổng ${fmt(total)}`;
      busy = false;
    }
    setP("adv"); reset();
    return {
      async step(st) {
        cancel();
        if (st === 0) { setP("adv"); reset(); }
        if (st === 1) { setP("adv"); reset(); play("A", 0); }
        if (st === 2) { setP("adv"); total = -50; rounds = 1; play("B", 0); }
        if (st === 3) { setP("help"); total = -49; rounds = 2; play("A", 1); }
      },
      leave: cancel,
    };
  };

  // ------------------------------------------------------------------ scoreboard of rounds (game evaluation by sampling)
  const circleCls = (u) => (u > 0 ? "pos" : u < 0 ? "neg" : "zero");
  function sbRow(label, n, cls) {
    const r = h("div", "sbrow " + (cls || ""));
    r.appendChild(h("div", "sblab", label));
    const dots = h("div", "sbdots");
    const cs = [];
    for (let i = 0; i < n; i++) { const c = h("div", "dot"); dots.appendChild(c); cs.push(c); }
    r.appendChild(dots);
    const tot = h("div", "sbtot", "·");
    r.appendChild(tot);
    return { r, cs, tot };
  }
  const POL = {
    A: { name: "Luôn A", box: () => "A" }, B: { name: "Luôn B", box: () => "B" }, C: { name: "Luôn C", box: () => "C" },
  };

  // S22: one matchup, many games; circles show the latest rounds, chart shows the running mean
  W.montecarlo = (el) => {
    el.style.cssText += ";display:flex;flex-direction:column;gap:20px;width:100%";
    const head = h("div", "sbhead", `<span class="L">AGENT · <b id="mc-pol">LUÔN A</b></span><span class="vs">VS</span><span class="R">ĐỐI THỦ · CHỌN ĐỀU</span>`);
    const board = h("div", "scoreboard");
    const N = 16;
    const row = sbRow("U", N);
    board.append(head, row.r);
    const bottom = h("div", ""); bottom.style.cssText = "display:flex;gap:36px;align-items:center";
    const chartHost = h("div", ""); chartHost.style.cssText = "flex:1;min-width:0";
    const side = h("div", "stack"); side.style.cssText = "width:560px;flex:none;gap:16px";
    bottom.append(chartHost, side);
    el.append(board, bottom);
    const ctl = h("div", "btnrow"); side.appendChild(ctl);
    const pb = {};
    Object.entries(POL).forEach(([k, p]) => { const b = h("button", "ghost eval", p.name); b.addEventListener("click", (e) => { e.stopPropagation(); setPol(k); b.blur(); }); ctl.appendChild(b); pb[k] = b; });
    const ctl2 = h("div", "btnrow"); side.appendChild(ctl2);
    [[1, "+1 ván"], [10, "+10"], [100, "+100"], [1000, "+1000"]].forEach(([n, t]) => { const b = h("button", n === 1 ? "act" : "ghost", t); b.addEventListener("click", (e) => { e.stopPropagation(); run(n); b.blur(); }); ctl2.appendChild(b); });
    const rb = h("button", "ghost", "Làm lại"); rb.addEventListener("click", (e) => { e.stopPropagation(); setPol(pol); rb.blur(); }); ctl2.appendChild(rb);
    const out = h("div", "readout"); side.appendChild(out);
    let pol = "A", games = [], timer = null;
    const exact = (k) => G.boxVal(k, "avg").v;
    // D3 chart
    const Wc = 1100, Hc = 330, m = { l: 80, r: 20, t: 20, b: 50 };
    const svg = d3.select(chartHost).append("svg").attr("width", Wc).attr("height", Hc).attr("class", "chart");
    const x = d3.scaleLinear().range([m.l, Wc - m.r]), y = d3.scaleLinear().range([Hc - m.b, m.t]);
    const gx = svg.append("g").attr("transform", `translate(0,${Hc - m.b})`), gy = svg.append("g").attr("transform", `translate(${m.l},0)`);
    const ex = svg.append("line").attr("class", "exact"), exl = svg.append("text").attr("class", "exact-l");
    const path = svg.append("path").attr("class", "run");
    svg.append("text").attr("x", Wc - m.r).attr("y", Hc - 8).attr("text-anchor", "end").attr("class", "axl").text("số ván đã chơi");
    svg.append("text").attr("x", 14).attr("y", m.t + 6).attr("class", "axl").text("trung bình");
    function draw() {
      const n = games.length;
      x.domain([0, Math.max(10, n)]);
      const [lo, hi] = G.BOX[pol];
      y.domain([lo, hi]);
      gx.call(d3.axisBottom(x).ticks(6).tickFormat((d) => d.toLocaleString("vi-VN")));
      gy.call(d3.axisLeft(y).ticks(5).tickFormat((d) => G.vn(d)));
      const e = exact(pol);
      ex.attr("x1", m.l).attr("x2", Wc - m.r).attr("y1", y(e)).attr("y2", y(e));
      exl.attr("x", Wc - m.r - 6).attr("y", y(e) - 10).attr("text-anchor", "end").text(`expected utility = ${G.vn(e)}`);
      let s = 0;
      const pts = games.map((u, i) => { s += u; return [i + 1, s / (i + 1)]; });
      path.attr("d", pts.length ? d3.line().x((d) => x(d[0])).y((d) => y(d[1]))(pts) : null);
      const last = games.slice(-N);
      row.cs.forEach((c, i) => { const u = last[i]; c.className = "dot" + (u === undefined ? "" : " " + circleCls(u)); c.textContent = u === undefined ? "" : px(fmt(u)); });
      const mean = n ? s / n : 0;
      row.tot.textContent = n ? px(G.vn(mean, 2)) : "·";
      out.innerHTML = `<span class="lbl">Đã chơi</span> ${n.toLocaleString("vi-VN")} ván<br><span class="lbl">Trung bình mẫu</span> ${n ? G.vn(mean, 3) : "—"}<br><span class="lbl">Expected utility</span> <b class="c-eval">${G.vn(e)}</b>`;
    }
    function setPol(k) { clearInterval(timer); pol = k; games = []; Object.entries(pb).forEach(([kk, b]) => b.classList.toggle("on", kk === k)); $("#mc-pol", head).textContent = POL[k].name.toUpperCase(); draw(); }
    function one() { const [lo, hi] = G.BOX[pol]; games.push(Math.random() < 0.5 ? lo : hi); }
    function run(n) {
      clearInterval(timer);
      if (n <= 10) { let k = 0; timer = setInterval(() => { one(); draw(); if (++k >= n) clearInterval(timer); }, 160); }
      else { let k = 0; const per = Math.ceil(n / 40); timer = setInterval(() => { for (let i = 0; i < per && k < n; i++, k++) one(); draw(); if (k >= n) clearInterval(timer); }, 30); }
    }
    setPol("A");
    return { step(st) { if (st === 0) setPol("A"); if (st === 1) { setPol("A"); run(10); } if (st === 2) run(1000); }, leave() { clearInterval(timer); } };
  };

  // S45: the four face-offs played round by round
  W.duel = (el) => {
    el.style.cssText += ";display:flex;flex-direction:column;gap:16px;width:100%";
    const board = h("div", "scoreboard");
    board.appendChild(h("div", "sbhead", `<span class="L">POLICY AGENT</span><span class="vs">VS</span><span class="R">POLICY ĐỐI THỦ</span>`));
    const N = 14;
    const M = [
      { lab: "π<sub>max</sub> · π<sub>min</sub>", a: "B", o: "min", ex: "1" },
      { lab: "π<sub>max</sub> · π<sub>7</sub>", a: "B", o: "avg", ex: "2" },
      { lab: "π<sub>E</sub> · π<sub>min</sub>", a: "C", o: "min", ex: "−5" },
      { lab: "π<sub>E</sub> · π<sub>7</sub>", a: "C", o: "avg", ex: "5" },
    ];
    const rows = M.map((mm) => { const r = sbRow(mm.lab, N, "wide"); board.appendChild(r.r); return r; });
    board.appendChild(h("div", "sbfoot", `<span>mỗi chấm = một ván · ô cuối = trung bình mẫu</span><span>giá trị trong bảng: 1 · 2 · −5 · 5</span>`));
    el.appendChild(board);
    const ctl = h("div", "btnrow"); el.appendChild(ctl);
    const go = h("button", "act", "Đấu 14 ván"); go.addEventListener("click", (e) => { e.stopPropagation(); run(); go.blur(); }); ctl.appendChild(go);
    let timer = null;
    function clear() { clearInterval(timer); rows.forEach((r) => { r.cs.forEach((c) => { c.className = "dot"; c.textContent = ""; }); r.tot.textContent = "·"; }); }
    function run() {
      clear();
      const res = M.map(() => []);
      let k = 0;
      timer = setInterval(() => {
        M.forEach((mm, i) => {
          const [lo, hi] = G.BOX[mm.a];
          const u = mm.o === "min" ? lo : Math.random() < 0.5 ? lo : hi;
          res[i].push(u);
          const c = rows[i].cs[k]; c.className = "dot " + circleCls(u); c.textContent = px(fmt(u)); G.pop(c);
          rows[i].tot.textContent = px(G.vn(res[i].reduce((a, b) => a + b, 0) / res[i].length, 1));
        });
        if (++k >= N) clearInterval(timer);
      }, 260);
    }
    clear();
    return { step(st) { if (st === 0) clear(); if (st === 1) run(); }, leave() { clearInterval(timer); } };
  };

  // ------------------------------------------------------------------ S41: Halving, the class against minimax
  // state (player, n): player +1 = class (MAX), −1 = machine (MIN); the player left with 0 wins (CS221 game.py)
  const Wn = (() => { const w = [1]; for (let n = 1; n <= 64; n++) w[n] = Math.max(1 - w[n - 1], 1 - w[Math.floor(n / 2)]); return w; })();
  G.halvingW = Wn;
  const hv = (p, n) => (n === 0 ? p * Infinity : Wn[n] ? p * Infinity : -p * Infinity);   // minimax value, class's view
  W.wstrip = (el, o) => {
    const M = (o && o.n) || 16;
    el.innerHTML = Array.from({ length: M + 1 }, (_, k) => `<span class="${Wn[k] ? "w" : "l"}">${k}</span>`).join("");
    return {};
  };
  W.halving = (el) => {
    el.style.cssText += ";display:flex;flex-direction:column;gap:16px;width:100%";
    const A = G.arena(el, { h: 560, coins: false, left: { name: "LỚP", char: "human", team: "max", sub: "MAX · +1 · đi trước" }, right: { name: "MÁY", char: "robot", team: "min", sub: "MIN · −1 · Minimax" } });
    A.C.innerHTML = `<div class="ptitle">HALVING</div><div class="bigN">15</div><div class="hist"></div><div class="wstrip"></div>`;
    const bigN = $(".bigN", A.C), hist = $(".hist", A.C), strip = $(".wstrip", A.C);
    const ctl = h("div", "ctl"); el.appendChild(ctl);
    const bm = h("button", "act", "− trừ 1"), bd = h("button", "act", "÷ chia 2 (lấy phần nguyên)");
    const b15 = h("button", "ghost", "Ván mới N = 15"), b16 = h("button", "ghost", "N = 16"), bw = h("button", "ghost", "Hiện state thắng / thua"), bu = h("button", "ghost", "Lùi");
    [bm, bd, b15, b16, bw, bu].forEach((b) => ctl.appendChild(b));
    const msg = h("span", "readout"); msg.style.marginLeft = "12px"; ctl.appendChild(msg);
    let n = 15, p = 1, start = 15, trail = [], showW = false, busy = false, tok = 0;
    const on = (b, f) => b.addEventListener("click", (e) => { e.stopPropagation(); f(); b.blur(); });
    on(bm, () => human("-")); on(bd, () => human("/"));
    on(b15, () => newGame(15)); on(b16, () => newGame(16));
    on(bw, () => { showW = !showW; bw.classList.toggle("on", showW); paint(); });
    on(bu, () => undo());
    const apply = (n0, a) => (a === "-" ? n0 - 1 : Math.floor(n0 / 2));
    function paint() {
      bigN.textContent = n; G.pop(bigN);
      hist.innerHTML = trail.map((t, i) => `<span class="${t.p === 1 ? "hm" : "hn"}">${t.n}</span>`).join("<i>→</i>") + (trail.length ? "<i>→</i>" : "") + `<span class="now">${n}</span>`;
      const M = Math.max(start, 16);
      strip.innerHTML = Array.from({ length: M + 1 }, (_, k) => `<span class="${showW ? (Wn[k] ? "w" : "l") : ""} ${k === n ? "cur" : ""}">${k}</span>`).join("");
      bm.disabled = bd.disabled = busy || n === 0 || p !== 1;
    }
    function end() {
      const classWins = p === 1;   // whoever is to move at 0 wins
      if (classWins) { A.left.cheer(); A.right.mood("sad"); msg.innerHTML = `<b class="c-win">Lớp nhận số 0: lớp thắng!</b>`; }
      else { A.right.cheer(); A.left.mood("sad"); msg.innerHTML = `<b class="c-loss">Máy nhận số 0: máy thắng.</b>`; }
    }
    async function human(a) {
      if (busy || n === 0 || p !== 1) return;
      trail.push({ n, p, a });
      A.right.lower(); A.left.raise(a === "-" ? "−1" : "÷2");
      n = apply(n, a); p = -1; paint();
      const v = hv(p, n);
      A.left.mood(v > 0 ? "happy" : "normal");
      if (n === 0) return end();
      busy = true; paint();
      const my = ++tok;
      msg.innerHTML = `Máy đang tính…`;
      await G.sleep(1100);
      if (my !== tok) return;
      machine();
    }
    function machine() {
      // MIN picks the action whose successor has the smaller value (class's view); ties: "-" first, as in game.py
      const opts = ["-", "/"].map((a) => ({ a, v: hv(1, apply(n, a)) }));
      const best = opts.reduce((x, y) => (y.v < x.v ? y : x));
      const vNow = hv(-1, n);
      trail.push({ n, p, a: best.a });
      A.left.lower(); A.right.raise(best.a === "-" ? "−1" : "÷2");
      n = apply(n, best.a); p = 1; busy = false;
      A.right.say(`value = <b>${G.vn(vNow)}</b> (theo góc nhìn lớp)`);
      A.right.mood(vNow > 0 ? "sad" : "happy");
      paint();
      msg.innerHTML = `Máy chọn <b>${best.a === "-" ? "−1" : "÷2"}</b>. ${vNow > 0 ? "Lớp vẫn có strategy thắng." : "Máy đang có strategy thắng."}`;
      if (n === 0) end();
    }
    function undo() {
      tok++; busy = false;
      // go back to the class's last turn
      while (trail.length) { const t = trail.pop(); n = t.n; p = t.p; if (p === 1) break; }
      A.left.lower().set("idle", "normal"); A.right.lower().set("idle", "normal");
      msg.textContent = ""; paint();
    }
    function newGame(N) {
      tok++; busy = false; n = N; start = N; p = 1; trail = [];
      A.left.lower().set("idle", "normal"); A.right.lower().set("idle", "normal");
      A.right.say("MIN · −1 · Minimax");
      msg.innerHTML = `Lớp đi trước, N = ${N}. Bên nhận số 0 thắng.`;
      paint();
    }
    newGame(15);
    return { enter() { newGame(start); }, leave() { tok++; busy = false; } };
  };

  // ------------------------------------------------------------------ S42: the Minimax tree for N = 3 behind W(n)
  // values come from minimax on (player, n) itself, not from Wn; two actions with the same successor share one edge
  const mmH = (() => {
    const memo = new Map();
    const f = (p, n) => {
      if (n === 0) return p * Infinity;   // terminal (p, 0): the player to move received 0 and wins
      const k = p + ":" + n;
      if (!memo.has(k)) { const vs = [n - 1, Math.floor(n / 2)].map((m) => f(-p, m)); memo.set(k, p === 1 ? Math.max(...vs) : Math.min(...vs)); }
      return memo.get(k);
    };
    return f;
  })();
  G.halvingMinimax = mmH;
  W.halvingTree = (el) => {
    const node = (id, p, n, kids) => ({ id, p, n, k: n === 0 ? "term" : p === 1 ? "max" : "min", v: n === 0 ? mmH(p, 0) : "?", kids });
    const both = "− hoặc /";
    const spec = node("r", 1, 3, [
      { a: "−", n: node("m2", -1, 2, [{ a: both, n: node("l1", 1, 1, [{ a: both, n: node("m0", -1, 0) }]) }]) },
      { a: "/", n: node("m1", -1, 1, [{ a: both, n: node("l0", 1, 0) }]) },
    ]);
    const t = G.drawTree(el, spec, { w: 660, h: 470, r: 40, lr: 34, fs: 26, padX: 160, padT: 48, padB: 38 });
    // state name to the right of each node
    t.all.forEach((n) => {
      const N = t.nodes[n.id], dx = n.k === "term" ? 34 : 40 * 1.15;
      N.g.appendChild(G.sv("text", { class: "sn", x: dx + 14, y: 9 }, `(${n.p === 1 ? "Lớp" : "Máy"}, ${n.n})`));
    });
    const order = ["l1", "m2", "m1", "r"];   // postorder: a node gets its value after all its children
    let timers = [];
    const cancel = () => { timers.forEach(clearTimeout); timers = []; };
    function show(st, animate) {
      cancel(); t.reset();
      order.forEach((id) => t.v(id, "?"));
      if (st < 1) return;
      order.forEach((id, i) => {
        const n = t.nodes[id].n, put = () => { t.v(id, mmH(n.p, n.n), animate); if (id === "r") t.e("m1", "bold"); };
        if (animate) timers.push(setTimeout(put, 380 * i)); else put();
      });
    }
    return { step(st, prev) { show(st, st === 1 && prev === 0); }, leave: cancel };
  };
})();
