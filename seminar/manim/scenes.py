"""ManimGL (3b1b/manim) scenes for the Games 1 seminar (nhóm 10).

Light stage like the deck, π narrator with captions (from the RMQ v2 template), the pixel Agent and Opponent
from sprites.json, and one colour per role: blue = agent/MAX, rose = opponent/MIN, violet = expectation,
teal = game evaluation, orange = the node being computed, green = the chosen action.

    source env.sh && manimgl scenes.py M04_Minimax -w --hd
    ./render_all.sh --hd            # every scene, 1080p, into ../deck/dist/media
"""
import json
import re
from pathlib import Path

import manimpango
from manimlib import *

HERE = Path(__file__).resolve().parent
for _f in sorted((HERE / "fonts").glob("*.ttf")):
    manimpango.register_font(str(_f))

FONT, SERIF, MONO, PIXEL, PIXVI = "Be Vietnam Pro", "Source Serif 4", "Source Code Pro", "Press Start 2P", "VT323"
FPS = 30
BG, INK, INK2, MUTED, FAINT, CELL = "#FAFAF7", "#17202B", "#3B4757", "#5F6B7B", "#C3CBD5", "#FFFFFF"
MAXC, MINC, CHANCE, EVALC, CUR, WIN, LOSS = "#1C7ED6", "#D6336C", "#7048E8", "#0B8F86", "#E8590C", "#2B8A3E", "#D9363E"
MAX_BG, MIN_BG, CH_BG, EV_BG, CUR_BG, WIN_BG, LOSS_BG = "#E7F0FB", "#FFE3EC", "#EFE9FF", "#D7F4F0", "#FFF0E3", "#E3F6E6", "#FFE8E8"
BOXC = {"A": "#E67700", "B": "#0C8599", "C": "#9C36B5"}
PI_BLUE = "#2FA8FF"
MINUS = "−"


def reading_time(text):
    plain = "".join(p for i, p in enumerate(str(text).split("$")) if i % 2 == 0)
    return max(1.4, 0.052 * len(plain))


def T(s, size=30, color=INK, weight="NORMAL", font=FONT):
    t = Text(str(s), font=font, font_size=size, weight=weight)
    t.set_fill(color, 1).set_stroke(width=0)
    return t


_SYMBOLS = [("\\mathrm{", "{"), ("\\max", " max"), ("\\min", " min"), ("\\le", "≤"), ("\\ge", "≥"), ("\\cdot", "·"),
            ("\\pi", "π"), ("\\mu", "μ"), ("\\infty", "∞"), ("\\,", " ")]


def _math_markup(m):
    m = m.replace("&", "&amp;").replace("<", " &lt; ").replace(">", " &gt; ")
    for a, b in _SYMBOLS:
        m = m.replace(a, b)
    m = m.replace("-", "−")
    m = re.sub(r"(?<![A-Za-z&])([A-Za-z])(?![A-Za-z;])", r"<i>\1</i>", m)
    m = re.sub(r"_\{([^}]*)\}", r"<sub>\1</sub>", m)
    m = re.sub(r"_(<i>\w</i>|\w)", r"<sub>\1</sub>", m)
    m = m.replace("{", "").replace("}", "").replace("=", " = ")
    return re.sub(r" +", " ", m).strip()


def markup(text):
    parts = str(text).split("$")
    return "".join(_math_markup(p) if i % 2 else p.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                   for i, p in enumerate(parts))


class Markup(MarkupText):
    def validate_markup_string(self, markup_str):
        error = manimpango.MarkupUtils.validate(markup_str)
        if error:
            raise ValueError(f"Invalid Pango markup {markup_str!r}: {error}")


def L(s, size=30, color=INK, weight="NORMAL"):
    if "$" not in str(s):
        return T(s, size, color, weight)
    t = Markup(markup(s), font=FONT, font_size=size, weight=weight, use_labelled_svg=True,
               path_string_config=dict(use_simple_quadratic_approx=True))
    return t.set_fill(color, 1).set_stroke(width=0)


def M(tex, size=40, color=INK):
    return Tex(tex, font_size=size).set_fill(color, 1)


def num(x):
    return str(x).replace("-", MINUS)


# ------------------------------------------------------------------ π narrator (same outline as the deck)
SHAPE = json.loads((HERE / "pi_shape.json").read_text())


def _mouth_points(mood):
    w, top, bot = SHAPE["moods"][mood]
    xs = np.linspace(-1, 1, 16)
    return [(x * w, top * (1 - x * x)) for x in xs] + [(x * w, bot * (1 - x * x)) for x in xs[::-1][1:-1]]


class Pi(VGroup):
    def __init__(self, height=1.6, mood="neutral"):
        super().__init__()
        self.u = u = height / 250
        self.to_xy = lambda x, y: np.array([(x - 110) * u, (125 - y) * u, 0])
        shape = lambda poly: VMobject().set_points_as_corners([self.to_xy(*p) for p in [*poly, poly[0]]]).set_fill(PI_BLUE, 1).set_stroke(width=0)
        self.body = VGroup(*[shape(p) for p in SHAPE["body"]])
        self.arm_l, self.arm_r = shape(SHAPE["armL"]), shape(SHAPE["armR"])
        self.shoulder_l = Dot(self.to_xy(*SHAPE["shoulderL"]), radius=0.001).set_opacity(0)
        self.shoulder_r = Dot(self.to_xy(*SHAPE["shoulderR"]), radius=0.001).set_opacity(0)
        self.whites, self.pupils = VGroup(), VGroup()
        for e in SHAPE["eyes"]:
            white = Ellipse(width=2 * e["rx"] * u, height=2 * e["ry"] * u).set_fill("#FFFFFF", 1).set_stroke(INK, 2.5)
            self.whites.add(white.move_to(self.to_xy(e["cx"], e["cy"])))
            self.pupils.add(Circle(radius=SHAPE["pupil"] * u).set_fill("#000000", 1).set_stroke(width=0).move_to(self.to_xy(e["cx"] + 3, e["cy"] + 4)))
        self.mouth = VMobject().set_fill("#06233B", 1).set_stroke(width=0)
        m = SHAPE["mouth"]
        pts = [self.to_xy(m["cx"] + x, m["cy"] + y) for x, y in _mouth_points(mood)]
        self.mouth.set_points_as_corners([*pts, pts[0]])
        self.add(self.arm_l, self.arm_r, self.body, self.whites, self.pupils, self.mouth, self.shoulder_l, self.shoulder_r)

    def change(self, mood):
        h = self.body.get_height()
        ref = Pi(self.u * 250, mood)
        ref.scale(h / ref.body.get_height()).shift(self.body.get_center() - ref.body.get_center())
        self.mouth.become(ref.mouth)
        return self

    def gesture(self, both=False, up=0.75):
        anims = [Rotate(self.arm_r, up, about_point=self.shoulder_r.get_center(), rate_func=there_and_back)]
        if both:
            anims.append(Rotate(self.arm_l, -up * 0.7, about_point=self.shoulder_l.get_center(), rate_func=there_and_back))
        return anims


