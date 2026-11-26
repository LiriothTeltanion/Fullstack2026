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
ANY_TITLE_RE = re.compile(r"^# (?P<emoji>\S+) (?P<rest>.+)$")


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


def technologies(repo: Path, folder: str, files: list[str], has_demo: bool) -> list[str]:
    inside = [PurePosixPath(f[len(folder) + 1:]) for f in files if f.startswith(folder + "/")]
    suffixes = {path.suffix.lower() for path in inside}
    dependencies: set[str] = set()
    runs_node = False
    for path in inside:
        if path.name != "package.json" or {"tests", "test", "__tests__", "fixtures"} & set(path.parts[:-1]):
            continue
        manifest = json.loads((repo / folder / path).read_text(encoding="utf-8-sig"))
        dependencies.update(manifest.get("dependencies", {}))
        scripts = manifest.get("scripts", {})
        # A production server may use only Node built-ins. A test runner or bundler
        # alone does not make a React exercise a Node application.
        runs_node |= any(scripts.get(name, "").startswith("node ") for name in ("start", "server", "api"))
    has_react = "react" in dependencies
    tags: list[str] = []
    if ".py" in suffixes:
        tags.append("Python")
    if {".ts", ".tsx"} & suffixes:
        tags.append("TypeScript")
    if ".sql" in suffixes:
        tags.append("SQL")
    if has_react:
        tags.append("React")
        if ".jsx" in suffixes or any(path.suffix == ".js" and "src" in path.parts for path in inside):
            tags.append("JavaScript")
        if runs_node or {"express", "fastify", "koa"} & dependencies:
            tags.append("Node.js")
    elif {".js", ".mjs", ".cjs"} & suffixes:
        tags.append("JavaScript" if has_demo else "Node.js")
    if {"redux", "@reduxjs/toolkit", "react-redux"} & dependencies:
        tags.append("Redux")
    if ".html" in suffixes:
        tags.append("HTML/CSS")
    return tags or ["Notes"]


def sort_key(item: dict) -> tuple:
    emoji_rank = KIND_ORDER.index(item["emoji"]) if item["emoji"] in KIND_ORDER else 99
    numbers = [int(n) for n in NUMBER_RE.findall(item["path"].split("/", 2)[-1])]
    return (emoji_rank, numbers, item["path"].lower())


def is_bundled_app(index: Path) -> bool:
    """True for Vite apps whose index.html loads src/main.jsx or .tsx (they need a build first)."""
    text = index.read_text(encoding="utf-8", errors="ignore")
    return bool(re.search(r"src=\"/?src/main\.(jsx|tsx|ts|js)\"", text))


def collect(repo: Path) -> dict:
    files = tracked_files(repo)
    display = json.loads((repo / ".learning/display-map.json").read_text(encoding="utf-8"))
    weeks: list[dict] = []
    for week in display["weeks"]:
        number = int(re.match(r"Week(\d+)", week["path"]).group(1))
        days = [{"path": day["path"], "title": day["title"], "items": []} for day in week.get("days", [])]
        weeks.append({"number": number, "path": week["path"], "title": week["display_title"], "days": days})
    by_day = {day["path"]: day for week in weeks for day in week["days"]}
    total = demos = todo = 0
    for readme in sorted(f for f in files if f.startswith("Week") and f.endswith("/README.md")):
        text = (repo / readme).read_text(encoding="utf-8")
        is_todo = "**Status:** to do" in text
        if not is_todo and "## ▶️ How to run" not in text:
            continue
        first = text.splitlines()[0]
        match = TITLE_RE.match(first) or ANY_TITLE_RE.match(first)
        if not match:
            continue
        folder = str(PurePosixPath(readme).parent)
        day_path = "/".join(folder.split("/")[:2])
        if day_path not in by_day:
            continue
        kind, _, name = match.group("rest").partition(" - ")
        item = {
            "path": folder,
            "emoji": match.group("emoji"),
            "kind": kind.strip(),
            "name": (name or "").strip(),
            "todo": is_todo,
        }
        if is_todo:
            status = re.search(r"\*\*Status:\*\* to do · ([^\n]+)", text)
            item.update(
                {
                    "intro": "Not done yet. The folder is ready for the code.",
                    "tags": [],
                    "demo": False,
                    "needs_key": False,
                    "status": status.group(1).strip() if status else "To do",
                    "required": bool(status and "Required" in status.group(1)),
                }
            )
            todo += 1
        else:
            has_demo = f"{folder}/index.html" in files and not is_bundled_app(repo / folder / "index.html")
            item.update(
                {
                    "intro": first_paragraph(text),
                    "tags": technologies(repo, folder, files, has_demo),
                    "demo": has_demo,
                    "needs_key": any(f.startswith(folder + "/") and f.endswith("config.example.js") for f in files),
                }
            )
            total += 1
            demos += has_demo
        by_day[day_path]["items"].append(item)
    for day in by_day.values():
        day["items"].sort(key=lambda entry: (entry["todo"],) + sort_key(entry))
    for week in weeks:
        week["done"] = sum(1 for day in week["days"] for item in day["items"] if not item["todo"])
        week["todo"] = sum(1 for day in week["days"] for item in day["items"] if item["todo"])
    return {"weeks": weeks, "total": total, "demos": demos, "todo": todo}


