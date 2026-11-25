#!/usr/bin/env python3
"""Build the exercise showcase page (index.html) for the Netlify site.

Reads every exercise README (the ones with a "How to run" section) plus
.learning/display-map.json and writes a static, self-contained index.html at
the repository root. Browser exercises get an "Open demo" link; everything
else links to its code and README on GitHub.

Usage:
    python tools/build_showcase.py --repo . --write   # regenerate index.html
    python tools/build_showcase.py --repo . --check   # fail if index.html is stale
"""
from __future__ import annotations

import argparse
import html
import json
import re
import subprocess
import sys
from pathlib import Path, PurePosixPath

REPO_URL = "https://github.com/LiriothTeltanion/Fullstack2026"
OUTPUT = "index.html"
KIND_ORDER = ["🥉", "➕", "🥇", "🥷", "⏱️", "🧩", "🧪", "💪", "🌟", "🎮"]
TITLE_RE = re.compile(r"^# (?P<emoji>🥉|➕|🥇|🥷|⏱️|🧩|🧪|💪|🌟|🎮) (?P<rest>.+)$")
DAY_RE = re.compile(r"^(Day\d+|RemoteLearning)")
NUMBER_RE = re.compile(r"(\d+)")


def tracked_files(repo: Path) -> list[str]:
    result = subprocess.run(
        ["git", "-C", str(repo), "ls-files", "-z"], capture_output=True, check=True
    )
    return [item for item in result.stdout.decode("utf-8").split("\0") if item]


def first_paragraph(text: str) -> str:
    """Return the first prose paragraph after the centered image block."""
    body = text.split("</div>", 1)[1] if "</div>" in text else text
    lines: list[str] = []
    for line in body.splitlines():
        stripped = line.strip()
        if not stripped:
            if lines:
                break
            continue
        if stripped.startswith(("#", "<", "|", "```", "-", "!")):
            if lines:
                break
            continue
        lines.append(stripped)
    paragraph = " ".join(lines)
    paragraph = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", paragraph)
    paragraph = paragraph.replace("**", "").replace("`", "")
    if len(paragraph) > 190:
        paragraph = paragraph[:187].rsplit(" ", 1)[0] + "…"
    return paragraph


def technologies(folder: str, files: list[str], has_demo: bool) -> list[str]:
    inside = [f for f in files if f.startswith(folder + "/")]
    suffixes = {PurePosixPath(f).suffix.lower() for f in inside}
    tags: list[str] = []
    if ".py" in suffixes:
        tags.append("Python")
    if ".ts" in suffixes:
        tags.append("TypeScript")
    if ".sql" in suffixes:
        tags.append("SQL")
    if {".js", ".mjs", ".cjs"} & suffixes:
        tags.append("JavaScript" if has_demo else "Node.js")
    if ".html" in suffixes:
        tags.append("HTML/CSS")
    return tags or ["Notes"]


def sort_key(item: dict) -> tuple:
    emoji_rank = KIND_ORDER.index(item["emoji"]) if item["emoji"] in KIND_ORDER else 99
    numbers = [int(n) for n in NUMBER_RE.findall(item["path"].split("/", 2)[-1])]
    return (emoji_rank, numbers, item["path"].lower())