# ------------------------------------------------------------------ pixel characters (sprites.json)
SPR = json.loads((HERE / "sprites.json").read_text())
TEAM = {"max": {"A": MAXC, "a": "#74C0FC", "O": MAXC, "o": "#74C0FC"}, "min": {"A": MINC, "a": "#FAA2C1", "O": MINC, "o": "#FAA2C1"}}


def sprite(key, height=1.3, team=None):
    rows, u = SPR["frames"][key], height / SPR["h"]
    pal = dict(SPR["palette"], **(TEAM[team] if team else {}))
    # an invisible frame the size of the whole grid, so sizes and sign anchors follow the grid, not the pixels drawn
    g = VGroup(Rectangle(width=SPR["w"] * u, height=SPR["h"] * u).set_stroke(width=0).set_fill(BG, 0)
               .move_to([SPR["w"] * u / 2, -SPR["h"] * u / 2, 0]))
    for y, row in enumerate(rows):
        x = 0
        while x < len(row):
            c, e = row[x], x + 1
            while e < len(row) and row[e] == c:
                e += 1
            if c != ".":
                r = Rectangle(width=(e - x) * u, height=u).set_fill(pal[c], 1).set_stroke(pal[c], 0.6)
                g.add(r.move_to([(x + (e - x) / 2) * u, -(y + 0.5) * u, 0]))
            x = e
    g.u = u
    return g


class Player(VGroup):
    """A pixel character with a name plate; raise() holds a sign towards `towards`."""

    def __init__(self, char="robot", team="max", name="", height=1.3, side="L"):
        super().__init__()
        self.ch, self.team, self.h, self.side = ("agent" if char == "robot" else "opp"), team, height, side
        self.pose, self.mood_ = "idle", "normal"
        self.fig = sprite(self._key(), height, team)
        self.fig.move_to(ORIGIN)
        self.add(self.fig)
        if name:
            self.name = T(name, 34, MAXC if team == "max" else MINC, font=PIXVI).next_to(self.fig, DOWN, buff=0.08)
            self.add(self.name)

    def _key(self):
        return f"{self.ch}_{self.pose}_{self.mood_}"

    def frame(self, pose=None, mood=None):
        """Animation that redraws the sprite in place."""
        if pose:
            self.pose = pose
        if mood:
            self.mood_ = mood
        new = sprite(self._key(), self.h, self.team).move_to(self.fig.get_center())
        return Transform(self.fig, new, run_time=0.25)

    def sign(self, text, font=PIXEL):
        towards = "raiseR" if self.side == "L" else "raiseL"
        ax, ay = SPR["anchors"][towards]
        u = self.fig.u
        left, top = self.fig.get_left()[0], self.fig.get_top()[1]
        hand = np.array([left + ax * u, top - ay * u, 0])
        lab = T(num(text), 22 if font == PIXEL else 30, INK, font=font, weight="NORMAL" if font == PIXEL else "BOLD")
        w = max(0.62, lab.get_width() + 0.34)
        disc = RoundedRectangle(width=w, height=0.6, corner_radius=0.29).set_fill("#FFFFFF", 1).set_stroke(INK, 3.5)
        stick = Rectangle(width=0.07, height=7 * u).set_fill("#8A6A3D", 1).set_stroke(INK, 1.5)
        stick.move_to(hand + UP * 3.5 * u)
        disc.move_to(stick.get_top() + UP * 0.28)
        lab.move_to(disc)
        return VGroup(stick, disc, lab)


# ------------------------------------------------------------------ game trees
KSTYLE = {"max": (MAX_BG, MAXC), "min": (MIN_BG, MINC), "chance": (CH_BG, CHANCE), "eval": (EV_BG, EVALC), "term": (CELL, INK2)}


