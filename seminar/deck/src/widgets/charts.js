/* D3 charts: Expectimax sensitivity to the opponent model, a wrong model vs the real opponent, and b^m growth. */
(function () {
  "use strict";
  const { h, sv, F, fmt, $, $$ } = G;
  const VA = (p) => 50 - 100 * p, VB = (p) => 3 - 2 * p, VC = (p) => 15 - 20 * p;
  const FN = { A: VA, B: VB, C: VC };
  const COL = { A: "var(--box-a)", B: "var(--box-b)", C: "var(--box-c)" };
  const best = (p) => ["A", "B", "C"].reduce((a, b) => (FN[b](p) > FN[a](p) + 1e-12 ? b : a));
  G.bestBox = best;

  function axes(svg, Wd, Ht, m, yDom) {
    const x = d3.scaleLinear().domain([0, 1]).range([m.l, Wd - m.r]);
    const y = d3.scaleLinear().domain(yDom).range([Ht - m.b, m.t]);
    svg.append("g").attr("class", "ax").attr("transform", `translate(0,${Ht - m.b})`).call(d3.axisBottom(x).ticks(10).tickFormat((d) => G.vn(d, 1)));
    svg.append("g").attr("class", "ax").attr("transform", `translate(${m.l},0)`).call(d3.axisLeft(y).ticks(6).tickFormat((d) => G.vn(d)));
    svg.append("line").attr("class", "zero").attr("x1", m.l).attr("x2", Wd - m.r).attr("y1", y(0)).attr("y2", y(0));
    svg.append("text").attr("class", "axl").attr("x", Wd - m.r).attr("y", Ht - 8).attr("text-anchor", "end").text("p = xác suất đối thủ chọn số nhỏ");
    svg.append("text").attr("class", "axl").attr("x", m.l - 64).attr("y", m.t - 14).text("expected utility");
    return { x, y };
  }
  const line = (x, y, f) => d3.line().x((p) => x(p)).y((p) => y(f(p)))(d3.range(0, 1.0001, 0.01));

  // S28 — three lines, the upper envelope, the two thresholds
  W.sensitivity = (el) => {
    el.style.cssText += ";display:flex;gap:40px;align-items:center;width:100%";
    const left = h("div", ""), right = h("div", "stack");
    left.style.cssText = "flex:1;min-width:0"; right.style.cssText = "width:560px;flex:none;gap:18px";
    el.append(left, right);
    const Wd = 1150, Ht = 560, m = { l: 90, r: 30, t: 40, b: 60 };
    const svg = d3.select(left).append("svg").attr("width", Wd).attr("height", Ht).attr("class", "chart");
    const { x, y } = axes(svg, Wd, Ht, m, [-52, 52]);
    const reg = svg.append("g").attr("class", "regions");
    [["A", 0, 7 / 16], ["C", 7 / 16, 2 / 3], ["B", 2 / 3, 1]].forEach(([b, a0, a1]) => {
      reg.append("rect").attr("x", x(a0)).attr("width", x(a1) - x(a0)).attr("y", m.t).attr("height", Ht - m.t - m.b).style("fill", COL[b]).style("opacity", 0.08);
      reg.append("text").attr("x", (x(a0) + x(a1)) / 2).attr("y", Ht - m.b - 16).attr("text-anchor", "middle").attr("class", "regl").style("fill", COL[b]).text(`chọn ${b}`);
    });
    const env = svg.append("path").attr("class", "env").attr("d", line(x, y, (p) => Math.max(VA(p), VB(p), VC(p))));
    ["A", "B", "C"].forEach((b) => {
      svg.append("path").attr("class", "fn").style("stroke", COL[b]).attr("d", line(x, y, FN[b]));
    });
    svg.append("text").attr("class", "fnl").attr("x", x(0.1)).attr("y", y(VA(0.1)) - 18).style("fill", COL.A).text("V_A = 50 − 100p");
    svg.append("text").attr("class", "fnl").attr("x", x(0.02)).attr("y", y(VC(0.02)) - 14).style("fill", COL.C).text("V_C = 15 − 20p");
    svg.append("text").attr("class", "fnl").attr("x", x(0.9)).attr("y", y(VB(0.9)) - 34).style("fill", COL.B).attr("text-anchor", "middle").text("V_B = 3 − 2p");
    const th = svg.append("g").attr("class", "thr");
    [[7 / 16, "7/16 = 0,4375", VA(7 / 16)], [2 / 3, "2/3", VB(2 / 3)]].forEach(([p, t, v]) => {
      th.append("line").attr("x1", x(p)).attr("x2", x(p)).attr("y1", y(v)).attr("y2", Ht - m.b).attr("class", "tl");
      th.append("circle").attr("cx", x(p)).attr("cy", y(v)).attr("r", 9);
      th.append("text").attr("x", x(p) + 12).attr("y", y(v) - 16).text(t);
    });
    const ab = svg.append("g").attr("class", "abx");
    const pab = 47 / 98;
    ab.append("circle").attr("cx", x(pab)).attr("cy", y(VA(pab))).attr("r", 10);
    ab.append("line").attr("x1", x(pab)).attr("y1", y(VA(pab)) + 12).attr("x2", x(0.36)).attr("y2", y(-22)).attr("class", "tl2");
    ab.append("text").attr("x", x(0.36)).attr("y", y(-22) + 30).attr("text-anchor", "middle").text("A = B tại 47/98, nhưng C cao hơn: không đổi hộp");
    const cur = svg.append("g").attr("class", "cur");
    const cl = cur.append("line").attr("y1", m.t).attr("y2", Ht - m.b);
    const dots = ["A", "B", "C"].map((b) => cur.append("circle").attr("r", 8).style("fill", COL[b]));
    // controls
    const ctl = h("div", "ctl");
    const rng = h("input", "chance wide"); rng.type = "range"; rng.min = 0; rng.max = 1000; rng.value = 500;
    const lab = h("span", "readout"); ctl.append(rng, lab); right.appendChild(ctl);
    const tbl = h("table", "t big"); right.appendChild(tbl);
    const note = h("p", "txt"); right.appendChild(note);
    function paint(p) {
      cl.attr("x1", x(p)).attr("x2", x(p));
      dots.forEach((d, i) => d.attr("cx", x(p)).attr("cy", y(FN["ABC"[i]](p))));
      lab.textContent = "p = " + G.vn(p, 3);
      const bb = best(p);
      tbl.innerHTML = `<tr><th>Hộp</th><th class="num">Expected utility</th></tr>` + ["A", "B", "C"].map((b) => `<tr class="${b === bb ? "pick" : ""}"><td class="h" style="color:${COL[b]}">${b}</td><td class="num">${G.vn(FN[b](p), 2)}</td></tr>`).join("");
      note.innerHTML = `Expectimax chọn <b style="color:${COL[bb]}">${bb}</b>.`;
    }
    rng.addEventListener("input", () => paint(rng.value / 1000));
    function set(st) {
      env.style("opacity", st >= 1 ? 1 : 0); reg.style("opacity", st >= 1 ? 1 : 0);
      th.style("opacity", st >= 2 ? 1 : 0); ab.style("opacity", st >= 3 ? 1 : 0);
    }
    paint(0.5); set(0);
    return { step(st) { set(st); if (st === 0) { rng.value = 500; paint(0.5); } } };
  };

  // S29 — the model says p = 0.5, the real opponent plays p_true
  W.regret = (el) => {
    el.style.cssText += ";display:flex;gap:40px;align-items:center;width:100%";
    const left = h("div", ""), right = h("div", "stack");
    left.style.cssText = "flex:1;min-width:0"; right.style.cssText = "width:640px;flex:none;gap:16px";
    el.append(left, right);
    const Wd = 1060, Ht = 540, m = { l: 90, r: 30, t: 40, b: 60 };
    const svg = d3.select(left).append("svg").attr("width", Wd).attr("height", Ht).attr("class", "chart");
    const { x, y } = axes(svg, Wd, Ht, m, [-52, 52]);
    ["A", "B", "C"].forEach((b) => svg.append("path").attr("class", "fn thin").style("stroke", COL[b]).attr("d", line(x, y, FN[b])));
    const mk = (cls) => { const g = svg.append("g").attr("class", cls); g.append("line").attr("y1", m.t).attr("y2", Ht - m.b); g.append("text").attr("y", m.t - 10).attr("text-anchor", "middle"); return g; };
    const gM = mk("vm model"), gT = mk("vm truth");
    const dM = svg.append("circle").attr("r", 10).attr("class", "dm"), dT = svg.append("circle").attr("r", 10).attr("class", "dt"), dB = svg.append("circle").attr("r", 10).attr("class", "db");
    const row = (lbl, cls) => { const c = h("div", "ctl"); const l = h("span", "cap", lbl); l.style.width = "190px"; const r = h("input", cls + " wide"); r.type = "range"; r.min = 0; r.max = 100; const v = h("span", "readout"); c.append(l, r, v); right.appendChild(c); return [r, v]; };
    const [rM, vM] = row("Mô hình dùng", "chance"), [rT, vT] = row("Đối thủ thật", "min");
    const out = h("div", "key"); out.style.padding = "18px 24px"; right.appendChild(out);
    function paint() {
      const pm = rM.value / 100, pt = rT.value / 100;
      vM.textContent = "p = " + G.vn(pm, 2); vT.textContent = "p = " + G.vn(pt, 2);
      const pick = best(pm), opt = best(pt);
      gM.select("line").attr("x1", x(pm)).attr("x2", x(pm)); gM.select("text").attr("x", x(pm)).text("mô hình");
      gT.select("line").attr("x1", x(pt)).attr("x2", x(pt)); gT.select("text").attr("x", x(pt)).text("thực tế");
      dM.attr("cx", x(pm)).attr("cy", y(FN[pick](pm))).style("fill", COL[pick]);
      dT.attr("cx", x(pt)).attr("cy", y(FN[pick](pt))).style("stroke", COL[pick]);
      dB.attr("cx", x(pt)).attr("cy", y(FN[opt](pt))).style("fill", COL[opt]).style("opacity", opt === pick ? 0 : 1);
      const reg = FN[opt](pt) - FN[pick](pt);
      out.innerHTML = `<div class="readout" style="font-size:27px">Theo mô hình: chọn <b style="color:${COL[pick]}">${pick}</b>, dự kiến <b>${G.vn(FN[pick](pm), 2)}</b><br>Gặp đối thủ thật: ${pick} cho <b>${G.vn(FN[pick](pt), 2)}</b><br>Tốt nhất khi biết thật: <b style="color:${COL[opt]}">${opt}</b> = ${G.vn(FN[opt](pt), 2)}<br><span class="${reg > 1e-9 ? "c-loss" : "c-win"}">Thiệt hại do mô hình sai: <b>${G.vn(reg, 2)}</b></span></div>`;
    }
    [rM, rT].forEach((r) => r.addEventListener("input", paint));
    function set(pm, pt) { rM.value = pm; rT.value = pt; paint(); }
    set(50, 50);
    return { step(st) { if (st === 0) set(50, 50); if (st === 1) set(50, 90); if (st === 2) set(50, 100); } };
  };

  // S54 — b^m
  W.complexity = (el) => {
    el.style.cssText += ";display:flex;flex-direction:column;gap:26px;width:100%";
    const top = h("div", ""); top.style.cssText = "display:flex;align-items:center;gap:56px";
    el.appendChild(top);
    const sliders = h("div", "stack"); sliders.style.cssText = "gap:8px;flex:none";
    top.appendChild(sliders);
    const row = (lbl, mn, mx, v) => { const c = h("div", "ctl"); const l = h("span", "readout", lbl); l.style.width = "64px"; const r = h("input", "wide"); r.type = "range"; r.min = mn; r.max = mx; r.value = v; const o = h("span", "readout"); o.style.width = "60px"; c.append(l, r, o); sliders.appendChild(c); return [r, o]; };
    const [rb, ob] = row("b =", 2, 40, 9), [rm, om] = row("m =", 1, 100, 9);
    const pre = h("div", "btnrow"); top.appendChild(pre);
    pre.style.cssText = "flex-direction:column;align-items:stretch;gap:10px;flex:none";
    const big = h("div", ""); big.style.cssText = "flex:1;min-width:0"; top.appendChild(big);
    [["Tic-Tac-Toe: b = 9, m = 9", 9, 9], ["Cờ vua: b = 35, m = 100", 35, 100]].forEach(([t, b, m]) => { const btn = h("button", "ghost", t); btn.addEventListener("click", (e) => { e.stopPropagation(); rb.value = b; rm.value = m; paint(); btn.blur(); }); pre.appendChild(btn); });
    const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
    const pow = (k) => "10" + String(k).split("").map((c) => SUP[+c]).join("");
    const Wd = 1776, Ht = 440, mg = { l: 470, r: 150, t: 34, b: 56 };
    const svg = d3.select(el).append("svg").attr("width", Wd).attr("height", Ht).attr("class", "chart");
    const x = d3.scaleLinear().domain([0, 160]).range([mg.l, Wd - mg.r]);
    const ticks = d3.range(0, 161, 20);
    const gx = svg.append("g").attr("class", "ax");
    ticks.forEach((t) => {
      gx.append("line").attr("x1", x(t)).attr("x2", x(t)).attr("y1", mg.t - 10).attr("y2", Ht - mg.b).attr("class", "grid");
      gx.append("text").attr("x", x(t)).attr("y", Ht - mg.b + 32).attr("text-anchor", "middle").text(pow(t));
    });
    svg.append("text").attr("class", "axl").attr("x", Wd - mg.r).attr("y", Ht - 2).attr("text-anchor", "end").text("số node, thang log");
    const bars = [
      { k: "ttt", t: "Tic-Tac-Toe, đếm thật", v: Math.log10(549946) },
      { k: "bm", t: "Cận b^m đang chọn", v: 0 },
      { k: "atom", t: "Nguyên tử trong vũ trụ quan sát được", v: 80 },
      { k: "chess", t: "Cờ vua, ước lượng 35^100", v: 100 * Math.log10(35) },
    ];
    const bh = 52, gap = 30;
    const gs = svg.selectAll("g.bar").data(bars).enter().append("g").attr("class", (d) => "bar " + d.k).attr("transform", (d, i) => `translate(0,${mg.t + i * (bh + gap)})`);
    gs.append("text").attr("x", mg.l - 20).attr("y", bh / 2 + 2).attr("text-anchor", "end").attr("dominant-baseline", "central").attr("class", "bl").text((d) => d.t);
    gs.append("rect").attr("x", x(0)).attr("height", bh).attr("rx", 3);
    gs.append("text").attr("class", "bv").attr("y", bh / 2 + 2).attr("dominant-baseline", "central");
    const yr = Math.log10(1e9 * 3.156e7);
    const cap = svg.append("g").attr("class", "cap");
    cap.append("line").attr("x1", x(yr)).attr("x2", x(yr)).attr("y1", mg.t - 26).attr("y2", Ht - mg.b);
    cap.append("text").attr("x", x(yr) + 10).attr("y", mg.t - 14).text("duyệt được trong 1 năm, 10⁹ node mỗi giây");
    const exp10 = (e) => { if (e < 6) return Math.round(10 ** e).toLocaleString("vi-VN"); const k = Math.floor(e); return `${G.vn(10 ** (e - k), 1)} × ${pow(k)}`; };
    function paint() {
      const b = +rb.value, m = +rm.value, e = m * Math.log10(b);
      ob.textContent = b; om.textContent = m;
      bars[1].v = e; bars[1].t = `Cận b^m = ${b}^${m}`;
      gs.select("rect").transition().duration(350).attr("width", (d) => Math.max(4, x(Math.min(160, d.v)) - x(0)));
      gs.select("text.bv").attr("x", (d) => x(Math.min(160, d.v)) + 12).text((d) => (d.k === "ttt" ? "549.946" : "≈ " + pow(Math.round(d.v))));
      gs.select("text.bl").text((d) => d.t);
      const secs = 10 ** (e - 9);
      const tt = secs < 1 ? "dưới 1 giây" : secs < 3600 ? `${G.vn(secs, 0)} giây` : secs < 3.156e7 ? `${G.vn(secs / 3600, 1)} giờ` : `khoảng ${pow(Math.round(Math.log10(secs / 3.156e7)))} năm`;
      big.innerHTML = `<div class="statement" style="font-size:52px">b<sup>m</sup> ≈ ${exp10(e)}</div><p class="txt">Duyệt 10⁹ node mỗi giây: <b>${tt}</b></p>`;
    }
    [rb, rm].forEach((r) => r.addEventListener("input", paint));
    paint();
    return { step(st) { if (st === 0) { rb.value = 9; rm.value = 9; } if (st === 1) { rb.value = 35; rm.value = 100; } paint(); } };
  };
})();
