/* Remote control for the Games 1 deck. One page, two roles chosen per device:
   - "present": the laptop runs the deck (window.bootDeck) and publishes where it is as room presence;
   - "remote":  the phone shows that position, π's line and the notes, and sends commands.
   Commands travel on the room topic "remote", which only people who can edit this artifact may send
   (the platform enforces it). Presence reaches a phone that opens later, so no stored state is needed. */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const KEY = "games1-remote-";
  const store = {
    get(k) { try { return localStorage.getItem(KEY + k); } catch (e) { return null; } },
    set(k, v) { try { if (v === null) localStorage.removeItem(KEY + k); else localStorage.setItem(KEY + k, String(v)); } catch (e) { /* private window */ } },
  };
  const ACTS = ["Mở đầu", "Overview", "Modeling", "Game evaluation", "Expectimax", "Minimax", "Face-off", "Tổng kết"];
  const sections = $$("#stage > section.s");
  const info = sections.map((s, i) => ({
    i, el: s, title: s.dataset.title || "", act: +s.dataset.act || 0, time: +(s.dataset.time || 0),
    opt: s.dataset.opt !== undefined, video: s.classList.contains("video"),
  }));
  const N = info.length;
  const clock = (sec) => { sec = Math.max(0, Math.round(sec)); return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0"); };
  const ICON_PLAY = "M8 5v14l11-7z", ICON_PAUSE = "M6 5h4v14H6zM14 5h4v14h-4z";
  const PRESENCE_KEYS = ["role", "i", "st", "max", "n", "short", "ov", "v", "ack", "ackTo"];

  let mode = null, room = undefined, connected = false, connError = null, canSend = null, booted = false;
  let perm = null, perms = null, downSince = Date.now();

  // ------------------------------------------------------------------ connection status (both roles)
  // The room only admits people signed in to claude.ai who belong to the artifact's organization (or were
  // invited). A visitor who arrives by the public link without signing in can view the page but never joins,
  // so each state below says which device is outside the room and what fixes it.
  const SIGN_IN = "Mở link này khi đã đăng nhập claude.ai bằng tài khoản sở hữu artifact (trên điện thoại: app Claude hoặc trình duyệt đã đăng nhập).";
  function connState() {
    if (perm === "denied") return { s: "off", t: "Máy này đang chặn quyền kết nối của trang.", fix: "manage" };
    if (connError) return { s: "off", t: connError };
    if (room === undefined) return { s: "wait", t: "Đang kết nối…" };
    if (room === null) return { s: "off", t: "Máy này chưa vào được phòng điều khiển. " + SIGN_IN, fix: perm === "prompt" ? "request" : null };
    if (connected) return { s: "on", t: "Đã kết nối" };
    if (perm === "prompt") return { s: "wait", t: "Trang đang chờ bạn cho phép kết nối.", fix: "request" };
    if (Date.now() - downSince > 6000) return { s: "off", t: "Chưa kết nối được phòng điều khiển. Kiểm tra mạng. " + SIGN_IN };
    return { s: "wait", t: "Đang kết nối…" };
  }
  function paintConn() {
    const c = connState();
    $$("[data-conn]").forEach((d) => { d.dataset.state = c.s; });
    $$("[data-conn-text]").forEach((t) => { t.textContent = c.t; });
    $$(".rc-fix").forEach((b) => {
      b.hidden = !c.fix;
      b.dataset.fix = c.fix || "";
      b.textContent = c.fix === "manage" ? "Mở phần quyền" : "Cho phép kết nối";
    });
    if (mode === "remote") renderRemote();
    if (mode === "present") paintPresenterStatus();
  }
  const use = (name) => (window.claude && typeof window.claude.use === "function" ? window.claude.use(name).catch(() => null) : Promise.resolve(null));
  function onRoomError(e) {
    const code = e && e.code;
    if (code === "not_granted" || code === "revoked") connError = "Tài khoản đang mở trang này không vào được phòng điều khiển. " + SIGN_IN;
    else if (code && code !== "upstream_error" && code !== "invalid_argument" && code !== "not_permitted") connError = "Mất kết nối phòng điều khiển. Tải lại trang.";
    refreshPerm();
    paintConn();
  }
  use("room").then((r) => {
    room = r;
    if (r) {
      r.onConnection((c) => {
        if (connected && !c) downSince = Date.now();
        connected = c; paintConn(); if (c) announce();
      }, onRoomError);
      r.onPeers(onPeers, onRoomError);
      r.on("remote", onCommand, onRoomError);
    }
    refreshPerm();
    paintConn();
  });
  use("permissions").then((p) => { perms = p; refreshPerm(); });
  function refreshPerm() {
    if (!perms) return;
    perms.state("room").then((s) => { if (s !== perm) { perm = s; paintConn(); } }).catch(() => {});
  }
  // a viewer's "allow" on the platform dialog; after it, a page whose room was refused must load again
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".rc-fix");
    if (!b || !perms) return;
    if (b.dataset.fix === "manage") {
      perms.manage().then(() => refreshPerm()).catch(() => toast("Mở menu Permissions của artifact (góc trên trang) và bật lại quyền."));
    } else {
      perms.request(["room"]).then((st) => {
        perm = st.room || perm; paintConn();
        if (st.room === "granted") setTimeout(() => { if (!connected) location.reload(); }, 2500);
      });
    }
  });
  setInterval(() => { if (!connected) { refreshPerm(); paintConn(); } }, 1500);
  use("user").then((u) => {
    if (!u) return;
    u.canEdit().then((ok) => { canSend = ok; if (mode === "remote") renderRemote(); });
  });
  const myPeer = () => { const me = room && room.peers().find((p) => p.sameTab); return me ? me.peer : null; };
  function announce() {
    if (!room) return;
    if (mode === "present") pushPresence(true);
    else if (mode === "remote") room.presence(Object.assign(blankPresence(), { role: "remote" })).catch(() => {});
    else room.presence(blankPresence()).catch(() => {});
  }
  function blankPresence() { const o = {}; PRESENCE_KEYS.forEach((k) => { o[k] = null; }); return o; }
  function onPeers() {
    if (mode === "present") paintBadge();
    if (mode === "remote") { checkAck(); renderRemote(); }
  }

  // ------------------------------------------------------------------ chooser
  const chooser = $("#rc-chooser"), ctl = $("#rc-ctl"), viewport = $("#viewport");
  const phoneLike = () => (window.matchMedia && matchMedia("(pointer: coarse)").matches) || window.innerWidth < 760;
  let piHello = null;
  function showChooser() {
    setMode(null);
    chooser.hidden = false;
    document.body.classList.add("rc-ui");
    const suggest = phoneLike() ? "remote" : "present";
    $("#rc-pick-present").classList.toggle("is-suggested", suggest === "present");
    $("#rc-pick-remote").classList.toggle("is-suggested", suggest === "remote");
    $("#rc-pick-present .rc-opt-tag").hidden = suggest !== "present";
    $("#rc-pick-remote .rc-opt-tag").hidden = suggest !== "remote";
    if (!piHello && window.makePi) piHello = window.makePi($("#rc-pi-hello"), { mood: "happy" });
  }
  $("#rc-pick-present").addEventListener("click", () => setMode("present", true));
  $("#rc-pick-remote").addEventListener("click", () => setMode("remote", true));
  $$("[data-switch]").forEach((b) => b.addEventListener("click", () => { closeSheets(); showChooser(); }));
  $("#rc-switch").addEventListener("click", () => showChooser());

  function setMode(m, fromClick) {
    const was = mode;
    mode = m;
    chooser.hidden = true;
    ctl.hidden = m !== "remote";
    viewport.hidden = m !== "present";
    document.body.classList.toggle("rc-ui", m !== "present");
    $("#rc-badge").hidden = true;
    $("#rc-switch").hidden = true;
    if (was === "present" && m !== "present" && booted && window.deck) { const v = window.deck.video(); if (v) v.pause(); }
    if (m === "present") startPresenter(fromClick);
    if (m === "remote") startRemote();
    if (m !== "remote") releaseWake();
    wasOn = false;
    announce();
    paintConn();
  }

  // ------------------------------------------------------------------ presenter (laptop)
  let lastAck = null, lastAckTo = null, lastSent = "", presTimer = 0, phones = -1, switchTimer = 0;
  function startPresenter(fromClick) {
    // the build ships videos with preload="none" and data-poster so a phone never downloads them
    $$("#stage video").forEach((v) => { if (v.dataset.poster && !v.getAttribute("poster")) v.setAttribute("poster", v.dataset.poster); v.preload = "auto"; });
    if (!booted) { booted = true; window.bootDeck(); }
    else { window.dispatchEvent(new Event("resize")); const v = window.deck.video(); if (v) v.play().catch(() => {}); }
    if (fromClick && document.documentElement.requestFullscreen && !document.fullscreenElement) {
      const p = document.documentElement.requestFullscreen(); if (p) p.catch(() => {});
    }
    clearInterval(presTimer);
    presTimer = setInterval(() => { if (mode === "present") pushPresence(false); else clearInterval(presTimer); }, 200);
    phones = -1;
    paintBadge();
  }
  function snapshot() {
    const d = window.deck, i = d.cur(), v = d.video();
    return {
      role: "presenter", i, st: d.step(), max: d.maxStep(i), n: d.count(), short: d.short(), ov: d.overviewOpen(),
      v: v ? { p: v.paused, t: Math.floor(v.currentTime || 0), d: Math.round(v.duration || 0), r: v.playbackRate } : null,
      ack: lastAck, ackTo: lastAckTo,
    };
  }
  function pushPresence(force) {
    if (!room || mode !== "present" || !window.deck) return;
    const s = snapshot(), k = JSON.stringify(s);
    if (!force && k === lastSent) return;
    lastSent = k;
    room.presence(s).catch(() => { lastSent = ""; });
  }
  function onCommand(m) {
    if (mode !== "present" || !window.deck || m.sameTab) return;
    const d = m.data;
    if (!d || typeof d !== "object") return;
    if (d.to && d.to !== myPeer()) return;   // addressed to another laptop
    const deck = window.deck;
    switch (d.act) {
      case "next": deck.next(); break;
      case "prev": deck.prev(); break;
      case "goto": if (!Number.isInteger(d.i) || d.i < 0 || d.i >= deck.count()) return; deck.closeOverlays(); deck.goto(d.i, 0); break;
      case "overview": deck.toggleOverview(); break;
      case "short": deck.toggleShort(); break;
      case "play": deck.toggleVideo(); break;
      case "replay": deck.replayVideo(); break;
      case "seek": if (d.d !== 5 && d.d !== -5) return; deck.seekBy(d.d); break;
      case "rate": deck.stepRate(1, true); break;
      default: return;
    }
    lastAck = Number.isInteger(d.seq) ? d.seq : null;
    lastAckTo = m.peer;
    pushPresence(true);
  }
  // laptop badge: stays up while the laptop is outside the room (phones cannot see it then);
  // otherwise it shows for a few seconds when the room comes up or a phone joins or leaves
  let badgeSticky = false, wasOn = false;
  function badge(state, text, sticky) {
    const b = $("#rc-badge");
    $("#rc-badge-dot").dataset.state = state;
    $("#rc-badge-text").textContent = text;
    b.hidden = false;
    b.classList.toggle("is-sticky", sticky);
    badgeSticky = sticky;
    clearTimeout(badge.t);
    if (!sticky) badge.t = setTimeout(() => { b.hidden = true; }, 3500);
  }
  function paintPresenterStatus() {
    if (mode !== "present") return;
    const c = connState();
    if (c.s === "off" || (c.s === "wait" && c.fix)) {
      const how = perm === "denied" ? "Trang đang bị chặn quyền kết nối." : perm === "prompt" ? "Bấm Cho phép kết nối." : connError || SIGN_IN;
      badge("off", "Laptop chưa vào phòng điều khiển nên điện thoại không thấy máy này. " + how, true);
      wasOn = false;
      return;
    }
    if (c.s === "on" && !wasOn) { wasOn = true; badge("on", "Sẵn sàng nhận lệnh từ điện thoại", false); return; }
    if (c.s !== "on" && badgeSticky) return;
    if (c.s === "on" && badgeSticky) { $("#rc-badge").hidden = true; badgeSticky = false; }
  }
  function paintBadge() {
    if (mode !== "present" || !connected) return;
    const n = room.peers().filter((p) => !p.sameTab && p.presence && p.presence.role === "remote").length;
    if (n === phones) return;
    const first = phones < 0;
    phones = n;
    if (first && n === 0) return;
    badge(n ? "on" : "off", n ? (n === 1 ? "Điện thoại đã kết nối" : n + " điện thoại đã kết nối") : "Điện thoại đã ngắt kết nối", false);
  }
  addEventListener("mousemove", () => {
    if (mode !== "present") return;
    const s = $("#rc-switch"); s.hidden = false;
    clearTimeout(switchTimer);
    switchTimer = setTimeout(() => { if (!s.matches(":hover")) s.hidden = true; }, 2500);
  });

  // ------------------------------------------------------------------ remote (phone)
  let seq = Math.floor(Date.now() % 1e6) * 10, pending = null, chosenPeer = store.get("target"), lastNotesFor = -1;
  let clockStart = +(store.get("clock") || 0) || 0, wake = null, piSmall = null, toastTimer = 0;

  function presenters() {
    if (!room) return [];
    return room.peers().filter((p) => !p.sameTab && p.kind !== "agent" && p.presence && p.presence.role === "presenter" && validState(p.presence));
  }
  function validState(s) {
    return Number.isInteger(s.i) && s.i >= 0 && s.i < N && Number.isInteger(s.st) && s.st >= 0 && Number.isInteger(s.max) && s.max >= 0;
  }
  function target() {
    const list = presenters();
    if (!list.length) return null;
    return list.find((p) => p.peer === chosenPeer) || list.slice().sort((a, b) => b.updatedAt - a.updatedAt)[0];
  }

  function startRemote() {
    if (!piSmall && window.makePi) piSmall = window.makePi($("#rc-pi"), { mood: "neutral" });
    buildHud();
    requestWake();
    renderRemote();
  }
  function buildHud() {
    const hud = $("#rc-hud");
    if (hud.childElementCount) return;
    ACTS.forEach((name, a) => {
      const n = info.filter((x) => x.act === a).length;
      if (!n) return;
      const seg = document.createElement("span"); seg.style.flex = String(n); seg.title = name; seg.dataset.act = a;
      seg.appendChild(document.createElement("i"));
      hud.appendChild(seg);
    });
  }

  function renderRemote() {
    if (mode !== "remote") return;
    const app = ctl, p = target(), s = p && p.presence;
    const c = connState();
    let link = c.t;
    if (c.s === "on") link = p ? (presenters().length > 1 ? presenters().length + " laptop đang chiếu, gửi tới 1 máy" : "Laptop đang trình chiếu") : "Chưa thấy laptop nào đang chiếu";
    $("#rc-link-text").textContent = c.s === "on" ? link : c.s === "wait" ? c.t : "Chưa vào phòng điều khiển";
    $$("[data-conn]", ctl).forEach((d) => { d.dataset.state = c.s === "on" && !p ? "wait" : c.s; });
    const alert = $("#rc-alert"), alertText = $("#rc-alert-text");
    if (c.s === "off" || c.fix) { alert.hidden = false; alertText.textContent = c.t; }
    else if (canSend === false) { alert.hidden = false; alertText.textContent = "Tài khoản đang mở trang này chỉ có quyền xem, nên không gửi lệnh được. Hãy đăng nhập bằng tài khoản sở hữu artifact."; }
    else alert.hidden = true;
    app.classList.toggle("is-blocked", !p || canSend === false || c.s !== "on");
    const tb = $("#rc-target-btn"); tb.hidden = presenters().length < 2;

    if (!s) {
      // say exactly why there is no laptop: this phone is outside the room, the room is empty, or nobody presents
      const others = c.s === "on" ? room.peers().filter((x) => !x.sameTab && x.kind !== "agent") : [];
      let title = "Chưa thấy laptop nào đang trình chiếu", why;
      if (c.s !== "on") { title = "Điện thoại chưa vào phòng điều khiển"; why = c.s === "wait" && !c.fix ? "Đang kết nối với phòng điều khiển…" : "Làm theo dòng báo màu cam ở trên. Khi điện thoại vào phòng, slide đang chiếu trên laptop sẽ hiện ở đây."; }
      else if (!others.length) why = "Điện thoại đã vào phòng, nhưng phòng chỉ có máy này. Laptop chưa vào phòng: trên laptop, mở cùng link khi đã đăng nhập claude.ai bằng cùng tài khoản, rồi chọn Trình chiếu.";
      else why = `Phòng có ${others.length} máy khác nhưng chưa máy nào chọn Trình chiếu. Trên laptop, tải lại trang và chọn Trình chiếu.`;
      $("#rc-n").textContent = "–"; $("#rc-total").textContent = N;
      $("#rc-act").textContent = "Chờ laptop";
      $("#rc-title").textContent = title;
      $("#rc-pips").innerHTML = "";
      $("#rc-say-text").textContent = why;
      if (lastNotesFor !== -2) { lastNotesFor = -2; $("#rc-notes").innerHTML = '<p class="rc-empty">Ghi chú của slide hiện tại sẽ hiện ở đây.</p>'; }
      $("#rc-next").textContent = "";
      $("#rc-video").hidden = true;
      paintHud(-1); paintPace(null);
      return;
    }
    const i = s.i, st = Math.min(s.st, s.max), it = info[i];
    $("#rc-n").textContent = i + 1;
    $("#rc-total").textContent = N;
    $("#rc-act").textContent = ACTS[it.act] + (it.video ? " · video" : "") + (it.opt ? " · có thể lướt" : "") + (it.time ? " · ≈" + it.time + " giây" : "");
    $("#rc-title").textContent = it.title;
    const pips = $("#rc-pips");
    pips.innerHTML = s.max > 0 ? Array.from({ length: s.max + 1 }, (_, k) => `<i class="${k <= st ? "on" : ""}"></i>`).join("") : "";
    pips.setAttribute("aria-label", s.max > 0 ? `Bước ${st + 1} trên ${s.max + 1}` : "");
    // π's line for this step: the last .say whose step has been reached
    let line = null;
    $$(".say", it.el).forEach((e) => { if (+(e.dataset.step || 0) <= st) line = e; });
    $("#rc-say-text").textContent = line ? line.textContent.trim() : it.video ? "Video đang chạy. Nói theo phụ đề trong video." : "Slide này không có lời dẫn.";
    if (piSmall) piSmall.mood(line ? line.dataset.mood || "talk" : "neutral");
    if (lastNotesFor !== i) {
      lastNotesFor = i;
      const box = $("#rc-notes"), n = $(".notes", it.el);
      box.innerHTML = n ? n.innerHTML : '<p class="rc-empty">Slide này không có ghi chú.</p>';
      box.parentElement.scrollTop = 0;
    }
    // what the next press of "Tiếp" does
    const nx = $("#rc-next");
    nx.innerHTML = "";
    const lab = document.createElement("span");
    if (st < s.max) lab.textContent = `Tiếp: bước ${st + 2}/${s.max + 1} của slide này`;
    else {
      let j = i + 1;
      while (j < N && s.short && info[j].opt) j++;
      if (j < N) { lab.textContent = "Tiếp: "; const b = document.createElement("b"); b.textContent = `${j + 1} · ${info[j].title}`; lab.appendChild(b); }
      else lab.textContent = "Đây là slide cuối.";
    }
    nx.appendChild(lab);
    // video row
    const vrow = $("#rc-video"), v = s.v && typeof s.v === "object" ? s.v : null;
    vrow.hidden = !v;
    if (v) {
      $("#rc-play-icon").setAttribute("d", v.p ? ICON_PLAY : ICON_PAUSE);
      $("#rc-vtime").textContent = `${clock(+v.t || 0)} / ${clock(+v.d || 0)}`;
      $("#rc-rate").textContent = (Number.isFinite(+v.r) ? +v.r : 1) + "×";
    }
    $("#rc-ov-btn").setAttribute("aria-pressed", s.ov ? "true" : "false");
    $("#rc-short-btn").setAttribute("aria-pressed", s.short ? "true" : "false");
    paintHud(i);
    paintPace(s);
  }
  function paintHud(i) {
    $$("#rc-hud span").forEach((seg) => {
      const a = +seg.dataset.act, list = info.filter((x) => x.act === a), first = list[0].i;
      const f = i < 0 ? 0 : Math.max(0, Math.min(1, (i - first + 1) / list.length));
      seg.firstChild.style.width = (f * 100).toFixed(1) + "%";
    });
  }
  // the clock compares time spent with the time planned for the slides before this one (data-time on each slide)
  function paintPace(s) {
    const el = $("#rc-elapsed"), pace = $("#rc-pace");
    pace.classList.remove("is-late", "is-early");
    if (!clockStart) { el.textContent = "0:00"; pace.textContent = "tính giờ từ lệnh đầu tiên"; return; }
    const spent = (Date.now() - clockStart) / 1000;
    el.textContent = clock(spent);
    if (!s) { pace.textContent = "đang tính giờ"; return; }
    let planned = 0;
    for (let j = 0; j < s.i; j++) if (!(s.short && info[j].opt)) planned += info[j].time;
    const diff = spent - planned;
    if (Math.abs(diff) < 30) pace.textContent = "đúng kế hoạch";
    else if (diff > 0) { pace.textContent = "chậm " + clock(diff); pace.classList.add("is-late"); }
    else { pace.textContent = "nhanh " + clock(-diff); pace.classList.add("is-early"); }
  }
  setInterval(() => { if (mode === "remote") paintPace(target() && target().presence); }, 1000);

  function send(act, extra) {
    if (!room || !connected) return toast("Chưa kết nối. Kiểm tra mạng rồi bấm lại.");
    if (canSend === false) return toast("Tài khoản này chỉ có quyền xem nên không điều khiển được.");
    const p = target();
    if (!p) return toast("Chưa thấy laptop nào đang trình chiếu.");
    const data = Object.assign({ seq: ++seq, to: p.peer, act }, extra || {});
    pending = { seq: data.seq, act };
    if (!clockStart && (act === "next" || act === "goto")) { clockStart = Date.now(); store.set("clock", clockStart); }
    try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) { /* not offered */ }
    markSending(act, true);
    room.emit("remote", data).catch((e) => {
      pending = null; markSending(act, false);
      if (e && e.code === "not_permitted") { canSend = false; renderRemote(); }
      else toast("Không gửi được lệnh. Bấm lại.");
    });
    setTimeout(() => {
      if (pending && pending.seq === data.seq) { pending = null; markSending(act, false); toast("Laptop chưa nhận lệnh. Nếu slide chưa đổi, bấm lại."); }
    }, 2500);
  }
  function checkAck() {
    if (!pending) return;
    const p = target(), s = p && p.presence;
    if (s && s.ack === pending.seq && s.ackTo === myPeer()) { markSending(pending.act, false); pending = null; }
  }
  function markSending(act, on) {
    const b = act === "next" ? $(".rc-next-btn") : act === "prev" ? $(".rc-prev") : null;
    if (b) b.classList.toggle("is-sending", on);
  }
  function toast(msg) {
    const t = $("#rc-toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
  }

  ctl.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]");
    if (!b) return;
    const act = b.dataset.act;
    if (act === "seek") send("seek", { d: +b.dataset.d });
    else send(act);
  });
  $("#rc-goto-btn").addEventListener("click", openGoto);
  $("#rc-menu-btn").addEventListener("click", () => openSheet($("#rc-menu")));
  $("#rc-clock").addEventListener("click", () => openSheet($("#rc-menu")));
  $("#rc-clock-reset").addEventListener("click", () => { clockStart = 0; store.set("clock", null); closeSheets(); renderRemote(); toast("Đồng hồ sẽ chạy từ lệnh kế tiếp."); });
  $("#rc-target-btn").addEventListener("click", () => {
    const list = presenters(); if (list.length < 2) return;
    const cur = target(), k = list.findIndex((p) => p === cur), nxt = list[(k + 1) % list.length];
    chosenPeer = nxt.peer; store.set("target", chosenPeer);
    closeSheets(); renderRemote(); toast(`Đang gửi lệnh tới laptop ở slide ${nxt.presence.i + 1}.`);
  });
  $$("[data-close]").forEach((b) => b.addEventListener("click", closeSheets));
  function openSheet(el) { closeSheets(); el.hidden = false; const f = $("[data-close]", el); if (f) f.focus(); }
  function closeSheets() { $("#rc-goto").hidden = true; $("#rc-menu").hidden = true; }
  addEventListener("keydown", (e) => { if (e.key === "Escape" && mode === "remote") closeSheets(); });

  function openGoto() {
    const list = $("#rc-goto-list"), p = target(), s = p && p.presence;
    list.innerHTML = "";
    let group = null;
    info.forEach((it) => {
      if (!group || +group.dataset.act !== it.act) {
        group = document.createElement("div"); group.dataset.act = it.act;
        const h = document.createElement("p"); h.className = "rc-goto-act"; h.textContent = ACTS[it.act];
        group.appendChild(h); list.appendChild(group);
      }
      const b = document.createElement("button");
      b.type = "button";
      b.className = "rc-goto-item" + (s && s.i === it.i ? " is-current" : "") + (s && s.short && it.opt ? " is-skipped" : "");
      const n = document.createElement("span"); n.className = "n"; n.textContent = it.i + 1;
      const t = document.createElement("span"); t.className = "t"; t.textContent = it.title;
      b.append(n, t);
      if (it.video || it.opt) { const g = document.createElement("span"); g.className = "tag"; g.textContent = it.video ? "video" : "có thể lướt"; b.appendChild(g); }
      b.addEventListener("click", () => { closeSheets(); send("goto", { i: it.i }); });
      group.appendChild(b);
    });
    openSheet($("#rc-goto"));
    const cur = $(".is-current", list);
    if (cur) cur.scrollIntoView({ block: "center" });
  }

  // keep the phone awake while it is the remote
  async function requestWake() {
    try { if (navigator.wakeLock && !wake) { wake = await navigator.wakeLock.request("screen"); wake.addEventListener("release", () => { wake = null; }); } } catch (e) { wake = null; }
  }
  function releaseWake() { try { if (wake) wake.release(); } catch (e) { /* already gone */ } wake = null; }
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && mode === "remote") requestWake(); });

  // ------------------------------------------------------------------ start: every load asks which role this device takes
  showChooser();
  paintConn();
})();