def render_card(item: dict) -> str:
    title = item["name"] or item["kind"]
    subtitle = item["kind"] if item["name"] else ""
    tags = "".join(f'<li class="tag">{html.escape(tag)}</li>' for tag in item["tags"])
    search = " ".join([item["kind"], item["name"], item["intro"], " ".join(item["tags"]), item["path"]]).lower()
    filters = " ".join(tag.lower().replace("/", "-").replace(".", "") for tag in item["tags"])
    filters += " todo" if item["todo"] else " done"
    if item["demo"]:
        filters += " demo"
    links = []
    if item["demo"]:
        links.append(f'<a class="btn btn-primary" href="{html.escape(item["path"])}/index.html">▶ Open demo</a>')
    if item["todo"]:
        links.append(f'<a class="btn" href="{REPO_URL}/tree/main/{html.escape(item["path"])}">Folder</a>')
        level = "required" if item["required"] else "optional"
        badge = f'<p class="status {level}">📝 To do · {html.escape(item["status"])}</p>'
        body = f'{badge}<p class="intro">{html.escape(item["intro"])}</p>'
    else:
        links.append(f'<a class="btn" href="{REPO_URL}/tree/main/{html.escape(item["path"])}">Code</a>')
        links.append(f'<a class="btn" href="{REPO_URL}/blob/main/{html.escape(item["path"])}/README.md">README</a>')
        note = '<p class="note">Needs your own API key in config.js</p>' if item["needs_key"] else ""
        body = f'<p class="intro">{html.escape(item["intro"])}</p>{note}<ul class="tags" aria-label="Technologies">{tags}</ul>'
    css = "card todo-card" if item["todo"] else "card"
    return (
        f'<article class="{css}" data-search="{html.escape(search)}" data-filters="{html.escape(filters)}">'
        f'<header class="card-head"><span class="kind-emoji" aria-hidden="true">{item["emoji"]}</span>'
        f'<div><h4>{html.escape(title)}</h4>'
        + (f'<p class="kind">{html.escape(subtitle)}</p>' if subtitle else "")
        + f'</div></header>{body}<div class="actions">{"".join(links)}</div></article>'
    )


def render(data: dict) -> str:
    nav = []
    sections = []
    for week in data["weeks"]:
        anchor = f"week-{week['number']}"
        nav.append(f'<li><a href="#{anchor}">{html.escape(week["title"].split(" — ")[0])}</a></li>')
        days = []
        for day in week["days"]:
            if not day["items"]:
                continue
            cards = "".join(render_card(item) for item in day["items"])
            done = sum(1 for item in day["items"] if not item["todo"])
            left = len(day["items"]) - done
            meta = f'<span class="day-meta">{done} done' + (f" · {left} to do" if left else "") + "</span>"
            days.append(
                f'<div class="day"><h3>{html.escape(day["title"])} {meta}</h3><div class="grid">{cards}</div></div>'
            )
        badges = f' <span class="count">{week["done"]}</span>' if week["done"] else ""
        badges += f' <span class="todo">{week["todo"]} to do</span>' if week["todo"] else ""
        sections.append(
            f'<section class="week" id="{anchor}" aria-labelledby="{anchor}-title">'
            f'<h2 id="{anchor}-title">{html.escape(week["title"])}{badges}</h2>' + "".join(days) + "</section>"
        )
    page = TEMPLATE
    if data["todo"] == 0:
        page = page.replace("    <li><strong>{{TODO}}</strong> still to do</li>\n", "")
        page = page.replace(
            '      <button class="chip" type="button" data-filter="todo" aria-pressed="false">📝 To do</button>\n', ""
        )
        page = page.replace(" Dashed cards are the ones I still have to do.", "")
    return (
        page.replace("{{TOTAL}}", str(data["total"]))
        .replace("{{DEMOS}}", str(data["demos"]))
        .replace("{{TODO}}", str(data["todo"]))
        .replace("{{WEEKS}}", str(len(data["weeks"])))
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
.todo-card { background: linear-gradient(180deg, rgba(19,27,61,.55), rgba(14,20,48,.55)); border-style: dashed; }
.todo-card h4 { color: #cfd5f5; }
.status { margin: 0; font-size: .82rem; font-weight: 600; }
.status.required { color: var(--amber); }
.status.optional { color: var(--violet); }
.day-meta { font-size: .8rem; color: var(--muted); font-weight: 500; margin-left: 6px; }
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
  <img src="assets/readme/hero/root-banner.svg" alt="Fullstack2026 fourteen-week course map: Weeks 1–6 hold my Python, JavaScript, TypeScript, SQL and Node.js work; Weeks 7–14 hold the React, Redux, TypeScript and web projects." width="1200" height="420">
  <h1><span>Fullstack2026</span> · Exercise Showcase</h1>
  <p>Every exercise, daily challenge and mini project from my Developers Institute full-stack bootcamp, all fourteen weeks, day by day. Browser projects open as live demos; Python, Node.js and SQL work links to the code and its README. Dashed cards are the ones I still have to do.</p>
  <ul class="stats">
    <li><strong>{{TOTAL}}</strong> exercises</li>
    <li><strong>{{DEMOS}}</strong> live demos</li>
    <li><strong>{{WEEKS}}</strong> weeks</li>
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
      <button class="chip" type="button" data-filter="done" aria-pressed="false">✅ Done</button>
      <button class="chip" type="button" data-filter="todo" aria-pressed="false">📝 To do</button>
      <button class="chip" type="button" data-filter="demo" aria-pressed="false">▶ Live demos</button>
      <button class="chip" type="button" data-filter="python" aria-pressed="false">Python</button>
      <button class="chip" type="button" data-filter="javascript" aria-pressed="false">JavaScript</button>
      <button class="chip" type="button" data-filter="typescript" aria-pressed="false">TypeScript</button>
      <button class="chip" type="button" data-filter="react" aria-pressed="false">React</button>
      <button class="chip" type="button" data-filter="redux" aria-pressed="false">Redux</button>
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
  const weeks = [...document.querySelectorAll(".week")];
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
    count.textContent = shown + " of " + cards.length + " cards";
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
