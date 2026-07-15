#!/usr/bin/env python3
"""NOVA Fullstack Repository Studio.

A dependency-free, safety-first repository auditor and organizer designed for
learning portfolios such as Fullstack2026.

Default behavior is READ-ONLY with respect to existing source files. It scans
all Git-tracked files (or all visible files when Git is unavailable), creates a
complete inventory, validates common file formats, detects structural risks,
and writes colorful offline reports.

Destructive or source-changing operations require explicit flags and --yes.
"""
from __future__ import annotations

import argparse
import ast
import csv
import datetime as dt
import hashlib
import html
import json
import os
import re
import shutil
import subprocess
import sys
import textwrap
import time
import urllib.parse
import webbrowser
from collections import Counter, defaultdict
from dataclasses import asdict, dataclass, field
from pathlib import Path, PurePosixPath
from typing import Any, Iterable, Iterator, Sequence

VERSION = "1.1.1"
TOOL_NAME = "NOVA Fullstack Repository Studio"

SOURCE_EXTENSIONS = {
    ".py", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".html", ".htm",
    ".css", ".scss", ".sql", ".sh", ".ps1", ".bat", ".cmd",
}
DOCUMENT_EXTENSIONS = {".md", ".mdx", ".rst", ".txt"}
DATA_EXTENSIONS = {".json", ".jsonl", ".csv", ".tsv", ".xml", ".yaml", ".yml"}
MEDIA_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".bmp", ".wav",
    ".mp3", ".ogg", ".mp4", ".mov", ".avi", ".pdf", ".woff", ".woff2",
    ".ttf", ".otf", ".eot",
}
ARCHIVE_EXTENSIONS = {".zip", ".tar", ".gz", ".tgz", ".7z", ".rar", ".bz2", ".xz"}
BINARY_EXTENSIONS = MEDIA_EXTENSIONS | ARCHIVE_EXTENSIONS | {".pyc", ".class", ".exe", ".dll", ".so", ".dylib"}

LANGUAGE_BY_EXTENSION = {
    ".py": "Python",
    ".js": "JavaScript",
    ".mjs": "JavaScript",
    ".cjs": "JavaScript",
    ".jsx": "JavaScript",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".html": "HTML",
    ".htm": "HTML",
    ".css": "CSS",
    ".scss": "SCSS",
    ".sql": "SQL",
    ".md": "Markdown",
    ".mdx": "Markdown",
    ".json": "JSON",
    ".yaml": "YAML",
    ".yml": "YAML",
    ".sh": "Shell",
    ".ps1": "PowerShell",
    ".bat": "Batch",
    ".cmd": "Batch",
    ".csv": "CSV",
    ".txt": "Text",
    ".svg": "SVG",
}

SKIP_DIR_NAMES = {
    ".git", ".hg", ".svn", "node_modules", "__pycache__", ".pytest_cache",
    ".mypy_cache", ".ruff_cache", ".tox", ".nox", ".venv", "venv", "env",
    ".idea", ".vscode", "dist", "build", "coverage", ".coverage", ".turbo",
    ".next", ".parcel-cache", ".nova",
}

README_NAMES = {"readme.md", "readme.mdx", "readme.rst", "readme.txt"}
TEST_NAME_PATTERNS = (
    re.compile(r"(^|/)tests?(/|$)", re.I),
    re.compile(r"(^|/)test_[^/]+\.py$", re.I),
    re.compile(r"(^|/)[^/]+_test\.py$", re.I),
    re.compile(r"(^|/)[^/]+\.(test|spec)\.(js|jsx|ts|tsx|mjs|cjs)$", re.I),
)

SEVERITY_ORDER = {"critical": 0, "high": 1, "medium": 2, "low": 3, "info": 4}
SEVERITY_POINTS = {"critical": 20, "high": 10, "medium": 4, "low": 1, "info": 0}

CATEGORY_WEIGHTS = {
    "learning_breadth": 20,
    "documentation": 15,
    "structure": 15,
    "code_health": 15,
    "testing": 15,
    "tooling": 10,
    "automation": 5,
    "portfolio": 5,
}

KNOWN_COMPONENT_FIXES = {
    "DailyChallange": "DailyChallenge",
    "DailyChalenge": "DailyChallenge",
    "ExercicesXPGold": "ExercisesXPGold",
    "ExercicesXP": "ExercisesXP",
    "OOPQuizz": "OOPQuiz",
    "Miniproject": "MiniProject",
    "Nodejs": "NodeJS",
}

KNOWN_PATH_PROPOSALS = [
    {
        "old_path": "Week5MiniprojectAndTypeScript",
        "new_path": "Week5MiniProjectAndTypeScript",
        "action": "manual_merge",
        "risk": "high",
        "reason": "Two top-level Week5 directories differ only by capitalization and content placement.",
        "notes": "Merge child-by-child on a dedicated branch; do not overwrite the existing destination.",
    },
    {
        "old_path": "Week4AdvAsynchronousJavaScript/Day3HTTPandFormmethodGETandPOST",
        "new_path": "Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST",
        "action": "manual_merge",
        "risk": "high",
        "reason": "Two Day3 HTTP/Form directories use inconsistent capitalization.",
        "notes": "Compare files and merge before removing the old path.",
    },
    {
        "old_path": "Week3JavaScriptandDOM/Remote LearningJSAndDOM",
        "new_path": "Week3JavaScriptandDOM/RemoteLearningJSAndDOM",
        "action": "move",
        "risk": "medium",
        "reason": "Spaces make shell commands and links less predictable.",
        "notes": "Update Markdown and HTML links after moving.",
    },
    {
        "old_path": "Week4AdvAsynchronousJavaScript/Day5Fetch&AsyncAwait",
        "new_path": "Week4AdvAsynchronousJavaScript/Day5FetchAndAsyncAwait",
        "action": "move",
        "risk": "medium",
        "reason": "Ampersands require escaping in several shells.",
        "notes": "Use git mv and update references.",
    },
    {
        "old_path": "Week6DatabasesAndNodejs/Day3DatabaseConcepts2/Exercises/ExercicesXPGold",
        "new_path": "Week6DatabasesAndNodejs/Day3DatabaseConcepts2/Exercises/ExercisesXPGold",
        "action": "move",
        "risk": "low",
        "reason": "Correct the misspelling 'Exercices'.",
        "notes": "Safe after checking README links.",
    },
    {
        "old_path": "Week1Python.zip",
        "new_path": "archive/source-zips/Week1Python.zip",
        "action": "archive",
        "risk": "low",
        "reason": "Root source archives duplicate material already tracked as files.",
        "notes": "Prefer keeping the ZIP outside Git history after confirming it is unnecessary.",
    },
    {
        "old_path": "Week1Python (2).zip",
        "new_path": "archive/source-zips/Week1Python-legacy-2.zip",
        "action": "archive",
        "risk": "low",
        "reason": "Duplicate-looking source archive at repository root.",
        "notes": "Compare archive contents before deletion; archive locally first.",
    },
]