class GTree(VGroup):
    def __init__(self, spec, x0=-4.6, x1=4.6, y0=2.25, y1=-1.85, r=0.42, lr=0.34, fs=30):
        super().__init__()
        self.r, self.lr, self.fs = r, lr, fs
        nodes, cnt = [], {"leaves": 0, "depth": 0}

        def walk(n, d, parent, edge):
            n["d"], n["parent"], n["edge"] = d, parent, edge
            nodes.append(n)
            cnt["depth"] = max(cnt["depth"], d)
            if not n.get("kids"):
                n["lx"] = cnt["leaves"]
                cnt["leaves"] += 1
            else:
                for e in n["kids"]:
                    walk(e["n"], d + 1, n, e)
                n["lx"] = sum(e["n"]["lx"] for e in n["kids"]) / len(n["kids"])

        walk(spec, 0, None, None)
        Lc, D = cnt["leaves"], cnt["depth"]
        for n in nodes:
            n["pos"] = np.array([x0 + (x1 - x0) * n["lx"] / max(1, Lc - 1), y0 + (y1 - y0) * n["d"] / max(1, D), 0])
        self.nodes = {n["id"]: n for n in nodes}
        self.spec = spec
        self.edges, self.elabels, self.plabels, self.shapes, self.vals = VGroup(), {}, {}, {}, {}
        self.E = {}
        for n in nodes:
            if n["parent"] is not None:
                ln = self._edge_line(n["parent"], n)
                self.E[n["id"]] = ln
                self.edges.add(ln)
        self.labels = VGroup()
        for n in nodes:
            if n["parent"] is not None and n["edge"].get("a"):
                lab = T(n["edge"]["a"], 26, MUTED)
                p, c = n["parent"]["pos"], n["pos"]
                mid = p + (c - p) * 0.42
                side = np.sign(c[0] - p[0])
                lab.move_to(mid + RIGHT * 0.32 * (side if side else 1) + UP * 0.06)
                self.elabels[n["id"]] = lab
                self.labels.add(lab)
        self.shapes_g = VGroup()
        for n in nodes:
            s = self._shape(n["k"]).move_to(n["pos"] + self._shape_shift(n["k"]))
            self.shapes[n["id"]] = s
            self.shapes_g.add(s)
        self.vals_g = VGroup()
        for n in nodes:
            if n.get("v") is not None and n.get("v") != "":
                v = self._val(n, n["v"])
                self.vals[n["id"]] = v
                self.vals_g.add(v)
        self.add(self.edges, self.labels, self.shapes_g, self.vals_g)

    # geometry
    def _shape(self, k):
        r, lr = self.r, self.lr
        if k == "max":
            s = Polygon(UP * r * 1.05, RIGHT * r * 1.15 + DOWN * r * 0.78, LEFT * r * 1.15 + DOWN * r * 0.78)
        elif k == "min":
            s = Polygon(LEFT * r * 1.15 + UP * r * 0.78, RIGHT * r * 1.15 + UP * r * 0.78, DOWN * r * 1.05)
        elif k == "term":
            s = RoundedRectangle(width=2 * lr, height=2 * lr, corner_radius=0.07)
        else:
            s = Circle(radius=r * 0.95)
        fill, stroke = KSTYLE[k]
        return s.set_fill(fill, 1).set_stroke(stroke, 3 if k == "term" else 4.5)

    def _shape_shift(self, k):
        return ORIGIN  # polygons above are built around the node centre

    def _top(self, k):
        return {"max": self.r * 1.05, "min": self.r * 0.78, "term": self.lr}.get(k, self.r * 0.95)

    def _bot(self, k):
        return {"max": self.r * 0.78, "min": self.r * 1.05, "term": self.lr}.get(k, self.r * 0.95)

    def _edge_line(self, p, c):
        a = p["pos"] + DOWN * self._bot(p["k"])
        b = c["pos"] + UP * self._top(c["k"])
        return Line(a, b).set_stroke(FAINT, 4)

    def _vpos(self, n):
        k = n["k"]
        return n["pos"] + (DOWN * self.r * 0.3 if k == "max" else UP * self.r * 0.3 if k == "min" else ORIGIN)

    def _val(self, n, v, color=INK):
        t = T(num(v), self.fs if n["k"] != "term" else self.fs * 0.92, color, font=MONO, weight="BOLD" if n["k"] != "term" else "NORMAL")
        lim = 2 * self.lr * 0.86 if n["k"] == "term" else 2 * self.r * 1.25
        if t.get_width() > lim:
            t.set_width(lim)
        return t.move_to(self._vpos(n))

    # animations
    def set_val(self, nid, v, color=INK):
        n = self.nodes[nid]
        new = self._val(n, v, color)
        old = self.vals.get(nid)
        self.vals[nid] = new
        anims = [FadeIn(new, scale=0.5)]
        if old is not None:
            anims.append(FadeOut(old))
        return anims

    def kind(self, nid, k):
        n = self.nodes[nid]
        n["k"] = k
        new = self._shape(k).move_to(n["pos"])
        anims = [Transform(self.shapes[nid], new)]
        if nid in self.vals:
            anims.append(self.vals[nid].animate.move_to(self._vpos(n)))
        for e in n.get("kids") or []:
            c = e["n"]
            anims.append(Transform(self.E[c["id"]], self._edge_line(n, c).match_style(self.E[c["id"]])))
        if n["parent"] is not None:
            anims.append(Transform(self.E[nid], self._edge_line(n["parent"], n).match_style(self.E[nid])))
        return anims

    def hl(self, nid, color=CUR, w=8):
        return self.shapes[nid].animate.set_stroke(color, w)

    def unhl(self, nid):
        fill, stroke = KSTYLE[self.nodes[nid]["k"]]
        return self.shapes[nid].animate.set_stroke(stroke, 3 if self.nodes[nid]["k"] == "term" else 4.5)

    def bold(self, nid, color=WIN, w=10):
        return self.E[nid].animate.set_stroke(color, w, opacity=1)

    def dim(self, nid):
        return self.E[nid].animate.set_stroke(FAINT, 3, opacity=0.4)

    def plain(self, nid):
        return self.E[nid].animate.set_stroke(FAINT, 4, opacity=1)

    def prob(self, nid, text, color=CHANCE):
        """Label near the child end of the edge into nid."""
        n = self.nodes[nid]
        p, c = n["parent"]["pos"], n["pos"]
        at = p + (c - p) * 0.68
        side = np.sign(c[0] - p[0]) or 1
        lab = T(text, 24, color, font=MONO, weight="BOLD").move_to(at + LEFT * 0.3 * side + UP * 0.02)
        old = self.plabels.get(nid)
        self.plabels[nid] = lab
        return [FadeIn(lab)] + ([FadeOut(old)] if old is not None else [])


BOX = {"A": (-50, 50), "B": (1, 3), "C": (-5, 15)}


def box_spec(opp="chance", root="eval", values=False):
    vals = {"A": 0, "B": 2, "C": 5}
    return {"id": "r", "k": root, "kids": [
        {"a": b, "n": {"id": b, "k": opp, "v": vals[b] if values else None,
                       "kids": [{"a": "", "n": {"id": f"{b}{j}", "k": "term", "v": u}} for j, u in enumerate(BOX[b])]}}
        for b in "ABC"]}


def eq_box(tex, color=INK, size=40):
    m = M(tex, size, color)
    box = RoundedRectangle(width=m.get_width() + 0.5, height=m.get_height() + 0.36, corner_radius=0.14)
    box.set_fill(BG, 0).set_stroke(width=0)   # formulas sit on the page, no frame
    m.move_to(box)
    return VGroup(box, m)


# ------------------------------------------------------------------ base scene: heading, π, captions
class Base(Scene):
    default_camera_config = dict(background_color=BG, fps=FPS)
    heading = ""

    def setup(self):
        super().setup()
        self.caption = None
        self.pi = Pi(1.55).move_to([-6.15, -3.05, 0])
        if self.heading:
            self.head = T(self.heading, 32, INK, font=SERIF, weight="BOLD").to_corner(UL, buff=0.34)
            self.add(self.head)
        self.add(self.pi)
        self.n_said = 0

    def say(self, text, mood=None, color=INK, run_time=0.45, wait=True):
        new = L(text, 30, color)
        if new.get_width() > 11.8:
            new.set_width(11.8)
        new.move_to([-5.15 + new.get_width() / 2, -3.32, 0])
        anims = [FadeIn(new, shift=0.12 * UP)]
        if self.caption is not None:
            anims.append(FadeOut(self.caption, shift=0.12 * UP))
        if mood:
            t = self.pi.generate_target()
            t.change(mood)
            anims.append(MoveToTarget(self.pi))
        self.play(*anims, run_time=run_time)
        self.caption = new
        self.n_said += 1
        self.play(*self.pi.gesture(both=self.n_said % 3 == 0), run_time=0.8)
        if wait:
            self.wait(max(0.2, reading_time(text) - 0.8))

    def blink(self):
        eyes = VGroup(self.pi.whites, self.pi.pupils)
        self.play(eyes.animate.stretch(0.08, 1, about_point=eyes.get_center()), rate_func=there_and_back, run_time=0.22)

    def done(self, wait=2.0):
        self.wait(wait / 2)
        self.blink()
        self.wait(wait / 2)

    def roles(self, tree, rows, h=1.05):
        """Pixel role badges on the left, one per tree level: rows = [(level, char, team, name)]."""
        g = VGroup()
        for lvl, ch, team, name in rows:
            y = [n["pos"][1] for n in tree.nodes.values() if n["d"] == lvl][0]
            if ch == "term":
                b = T("KẾT CỤC", 30, INK2, font=PIXVI).move_to([-6.35, y, 0])
                g.add(b)
                continue
            p = Player(ch, team, name, height=h, side="L")
            p.move_to([-6.35, y - 0.1, 0])
            g.add(p)
        return g