def collect(repo: Path) -> dict:
    files = tracked_files(repo)
    display = json.loads((repo / ".learning/display-map.json").read_text(encoding="utf-8"))
    weeks: list[dict] = []
    for week in display["weeks"]:
        number = int(re.match(r"Week(\d+)", week["path"]).group(1))
        days = []
        for day in week.get("days", []):
            days.append({"path": day["path"], "title": day["title"], "items": []})
        weeks.append(
            {
                "number": number,
                "path": week["path"],
                "title": week["display_title"],
                "days": days,
            }
        )
    by_day = {day["path"]: day for week in weeks for day in week["days"]}
    total = demos = todo = 0
    week_todo = {week["path"]: 0 for week in weeks}
    for readme in sorted(f for f in files if f.startswith("Week") and f.endswith("/README.md")):
        text = (repo / readme).read_text(encoding="utf-8")
        if "**Status:** to do" in text:
            todo += 1
            week_todo[readme.split("/", 1)[0]] = week_todo.get(readme.split("/", 1)[0], 0) + 1
            continue
        if "## ▶️ How to run" not in text:
            continue
        match = TITLE_RE.match(text.splitlines()[0])
        if not match:
            continue
        folder = str(PurePosixPath(readme).parent)
        parts = folder.split("/")
        day_path = "/".join(parts[:2])
        if day_path not in by_day:
            continue
        has_demo = f"{folder}/index.html" in files
        rest = match.group("rest")
        kind, _, name = rest.partition(" - ")
        item = {
            "path": folder,
            "emoji": match.group("emoji"),
            "kind": kind.strip(),
            "name": (name or "").strip(),
            "intro": first_paragraph(text),
            "tags": technologies(folder, files, has_demo),
            "demo": has_demo,
            "needs_key": f"{folder}/config.example.js" in files
            or any(f.startswith(folder + "/") and f.endswith("config.example.js") for f in files),
        }
        by_day[day_path]["items"].append(item)
        total += 1
        demos += has_demo
    for day in by_day.values():
        day["items"].sort(key=sort_key)
    for week in weeks:
        week["todo"] = week_todo.get(week["path"], 0)
    return {"weeks": weeks, "total": total, "demos": demos, "todo": todo}


def render_card(item: dict) -> str:
    title = item["name"] or item["kind"]
    subtitle = item["kind"] if item["name"] else ""
    tags = "".join(f'<li class="tag">{html.escape(tag)}</li>' for tag in item["tags"])
    search = " ".join([item["kind"], item["name"], item["intro"], " ".join(item["tags"]), item["path"]]).lower()
    filters = " ".join(tag.lower().replace("/", "-").replace(".", "") for tag in item["tags"])
    if item["demo"]:
        filters += " demo"
    links = []
    if item["demo"]:
        links.append(
            f'<a class="btn btn-primary" href="{html.escape(item["path"])}/index.html">▶ Open demo</a>'
        )
    links.append(f'<a class="btn" href="{REPO_URL}/tree/main/{html.escape(item["path"])}">Code</a>')
    links.append(f'<a class="btn" href="{REPO_URL}/blob/main/{html.escape(item["path"])}/README.md">README</a>')
    note = '<p class="note">Needs your own API key in config.js</p>' if item["needs_key"] else ""
    return (
        f'<article class="card" data-search="{html.escape(search)}" data-filters="{html.escape(filters)}">'
        f'<header class="card-head"><span class="kind-emoji" aria-hidden="true">{item["emoji"]}</span>'
        f'<div><h4>{html.escape(title)}</h4>'
        + (f'<p class="kind">{html.escape(subtitle)}</p>' if subtitle else "")
        + f'</div></header><p class="intro">{html.escape(item["intro"])}</p>{note}'
        f'<ul class="tags" aria-label="Technologies">{tags}</ul>'
        f'<div class="actions">{"".join(links)}</div></article>'
    )


def render(data: dict) -> str:
    nav = []
    sections = []
    for week in data["weeks"]:
        anchor = f"week-{week['number']}"
        count = sum(len(day["items"]) for day in week["days"])
        nav.append(
            f'<li><a href="#{anchor}">{html.escape(week["title"].split(" — ")[0])}</a></li>'
        )
        if count == 0:
            sections.append(
                f'<section class="week upcoming" id="{anchor}" aria-labelledby="{anchor}-title">'
                f'<h2 id="{anchor}-title">{html.escape(week["title"])}</h2>'
                f'<p class="upcoming-note">Coming up. {week["todo"]} {"folder is" if week["todo"] == 1 else "folders are"} ready for these lessons.</p></section>'
            )
            continue
        days = []
        for day in week["days"]:
            if not day["items"]:
                continue
            cards = "".join(render_card(item) for item in day["items"])
            days.append(
                f'<div class="day"><h3>{html.escape(day["title"])}</h3><div class="grid">{cards}</div></div>'
            )
        sections.append(
            f'<section class="week" id="{anchor}" aria-labelledby="{anchor}-title">'
            f'<h2 id="{anchor}-title">{html.escape(week["title"])} <span class="count">{count}</span>'
            + (f' <span class="todo">{week["todo"]} to do</span>' if week["todo"] else "")
            + "</h2>"
            + "".join(days)
            + "</section>"
        )
    return (
        TEMPLATE.replace("{{TOTAL}}", str(data["total"]))
        .replace("{{DEMOS}}", str(data["demos"]))
        .replace("{{TODO}}", str(data["todo"]))
        .replace("{{WEEKS_WITH_WORK}}", str(sum(1 for w in data["weeks"] if any(d["items"] for d in w["days"]))))
        .replace("{{NAV}}", "".join(nav))
        .replace("{{SECTIONS}}", "".join(sections))
        .replace("{{REPO}}", REPO_URL)
    )


TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Fullstack2026 · Exercise Showcase</title>
<meta name="description" content="Every exercise, daily challenge and mini project from my Developers Institute full-stack bootcamp, with live demos for the browser projects.">
<meta name="color-scheme" content="dark">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230b1029'/%3E%3Ctext x='32' y='42' font-size='28' text-anchor='middle' fill='%2367e8f9' font-family='Segoe UI,Arial' font-weight='800'%3EKC%3C/text%3E%3C/svg%3E">
<style>
:root {
  --bg: #070b1f; --panel: #0e1430; --panel-2: #131b3d; --line: #24305e;
  --text: #e8ecff; --muted: #a7b0d6; --cyan: #67e8f9; --cyan-2: #06b6d4;
  --violet: #a78bfa; --green: #86efac; --amber: #fcd34d; --radius: 18px;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0; background: var(--bg); color: var(--text);
  font: 16px/1.55 "Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif;
  background-image:
    radial-gradient(1200px 600px at 10% -10%, rgba(6,182,212,.18), transparent 60%),
    radial-gradient(900px 500px at 110% 10%, rgba(167,139,250,.16), transparent 60%);
  background-attachment: fixed;
}
a { color: var(--cyan); }
.skip { position: absolute; left: -999px; top: 8px; background: var(--cyan); color: #04121a; padding: 8px 12px; border-radius: 10px; z-index: 10; }
.skip:focus { left: 12px; }
.wrap { width: min(1180px, 100% - 32px); margin: 0 auto; }
.hero { padding: 28px 0 8px; text-align: center; }
.hero img { width: 100%; height: auto; border-radius: var(--radius); display: block; }
.hero h1 { margin: 22px 0 6px; font-size: clamp(1.7rem, 4vw, 2.6rem); letter-spacing: .01em; }
.hero h1 span { background: linear-gradient(90deg, var(--cyan), var(--violet)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.hero p { margin: 0 auto; max-width: 720px; color: var(--muted); }
.stats { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin: 20px 0 4px; padding: 0; list-style: none; }
.stats li { background: var(--panel); border: 1px solid var(--line); border-radius: 999px; padding: 6px 16px; color: var(--muted); }
.stats strong { color: var(--text); font-size: 1.1rem; margin-right: 4px; }
.pulse { width: 100%; height: auto; display: block; margin: 18px 0 0; opacity: .9; }
.toolbar { position: sticky; top: 0; z-index: 5; padding: 12px 0; background: rgba(7,11,31,.86); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
.toolbar .wrap { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.search { flex: 1 1 240px; display: flex; }
.search input { width: 100%; padding: 10px 14px; border-radius: 12px; border: 1px solid var(--line); background: var(--panel); color: var(--text); font: inherit; }
.search input::placeholder { color: #7d87b4; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { border: 1px solid var(--line); background: var(--panel); color: var(--muted); padding: 7px 12px; border-radius: 999px; font: inherit; font-size: .9rem; cursor: pointer; }
.chip[aria-pressed="true"] { background: linear-gradient(90deg, var(--cyan-2), #4f46e5); color: #fff; border-color: transparent; }
.weeknav { margin: 14px 0 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.weeknav a { display: inline-block; padding: 5px 12px; border-radius: 999px; border: 1px solid var(--line); color: var(--muted); text-decoration: none; font-size: .9rem; }
.weeknav a:hover { color: var(--text); border-color: var(--cyan-2); }
#result-count { color: var(--muted); font-size: .9rem; margin-left: auto; }
main { padding: 8px 0 40px; }
.week { margin: 34px 0; scroll-margin-top: 150px; }
.week h2 { font-size: 1.5rem; margin: 0 0 6px; display: flex; align-items: center; gap: 10px; }
.todo { font-size: .8rem; font-weight: 600; color: var(--amber); border: 1px solid rgba(252,211,77,.4); border-radius: 999px; padding: 1px 10px; }
.count { font-size: .85rem; font-weight: 600; color: #04121a; background: var(--cyan); border-radius: 999px; padding: 1px 10px; }
.day h3 { color: var(--violet); font-size: 1.02rem; margin: 22px 0 10px; font-weight: 650; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 14px; }
.card { background: linear-gradient(180deg, var(--panel-2), var(--panel)); border: 1px solid var(--line); border-radius: var(--radius); padding: 16px; display: flex; flex-direction: column; gap: 10px; transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease; }
.card:hover, .card:focus-within { transform: translateY(-3px); border-color: var(--cyan-2); box-shadow: 0 10px 30px rgba(6,182,212,.15); }
.card-head { display: flex; gap: 10px; align-items: flex-start; }
.kind-emoji { font-size: 1.6rem; line-height: 1; }
.card h4 { margin: 0; font-size: 1.05rem; }
.kind { margin: 2px 0 0; color: var(--muted); font-size: .85rem; }
.intro { margin: 0; color: #cdd3f2; font-size: .93rem; flex: 1; }
.note { margin: 0; color: var(--amber); font-size: .82rem; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; padding: 0; list-style: none; }
.tag { font-size: .76rem; padding: 2px 9px; border-radius: 999px; background: rgba(103,232,249,.1); color: var(--cyan); border: 1px solid rgba(103,232,249,.25); }
.actions { display: flex; flex-wrap: wrap; gap: 8px; }
.btn { display: inline-block; padding: 7px 12px; border-radius: 10px; border: 1px solid var(--line); color: var(--text); text-decoration: none; font-size: .88rem; }
.btn:hover { border-color: var(--cyan-2); }
.btn-primary { background: linear-gradient(90deg, var(--cyan-2), #4f46e5); border-color: transparent; color: #fff; font-weight: 650; }
.upcoming { opacity: .75; }
.upcoming-note { color: var(--muted); margin: 0; }
.empty { text-align: center; color: var(--muted); padding: 40px 0; }
footer { border-top: 1px solid var(--line); padding: 24px 0 40px; color: var(--muted); text-align: center; font-size: .92rem; }
:focus-visible { outline: 3px solid var(--amber); outline-offset: 2px; }
[hidden] { display: none !important; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .card, .card:hover { transition: none; transform: none; }
}
@media (max-width: 600px) {
  .toolbar { padding: 8px 0; }
  .chips { flex-wrap: nowrap; overflow-x: auto; width: 100%; padding-bottom: 2px; scrollbar-width: none; }
  .chip { flex: 0 0 auto; }
  #result-count { margin-left: 0; width: 100%; font-size: .82rem; }
  .week { scroll-margin-top: 190px; }
}
</style>
</head>
<body>
<a class="skip" href="#exercises">Skip to the exercises</a>
<div class="wrap hero">
  <img src="assets/readme/hero/root-banner.svg" alt="Fullstack2026 twelve-week course map: Weeks 1–6 hold my exercises and projects; Weeks 7–12 are ready for the next lessons." width="1200" height="420">
  <h1><span>Fullstack2026</span> · Exercise Showcase</h1>
  <p>Every exercise, daily challenge and mini project from my Developers Institute full-stack bootcamp. Browser projects open as live demos; Python, Node.js and SQL work links to the code and its README.</p>
  <ul class="stats">
    <li><strong>{{TOTAL}}</strong> exercises</li>
    <li><strong>{{DEMOS}}</strong> live demos</li>
    <li><strong>{{WEEKS_WITH_WORK}}</strong> weeks with code</li>
    <li><strong>{{TODO}}</strong> still to do</li>
  </ul>
  <ul class="weeknav" aria-label="Jump to a week">{{NAV}}</ul>
  <img class="pulse" src="assets/readme/folder-pulse.svg" alt="" width="1000" height="120">
</div>
<div class="toolbar" role="search">
  <div class="wrap">
    <label class="search" for="q"><span class="skip">Search exercises</span>
      <input id="q" type="search" placeholder="Search exercises, e.g. hangman, fetch, classes…" autocomplete="off">
    </label>
    <div class="chips" role="group" aria-label="Filter by technology">
      <button class="chip" type="button" data-filter="all" aria-pressed="true">All</button>
      <button class="chip" type="button" data-filter="demo" aria-pressed="false">▶ Live demos</button>
      <button class="chip" type="button" data-filter="python" aria-pressed="false">Python</button>
      <button class="chip" type="button" data-filter="javascript" aria-pressed="false">JavaScript</button>
      <button class="chip" type="button" data-filter="typescript" aria-pressed="false">TypeScript</button>
      <button class="chip" type="button" data-filter="nodejs" aria-pressed="false">Node.js</button>
      <button class="chip" type="button" data-filter="sql" aria-pressed="false">SQL</button>
    </div>
    <span id="result-count" aria-live="polite"></span>
  </div>
</div>
<main id="exercises" class="wrap">
{{SECTIONS}}
<p class="empty" id="empty" hidden>No exercise matches that search.</p>
</main>
<footer>
  <div class="wrap">
    <p>Kevin Cusnir · <a href="https://github.com/LiriothTeltanion">@LiriothTeltanion</a> · <a href="{{REPO}}">Fullstack2026 on GitHub</a></p>
    <p>Built with AI-assisted tooling; I reviewed, tested and can explain every change.</p>
  </div>
</footer>
<script>
(() => {
  const cards = [...document.querySelectorAll(".card")];
  const weeks = [...document.querySelectorAll(".week:not(.upcoming)")];
  const days = [...document.querySelectorAll(".day")];
  const input = document.getElementById("q");
  const chips = [...document.querySelectorAll(".chip")];
  const count = document.getElementById("result-count");
  const empty = document.getElementById("empty");
  let filter = "all";
  function apply() {
    const words = input.value.toLowerCase().trim().split(/\\s+/).filter(Boolean);
    let shown = 0;
    for (const card of cards) {
      const text = card.dataset.search;
      const tags = card.dataset.filters.split(" ");
      const ok = (filter === "all" || tags.includes(filter)) && words.every((w) => text.includes(w));
      card.hidden = !ok;
      if (ok) shown += 1;
    }
    for (const day of days) day.hidden = !day.querySelector(".card:not([hidden])");
    for (const week of weeks) week.hidden = !week.querySelector(".card:not([hidden])");
    for (const upcoming of document.querySelectorAll(".upcoming")) upcoming.hidden = filter !== "all" || words.length > 0;
    count.textContent = shown + " of " + cards.length + " exercises";
    empty.hidden = shown !== 0;
  }
  input.addEventListener("input", apply);
  for (const chip of chips) {
    chip.addEventListener("click", () => {
      filter = chip.dataset.filter;
      for (const other of chips) other.setAttribute("aria-pressed", String(other === chip));
      apply();
    });
  }
  apply();
})();
</script>
</body>
</html>
"""


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--repo", default=".")
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--write", action="store_true")
    mode.add_argument("--check", action="store_true")
    args = parser.parse_args()
    repo = Path(args.repo).resolve()
    page = render(collect(repo))
    target = repo / OUTPUT
    if args.write:
        target.write_bytes(page.encode("utf-8"))
        print(f"[WRITE] {OUTPUT}")
        return 0
    current = target.read_bytes().decode("utf-8") if target.exists() else ""
    if current != page:
        print(f"[FAIL] {OUTPUT} is stale. Regenerate with: python tools/build_showcase.py --repo . --write")
        return 1
    print(f"[PASS] {OUTPUT} is current")
    return 0


if __name__ == "__main__":
    sys.exit(main())
