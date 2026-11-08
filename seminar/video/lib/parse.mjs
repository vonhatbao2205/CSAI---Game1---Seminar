// Tách lời nói của một slide thành các câu, mỗi câu mang danh sách hành động (marker) kèm vị trí ký tự.
const TOKEN = /\{([^}]*)\}|⟦([^|⟧]*)\|([^⟧]*)⟧/g;
const TTS_SUB = [[/π/g, "pi"], [/μ/g, "muy"], [/[“”]/g, ""]];

export function ttsText(s) {
  let out = s;
  for (const [re, rep] of TTS_SUB) out = out.replace(re, rep);
  return out;
}

function parseMarker(raw) {
  if (raw === ">") return { k: "press" };
  if (raw.startsWith("||")) return { k: "pause", v: +raw.slice(2) };
  const i = raw.indexOf(":");
  const k = i < 0 ? raw : raw.slice(0, i), v = i < 0 ? "" : raw.slice(i + 1);
  if (k === "p") return { k: "point", v };
  if (k === "pb") return { k: "pointBoard", v };
  if (k === "d") return { k: "draw", v };
  if (k === "e") return { k: "erase", v: v.split(",") };
  if (k === "g") return { k: "gesture", v };
  if (k === "look") return { k: "look", v };
  if (k === "hands") return { k: "hands", v: +v };
  if (k === "vid") return { k: "video" };
  if (k === "at") return { k: "at", v: +v };
  if (k === "seq") return { k: "seq", v };
  throw new Error("Unknown marker {" + raw + "}");
}

// returns [{type:'sentence', disp, tts, marks:[{k,v,off,doff}], para} | {type:'pause', v}]
export function parseSay(say) {
  const out = [];
  let cur = null, para = false;
  const open = () => { if (!cur) { cur = { type: "sentence", disp: "", tts: "", marks: [], para }; para = false; } return cur; };
  const close = () => {
    if (!cur) return;
    cur.disp = cur.disp.trim(); cur.tts = cur.tts.trim();
    if (cur.disp || cur.marks.length) out.push(cur);
    cur = null;
  };
  const addText = (disp, tts) => {
    const c = open();
    if (!c.disp) { disp = disp.replace(/^\s+/, ""); tts = tts.replace(/^\s+/, ""); }
    c.disp += disp; c.tts += ttsText(tts);
  };
  const plain = (s) => {
    // newline = paragraph break
    const parts = s.split(/\n/);
    parts.forEach((p, pi) => {
      if (pi > 0) { close(); para = true; }
      let rest = p;
      for (;;) {
        const m = /([.?!])(\s+|$)/.exec(rest);
        if (!m) { if (rest) addText(rest, rest); break; }
        const upto = rest.slice(0, m.index + 1);
        addText(upto, upto);
        close();
        rest = rest.slice(m.index + m[0].length);
        if (!rest) break;
      }
    });
  };
  let last = 0, m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(say))) {
    plain(say.slice(last, m.index));
    last = TOKEN.lastIndex;
    if (m[1] !== undefined) {
      const mk = parseMarker(m[1]);
      if (mk.k === "pause") { close(); out.push({ type: "pause", v: mk.v }); continue; }
      const c = open();
      // markers placed before the first word of a sentence sit at offset 0
      mk.off = c.tts.length;
      mk.doff = c.disp.length;
      c.marks.push(mk);
    } else {
      addText(m[2], m[3]);
    }
  }
  plain(say.slice(last));
  close();
  return out;
}