# ================================================================== M01 Game evaluation
class M01_GameEval(Base):
    heading = "Game evaluation · trò ba hộp"

    def construct(self):
        tr = GTree(box_spec("chance", "eval"))
        roles = self.roles(tr, [(0, "robot", "max", "AGENT · π"), (1, "human", "min", "ĐỐI THỦ · μ"), (2, "term", None, None)])
        self.play(FadeIn(tr.edges), FadeIn(tr.labels), LaggedStart(*[FadeIn(s, scale=0.7) for s in tr.shapes_g], lag_ratio=0.05),
                  FadeIn(tr.vals_g), FadeIn(roles), run_time=1.4)
        self.say("Hai policy đã biết: agent luôn chọn hộp A, đối thủ chọn đều hai số.", "talk")
        anims = []
        for b, p in zip("ABC", ["1", "0", "0"]):
            anims += tr.prob(b, p, EVALC)
            for j in (0, 1):
                anims += tr.prob(f"{b}{j}", "½")
        self.play(*anims, *[tr.bold(f"{b}{j}", CHANCE, 6) for b in "ABC" for j in (0, 1)], run_time=0.8)
        self.wait(0.6)
        eqs = {"A": r"\tfrac12\cdot(-50)+\tfrac12\cdot 50=0", "B": r"\tfrac12\cdot 1+\tfrac12\cdot 3=2", "C": r"\tfrac12\cdot(-5)+\tfrac12\cdot 15=5"}
        vals = {"A": "0", "B": "2", "C": "5"}
        eq = None
        for i, b in enumerate("ABC"):
            new = eq_box(eqs[b], CHANCE, 40).to_corner(UR, buff=0.45).shift(DOWN * 0.15)
            self.play(tr.hl(b), *( [FadeOut(eq)] if eq else []), FadeIn(new, shift=0.1 * DOWN), run_time=0.5)
            eq = new
            if i == 0:
                self.say("Mỗi hộp lấy trung bình value của hai leaf, với trọng số theo μ.", "think")
            else:
                self.wait(0.9)
            self.play(*tr.set_val(b, vals[b]), run_time=0.5)
            self.play(tr.unhl(b), run_time=0.3)
        new = eq_box(r"1\cdot 0+0\cdot 2+0\cdot 5=0", EVALC, 42).to_corner(UR, buff=0.45).shift(DOWN * 0.15)
        self.play(tr.hl("r"), FadeOut(eq), FadeIn(new, shift=0.1 * DOWN), run_time=0.5)
        eq = new
        self.say("Root lấy trung bình theo π: chỉ hộp A có trọng số 1.", "talk")
        self.play(*tr.set_val("r", "0", EVALC), tr.bold("A", WIN), tr.dim("B"), tr.dim("C"), run_time=0.6)
        self.play(tr.unhl("r"), run_time=0.3)
        self.say("C có expected utility 5. Policy đang xét vẫn chọn A, nên root bằng 0.", "think")
        self.say("Đổi policy agent thành chọn đều ba hộp.", "talk", wait=False)
        anims = []
        for b in "ABC":
            anims += tr.prob(b, "⅓", EVALC)
        self.play(*anims, tr.bold("A", EVALC, 7), tr.bold("B", EVALC, 7), tr.bold("C", EVALC, 7), run_time=0.7)
        new = eq_box(r"\tfrac13\cdot 0+\tfrac13\cdot 2+\tfrac13\cdot 5=\tfrac73", EVALC, 42).to_corner(UR, buff=0.45).shift(DOWN * 0.15)
        self.play(FadeOut(eq), FadeIn(new, shift=0.1 * DOWN), tr.hl("r"), run_time=0.5)
        self.play(*tr.set_val("r", "7/3", EVALC), run_time=0.6)
        self.play(tr.unhl("r"), run_time=0.3)
        self.say("Chọn đều ba hộp cho value 7/3. Game evaluation tính value của policy được đưa vào.", "happy")
        self.done()


# ================================================================== M02 Expectimax
class M02_Expectimax(Base):
    heading = "Expectimax · trò ba hộp"

    def construct(self):
        tr = GTree(box_spec("chance", "eval", values=True), x0=-4.8, x1=3.5)
        roles = self.roles(tr, [(0, "robot", "max", "AGENT"), (1, "human", "min", "ĐỐI THỦ · μ"), (2, "term", None, None)])
        agent = roles[0]
        anims = []
        for b in "ABC":
            for j in (0, 1):
                anims += tr.prob(f"{b}{j}", "½")
        self.play(FadeIn(tr), FadeIn(roles), *anims, *[tr.bold(f"{b}{j}", CHANCE, 6) for b in "ABC" for j in (0, 1)], run_time=1.2)
        self.say("Vẫn biết đối thủ chọn đều, nên tầng hộp giữ nguyên 0, 2, 5.", "talk")
        self.play(*tr.kind("r", "max"), run_time=0.8)
        self.say("Agent được chọn action, nên root trở thành node MAX.", "surprised")
        eq = eq_box(r"\max(0,\ 2,\ 5)=5", MAXC, 44).to_corner(UR, buff=0.45).shift(DOWN * 0.15)
        self.play(tr.hl("r"), FadeIn(eq, shift=0.1 * DOWN), run_time=0.5)
        for b in "ABC":
            self.play(Indicate(tr.vals[b], color=CUR, scale_factor=1.5), run_time=0.55)
        self.play(*tr.set_val("r", "5", MAXC), tr.bold("C", WIN), tr.dim("A"), tr.dim("B"), run_time=0.6)
        sign = agent.sign("C")
        self.play(agent.frame("raiseR", "happy"), FadeIn(sign, shift=0.2 * UP), tr.unhl("r"), run_time=0.5)
        self.say("Agent chọn C. Expectimax value bằng 5.", "happy")
        self.say("Một ván thật thì sao? Đối thủ chọn ngẫu nhiên một số trong hộp C.", "think", wait=False)
        opp = roles[1]
        tally = VGroup()
        for k, (j, u) in enumerate([(0, -5), (1, 15), (1, 15), (0, -5)]):
            leaf = f"C{j}"
            s2 = opp.sign(str(u))
            self.play(tr.hl(leaf, CUR, 8), FadeIn(s2, shift=0.15 * UP), opp.frame("raiseR", "happy" if u < 0 else "sad"), run_time=0.4)
            row = T(f"ván {k + 1}: {num(u)}", 28, LOSS if u < 0 else WIN, font=MONO)
            row.move_to([4.55 + row.get_width() / 2, 1.5 - 0.5 * k, 0])
            tally.add(row)
            self.play(FadeIn(row, shift=0.1 * LEFT), run_time=0.35)
            self.wait(0.35)
            self.play(tr.unhl(leaf), FadeOut(s2), opp.frame("idle", "normal"), run_time=0.3)
        avg = T("trung bình: 5", 30, MAXC, font=MONO, weight="BOLD")
        avg.move_to([4.55 + avg.get_width() / 2, 1.5 - 0.5 * 4 - 0.1, 0])
        self.play(FadeIn(avg, shift=0.1 * UP), run_time=0.5)
        self.say("Mỗi ván cho −5 hoặc 15. Expected utility theo mô hình là 5.", "talk")
        self.done()


