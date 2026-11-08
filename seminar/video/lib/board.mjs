// Hình học của các nét trên bảng: độ dài, điểm đầu/cuối, thời gian vẽ.
export const charW = (size) => size * 0.5;

export function itemGeom(it) {
  if (it.k === "text") {
    const w = [...it.s].length * charW(it.size);
    const x0 = it.anchor === "middle" ? it.x - w / 2 : it.x;
    return { len: w, a: [x0, it.y - it.size * 0.3], b: [x0 + w, it.y - it.size * 0.3], bbox: [x0, it.y - it.size * 0.8, w, it.size] };
  }
  if (it.k === "circle") {
    return { len: 2 * Math.PI * it.r, a: [it.cx, it.cy - it.r], b: [it.cx, it.cy - it.r], bbox: [it.cx - it.r, it.cy - it.r, 2 * it.r, 2 * it.r] };
  }
  const pts = it.closed ? [...it.pts, it.pts[0]] : it.pts;
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs), y0 = Math.min(...ys);
  return { len, a: pts[0], b: pts[pts.length - 1], bbox: [x0, y0, Math.max(...xs) - x0, Math.max(...ys) - y0] };
}

export function itemDur(it) {
  const g = itemGeom(it);
  if (it.k === "text") return 0.2 + [...it.s].length * 0.075;
  return 0.12 + g.len / 380;
}
