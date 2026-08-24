#!/usr/bin/env python3
"""Deterministic structural checks for the Fullstack2026 repository.

The validator treats Git's index as the source of truth so it can detect casing
problems that a case-insensitive Windows working tree would otherwise hide.
It intentionally avoids third-party dependencies and never writes files.
"""

from __future__ import annotations

import argparse
import csv
import io
import importlib.util
import json
import posixpath
import re
import subprocess
import sys
from collections import defaultdict
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlsplit


def load_learning_intake_module():
    """Load the sibling intake validator without requiring tools/ as a package."""

    path = Path(__file__).with_name("learning_intake.py")
    spec = importlib.util.spec_from_file_location("fullstack2026_learning_intake_validation", path)
    if spec is None or spec.loader is None:
        raise ImportError(path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


LEARNING_INTAKE = load_learning_intake_module()


CANONICAL_WEEKS = (
    "Week1Python",
    "Week2OOP",
    "Week3JavaScriptandDOM",
    "Week4AdvAsynchronousJavaScript",
    "Week5MiniProjectAndTypeScript",
    "Week6DatabasesAndNodejs",
    "Week7NodejsAndReact",
    "Week8React",
    "Week9Redux",
    "Week10AdvancedTypeScriptAndAuthentication",
    "Week11FinalProject",
    "Week12FinalProject",
)

WEEK_ROOT_RE = re.compile(r"^Week(?P<number>\d+)", re.IGNORECASE)


def week_sort_key(value: str) -> tuple[int, str]:
    """Sort Week roots by their numeric prefix, then exact name."""

    match = WEEK_ROOT_RE.match(value)
    number = int(match.group("number")) if match else sys.maxsize
    return number, value.casefold()

REQUIRED_PATHS = (
    "AGENTS.md",
    "CONTRIBUTING.md",
    ".github/copilot-instructions.md",
    ".github/pull_request_template.md",
    ".ai/CONTEXT.md",
    ".ai/VISUAL_SYSTEM.md",
    ".ai/LEARNING_PROTOCOL.md",
    ".ai/HANDOFF_PROTOCOL.md",
    ".ai/DECISIONS.md",
    ".learning/course-map.yml",
    ".learning/display-map.json",
    ".learning/OCTOPUS_INTAKE.md",
    ".learning/PROGRESS.md",
    ".learning/REVIEW_QUEUE.md",
    ".learning/sessions/README.md",
    ".learning/evidence/README.md",
    ".learning/intake/README.md",
    ".learning/intake/queue.json",
    ".learning/intake/exercise-intake.schema.json",
    "reports/resume/BASELINE_2026-08-23.md",
    "reports/resume/STRUCTURE_MAP.md",
    "reports/resume/DUPLICATE_ANALYSIS.csv",
    "reports/resume/TEST_COVERAGE_MAP.md",
    "reports/resume/OPEN_WORK_TRIAGE.md",
    "reports/resume/DECISION_LOG.md",
    "reports/resume/CONSOLIDATION_RESULT.md",
    "reports/resume/ACADEMY_ALIGNMENT_2026-08-24.md",
    "reports/nova/exercise_catalog_metadata.csv",
    "assets/readme/visual_manifest.json",
    "tools/validate_display_titles.py",
    "tools/validate_readme_visuals.py",
    "tools/learning_intake.py",
)

CANONICAL_STRUCTURAL_PATHS = (
    "Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST",
    "Week5MiniProjectAndTypeScript/Day1MiniProject",
    "Week5MiniProjectAndTypeScript/Day1MiniProject/Exercises/Pokedex",
    "Week5MiniProjectAndTypeScript/Day1MiniProject/StarWarsWebApp",
    "Week5MiniProjectAndTypeScript/Day2IntroductionToTypeScriptAndKeyConcepts/DailyChallenge/UnionTypeValidator",
)

REMOVED_PATH_FRAGMENTS = (
    "Week4AdvAsynchronousJavaScript/Day3HTTPandFormmethodGETandPOST",
    "Week5MiniprojectAndTypeScript",
    "Week5MiniProjectAndTypeScript/Day1Miniproject",
    "Day1Miniproject",
    "DailyChallange",
    "TrueOrFalse/index1.html",
    "AnagramChecker/readme.md",
)

# These files preserve evidence from earlier runs. They are deliberately not
# treated as active navigation or configuration, but their recorded paths still
# remain useful repository archaeology.
HISTORICAL_TEXT_PATHS = {
    "FINAL_README_INSTALL_REPORT.md",
    "reports/nova/NOVA_UPDATE_REPORT.md",
    "reports/resume/BASELINE_2026-08-23.md",
    "reports/resume/CONSOLIDATION_RESULT.md",
    "reports/resume/DECISION_LOG.md",
    "reports/resume/DUPLICATE_ANALYSIS.csv",
    "reports/resume/STRUCTURE_MAP.md",
}

# These active tools necessarily contain the removed strings as detector or
# migration-input data. Only their self-describing constants are exempt; their
# generated outputs are still validated normally.
REMOVED_REFERENCE_SCAN_EXEMPT_PATHS = {
    "tools/refresh_structure_catalogs.py",
    "tools/validate_repository_structure.py",
}

TEXT_SUFFIXES = {
    ".cjs",
    ".css",
    ".csv",
    ".html",
    ".js",
    ".json",
    ".jsx",
    ".md",
    ".mjs",
    ".py",
    ".sql",
    ".svg",
    ".toml",
    ".ts",
    ".tsx",
    ".txt",
    ".yaml",
    ".yml",
}

CURRICULUM_SOURCE_SUFFIXES = {
    ".cjs",
    ".css",
    ".html",
    ".js",
    ".jsx",
    ".mjs",
    ".py",
    ".sql",
    ".ts",
    ".tsx",
}

MARKDOWN_LINK_RE = re.compile(r"!?\[[^\]]*\]\(([^)\n]+)\)")
MARKDOWN_REFERENCE_RE = re.compile(r"^\s*\[[^\]]+\]:\s*(\S+)", re.MULTILINE)
MARKDOWN_HTML_TARGET_RE = re.compile(
    r"<(?:a|audio|img|source|video)\b[^>]*?\b(?:href|src)\s*=\s*[\"']([^\"']+)[\"'][^>]*>",
    re.I,
)
MARKDOWN_INLINE_CODE_RE = re.compile(r"`[^`\n]*`")
LEARNING_PATH_RE = re.compile(r"^\s*(?:-\s*)?path:\s*(.+?)\s*$", re.MULTILINE)

HIGH_CONFIDENCE_SECRET_PATTERNS = (
    ("AWS access key", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("GitHub token", re.compile(r"\bgh[pousr]_[A-Za-z0-9]{30,}\b")),
    ("OpenAI-style secret key", re.compile(r"\bsk-[A-Za-z0-9_-]{20,}\b")),
    ("private key material", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")),
)

SECRET_ASSIGNMENT_RE = re.compile(
    r"(?imx)^\s*\{?\s*(?:(?:const|let|var)\s+)?(?:[A-Z_$][A-Z0-9_$]*\.)*"
    r"(?:giphy[_-]?key|(?:[A-Z][A-Z0-9_]*_)?"
    r"(?:API[_-]?KEY|API[_-]?TOKEN|ACCESS[_-]?TOKEN|AUTH[_-]?TOKEN|SECRET|PASSWORD|PASSWD))\b"
    r"\s*[:=]\s*[\"']([^\"'\r\n]{12,})[\"']"
)
PLACEHOLDER_MARKERS = (
    "your_",
    "your-",
    "replace_",
    "replace-",
    "replace me",
    "placeholder",
    "example_",
    "example-",
    "not_a_real",
    "not-a-real",
    "changeme",
)


class Validation:
    """Collect checks and print a compact, actionable report."""

    def __init__(self) -> None:
        self.failures = 0

    def check(self, name: str, problems: list[str], detail: str) -> None:
        if not problems:
            print(f"[PASS] {name}: {detail}")
            return
        self.failures += len(problems)
        print(f"[FAIL] {name}: {len(problems)} problem(s)")
        for problem in problems[:50]:
            print(f"       - {problem}")
        if len(problems) > 50:
            print(f"       - ... {len(problems) - 50} additional problem(s)")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", default=".", help="repository root (default: current directory)")
    return parser.parse_args()


def git_index_blobs(root: Path) -> dict[str, bytes]:
    result = subprocess.run(
        ["git", "-C", str(root), "ls-files", "--stage", "-z"],
        check=False,
        capture_output=True,
    )
    if result.returncode:
        message = result.stderr.decode("utf-8", errors="replace").strip()
        raise RuntimeError(f"git ls-files failed: {message}")
    entries: dict[str, str] = {}
    for record in result.stdout.split(b"\0"):
        if not record:
            continue
        metadata, raw_path = record.split(b"\t", 1)
        _mode, raw_oid, raw_stage = metadata.split()
        path = raw_path.decode("utf-8", errors="surrogateescape").replace("\\", "/")
        if raw_stage != b"0":
            raise RuntimeError(f"unmerged index entry prevents validation: {path}")
        entries[path] = raw_oid.decode("ascii")

    object_ids = list(dict.fromkeys(entries.values()))
    payload = "".join(f"{object_id}\n" for object_id in object_ids).encode("ascii")
    objects_result = subprocess.run(
        ["git", "-C", str(root), "cat-file", "--batch"],
        input=payload,
        check=False,
        capture_output=True,
    )
    if objects_result.returncode:
        message = objects_result.stderr.decode("utf-8", errors="replace").strip()
        raise RuntimeError(f"git cat-file --batch failed: {message}")
    stream = io.BytesIO(objects_result.stdout)
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
    return dict(sorted((path, objects[object_id]) for path, object_id in entries.items()))


def parent_directories(paths: set[str]) -> set[str]:
    directories: set[str] = set()
    for item in paths:
        parent = PurePosixPath(item).parent
        while str(parent) not in {"", "."}:
            directories.add(parent.as_posix())
            parent = parent.parent
    return directories


def casefold_collisions(paths: set[str], directories: set[str]) -> list[str]:
    problems: list[str] = []
    for label, values in (("file", paths), ("directory", directories)):
        groups: dict[str, list[str]] = defaultdict(list)
        for value in values:
            groups[value.casefold()].append(value)
        for variants in groups.values():
            if len(variants) > 1:
                problems.append(f"{label} collision: {', '.join(sorted(variants))}")
    return sorted(problems)


def read_text(blobs: dict[str, bytes], relative: str) -> str | None:
    try:
        return blobs[relative].decode("utf-8-sig")
    except (KeyError, UnicodeDecodeError):
        return None


def without_fenced_code(text: str) -> str:
    kept: list[str] = []
    fence: str | None = None
    for line in text.splitlines():
        stripped = line.lstrip()
        marker = "```" if stripped.startswith("```") else "~~~" if stripped.startswith("~~~") else None
        if marker:
            fence = None if fence == marker else marker if fence is None else fence
            kept.append("")
        elif fence is None:
            kept.append(line)
        else:
            kept.append("")
    return "\n".join(kept)


def markdown_target(raw: str) -> str | None:
    target = raw.strip()
    if target.startswith("<") and ">" in target:
        target = target[1 : target.index(">")]
    else:
        # Strip an optional Markdown title while preserving ordinary spaces in paths.
        target = re.sub(r"\s+[\"'](?:[^\"']*)[\"']\s*$", "", target).strip()
    if not target or target.startswith("#"):
        return None
    lowered = target.lower()
    if lowered.startswith(("http://", "https://", "mailto:", "tel:", "data:", "javascript:")):
        return None
    parsed = urlsplit(target)
    path = unquote(parsed.path).replace("\\", "/")
    return path or None


def validate_markdown_links(
    blobs: dict[str, bytes],
    tracked: set[str],
    directories: set[str],
) -> list[str]:
    problems: list[str] = []
    for source in sorted(path for path in tracked if path.lower().endswith((".md", ".mdx"))):
        if source in HISTORICAL_TEXT_PATHS:
            continue
        text = read_text(blobs, source)
        if text is None:
            continue
        visible_text = without_fenced_code(text)
        visible_text = MARKDOWN_INLINE_CODE_RE.sub("", visible_text)
        raw_targets = MARKDOWN_LINK_RE.findall(visible_text)
        raw_targets.extend(MARKDOWN_REFERENCE_RE.findall(visible_text))
        raw_targets.extend(MARKDOWN_HTML_TARGET_RE.findall(visible_text))
        for raw in raw_targets:
            target = markdown_target(raw)
            if target is None:
                continue
            if target.startswith("/"):
                candidate = posixpath.normpath(target.lstrip("/"))
            else:
                candidate = posixpath.normpath(posixpath.join(posixpath.dirname(source), target))
            if candidate in {"", "."}:
                continue
            if candidate.startswith("../"):
                problems.append(f"{source}: link escapes repository: {raw}")
            elif candidate not in tracked and candidate not in directories:
                problems.append(f"{source}: missing or incorrectly cased target: {raw} -> {candidate}")
    return sorted(set(problems))


def validate_removed_references(blobs: dict[str, bytes], tracked: set[str]) -> list[str]:
    problems: list[str] = []
    for relative in sorted(tracked):
        if relative in HISTORICAL_TEXT_PATHS or relative in REMOVED_REFERENCE_SCAN_EXEMPT_PATHS:
            continue
        suffix = PurePosixPath(relative).suffix.lower()
        if suffix not in TEXT_SUFFIXES and PurePosixPath(relative).name not in {".eslintignore", ".prettierignore"}:
            continue
        text = read_text(blobs, relative)
        if text is None:
            continue
        for line_number, line in enumerate(text.splitlines(), start=1):
            for fragment in REMOVED_PATH_FRAGMENTS:
                if fragment in line:
                    problems.append(f"{relative}:{line_number}: removed path reference: {fragment}")
    return problems


def split_catalog_paths(value: str) -> list[str]:
    return [part.strip().replace("\\", "/") for part in value.split(" | ") if part.strip()]


def validate_catalogs(
    blobs: dict[str, bytes],
    tracked: set[str],
    directories: set[str],
) -> list[str]:
    problems: list[str] = []
    inventory_paths: set[str] = set()
    exercise_roots: list[str] = []
    metadata_roots: list[str] = []
    catalogs = (
        (
            "reports/nova/exercise_catalog.csv",
            ("path", "source_files", "entry_points", "readme_path", "test_files"),
        ),
        ("reports/nova/exercise_catalog_metadata.csv", ("path", "entry_points")),
        ("reports/nova/file_inventory.csv", ("path",)),
    )
    for relative, path_columns in catalogs:
        if relative not in tracked:
            problems.append(f"required generated catalog is not tracked: {relative}")
            continue
        text = read_text(blobs, relative)
        if text is None:
            problems.append(f"{relative}: cannot decode indexed catalog as UTF-8")
            continue
        try:
            reader = csv.DictReader(io.StringIO(text, newline=""))
            missing_columns = [column for column in path_columns if column not in (reader.fieldnames or [])]
            if missing_columns:
                problems.append(f"{relative}: missing path column(s): {', '.join(missing_columns)}")
                continue
            for row_number, row in enumerate(reader, start=2):
                if relative == "reports/nova/file_inventory.csv" and row.get("path"):
                    inventory_paths.add(row["path"].replace("\\", "/"))
                if relative == "reports/nova/exercise_catalog.csv":
                    root = row.get("path", "").replace("\\", "/")
                    if root:
                        exercise_roots.append(root)
                    if not split_catalog_paths(row.get("source_files", "")):
                        problems.append(f"{relative}:{row_number}: exercise row has no indexed source_files")
                elif relative == "reports/nova/exercise_catalog_metadata.csv":
                    root = row.get("path", "").replace("\\", "/")
                    if root:
                        metadata_roots.append(root)
                    if not split_catalog_paths(row.get("entry_points", "")):
                        problems.append(f"{relative}:{row_number}: metadata row has no review entry point")
                    parts = PurePosixPath(root).parts
                    if "DailyChallenge" in parts and row.get("kind") != "Daily Challenge":
                        problems.append(
                            f"{relative}:{row_number}: DailyChallenge path must use kind 'Daily Challenge': {root}"
                        )
                    if "Exercises" in parts:
                        marker_index = parts.index("Exercises")
                        if (
                            len(parts) > marker_index + 1
                            and parts[marker_index + 1].startswith("ExercisesXP")
                            and row.get("kind") != "Exercise"
                        ):
                            problems.append(
                                f"{relative}:{row_number}: ExercisesXP path must use kind 'Exercise': {root}"
                            )
                for column in path_columns:
                    for item in split_catalog_paths(row.get(column, "")):
                        if item not in tracked and item not in directories:
                            problems.append(
                                f"{relative}:{row_number} [{column}]: missing or incorrectly cased path: {item}"
                            )
                        for fragment in REMOVED_PATH_FRAGMENTS:
                            if fragment in item:
                                problems.append(
                                    f"{relative}:{row_number} [{column}]: removed path remains: {item}"
                                )
        except csv.Error as exc:
            problems.append(f"{relative}: cannot parse indexed catalog: {exc}")

    root_counts: dict[str, int] = defaultdict(int)
    for root in exercise_roots:
        root_counts[root] += 1
    for root, count in sorted(root_counts.items()):
        if count > 1:
            problems.append(f"reports/nova/exercise_catalog.csv: duplicate exercise root ({count} rows): {root}")

    metadata_root_counts: dict[str, int] = defaultdict(int)
    for root in metadata_roots:
        metadata_root_counts[root] += 1
    for root, count in sorted(metadata_root_counts.items()):
        if count > 1:
            problems.append(
                f"reports/nova/exercise_catalog_metadata.csv: duplicate exercise root ({count} rows): {root}"
            )
    for root in sorted(set(metadata_roots) - set(exercise_roots)):
        problems.append(f"reports/nova/exercise_catalog.csv: missing versioned metadata root: {root}")
    for root in sorted(set(exercise_roots) - set(metadata_roots)):
        problems.append(f"reports/nova/exercise_catalog_metadata.csv: missing generated catalog root: {root}")

    curriculum_sources = [
        path
        for path in sorted(tracked)
        if path.startswith("Week") and PurePosixPath(path).suffix.lower() in CURRICULUM_SOURCE_SUFFIXES
    ]
    for source in curriculum_sources:
        owners = [root for root in exercise_roots if source.startswith(f"{root}/")]
        if not owners:
            problems.append(f"reports/nova/exercise_catalog.csv: uncatalogued curriculum source: {source}")
        elif len(owners) > 1:
            problems.append(
                f"reports/nova/exercise_catalog.csv: source belongs to {len(owners)} rows: {source} -> {owners}"
            )

    expected_inventory = tracked - {"reports/nova/file_inventory.csv"}
    for item in sorted(expected_inventory - inventory_paths):
        problems.append(f"reports/nova/file_inventory.csv: missing indexed path: {item}")
    for item in sorted(inventory_paths - expected_inventory):
        problems.append(f"reports/nova/file_inventory.csv: unindexed path remains: {item}")
    return problems


def validate_learning_map(blobs: dict[str, bytes], tracked: set[str], directories: set[str]) -> list[str]:
    relative = ".learning/course-map.yml"
    text = read_text(blobs, relative)
    if text is None:
        return [f"cannot read {relative}"]
    problems: list[str] = []
    for raw in LEARNING_PATH_RE.findall(text):
        candidate = raw.strip().strip("\"'").replace("\\", "/")
        if candidate not in tracked and candidate not in directories:
            problems.append(f"{relative}: missing or incorrectly cased path: {candidate}")
    return problems


def validate_learning_intake_queue(
    blobs: dict[str, bytes], tracked: set[str], directories: set[str]
) -> list[str]:
    relative = ".learning/intake/queue.json"
    text = read_text(blobs, relative)
    if text is None:
        return [f"cannot read {relative}"]
    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        return [f"{relative}: invalid JSON: {exc}"]
    known_paths = tracked | directories
    return [
        f"{relative}: {problem}"
        for problem in LEARNING_INTAKE.validate_queue_data(
            data, known_paths=known_paths
        )
    ]


def validate_secrets(blobs: dict[str, bytes], tracked: set[str]) -> tuple[list[str], list[str]]:
    env_problems: list[str] = []
    secret_problems: list[str] = []
    allowed_env_names = {".env.example", ".env.sample", ".env.template"}
    for relative in sorted(tracked):
        name = PurePosixPath(relative).name.lower()
        if name == ".env" or (name.startswith(".env.") and name not in allowed_env_names):
            env_problems.append(f"tracked environment file: {relative}")
        suffix = PurePosixPath(relative).suffix.lower()
        if suffix not in TEXT_SUFFIXES and name not in {".env.example", ".env.sample", ".env.template"}:
            continue
        text = read_text(blobs, relative)
        if text is None:
            continue
        for label, pattern in HIGH_CONFIDENCE_SECRET_PATTERNS:
            match = pattern.search(text)
            if match:
                line_number = text.count("\n", 0, match.start()) + 1
                secret_problems.append(f"{relative}:{line_number}: possible {label}")
        for match in SECRET_ASSIGNMENT_RE.finditer(text):
            if is_placeholder_secret(match.group(1)):
                continue
            line_number = text.count("\n", 0, match.start()) + 1
            secret_problems.append(f"{relative}:{line_number}: possible hard-coded secret assignment")
    return env_problems, secret_problems


def is_placeholder_secret(value: str) -> bool:
    normalized = value.strip().casefold()
    return any(marker in normalized for marker in PLACEHOLDER_MARKERS)


def main() -> int:
    args = parse_args()
    root = Path(args.repo).expanduser().resolve()
    if not (root / ".git").exists():
        print(f"[FATAL] Not a Git repository root: {root}", file=sys.stderr)
        return 2

    try:
        blobs = git_index_blobs(root)
    except RuntimeError as exc:
        print(f"[FATAL] {exc}", file=sys.stderr)
        return 2

    path_list = sorted(blobs)
    tracked = set(path_list)
    directories = parent_directories(tracked)
    validation = Validation()

    validation.check(
        "case-insensitive uniqueness",
        casefold_collisions(tracked, directories),
        f"{len(tracked)} indexed files and {len(directories)} indexed directories are unique under case-folding",
    )

    missing_required = [path for path in REQUIRED_PATHS if path not in tracked]
    validation.check(
        "agent and learning source of truth",
        [f"missing tracked file: {path}" for path in missing_required],
        f"all {len(REQUIRED_PATHS)} required foundation files are indexed",
    )

    missing_canonical = [path for path in CANONICAL_STRUCTURAL_PATHS if path not in directories]
    legacy_indexed = [path for path in path_list if any(fragment in path for fragment in REMOVED_PATH_FRAGMENTS)]
    validation.check(
        "canonical Week 4 and Week 5 structure",
        [f"missing canonical directory: {path}" for path in missing_canonical]
        + [f"legacy indexed path remains: {path}" for path in legacy_indexed],
        "canonical merged directories exist and legacy variants are absent from the index",
    )

    top_level_weeks = sorted(
        (
            directory
            for directory in directories
            if "/" not in directory and directory.casefold().startswith("week")
        ),
        key=week_sort_key,
    )
    week_problems = []
    if top_level_weeks != list(CANONICAL_WEEKS):
        week_problems.append(
            f"top-level Week roots differ: expected {list(CANONICAL_WEEKS)}, found {top_level_weeks}"
        )
    for week in CANONICAL_WEEKS:
        readme = f"{week}/README.md"
        if readme not in tracked:
            week_problems.append(f"missing canonical Week README: {readme}")
    validation.check(
        "canonical Week roots and READMEs",
        week_problems,
        f"{len(CANONICAL_WEEKS)} canonical Week roots and their exact-case README.md files are indexed",
    )

    root_archives = [
        path
        for path in path_list
        if "/" not in path and path.casefold().startswith("week") and path.casefold().endswith(".zip")
    ]
    validation.check(
        "root source archives",
        [f"tracked root archive: {path}" for path in root_archives],
        "no tracked top-level Week*.zip archive exists",
    )

    validation.check(
        "local Markdown links",
        validate_markdown_links(blobs, tracked, directories),
        "all active local Markdown targets exist with exact Git-index casing",
    )
    validation.check(
        "removed path references",
        validate_removed_references(blobs, tracked),
        "active tracked text does not reference removed structural variants",
    )
    validation.check(
        "generated catalog paths",
        validate_catalogs(blobs, tracked, directories),
        "catalog paths resolve exactly and every indexed curriculum source has one owner",
    )
    validation.check(
        "learning map paths",
        validate_learning_map(blobs, tracked, directories),
        "every course-map path resolves exactly to an indexed file or directory",
    )
    validation.check(
        "public-safe exercise intake",
        validate_learning_intake_queue(blobs, tracked, directories),
        "the tracked exercise queue follows the own-words privacy and evidence contract",
    )
    validation.check(
        "private intake exclusion",
        [f"private intake path is indexed: {path}" for path in path_list if path.startswith(".private/")],
        "zero .private/ files are indexed",
    )
    env_problems, secret_problems = validate_secrets(blobs, tracked)
    validation.check(
        "tracked environment files",
        env_problems,
        "no real .env variant is indexed; explicit examples remain allowed",
    )
    validation.check(
        "high-confidence secret scan",
        secret_problems,
        "no obvious credential signature was found in tracked text",
    )

    if validation.failures:
        print(f"\nSTRUCTURE VALIDATION FAILED: {validation.failures} actionable problem(s).")
        return 1
    print("\nSTRUCTURE VALIDATION PASSED: canonical paths and safeguards are internally consistent.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