# ================================================================== M03 sensitivity to the opponent model
class M03_Sensitivity(Base):
    heading = "Expectimax · độ nhạy theo mô hình đối thủ"

    def construct(self):
        ax = Axes(x_range=(0, 1, 0.1), y_range=(-50, 50, 25), width=8.4, height=5.0,
                  axis_config=dict(stroke_color=MUTED, stroke_width=2.5, include_tip=False))
        ax.move_to([-1.1, 0.45, 0])
        xl = VGroup(*[T(f"{v:.1f}".replace(".", ","), 20, MUTED, font=MONO).next_to(ax.c2p(v, -50), DOWN, buff=0.12) for v in (0, 0.2, 0.4, 0.6, 0.8, 1.0)])
        yl = VGroup(*[T(num(v), 20, MUTED, font=MONO).next_to(ax.c2p(0, v), LEFT, buff=0.12) for v in (-50, -25, 0, 25, 50)])
        xt = T("p = xác suất đối thủ chọn số nhỏ", 24, MUTED).next_to(ax.c2p(1, -50), DOWN, buff=0.45).align_to(ax.c2p(1, -50), RIGHT)
        zero = DashedLine(ax.c2p(0, 0), ax.c2p(1, 0)).set_stroke(FAINT, 2)
        self.play(FadeIn(ax), FadeIn(xl), FadeIn(yl), FadeIn(xt), FadeIn(zero), run_time=0.8)
        fs = {"A": (lambda p: 50 - 100 * p, r"V_A=50-100p"), "B": (lambda p: 3 - 2 * p, r"V_B=3-2p"), "C": (lambda p: 15 - 20 * p, r"V_C=15-20p")}
        legend = VGroup(*[M(fs[b][1], 36, BOXC[b]) for b in "ABC"]).arrange(DOWN, aligned_edge=LEFT, buff=0.3).move_to([5.0, 1.9, 0])
        self.say("Đặt p là xác suất đối thủ chọn số nhỏ, dùng chung cho ba hộp.", "talk")
        lines = {}
        for b in "ABC":
            f = fs[b][0]
            ln = Line(ax.c2p(0, f(0)), ax.c2p(1, f(1))).set_stroke(BOXC[b], 5)
            lines[b] = ln
            self.play(ShowCreation(ln), FadeIn(legend["ABC".index(b)], shift=0.1 * LEFT), run_time=0.8)
        self.say("Expected utility của mỗi hộp là một đường thẳng theo p.", "think")
        env_pts = [ax.c2p(p, max(f(p) for f, _ in fs.values())) for p in [0, 7 / 16, 2 / 3, 1]]
        env = VMobject().set_points_as_corners(env_pts).set_stroke(INK, 14, opacity=0.18)
        self.play(ShowCreation(env), run_time=1.2)
        self.say("Expectimax lấy max: luôn đi theo đường cao nhất.", "talk")
        # thresholds
        t1 = eq_box(r"\begin{aligned}50-100p&=15-20p\\ \Rightarrow\ p&=\tfrac{7}{16}\end{aligned}", INK, 32).move_to([5.05, 0.05, 0])
        d1 = Dot(ax.c2p(7 / 16, 25 / 4), radius=0.09).set_fill(INK, 1)
        v1 = DashedLine(ax.c2p(7 / 16, 25 / 4), ax.c2p(7 / 16, -50)).set_stroke(INK, 2)
        self.play(FadeIn(t1, shift=0.1 * UP), FadeIn(d1, scale=0.3), ShowCreation(v1), run_time=0.8)
        self.say("A gặp C tại p = 7/16: từ đây C tốt hơn A.", "talk")
        t2 = eq_box(r"\begin{aligned}15-20p&=3-2p\\ \Rightarrow\ p&=\tfrac{2}{3}\end{aligned}", INK, 32).move_to([5.05, -1.55, 0])
        d2 = Dot(ax.c2p(2 / 3, 5 / 3), radius=0.09).set_fill(INK, 1)
        v2 = DashedLine(ax.c2p(2 / 3, 5 / 3), ax.c2p(2 / 3, -50)).set_stroke(INK, 2)
        self.play(FadeIn(t2, shift=0.1 * UP), FadeIn(d2, scale=0.3), ShowCreation(v2), run_time=0.8)
        self.say("C gặp B tại p = 2/3: từ đây B tốt nhất.", "talk")
        pab = 47 / 98
        d3 = Circle(radius=0.11).set_stroke(MUTED, 3).set_fill(BG, 1).move_to(ax.c2p(pab, 50 - 100 * pab))
        n3 = T("A = B tại 47/98, nhưng C cao hơn", 24, MUTED).move_to(ax.c2p(0.62, -30))
        ar = Arrow(n3.get_top(), d3.get_bottom(), buff=0.1, thickness=2).set_color(MUTED)
        self.play(FadeIn(d3), FadeIn(n3), GrowArrow(ar), run_time=0.7)
        self.say("A và B cũng giao nhau, nhưng lúc đó C ở trên cả hai: không phải ngưỡng đổi hộp.", "surprised")
        # sweep p
        p = ValueTracker(0.02)
        vline = always_redraw(lambda: Line(ax.c2p(p.get_value(), -50), ax.c2p(p.get_value(), 50)).set_stroke(CHANCE, 3))

        def best(v):
            vals = {b: fs[b][0](v) for b in "ABC"}
            return max(vals, key=vals.get)

        tags = {b: T(f"chọn {b}", 34, BOXC[b], weight="BOLD") for b in "ABC"}
        tag = always_redraw(lambda: tags[best(p.get_value())].copy().next_to(ax.c2p(p.get_value(), 50), UP, buff=0.12))
        self.play(FadeIn(vline), FadeIn(tag), run_time=0.3)
        self.play(p.animate.set_value(0.98), run_time=5.0, rate_func=linear)
        self.say("Khi p tăng từ 0 tới 1, lựa chọn đổi từ A sang C rồi B.", "happy")
        self.done()


