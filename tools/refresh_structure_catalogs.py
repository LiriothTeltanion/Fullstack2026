#!/usr/bin/env python3
"""Regenerate canonical Fullstack2026 structure catalogs from Git's index.

The script is deterministic, dependency-free, and uses indexed blob contents
rather than a case-insensitive filesystem walk. Use ``--check`` in CI and
``--write`` only when intentionally refreshing generated evidence.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import re
import subprocess
import sys
from collections import defaultdict
from datetime import date
from pathlib import Path, PurePosixPath


GENERATED_OUTPUT_PATHS = (
    "reports/nova/catalog_manifest.json",
    "reports/nova/exercise_catalog.csv",
    "reports/nova/exercise_catalog.md",
    "reports/nova/file_inventory.csv",
    "reports/nova/tree.txt",
    "reports/nova/rename_plan.csv",
    "reports/nova/README.md",
)

CATALOG_METADATA_PATH = "reports/nova/exercise_catalog_metadata.csv"

EXERCISE_CATALOG_FIELDS = (
    "path",
    "title",
    "suggested_slug",
    "goal",
    "week",
    "day",
    "kind",
    "tier",
    "technologies",
    "file_count",
    "size_bytes",
    "lines",
    "source_files",
    "entry_points",
    "has_readme",
    "readme_path",
    "test_files",
    "syntax_errors",
    "completion_score",
    "quality_score",
)

CATALOG_METADATA_FIELDS = (
    "path",
    "kind",
    "tier",
    "entry_points",
)

CATALOG_GOAL_BOUNDARY = (
    "Review this indexed source against the official assignment; runtime behavior and Kevin's learning "
    "evidence remain unverified."
)

CATALOG_TECHNOLOGIES = {"CSS", "HTML", "JavaScript", "JSON", "Python", "SQL", "TypeScript"}

PATH_REPLACEMENTS = (
    (
        "Week4AdvAsynchronousJavaScript/Day3HTTPandFormmethodGETandPOST",
        "Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST",
    ),
    ("Week5MiniprojectAndTypeScript", "Week5MiniProjectAndTypeScript"),
    ("Week5MiniProjectAndTypeScript/Day1Miniproject", "Week5MiniProjectAndTypeScript/Day1MiniProject"),
    ("/DailyChallange/", "/DailyChallenge/"),
    ("Week1Python/Day3Dictionaries/Exercises/ExercisesXP+", "Week1Python/Day3Dictionaries/Exercises/ExercisesXPPlus"),
    (
        "Week6DatabasesAndNodejs/Day1IntroductionToDatabases/Exercises/ExercisesXP+",
        "Week6DatabasesAndNodejs/Day1IntroductionToDatabases/Exercises/ExercisesXPPlus",
    ),
    ("Week2OOP/Day5MiniProject/DailyChallenge/OOPQuizz", "Week2OOP/Day5MiniProject/DailyChallenge/OOPQuiz"),
    ("Week3JavaScriptandDOM/Remote LearningJSAndDOM", "Week3JavaScriptandDOM/RemoteLearningJSAndDOM"),
    (
        "Week4AdvAsynchronousJavaScript/Day5Fetch&AsyncAwait",
        "Week4AdvAsynchronousJavaScript/Day5FetchAndAsyncAwait",
    ),
    (
        "Week6DatabasesAndNodejs/Day3DatabaseConcepts2/Exercises/ExercicesXPGold",
        "Week6DatabasesAndNodejs/Day3DatabaseConcepts2/Exercises/ExercisesXPGold",
    ),
    (
        "Week2OOP/Day5MiniProject/Exercises/AnagramChecker/readme.md",
        "Week2OOP/Day5MiniProject/Exercises/AnagramChecker/README.md",
    ),
    (
        "Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST/DailyChallenge/TrueOrFalse/index1.html",
        "Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST/DailyChallenge/TrueOrFalse/index.html",
    ),
)

SOURCE_SUFFIXES = {".cjs", ".css", ".html", ".js", ".jsx", ".mjs", ".py", ".sql", ".ts", ".tsx"}
TEST_RE = re.compile(r"(^|/)(tests?|__tests__)(/|$)|(^|/)test_[^/]+\.py$|\.(test|spec)\.", re.I)

LANGUAGES = {
    ".cjs": "JavaScript",
    ".css": "CSS",
    ".html": "HTML",
    ".js": "JavaScript",
    ".json": "JSON",
    ".jsx": "JavaScript",
    ".md": "Markdown",
    ".mjs": "JavaScript",
    ".py": "Python",
    ".sql": "SQL",
    ".svg": "SVG",
    ".toml": "TOML",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".txt": "Text",
    ".yaml": "YAML",
    ".yml": "YAML",
}

FILE_INVENTORY_FIELDS = (
    "path",
    "size_bytes",
    "lines",
    "extension",
    "language",
    "category",
    "binary",
    "sha256",
    "encoding",
    "tracked",
    "week",
    "day",
    "exercise_root",
    "exercise_kind",
    "tier",
    "is_test",
    "is_readme",
    "todo_count",
    "trailing_whitespace_lines",
    "mixed_line_endings",
    "syntax_ok",
    "syntax_error",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", default=".", help="repository root")
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--write", action="store_true", help="write regenerated reports")
    mode.add_argument("--check", action="store_true", help="fail if generated reports differ")
    parser.add_argument("--generated-on", help="YYYY-MM-DD provenance date (write mode only)")
    parser.add_argument("--base-head", help="Git commit used as the generation base (write mode only)")
    return parser.parse_args()


def run_git(root: Path, *arguments: str) -> bytes:
    result = subprocess.run(
        ["git", "-C", str(root), *arguments],
        capture_output=True,
        check=False,
    )
    if result.returncode:
        message = result.stderr.decode("utf-8", errors="replace").strip()
        raise RuntimeError(f"git {' '.join(arguments)} failed: {message}")
    return result.stdout


def index_entries(root: Path) -> dict[str, str]:
    entries: dict[str, str] = {}
    for record in run_git(root, "ls-files", "--stage", "-z").split(b"\0"):
        if not record:
            continue
        metadata, raw_path = record.split(b"\t", 1)
        _mode, raw_oid, raw_stage = metadata.split()
        if raw_stage != b"0":
            path = raw_path.decode("utf-8", errors="surrogateescape")
            raise RuntimeError(f"unmerged index entry prevents catalog generation: {path}")
        path = raw_path.decode("utf-8", errors="surrogateescape").replace("\\", "/")
        entries[path] = raw_oid.decode("ascii")
    return dict(sorted(entries.items()))


def indexed_blobs(root: Path, entries: dict[str, str]) -> dict[str, bytes]:
    object_ids = list(dict.fromkeys(entries.values()))
    payload = "".join(f"{object_id}\n" for object_id in object_ids).encode("ascii")
    result = subprocess.run(
        ["git", "-C", str(root), "cat-file", "--batch"],
        input=payload,
        capture_output=True,
        check=False,
    )
    if result.returncode:
        message = result.stderr.decode("utf-8", errors="replace").strip()
        raise RuntimeError(f"git cat-file --batch failed: {message}")
    stream = io.BytesIO(result.stdout)
    objects: dict[str, bytes] = {}
    for expected_oid in object_ids:
        header = stream.readline().decode("ascii", errors="replace").strip().split()
        if len(header) != 3 or header[1] != "blob":
            raise RuntimeError(f"unexpected cat-file response for {expected_oid}: {' '.join(header)}")
        size = int(header[2])
        content = stream.read(size)
        if stream.read(1) != b"\n":
            raise RuntimeError(f"malformed cat-file payload for {expected_oid}")
        objects[expected_oid] = content
    return {path: objects[object_id] for path, object_id in entries.items()}


def normalize_path(value: str) -> str:
    updated = value.replace("\\", "/")
    for old, new in sorted(PATH_REPLACEMENTS, key=lambda pair: len(pair[0]), reverse=True):
        updated = updated.replace(old, new)
    return updated


def csv_text(fieldnames: tuple[str, ...] | list[str], rows: list[dict[str, object]]) -> str:
    output = io.StringIO(newline="")
    writer = csv.DictWriter(output, fieldnames=fieldnames, lineterminator="\n", extrasaction="ignore")
    writer.writeheader()
    writer.writerows(rows)
    return output.getvalue()


def decode_text(content: bytes) -> tuple[str | None, str]:
    if b"\0" in content:
        return None, "binary"
    try:
        if content.startswith(b"\xef\xbb\xbf"):
            return content.decode("utf-8-sig"), "utf-8-sig"
        return content.decode("utf-8"), "utf-8"
    except UnicodeDecodeError:
        pass
    return None, "binary-or-non-utf8"


def direct_readme(path: str, indexed_paths: set[str]) -> str:
    prefix = f"{path}/"
    candidates = [
        candidate
        for candidate in indexed_paths
        if candidate.startswith(prefix)
        and "/" not in candidate[len(prefix) :]
        and PurePosixPath(candidate).name.casefold() == "readme.md"
    ]
    if len(candidates) > 1:
        raise RuntimeError(f"multiple direct README case variants found for catalog path: {path}")
    return candidates[0] if candidates else ""


def normalize_list(value: str, indexed_paths: set[str]) -> str:
    normalized = [normalize_path(item.strip()) for item in value.split(" | ") if item.strip()]
    return " | ".join(item for item in normalized if item in indexed_paths)


def markdown_cell(value: object) -> str:
    return str(value).replace("|", "\\|").replace("\r", " ").replace("\n", " ")


def catalog_slug(path: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", path.casefold()).strip("-")


def detect_technologies(exercise_files: list[str], blobs: dict[str, bytes]) -> str:
    technologies: set[str] = set()
    for item in exercise_files:
        suffix = PurePosixPath(item).suffix.lower()
        language = LANGUAGES.get(suffix)
        if language in CATALOG_TECHNOLOGIES:
            technologies.add(language)
        if suffix != ".html":
            continue
        text, _encoding = decode_text(blobs[item])
        if text is None:
            continue
        if re.search(r"<script\b", text, re.I):
            technologies.add("JavaScript")
        if re.search(r"<style\b", text, re.I):
            technologies.add("CSS")
    return " | ".join(sorted(technologies))


def build_exercise_catalog(
    blobs: dict[str, bytes],
    generated_on: str,
    head_commit: str,
    source_fingerprint: str,
) -> tuple[str, str]:
    metadata_bytes = blobs.get(CATALOG_METADATA_PATH)
    if metadata_bytes is None:
        raise RuntimeError(f"missing indexed catalog metadata source: {CATALOG_METADATA_PATH}")
    metadata_text, _encoding = decode_text(metadata_bytes)
    if metadata_text is None:
        raise RuntimeError(f"cannot decode indexed catalog metadata as UTF-8: {CATALOG_METADATA_PATH}")
    reader = csv.DictReader(io.StringIO(metadata_text, newline=""))
    missing_metadata_fields = [
        field for field in CATALOG_METADATA_FIELDS if field not in (reader.fieldnames or [])
    ]
    if missing_metadata_fields:
        raise RuntimeError(
            f"{CATALOG_METADATA_PATH} is missing field(s): {', '.join(missing_metadata_fields)}"
        )
    existing_rows = list(reader)

    indexed_paths = set(blobs)
    rows: list[dict[str, object]] = []
    for original in existing_rows:
        row: dict[str, object] = {field: "" for field in EXERCISE_CATALOG_FIELDS}
        row.update({field: original.get(field, "") for field in CATALOG_METADATA_FIELDS})
        path = normalize_path(original["path"])
        exercise_files = sorted(item for item in indexed_paths if item.startswith(f"{path}/"))
        if not exercise_files:
            raise RuntimeError(f"catalog exercise path has no indexed files after normalization: {path}")
        source_files = [item for item in exercise_files if PurePosixPath(item).suffix.lower() in SOURCE_SUFFIXES]
        readme = direct_readme(path, indexed_paths)
        tests = [item for item in exercise_files if TEST_RE.search(item)]

        row["path"] = path
        row["title"] = PurePosixPath(path).name
        row["suggested_slug"] = catalog_slug(path)
        row["goal"] = CATALOG_GOAL_BOUNDARY
        row["week"] = path.split("/", 1)[0]
        row["day"] = path.split("/")[1] if len(path.split("/")) > 1 else ""
        row["technologies"] = detect_technologies(exercise_files, blobs)
        row["file_count"] = len(exercise_files)
        row["size_bytes"] = sum(len(blobs[item]) for item in exercise_files)
        row["lines"] = sum(
            len(text.splitlines())
            for item in exercise_files
            for text, _encoding in [decode_text(blobs[item])]
            if text is not None
        )
        row["source_files"] = " | ".join(source_files)
        row["entry_points"] = normalize_list(original.get("entry_points", ""), indexed_paths)
        row["has_readme"] = bool(readme)
        row["readme_path"] = readme
        row["test_files"] = " | ".join(tests)
        row["syntax_errors"] = ""
        row["completion_score"] = "unverified"
        row["quality_score"] = "unverified"
        rows.append(row)
    rows.sort(key=lambda item: str(item["path"]).casefold())

    markdown = [
        "# Canonical Exercise Catalog",
        "",
        f"> Regenerated from the exact Git index on `{generated_on}` by `tools/refresh_structure_catalogs.py`.",
        "",
        f"- Base HEAD: `{head_commit}`",
        f"- Source-index fingerprint: `sha256:{source_fingerprint}` (generated outputs excluded)",
        "",
        "This catalog proves repository presence and path integrity only. It does not prove that an exercise runs, that Kevin can explain it, or that it is mastered or portfolio-ready.",
        "",
        f"- Indexed exercise families: **{len(rows)}**",
        "- Completion and quality scores: **unverified** pending exercise-level review",
        "- Regenerate: `python tools/refresh_structure_catalogs.py --repo . --write`",
        "- Check drift: `python tools/refresh_structure_catalogs.py --repo . --check`",
        "",
        "| Exercise family | Kind | Technologies | Files | README | Verification |",
        "|---|---|---|---:|---|---|",
    ]
    for row in rows:
        path = str(row["path"])
        link = f"[source](<../../{path}>)"
        readme_path = str(row["readme_path"])
        if not readme_path:
            readme_state = "missing"
        elif PurePosixPath(readme_path).name == "README.md":
            readme_state = "present (canonical)"
        else:
            readme_state = f"present (noncanonical case: {PurePosixPath(readme_path).name})"
        markdown.append(
            f"| `{markdown_cell(path)}` | {markdown_cell(row.get('kind') or '—')} | "
            f"{markdown_cell(row.get('technologies') or '—')} | {row['file_count']} | "
            f"{markdown_cell(readme_state)} | {link}; runtime unverified |"
        )
    markdown.append("")
    return csv_text(list(EXERCISE_CATALOG_FIELDS), rows), "\n".join(markdown)


def classify_path(path: str) -> tuple[str, str, str, str, str]:
    parts = path.split("/")
    week = parts[0] if parts and parts[0].startswith("Week") else ""
    day = parts[1] if week and len(parts) > 1 and parts[1].startswith("Day") else ""
    exercise_root = ""
    exercise_kind = ""
    tier = ""
    for marker in ("DailyChallenge", "Exercises"):
        if marker not in parts:
            continue
        index = parts.index(marker)
        exercise_kind = "Daily Challenge" if marker == "DailyChallenge" else "Exercise"
        if len(parts) > index + 2:
            exercise_root = "/".join(parts[: index + 2])
            name = parts[index + 1]
            tier = "XP Gold" if "Gold" in name else "XP" if "XP" in name else ""
        else:
            exercise_root = "/".join(parts[: index + 1])
        break
    return week, day, exercise_root, exercise_kind, tier


def file_category(path: str, suffix: str, is_test: bool) -> str:
    if path.startswith("reports/"):
        return "report"
    if is_test:
        return "test"
    if suffix in SOURCE_SUFFIXES:
        return "source"
    if suffix in {".md", ".txt"}:
        return "documentation"
    if suffix in {".json", ".toml", ".yaml", ".yml"} or PurePosixPath(path).name.startswith("."):
        return "configuration"
    return "asset"


def build_file_inventory(blobs: dict[str, bytes]) -> str:
    rows: list[dict[str, object]] = []
    for path, content in sorted(blobs.items()):
        if path == "reports/nova/file_inventory.csv":
            continue  # Avoid a self-referential hash while retaining complete coverage of every other blob.
        pure = PurePosixPath(path)
        suffix = pure.suffix.lower()
        text, encoding = decode_text(content)
        is_test = bool(TEST_RE.search(path))
        week, day, exercise_root, exercise_kind, tier = classify_path(path)
        lines = text.splitlines() if text is not None else []
        has_crlf = b"\r\n" in content
        without_crlf = content.replace(b"\r\n", b"")
        mixed_line_endings = has_crlf and (b"\n" in without_crlf or b"\r" in without_crlf)
        rows.append(
            {
                "path": path,
                "size_bytes": len(content),
                "lines": len(lines),
                "extension": suffix or "[no extension]",
                "language": LANGUAGES.get(suffix, "Other"),
                "category": file_category(path, suffix, is_test),
                "binary": text is None,
                "sha256": hashlib.sha256(content).hexdigest(),
                "encoding": encoding,
                "tracked": True,
                "week": week,
                "day": day,
                "exercise_root": exercise_root,
                "exercise_kind": exercise_kind,
                "tier": tier,
                "is_test": is_test,
                "is_readme": pure.name.casefold() == "readme.md",
                "todo_count": len(re.findall(r"\b(?:TODO|FIXME)\b", text or "", re.I)),
                "trailing_whitespace_lines": sum(1 for line in lines if line.rstrip() != line),
                "mixed_line_endings": mixed_line_endings,
                "syntax_ok": "",
                "syntax_error": "",
            }
        )
    return csv_text(list(FILE_INVENTORY_FIELDS), rows)


def build_tree(paths: list[str], generated_on: str, head_commit: str, source_fingerprint: str) -> str:
    root: dict[str, dict] = {}
    for path in paths:
        node = root
        for part in path.split("/"):
            node = node.setdefault(part, {})

    lines = [
        "Fullstack2026 canonical Git-index tree",
        f"Regenerated: {generated_on}",
        f"Base HEAD: {head_commit}",
        f"Source-index SHA-256 (generated outputs excluded): {source_fingerprint}",
        f"Indexed files: {len(paths)}",
        "",
        ".",
    ]

    def render(node: dict[str, dict], prefix: str = "") -> None:
        names = sorted(node, key=lambda item: (not node[item], item.casefold()))
        for index, name in enumerate(names):
            last = index == len(names) - 1
            lines.append(f"{prefix}{'└── ' if last else '├── '}{name}")
            if node[name]:
                render(node[name], prefix + ("    " if last else "│   "))

    render(root)
    lines.append("")
    return "\n".join(lines)


def build_rename_plan() -> str:
    fields = ["approved", "action", "old_path", "new_path", "risk", "reason", "destination_exists", "notes"]
    rows = [
        {
            "approved": "no",
            "action": "proposed",
            "old_path": "Week6DatabasesAndNodejs",
            "new_path": "Week6DatabasesAndNodeJS",
            "risk": "medium",
            "reason": "Potential acronym-casing cleanup outside the authorized Week 1 structural scope.",
            "destination_exists": "false",
            "notes": "Do not execute without link audit and an explicit later-wave decision.",
        },
        {
            "approved": "no",
            "action": "proposed",
            "old_path": "Week6DatabasesAndNodejs/Day4NodejsIntroduction",
            "new_path": "Week6DatabasesAndNodejs/Day4NodeJSIntroduction",
            "risk": "medium",
            "reason": "Potential acronym-casing cleanup outside the authorized Week 1 structural scope.",
            "destination_exists": "false",
            "notes": "Keep current indexed path until a later bounded migration is approved.",
        },
    ]
    return csv_text(fields, rows)


def build_reports_readme(
    indexed_count: int,
    exercise_count: int,
    generated_on: str,
    head_commit: str,
    source_fingerprint: str,
) -> str:
    return f"""# NOVA Reports — Status and Lineage