SECRET_PATTERNS = [
    ("private_key", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")),
    ("github_token", re.compile(r"\bgh[pousr]_[A-Za-z0-9_]{30,}\b")),
    ("aws_access_key", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("generic_secret_assignment", re.compile(
        r"(?i)\b(api[_-]?key|secret|token|password|passwd)\b\s*[:=]\s*['\"]([^'\"\s]{12,})['\"]"
    )),
]

MARKDOWN_LINK_RE = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
HTML_LINK_RE = re.compile(r"\b(?:src|href)\s*=\s*['\"]([^'\"]+)['\"]", re.I)
BACKTICK_PATH_RE = re.compile(r"`([^`\n]+\.[A-Za-z0-9]{1,8})`")
HEADING_RE = re.compile(r"^\s*#\s+(.+?)\s*$", re.M)
GOAL_RE = re.compile(r"(?im)^\s*(?:[-*]\s*)?(?:goal|objective|purpose|learning goal)s?\s*[:—-]\s*(.+)$")
TODO_RE = re.compile(r"\b(TODO|FIXME|HACK|XXX)\b", re.I)
CITATION_MARKER_RE = re.compile(r"(?:〖F:|cite|filecite)")


@dataclass
class FileRecord:
    path: str
    size_bytes: int
    lines: int
    extension: str
    language: str
    category: str
    binary: bool
    sha256: str
    encoding: str | None
    tracked: bool
    week: str | None
    day: str | None
    exercise_root: str | None
    exercise_kind: str | None
    tier: str | None
    is_test: bool
    is_readme: bool
    todo_count: int = 0
    trailing_whitespace_lines: int = 0
    mixed_line_endings: bool = False
    syntax_ok: bool | None = None
    syntax_error: str | None = None


@dataclass
class Finding:
    severity: str
    code: str
    title: str
    detail: str
    path: str | None = None
    recommendation: str | None = None
    auto_fixable: bool = False
    evidence: dict[str, Any] = field(default_factory=dict)


@dataclass
class ExerciseRecord:
    path: str
    title: str
    suggested_slug: str
    goal: str
    week: str
    day: str | None
    kind: str
    tier: str | None
    technologies: list[str]
    file_count: int
    size_bytes: int
    lines: int
    source_files: list[str]
    entry_points: list[str]
    has_readme: bool
    readme_path: str | None
    test_files: list[str]
    syntax_errors: list[str]
    completion_score: int
    quality_score: int


@dataclass
class RenameProposal:
    approved: str
    action: str
    old_path: str
    new_path: str
    risk: str
    reason: str
    destination_exists: bool
    notes: str


@dataclass
class ToolRun:
    name: str
    command: list[str]
    status: str
    returncode: int | None
    duration_seconds: float
    stdout: str
    stderr: str


class Console:
    RESET = "\033[0m"
    CODES = {
        "blue": "\033[94m",
        "cyan": "\033[96m",
        "green": "\033[92m",
        "yellow": "\033[93m",
        "red": "\033[91m",
        "magenta": "\033[95m",
        "bold": "\033[1m",
        "dim": "\033[2m",
    }

    def __init__(self, color: bool = True, animation: bool = True) -> None:
        self.color = color and self._supports_color()
        self.animation = animation and sys.stdout.isatty()
        if os.name == "nt" and self.color:
            os.system("")

    @staticmethod
    def _supports_color() -> bool:
        if os.environ.get("NO_COLOR"):
            return False
        if os.environ.get("TERM") == "dumb":
            return False
        return sys.stdout.isatty() or os.name == "nt"

    def style(self, text: str, *styles: str) -> str:
        if not self.color:
            return text
        prefix = "".join(self.CODES.get(s, "") for s in styles)
        return f"{prefix}{text}{self.RESET}"

    def banner(self) -> None:
        frames = ["✦", "✧", "✦"] if self.animation else ["✦"]
        for frame in frames:
            line = f"{frame} {TOOL_NAME} v{VERSION} {frame}"
            if self.animation:
                print("\r" + self.style(line, "bold", "magenta"), end="", flush=True)
                time.sleep(0.08)
            else:
                print(self.style(line, "bold", "magenta"))
        if self.animation:
            print()
        print(self.style("Safety mode: audit-first, existing source files remain unchanged.", "cyan"))

    def heading(self, text: str) -> None:
        print("\n" + self.style(f"━━ {text} ━━", "bold", "blue"))

    def info(self, text: str) -> None:
        print(self.style("ℹ ", "cyan") + text)

    def ok(self, text: str) -> None:
        print(self.style("✓ ", "green") + text)

    def warn(self, text: str) -> None:
        print(self.style("⚠ ", "yellow") + text)

    def error(self, text: str) -> None:
        print(self.style("✗ ", "red") + text)

    def progress(self, current: int, total: int, label: str) -> None:
        if total <= 0:
            return
        width = 26
        ratio = min(1.0, current / total)
        done = int(width * ratio)
        bar = "█" * done + "░" * (width - done)
        text = f"[{bar}] {current:>4}/{total:<4} {label[:52]}"
        if sys.stdout.isatty():
            print("\r" + self.style(text, "magenta"), end="", flush=True)
            if current == total:
                print()
        elif current == total or current == 1 or current % 50 == 0:
            print(text)


def utc_now() -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc)


def iso_now() -> str:
    return utc_now().replace(microsecond=0).isoformat()


def human_size(value: int | float) -> str:
    units = ["B", "KB", "MB", "GB", "TB"]
    n = float(value)
    for unit in units:
        if abs(n) < 1024.0 or unit == units[-1]:
            return f"{n:.1f} {unit}" if unit != "B" else f"{int(n)} B"
        n /= 1024.0
    return f"{n:.1f} TB"


def clamp(value: float, minimum: float = 0.0, maximum: float = 100.0) -> float:
    return max(minimum, min(maximum, value))


def posix(path: Path | str) -> str:
    return Path(path).as_posix()


def split_words(value: str) -> list[str]:
    value = re.sub(r"([a-z0-9])([A-Z])", r"\1 \2", value)
    value = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1 \2", value)
    value = value.replace("_", " ").replace("-", " ").replace("&", " And ")
    value = re.sub(r"\s+", " ", value).strip()
    return [w for w in value.split(" ") if w]


def human_title(value: str) -> str:
    stem = Path(value).stem if "." in Path(value).name else value
    words = split_words(stem)
    result: list[str] = []
    acronyms = {"oop": "OOP", "api": "API", "http": "HTTP", "dom": "DOM", "sql": "SQL", "js": "JS", "ts": "TS", "npm": "npm", "xp": "XP"}
    for word in words:
        low = word.lower()
        result.append(acronyms.get(low, word[:1].upper() + word[1:]))
    return " ".join(result) or value


def slugify(value: str) -> str:
    words = split_words(value)
    slug = "-".join(re.sub(r"[^A-Za-z0-9]+", "", w).lower() for w in words)
    return re.sub(r"-+", "-", slug).strip("-") or "exercise"


def normalized_component(value: str) -> str:
    return re.sub(r"[^a-z0-9]", "", value.lower())


def is_probably_binary(data: bytes, extension: str) -> bool:
    if extension.lower() in BINARY_EXTENSIONS:
        return True
    sample = data[:8192]
    if b"\x00" in sample:
        return True
    if not sample:
        return False
    control = sum(1 for b in sample if b < 9 or (13 < b < 32))
    return control / max(1, len(sample)) > 0.18


def decode_text(data: bytes) -> tuple[str | None, str | None]:
    for encoding in ("utf-8-sig", "utf-8", "cp1252", "latin-1"):
        try:
            return data.decode(encoding), encoding
        except UnicodeDecodeError:
            continue
    return None, None


def run_command(command: Sequence[str], cwd: Path, timeout: int = 120) -> tuple[int | None, str, str, float]:
    started = time.perf_counter()
    try:
        completed = subprocess.run(
            list(command), cwd=cwd, text=True, capture_output=True,
            timeout=timeout, check=False, errors="replace",
        )
        duration = time.perf_counter() - started
        return completed.returncode, completed.stdout, completed.stderr, duration
    except (OSError, subprocess.TimeoutExpired) as exc:
        duration = time.perf_counter() - started
        return None, "", str(exc), duration


def safe_join(root: Path, relative: str) -> Path:
    candidate = (root / relative).resolve()
    root_resolved = root.resolve()
    if candidate != root_resolved and root_resolved not in candidate.parents:
        raise ValueError(f"Unsafe path outside repository: {relative}")
    return candidate


def first_nonempty_line(text: str) -> str | None:
    for line in text.splitlines():
        clean = line.strip()
        if clean:
            return clean
    return None


def truthy(value: str | None) -> bool:
    return str(value or "").strip().lower() in {"1", "true", "yes", "y", "approved", "x"}


class RepoAnalyzer:
    def __init__(
        self,
        root: Path,
        output_dir: Path,
        console: Console,
        include_untracked: bool = False,
        max_read_mb: int = 10,
    ) -> None:
        self.root = root.resolve()
        self.output_dir = output_dir.resolve()
        self.console = console
        self.include_untracked = include_untracked
        self.max_read_bytes = max_read_mb * 1024 * 1024
        self.files: list[FileRecord] = []
        self.texts: dict[str, str] = {}
        self.findings: list[Finding] = []
        self.exercises: list[ExerciseRecord] = []
        self.renames: list[RenameProposal] = []
        self.tool_runs: list[ToolRun] = []
        self.git_available = False
        self.git_head: str | None = None
        self.git_branch: str | None = None
        self.git_commit_count: int | None = None
        self.git_last_commit_date: str | None = None
        self.git_last_commit_message: str | None = None
        self.dirty_paths: list[str] = []
        self.scanned_tracked_only = False
        self.generated_at = iso_now()

    def analyze(self, run_tools: bool = False) -> dict[str, Any]:
        self.console.heading("Repository discovery")
        self._load_git_metadata()
        paths, tracked_lookup = self._discover_paths()
        self.console.info(f"Discovered {len(paths)} files for analysis.")

        self.console.heading("File-by-file audit")
        self._analyze_files(paths, tracked_lookup)

        self.console.heading("Structure, documentation and quality checks")
        self._build_exercises()
        self._detect_cross_file_findings()
        self._build_rename_plan()
        if run_tools:
            self._run_optional_tools()

        score = self._calculate_score()
        stats = self._calculate_stats(score)
        actions = self._build_next_actions(score)
        strengths = self._build_strengths(stats)
        risks = self._build_risks()

        return {
            "tool": {"name": TOOL_NAME, "version": VERSION},
            "generated_at": self.generated_at,
            "repository": {
                "root": str(self.root),
                "name": self.root.name,
                "git_available": self.git_available,
                "branch": self.git_branch,
                "head": self.git_head,
                "commit_count": self.git_commit_count,
                "last_commit_date": self.git_last_commit_date,
                "last_commit_message": self.git_last_commit_message,
                "dirty_paths": self.dirty_paths,
                "scan_scope": "git-tracked files" if self.scanned_tracked_only else "visible files",
            },
            "statistics": stats,
            "score": score,
            "strengths": strengths,
            "risks": risks,
            "findings": [asdict(item) for item in self._sorted_findings()],
            "files": [asdict(item) for item in self.files],
            "exercises": [asdict(item) for item in self.exercises],
            "rename_plan": [asdict(item) for item in self.renames],
            "next_actions": actions,
            "tool_runs": [asdict(item) for item in self.tool_runs],
        }

    def _load_git_metadata(self) -> None:
        code, out, _, _ = run_command(["git", "rev-parse", "--is-inside-work-tree"], self.root, 10)
        self.git_available = code == 0 and out.strip() == "true"
        if not self.git_available:
            self.console.warn("Git metadata unavailable; scanning visible files instead.")
            return

        def git_value(args: list[str]) -> str | None:
            code_i, out_i, _, _ = run_command(["git", *args], self.root, 15)
            value = out_i.strip()
            return value if code_i == 0 and value else None

        self.git_head = git_value(["rev-parse", "HEAD"])
        self.git_branch = git_value(["branch", "--show-current"]) or "detached"
        count = git_value(["rev-list", "--count", "HEAD"])
        self.git_commit_count = int(count) if count and count.isdigit() else None
        self.git_last_commit_date = git_value(["log", "-1", "--format=%cI"])
        self.git_last_commit_message = git_value(["log", "-1", "--format=%s"])
        status = git_value(["status", "--porcelain=v1"])
        if status:
            self.dirty_paths = [line[3:] if len(line) > 3 else line for line in status.splitlines()]
        self.console.ok(
            f"Git branch {self.git_branch!r}, HEAD {(self.git_head or 'unknown')[:12]}, "
            f"{self.git_commit_count if self.git_commit_count is not None else '?'} commits."
        )

    def _discover_paths(self) -> tuple[list[Path], set[str]]:
        tracked_lookup: set[str] = set()
        paths: list[Path] = []
        if self.git_available:
            code, out, err, _ = run_command(["git", "ls-files", "-z"], self.root, 30)
            if code == 0:
                tracked = [p for p in out.split("\0") if p]
                tracked_lookup = {PurePosixPath(p).as_posix() for p in tracked}
                paths = [self.root / p for p in tracked if (self.root / p).is_file()]
                self.scanned_tracked_only = not self.include_untracked
            elif err:
                self.console.warn(f"git ls-files failed: {err.strip()}")

        if not paths or self.include_untracked:
            seen = {p.resolve() for p in paths}
            for candidate in self.root.rglob("*"):
                if not candidate.is_file() or candidate.is_symlink():
                    continue
                rel_parts = candidate.relative_to(self.root).parts
                if any(part in SKIP_DIR_NAMES for part in rel_parts[:-1]):
                    continue
                try:
                    candidate.resolve().relative_to(self.output_dir)
                    continue
                except ValueError:
                    pass
                if candidate.resolve() not in seen:
                    paths.append(candidate)
                    seen.add(candidate.resolve())
            self.scanned_tracked_only = False

        def should_skip(path: Path) -> bool:
            rel = path.relative_to(self.root)
            if any(part in SKIP_DIR_NAMES for part in rel.parts[:-1]):
                return True
            try:
                path.resolve().relative_to(self.output_dir)
                return True
            except ValueError:
                return False

        unique = sorted({p.resolve() for p in paths if p.exists() and not should_skip(p)}, key=lambda p: p.relative_to(self.root).as_posix().lower())
        return unique, tracked_lookup

    def _analyze_files(self, paths: list[Path], tracked_lookup: set[str]) -> None:
        for index, path in enumerate(paths, 1):
            rel = path.relative_to(self.root).as_posix()
            self.console.progress(index, len(paths), rel)
            try:
                size = path.stat().st_size
                data = path.read_bytes()
            except OSError as exc:
                self.findings.append(Finding(
                    "high", "file_read_error", "File could not be read", str(exc), rel,
                    "Check permissions, locks, and filesystem health.", False,
                ))
                continue

            ext = path.suffix.lower()
            binary = is_probably_binary(data, ext)
            digest = hashlib.sha256(data).hexdigest()
            text: str | None = None
            encoding: str | None = None
            lines = 0
            todo_count = 0
            trailing = 0
            mixed = False
            syntax_ok: bool | None = None
            syntax_error: str | None = None

            if not binary and size <= self.max_read_bytes:
                text, encoding = decode_text(data)
                if text is None:
                    binary = True
                else:
                    self.texts[rel] = text
                    lines = len(text.splitlines()) if text else 0
                    todo_count = len(TODO_RE.findall(text))
                    trailing = sum(1 for line in text.splitlines() if line.rstrip(" \t") != line)
                    mixed = "\r\n" in text and re.search(r"(?<!\r)\n", text) is not None
                    if ext == ".py":
                        try:
                            ast.parse(text, filename=rel)
                            syntax_ok = True
                        except SyntaxError as exc:
                            syntax_ok = False
                            syntax_error = f"line {exc.lineno}: {exc.msg}"
                            self.findings.append(Finding(
                                "critical", "python_syntax_error", "Python syntax error",
                                syntax_error, rel,
                                "Fix the syntax error before running tests or CI.", True,
                                {"line": exc.lineno, "offset": exc.offset},
                            ))
                    elif ext == ".json":
                        try:
                            json.loads(text)
                            syntax_ok = True
                        except json.JSONDecodeError as exc:
                            syntax_ok = False
                            syntax_error = f"line {exc.lineno}, column {exc.colno}: {exc.msg}"
                            self.findings.append(Finding(
                                "high", "invalid_json", "Invalid JSON", syntax_error, rel,
                                "Repair JSON syntax and validate again.", True,
                            ))
                    self._scan_text_file(rel, text, ext, trailing, mixed)
            elif not binary and size > self.max_read_bytes:
                self.findings.append(Finding(
                    "medium", "text_file_too_large", "Text file skipped due to size",
                    f"File is {human_size(size)}; maximum configured read size is {human_size(self.max_read_bytes)}.",
                    rel, "Increase --max-read-mb only if this file is trusted and needs full inspection.", False,
                ))

            week, day = self._week_and_day(rel)
            kind, tier = self._kind_and_tier(rel)
            exercise_root = self._exercise_root(rel)
            is_test = any(pattern.search(rel) for pattern in TEST_NAME_PATTERNS)
            is_readme = path.name.lower() in README_NAMES
            category = self._file_category(ext, path.name, is_test, is_readme)
            language = LANGUAGE_BY_EXTENSION.get(ext, "Other")

            self.files.append(FileRecord(
                path=rel,
                size_bytes=size,
                lines=lines,
                extension=ext or "[no extension]",
                language=language,
                category=category,
                binary=binary,
                sha256=digest,
                encoding=encoding,
                tracked=rel in tracked_lookup if tracked_lookup else False,
                week=week,
                day=day,
                exercise_root=exercise_root,
                exercise_kind=kind,
                tier=tier,
                is_test=is_test,
                is_readme=is_readme,
                todo_count=todo_count,
                trailing_whitespace_lines=trailing,
                mixed_line_endings=mixed,
                syntax_ok=syntax_ok,
                syntax_error=syntax_error,
            ))

            if size == 0:
                self.findings.append(Finding(
                    "low", "empty_file", "Empty tracked file", "The file contains zero bytes.", rel,
                    "Remove it, add intentional placeholder documentation, or explain why it exists.", False,
                ))
            if size > 1_000_000:
                severity = "high" if ext in ARCHIVE_EXTENSIONS else "medium"
                self.findings.append(Finding(
                    severity, "large_file", "Large file in repository",
                    f"Size: {human_size(size)}.", rel,
                    "Confirm the file belongs in Git; prefer release assets, external storage, or Git LFS for large binaries.", False,
                ))

    def _scan_text_file(self, rel: str, text: str, ext: str, trailing: int, mixed: bool) -> None:
        if trailing:
            self.findings.append(Finding(
                "low", "trailing_whitespace", "Trailing whitespace detected",
                f"{trailing} line(s) contain trailing spaces or tabs.", rel,
                "Run the formatter and review the diff.", True,
            ))
        if mixed:
            self.findings.append(Finding(
                "medium", "mixed_line_endings", "Mixed line endings",
                "Both CRLF and LF line endings were detected.", rel,
                "Normalize line endings through .gitattributes and your formatter.", True,
            ))
        if CITATION_MARKER_RE.search(text):
            self.findings.append(Finding(
                "medium", "imported_citation_marker", "Imported citation marker in documentation",
                "The file contains assistant/tool citation syntax that does not belong in repository documentation.", rel,
                "Replace the marker with a normal source note or remove it.", True,
            ))

        for secret_type, pattern in SECRET_PATTERNS:
            match = pattern.search(text)
            if not match:
                continue
            sample = match.group(0)
            if any(word in sample.lower() for word in ("example", "placeholder", "your_", "changeme")):
                continue
            redacted = sample[:6] + "…" + sample[-4:] if len(sample) > 14 else "[redacted]"
            self.findings.append(Finding(
                "critical", "possible_secret", "Possible credential or secret",
                f"Pattern: {secret_type}; sample: {redacted}", rel,
                "Rotate exposed credentials immediately, remove them from Git history, and use environment variables or GitHub Secrets.", False,
            ))

        if ext in {".md", ".mdx", ".html", ".htm"}:
            self._check_local_links(rel, text)

    def _check_local_links(self, rel: str, text: str) -> None:
        candidates = MARKDOWN_LINK_RE.findall(text) + HTML_LINK_RE.findall(text)
        missing: list[str] = []
        base = (self.root / rel).parent
        for raw_target in candidates:
            target = raw_target.strip().strip("<>").split()[0]
            if not target or target.startswith(("#", "http://", "https://", "mailto:", "tel:", "data:", "javascript:")):
                continue
            decoded = urllib.parse.unquote(target.split("#", 1)[0].split("?", 1)[0])
            if not decoded:
                continue
            candidate = (base / decoded).resolve()
            try:
                candidate.relative_to(self.root)
            except ValueError:
                continue
            if not candidate.exists():
                missing.append(target)
        if missing:
            unique = sorted(set(missing))
            self.findings.append(Finding(
                "high", "broken_local_links", "Broken local links or assets",
                f"{len(unique)} unresolved target(s): " + ", ".join(unique[:8]) + (" …" if len(unique) > 8 else ""),
                rel, "Correct paths after normalizing folder names; validate links before committing.", True,
                {"targets": unique},
            ))

    @staticmethod
    def _file_category(ext: str, name: str, is_test: bool, is_readme: bool) -> str:
        if is_test:
            return "test"
        if is_readme or ext in DOCUMENT_EXTENSIONS:
            return "documentation"
        if ext in SOURCE_EXTENSIONS:
            return "source"
        if ext in DATA_EXTENSIONS:
            return "data"
        if ext in MEDIA_EXTENSIONS:
            return "media"
        if ext in ARCHIVE_EXTENSIONS:
            return "archive"
        if name.startswith(".") or name.lower() in {"package.json", "tsconfig.json", "pyproject.toml", "requirements.txt"}:
            return "configuration"
        return "other"

    @staticmethod
    def _week_and_day(rel: str) -> tuple[str | None, str | None]:
        parts = PurePosixPath(rel).parts
        week = next((p for p in parts if re.match(r"^Week\d+", p, re.I)), None)
        day = next((p for p in parts if re.match(r"^Day\d+", p, re.I) or p.lower().startswith("remote")), None)
        return week, day

    @staticmethod
    def _kind_and_tier(rel: str) -> tuple[str | None, str | None]:
        low = rel.lower()
        if "dailychallenge" in low or "dailychallange" in low:
            kind = "Daily Challenge"
        elif "timedchallenge" in low:
            kind = "Timed Challenge"
        elif "miniproject" in low or "mini-project" in low:
            kind = "Mini Project"
        elif "/exercises/" in low or "/exercise-" in low:
            kind = "Exercise"
        else:
            kind = None

        if "xpninja" in low:
            tier = "XP Ninja"
        elif "xpgold" in low:
            tier = "XP Gold"
        elif "xp+" in low or "xpplus" in low:
            tier = "XP Plus"
        elif re.search(r"(?:^|/)exercisesxp(?:/|$)", low):
            tier = "XP"
        else:
            tier = None
        return kind, tier

    def _exercise_root(self, rel: str) -> str | None:
        parts = list(PurePosixPath(rel).parts)
        if not parts or not any(re.match(r"^Week\d+", p, re.I) for p in parts):
            return None
        if len(parts) == 1:
            return None
        file_index = len(parts) - 1
        lower = [p.lower() for p in parts]

        daily_indices = [i for i, p in enumerate(lower) if p in {"dailychallenge", "dailychallange", "dailychalenge"}]
        if daily_indices:
            i = daily_indices[-1]
            root_end = min(file_index, i + 2)
            if root_end == i + 1:
                return "/".join(parts[:root_end])
            return "/".join(parts[:root_end])

        exercises_indices = [i for i, p in enumerate(lower) if p == "exercises"]
        if exercises_indices:
            i = exercises_indices[-1]
            if i + 1 >= file_index:
                return "/".join(parts[:file_index])
            tier_component = lower[i + 1]
            is_tier = tier_component.startswith("exercisesxp") or tier_component.startswith("exercicesxp")
            if is_tier and i + 2 < file_index:
                child = parts[i + 2]
                if child.lower().startswith("exercise-") or child.lower() not in {"src", "js", "css", "data", "assets", "sounds", "tests"}:
                    return "/".join(parts[:i + 3])
            return "/".join(parts[:i + 2])

        if any("miniproject" in p for p in lower):
            return "/".join(parts[:file_index])

        if any(re.match(r"^day\d+", p, re.I) for p in parts):
            return "/".join(parts[:file_index])
        return None

    def _build_exercises(self) -> None:
        groups: dict[str, list[FileRecord]] = defaultdict(list)
        for record in self.files:
            if record.exercise_root and record.category in {"source", "test", "documentation", "configuration", "data", "media"}:
                groups[record.exercise_root].append(record)

        exercise_records: list[ExerciseRecord] = []
        for root, records in sorted(groups.items()):
            source = [r for r in records if r.category == "source"]
            if not source and not any(r.category == "data" for r in records):
                continue
            readmes = [r for r in records if r.is_readme]
            tests = [r for r in records if r.is_test]
            syntax_errors = [r.path for r in records if r.syntax_ok is False]
            title, goal = self._infer_title_and_goal(root, readmes)
            technologies = sorted({r.language for r in records if r.language not in {"Other", "Text", "Markdown"}})
            entry_points = self._entry_points(records)
            has_readme = bool(readmes)
            completion = 0
            completion += 30 if source else 0
            completion += 15 if all(r.size_bytes > 0 for r in source) else 5
            completion += 15 if has_readme else 0
            completion += 10 if entry_points else 0
            completion += 20 if tests else 0
            completion += 10 if not syntax_errors else 0
            completion = int(clamp(completion))

            quality = 25
            quality += 20 if has_readme else 0
            quality += 15 if tests else 0
            quality += 15 if len(source) > 1 else 8
            quality += 15 if not syntax_errors else 0
            quality += 10 if entry_points else 0
            quality -= sum(3 for r in records if r.trailing_whitespace_lines > 0)
            quality = int(clamp(quality))

            week = next((r.week for r in records if r.week), "Unknown")
            day = next((r.day for r in records if r.day), None)
            kind = next((r.exercise_kind for r in records if r.exercise_kind), "Exercise")
            tier = next((r.tier for r in records if r.tier), None)
            exercise_records.append(ExerciseRecord(
                path=root,
                title=title,
                suggested_slug=slugify(title),
                goal=goal,
                week=week,
                day=day,
                kind=kind,
                tier=tier,
                technologies=technologies,
                file_count=len(records),
                size_bytes=sum(r.size_bytes for r in records),
                lines=sum(r.lines for r in records),
                source_files=[r.path for r in source],
                entry_points=entry_points,
                has_readme=has_readme,
                readme_path=readmes[0].path if readmes else None,
                test_files=[r.path for r in tests],
                syntax_errors=syntax_errors,
                completion_score=completion,
                quality_score=quality,
            ))
        self.exercises = exercise_records

    def _infer_title_and_goal(self, root: str, readmes: list[FileRecord]) -> tuple[str, str]:
        readme_text = self.texts.get(readmes[0].path, "") if readmes else ""
        heading = HEADING_RE.search(readme_text) if readme_text else None
        leaf = PurePosixPath(root).name
        generic = normalized_component(leaf) in {
            "exercisesxp", "exercisesxpgold", "exercisesxpninja", "dailychallenge",
            "exercises", "src", "app", "exercise",
        }
        if heading:
            title = re.sub(r"^[^A-Za-z0-9]+", "", heading.group(1)).strip()
            title = re.sub(r"\s+", " ", title)
            if len(title) > 90:
                title = title[:87].rstrip() + "…"
        elif generic:
            parts = PurePosixPath(root).parts
            day = next((p for p in parts if re.match(r"^Day\d+", p, re.I)), leaf)
            title = f"{human_title(day)} — {human_title(leaf)}"
        else:
            title = human_title(leaf)

        goal_match = GOAL_RE.search(readme_text) if readme_text else None
        if goal_match:
            goal = re.sub(r"\s+", " ", goal_match.group(1)).strip()
        else:
            goal = self._goal_from_path(root)
        return title, goal

    @staticmethod
    def _goal_from_path(path: str) -> str:
        low = path.lower()
        mapping = [
            (("startingwithpython", "startingwith"), "Practice Python syntax, data types, input/output, conditionals, and foundational problem solving."),
            (("lists", "iterating", "formattingdata"), "Manipulate collections, iterate safely, validate input, and format useful output."),
            (("dictionaries",), "Model and transform key-value data with dictionaries and nested collections."),
            (("functions",), "Design reusable functions with clear parameters, return values, validation, and scope."),
            (("hangman",), "Build a modular command-line word game with state management, validation, and replayable interaction."),
            (("tictactoe",), "Build a two-player command-line game with board rendering, move validation, and win detection."),
            (("inheritance", "polymorphism", "encapsulation"), "Apply object-oriented inheritance, encapsulation, polymorphism, and reusable class design."),
            (("oop",), "Practice classes, objects, methods, special methods, and maintainable object-oriented design."),
            (("fileio", "json", "api"), "Work safely with files, JSON data, exceptions, and external API responses."),
            (("dom", "events"), "Create accessible browser interactions using DOM selection, events, forms, and state updates."),
            (("coloringgame",), "Build an interactive drawing grid with event delegation, responsive controls, and dynamic state."),
            (("asynchronous", "promises"), "Practice asynchronous control flow, promises, error handling, and resilient user feedback."),
            (("fetch", "asyncawait"), "Consume HTTP APIs with async/await, loading states, validation, and error handling."),
            (("typescript", "typeguard", "union"), "Use TypeScript types, interfaces, unions, guards, and classes to model safer domain logic."),
            (("database", "sql", "dvdrental"), "Practice relational modeling, joins, constraints, CRUD operations, and PostgreSQL queries."),
            (("nodejs", "commonjs", "esm", "npm"), "Build Node.js scripts with modules, npm dependencies, filesystem operations, and clear entry points."),
        ]
        for needles, goal in mapping:
            if any(needle in low for needle in needles):
                return goal
        return "Complete the exercise requirements, explain the concepts used, validate edge cases, and document how to run the solution."

    @staticmethod
    def _entry_points(records: list[FileRecord]) -> list[str]:
        priority_names = {"main.py", "app.py", "index.py", "cli.py", "index.html", "app.js", "index.js", "main.js", "index.ts", "main.ts"}
        entries = [r.path for r in records if PurePosixPath(r.path).name.lower() in priority_names]
        if not entries:
            entries = [r.path for r in records if r.extension in {".py", ".html", ".sql"} and r.category == "source"][:3]
        return sorted(entries)

    def _detect_cross_file_findings(self) -> None:
        self._detect_duplicates()
        self._detect_case_and_name_collisions()
        self._detect_naming_risks()
        self._detect_root_and_tooling_issues()
        self._detect_documentation_issues()
        self._detect_testing_issues()

    def _detect_duplicates(self) -> None:
        by_hash: dict[tuple[str, int], list[str]] = defaultdict(list)
        for record in self.files:
            if record.size_bytes >= 32:
                by_hash[(record.sha256, record.size_bytes)].append(record.path)
        duplicates = [paths for paths in by_hash.values() if len(paths) > 1]
        for group in sorted(duplicates, key=len, reverse=True):
            self.findings.append(Finding(
                "medium", "duplicate_content", "Exact duplicate file content",
                f"{len(group)} files share the same SHA-256: " + ", ".join(group[:6]) + (" …" if len(group) > 6 else ""),
                group[0], "Keep the canonical copy and replace intentional duplicates with references where practical.", False,
                {"paths": group},
            ))

    def _detect_case_and_name_collisions(self) -> None:
        all_dirs: set[str] = set()
        for record in self.files:
            p = PurePosixPath(record.path)
            for i in range(1, len(p.parts)):
                all_dirs.add("/".join(p.parts[:i]))
        lower_map: dict[str, list[str]] = defaultdict(list)
        normalized_map: dict[tuple[str, str], list[str]] = defaultdict(list)
        for directory in all_dirs:
            p = PurePosixPath(directory)
            lower_map[directory.lower()].append(directory)
            parent = "/".join(p.parts[:-1])
            normalized_map[(parent.lower(), normalized_component(p.name))].append(directory)

        emitted: set[tuple[str, ...]] = set()
        for group in list(lower_map.values()) + list(normalized_map.values()):
            unique = sorted(set(group))
            if len(unique) <= 1:
                continue
            key = tuple(unique)
            if key in emitted:
                continue
            emitted.add(key)
            self.findings.append(Finding(
                "high", "directory_collision", "Directory names collide by case or punctuation",
                ", ".join(unique), unique[0],
                "Merge content into one canonical directory using git mv on a dedicated branch.", False,
                {"paths": unique},
            ))

    def _detect_naming_risks(self) -> None:
        problematic: list[dict[str, str]] = []
        seen_components: set[tuple[str, str]] = set()
        for record in self.files:
            parts = PurePosixPath(record.path).parts
            for i, component in enumerate(parts[:-1]):
                prefix = "/".join(parts[:i + 1])
                key = (prefix, component)
                if key in seen_components:
                    continue
                seen_components.add(key)
                reasons: list[str] = []
                if " " in component:
                    reasons.append("space")
                if "&" in component:
                    reasons.append("ampersand")
                if "+" in component:
                    reasons.append("plus sign")
                if "(" in component or ")" in component:
                    reasons.append("parentheses")
                if any(bad.lower() in component.lower() for bad in ("challange", "exercices", "quizz")):
                    reasons.append("likely misspelling")
                if reasons:
                    problematic.append({"path": prefix, "reasons": ", ".join(reasons)})
        if problematic:
            self.findings.append(Finding(
                "medium", "nonportable_names", "Non-portable or inconsistent directory names",
                f"Detected {len(problematic)} directory path(s). Examples: " + "; ".join(f"{x['path']} ({x['reasons']})" for x in problematic[:10]),
                problematic[0]["path"],
                "Adopt one convention: Week/Day folders in PascalCase; project folders in PascalCase; Python files in snake_case; web files in kebab-case or camelCase.",
                False, {"items": problematic},
            ))

    def _detect_root_and_tooling_issues(self) -> None:
        root_files = {PurePosixPath(r.path).name: r for r in self.files if len(PurePosixPath(r.path).parts) == 1}
        root_archives = [r for r in self.files if len(PurePosixPath(r.path).parts) == 1 and r.extension in ARCHIVE_EXTENSIONS]
        if root_archives:
            self.findings.append(Finding(
                "high", "root_archives", "Source archives stored at repository root",
                ", ".join(f"{r.path} ({human_size(r.size_bytes)})" for r in root_archives),
                root_archives[0].path,
                "Confirm they are redundant, keep a local backup, then remove them from Git or move them to release assets.", False,
            ))

        package_text = self.texts.get("package.json")
        if package_text:
            try:
                package = json.loads(package_text)
            except json.JSONDecodeError:
                package = {}
            lockfiles = [name for name in ("package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb") if name in root_files]
            if not lockfiles:
                self.findings.append(Finding(
                    "high", "missing_lockfile", "No root package-manager lockfile",
                    "package.json exists, but no recognized lockfile is tracked.", "package.json",
                    "Choose one package manager, run its install command, and commit exactly one lockfile.", True,
                ))
            scripts = package.get("scripts", {}) if isinstance(package, dict) else {}
            placeholders = [name for name, command in scripts.items() if isinstance(command, str) and re.search(r"placeholder|not yet|echo\s+['\"]?.*(not|placeholder)", command, re.I)]
            if placeholders:
                self.findings.append(Finding(
                    "medium", "placeholder_scripts", "Placeholder npm scripts",
                    "Scripts without real behavior: " + ", ".join(placeholders), "package.json",
                    "Replace each placeholder with a working command or remove it until the integrated application exists.", True,
                ))
            test_command = str(scripts.get("test", ""))
            js_tests = [r for r in self.files if r.is_test and r.extension in {".js", ".mjs", ".cjs", ".ts", ".tsx"}]
            if "node --test" in test_command and not js_tests:
                self.findings.append(Finding(
                    "high", "node_test_without_tests", "Node test command has no discoverable test files",
                    "The root test script uses node --test, but no JavaScript/TypeScript test filename was detected.", "package.json",
                    "Add .test.js/.spec.js tests for the strongest browser and Node modules.", True,
                ))

        gitignore = self.texts.get(".gitignore", "")
        ignored_locks = [name for name in ("package-lock.json", "pnpm-lock.yaml", "yarn.lock") if re.search(rf"(?m)^\s*{re.escape(name)}\s*$", gitignore)]
        if ignored_locks:
            self.findings.append(Finding(
                "high", "lockfiles_ignored", "Package-manager lockfiles are ignored",
                ", ".join(ignored_locks), ".gitignore",
                "Remove lockfile patterns from .gitignore and commit the selected lockfile for reproducible installs.", True,
            ))

        workflows = [r for r in self.files if r.path.startswith(".github/workflows/") and r.extension in {".yml", ".yaml"}]
        if not workflows:
            self.findings.append(Finding(
                "high", "missing_ci", "No GitHub Actions workflow",
                "No tracked YAML workflow was found under .github/workflows/.", None,
                "Add a read-only quality workflow for Python syntax, formatting, linting, tests, and report generation.", True,
            ))

        gitattributes = self.texts.get(".gitattributes", "")
        if re.search(r"(?m)^\s*\*\.svg\s+binary\s*$", gitattributes):
            self.findings.append(Finding(
                "low", "svg_marked_binary", "SVG files are marked binary",
                "Text-based SVG diffs will be hidden from normal Git reviews.", ".gitattributes",
                "Prefer '*.svg text eol=lf' unless the SVGs are generated and intentionally opaque.", True,
            ))

        eslint = self.texts.get(".eslintrc.cjs", "")
        if eslint:
            ignore_strings = re.findall(r"['\"]([^'\"]*Week5[^'\"]*)['\"]", eslint)
            actual_week5 = sorted({r.week for r in self.files if r.week and r.week.lower().startswith("week5")})
            for item in ignore_strings:
                root_component = item.split("/", 1)[0]
                if root_component and root_component not in actual_week5:
                    self.findings.append(Finding(
                        "medium", "eslint_path_mismatch", "ESLint ignore path does not match repository casing",
                        f"Configured: {item}; actual Week5 roots: {', '.join(actual_week5)}.", ".eslintrc.cjs",
                        "Use exact canonical paths after merging the duplicate Week5 directories.", True,
                    ))
                    break

    def _detect_documentation_issues(self) -> None:
        root_readme = self.texts.get("README.md", "")
        if not root_readme:
            self.findings.append(Finding(
                "critical", "missing_root_readme", "Root README is missing or unreadable",
                "A portfolio repository needs a clear landing page.", "README.md",
                "Create a concise, source-backed README with setup, projects, roadmap, and live links.", True,
            ))
            return

        if self.git_head:
            match = re.search(r"(?im)^\|\s*Current revision\s*\|\s*`?([0-9a-f]{7,40})`?", root_readme)
            if match and not self.git_head.startswith(match.group(1)):
                self.findings.append(Finding(
                    "high", "stale_readme_revision", "README snapshot is stale",
                    f"README revision {match.group(1)} does not match current HEAD {self.git_head[:12]}.", "README.md",
                    "Generate repository statistics during the audit instead of hard-coding them.", True,
                ))

        if re.search(r"Week6[^\n|]*\|[^\n|]*Present", root_readme, re.I) and re.search(r"Week6[^\n|]*(planned|roadmap)", root_readme, re.I):
            self.findings.append(Finding(
                "high", "week6_status_contradiction", "Week6 is both present and planned in README",
                "The learning architecture presents Week6 as existing and then repeats Week6 as a future phase.", "README.md",
                "Rename future phases according to actual content: Week6 SQL/Node is present; plan Week7 React and Week8 integrated delivery.", True,
            ))

        missing_readmes = [e for e in self.exercises if not e.has_readme]
        if missing_readmes:
            ratio = len(missing_readmes) / max(1, len(self.exercises))
            severity = "high" if ratio > 0.5 else "medium"
            self.findings.append(Finding(
                severity, "missing_exercise_readmes", "Exercises without local README documentation",
                f"{len(missing_readmes)} of {len(self.exercises)} detected exercise/project roots lack a local README.",
                missing_readmes[0].path,
                "Add a short README with goal, concepts, run command, expected behavior, edge cases, and improvement ideas.", True,
                {"paths": [e.path for e in missing_readmes]},
            ))

        declared_paths: list[tuple[str, str]] = []
        for readme_path, text in self.texts.items():
            if PurePosixPath(readme_path).name.lower() not in README_NAMES:
                continue
            base = PurePosixPath(readme_path).parent
            for match in BACKTICK_PATH_RE.findall(text):
                raw = match.strip().replace("\\", "/")
                if raw.startswith(("http://", "https://")) or " " in raw and not raw.endswith((".md", ".py", ".js", ".ts", ".html", ".sql", ".json")):
                    continue
                candidate = (base / raw).as_posix()
                declared_paths.append((readme_path, candidate))
        existing = {r.path for r in self.files}
        missing_declared = [(src, target) for src, target in declared_paths if target not in existing and not (self.root / target).exists()]
        if missing_declared:
            samples = [f"{src} → {target}" for src, target in missing_declared[:10]]
            self.findings.append(Finding(
                "medium", "readme_declares_missing_files", "README text names files that do not exist",
                f"Detected {len(missing_declared)} unresolved backticked file reference(s). Examples: " + "; ".join(samples),
                missing_declared[0][0],
                "Regenerate directory trees from git ls-files and remove unsupported quality claims.", True,
                {"items": missing_declared},
            ))

    def _detect_testing_issues(self) -> None:
        test_files = [r for r in self.files if r.is_test]
        tested_exercises = sum(1 for e in self.exercises if e.test_files)
        coverage = tested_exercises / max(1, len(self.exercises))
        if coverage < 0.25:
            self.findings.append(Finding(
                "high", "low_test_coverage", "Very low exercise-level automated test coverage",
                f"{tested_exercises} of {len(self.exercises)} detected exercise roots contain test files ({coverage * 100:.1f}%).",
                test_files[0].path if test_files else None,
                "Start with pure functions and domain classes in Tic-Tac-Toe, Hangman, OOP modules, TypeScript validators, and Node utilities.", True,
            ))
        broken_tests = [r for r in test_files if r.syntax_ok is False]
        if broken_tests:
            self.findings.append(Finding(
                "critical", "broken_test_files", "Test files contain syntax errors",
                ", ".join(f"{r.path}: {r.syntax_error}" for r in broken_tests), broken_tests[0].path,
                "Repair test syntax before relying on any green test status.", True,
            ))

    def _build_rename_plan(self) -> None:
        proposals: list[RenameProposal] = []
        seen: set[tuple[str, str]] = set()

        for item in KNOWN_PATH_PROPOSALS:
            old = item["old_path"]
            if not (self.root / old).exists():
                continue
            new = item["new_path"]
            proposals.append(RenameProposal(
                approved="no",
                action=item["action"],
                old_path=old,
                new_path=new,
                risk=item["risk"],
                reason=item["reason"],
                destination_exists=(self.root / new).exists(),
                notes=item["notes"],
            ))
            seen.add((old, new))

        directories: set[str] = set()
        for record in self.files:
            p = PurePosixPath(record.path)
            for i in range(1, len(p.parts)):
                directories.add("/".join(p.parts[:i]))
        for directory in sorted(directories, key=lambda x: (x.count("/"), x.lower())):
            p = PurePosixPath(directory)
            component = p.name
            new_component = component
            for wrong, correct in KNOWN_COMPONENT_FIXES.items():
                new_component = re.sub(re.escape(wrong), correct, new_component, flags=re.I)
            new_component = new_component.replace("&", "And")
            new_component = re.sub(r"\s+", "", new_component)
            if new_component == component:
                continue
            new = str(p.parent / new_component) if str(p.parent) != "." else new_component
            if (directory, new) in seen:
                continue
            destination_exists = (self.root / new).exists()
            action = "manual_merge" if destination_exists else "move"
            risk = "high" if destination_exists else "medium"
            proposals.append(RenameProposal(
                approved="no",
                action=action,
                old_path=directory,
                new_path=new,
                risk=risk,
                reason="Normalize a misspelling, space, or shell-sensitive character.",
                destination_exists=destination_exists,
                notes="Review assignment links and README references before approval.",
            ))
            seen.add((directory, new))

        self.renames = sorted(proposals, key=lambda r: (SEVERITY_ORDER.get(r.risk, 9), r.old_path.lower()))

    def _run_optional_tools(self) -> None:
        self.console.heading("Optional local tool execution")
        commands: list[tuple[str, list[str], bool]] = []
        if shutil.which("python") or shutil.which("py"):
            python_cmd = [sys.executable]
            week_dirs = sorted({r.week for r in self.files if r.week and any(f.path.startswith(r.week + "/") and f.extension == ".py" for f in self.files)})
            if week_dirs:
                commands.append(("Python compileall", [*python_cmd, "-m", "compileall", "-q", *week_dirs], True))
        package = self.root / "package.json"
        if package.exists() and shutil.which("npm"):
            node_modules = self.root / "node_modules"
            if node_modules.exists():
                commands.extend([
                    ("Prettier check", ["npm", "run", "format:check", "--if-present"], True),
                    ("ESLint", ["npm", "run", "lint", "--if-present"], True),
                    ("Node tests", ["npm", "test", "--if-present"], True),
                ])
            else:
                self.console.warn("node_modules is absent; npm checks skipped. The studio never installs dependencies automatically.")
        for name, command, _ in commands:
            self.console.info(f"Running {name}: {' '.join(command)}")
            code, out, err, duration = run_command(command, self.root, timeout=180)
            status = "passed" if code == 0 else "failed" if code is not None else "error"
            self.tool_runs.append(ToolRun(name, command, status, code, duration, out[-12000:], err[-12000:]))
            if status == "passed":
                self.console.ok(f"{name} passed in {duration:.2f}s")
            else:
                self.console.warn(f"{name} {status} in {duration:.2f}s")
                self.findings.append(Finding(
                    "high", "tool_check_failed", f"Local check failed: {name}",
                    (err or out or "No output")[-1200:], None,
                    "Open the generated tool-run section, fix the first actionable error, and run the audit again.", False,
                    {"command": command, "returncode": code},
                ))

    def _calculate_score(self) -> dict[str, Any]:
        file_count = len(self.files)
        source = [r for r in self.files if r.category == "source"]
        languages = {r.language for r in source if r.language not in {"Other"}}
        weeks = {r.week for r in self.files if r.week}
        readme_coverage = sum(1 for e in self.exercises if e.has_readme) / max(1, len(self.exercises))
        tested_coverage = sum(1 for e in self.exercises if e.test_files) / max(1, len(self.exercises))
        syntax_checked = [r for r in self.files if r.syntax_ok is not None]
        syntax_valid = sum(1 for r in syntax_checked if r.syntax_ok is True) / max(1, len(syntax_checked))

        broken_link_findings = sum(1 for f in self.findings if f.code == "broken_local_links")
        collision_findings = sum(1 for f in self.findings if f.code == "directory_collision")
        naming_findings = sum(1 for f in self.findings if f.code == "nonportable_names")
        has_ci = any(r.path.startswith(".github/workflows/") for r in self.files)
        has_lock = any(PurePosixPath(r.path).name in {"package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb"} for r in self.files)
        has_root_readme = "README.md" in self.texts
        has_license = any(PurePosixPath(r.path).name.upper().startswith("LICENSE") for r in self.files)
        has_animated_assets = any(r.extension == ".svg" and "assets/readme" in r.path for r in self.files)
        project_count = sum(1 for e in self.exercises if e.kind in {"Mini Project", "Daily Challenge"})
        media_count = sum(1 for r in self.files if r.category == "media")

        categories = {
            "learning_breadth": clamp(35 + len(weeks) * 7 + len(languages) * 5 + min(15, len(self.exercises) / 3)),
            "documentation": clamp(20 + readme_coverage * 65 + (15 if has_root_readme else 0) - broken_link_findings * 8),
            "structure": clamp(90 - collision_findings * 22 - naming_findings * 10 - sum(1 for f in self.findings if f.code == "root_archives") * 12),
            "code_health": clamp(20 + syntax_valid * 65 + (10 if source else 0) - sum(1 for f in self.findings if f.severity == "critical" and f.code != "possible_secret") * 12),
            "testing": clamp(tested_coverage * 80 + (10 if any(r.is_test for r in self.files) else 0) + (10 if self.tool_runs and all(t.status == "passed" for t in self.tool_runs) else 0)),
            "tooling": clamp(20 + (20 if "package.json" in self.texts else 0) + (15 if ".eslintrc.cjs" in self.texts or "eslint.config.js" in self.texts or "eslint.config.mjs" in self.texts else 0) + (15 if ".prettierrc.json" in self.texts else 0) + (20 if has_lock else 0) + (10 if ".gitattributes" in self.texts else 0)),
            "automation": clamp((55 if has_ci else 0) + (25 if has_lock else 0) + (20 if self.tool_runs else 0)),
            "portfolio": clamp((25 if has_root_readme else 0) + (15 if has_license else 0) + (20 if has_animated_assets else 0) + min(25, project_count * 2) + (15 if media_count else 0)),
        }
        weighted = sum(categories[name] * weight / 100 for name, weight in CATEGORY_WEIGHTS.items())
        overall = round(weighted, 1)
        grade = "A" if overall >= 90 else "B" if overall >= 80 else "C" if overall >= 70 else "D" if overall >= 60 else "E" if overall >= 50 else "F"
        return {
            "overall": overall,
            "grade": grade,
            "categories": {name: round(value, 1) for name, value in categories.items()},
            "weights": CATEGORY_WEIGHTS,
            "method": "Heuristic repository-readiness score. It is not a course grade and does not prove runtime correctness.",
            "inputs": {
                "file_count": file_count,
                "source_file_count": len(source),
                "week_count": len(weeks),
                "language_count": len(languages),
                "exercise_count": len(self.exercises),
                "readme_coverage_percent": round(readme_coverage * 100, 1),
                "tested_exercise_coverage_percent": round(tested_coverage * 100, 1),
                "syntax_valid_percent": round(syntax_valid * 100, 1),
            },
        }

    def _calculate_stats(self, score: dict[str, Any]) -> dict[str, Any]:
        total_size = sum(r.size_bytes for r in self.files)
        total_lines = sum(r.lines for r in self.files)
        extension_counts = Counter(r.extension for r in self.files)
        category_counts = Counter(r.category for r in self.files)
        language_files = Counter(r.language for r in self.files if r.category in {"source", "test"})
        language_bytes = Counter()
        language_lines = Counter()
        for r in self.files:
            if r.category in {"source", "test"}:
                language_bytes[r.language] += r.size_bytes
                language_lines[r.language] += r.lines

        source_bytes = sum(language_bytes.values()) or 1
        source_lines = sum(language_lines.values()) or 1
        languages = []
        for language in sorted(language_bytes, key=lambda x: language_bytes[x], reverse=True):
            languages.append({
                "language": language,
                "files": language_files[language],
                "bytes": language_bytes[language],
                "bytes_percent": round(language_bytes[language] / source_bytes * 100, 2),
                "lines": language_lines[language],
                "lines_percent": round(language_lines[language] / source_lines * 100, 2),
            })

        week_data: dict[str, dict[str, Any]] = defaultdict(lambda: {"files": 0, "bytes": 0, "lines": 0, "source_files": 0, "tests": 0, "readmes": 0, "exercises": 0})
        for r in self.files:
            if not r.week:
                continue
            item = week_data[r.week]
            item["files"] += 1
            item["bytes"] += r.size_bytes
            item["lines"] += r.lines
            item["source_files"] += int(r.category == "source")
            item["tests"] += int(r.is_test)
            item["readmes"] += int(r.is_readme)
        for e in self.exercises:
            week_data[e.week]["exercises"] += 1
        weeks = [{"week": week, **values} for week, values in sorted(week_data.items(), key=lambda kv: kv[0].lower())]

        largest = [asdict(r) for r in sorted(self.files, key=lambda r: r.size_bytes, reverse=True)[:25]]
        severities = Counter(f.severity for f in self.findings)
        return {
            "total_files": len(self.files),
            "total_size_bytes": total_size,
            "total_size_human": human_size(total_size),
            "total_text_lines": total_lines,
            "source_files": sum(1 for r in self.files if r.category == "source"),
            "documentation_files": sum(1 for r in self.files if r.category == "documentation"),
            "test_files": sum(1 for r in self.files if r.is_test),
            "media_files": sum(1 for r in self.files if r.category == "media"),
            "archive_files": sum(1 for r in self.files if r.category == "archive"),
            "binary_files": sum(1 for r in self.files if r.binary),
            "exercise_roots": len(self.exercises),
            "project_challenge_roots": sum(1 for e in self.exercises if e.kind in {"Mini Project", "Daily Challenge"}),
            "extension_counts": dict(extension_counts.most_common()),
            "category_counts": dict(category_counts.most_common()),
            "languages": languages,
            "weeks": weeks,
            "largest_files": largest,
            "finding_severities": dict(severities),
            "overall_score": score["overall"],
        }

    def _build_strengths(self, stats: dict[str, Any]) -> list[str]:
        strengths: list[str] = []
        weeks = stats.get("weeks", [])
        languages = stats.get("languages", [])
        if len(weeks) >= 5:
            strengths.append(f"Broad learning progression across {len(weeks)} detected week modules.")
        if len(languages) >= 5:
            strengths.append("Multi-language portfolio spanning Python, browser development, TypeScript, SQL, and Node-oriented work.")
        if stats.get("documentation_files", 0) >= 20:
            strengths.append(f"Strong documentation habit with {stats['documentation_files']} documentation files.")
        if stats.get("project_challenge_roots", 0) >= 10:
            strengths.append(f"Substantial hands-on practice with {stats['project_challenge_roots']} detected mini-project/daily-challenge roots.")
        if any("assets/readme" in r.path and r.extension == ".svg" for r in self.files):
            strengths.append("Animated README assets create a distinctive and memorable portfolio identity.")
        if self.git_commit_count and self.git_commit_count >= 100:
            strengths.append(f"Rich Git history ({self.git_commit_count} commits) demonstrates sustained iteration.")
        if any(r.path.endswith("Hangman/src/game.py") for r in self.files):
            strengths.append("Several stronger projects already separate domain logic from user interaction, which is a good base for testing.")
        return strengths

    def _build_risks(self) -> list[str]:
        critical = [f for f in self._sorted_findings() if f.severity == "critical"]
        high = [f for f in self._sorted_findings() if f.severity == "high"]
        risks = [f"{f.title}: {f.detail}" for f in (critical + high)[:12]]
        return risks

    def _build_next_actions(self, score: dict[str, Any]) -> list[dict[str, Any]]:
        actions: list[dict[str, Any]] = []

        def add(priority: int, phase: str, title: str, why: str, steps: list[str], done: str, impact: str, effort: str) -> None:
            actions.append({
                "priority": priority, "phase": phase, "title": title, "why": why,
                "steps": steps, "definition_of_done": done, "impact": impact, "effort": effort,
            })

        if any(f.code in {"python_syntax_error", "broken_test_files"} for f in self.findings):
            add(1, "Stabilize", "Fix syntax errors before every other refactor",
                "A syntax error blocks trustworthy testing and CI.",
                ["Open each critical syntax finding.", "Repair the first parser error.", "Run the studio again until Python syntax is 100% valid."],
                "No critical syntax findings remain.", "very high", "small")
        if any(f.code == "directory_collision" for f in self.findings):
            add(2, "Stabilize", "Merge duplicate Week5 and Week4 paths on a branch",
                "Case-colliding directories are fragile across Windows, Linux, GitHub, and tooling.",
                ["Create a dedicated cleanup branch in GitHub Desktop.", "Compare both directory trees.", "Move unique files into the canonical destination with git mv.", "Update links and run the audit."],
                "Only one canonical path exists for each module and every local link resolves.", "very high", "medium")
        if any(f.code in {"missing_lockfile", "lockfiles_ignored"} for f in self.findings):
            add(3, "Reproducibility", "Select npm and commit package-lock.json",
                "Dependencies cannot be reproduced reliably without a tracked lockfile.",
                ["Remove package-lock.json from .gitignore.", "Run npm install once at repository root.", "Review package-lock.json and commit it."],
                "npm ci works from a fresh clone.", "high", "small")
        if any(f.code == "root_archives" for f in self.findings):
            add(4, "Hygiene", "Remove duplicate Week1 ZIPs from the repository root",
                "Archives inflate clones and duplicate source history.",
                ["Compare archive contents.", "Back them up outside the repository.", "Delete them from Git or attach them to a release if preservation is necessary."],
                "No redundant source ZIP remains in the tracked root.", "medium", "small")
        if any(f.code in {"stale_readme_revision", "week6_status_contradiction", "readme_declares_missing_files"} for f in self.findings):
            add(5, "Documentation", "Regenerate README facts from the repository",
                "A polished README loses trust when statistics, paths, and roadmap status contradict the code.",
                ["Use the generated audit data rather than hard-coded counts.", "Mark Week6 SQL/Node as present.", "Remove references to missing files.", "Keep roadmap phases aligned with actual folders."],
                "README paths resolve and its snapshot matches current HEAD.", "high", "medium")
        if any(f.code == "missing_ci" for f in self.findings):
            add(6, "Automation", "Add a minimal read-only GitHub Actions quality workflow",
                "CI prevents syntax, link, formatting, and test regressions before merge.",
                ["Install the suggested workflow template.", "Use contents: read permissions.", "Run Python compile checks and npm quality scripts.", "Fix failures before adding stricter gates."],
                "A push and pull request both produce a green quality workflow.", "high", "medium")
        if score["categories"]["testing"] < 50:
            add(7, "Quality", "Test five portfolio anchors first",
                "Testing every historical exercise at once is inefficient; high-value modules produce faster confidence.",
                ["Test Tic-Tac-Toe pure functions.", "Test HangmanGame state transitions.", "Test one OOP domain model.", "Test UnionTypeValidator/LibrarySystem.", "Test one Node filesystem or data utility."],
                "At least five representative projects have deterministic tests and CI runs them.", "very high", "large")
        if score["categories"]["portfolio"] < 85:
            add(8, "Portfolio", "Promote three projects into interview-ready case studies",
                "Recruiters need quick proof, not only a large exercise archive.",
                ["Choose one Python CLI, one browser app, and one Node/SQL project.", "Add screenshots or short GIF demos.", "Document problem, architecture, tradeoffs, testing, accessibility, and next iteration.", "Publish live browser demos where possible."],
                "Three projects have polished READMEs, visuals, tests, and clear run/demo links.", "high", "large")
        add(9, "Product", "Build the integrated Nova Learning Dashboard capstone",
            "The repository becomes much stronger when historical exercises feed one deployable full-stack product.",
            ["Design a small API and database schema.", "Add React + TypeScript UI.", "Implement authentication and progress tracking.", "Add integration tests and deployment."],
            "A public deployment demonstrates authentication, persistence, API integration, tests, and responsive UI.", "transformational", "large")
        return sorted(actions, key=lambda x: x["priority"])

    def _sorted_findings(self) -> list[Finding]:
        return sorted(self.findings, key=lambda f: (SEVERITY_ORDER.get(f.severity, 9), f.code, f.path or ""))


class ReportWriter:
    def __init__(self, output_dir: Path, root: Path, console: Console) -> None:
        self.output_dir = output_dir
        self.root = root
        self.console = console

    def write_all(self, report: dict[str, Any], write_readme: bool = False) -> dict[str, Path]:
        self.output_dir.mkdir(parents=True, exist_ok=True)
        paths = {
            "json": self.output_dir / "nova_repo_audit.json",
            "markdown": self.output_dir / "nova_repo_audit.md",
            "html": self.output_dir / "nova_repo_dashboard.html",
            "inventory_csv": self.output_dir / "file_inventory.csv",
            "exercise_csv": self.output_dir / "exercise_catalog.csv",
            "exercise_md": self.output_dir / "exercise_catalog.md",
            "rename_csv": self.output_dir / "rename_plan.csv",
            "actions_md": self.output_dir / "next_actions.md",
            "tree": self.output_dir / "tree.txt",
            "summary": self.output_dir / "SUMMARY.txt",
        }
        paths["json"].write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
        paths["markdown"].write_text(self._markdown(report), encoding="utf-8")
        paths["html"].write_text(self._html(report), encoding="utf-8")
        self._inventory_csv(paths["inventory_csv"], report["files"])
        self._exercise_csv(paths["exercise_csv"], report["exercises"])
        paths["exercise_md"].write_text(self._exercise_markdown(report), encoding="utf-8")
        self._rename_csv(paths["rename_csv"], report["rename_plan"])
        paths["actions_md"].write_text(self._actions_markdown(report), encoding="utf-8")
        paths["tree"].write_text(self._tree(report), encoding="utf-8")
        paths["summary"].write_text(self._summary(report), encoding="utf-8")
        if write_readme:
            generated = self.output_dir / "README.nova.generated.md"
            generated.write_text(self._generated_readme(report), encoding="utf-8")
            paths["generated_readme"] = generated
        self.console.ok(f"Generated {len(paths)} report files in {self.output_dir}")
        return paths

    @staticmethod
    def _inventory_csv(path: Path, rows: list[dict[str, Any]]) -> None:
        fields = [
            "path", "size_bytes", "lines", "extension", "language", "category", "binary", "sha256",
            "encoding", "tracked", "week", "day", "exercise_root", "exercise_kind", "tier", "is_test",
            "is_readme", "todo_count", "trailing_whitespace_lines", "mixed_line_endings", "syntax_ok", "syntax_error",
        ]
        with path.open("w", newline="", encoding="utf-8-sig") as handle:
            writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(rows)

    @staticmethod
    def _exercise_csv(path: Path, rows: list[dict[str, Any]]) -> None:
        fields = [
            "path", "title", "suggested_slug", "goal", "week", "day", "kind", "tier", "technologies",
            "file_count", "size_bytes", "lines", "source_files", "entry_points", "has_readme", "readme_path",
            "test_files", "syntax_errors", "completion_score", "quality_score",
        ]
        with path.open("w", newline="", encoding="utf-8-sig") as handle:
            writer = csv.DictWriter(handle, fieldnames=fields)
            writer.writeheader()
            for row in rows:
                clean = dict(row)
                for key in ("technologies", "source_files", "entry_points", "test_files", "syntax_errors"):
                    clean[key] = " | ".join(clean.get(key) or [])
                writer.writerow({key: clean.get(key) for key in fields})

    @staticmethod
    def _rename_csv(path: Path, rows: list[dict[str, Any]]) -> None:
        fields = ["approved", "action", "old_path", "new_path", "risk", "reason", "destination_exists", "notes"]
        with path.open("w", newline="", encoding="utf-8-sig") as handle:
            writer = csv.DictWriter(handle, fieldnames=fields)
            writer.writeheader()
            writer.writerows(rows)

    def _markdown(self, report: dict[str, Any]) -> str:
        stats = report["statistics"]
        score = report["score"]
        repo = report["repository"]
        lines = [
            f"# 🪐 NOVA Repository Audit — {repo['name']}",
            "",
            f"> Generated: `{report['generated_at']}` by **{TOOL_NAME} v{VERSION}**.",
            "> The readiness score is a transparent heuristic, not a course grade or proof that every program runs correctly.",
            "",
            "## Executive snapshot",
            "",
            "| Metric | Value |",
            "|---|---:|",
            f"| Overall readiness | **{score['overall']}/100 ({score['grade']})** |",
            f"| Scan scope | {repo['scan_scope']} |",
            f"| Branch | `{repo.get('branch') or 'unknown'}` |",
            f"| HEAD | `{(repo.get('head') or 'unknown')[:12]}` |",
            f"| Commits | {repo.get('commit_count') if repo.get('commit_count') is not None else 'unknown'} |",
            f"| Files | {stats['total_files']} |",
            f"| Working-tree size | {stats['total_size_human']} |",
            f"| Text lines | {stats['total_text_lines']:,} |",
            f"| Source files | {stats['source_files']} |",
            f"| Documentation files | {stats['documentation_files']} |",
            f"| Test files | {stats['test_files']} |",
            f"| Exercise/project roots | {stats['exercise_roots']} |",
            "",
            "## Readiness percentages",
            "",
            "| Category | Score | Weight |",
            "|---|---:|---:|",
        ]
        for name, value in score["categories"].items():
            label = human_title(name)
            lines.append(f"| {label} | {value:.1f}% | {score['weights'][name]}% |")
        lines.extend(["", f"**Method:** {score['method']}", "", "## Strengths", ""])
        lines.extend(f"- ✅ {item}" for item in report["strengths"])
        lines.extend(["", "## Main risks", ""])
        lines.extend(f"- ⚠️ {item}" for item in report["risks"] or ["No critical/high risk summarized."])

        lines.extend(["", "## Language distribution (source and tests)", "", "| Language | Files | Bytes | Byte share | Lines | Line share |", "|---|---:|---:|---:|---:|---:|"])
        for item in stats["languages"]:
            lines.append(f"| {item['language']} | {item['files']} | {human_size(item['bytes'])} | {item['bytes_percent']:.2f}% | {item['lines']:,} | {item['lines_percent']:.2f}% |")

        lines.extend(["", "## Week/module breakdown", "", "| Module | Files | Size | Lines | Source | Tests | READMEs | Exercise roots |", "|---|---:|---:|---:|---:|---:|---:|---:|"])
        for item in stats["weeks"]:
            lines.append(f"| {item['week']} | {item['files']} | {human_size(item['bytes'])} | {item['lines']:,} | {item['source_files']} | {item['tests']} | {item['readmes']} | {item['exercises']} |")

        lines.extend(["", "## Findings", "", "| Severity | Code | Finding | Path | Recommendation |", "|---|---|---|---|---|"])
        for finding in report["findings"]:
            detail = str(finding["detail"]).replace("|", "\\|").replace("\n", " ")
            recommendation = str(finding.get("recommendation") or "").replace("|", "\\|").replace("\n", " ")
            path = str(finding.get("path") or "—").replace("|", "\\|")
            lines.append(f"| **{finding['severity'].upper()}** | `{finding['code']}` | {finding['title']}: {detail} | `{path}` | {recommendation} |")

        lines.extend(["", "## Largest files", "", "| File | Size | Category |", "|---|---:|---|"])
        for item in stats["largest_files"][:20]:
            lines.append(f"| `{item['path']}` | {human_size(item['size_bytes'])} | {item['category']} |")

        lines.extend(["", "## Priority action plan", ""])
        for action in report["next_actions"]:
            lines.extend([
                f"### {action['priority']}. {action['title']}",
                f"**Phase:** {action['phase']} · **Impact:** {action['impact']} · **Effort:** {action['effort']}",
                "",
                action["why"],
                "",
                *[f"- {step}" for step in action["steps"]],
                "",
                f"**Done when:** {action['definition_of_done']}",
                "",
            ])

        lines.extend([
            "## Safety notes",
            "",
            "- The default audit does not rename, move, delete, install, or execute project code.",
            "- Optional external tool checks only run when `--run-tools` is provided.",
            "- Rename application requires an approved CSV row plus `--yes`.",
            "- Manual-merge rows are never applied automatically.",
            "- Review every GitHub Desktop diff before committing.",
            "",
        ])
        return "\n".join(lines)

    def _exercise_markdown(self, report: dict[str, Any]) -> str:
        exercises = report["exercises"]
        lines = [
            "# 🎯 Exercise and Project Catalog",
            "",
            f"Detected roots: **{len(exercises)}**",
            "",
            "Each score is heuristic. It rewards source presence, documentation, entry points, syntax validity, and tests.",
            "",
        ]
        by_week: dict[str, list[dict[str, Any]]] = defaultdict(list)
        for item in exercises:
            by_week[item["week"]].append(item)
        for week in sorted(by_week):
            lines.append(f"## {week}")
            lines.append("")
            for item in sorted(by_week[week], key=lambda x: (x.get("day") or "", x["path"])):
                lines.extend([
                    f"### {item['title']}",
                    "",
                    f"- **Path:** `{item['path']}`",
                    f"- **Suggested slug:** `{item['suggested_slug']}`",
                    f"- **Day:** {item.get('day') or 'Unclassified'}",
                    f"- **Kind / tier:** {item.get('kind') or 'Exercise'}{(' · ' + item['tier']) if item.get('tier') else ''}",
                    f"- **Goal:** {item['goal']}",
                    f"- **Technologies:** {', '.join(item['technologies']) or 'Not inferred'}",
                    f"- **Files / size / lines:** {item['file_count']} · {human_size(item['size_bytes'])} · {item['lines']:,}",
                    f"- **README:** {'yes' if item['has_readme'] else 'no'}",
                    f"- **Tests:** {len(item['test_files'])}",
                    f"- **Completion / quality:** {item['completion_score']}% / {item['quality_score']}%",
                    "",
                ])
                if item["entry_points"]:
                    lines.append("**Run candidates:**")
                    lines.extend(f"- `{path}`" for path in item["entry_points"])
                    lines.append("")
                if item["syntax_errors"]:
                    lines.append("**Syntax errors:**")
                    lines.extend(f"- `{path}`" for path in item["syntax_errors"])
                    lines.append("")
        return "\n".join(lines)

    def _actions_markdown(self, report: dict[str, Any]) -> str:
        lines = ["# 🚀 NOVA Next Actions", "", "Use this as a branch-by-branch implementation plan.", ""]
        for action in report["next_actions"]:
            lines.extend([
                f"## P{action['priority']} — {action['title']}",
                "",
                f"**Phase:** {action['phase']}  ",
                f"**Impact:** {action['impact']}  ",
                f"**Effort:** {action['effort']}  ",
                "",
                action["why"],
                "",
                "### Steps",
                *[f"- [ ] {step}" for step in action["steps"]],
                "",
                f"**Definition of done:** {action['definition_of_done']}",
                "",
            ])
        lines.extend([
            "## Suggested commit waves",
            "",
            "1. `fix: repair syntax and broken tests`",
            "2. `chore: normalize folders and remove duplicate archives`",
            "3. `chore: track npm lockfile and align tooling paths`",
            "4. `docs: regenerate repository catalog and roadmap`",
            "5. `ci: add repository quality workflow`",
            "6. `test: cover portfolio anchor projects`",
            "7. `docs: add screenshots demos and accessibility notes`",
            "",
        ])
        return "\n".join(lines)

    def _tree(self, report: dict[str, Any]) -> str:
        rows = report["files"]
        root: dict[str, Any] = {}
        sizes: dict[str, int] = {}
        for row in rows:
            parts = PurePosixPath(row["path"]).parts
            node = root
            prefix: list[str] = []
            for part in parts:
                prefix.append(part)
                node = node.setdefault(part, {})
                sizes["/".join(prefix)] = sizes.get("/".join(prefix), 0) + int(row["size_bytes"])

        output = [report["repository"]["name"] + "/"]

        def walk(node: dict[str, Any], prefix: str, path_parts: list[str]) -> None:
            names = sorted(node, key=lambda x: (not bool(node[x]), x.lower()))
            for idx, name in enumerate(names):
                child = node[name]
                last = idx == len(names) - 1
                branch = "└── " if last else "├── "
                full = "/".join(path_parts + [name])
                suffix = "/" if child else f"  [{human_size(sizes.get(full, 0))}]"
                output.append(prefix + branch + name + suffix)
                if child:
                    walk(child, prefix + ("    " if last else "│   "), path_parts + [name])

        walk(root, "", [])
        return "\n".join(output) + "\n"

    def _summary(self, report: dict[str, Any]) -> str:
        stats = report["statistics"]
        score = report["score"]
        sev = stats["finding_severities"]
        return textwrap.dedent(f"""
        {TOOL_NAME} v{VERSION}
        Repository: {report['repository']['name']}
        Generated: {report['generated_at']}

        OVERALL READINESS: {score['overall']}/100 ({score['grade']})
        FILES: {stats['total_files']}
        SIZE: {stats['total_size_human']}
        TEXT LINES: {stats['total_text_lines']:,}
        EXERCISE ROOTS: {stats['exercise_roots']}
        TEST FILES: {stats['test_files']}

        FINDINGS
        Critical: {sev.get('critical', 0)}
        High:     {sev.get('high', 0)}
        Medium:   {sev.get('medium', 0)}
        Low:      {sev.get('low', 0)}
        Info:     {sev.get('info', 0)}

        Open nova_repo_dashboard.html for the animated report.
        Review rename_plan.csv before approving any move.
        """).strip() + "\n"

    def _generated_readme(self, report: dict[str, Any]) -> str:
        stats = report["statistics"]
        score = report["score"]
        lines = [
            "# Fullstack2026",
            "",
            "> A progressive full-stack learning archive evolving into an interview-ready product portfolio.",
            "",
            "## Current snapshot",
            "",
            f"- Repository readiness: **{score['overall']}/100** (heuristic)",
            f"- Tracked/visible files scanned: **{stats['total_files']}**",
            f"- Source files: **{stats['source_files']}**",
            f"- Exercise/project roots: **{stats['exercise_roots']}**",
            f"- Generated: **{report['generated_at']}**",
            "",
            "## Learning path",
            "",
        ]
        for week in stats["weeks"]:
            lines.append(f"- **{week['week']}** — {week['source_files']} source files, {week['exercises']} detected exercise roots, {week['tests']} tests")
        lines.extend([
            "",
            "## Quality workflow",
            "",
            "```powershell",
            "py -3 tools/nova_fullstack_studio.py --repo . --open",
            "npm run format:check",
            "npm run lint",
            "npm test",
            "```",
            "",
            "## Roadmap",
            "",
        ])
        lines.extend(f"- {a['title']}" for a in report["next_actions"][:7])
        lines.extend([
            "",
            "## Safety",
            "",
            "Never commit `.env`, credentials, generated dependencies, caches, or redundant source archives.",
            "",
            "---",
            f"Generated by {TOOL_NAME} v{VERSION}. Review and edit before replacing the repository README.",
            "",
        ])
        return "\n".join(lines)

    def _html(self, report: dict[str, Any]) -> str:
        stats = report["statistics"]
        score = report["score"]
        repo = report["repository"]

        def esc(value: Any) -> str:
            return html.escape(str(value), quote=True)

        category_cards = "".join(
            f"<article class='score-card'><div class='ring' style='--p:{value:.1f}'><span>{value:.0f}%</span></div><h3>{esc(human_title(name))}</h3><small>Weight {score['weights'][name]}%</small></article>"
            for name, value in score["categories"].items()
        )
        language_rows = "".join(
            f"<div class='bar-row'><div class='bar-label'><span>{esc(item['language'])}</span><b>{item['bytes_percent']:.1f}%</b></div><div class='bar'><i style='--w:{item['bytes_percent']:.2f}%'></i></div><small>{item['files']} files · {esc(human_size(item['bytes']))} · {item['lines']:,} lines</small></div>"
            for item in stats["languages"]
        )
        week_cards = "".join(
            f"<article class='week-card'><h3>{esc(item['week'])}</h3><p><b>{item['files']}</b> files · <b>{esc(human_size(item['bytes']))}</b></p><p>{item['source_files']} source · {item['tests']} tests · {item['readmes']} READMEs</p><p>{item['exercises']} exercise roots · {item['lines']:,} lines</p></article>"
            for item in stats["weeks"]
        )
        severity_badges = "".join(
            f"<span class='pill {esc(name)}'>{esc(name)} {count}</span>"
            for name, count in sorted(stats["finding_severities"].items(), key=lambda kv: SEVERITY_ORDER.get(kv[0], 9))
        )
        finding_rows = "".join(
            f"<tr data-severity='{esc(f['severity'])}' data-search='{esc((f['title'] + ' ' + f['detail'] + ' ' + (f.get('path') or '')).lower())}'><td><span class='pill {esc(f['severity'])}'>{esc(f['severity'])}</span></td><td><code>{esc(f['code'])}</code></td><td><b>{esc(f['title'])}</b><br><small>{esc(f['detail'])}</small></td><td><code>{esc(f.get('path') or '—')}</code></td><td>{esc(f.get('recommendation') or '')}</td></tr>"
            for f in report["findings"]
        )
        exercise_rows = "".join(
            f"<tr data-search='{esc((e['title'] + ' ' + e['path'] + ' ' + e['goal'] + ' ' + ' '.join(e['technologies'])).lower())}'><td><b>{esc(e['title'])}</b><br><code>{esc(e['path'])}</code></td><td>{esc(e['week'])}<br><small>{esc(e.get('day') or '')}</small></td><td>{esc(e['kind'])}{('<br><small>' + esc(e['tier']) + '</small>') if e.get('tier') else ''}</td><td>{esc(e['goal'])}</td><td>{esc(', '.join(e['technologies']) or '—')}</td><td><div class='mini-meter'><i style='--w:{e['completion_score']}%'></i></div>{e['completion_score']}%</td><td><div class='mini-meter'><i style='--w:{e['quality_score']}%'></i></div>{e['quality_score']}%</td><td>{'✅' if e['has_readme'] else '—'} / {len(e['test_files'])}</td></tr>"
            for e in report["exercises"]
        )
        action_cards = "".join(
            f"<article class='action-card'><span class='priority'>P{a['priority']}</span><h3>{esc(a['title'])}</h3><p>{esc(a['why'])}</p><div class='meta'>{esc(a['phase'])} · Impact {esc(a['impact'])} · Effort {esc(a['effort'])}</div><ul>{''.join('<li>' + esc(step) + '</li>' for step in a['steps'])}</ul><p class='done'><b>Done:</b> {esc(a['definition_of_done'])}</p></article>"
            for a in report["next_actions"]
        )
        rename_rows = "".join(
            f"<tr><td>{esc(r['action'])}</td><td><code>{esc(r['old_path'])}</code></td><td><code>{esc(r['new_path'])}</code></td><td><span class='pill {esc(r['risk'])}'>{esc(r['risk'])}</span></td><td>{esc(r['reason'])}</td><td>{'yes' if r['destination_exists'] else 'no'}</td></tr>"
            for r in report["rename_plan"]
        )
        largest_rows = "".join(
            f"<tr><td><code>{esc(r['path'])}</code></td><td>{esc(human_size(r['size_bytes']))}</td><td>{esc(r['category'])}</td><td>{esc(r['language'])}</td></tr>"
            for r in stats["largest_files"][:25]
        )
        strengths = "".join(f"<li>{esc(item)}</li>" for item in report["strengths"])
        risks = "".join(f"<li>{esc(item)}</li>" for item in report["risks"])
        payload = json.dumps({
            "generated": report["generated_at"],
            "files": stats["total_files"],
            "score": score["overall"],
        }, ensure_ascii=False)

        return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NOVA Audit · {esc(repo['name'])}</title>
<style>
:root{{--bg:#070916;--panel:rgba(18,23,49,.82);--panel2:#111833;--text:#edf4ff;--muted:#9fb0cc;--line:rgba(167,187,255,.18);--cyan:#4de8ff;--purple:#a970ff;--pink:#ff63d8;--green:#55f29b;--yellow:#ffd166;--red:#ff6978;--shadow:0 22px 70px rgba(0,0,0,.35)}}
*{{box-sizing:border-box}}html{{scroll-behavior:smooth}}body{{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;background:radial-gradient(circle at 15% 0%,#18265a 0,transparent 35%),radial-gradient(circle at 90% 10%,#3b1452 0,transparent 32%),var(--bg);color:var(--text);min-height:100vh}}
body:before{{content:"";position:fixed;inset:0;pointer-events:none;background-image:radial-gradient(circle,#fff 0 1px,transparent 1.4px);background-size:44px 44px;opacity:.09;animation:drift 26s linear infinite}}@keyframes drift{{to{{transform:translate3d(44px,44px,0)}}}}
a{{color:var(--cyan)}}.wrap{{width:min(1460px,94vw);margin:auto;padding:32px 0 70px}}.hero{{position:relative;overflow:hidden;border:1px solid var(--line);border-radius:30px;padding:42px;background:linear-gradient(135deg,rgba(77,232,255,.13),rgba(169,112,255,.16),rgba(255,99,216,.1));box-shadow:var(--shadow)}}
.hero:after{{content:"";position:absolute;width:420px;height:420px;border-radius:50%;right:-160px;top:-210px;background:conic-gradient(var(--cyan),var(--purple),var(--pink),var(--cyan));filter:blur(60px);opacity:.25;animation:spin 12s linear infinite}}@keyframes spin{{to{{transform:rotate(360deg)}}}}h1{{font-size:clamp(2.1rem,6vw,5.6rem);line-height:.94;margin:.1em 0;background:linear-gradient(90deg,#fff,var(--cyan),#e8c8ff,var(--pink));-webkit-background-clip:text;color:transparent;letter-spacing:-.06em}}h2{{margin-top:0;font-size:clamp(1.5rem,3vw,2.4rem)}}h3{{margin:.35rem 0}}.eyebrow{{letter-spacing:.18em;text-transform:uppercase;color:var(--cyan);font-weight:800}}.lede{{max-width:820px;color:#d8e2f6;font-size:1.12rem;line-height:1.7}}.hero-grid{{display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center}}.overall{{width:180px;height:180px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--cyan) calc(var(--p)*1%),rgba(255,255,255,.08) 0);position:relative;filter:drop-shadow(0 0 25px rgba(77,232,255,.22));animation:pulse 3s ease-in-out infinite}}.overall:before{{content:"";position:absolute;inset:13px;border-radius:50%;background:#0a1024}}.overall span{{position:relative;text-align:center;font-size:2.5rem;font-weight:900}}.overall small{{display:block;font-size:.75rem;color:var(--muted)}}@keyframes pulse{{50%{{transform:scale(1.025)}}}}
.metrics{{display:grid;grid-template-columns:repeat(6,minmax(120px,1fr));gap:14px;margin-top:22px}}.metric,.panel,.score-card,.week-card,.action-card{{border:1px solid var(--line);background:var(--panel);backdrop-filter:blur(12px);box-shadow:var(--shadow)}}.metric{{padding:18px;border-radius:18px}}.metric b{{display:block;font-size:1.55rem;color:#fff}}.metric span,.meta,small{{color:var(--muted)}}.panel{{border-radius:24px;padding:26px;margin-top:22px}}.score-grid{{display:grid;grid-template-columns:repeat(8,minmax(120px,1fr));gap:14px}}.score-card{{padding:16px;border-radius:20px;text-align:center}}.ring{{--p:0;width:92px;height:92px;border-radius:50%;margin:auto;display:grid;place-items:center;background:conic-gradient(var(--purple) calc(var(--p)*1%),rgba(255,255,255,.08) 0);position:relative}}.ring:before{{content:"";position:absolute;inset:8px;border-radius:50%;background:var(--panel2)}}.ring span{{position:relative;font-weight:900}}.bar-row{{margin:15px 0}}.bar-label{{display:flex;justify-content:space-between}}.bar{{height:10px;background:rgba(255,255,255,.07);border-radius:999px;overflow:hidden;margin:6px 0}}.bar i,.mini-meter i{{display:block;height:100%;width:var(--w);background:linear-gradient(90deg,var(--cyan),var(--purple),var(--pink));border-radius:inherit;animation:grow 1.2s ease both}}@keyframes grow{{from{{width:0}}}}.week-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}}.week-card{{padding:20px;border-radius:20px;transition:.25s transform,.25s border-color}}.week-card:hover,.action-card:hover{{transform:translateY(-4px);border-color:rgba(77,232,255,.55)}}.two{{display:grid;grid-template-columns:1fr 1fr;gap:20px}}ul{{line-height:1.65}}.pill{{display:inline-flex;padding:4px 9px;border-radius:999px;font-size:.74rem;font-weight:900;text-transform:uppercase;letter-spacing:.05em;background:rgba(255,255,255,.1)}}.critical{{background:rgba(255,45,85,.2);color:#ff8ca0}}.high{{background:rgba(255,105,120,.18);color:#ff9fac}}.medium{{background:rgba(255,209,102,.18);color:#ffe199}}.low{{background:rgba(77,232,255,.14);color:#8ff0ff}}.info{{background:rgba(169,112,255,.18);color:#ceb0ff}}.controls{{display:flex;gap:10px;flex-wrap:wrap;margin:12px 0}}input,select{{background:#0a1024;color:var(--text);border:1px solid var(--line);border-radius:12px;padding:11px 13px;min-width:220px}}.table-wrap{{overflow:auto;border:1px solid var(--line);border-radius:16px}}table{{width:100%;border-collapse:collapse;font-size:.88rem}}th,td{{padding:12px 14px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}}th{{position:sticky;top:0;background:#111833;z-index:2}}tr:hover td{{background:rgba(77,232,255,.035)}}code{{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;color:#c7f8ff;word-break:break-word}}.mini-meter{{width:90px;height:7px;background:rgba(255,255,255,.08);border-radius:999px;overflow:hidden;margin-bottom:5px}}.action-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:15px}}.action-card{{padding:22px;border-radius:20px;position:relative;transition:.25s}}.priority{{position:absolute;right:15px;top:14px;font-weight:900;color:var(--cyan)}}.done{{border-top:1px solid var(--line);padding-top:12px}}.footer{{text-align:center;color:var(--muted);padding-top:34px}}@media(max-width:980px){{.hero-grid,.two{{grid-template-columns:1fr}}.overall{{width:145px;height:145px}}.metrics{{grid-template-columns:repeat(2,1fr)}}.score-grid{{grid-template-columns:repeat(2,1fr)}}}}@media(prefers-reduced-motion:reduce){{*{{animation:none!important;scroll-behavior:auto!important}}}}
</style>
</head>
<body>
<div class="wrap">
<header class="hero">
<div class="hero-grid"><div><div class="eyebrow">NOVA · Fullstack Repository Studio</div><h1>{esc(repo['name'])}</h1><p class="lede">A complete offline audit of structure, sizes, languages, documentation, exercises, tests, naming risks, automation readiness and the safest next improvements.</p><p class="meta">Generated {esc(report['generated_at'])} · {esc(repo['scan_scope'])} · branch {esc(repo.get('branch') or 'unknown')} · HEAD {esc((repo.get('head') or 'unknown')[:12])}</p></div><div class="overall" style="--p:{score['overall']}"><span>{score['overall']:.0f}<small>/ 100 · {esc(score['grade'])}</small></span></div></div>
<div class="metrics"><div class="metric"><b>{stats['total_files']}</b><span>files</span></div><div class="metric"><b>{esc(stats['total_size_human'])}</b><span>working tree</span></div><div class="metric"><b>{stats['total_text_lines']:,}</b><span>text lines</span></div><div class="metric"><b>{stats['source_files']}</b><span>source files</span></div><div class="metric"><b>{stats['exercise_roots']}</b><span>exercise roots</span></div><div class="metric"><b>{stats['test_files']}</b><span>test files</span></div></div>
</header>
<section class="panel"><h2>Readiness percentages</h2><p class="meta">{esc(score['method'])}</p><div class="score-grid">{category_cards}</div></section>
<section class="panel"><h2>Strengths and risks</h2><div class="two"><div><h3>✅ Strengths</h3><ul>{strengths}</ul></div><div><h3>⚠️ Priority risks</h3><div>{severity_badges}</div><ul>{risks or '<li>No high-priority risks summarized.</li>'}</ul></div></div></section>
<section class="panel"><h2>Language distribution</h2>{language_rows}</section>
<section class="panel"><h2>Week/module map</h2><div class="week-grid">{week_cards}</div></section>
<section class="panel"><h2>Findings</h2><div class="controls"><input id="findingSearch" placeholder="Search findings…"><select id="severityFilter"><option value="">All severities</option><option>critical</option><option>high</option><option>medium</option><option>low</option><option>info</option></select></div><div class="table-wrap"><table id="findings"><thead><tr><th>Severity</th><th>Code</th><th>Finding</th><th>Path</th><th>Recommendation</th></tr></thead><tbody>{finding_rows}</tbody></table></div></section>
<section class="panel"><h2>Exercise and project catalog</h2><p class="meta">Search by project, path, goal or technology. The generated CSV and Markdown versions contain the same catalog.</p><div class="controls"><input id="exerciseSearch" placeholder="Search exercises…"></div><div class="table-wrap"><table id="exercises"><thead><tr><th>Exercise</th><th>Module</th><th>Kind</th><th>Goal</th><th>Tech</th><th>Completion</th><th>Quality</th><th>README / tests</th></tr></thead><tbody>{exercise_rows}</tbody></table></div></section>
<section class="panel"><h2>What to improve next</h2><div class="action-grid">{action_cards}</div></section>
<section class="panel"><h2>Rename and organization preview</h2><p class="meta">Nothing in this table is approved automatically. Manual-merge items are intentionally blocked from automatic application.</p><div class="table-wrap"><table><thead><tr><th>Action</th><th>Current path</th><th>Proposed path</th><th>Risk</th><th>Reason</th><th>Destination exists</th></tr></thead><tbody>{rename_rows}</tbody></table></div></section>
<section class="panel"><h2>Largest files</h2><div class="table-wrap"><table><thead><tr><th>Path</th><th>Size</th><th>Category</th><th>Language</th></tr></thead><tbody>{largest_rows}</tbody></table></div></section>
<footer class="footer">Generated locally by {esc(TOOL_NAME)} v{VERSION}. No existing source file was changed by the audit.</footer>
</div>
<script>
const META={payload};
function filterRows(tableId,inputId,selectId){{const table=document.getElementById(tableId);const input=document.getElementById(inputId);const select=selectId?document.getElementById(selectId):null;function run(){{const q=(input.value||'').toLowerCase();const sev=select?(select.value||'').toLowerCase():'';table.querySelectorAll('tbody tr').forEach(row=>{{const hay=row.dataset.search||row.innerText.toLowerCase();const okQ=!q||hay.includes(q);const okS=!sev||row.dataset.severity===sev;row.hidden=!(okQ&&okS)}})}}input.addEventListener('input',run);if(select)select.addEventListener('change',run)}}
filterRows('findings','findingSearch','severityFilter');filterRows('exercises','exerciseSearch');
</script>
</body></html>"""


WORKFLOW_TEMPLATE = """name: Repository Quality

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

jobs:
  quality:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Set up Python
        uses: actions/setup-python@v6
        with:
          python-version: '3.12'

      - name: Audit Python syntax
        shell: bash
        run: |
          python -m compileall -q Week1Python Week2OOP

      - name: Run NOVA repository audit
        if: hashFiles('tools/nova_fullstack_studio.py') != ''
        run: python tools/nova_fullstack_studio.py --repo . --output .nova-ci --ci

      - name: Set up Node
        if: hashFiles('package.json') != ''
        uses: actions/setup-node@v6
        with:
          node-version: 24
          package-manager-cache: false

      - name: Install root JavaScript tooling
        if: hashFiles('package.json') != ''
        shell: bash
        run: |
          if [ -f package-lock.json ]; then
            npm ci
          else
            echo "package-lock.json is missing; using npm install temporarily"
            npm install --ignore-scripts
          fi

      - name: Verify formatting
        if: hashFiles('package.json') != ''
        run: npm run format:check --if-present

      - name: Lint JavaScript and TypeScript
        if: hashFiles('package.json') != ''
        run: npm run lint --if-present

      - name: Run Node tests
        if: hashFiles('package.json') != ''
        run: npm test --if-present
"""

EDITORCONFIG_TEMPLATE = """root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,jsx,ts,tsx,json,css,scss,html,yml,yaml,md}]
indent_style = space
indent_size = 2

[*.py]
indent_style = space
indent_size = 4

[*.md]
trim_trailing_whitespace = false
"""

PYPROJECT_SUGGESTED = """[tool.pytest.ini_options]
testpaths = ["tests", "Week1Python", "Week2OOP"]
python_files = ["test_*.py", "*_test.py"]
addopts = "-ra"

[tool.ruff]
line-length = 100
target-version = "py311"
exclude = [".git", ".venv", "node_modules", "dist", "build"]

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B"]
ignore = ["E501"]
"""


def install_tool_copy(root: Path, console: Console, yes: bool) -> Path | None:
    """Copy this audited script into <repo>/tools without silently overwriting edits."""
    if not yes:
        raise SystemExit("--install-tool changes the repository. Re-run with --yes after reviewing the toolkit guide.")
    source = Path(__file__).resolve()
    target = (root / "tools" / source.name).resolve()
    target.parent.mkdir(parents=True, exist_ok=True)
    if source == target:
        console.info("NOVA tool is already running from the repository tools directory.")
        return target
    if target.exists():
        source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
        target_hash = hashlib.sha256(target.read_bytes()).hexdigest()
        if source_hash == target_hash:
            console.info("Repository NOVA tool is already up to date.")
            return target
        alternate = target.with_name(f"nova_fullstack_studio.v{VERSION}.py")
        shutil.copy2(source, alternate)
        console.warn(
            f"Existing {target.relative_to(root)} was not overwritten; wrote {alternate.relative_to(root)} for manual comparison."
        )
        return alternate
    shutil.copy2(source, target)
    console.ok(f"Installed NOVA tool: {target.relative_to(root)}")
    return target


def install_templates(root: Path, console: Console, yes: bool) -> list[Path]:
    if not yes:
        raise SystemExit("--install-templates changes the repository. Re-run with --yes after reviewing the toolkit guide.")
    targets = {
        root / ".github/workflows/quality.yml": WORKFLOW_TEMPLATE,
        root / ".editorconfig": EDITORCONFIG_TEMPLATE,
        root / "pyproject.nova.suggested.toml": PYPROJECT_SUGGESTED,
    }
    written: list[Path] = []
    for path, content in targets.items():
        if path.exists():
            console.warn(f"Skipped existing file: {path.relative_to(root)}")
            continue
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        written.append(path)
        console.ok(f"Installed template: {path.relative_to(root)}")
    return written


def write_missing_readmes(root: Path, report: dict[str, Any], console: Console, yes: bool) -> list[Path]:
    if not yes:
        raise SystemExit("--write-missing-readmes changes the repository. Re-run with --yes after reviewing exercise_catalog.md.")
    written: list[Path] = []
    for exercise in report["exercises"]:
        if exercise["has_readme"]:
            continue
        directory = safe_join(root, exercise["path"])
        if not directory.is_dir():
            continue
        readme = directory / "README.md"
        if readme.exists():
            continue
        run_lines = []
        for entry in exercise["entry_points"]:
            rel_entry = PurePosixPath(entry)
            local = rel_entry.relative_to(PurePosixPath(exercise["path"]))
            if local.suffix == ".py":
                run_lines.append(f"python {local.as_posix()}")
            elif local.suffix in {".html", ".htm"}:
                run_lines.append(f"# Open {local.as_posix()} in a browser or serve the repository locally")
            elif local.suffix == ".sql":
                run_lines.append(f"# Run {local.as_posix()} in PostgreSQL/pgAdmin against the required dataset")
            elif local.suffix in {".js", ".mjs", ".cjs"}:
                run_lines.append(f"node {local.as_posix()}")
            elif local.suffix == ".ts":
                run_lines.append(f"npx ts-node {local.as_posix()}")
        content = "\n".join([
            f"# {exercise['title']}", "",
            f"> {exercise['goal']}", "",
            "## Learning goals", "",
            f"- Practice: {', '.join(exercise['technologies']) or 'the concepts required by this exercise'}.",
            "- Validate normal inputs, edge cases, and failure states.",
            "- Be able to explain the solution without reading the code line-by-line.", "",
            "## How to run", "", "```text", *(run_lines or ["Add the exact run command after verifying the entry point."]), "```", "",
            "## Files", "", *[f"- `{PurePosixPath(path).relative_to(PurePosixPath(exercise['path']))}`" for path in exercise["source_files"]], "",
            "## Verification checklist", "",
            "- [ ] Main flow works", "- [ ] Invalid input is handled", "- [ ] Code is formatted", "- [ ] Tests or repeatable manual checks exist", "- [ ] README matches the current implementation", "",
            "## Next improvement", "", "Describe one concrete refactor, test, accessibility improvement, or product enhancement.", "",
        ])
        readme.write_text(content, encoding="utf-8")
        written.append(readme)
        console.ok(f"Created {readme.relative_to(root)}")
    return written


def apply_renames(root: Path, csv_path: Path, console: Console, yes: bool, allow_dirty: bool, update_links: bool) -> list[dict[str, str]]:
    if not yes:
        raise SystemExit("Rename application requires --yes. Review and mark rows approved=yes first.")
    if not csv_path.exists():
        raise SystemExit(f"Rename plan not found: {csv_path}")

    git_ok, _, _, _ = run_command(["git", "rev-parse", "--is-inside-work-tree"], root, 10)
    if git_ok == 0 and not allow_dirty:
        code, out, _, _ = run_command(["git", "status", "--porcelain=v1"], root, 15)
        if code == 0 and out.strip():
            raise SystemExit("Working tree is not clean. Commit/stash changes or add --allow-dirty after reviewing the risk.")

    with csv_path.open(newline="", encoding="utf-8-sig") as handle:
        rows = list(csv.DictReader(handle))
    approved = [r for r in rows if truthy(r.get("approved"))]
    if not approved:
        console.warn("No rows are marked approved=yes. Nothing was moved.")
        return []

    timestamp = utc_now().strftime("%Y%m%dT%H%M%SZ")
    backup_dir = root / ".nova" / "backups" / timestamp
    backup_dir.mkdir(parents=True, exist_ok=True)
    manifest: list[dict[str, str]] = []

    for row in approved:
        action = (row.get("action") or "").strip().lower()
        if action == "manual_merge":
            console.warn(f"Blocked manual merge: {row.get('old_path')} → {row.get('new_path')}")
            continue
        old_rel = (row.get("old_path") or "").strip().replace("\\", "/")
        new_rel = (row.get("new_path") or "").strip().replace("\\", "/")
        if not old_rel or not new_rel:
            console.warn("Skipped row with empty path.")
            continue
        old = safe_join(root, old_rel)
        new = safe_join(root, new_rel)
        if not old.exists():
            console.warn(f"Source missing: {old_rel}")
            continue
        if new.exists():
            console.warn(f"Destination exists; blocked: {new_rel}")
            continue
        new.parent.mkdir(parents=True, exist_ok=True)

        used_git = False
        if git_ok == 0:
            code, _, _, _ = run_command(["git", "ls-files", "--error-unmatch", old_rel], root, 15)
            if code == 0 or old.is_dir():
                code, _, err, _ = run_command(["git", "mv", "--", old_rel, new_rel], root, 60)
                if code == 0:
                    used_git = True
                else:
                    console.warn(f"git mv failed for {old_rel}: {err.strip()}")
        if not used_git:
            shutil.move(str(old), str(new))
        manifest.append({"old_path": old_rel, "new_path": new_rel, "method": "git mv" if used_git else "filesystem move"})
        console.ok(f"Moved {old_rel} → {new_rel}")

    if update_links and manifest:
        replacements = [(item["old_path"], item["new_path"]) for item in manifest]
        text_exts = SOURCE_EXTENSIONS | DOCUMENT_EXTENSIONS | DATA_EXTENSIONS | {".svg"}
        for path in root.rglob("*"):
            if not path.is_file() or path.suffix.lower() not in text_exts or any(part in SKIP_DIR_NAMES for part in path.relative_to(root).parts[:-1]):
                continue
            try:
                text = path.read_text(encoding="utf-8")
            except (OSError, UnicodeDecodeError):
                continue
            updated = text
            for old_rel, new_rel in replacements:
                updated = updated.replace(old_rel, new_rel)
                updated = updated.replace(urllib.parse.quote(old_rel), urllib.parse.quote(new_rel))
            if updated != text:
                path.write_text(updated, encoding="utf-8")
                console.info(f"Updated references in {path.relative_to(root)}")

    manifest_path = backup_dir / "rename_manifest.json"
    manifest_path.write_text(json.dumps({"generated_at": iso_now(), "moves": manifest}, indent=2), encoding="utf-8")
    console.ok(f"Rename manifest: {manifest_path.relative_to(root)}")
    return manifest


def replace_root_readme(root: Path, generated_path: Path, console: Console, yes: bool) -> Path:
    if not yes:
        raise SystemExit("--replace-readme requires --yes. Review README.nova.generated.md first.")
    if not generated_path.exists():
        raise SystemExit(f"Generated README does not exist: {generated_path}")
    target = root / "README.md"
    timestamp = utc_now().strftime("%Y%m%dT%H%M%SZ")
    backup = root / ".nova" / "backups" / timestamp / "README.md"
    backup.parent.mkdir(parents=True, exist_ok=True)
    if target.exists():
        shutil.copy2(target, backup)
        console.info(f"Backed up README to {backup.relative_to(root)}")
    shutil.copy2(generated_path, target)
    console.ok("Replaced README.md with reviewed generated copy.")
    return target


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="nova_fullstack_studio.py",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        description=textwrap.dedent(f"""
        {TOOL_NAME} v{VERSION}

        Examples:
          py -3 tools/nova_fullstack_studio.py --repo . --open
          py -3 tools/nova_fullstack_studio.py --repo . --run-tools --write-readme
          py -3 tools/nova_fullstack_studio.py --repo . --install-tool --install-templates --yes
          py -3 tools/nova_fullstack_studio.py --repo . --write-missing-readmes --yes
          py -3 tools/nova_fullstack_studio.py --repo . --apply-renames reports/nova/rename_plan.csv --yes --update-links
        """),
    )
    parser.add_argument("--repo", type=Path, default=Path.cwd(), help="Repository root. Default: current directory.")
    parser.add_argument("--output", type=Path, default=None, help="Report output directory. Default: <repo>/reports/nova.")
    parser.add_argument("--include-untracked", action="store_true", help="Include visible untracked files in addition to Git-tracked files.")
    parser.add_argument("--max-read-mb", type=int, default=10, help="Maximum text file size to parse. Default: 10 MB.")
    parser.add_argument("--run-tools", action="store_true", help="Run available compile/format/lint/test commands without installing dependencies.")
    parser.add_argument("--open", action="store_true", help="Open the generated HTML dashboard in the default browser.")
    parser.add_argument("--write-readme", action="store_true", help="Generate README.nova.generated.md inside the report directory.")
    parser.add_argument("--replace-readme", action="store_true", help="Replace root README.md with the generated copy; requires --write-readme --yes.")
    parser.add_argument("--write-missing-readmes", action="store_true", help="Create README.md only in detected exercise roots that lack one; requires --yes.")
    parser.add_argument("--install-tool", action="store_true", help="Copy this script into <repo>/tools without overwriting a different existing copy; requires --yes.")
    parser.add_argument("--install-templates", action="store_true", help="Install CI, .editorconfig, and suggested pyproject templates if absent; requires --yes.")
    parser.add_argument("--apply-renames", type=Path, default=None, help="Apply rows marked approved=yes in a rename-plan CSV; requires --yes.")
    parser.add_argument("--update-links", action="store_true", help="After approved moves, update exact textual path references.")
    parser.add_argument("--allow-dirty", action="store_true", help="Allow rename application with a dirty Git working tree. Use cautiously.")
    parser.add_argument("--yes", action="store_true", help="Confirm explicit source-changing operations.")
    parser.add_argument("--no-color", action="store_true", help="Disable ANSI terminal colors.")
    parser.add_argument("--no-animation", action="store_true", help="Disable terminal animation.")
    parser.add_argument("--ci", action="store_true", help="CI mode: no browser/colors/animation; exit non-zero on critical findings.")
    parser.add_argument("--version", action="version", version=f"%(prog)s {VERSION}")
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    root = args.repo.expanduser().resolve()
    if not root.exists() or not root.is_dir():
        print(f"Repository directory not found: {root}", file=sys.stderr)
        return 2
    output = (args.output if args.output is not None else root / "reports" / "nova")
    if not output.is_absolute():
        output = root / output
    output = output.resolve()

    console = Console(color=not args.no_color and not args.ci, animation=not args.no_animation and not args.ci)
    console.banner()
    console.info(f"Repository: {root}")
    console.info(f"Output: {output}")

    if args.apply_renames:
        plan = args.apply_renames if args.apply_renames.is_absolute() else root / args.apply_renames
        apply_renames(root, plan.resolve(), console, args.yes, args.allow_dirty, args.update_links)

    # Install explicitly requested baseline files before auditing so the generated
    # score and inventory reflect the repository state the user will review.
    if args.install_tool:
        install_tool_copy(root, console, args.yes)
    if args.install_templates:
        install_templates(root, console, args.yes)

    # Newly installed baseline files are not tracked until the user commits them.
    # Include visible files for this run so the report can still review what was just added.
    effective_include_untracked = args.include_untracked or args.install_tool or args.install_templates
    analyzer = RepoAnalyzer(root, output, console, effective_include_untracked, max_read_mb=max(1, args.max_read_mb))
    report = analyzer.analyze(run_tools=args.run_tools)
    writer = ReportWriter(output, root, console)
    paths = writer.write_all(report, write_readme=args.write_readme or args.replace_readme)

    source_changes_after_audit = False
    if args.write_missing_readmes:
        source_changes_after_audit = bool(write_missing_readmes(root, report, console, args.yes)) or source_changes_after_audit
    if args.replace_readme:
        replace_root_readme(root, paths["generated_readme"], console, args.yes)
        source_changes_after_audit = True
    if source_changes_after_audit:
        console.warn("Repository files changed after the audit. Run the safe audit once more to refresh every statistic and link check.")

    score = report["score"]
    critical_count = report["statistics"]["finding_severities"].get("critical", 0)
    console.heading("Result")
    console.ok(f"Readiness score: {score['overall']}/100 ({score['grade']})")
    console.info(f"Dashboard: {paths['html']}")
    console.info(f"Detailed audit: {paths['markdown']}")
    console.info(f"Rename plan: {paths['rename_csv']}")
    if args.open and not args.ci:
        try:
            webbrowser.open(paths["html"].as_uri())
            console.ok("Opened the dashboard in your default browser.")
        except Exception as exc:  # pragma: no cover - environment-specific
            console.warn(f"Could not open browser automatically: {exc}")

    if args.ci and critical_count:
        console.error(f"CI failed: {critical_count} critical finding(s).")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
