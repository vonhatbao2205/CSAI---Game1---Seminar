#!/usr/bin/env python3
"""Copy the spoken script of slides 1-25 (kich_ban_phan1_Bao.md) into the speaker notes of those slides.

    python3 tools/notes_from_script.py            # rewrite the notes in deck/src/slides/*.html
    python3 tools/notes_from_script.py --check    # only report what would change

Each "### Slide N · Title" section becomes the <div class="notes"> of slide N: the timing line, every
timestamped paragraph, and the text version of the board drawing. The cues keep their meaning as small labels:
[→] press next, [chỉ: …] point, [✍ …] write on the board, [🧽 …] erase, (…) stage direction.
A paragraph marked "(slide 15 vẫn đang chiếu)" is said before leaving slide 15, so it goes to slide 15's notes.
Then rebuild: node deck/build.mjs && node tools/export_script.mjs
"""
import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "kich_ban_phan1_Bao.md"
SLIDES = ROOT / "deck" / "src" / "slides"
LAST = 25


def inline(text):
    """Markdown cues of the script -> small HTML labels (escaped first; <sub> video timestamps kept)."""
    t = html.escape(text, quote=False)
    t = re.sub(r"&lt;sub&gt;(.*?)&lt;/sub&gt;", r'<span class="nt-vt">\1</span>', t)

    def cue(m):
        body = m.group(1).strip()
        kind = ("key" if body.startswith("→") else "point" if body.startswith("chỉ") else
                "board" if body.startswith(("✍", "🧽")) else "act")
        return f'<b class="nt-cue nt-{kind}">[{body}]</b>'

    t = re.sub(r"\*\*\[(.+?)\]\*\*", cue, t)
    t = re.sub(r"\*(\([^)]*\))\*", r'<i class="nt-act">\1</i>', t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"(?<![\w*])\*([^*\n]+?)\*(?![\w*])", r"<i>\1</i>", t)
    t = re.sub(r"^`(\d\d:\d\d)`\s*", r'<span class="nt-time">\1</span> ', t)
    t = re.sub(r"`([^`]+)`", r"\1", t)
    return t


def parse(md):
    """{slide number: (title, [html blocks])}"""
    out, cur, num = {}, None, None
    in_code = False
    code = []
    for line in md.splitlines():
        m = re.match(r"^### Slide (\d+) · (.+)$", line)
        if m:
            num = int(m.group(1))
            cur = []
            out[num] = (m.group(2).strip(), cur)
            continue
        if cur is None or num > LAST:
            continue
        s = line.strip()
        if s.startswith("```"):
            if in_code:
                cur.append('<pre class="nt-pre">' + html.escape("\n".join(code), quote=False) + "</pre>")
                code = []
            in_code = not in_code
            continue
        if in_code:
            code.append(line.rstrip())
            continue
        if not s or s.startswith(("![", "<details", "</details", "## ")):
            continue
        if re.match(r"^`\d\d:\d\d → \d\d:\d\d`", s):
            cur.append('<p class="nt-meta">' + inline(s) + "</p>")
        elif re.match(r"^\*\*Bảng sau slide \d+:\*\*$", s):
            cur.append('<p class="nt-label">' + s.strip("*:").strip() + "</p>")
        else:
            cur.append("<p>" + inline(s) + "</p>")
    # the question asked while slide 15 is still on screen belongs to slide 15
    if 16 in out and 15 in out:
        moved = [b for b in out[16][1] if "slide 15 vẫn đang chiếu" in b]
        for b in moved:
            out[16][1].remove(b)
            out[15][1].append(b)
    return out


def main():
    check = "--check" in sys.argv
    script = parse(SCRIPT.read_text(encoding="utf8"))
    n, changed, problems = 0, 0, []
    for f in sorted(SLIDES.glob("*.html")):
        src = f.read_text(encoding="utf8")
        parts = re.split(r"(<section class=\"s[^\"]*\"[^>]*>[\s\S]*?</section>)", src)
        for k in range(1, len(parts), 2):
            n += 1
            if n > LAST:
                continue
            sec = parts[k]
            title = re.search(r'data-title="([^"]*)"', sec).group(1)
            if n not in script:
                problems.append(f"slide {n} ({title}): no section in the script")
                continue
            stitle, blocks = script[n]
            if html.unescape(stitle) != html.unescape(title):
                problems.append(f"slide {n}: script title {stitle!r} != slide title {title!r}")
            notes = '<div class="notes">' + "".join(blocks) + "</div>"
            if '<div class="notes">' in sec:
                new = re.sub(r'<div class="notes">[\s\S]*?</div>', lambda _: notes, sec, count=1)
            else:
                new = sec.replace("</section>", "  " + notes + "\n</section>")
            if new != sec:
                changed += 1
                parts[k] = new
        out = "".join(parts)
        if out != src and not check:
            f.write_text(out, encoding="utf8")
    for p in problems:
        print("!", p)
    print(f"{changed} of {min(n, LAST)} slides {'would change' if check else 'updated'}")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