## Current structural evidence ({generated_on})

- [Canonical exercise catalog](exercise_catalog.md) — {exercise_count} indexed exercise families; runtime and mastery remain unverified.
- `exercise_catalog_metadata.csv` — versioned structural labels and review-entry hints; semantic titles/goals/technologies are derived conservatively and do not prove runtime or assignment correctness.
- `exercise_catalog.csv` — machine-readable canonical path catalog.
- `file_inventory.csv` — indexed-blob inventory (self-entry intentionally excluded to avoid a recursive hash).
- `tree.txt` — exact-case tree for {indexed_count} Git-indexed files.
- `rename_plan.csv` — unapproved later-wave proposals only.
- `catalog_manifest.json` — generation date, base HEAD, and stable source-index fingerprint.
- [`../resume/`](../resume/) — Wave 0 baseline, duplicate accounting, decisions, test map, and open-work triage.

Generation basis: HEAD `{head_commit}` plus the staged source index fingerprint `sha256:{source_fingerprint}`. The versioned metadata source is included; generated catalog outputs are excluded to avoid self-reference.

Regenerate with `python tools/refresh_structure_catalogs.py --repo . --write`; verify drift with `python tools/refresh_structure_catalogs.py --repo . --check`.

## Quality snapshots

- [Offline readiness dashboard](nova_repo_dashboard.html)
- [NOVA audit](nova_repo_audit.md)
- [Quality gate report](quality_report.md)
- [Stored NOVA command manifest](NOVA_UPDATE_REPORT.md) — check its embedded timestamp before use.

