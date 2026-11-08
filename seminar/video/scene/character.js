// Người trình bày: SVG, khớp tay/chân tính bằng IK hai đoạn. Toạ độ cục bộ: gốc ở giữa hai bàn chân, trục y hướng xuống.
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const C = {
    skin: "#f3cda8", skinD: "#d9a47c", hair: "#1b1716", shirt: "#8ab8e0", shirtD: "#5b8cbb", shirtL: "#dceaf6",
    pants: "#2c3a57", pantsD: "#1c2740", belt: "#26282c", shoe: "#3a2a22", mouth: "#6b2525", tongue: "#d46a6a", lanyard: "#1f5fbf",
  };
  const UPPER = 118, FORE = 110, THIGH = 147, SHIN = 147;
  const SHOULDER = { L: [-52, -494], R: [52, -494] };
  const HIP = { L: [-21, -300], R: [21, -300] };

  const el = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (parent) parent.appendChild(e);
    return e;
  };
  const line = (parent, color, w) => el("line", { stroke: color, "stroke-width": w, "stroke-linecap": "round" }, parent);
  const setLine = (l, a, b) => { l.setAttribute("x1", a[0].toFixed(1)); l.setAttribute("y1", a[1].toFixed(1)); l.setAttribute("x2", b[0].toFixed(1)); l.setAttribute("y2", b[1].toFixed(1)); };

  // two-bone IK: returns [joint, end]
  function ik(s, t, a, b, side, preferDown = true, fore = false) {
    let dx = t[0] - s[0], dy = t[1] - s[1];
    let d = Math.hypot(dx, dy);
    if (fore) { const f = Math.max(0.6, Math.min(1, (d + 18) / (a + b))); a *= f; b *= f; }
    const max = a + b - 0.5;
    if (d > max) { dx *= max / d; dy *= max / d; d = max; }
    if (d < 1) d = 1;
    const th = Math.atan2(dy, dx);
    const ca = Math.max(-1, Math.min(1, (a * a + d * d - b * b) / (2 * a * d)));
    const al = Math.acos(ca);
    const j1 = [s[0] + a * Math.cos(th + al), s[1] + a * Math.sin(th + al)];
    const j2 = [s[0] + a * Math.cos(th - al), s[1] + a * Math.sin(th - al)];
    const score = (j) => (preferDown ? j[1] : 0) + side * j[0] * (preferDown ? 0.12 : 0.15);
    const j = score(j1) >= score(j2) ? j1 : j2;
    return [j, [s[0] + dx, s[1] + dy]];
  }

  function build(svg) {
    const root = el("g", { id: "chr" }, svg);
    const shadow = el("ellipse", { cx: 0, cy: 4, rx: 70, ry: 10, fill: "#000", opacity: 0.13 }, root);
    const body = el("g", {}, root);
    const P = {};
    // legs
    P.legs = {};
    for (const s of ["L", "R"]) {
      const g = el("g", {}, body);
      P.legs[s] = { thighO: line(g, C.pantsD, 46), shinO: line(g, C.pantsD, 41), thigh: line(g, C.pants, 40), shin: line(g, C.pants, 35), shoe: el("path", { fill: C.shoe }, g) };
    }
    P.pelvis = el("path", { d: "M-49,-322 L49,-322 L47,-284 Q0,-266 -47,-284 Z", fill: C.pants, stroke: C.pantsD, "stroke-width": 3 }, body);
    // torso
    P.torso = el("path", { d: "M-60,-486 Q-62,-508 -38,-510 L38,-510 Q62,-508 60,-486 L50,-316 L-50,-316 Z", fill: C.shirt, stroke: C.shirtD, "stroke-width": 3, "stroke-linejoin": "round" }, body);
    P.belt = el("rect", { x: -51, y: -326, width: 102, height: 13, rx: 3, fill: C.belt }, body);
    P.front = el("g", {}, body);
    el("path", { d: "M0,-504 L0,-326", stroke: C.shirtD, "stroke-width": 2, opacity: 0.55 }, P.front);
    for (const y of [-470, -440, -410, -380, -350]) el("circle", { cx: 3, cy: y, r: 2.4, fill: C.shirtL, stroke: C.shirtD, "stroke-width": 1 }, P.front);
    el("rect", { x: -7, y: -326, width: 14, height: 13, rx: 2, fill: "#b8a46a" }, P.front);
    el("path", { d: "M-15,-512 L-1,-488 L-6,-514 Z", fill: C.shirtL, stroke: C.shirtD, "stroke-width": 1.5 }, P.front);
    el("path", { d: "M15,-512 L1,-488 L6,-514 Z", fill: C.shirtL, stroke: C.shirtD, "stroke-width": 1.5 }, P.front);
    el("path", { d: "M-13,-506 L-6,-430 M13,-506 L6,-430", stroke: C.lanyard, "stroke-width": 3.2, fill: "none" }, P.front);
    el("rect", { x: -20, y: -432, width: 40, height: 50, rx: 4, fill: "#fff", stroke: "#9aa7b8", "stroke-width": 1.5 }, P.front);
    el("rect", { x: -20, y: -432, width: 40, height: 13, rx: 4, fill: C.lanyard }, P.front);
    el("text", { x: 0, y: -400, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: "#1e2a4a", "font-family": "Be Vietnam Pro" }, P.front).textContent = "N10";
    el("rect", { x: -13, y: -394, width: 26, height: 3, fill: "#cbd5e1" }, P.front);
    P.back = el("g", {}, body);
    el("path", { d: "M-22,-512 Q0,-500 22,-512 L20,-500 Q0,-490 -20,-500 Z", fill: C.shirtL, stroke: C.shirtD, "stroke-width": 1.5 }, P.back);
    el("path", { d: "M-30,-470 Q0,-462 30,-470", stroke: C.shirtD, "stroke-width": 2, fill: "none", opacity: 0.5 }, P.back);
    // neck + head
    el("rect", { x: -12, y: -536, width: 24, height: 34, rx: 6, fill: C.skin }, body);
    el("rect", { x: -12, y: -512, width: 24, height: 8, fill: C.skinD, opacity: 0.5 }, body);
    P.head = el("g", {}, body);
    P.earL = el("ellipse", { cx: -39, cy: -580, rx: 7.5, ry: 11.5, fill: C.skin, stroke: C.skinD, "stroke-width": 2 }, P.head);
    P.earR = el("ellipse", { cx: 39, cy: -580, rx: 7.5, ry: 11.5, fill: C.skin, stroke: C.skinD, "stroke-width": 2 }, P.head);
    P.face = el("ellipse", { cx: 0, cy: -582, rx: 39, ry: 47, fill: C.skin, stroke: C.skinD, "stroke-width": 2.5 }, P.head);
    P.feat = el("g", {}, P.head);
    P.blushL = el("ellipse", { rx: 7, ry: 4, fill: "#f2a49a", opacity: 0.38 }, P.feat);
    P.blushR = el("ellipse", { rx: 7, ry: 4, fill: "#f2a49a", opacity: 0.38 }, P.feat);
    P.eyeL = el("ellipse", { rx: 4.4, ry: 5.4, fill: "#1f1a18" }, P.feat);
    P.eyeR = el("ellipse", { rx: 4.4, ry: 5.4, fill: "#1f1a18" }, P.feat);
    P.glL = el("circle", { r: 1.4, fill: "#fff" }, P.feat);
    P.glR = el("circle", { r: 1.4, fill: "#fff" }, P.feat);
    P.browL = el("path", { stroke: C.hair, "stroke-width": 3.4, fill: "none", "stroke-linecap": "round" }, P.feat);
    P.browR = el("path", { stroke: C.hair, "stroke-width": 3.4, fill: "none", "stroke-linecap": "round" }, P.feat);
    P.nose = el("path", { stroke: "#c48a63", "stroke-width": 2.4, fill: "none", "stroke-linecap": "round" }, P.feat);
    P.mouthC = el("path", { stroke: "#8a3b3b", "stroke-width": 2.6, fill: "none", "stroke-linecap": "round" }, P.feat);
    P.mouthO = el("ellipse", { fill: C.mouth }, P.feat);
    P.tongue = el("ellipse", { fill: C.tongue }, P.feat);
    P.teeth = el("rect", { fill: "#fff", rx: 2 }, P.feat);
    P.hairF = el("path", { fill: C.hair, d: "M-41,-584 C-48,-636 -20,-648 4,-646 C30,-646 50,-628 42,-584 C40,-596 36,-606 30,-612 C18,-604 2,-606 -10,-616 C-20,-606 -32,-602 -38,-592 Z" }, P.head);
    P.hairB = el("path", { fill: C.hair, d: "M-41,-584 C-48,-640 48,-644 42,-584 C44,-560 36,-544 22,-538 C8,-534 -8,-534 -22,-538 C-36,-544 -44,-560 -41,-584 Z" }, P.head);
    // arms (drawn on top of torso and head)
    P.arms = {};
    for (const s of ["L", "R"]) {
      const g = el("g", {}, root);
      const a = { g, upO: line(g, C.shirtD, 31), foO: line(g, C.shirtD, 27), up: line(g, C.shirt, 26), fo: line(g, C.shirt, 22), cuff: line(g, C.shirtL, 22) };
      a.prop = el("g", {}, g);
      a.clicker = el("g", {}, a.prop);
      el("rect", { x: -4, y: -7, width: 30, height: 14, rx: 5, fill: "#20242b" }, a.clicker);
      el("circle", { cx: 22, cy: 0, r: 2.6, fill: "#ff3b30" }, a.clicker);
      a.marker = el("g", {}, a.prop);
      el("rect", { x: -2, y: -5, width: 34, height: 10, rx: 3, fill: "#f3f4f6", stroke: "#9ca3af", "stroke-width": 1 }, a.marker);
      a.markerCap = el("rect", { x: 26, y: -5.5, width: 12, height: 11, rx: 3, fill: "#1e2a4a" }, a.marker);
      a.eraser = el("g", {}, a.prop);
      el("rect", { x: 0, y: -12, width: 34, height: 24, rx: 4, fill: "#4b5563" }, a.eraser);
      el("rect", { x: 30, y: -12, width: 8, height: 24, rx: 2, fill: "#9ca3af" }, a.eraser);
      a.hand = el("circle", { r: 12.5, fill: C.skin, stroke: C.skinD, "stroke-width": 2 }, g);
      a.thumb = el("ellipse", { rx: 5, ry: 7, fill: C.skin, stroke: C.skinD, "stroke-width": 1.5 }, g);
      P.arms[s] = a;
    }
    return { root, body, P, shadow };
  }

  // pose: { x, sx, back, bob, sway, feet:{L:[x,y],R:[x,y]}, hands:{L:[x,y],R:[x,y]}, yaw, tilt, mouth, blink, brow, propL, propR, propColor, shrug }
  function draw(ch, p) {
    const { root, body, P } = ch;
    root.setAttribute("transform", `translate(${p.x.toFixed(1)},1048) scale(${p.sx.toFixed(3)},1)`);
    body.setAttribute("transform", `translate(${p.sway.toFixed(2)},${p.bob.toFixed(2)})`);
    // legs (hips move with the body)
    for (const s of ["L", "R"]) {
      const hip = [HIP[s][0] + p.sway, HIP[s][1] + p.bob];
      const side = s === "L" ? -1 : 1;
      const foot = p.feet[s];
      const [knee, ankle] = ik(hip, [foot[0], foot[1] - 8], THIGH, SHIN, side, false);
      const L = P.legs[s];
      // legs are drawn in root space; undo body translate by using absolute coords inside body group
      const h0 = [HIP[s][0], HIP[s][1]], k0 = [knee[0] - p.sway, knee[1] - p.bob], a0 = [ankle[0] - p.sway, ankle[1] - p.bob];
      setLine(L.thighO, h0, k0); setLine(L.thigh, h0, k0); setLine(L.shinO, k0, a0); setLine(L.shin, k0, a0);
      const fx = a0[0] + side * 6, fy = a0[1] + 6;
      L.shoe.setAttribute("d", `M${fx - 20},${fy + 3} Q${fx - 20},${fy - 12} ${fx},${fy - 12} Q${fx + 22},${fy - 12} ${fx + 24},${fy + 3} Z`);
    }
    P.front.setAttribute("display", p.back ? "none" : "inline");
    P.back.setAttribute("display", p.back ? "inline" : "none");
    P.feat.setAttribute("display", p.back ? "none" : "inline");
    P.hairF.setAttribute("display", p.back ? "none" : "inline");
    P.hairB.setAttribute("display", p.back ? "inline" : "none");
    P.face.setAttribute("display", "inline");
    // head
    const fx = p.back ? 0 : p.yaw * 13;
    P.head.setAttribute("transform", `translate(${(p.yaw * 3).toFixed(2)},${(p.shrug * 2).toFixed(2)}) rotate(${p.tilt.toFixed(2)},0,-540)`);
    P.earL.setAttribute("cx", (-39 + Math.max(0, p.yaw) * 6).toFixed(1));
    P.earR.setAttribute("cx", (39 + Math.min(0, p.yaw) * 6).toFixed(1));
    P.earL.setAttribute("rx", (7.5 * (1 - Math.max(0, p.yaw) * 0.6)).toFixed(2));
    P.earR.setAttribute("rx", (7.5 * (1 + Math.min(0, p.yaw) * 0.6)).toFixed(2));
    if (!p.back) {
      const ey = -588, br = p.brow * 4;
      const eRy = 5.4 * (1 - 0.85 * p.blink);
      P.eyeL.setAttribute("cx", -15 + fx); P.eyeL.setAttribute("cy", ey); P.eyeL.setAttribute("ry", eRy.toFixed(2));
      P.eyeR.setAttribute("cx", 15 + fx); P.eyeR.setAttribute("cy", ey); P.eyeR.setAttribute("ry", eRy.toFixed(2));
      P.glL.setAttribute("cx", -13.5 + fx); P.glL.setAttribute("cy", ey - 2); P.glL.setAttribute("opacity", p.blink > 0.5 ? 0 : 1);
      P.glR.setAttribute("cx", 16.5 + fx); P.glR.setAttribute("cy", ey - 2); P.glR.setAttribute("opacity", p.blink > 0.5 ? 0 : 1);
      P.browL.setAttribute("d", `M${-24 + fx},${-600 - br} Q${-15 + fx},${-607 - br} ${-6 + fx},${-601 - br}`);
      P.browR.setAttribute("d", `M${6 + fx},${-601 - br} Q${15 + fx},${-607 - br} ${24 + fx},${-600 - br}`);
      const nx = fx * 1.3;
      P.nose.setAttribute("d", `M${nx - 1},${-580} Q${nx + 4},${-569} ${nx - 2},${-566}`);
      P.blushL.setAttribute("cx", -23 + fx); P.blushL.setAttribute("cy", -565);
      P.blushR.setAttribute("cx", 23 + fx); P.blushR.setAttribute("cy", -565);
      const mx = fx * 1.1, my = -549, o = p.mouth;
      if (o < 0.08) {
        P.mouthC.setAttribute("display", "inline"); P.mouthO.setAttribute("display", "none"); P.tongue.setAttribute("display", "none"); P.teeth.setAttribute("display", "none");
        P.mouthC.setAttribute("d", `M${mx - 9},${my - 1} Q${mx},${my + 5} ${mx + 9},${my - 1}`);
      } else {
        P.mouthC.setAttribute("display", "none"); P.mouthO.setAttribute("display", "inline"); P.tongue.setAttribute("display", "inline"); P.teeth.setAttribute("display", "inline");
        const ry = 1.5 + 5.5 * o, rx = 7.5 + 2 * o;
        P.mouthO.setAttribute("cx", mx); P.mouthO.setAttribute("cy", my + 1); P.mouthO.setAttribute("rx", rx.toFixed(2)); P.mouthO.setAttribute("ry", ry.toFixed(2));
        P.tongue.setAttribute("cx", mx); P.tongue.setAttribute("cy", (my + 1 + ry * 0.55).toFixed(2)); P.tongue.setAttribute("rx", (rx * 0.6).toFixed(2)); P.tongue.setAttribute("ry", (ry * 0.35).toFixed(2));
        P.teeth.setAttribute("x", (mx - rx * 0.7).toFixed(2)); P.teeth.setAttribute("y", (my + 1 - ry + 0.5).toFixed(2)); P.teeth.setAttribute("width", (rx * 1.4).toFixed(2)); P.teeth.setAttribute("height", Math.min(3, ry * 0.4).toFixed(2));
      }
    }
    // arms
    for (const s of ["L", "R"]) {
      const side = s === "L" ? -1 : 1;
      const sh = [SHOULDER[s][0] + p.sway, SHOULDER[s][1] + p.bob - p.shrug * 6];
      const [elbow, hand] = ik(sh, p.hands[s], UPPER, FORE, side, true, true);
      const A = P.arms[s];
      setLine(A.upO, sh, elbow); setLine(A.up, sh, elbow);
      const dx = hand[0] - elbow[0], dy = hand[1] - elbow[1], dl = Math.hypot(dx, dy) || 1;
      const wrist = [hand[0] - (dx / dl) * 13, hand[1] - (dy / dl) * 13];
      setLine(A.foO, elbow, wrist); setLine(A.fo, elbow, wrist);
      const c0 = [wrist[0] - (dx / dl) * 6, wrist[1] - (dy / dl) * 6];
      setLine(A.cuff, c0, wrist);
      A.hand.setAttribute("cx", hand[0].toFixed(1)); A.hand.setAttribute("cy", hand[1].toFixed(1));
      const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
      const tx = hand[0] + Math.cos(Math.atan2(dy, dx) - side * 1.1) * 9, ty = hand[1] + Math.sin(Math.atan2(dy, dx) - side * 1.1) * 9;
      A.thumb.setAttribute("cx", tx.toFixed(1)); A.thumb.setAttribute("cy", ty.toFixed(1));
      A.thumb.setAttribute("transform", `rotate(${ang.toFixed(1)},${tx.toFixed(1)},${ty.toFixed(1)})`);
      const prop = s === "L" ? p.propL : p.propR;
      A.clicker.setAttribute("display", prop === "clicker" ? "inline" : "none");
      A.marker.setAttribute("display", prop === "marker" ? "inline" : "none");
      A.eraser.setAttribute("display", prop === "eraser" ? "inline" : "none");
      if (prop === "marker") A.markerCap.setAttribute("fill", p.propColor || "#1e2a4a");
      A.prop.setAttribute("transform", `translate(${hand[0].toFixed(1)},${hand[1].toFixed(1)}) rotate(${ang.toFixed(1)})`);
      p.handOut = p.handOut || {};
      p.handOut[s] = hand;
    }
  }

  window.Character = { build, draw, SHOULDER, reach: UPPER + FORE };
})();
