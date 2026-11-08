/* Three.js cone tree of tic-tac-toe from the empty board (X first). Each sphere is a node of the game tree,
   coloured by its minimax value for X (computed by G.tttMinimax): green = X wins, grey = draw, rose = O wins.
   The tree grows level by level when the slide opens; drag to turn it. */
(function () {
  "use strict";
  const { h } = G;
  function buildTree(maxDepth) {
    const nodes = [{ b: ".........", p: "X", d: 0, parent: -1 }];
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n.d >= maxDepth || G.tttEnd(n.b)) continue;
      G.tttActions(n.b).forEach((a) => nodes.push({ b: G.tttSucc(n.b, a, n.p), p: n.p === "X" ? "O" : "X", d: n.d + 1, parent: i }));
    }
    nodes.forEach((n) => { n.v = G.tttMinimax(n.b, n.p); n.end = G.tttEnd(n.b); });
    return nodes;
  }
  function layout(nodes) {
    const R = [0, 10, 3.5, 1.25, 0.47, 0.18, 0.07], H = 3.6;
    const kids = nodes.map(() => []);
    nodes.forEach((n, i) => { if (n.parent >= 0) kids[n.parent].push(i); });
    nodes[0].x = 0; nodes[0].z = 0; nodes[0].y = 0; nodes[0].ang = 0;
    nodes.forEach((n, i) => {
      const ks = kids[i], k = ks.length;
      ks.forEach((c, j) => {
        const a = n.ang + (2 * Math.PI * j) / k + (n.d ? 0.4 : 0);
        const cn = nodes[c];
        cn.ang = a; cn.x = n.x + R[cn.d] * Math.cos(a); cn.z = n.z + R[cn.d] * Math.sin(a); cn.y = -cn.d * H;
      });
    });
  }
  const cache = {};
  W.tree3d = (el, o) => {
    const depth = o.depth || 5;
    el.classList.add("hero3d");
    if (o.size) { el.style.width = o.size + "px"; el.style.height = o.size + "px"; }
    if (!window.THREE) { el.innerHTML = "<p class='cap'>Không tải được Three.js</p>"; return {}; }
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch (e) { el.appendChild(h("p", "cap", "Trình duyệt không hỗ trợ WebGL")); return {}; }
    const nodes = cache[depth] || (cache[depth] = buildTree(depth));
    if (nodes[0].x === undefined) layout(nodes);
    const W0 = el.clientWidth || o.size || 820, H0 = el.clientHeight || o.size || 820;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(W0, H0, false);
    el.prepend(renderer.domElement);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(36, W0 / H0, 0.1, 500);
    const yc = -depth * 3.6 / 2;
    cam.position.set(0, yc + 15, 50); cam.lookAt(0, yc - 1, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xc8ccd4, 1.15));
    const dl = new THREE.DirectionalLight(0xffffff, 0.8); dl.position.set(10, 20, 15); scene.add(dl);
    const group = new THREE.Group(); scene.add(group);
    const COL = { 1: new THREE.Color("#2b8a3e"), 0: new THREE.Color("#9aa3ad"), "-1": new THREE.Color("#d6336c") };
    const sizes = [1.0, 0.62, 0.36, 0.2, 0.11, 0.065, 0.04];
    const geo = new THREE.SphereGeometry(1, 14, 10);
    const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const mesh = new THREE.InstancedMesh(geo, mat, nodes.length);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), pos = new THREE.Vector3();
    nodes.forEach((n, i) => {
      const s = sizes[n.d] * (n.end ? 1.6 : 1);
      m4.compose(pos.set(n.x, n.y, n.z), q, sc.set(s, s, s));
      mesh.setMatrixAt(i, m4);
      mesh.setColorAt(i, COL[n.v]);
    });
    mesh.instanceColor.needsUpdate = true;
    group.add(mesh);
    const ep = new Float32Array((nodes.length - 1) * 6), ec = new Float32Array((nodes.length - 1) * 6);
    nodes.forEach((n, i) => {
      if (i === 0) return;
      const p = nodes[n.parent], k = (i - 1) * 6, c = COL[n.v];
      ep.set([p.x, p.y, p.z, n.x, n.y, n.z], k);
      ec.set([c.r, c.g, c.b, c.r, c.g, c.b], k);
    });
    const eg = new THREE.BufferGeometry();
    eg.setAttribute("position", new THREE.BufferAttribute(ep, 3));
    eg.setAttribute("color", new THREE.BufferAttribute(ec, 3));
    const edges = new THREE.LineSegments(eg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.45 }));
    group.add(edges);
    // growth: nodes are in BFS order, so a prefix is a set of complete levels plus part of the next
    let shown = nodes.length, raf = 0, t0 = 0, yaw = 0.3, pitch = 0, drag = null, running = false;
    function setShown(k) { shown = Math.max(1, Math.min(nodes.length, k)); mesh.count = shown; eg.setDrawRange(0, (shown - 1) * 2); }
    const GROW = o.grow === false ? 0 : 3200;
    function frame(t) {
      if (!running) return;
      if (!t0) t0 = t;
      const u = GROW ? Math.min(1, (t - t0) / GROW) : 1;
      setShown(Math.round(nodes.length * u * u * u + 1));
      if (!drag) yaw += 0.0026;
      group.rotation.set(pitch, yaw, 0);
      renderer.render(scene, cam);
      raf = requestAnimationFrame(frame);
    }
    const cv = renderer.domElement;
    cv.setAttribute("data-drag", "");
    cv.addEventListener("pointerdown", (e) => { e.stopPropagation(); drag = { x: e.clientX, y: e.clientY, yaw, pitch }; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener("pointermove", (e) => { if (!drag) return; const k = 1 / (window.deckScale || 1); yaw = drag.yaw + (e.clientX - drag.x) * 0.006 * k; pitch = Math.max(-0.5, Math.min(0.6, drag.pitch + (e.clientY - drag.y) * 0.004 * k)); });
    cv.addEventListener("pointerup", () => { drag = null; });
    cv.addEventListener("click", (e) => e.stopPropagation());
    const counts = [];
    nodes.forEach((n) => { counts[n.d] = (counts[n.d] || 0) + 1; });
    el._counts = counts;
    return {
      enter() { running = true; t0 = 0; setShown(1); cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); },
      leave() { running = false; cancelAnimationFrame(raf); },
      counts,
    };
  };
})();