Read each embedded generation timestamp before treating a quality snapshot as current. Static readiness is not a course grade and does not prove interactive, browser, API, TypeScript-semantic, or SQL behavior.

## Superseded narrative snapshots

`README.nova.generated.md`, `next_actions.md`, and `SUMMARY.txt` preserve earlier generated guidance. They are not the current source of truth; use `reports/resume/`, `.learning/`, and the current Git index instead. Earlier versions of the regenerated catalogs remain available through Git history.
"""


def existing_provenance(root: Path) -> tuple[str, str]:
    relative = "reports/nova/catalog_manifest.json"
    try:
        manifest = json.loads(run_git(root, "show", f":{relative}").decode("utf-8-sig"))
        generated_on = str(manifest["generated_on"])
        base_head = str(manifest["base_head"])
    except (KeyError, TypeError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"cannot read indexed catalog provenance from {relative}: {exc}") from exc
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", generated_on):
        raise RuntimeError(f"invalid generated_on value in {relative}: {generated_on!r}")
    if not re.fullmatch(r"[0-9a-f]{40,64}", base_head):
        raise RuntimeError(f"invalid base_head value in {relative}: {base_head!r}")
    return generated_on, base_head


def build_outputs(root: Path, generated_on: str, head_commit: str) -> dict[str, str]:
    entries = index_entries(root)
    blobs = indexed_blobs(root, entries)
    source_rows = [
        f"{entries[path]} {path}"
        for path in sorted(entries)
        if path not in GENERATED_OUTPUT_PATHS
    ]
    source_fingerprint = hashlib.sha256("\n".join(source_rows).encode("utf-8")).hexdigest()
    exercise_csv, exercise_markdown = build_exercise_catalog(
        blobs,
        generated_on,
        head_commit,
        source_fingerprint,
    )
    exercise_count = max(0, exercise_csv.count("\n") - 1)
    manifest = {
        "schema_version": 2,
        "generated_on": generated_on,
        "generator": "tools/refresh_structure_catalogs.py",
        "base_head": head_commit,
        "source_index_sha256": source_fingerprint,
        "source_index_file_count": len(source_rows),
        "fingerprint_excludes": list(GENERATED_OUTPUT_PATHS),
        "catalog_metadata_source": CATALOG_METADATA_PATH,
        "evidence_boundary": "Path and indexed-blob evidence only; not runtime, learning, mastery, or portfolio proof.",
    }
    outputs = {
        "reports/nova/catalog_manifest.json": json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        "reports/nova/exercise_catalog.csv": exercise_csv,
        "reports/nova/exercise_catalog.md": exercise_markdown,
        "reports/nova/tree.txt": build_tree(list(entries), generated_on, head_commit, source_fingerprint),
        "reports/nova/rename_plan.csv": build_rename_plan(),
        "reports/nova/README.md": build_reports_readme(
            len(entries),
            exercise_count,
            generated_on,
            head_commit,
            source_fingerprint,
        ),
    }
    # Inventory the output bytes that this same run will write, not stale output
    # blobs currently in the index. This makes one refresh + git add converge;
    # file_inventory.csv itself remains excluded to avoid a recursive hash.
    inventory_blobs = dict(blobs)
    for relative, content in outputs.items():
        if relative in entries:
            inventory_blobs[relative] = content.encode("utf-8")
    outputs["reports/nova/file_inventory.csv"] = build_file_inventory(inventory_blobs)
    return outputs


def main() -> int:
    args = parse_args()
    root = Path(args.repo).expanduser().resolve()
    if not (root / ".git").exists():
        print(f"[FATAL] Not a Git repository root: {root}", file=sys.stderr)
        return 2
    try:
        if args.check:
            if args.generated_on or args.base_head:
                raise RuntimeError("--generated-on and --base-head are valid only with --write")
            generated_on, base_head = existing_provenance(root)
        else:
            generated_on = args.generated_on or date.today().isoformat()
            base_head = args.base_head or run_git(root, "rev-parse", "HEAD").decode("ascii").strip()
            if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", generated_on):
                raise RuntimeError(f"invalid --generated-on value: {generated_on!r}")
            if not re.fullmatch(r"[0-9a-f]{40,64}", base_head):
                raise RuntimeError(f"invalid --base-head value: {base_head!r}")
        outputs = build_outputs(root, generated_on, base_head)
    except (OSError, RuntimeError, csv.Error) as exc:
        print(f"[FATAL] {exc}", file=sys.stderr)
        return 2

    drift: list[str] = []
    for relative, expected in outputs.items():
        path = root / relative
        current = path.read_text(encoding="utf-8-sig") if path.exists() else None
        if current == expected:
            print(f"[PASS] {relative}")
            continue
        if args.check:
            drift.append(relative)
            print(f"[FAIL] generated report is stale: {relative}")
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(expected, encoding="utf-8", newline="\n")
            print(f"[WRITE] {relative}")

    if drift:
        print("\nRegenerate with: python tools/refresh_structure_catalogs.py --repo . --write")
        return 1
    print("\nCanonical structure catalogs are current.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