# ================================================================== M04 Minimax
class M04_Minimax(Base):
    heading = "Minimax · trò ba hộp"

    def construct(self):
        tr = GTree(box_spec("chance", "max"))
        roles = self.roles(tr, [(0, "robot", "max", "AGENT"), (1, "human", "min", "ĐỐI THỦ"), (2, "term", None, None)])
        agent, opp = roles[0], roles[1]
        self.play(FadeIn(tr), FadeIn(roles), run_time=1.0)
        self.say("Minimax xét phản ứng bất lợi nhất của đối thủ cho mỗi action.", "think")
        self.play(*[a for b in "ABC" for a in tr.kind(b, "min")], run_time=0.8)
        self.say("Node của đối thủ trở thành MIN.", "talk")
        sign = None
        for b in "ABC":
            lo = BOX[b][0]
            s2 = opp.sign(str(lo))
            self.play(tr.hl(b), tr.bold(f"{b}0", MINC, 9), tr.dim(f"{b}1"), *([FadeOut(sign)] if sign else []),
                      FadeIn(s2, shift=0.15 * UP), opp.frame("raiseR", "happy"), run_time=0.55)
            sign = s2
            self.play(*tr.set_val(b, str(lo), MINC), run_time=0.45)
            self.play(tr.unhl(b), run_time=0.25)
        self.play(FadeOut(sign), opp.frame("idle", "normal"), run_time=0.3)
        self.say("Mỗi hộp chỉ còn số nhỏ: −50, 1, −5.", "talk")
        eq = eq_box(r"\max(-50,\ 1,\ -5)=1", MAXC, 44).to_corner(UR, buff=0.45).shift(DOWN * 0.15)
        self.play(tr.hl("r"), FadeIn(eq, shift=0.1 * DOWN), run_time=0.5)
        self.play(*tr.set_val("r", "1", MAXC), tr.bold("B", WIN), tr.dim("A"), tr.dim("C"), run_time=0.6)
        s3 = agent.sign("B")
        self.play(agent.frame("raiseR", "happy"), FadeIn(s3, shift=0.2 * UP), tr.unhl("r"), run_time=0.5)
        self.say("Root MAX chọn B. Minimax value bằng 1.", "happy")
        guard = SurroundingRectangle(VGroup(tr.shapes["B0"], tr.shapes["B1"]), buff=0.14).set_stroke(WIN, 4)
        gl = T("≥ 1", 34, WIN, font=MONO, weight="BOLD").next_to(guard, DOWN, buff=0.12)
        self.play(ShowCreation(guard), FadeIn(gl), tr.plain("B1"), run_time=0.7)
        self.say("Dù đối thủ chọn 1 hay 3, agent vẫn có ít nhất 1: đó là mức bảo đảm.", "talk")
        cross = VGroup(Line(UL, DR), Line(UR, DL)).set_stroke(LOSS, 5, opacity=0.6).scale(0.3).move_to(tr.shapes["A1"])
        self.play(tr.hl("A1", LOSS, 8), ShowCreation(cross), run_time=0.6)
        self.say("Hộp A có leaf 50, nhưng đối thủ có thể chọn −50.", "worried")
        self.done()


# ================================================================== M05 deep tree, postorder
class M05_DeepTree(Base):
    heading = "Minimax · cây nhiều tầng"

    def construct(self):
        spec = {"id": "r", "k": "max", "kids": [
            {"a": "A", "n": {"id": "A", "k": "min", "kids": [
                {"a": "", "n": {"id": "A1", "k": "max", "kids": [{"a": "", "n": {"id": "a1", "k": "term", "v": -100}}, {"a": "", "n": {"id": "a2", "k": "term", "v": 10}}]}},
                {"a": "", "n": {"id": "A2", "k": "max", "kids": [{"a": "", "n": {"id": "a3", "k": "term", "v": 8}}, {"a": "", "n": {"id": "a4", "k": "term", "v": 20}}]}}]}},
            {"a": "B", "n": {"id": "B", "k": "min", "kids": [{"a": "", "n": {"id": "b1", "k": "term", "v": 5}}, {"a": "", "n": {"id": "b2", "k": "term", "v": 6}}]}}]}
        tr = GTree(spec, x0=-5.0, x1=2.4, y0=2.3, y1=-1.9, r=0.4, lr=0.33, fs=28)
        roles = self.roles(tr, [(0, "robot", "max", "MAX"), (1, "human", "min", "MIN"), (2, "robot", "max", "MAX"), (3, "term", None, None)], h=0.82)
        self.play(FadeIn(tr), FadeIn(roles), run_time=1.0)
        self.say("Cây gồm MAX, MIN rồi lại MAX. Tính từ leaf lên, theo player đến lượt.", "talk")
        panel_title = T("Ngăn xếp lời gọi", 26, MUTED).move_to([4.85, 2.55, 0])
        self.play(FadeIn(panel_title), run_time=0.3)
        stack = VGroup()

        def show_stack(frames):
            g = VGroup(*[T(f, 26, CUR if i == len(frames) - 1 else INK2, font=MONO) for i, f in enumerate(frames)])
            g.arrange(DOWN, aligned_edge=LEFT, buff=0.16).next_to(panel_title, DOWN, buff=0.3).align_to(panel_title, LEFT)
            return g

        names = {"r": "root", "A": "A", "B": "B", "A1": "A.1", "A2": "A.2"}
        vals, frames = {}, []
        order = []

        def walk(n):
            order.append(("call", n))
            for e in n.get("kids") or []:
                walk(e["n"])
            order.append(("ret", n))

        walk(spec)
        notes = {"A1": "Node MAX dưới A: agent chọn 10, bỏ −100.", "A": "A là node MIN: min(10, 20) = 10.",
                 "B": "B: min(5, 6) = 5.", "r": "Root: max(10, 5) = 10, chọn A."}
        for kind, n in order:
            nid = n["id"]
            if n["k"] == "term":
                if kind == "call":
                    self.play(tr.hl(nid, CUR, 7), run_time=0.25)
                    vals[nid] = n["v"]
                    self.play(tr.unhl(nid), run_time=0.2)
                continue
            if kind == "call":
                frames.append(f"value({names[nid]})")
                new = show_stack(frames)
                self.play(tr.hl(nid), Transform(stack, new) if len(stack) else FadeIn(new), run_time=0.35)
                if not len(stack):
                    stack = new
                continue
            kids = [e["n"] for e in n["kids"]]
            kv = [vals[k["id"]] for k in kids]
            v = max(kv) if n["k"] == "max" else min(kv)
            vals[nid] = v
            pick = kids[kv.index(v)]
            frames[-1] = f"value({names[nid]}) = {num(v)}"
            self.play(tr.hl(nid), Transform(stack, show_stack(frames)), run_time=0.3)
            self.play(*tr.set_val(nid, v, MAXC if n["k"] == "max" else MINC),
                      tr.bold(pick["id"], MAXC if n["k"] == "max" else MINC, 9), run_time=0.5)
            if nid in notes:
                self.say(notes[nid], "think" if nid != "r" else "happy")
            self.play(tr.unhl(nid), run_time=0.2)
            frames.pop()
            if frames:
                self.play(Transform(stack, show_stack(frames)), run_time=0.25)
        self.play(FadeOut(stack), FadeOut(panel_title), run_time=0.3)
        wrong = VGroup(T("Sai lầm hay gặp:", 28, LOSS, weight="BOLD"), M(r"\min(-100,\,10,\,8,\,20)=-100", 30, LOSS)).arrange(DOWN, buff=0.18)
        wrong.move_to([4.85, 1.0, 0])
        cross = Line(wrong[1].get_left(), wrong[1].get_right()).set_stroke(LOSS, 5)
        self.play(FadeIn(wrong, shift=0.1 * LEFT), tr.hl("a1", LOSS, 8), run_time=0.6)
        self.say("Lấy leaf nhỏ nhất của cả nhánh A sẽ cho kết quả sai.", "worried")
        self.play(ShowCreation(cross), run_time=0.4)
        self.say("Leaf −100 nằm dưới node MAX. Tại đây agent chọn 10; đối thủ chỉ chọn ở node MIN.", "talk")
        self.done()


# ================================================================== M06 Halving: winning and losing positions
class M06_Halving(Base):
    heading = "Halving · bên đến lượt thắng hay thua?"

    def construct(self):
        N = 16
        W = [1]
        for n in range(1, N + 1):
            W.append(max(1 - W[n - 1], 1 - W[n // 2]))
        # the rule in words first; the formula only comes after the strip is coloured
        rule = T("Bên đến lượt thắng khi có một nước đẩy đối phương vào state thua", 30, INK).move_to([0.3, 2.55, 0])
        if rule.get_width() > 10.4:
            rule.set_width(10.4)
        sub = T("Tô từ 0 lên 16: mỗi ô chỉ cần nhìn hai ô n − 1 và ⌊n/2⌋", 26, MUTED).next_to(rule, DOWN, buff=0.2)
        size, gap = 0.62, 0.1
        cells = VGroup()
        for n in range(N + 1):
            b = RoundedRectangle(width=size, height=size, corner_radius=0.06).set_fill(CELL, 1).set_stroke(FAINT, 2.5)
            t = T(n, 26, INK, font=MONO).move_to(b)
            cells.add(VGroup(b, t))
        cells.arrange(RIGHT, buff=gap).move_to([0.25, 0.25, 0])
        labs = VGroup(*[VGroup() for _ in range(N + 1)])
        p1 = Player("human", "max", "LỚP", height=1.0).move_to([-5.9, 2.15, 0])
        p2 = Player("robot", "min", "MÁY", height=1.0, side="R").move_to([5.95, 2.15, 0])
        self.play(FadeIn(rule), FadeIn(sub), LaggedStart(*[FadeIn(c, shift=0.1 * UP) for c in cells], lag_ratio=0.03), FadeIn(p1), FadeIn(p2), run_time=1.3)
        self.say("Bên đến lượt ở 0 đã nhận số 0, nên thắng. Tô dần từ trái sang phải.", "talk")

        def mark(n, animate=True):
            col, fill = (WIN, WIN_BG) if W[n] else (LOSS, LOSS_BG)
            t = T("thắng" if W[n] else "thua", 20, col, weight="BOLD").next_to(cells[n], DOWN, buff=0.1)
            labs[n].add(t)
            return [cells[n][0].animate.set_fill(fill, 1).set_stroke(col, 3.5), FadeIn(t, shift=0.05 * UP)]

        self.play(*mark(0), run_time=0.5)
        expl = {1: "n = 1: cả hai nước đều đưa số 0 cho đối phương. Thua.",
                2: "n = 2: trừ 1 để đối phương nhận 1, một state thua. Thắng.",
                4: "n = 4: chỉ tới 3 hoặc 2, đều là state thắng của đối phương. Thua.",
                5: "n = 5: trừ 1 để đối phương nhận 4. Thắng.",
                6: "n = 6: tới 5 hoặc 3, đều thắng cho đối phương. Thua."}
        for n in range(1, N + 1):
            a, b = n - 1, n // 2
            slow = n <= 6
            arcs = VGroup()
            top = ArcBetweenPoints(cells[n].get_top() + UP * 0.02, cells[a].get_top() + UP * 0.02, angle=TAU / 3)
            arcs.add(top.set_stroke(MUTED, 3))
            if b != a:
                bot = ArcBetweenPoints(cells[n].get_bottom() + DOWN * 0.42, cells[b].get_bottom() + DOWN * 0.42, angle=-TAU / 5)
                arcs.add(bot.set_stroke(MUTED, 3))
            good = [i for i, t in enumerate([a, b] if b != a else [a]) if W[t] == 0]
            self.play(cells[n][0].animate.set_stroke(CUR, 6), ShowCreation(arcs), run_time=0.45 if slow else 0.22)
            if good:
                self.play(arcs[good[0]].animate.set_stroke(WIN, 6), run_time=0.3 if slow else 0.15)
            self.play(*mark(n), run_time=0.4 if slow else 0.2)
            if n in expl:
                self.say(expl[n], "think" if not W[n] else "talk")
            elif slow:
                self.wait(0.4)
            self.play(FadeOut(arcs), run_time=0.25 if slow else 0.12)
        self.say("Các state thua: 1, 4, 6, 10, 14, 16.", "surprised")

        # only now write the rule as a formula
        f = M(r"W(n)=\max\{\,1-W(n-1),\ 1-W(\lfloor n/2\rfloor)\,\}", 40, INK).move_to([0.3, -1.4, 0])
        n1 = T("1 − W: đổi value của đối phương sang góc nhìn của mình", 26, MUTED)
        n2 = T("max: chỉ cần một nước đẩy đối phương vào state thua", 26, MUTED)
        notes = VGroup(n1, n2).arrange(DOWN, buff=0.14).next_to(f, DOWN, buff=0.26)
        self.play(FadeIn(f, shift=0.12 * UP), run_time=0.8)
        self.say("Tô xong bảng rồi mới viết quy tắc thành công thức. W = 1 là thắng, W = 0 là thua.", "talk")
        self.play(FadeIn(n1, shift=0.08 * UP), run_time=0.5)
        self.say("1 − W đổi value của đối phương sang góc nhìn của mình.", "think")
        self.play(FadeIn(n2, shift=0.08 * UP), run_time=0.5)
        self.say("Lấy max vì chỉ cần một nước đẩy đối phương vào state thua.", "talk")

        # the move to remember: 15 → 14, in bold
        rest = [i for i in range(N + 1) if i not in (14, 15)]
        self.play(*[cells[i].animate.set_opacity(0.28) for i in rest], *[labs[i].animate.set_opacity(0.28) for i in rest],
                  VGroup(f, notes).animate.set_opacity(0.45), run_time=0.6)
        a1 = ArcBetweenPoints(cells[15].get_top() + UP * 0.1, cells[14].get_top() + UP * 0.1, angle=TAU / 2.6).set_stroke(WIN, 11)
        a1.add_tip(width=0.34, length=0.3)
        mv = T("15 → 14", 34, WIN, font=MONO, weight="BOLD").next_to(a1, UP, buff=0.14).shift(0.45 * LEFT)
        s1 = p1.sign("-1")
        self.play(cells[15].animate.scale(1.14), cells[15][0].animate.set_stroke(CUR, 9),
                  cells[14].animate.scale(1.14), cells[14][0].animate.set_stroke(LOSS, 9),
                  ShowCreation(a1), FadeIn(mv, shift=0.1 * UP), FadeIn(s1, shift=0.15 * UP), p1.frame("raiseR", "happy"), run_time=0.8)
        self.play(p2.frame("idle", "sad"), run_time=0.3)
        self.say("Ở 15, lớp trừ 1 để máy nhận 14, một state thua của bên đến lượt.", "happy")
        self.say("Để bảo đảm thắng, lượt nào lớp cũng phải đưa máy vào state thua.", "worried")
        self.done()


# ================================================================== M07 the fork in position Q
class Board(VGroup):
    def __init__(self, s, cell=0.95):
        super().__init__()
        self.c = cell
        self.anchor = Dot(ORIGIN, radius=0.001).set_opacity(0)
        self.add(self.anchor)
        grid = VGroup()
        for i in (1, 2):
            grid.add(Line([-1.5 * cell + i * cell, 1.5 * cell, 0], [-1.5 * cell + i * cell, -1.5 * cell, 0]))
            grid.add(Line([-1.5 * cell, 1.5 * cell - i * cell, 0], [1.5 * cell, 1.5 * cell - i * cell, 0]))
        grid.set_stroke(INK2, 5)
        self.grid = grid
        self.idx = VGroup(*[T(i, 16, FAINT, font=MONO).move_to(self.pos(i) + np.array([-0.36 * cell, 0.34 * cell, 0])) for i in range(9)])
        self.bg = VGroup(*[Square(side_length=cell * 0.94).set_fill(CELL, 0).set_stroke(width=0).move_to(self.pos(i)) for i in range(9)])
        self.add(self.bg, self.grid, self.idx)
        self.pieces = {}
        for i, ch in enumerate(s):
            if ch != ".":
                self.pieces[i] = self.piece(ch, i)
                self.add(self.pieces[i])

    def pos(self, i):
        r, c = divmod(i, 3)
        return self.anchor.get_center() + np.array([(c - 1) * self.c, (1 - r) * self.c, 0])

    def piece(self, ch, i):
        return T(ch, 64, MAXC if ch == "X" else MINC, weight="BOLD").move_to(self.pos(i))

    def place(self, ch, i):
        p = self.piece(ch, i)
        self.pieces[i] = p
        return p

    def line(self, a, b, color, dashed=False):
        pa, pb = self.pos(a), self.pos(b)
        d = (pb - pa) / np.linalg.norm(pb - pa)
        ln = (DashedLine if dashed else Line)(pa - d * 0.36 * self.c, pb + d * 0.36 * self.c)
        return ln.set_stroke(color, 9, opacity=0.75)

    def tint(self, i, color, op=0.35):
        return self.bg[i].animate.set_fill(color, op)


class M07_ForkQ(Base):
    heading = "Thế Q · một nước đe dọa chưa chắc là nước tốt"

    def construct(self):
        Q = "...O.XXOO"
        bd = Board(Q).move_to([-0.6, 0.35, 0])
        x = Player("robot", "max", "X · AGENT", height=1.35).move_to([-4.6, 0.25, 0])
        o = Player("human", "min", "O · ĐỐI THỦ", height=1.35, side="R").move_to([3.3, 0.25, 0])
        res_t = T("Minimax value", 26, MUTED).move_to([5.75, 2.2, 0])
        self.play(FadeIn(bd), FadeIn(x), FadeIn(o), FadeIn(res_t), run_time=1.0)
        self.say("Thế Q: O đi trước, X là agent và đang đến lượt. Nước hợp lệ: 0, 1, 2, 4.", "talk")
        self.play(*[bd.tint(i, MAXC, 0.18) for i in (0, 1, 2, 4)], run_time=0.5)
        self.wait(0.5)
        self.play(*[bd.tint(i, MAXC, 0) for i in (0, 1, 2, 4)], run_time=0.3)

        def move(pl, ch, i, label, mood="think"):
            p = bd.place(ch, i)
            s = pl.sign(label, FONT)
            return p, s, [FadeIn(p, scale=1.6), FadeIn(s, shift=0.15 * UP), pl.frame("raiseR" if pl is x else "raiseL", mood)]

        # ---- branch X2
        p1, s1, an = move(x, "X", 2, "X2")
        th = bd.line(2, 6, MAXC, dashed=True)
        self.play(*an, run_time=0.5)
        self.play(ShowCreation(th), bd.tint(4, WIN, 0.3), run_time=0.5)
        self.say("X2 đe dọa thắng ở ô 4, trên đường chéo 2–4–6.", "talk")
        p2, s2, an = move(o, "O", 4, "O4", "happy")
        self.play(FadeOut(s1), x.frame("idle", "worried" if False else "normal"), bd.tint(4, WIN, 0), *an, FadeOut(th), run_time=0.5)
        f1, f2 = bd.line(0, 8, MINC), bd.line(1, 7, MINC)
        self.play(ShowCreation(f1), ShowCreation(f2), bd.tint(0, LOSS, 0.3), bd.tint(1, LOSS, 0.3), run_time=0.7)
        self.say("O chặn ở 4 và tạo hai đe dọa cùng lúc, ở ô 0 và ô 1: một fork.", "surprised")
        p3, s3, an = move(x, "X", 0, "X0")
        self.play(FadeOut(s2), o.frame("idle", "normal"), *an, FadeOut(f1), bd.tint(0, LOSS, 0), run_time=0.5)
        p4, s4, an = move(o, "O", 1, "O1", "happy")
        self.play(FadeOut(s3), *an, run_time=0.5)
        self.play(f2.animate.set_stroke(MINC, 12, opacity=1), x.frame("idle", "sad"), run_time=0.4)
        r1 = T("X2 → −1", 34, LOSS, font=MONO, weight="BOLD").next_to(res_t, DOWN, buff=0.3)
        self.play(FadeIn(r1, shift=0.1 * LEFT), run_time=0.4)
        self.say("X chỉ chặn được một ô. O thắng: X2 có Minimax value −1.", "worried")
        # ---- reset, branch X4
        self.play(*[FadeOut(m) for m in (p1, p2, p3, p4, s4, f2)], bd.tint(1, LOSS, 0), x.frame("idle", "normal"), o.frame("idle", "normal"), run_time=0.6)
        p1, s1, an = move(x, "X", 4, "X4")
        th = bd.line(6, 2, MAXC, dashed=True)
        self.play(*an, run_time=0.5)
        self.play(ShowCreation(th), bd.tint(2, WIN, 0.3), run_time=0.5)
        self.say("X4 cũng đe dọa, lần này ở ô 2.", "talk")
        p2, s2, an = move(o, "O", 2, "O2", "normal")
        self.play(FadeOut(s1), x.frame("idle", "normal"), bd.tint(2, WIN, 0), FadeOut(th), *an, run_time=0.5)
        self.say("O phải chặn ở 2, nhưng O2 không tạo được đe dọa kép.", "think")
        p3, s3, an = move(x, "X", 0, "X0")
        self.play(FadeOut(s2), o.frame("idle", "normal"), *an, run_time=0.5)
        p4, s4, an = move(o, "O", 1, "O1", "normal")
        self.play(FadeOut(s3), x.frame("idle", "normal"), *an, run_time=0.5)
        r2 = T("X4 → 0", 34, WIN, font=MONO, weight="BOLD").next_to(r1, DOWN, buff=0.25)
        self.play(FadeOut(s4), o.frame("idle", "normal"), FadeIn(r2, shift=0.1 * LEFT), run_time=0.5)
        self.say("Bàn đầy, không ai thắng. X4 giữ được hòa, với Minimax value 0.", "happy")
        self.say("Phải đánh giá cả phản ứng mà nước đi của mình mở ra cho đối thủ.", "talk")
        self.done()
