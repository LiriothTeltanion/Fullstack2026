#!/usr/bin/env python3
"""NOVA Ultimate Upgrade for the Fullstack2026 learning repository.

The updater is local-first and reversible. It creates a complete snapshot,
repairs known syntax/security/reproducibility problems, installs CI and tests,
normalizes safe paths, creates or refreshes README.md in every curriculum
folder, generates animated SVG status panels, and writes an offline readiness
dashboard. It never pushes or commits to GitHub.
"""
from __future__ import annotations

import argparse
import ast
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
import urllib.parse
import webbrowser
import zipfile
from collections import Counter
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Iterable, Sequence

VERSION = "2.0.0"
TOOL_NAME = "NOVA Ultimate Fullstack Upgrade"
MANAGED_START = "<!-- NOVA:ULTIMATE:START -->"
MANAGED_END = "<!-- NOVA:ULTIMATE:END -->"
HEALTH_START = "<!-- NOVA:HEALTH-CENTER:START -->"
HEALTH_END = "<!-- NOVA:HEALTH-CENTER:END -->"
SKIP_DIRS = {
    ".git", ".nova", "node_modules", "__pycache__", ".pytest_cache",
    ".mypy_cache", ".ruff_cache", ".venv", "venv", "env", "dist",
    "build", "coverage", ".next", ".turbo", "reports",
}
TEXT_EXTENSIONS = {
    ".py", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".html",
    ".htm", ".css", ".md", ".mdx", ".json", ".txt", ".sql", ".yml",
    ".yaml", ".toml", ".ini", ".cfg", ".bat", ".ps1",
}
SOURCE_EXTENSIONS = {".py", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".html", ".htm", ".css", ".sql"}
LANGUAGE_BY_EXT = {
    ".py": "Python", ".js": "JavaScript", ".mjs": "JavaScript", ".cjs": "JavaScript",
    ".ts": "TypeScript", ".tsx": "TypeScript", ".html": "HTML", ".htm": "HTML",
    ".css": "CSS", ".sql": "SQL",
}
TEST_RE = re.compile(r"(^|/)(tests?|__tests__)(/|$)|(^|/)test_[^/]+\.py$|\.(test|spec)\.(js|mjs|cjs|ts|tsx)$", re.I)
SECRET_ASSIGNMENT_RE = re.compile(r"(?i)\b(api[_-]?key|secret|token|password|passwd)\b\s*[:=]\s*['\"]([^'\"\s]{12,})['\"]")

SAFE_RENAMES = [
    ("Week1Python/Day3Dictionaries/Exercises/ExercisesXP+", "Week1Python/Day3Dictionaries/Exercises/ExercisesXPPlus"),
    ("Week6DatabasesAndNodejs/Day1IntroductionToDatabases/Exercises/ExercisesXP+", "Week6DatabasesAndNodejs/Day1IntroductionToDatabases/Exercises/ExercisesXPPlus"),
    ("Week2OOP/Day5MiniProject/DailyChallenge/OOPQuizz", "Week2OOP/Day5MiniProject/DailyChallenge/OOPQuiz"),
    ("Week3JavaScriptandDOM/Remote LearningJSAndDOM", "Week3JavaScriptandDOM/RemoteLearningJSAndDOM"),
    ("Week4AdvAsynchronousJavaScript/Day5Fetch&AsyncAwait", "Week4AdvAsynchronousJavaScript/Day5FetchAndAsyncAwait"),
    ("Week5MiniProjectAndTypeScript/Day1Miniproject/DailyChallange", "Week5MiniProjectAndTypeScript/Day1MiniProject/DailyChallenge"),
    ("Week5MiniProjectAndTypeScript/Day1Miniproject", "Week5MiniProjectAndTypeScript/Day1MiniProject"),
    ("Week6DatabasesAndNodejs/Day3DatabaseConcepts2/Exercises/ExercicesXPGold", "Week6DatabasesAndNodejs/Day3DatabaseConcepts2/Exercises/ExercisesXPGold"),
]
MERGE_RENAMES = [
    ("Week5MiniprojectAndTypeScript", "Week5MiniProjectAndTypeScript"),
    ("Week4AdvAsynchronousJavaScript/Day3HTTPandFormmethodGETandPOST", "Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST"),
]


@dataclass
class Change:
    kind: str
    path: str
    detail: str


@dataclass
class CommandResult:
    label: str
    command: list[str]
    returncode: int | None
    stdout: str
    stderr: str
    elapsed_seconds: float


@dataclass
class FolderStatus:
    path: str
    title: str
    goal: str
    files: int
    source_files: int
    tests: int
    readmes: int
    lines: int
    entry_points: list[str]
    syntax_errors: list[str]
    score: int
    good: list[str]
    bad: list[str]
    progress_asset: str


class Console:
    C = {"r": "\033[0m", "b": "\033[1m", "c": "\033[96m", "g": "\033[92m", "y": "\033[93m", "e": "\033[91m", "p": "\033[95m"}

    def __init__(self, color: bool = True) -> None:
        self.color = color and sys.stdout.isatty()
        if os.name == "nt":
            os.system("")

    def s(self, text: str, *codes: str) -> str:
        return text if not self.color else "".join(self.C[c] for c in codes) + text + self.C["r"]

    def banner(self) -> None:
        print(self.s("\n╔══════════════════════════════════════════════════════════════╗", "p", "b"))
        print(self.s("║       NOVA ULTIMATE FULLSTACK2026 UPGRADE · v2.0.0          ║", "c", "b"))
        print(self.s("╚══════════════════════════════════════════════════════════════╝\n", "p", "b"))

    def heading(self, text: str) -> None: print(self.s(f"\n▶ {text}", "c", "b"))
    def ok(self, text: str) -> None: print(self.s(f"  ✓ {text}", "g"))
    def warn(self, text: str) -> None: print(self.s(f"  ! {text}", "y"))
    def error(self, text: str) -> None: print(self.s(f"  ✗ {text}", "e"))
    def info(self, text: str) -> None: print(f"  • {text}")


def now() -> dt.datetime:
    return dt.datetime.now().astimezone()


def timestamp() -> str:
    return now().strftime("%Y%m%d-%H%M%S")


def iso_now() -> str:
    return now().replace(microsecond=0).isoformat()


def posix(value: Path | str) -> str:
    return str(value).replace("\\", "/")


def slugify(value: str) -> str:
    value = re.sub(r"([a-z0-9])([A-Z])", r"\1-\2", value)
    return re.sub(r"[^A-Za-z0-9]+", "-", value).strip("-").lower() or "root"


def human_title(value: str) -> str:
    value = value.replace("&", " And ").replace("+", " Plus ").replace("_", " ").replace("-", " ")
    value = re.sub(r"([a-z0-9])([A-Z])", r"\1 \2", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value[:1].upper() + value[1:] if value else "Repository"


def human_size(value: int) -> str:
    size = float(value)
    for unit in ("B", "KB", "MB", "GB"):
        if size < 1024 or unit == "GB":
            return f"{int(size)} B" if unit == "B" else f"{size:.1f} {unit}"
        size /= 1024
    return f"{size:.1f} GB"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(65536), b""):
            digest.update(block)
    return digest.hexdigest()


def read_text(path: Path) -> str | None:
    try:
        data = path.read_bytes()
    except OSError:
        return None
    if b"\x00" in data[:8192]:
        return None
    for enc in ("utf-8-sig", "utf-8", "cp1252"):
        try:
            return data.decode(enc)
        except UnicodeDecodeError:
            pass
    return None


def write_text(path: Path, content: str, changes: list[Change], detail: str) -> bool:
    normalized = content.replace("\r\n", "\n").rstrip() + "\n"
    previous = read_text(path) if path.exists() else None
    if previous is not None and previous.replace("\r\n", "\n").rstrip() + "\n" == normalized:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(normalized, encoding="utf-8", newline="\n")
    changes.append(Change("create" if previous is None else "modify", posix(path), detail))
    return True


def run(command: Sequence[str], cwd: Path, timeout: int = 180) -> CommandResult:
    started = dt.datetime.now().timestamp()
    try:
        done = subprocess.run(list(command), cwd=cwd, text=True, encoding="utf-8", errors="replace", capture_output=True, timeout=timeout, check=False)
        return CommandResult(" ".join(command), list(command), done.returncode, done.stdout, done.stderr, round(dt.datetime.now().timestamp() - started, 3))
    except (OSError, subprocess.TimeoutExpired) as exc:
        return CommandResult(" ".join(command), list(command), None, "", str(exc), round(dt.datetime.now().timestamp() - started, 3))


def is_repo_root(root: Path) -> bool:
    return (root / "Week1Python").is_dir() and any(p.is_dir() and re.fullmatch(r"Week\d+.*", p.name, re.I) for p in root.iterdir())


def skipped(path: Path, root: Path) -> bool:
    try:
        parts = path.relative_to(root).parts
    except ValueError:
        return True
    return any(part in SKIP_DIRS for part in parts)


def visible_files(root: Path) -> list[Path]:
    return sorted((p for p in root.rglob("*") if p.is_file() and not p.is_symlink() and not skipped(p, root)), key=lambda p: posix(p.relative_to(root)).lower())


def visible_dirs(root: Path) -> list[Path]:
    return sorted((p for p in root.rglob("*") if p.is_dir() and not p.is_symlink() and not skipped(p, root)), key=lambda p: (len(p.relative_to(root).parts), posix(p.relative_to(root)).lower()))


SNAPSHOT_SKIP_DIRS = {".git", ".nova", "node_modules", ".venv", "venv", "env"}

def snapshot_files(root: Path) -> list[Path]:
    result = []
    for path in root.rglob("*"):
        if not path.is_file() or path.is_symlink():
            continue
        parts = path.relative_to(root).parts
        if any(part in SNAPSHOT_SKIP_DIRS for part in parts[:-1]):
            continue
        result.append(path)
    return sorted(result, key=lambda p: posix(p.relative_to(root)).lower())


class SnapshotBackup:
    """A complete non-Git snapshot used by the built-in rollback command."""

    def __init__(self, root: Path, console: Console) -> None:
        self.root = root
        self.console = console
        self.id = timestamp()
        self.base = root / ".nova" / "backups" / self.id
        self.zip_path = self.base / "repository-before.zip"
        self.original_paths: list[str] = []

    def create(self) -> None:
        self.base.mkdir(parents=True, exist_ok=True)
        source_files = snapshot_files(self.root)
        self.original_paths = [posix(p.relative_to(self.root)) for p in source_files]
        with zipfile.ZipFile(self.zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            for path in source_files:
                archive.write(path, posix(path.relative_to(self.root)))
        metadata = {
            "backup_id": self.id,
            "created_at": iso_now(),
            "repository": str(self.root),
            "original_paths": self.original_paths,
            "snapshot_sha256": sha256(self.zip_path),
            "root_node_modules_existed": (self.root / "node_modules").exists(),
        }
        (self.base / "metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
        for name, command in {
            "git-status-before.txt": ["git", "status", "--short"],
            "git-diff-before.patch": ["git", "diff", "--binary"],
        }.items():
            result = run(command, self.root, 40)
            (self.base / name).write_text(result.stdout + result.stderr, encoding="utf-8")
        latest = self.root / ".nova" / "LATEST_BACKUP.txt"
        latest.parent.mkdir(parents=True, exist_ok=True)
        latest.write_text(self.id + "\n", encoding="utf-8")
        local_exclude = self.root / ".git" / "info" / "exclude"
        if local_exclude.exists():
            exclude_text = local_exclude.read_text(encoding="utf-8", errors="replace")
            if ".nova/" not in exclude_text.splitlines():
                local_exclude.write_text(exclude_text.rstrip() + "\n.nova/\n", encoding="utf-8")
        self.console.ok(f"Reversible backup: .nova/backups/{self.id}")

    def finalize(self, changes: list[Change], commands: list[CommandResult]) -> None:
        current = {posix(p.relative_to(self.root)) for p in snapshot_files(self.root)}
        original = set(self.original_paths)
        payload = {
            "backup_id": self.id,
            "completed_at": iso_now(),
            "created_paths": sorted(current - original),
            "deleted_paths": sorted(original - current),
            "changes": [asdict(item) for item in changes],
            "commands": [asdict(item) for item in commands],
        }
        (self.base / "update-manifest.json").write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    @staticmethod
    def resolve_id(root: Path, value: str) -> str:
        if value != "latest":
            return value
        marker = root / ".nova" / "LATEST_BACKUP.txt"
        if not marker.exists():
            raise FileNotFoundError("No latest backup marker exists.")
        return marker.read_text(encoding="utf-8").strip()

    @staticmethod
    def rollback(root: Path, backup_id: str, console: Console) -> None:
        backup_id = SnapshotBackup.resolve_id(root, backup_id)
        base = root / ".nova" / "backups" / backup_id
        snapshot = base / "repository-before.zip"
        manifest_path = base / "update-manifest.json"
        if not snapshot.exists():
            raise FileNotFoundError(f"Backup not found: {backup_id}")
        created: list[str] = []
        if manifest_path.exists():
            created = json.loads(manifest_path.read_text(encoding="utf-8")).get("created_paths", [])
        for relative in sorted(created, key=lambda x: len(Path(x).parts), reverse=True):
            path = root / relative
            if path.is_file() or path.is_symlink():
                path.unlink(missing_ok=True)
            elif path.is_dir():
                shutil.rmtree(path, ignore_errors=True)
        with zipfile.ZipFile(snapshot) as archive:
            archive.extractall(root)
        metadata_path = base / "metadata.json"
        original = set()
        if metadata_path.exists():
            original = set(json.loads(metadata_path.read_text(encoding="utf-8")).get("original_paths", []))
        metadata = {}
        if metadata_path.exists():
            metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
        if original:
            for path in snapshot_files(root):
                relative = posix(path.relative_to(root))
                if relative not in original:
                    path.unlink(missing_ok=True)
        if not metadata.get("root_node_modules_existed", False):
            shutil.rmtree(root / "node_modules", ignore_errors=True)
        all_dirs = [d for d in root.rglob("*") if d.is_dir() and ".git" not in d.relative_to(root).parts and ".nova" not in d.relative_to(root).parts]
        for directory in sorted(all_dirs, key=lambda p: len(p.parts), reverse=True):
            try:
                if not any(directory.iterdir()):
                    directory.rmdir()
            except OSError:
                pass
        console.ok(f"Restored backup {backup_id}.")


def git_mv(root: Path, source: Path, destination: Path) -> bool:
    """Never stage automatically; preserve the user's Git index exactly as it was."""
    return False


def move_path(root: Path, source: Path, destination: Path, changes: list[Change]) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    case_only = posix(source).lower() == posix(destination).lower() and posix(source) != posix(destination)
    if case_only:
        temporary = source.with_name(source.name + ".nova-case-temp")
        if temporary.exists():
            shutil.rmtree(temporary) if temporary.is_dir() else temporary.unlink()
        if not git_mv(root, source, temporary):
            shutil.move(str(source), str(temporary))
        if not git_mv(root, temporary, destination):
            shutil.move(str(temporary), str(destination))
    elif not git_mv(root, source, destination):
        shutil.move(str(source), str(destination))
    changes.append(Change("move", posix(source.relative_to(root)), f"moved to {posix(destination.relative_to(root))}"))


def merge_directories(root: Path, source: Path, destination: Path, changes: list[Change], conflicts: list[str]) -> None:
    destination.mkdir(parents=True, exist_ok=True)
    for src in sorted((p for p in source.rglob("*") if p.is_file()), key=lambda p: len(p.parts)):
        relative = src.relative_to(source)
        dest = destination / relative
        if not dest.exists():
            move_path(root, src, dest, changes)
        elif sha256(src) == sha256(dest):
            src.unlink()
            changes.append(Change("delete", posix(src.relative_to(root)), "identical duplicate removed"))
        else:
            conflicts.append(posix(src.relative_to(root)))
    for directory in sorted((d for d in source.rglob("*") if d.is_dir()), key=lambda p: len(p.parts), reverse=True):
        try:
            directory.rmdir()
        except OSError:
            pass
    try:
        source.rmdir()
    except OSError:
        pass


def update_text_references(root: Path, replacements: list[tuple[str, str]], changes: list[Change]) -> None:
    for path in visible_files(root):
        relative_path = posix(path.relative_to(root))
        if relative_path == "tools/nova_ultimate.py":
            continue
        if path.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        text = read_text(path)
        if text is None:
            continue
        updated = text
        for old, new in replacements:
            pairs = {
                old: new,
                old.replace(" ", "%20"): new.replace(" ", "%20"),
                old.replace("&", "%26"): new.replace("&", "%26"),
                old.replace("\\", "/"): new.replace("\\", "/"),
            }
            for before, after in pairs.items():
                updated = updated.replace(before, after)
        if updated != text:
            write_text(path, updated, changes, "updated references after path normalization")


def install_tool_files(root: Path, package_tools: Path, changes: list[Change]) -> None:
    target = root / "tools"
    target.mkdir(parents=True, exist_ok=True)
    for name in ("nova_ultimate.py", "nova_quality_gate.py", "check_typescript_syntax.mjs", "run_node_tests.mjs"):
        source = package_tools / name
        if source.exists():
            content = source.read_text(encoding="utf-8")
            write_text(target / name, content, changes, "installed NOVA v2 tool")
    for old in (root / "tools" / "nova_fullstack_studio.py", root / "RUN_NOVA_STUDIO.bat"):
        if old.exists():
            if old.is_file():
                old.unlink()
                changes.append(Change("delete", posix(old.relative_to(root)), "removed superseded NOVA v1 launcher/tool"))


def fix_python_syntax(root: Path, changes: list[Change]) -> list[str]:
    """Repair the five audited syntax defects without broad code rewriting."""
    fixed: list[str] = []
    split_print = re.compile(r'print\("\r?\n[ \t]*([^"\r\n]+)"\)')
    for path in [p for p in visible_files(root) if p.suffix.lower() == ".py"]:
        text = read_text(path)
        if text is None:
            continue
        try:
            ast.parse(text, filename=posix(path.relative_to(root)))
            syntax_bad = False
        except SyntaxError:
            syntax_bad = True
        updated = text
        if syntax_bad:
            updated = split_print.sub(lambda m: 'print("\\n' + m.group(1).lstrip() + '")', updated)
        if path.name == "test_timer.py":
            updated = updated.replace('self.assertTrue(r["ok")', 'self.assertTrue(r["ok"])')
        if updated != text:
            write_text(path, updated, changes, "fixed audited Python syntax")
            fixed.append(posix(path.relative_to(root)))
    return fixed


def sanitize_giphy_key(root: Path, changes: list[Change]) -> bool:
    path = root / "Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXPGold/giphyexercises.py"
    if not path.exists():
        return False
    text = read_text(path) or ""
    updated = text
    if "import os" not in updated:
        updated = updated.replace("from __future__ import annotations\n", "from __future__ import annotations\n\nimport os\n", 1)
    updated = re.sub(r'(?m)^API_KEY\s*=\s*["\'][^"\']+["\'].*$', 'API_KEY = os.getenv("GIPHY_API_KEY", "").strip()', updated)
    helper = '''\n\ndef _require_api_key() -> str:\n    """Return the configured API key or explain how to configure it."""\n    if not API_KEY:\n        raise RuntimeError("Missing GIPHY_API_KEY. Copy .env.example and configure the variable outside Git.")\n    return API_KEY\n'''
    if "def _require_api_key" not in updated:
        marker = 'BASE_TRENDING = "https://api.giphy.com/v1/gifs/trending"\n'
        updated = updated.replace(marker, marker + helper, 1)
    updated = updated.replace("api_key={API_KEY}", "api_key={_require_api_key()}")
    if updated != text:
        write_text(path, updated, changes, "removed hardcoded Giphy credential")
        return True
    return False


def sanitize_currency_keys(root: Path, changes: list[Change]) -> list[str]:
    changed: list[str] = []
    for path in root.rglob("*CurrencyConverter*/index.html"):
        if skipped(path, root) or not path.is_file():
            continue
        text = read_text(path) or ""
        declaration = re.compile(r'(?i)((?:const|let|var)\s+(?:API_KEY|apiKey)\s*=\s*)["\'][^"\']{12,}["\']')
        updated = declaration.sub(lambda m: m.group(1) + '(window.NOVA_CONFIG?.CURRENCY_API_KEY ?? "")', text)
        assignment = re.compile(r'(?im)^(\s*(?:API_KEY|apiKey)\s*=\s*)["\'][^"\']{12,}["\']')
        updated = assignment.sub(lambda m: m.group(1) + '(window.NOVA_CONFIG?.CURRENCY_API_KEY ?? "")', updated)
        if updated != text:
            if "config.js" not in updated:
                script_tag = '  <script src="./config.js"></script>\n'
                if "</head>" in updated:
                    updated = updated.replace("</head>", script_tag + "</head>", 1)
                else:
                    updated = script_tag + updated
            write_text(path, updated, changes, "removed browser API key literal")
            example = path.parent / "config.example.js"
            write_text(example, 'window.NOVA_CONFIG = {\n  CURRENCY_API_KEY: "replace-me",\n};\n', changes, "added local browser config example")
            changed.append(posix(path.relative_to(root)))
    return changed


def write_security_files(root: Path, changes: list[Change]) -> None:
    env = """# Copy to .env locally. Never commit the real .env file.\nGIPHY_API_KEY=replace-me\n\n# Browser-only projects should prefer a backend proxy.\n# For the legacy Currency Converter, copy config.example.js to config.js locally.\n"""
    write_text(root / ".env.example", env, changes, "added environment template")
    security = f"""# Security Policy\n\n## Credential handling\n\n- Never commit `.env`, `config.js`, API keys, tokens, or passwords.\n- The upgrade removes known literals from the current working tree.\n- **Rotate any credential that was previously committed.** Removing the latest line does not invalidate the old key or erase Git history.\n- Prefer a small backend proxy for browser projects that require private credentials; browser JavaScript cannot keep a secret from users.\n- Store CI credentials in GitHub Actions Secrets and grant the workflow only the permissions it needs.\n\n## Reporting\n\nOpen a private security report to the repository owner rather than posting an active credential in a public issue.\n\n_Last updated by NOVA Ultimate v{VERSION}._\n"""
    write_text(root / "SECURITY.md", security, changes, "added credential and reporting guidance")


def cleanup_archives(root: Path, changes: list[Change]) -> list[str]:
    removed: list[str] = []
    for path in sorted(root.glob("Week*.zip")):
        if path.is_file():
            relative = posix(path.relative_to(root))
            path.unlink()
            changes.append(Change("delete", relative, "removed redundant source archive after snapshot"))
            removed.append(relative)
    return removed


def normalize_paths(root: Path, changes: list[Change]) -> tuple[list[tuple[str, str]], list[str]]:
    replacements: list[tuple[str, str]] = []
    conflicts: list[str] = []
    for old, new in MERGE_RENAMES:
        source, destination = root / old, root / new
        if not source.exists():
            continue
        same_physical = destination.exists() and source.resolve() == destination.resolve()
        if same_physical:
            move_path(root, source, destination, changes)
        elif destination.exists():
            merge_directories(root, source, destination, changes, conflicts)
        else:
            move_path(root, source, destination, changes)
        replacements.append((old, new))
    # Longest paths first so a parent rename does not invalidate a child source.
    for old, new in sorted(SAFE_RENAMES, key=lambda pair: len(Path(pair[0]).parts), reverse=True):
        source, destination = root / old, root / new
        if not source.exists():
            continue
        same_physical = destination.exists() and source.resolve() == destination.resolve()
        if same_physical:
            move_path(root, source, destination, changes)
        elif destination.exists():
            if source.is_dir() and destination.is_dir():
                merge_directories(root, source, destination, changes, conflicts)
            elif source.is_file() and destination.is_file() and sha256(source) == sha256(destination):
                source.unlink()
                changes.append(Change("delete", old, "removed identical duplicate"))
            else:
                conflicts.append(old)
                continue
        else:
            move_path(root, source, destination, changes)
        replacements.append((old, new))
    if replacements:
        update_text_references(root, replacements, changes)
    return replacements, conflicts


def update_gitignore(root: Path, changes: list[Change]) -> None:
    path = root / ".gitignore"
    text = read_text(path) or ""
    kept = []
    for line in text.splitlines():
        stripped = line.strip()
        if stripped in {"package-lock.json", "pnpm-lock.yaml", "yarn.lock"}:
            continue
        kept.append(line.rstrip())
    additions = [
        "", "# NOVA local state (reports are intentionally versionable)", ".nova/",
        "", "# Local secrets/configuration", ".env", ".env.*", "!.env.example", "**/config.js",
        "", "# Redundant curriculum archives", "Week*.zip",
    ]
    combined = "\n".join(kept).rstrip() + "\n" + "\n".join(additions).strip() + "\n"
    write_text(path, combined, changes, "allow lockfile and ignore local NOVA/security files")


def update_gitattributes(root: Path, changes: list[Change]) -> None:
    path = root / ".gitattributes"
    text = read_text(path) or "* text=auto\n"
    updated = re.sub(r"(?m)^\*\.svg\s+binary\s*$", "*.svg text eol=lf", text)
    if "*.svg text eol=lf" not in updated:
        updated += "\n*.svg text eol=lf\n"
    write_text(path, updated, changes, "make animated SVG assets reviewable as text")


def update_eslint(root: Path, changes: list[Change]) -> None:
    path = root / ".eslintrc.cjs"
    if not path.exists():
        return
    text = read_text(path) or ""
    updated = text.replace("Week5MiniprojectAndTypescript", "Week5MiniProjectAndTypeScript")
    updated = updated.replace("Week5MiniprojectAndTypeScript", "Week5MiniProjectAndTypeScript")
    if updated != text:
        write_text(path, updated, changes, "fixed canonical Week5 ESLint paths")


def write_editorconfig(root: Path, changes: list[Change]) -> None:
    content = """root = true\n\n[*]\ncharset = utf-8\nend_of_line = lf\ninsert_final_newline = true\ntrim_trailing_whitespace = true\nindent_style = space\nindent_size = 2\n\n[*.py]\nindent_size = 4\n\n[*.md]\ntrim_trailing_whitespace = false\n\n[Makefile]\nindent_style = tab\n"""
    write_text(root / ".editorconfig", content, changes, "added cross-editor whitespace rules")


def write_pyproject(root: Path, changes: list[Change]) -> None:
    content = """[tool.pytest.ini_options]\ntestpaths = [\"tests/python\"]\npython_files = [\"test_*.py\"]\naddopts = \"-ra\"\n\n[tool.ruff]\ntarget-version = \"py311\"\nline-length = 100\nextend-exclude = [\".nova\", \"reports\", \"node_modules\"]\n\n[tool.ruff.lint]\nselect = [\"E4\", \"E7\", \"E9\", \"F\", \"I\"]\n"""
    write_text(root / "pyproject.toml", content, changes, "added Python test/tool defaults")


def update_package_json(root: Path, changes: list[Change]) -> None:
    path = root / "package.json"
    if path.exists():
        try:
            payload = json.loads(path.read_text(encoding="utf-8-sig"))
        except json.JSONDecodeError:
            payload = {}
    else:
        payload = {}
    payload.setdefault("name", "fullstack2026")
    payload.setdefault("version", "1.0.0")
    payload["private"] = True
    payload["type"] = "module"
    payload["engines"] = {"node": ">=22"}
    scripts = payload.setdefault("scripts", {})
    scripts.update({
        "audit": "python tools/nova_ultimate.py --repo . --audit --no-open",
        "quality": "python tools/nova_quality_gate.py --repo . --strict",
        "syntax": "python tools/nova_quality_gate.py --repo . --syntax-only --strict",
        "test:python": "python -m unittest discover -s tests/python -p \"test_*.py\" -v",
        "test:js": "node tools/run_node_tests.mjs .",
        "test": "npm run test:js && npm run test:python",
        "readme:generate": "python tools/nova_ultimate.py --repo . --readmes all --apply --yes --skip-fixes --skip-npm --no-open",
        "dev": "python -m http.server 8000",
        "build": "python tools/nova_quality_gate.py --repo . --strict",
    })
    # Keep existing lint/format commands if present; the quality gate checks legacy syntax separately.
    scripts.setdefault("lint", 'eslint "Week*/**/*.{js,ts}"')
    scripts.setdefault("lint:fix", 'eslint "Week*/**/*.{js,ts}" --fix')
    scripts.setdefault("format", 'prettier --write "Week*/**/*.{js,ts,html,css,md}"')
    scripts.setdefault("format:check", 'prettier --check "Week*/**/*.{js,ts,html,css,md}"')
    deps = payload.setdefault("devDependencies", {})
    deps.setdefault("typescript", "^5.9.0")
    deps.setdefault("eslint", "^8.57.0")
    deps.setdefault("prettier", "^3.3.3")
    deps.setdefault("@typescript-eslint/eslint-plugin", "^6.21.0")
    deps.setdefault("@typescript-eslint/parser", "^6.21.0")
    deps.setdefault("eslint-config-prettier", "^9.1.0")
    write_text(path, json.dumps(payload, indent=2, ensure_ascii=False) + "\n", changes, "installed reproducible quality/test scripts")


def write_ci(root: Path, changes: list[Change]) -> None:
    workflow = """name: NOVA Quality Gate\n\non:\n  push:\n    branches: [main]\n  pull_request:\n  workflow_dispatch:\n\npermissions:\n  contents: read\n\nconcurrency:\n  group: nova-quality-${{ github.workflow }}-${{ github.ref }}\n  cancel-in-progress: true\n\njobs:\n  validate:\n    name: Syntax, security, docs and tests\n    runs-on: ubuntu-latest\n    timeout-minutes: 20\n    steps:\n      - name: Checkout repository\n        uses: actions/checkout@v7\n\n      - name: Set up Python\n        uses: actions/setup-python@v6\n        with:\n          python-version: \"3.13\"\n\n      - name: Set up Node.js\n        uses: actions/setup-node@v6\n        with:\n          node-version: \"24\"\n          cache: npm\n\n      - name: Install JavaScript tooling\n        run: npm ci\n\n      - name: Whole-repository quality gate\n        run: python tools/nova_quality_gate.py --repo . --strict\n\n      - name: Python anchor tests\n        run: python -m unittest discover -s tests/python -p \"test_*.py\" -v\n\n      - name: JavaScript and TypeScript anchor tests\n        run: npm run test:js\n"""
    write_text(root / ".github/workflows/quality.yml", workflow, changes, "added read-only CI quality gate")
    dependabot = """version: 2\nupdates:\n  - package-ecosystem: npm\n    directory: /\n    schedule:\n      interval: monthly\n    open-pull-requests-limit: 5\n  - package-ecosystem: github-actions\n    directory: /\n    schedule:\n      interval: monthly\n    open-pull-requests-limit: 5\n"""
    write_text(root / ".github/dependabot.yml", dependabot, changes, "added monthly dependency updates")


def write_root_launchers(root: Path, changes: list[Change]) -> None:
    update = r'''@echo off
setlocal
cd /d "%~dp0"
py -3 tools\nova_ultimate.py --repo . --apply --yes --readmes all --delete-archives --run-tests --open
if errorlevel 1 python tools\nova_ultimate.py --repo . --apply --yes --readmes all --delete-archives --run-tests --open
pause
'''
    audit = r'''@echo off
setlocal
cd /d "%~dp0"
py -3 tools\nova_ultimate.py --repo . --audit --open
if errorlevel 1 python tools\nova_ultimate.py --repo . --audit --open
pause
'''
    rollback = r'''@echo off
setlocal
cd /d "%~dp0"
py -3 tools\nova_ultimate.py --repo . --rollback latest
if errorlevel 1 python tools\nova_ultimate.py --repo . --rollback latest
pause
'''
    write_text(root / "NOVA_UPDATE.bat", update, changes, "added one-click repository updater")
    write_text(root / "NOVA_AUDIT.bat", audit, changes, "added one-click audit")
    write_text(root / "NOVA_ROLLBACK.bat", rollback, changes, "added one-click rollback")


def write_anchor_tests(root: Path, changes: list[Change]) -> None:
    loader = r'''from __future__ import annotations
import importlib.util
import sys
import types
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

def find_one(pattern: str) -> Path:
    matches = sorted(ROOT.glob(pattern))
    if not matches:
        raise FileNotFoundError(pattern)
    return matches[0]

def load_file(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise ImportError(path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module

def load_package_module(package_name: str, directory: Path, module_name: str):
    package = types.ModuleType(package_name)
    package.__path__ = [str(directory)]
    sys.modules[package_name] = package
    return load_file(f"{package_name}.{module_name}", directory / f"{module_name}.py")
'''
    write_text(root / "tests/python/_loader.py", loader, changes, "added dynamic test loader")

    tictactoe = r'''import unittest
from _loader import find_one, load_file

mod = load_file("nova_tictactoe", find_one("Week*/**/TicTacToe/tictactoe.py"))

class TicTacToeTests(unittest.TestCase):
    def test_new_board_and_move_parsing(self):
        board = mod.new_board()
        self.assertEqual(board, [[" "] * 3 for _ in range(3)])
        self.assertEqual(mod.parse_move("2 3"), (1, 2))
        self.assertEqual(mod.validate_move(board, "1 1"), (0, 0))

    def test_rows_columns_diagonals_and_tie(self):
        self.assertTrue(mod.check_win([["X", "X", "X"], [" "] * 3, [" "] * 3], "X"))
        self.assertTrue(mod.check_win([["O", "X", "X"], ["O", "X", "X"], ["O", " ", " "]], "O"))
        self.assertTrue(mod.check_win([["X", "O", "O"], ["O", "X", "X"], ["O", "O", "X"]], "X"))
        self.assertTrue(mod.is_tie([["X", "O", "X"], ["X", "O", "O"], ["O", "X", "X"]]))

    def test_invalid_move(self):
        with self.assertRaises(ValueError):
            mod.parse_move("one")
        board = mod.new_board()
        board[0][0] = "X"
        with self.assertRaises(ValueError):
            mod.validate_move(board, "1 1")

if __name__ == "__main__":
    unittest.main()
'''
    write_text(root / "tests/python/test_tictactoe.py", tictactoe, changes, "added Tic-Tac-Toe unit tests")

    circle = r'''import math
import unittest
from _loader import find_one, load_file

mod = load_file("nova_circle", find_one("Week*/**/DailyChallenge/Circle/circle.py"))

class CircleTests(unittest.TestCase):
    def test_radius_diameter_and_area(self):
        circle = mod.Circle(radius=3)
        self.assertEqual(circle.diameter, 6)
        self.assertAlmostEqual(circle.area(), math.pi * 9)
        self.assertEqual(mod.Circle(diameter=8).radius, 4)

    def test_add_compare_sort(self):
        a, b = mod.Circle(radius=2), mod.Circle(radius=5)
        self.assertEqual((a + b).radius, 7)
        self.assertLess(a, b)
        self.assertEqual([c.radius for c in sorted([b, a])], [2, 5])

    def test_rejects_invalid_values(self):
        with self.assertRaises(ValueError):
            mod.Circle(radius=0)
        with self.assertRaises(ValueError):
            mod.Circle()

if __name__ == "__main__":
    unittest.main()
'''
    write_text(root / "tests/python/test_circle.py", circle, changes, "added Circle unit tests")

    hangman = r'''import unittest
from _loader import find_one, load_package_module

source = find_one("Week*/**/Hangman/src/game.py").parent
mod = load_package_module("nova_hangman", source, "game")

class HangmanTests(unittest.TestCase):
    def test_hit_repeat_and_win(self):
        game = mod.HangmanGame("aba")
        self.assertEqual(game.guess("a"), "hit")
        self.assertEqual(game.guess("a"), "repeat")
        self.assertFalse(game.is_won())
        self.assertEqual(game.guess("b"), "hit")
        self.assertTrue(game.is_won())

    def test_miss_and_validation(self):
        game = mod.HangmanGame("python")
        self.assertEqual(game.guess("z"), "miss")
        self.assertEqual(game.wrong, 1)
        with self.assertRaises(ValueError):
            game.guess("12")

if __name__ == "__main__":
    unittest.main()
'''
    write_text(root / "tests/python/test_hangman.py", hangman, changes, "added Hangman state tests")

    timer = r'''import sys
import types
import unittest
from unittest import mock
from _loader import find_one, load_file

fake_requests = types.ModuleType("requests")
fake_requests.Session = lambda: None
sys.modules.setdefault("requests", fake_requests)
mod = load_file("nova_timer", find_one("Week*/**/DailyChallenge/Modules/timer.py"))

class MockResponse:
    status_code = 200
    def raise_for_status(self): return None
    def iter_content(self, chunk_size=65536):
        yield b"a" * 10
        yield b"b" * 5
    def __enter__(self): return self
    def __exit__(self, exc_type, exc, tb): return False

class MockSession:
    def __enter__(self): return self
    def __exit__(self, exc_type, exc, tb): return False
    def get(self, *args, **kwargs): return MockResponse()

class TimerTests(unittest.TestCase):
    @mock.patch.object(mod.requests, "Session", return_value=MockSession())
    def test_measure_and_benchmark(self, _):
        result = mod.measure_load_time("example.com")
        self.assertTrue(result["ok"])
        self.assertEqual(result["bytes"], 15)
        report = mod.benchmark(["example.com"], attempts=2)
        self.assertEqual(report["https://example.com"]["bytes_samples"], [15, 15])

if __name__ == "__main__":
    unittest.main()
'''
    write_text(root / "tests/python/test_timer.py", timer, changes, "added isolated Timer tests")

    layout = r'''import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

class RepositoryLayoutTests(unittest.TestCase):
    def test_quality_infrastructure(self):
        self.assertTrue((ROOT / ".github/workflows/quality.yml").exists())
        self.assertTrue((ROOT / "tools/nova_quality_gate.py").exists())
        package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
        for script in ("quality", "test:python", "test:js", "audit"):
            self.assertIn(script, package["scripts"])

    def test_no_week_archives(self):
        self.assertEqual(list(ROOT.glob("Week*.zip")), [])

    def test_every_curriculum_directory_has_readme(self):
        missing = []
        for week in (p for p in ROOT.iterdir() if p.is_dir() and p.name.lower().startswith("week")):
            for directory in [week, *[p for p in week.rglob("*") if p.is_dir()]]:
                if any(part in {"node_modules", "__pycache__", ".nova"} for part in directory.parts):
                    continue
                if any(directory.iterdir()) and not any(p.is_file() and p.name.lower() == "readme.md" for p in directory.iterdir()):
                    missing.append(str(directory.relative_to(ROOT)))
        self.assertEqual(missing, [], "Missing README.md: " + ", ".join(missing[:20]))

if __name__ == "__main__":
    unittest.main()
'''
    write_text(root / "tests/python/test_repository_layout.py", layout, changes, "added repository contract tests")

    js_math = r'''import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
function findMath(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", ".nova", "node_modules", "reports"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findMath(full);
      if (found) return found;
    } else if (entry.name === "math.js" && full.includes("exercise-5-math-app")) return full;
  }
  return null;
}

test("CommonJS math helpers", () => {
  const target = findMath(ROOT);
  assert.ok(target, "math.js exercise not found");
  const require = createRequire(import.meta.url);
  const { add, multiply } = require(target);
  assert.equal(add(2, 3), 5);
  assert.equal(multiply(4, 5), 20);
});
'''
    write_text(root / "tests/js/math_helpers.test.mjs", js_math, changes, "added Node math tests")

    js_repo = r'''import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("repository quality infrastructure exists", () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  assert.ok(packageJson.scripts.quality);
  assert.ok(packageJson.scripts["test:python"]);
  assert.ok(fs.existsSync(path.join(ROOT, ".github", "workflows", "quality.yml")));
});

test("redundant Week ZIPs are absent", () => {
  const archives = fs.readdirSync(ROOT).filter(name => /^Week.*\.zip$/i.test(name));
  assert.deepEqual(archives, []);
});
'''
    write_text(root / "tests/js/repository_health.test.mjs", js_repo, changes, "added Node repository tests")

    js_ts = r'''import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
let ts = null;
try {
  const module = await import("typescript");
  ts = module.default || module;
} catch {
  // npm install supplies TypeScript in normal runs and CI.
}
function walk(dir, output = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", ".nova", "node_modules", "reports"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else if (/\.tsx?$/i.test(entry.name)) output.push(full);
  }
  return output;
}

test("all TypeScript files transpile without syntax diagnostics", (context) => {
  if (!ts) {
    context.skip("TypeScript is not installed; run npm install.");
    return;
  }
  const failures = [];
  for (const file of walk(ROOT)) {
    const source = fs.readFileSync(file, "utf8");
    const result = ts.transpileModule(source, {
      fileName: file,
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
      reportDiagnostics: true,
    });
    for (const diagnostic of result.diagnostics || []) {
      if (diagnostic.category === ts.DiagnosticCategory.Error) {
        failures.push(`${path.relative(ROOT, file)}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`);
      }
    }
  }
  assert.deepEqual(failures, []);
});
'''
    write_text(root / "tests/js/typescript_syntax.test.mjs", js_ts, changes, "added TypeScript syntax tests")


def infer_goal(directory: Path) -> str:
    text = posix(directory).lower()
    rules = [
        (("hangman",), "Build and test a state-driven word game with input validation and reusable domain logic."),
        (("tictactoe", "tic-tac-toe"), "Model a two-player grid game with deterministic move, win, tie, and replay behavior."),
        (("database", "sql", "dvdrental"), "Practice relational modeling, safe queries, joins, constraints, and persistent data workflows."),
        (("node", "npm"), "Practice Node.js modules, package management, file operations, and testable server-side JavaScript."),
        (("typescript", "union", "typeguard"), "Use TypeScript types, interfaces, classes, unions, and guards to make domain logic safer."),
        (("async", "promise", "fetch", "http", "api"), "Build resilient asynchronous flows with HTTP requests, loading states, validation, and error handling."),
        (("dom", "javascript", "browser"), "Create interactive browser experiences with JavaScript, DOM events, accessibility, and responsive behavior."),
        (("dailychallenge",), "Solve an independent daily challenge that reinforces the current lesson through focused problem solving."),
        (("exercisesxpninja",), "Extend the lesson with advanced algorithmic and creative problem-solving challenges."),
        (("exercisesxpgold",), "Reinforce the lesson with intermediate scenarios, validation, and stronger edge-case handling."),
        (("exercisesxpplus",), "Practice a distinct additional XP tier without merging it into the standard XP exercises."),
        (("exercisesxp",), "Complete the standard exercises required to master the lesson's core concepts."),
        (("exercises",), "Organize practical exercises with clear goals, execution paths, validation, and improvement guidance."),
        (("inheritance", "polymorphism", "encapsulation", "oop"), "Apply object-oriented design through classes, inheritance, encapsulation, modules, and reusable models."),
        (("function",), "Decompose problems into focused functions with clear parameters, return values, validation, and reusable behavior."),
        (("dictionary",), "Model and transform key-value data using dictionaries, nested structures, validation, and practical algorithms."),
        (("list", "iterat"), "Process collections with lists, loops, formatting, validation, and small business rules."),
        (("python",), "Strengthen Python fundamentals through progressive exercises, challenges, and complete console projects."),
    ]
    for keys, goal in rules:
        if any(key in text for key in keys):
            return goal
    return "Document the purpose, contents, execution path, quality status, and next improvements for this learning folder."


def folder_files(directory: Path, root: Path) -> list[Path]:
    return [p for p in directory.rglob("*") if p.is_file() and not p.is_symlink() and not skipped(p, root)]


def syntax_errors_for(paths: Iterable[Path], root: Path) -> list[str]:
    errors: list[str] = []
    for path in paths:
        if path.suffix.lower() != ".py":
            continue
        text = read_text(path)
        if text is None:
            continue
        try:
            ast.parse(text, filename=posix(path.relative_to(root)))
        except SyntaxError as exc:
            errors.append(f"{posix(path.relative_to(root))}:{exc.lineno} {exc.msg}")
    return errors


def entry_points(paths: Iterable[Path], root: Path) -> list[str]:
    priority = {"index.html", "main.py", "app.py", "server.py", "main.js", "app.js", "script.js", "package.json"}
    items = [posix(p.relative_to(root)) for p in paths if p.name.lower() in priority]
    if not items:
        items = [posix(p.relative_to(root)) for p in paths if p.suffix.lower() in {".py", ".html", ".js", ".ts", ".sql"}][:3]
    return sorted(items)[:6]


def folder_status(directory: Path, root: Path, asset_rel: str) -> FolderStatus:
    paths = folder_files(directory, root)
    sources = [p for p in paths if p.suffix.lower() in SOURCE_EXTENSIONS]
    tests = [p for p in paths if TEST_RE.search(posix(p.relative_to(root)))]
    readmes = [p for p in paths if p.name.lower() == "readme.md"]
    lines = 0
    for path in paths:
        text = read_text(path)
        if text is not None:
            lines += len(text.splitlines())
    errors = syntax_errors_for(paths, root)
    entries = entry_points(paths, root)
    portable = all(not re.search(r"[&+ ]", part) for part in directory.relative_to(root).parts)
    no_source = len(sources) == 0
    score = 20 + (35 if not errors else max(0, 35 - 12 * len(errors)))
    score += 20 if tests or no_source else 0
    score += 15 if entries or no_source else 0
    score += 10 if portable else 3
    score = max(0, min(100, score))
    good = ["README documentation is generated and repeatable."]
    bad: list[str] = []
    if sources:
        good.append(f"Contains {len(sources)} source file(s) across practical exercises or projects.")
    else:
        good.append("Acts as an organizational index for its child folders.")
    if not errors:
        good.append("No Python syntax error was detected in this folder tree.")
    else:
        bad.append(f"{len(errors)} Python syntax error(s) still require attention.")
    if tests:
        good.append(f"Includes {len(tests)} automated test file(s).")
    elif sources:
        bad.append("No local unit test is present yet; repository-wide syntax checks still cover the sources.")
    if entries:
        good.append("A likely runnable entry point was detected.")
    elif sources:
        bad.append("The main execution path is not obvious from conventional filenames.")
    if not portable:
        bad.append("The path still contains spaces or shell-sensitive characters.")
    title = "Fullstack2026" if directory == root else human_title(directory.name)
    relative = "." if directory == root else posix(directory.relative_to(root))
    return FolderStatus(relative, title, infer_goal(directory), len(paths), len(sources), len(tests), max(1, len(readmes)), lines, entries, errors, score, good, bad, asset_rel)


def status_palette(score: float) -> tuple[str, str, str]:
    if score >= 85:
        return "#22c55e", "#86efac", "Ready"
    if score >= 70:
        return "#06b6d4", "#67e8f9", "Solid"
    if score >= 50:
        return "#f59e0b", "#fcd34d", "Developing"
    return "#ef4444", "#fca5a5", "Needs attention"


def write_shared_assets(root: Path, changes: list[Change]) -> None:
    assets = root / "assets/readme"
    banner = '''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="260" viewBox="0 0 1200 260" role="img" aria-labelledby="title desc">
<title id="title">NOVA Ultimate Fullstack2026</title><desc id="desc">Animated cosmic banner for the Fullstack2026 learning portfolio.</desc>
<defs><linearGradient id="bg" x1="0" x2="1"><stop stop-color="#070b22"/><stop offset=".5" stop-color="#25145b"/><stop offset="1" stop-color="#071b32"/></linearGradient><linearGradient id="beam" x1="0" x2="1"><stop stop-color="#22d3ee"><animate attributeName="stop-color" values="#22d3ee;#a78bfa;#22d3ee" dur="6s" repeatCount="indefinite"/></stop><stop offset="1" stop-color="#8b5cf6"><animate attributeName="stop-color" values="#8b5cf6;#34d399;#8b5cf6" dur="6s" repeatCount="indefinite"/></stop></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<rect width="1200" height="260" rx="28" fill="url(#bg)"/><g fill="#fff"><circle cx="90" cy="55" r="2"><animate attributeName="opacity" values=".2;1;.2" dur="3s" repeatCount="indefinite"/></circle><circle cx="1080" cy="65" r="3"><animate attributeName="opacity" values="1;.2;1" dur="4s" repeatCount="indefinite"/></circle><circle cx="1010" cy="210" r="2"><animate attributeName="opacity" values=".3;1;.3" dur="2.4s" repeatCount="indefinite"/></circle><circle cx="180" cy="205" r="2"><animate attributeName="opacity" values="1;.2;1" dur="3.7s" repeatCount="indefinite"/></circle></g>
<path d="M80 208 C300 120 440 250 600 130 C760 10 900 160 1120 55" fill="none" stroke="url(#beam)" stroke-width="4" stroke-linecap="round" filter="url(#glow)" stroke-dasharray="18 12"><animate attributeName="stroke-dashoffset" from="0" to="-60" dur="3s" repeatCount="indefinite"/></path>
<text x="600" y="104" text-anchor="middle" fill="#fff" font-family="Segoe UI,Arial" font-size="50" font-weight="800">NOVA ULTIMATE</text><text x="600" y="154" text-anchor="middle" fill="#a5f3fc" font-family="Segoe UI,Arial" font-size="30" font-weight="600">FULLSTACK2026 · LEARN → BUILD → TEST → SHIP</text><text x="600" y="195" text-anchor="middle" fill="#c4b5fd" font-family="Segoe UI,Arial" font-size="19">Animated documentation · quality gates · honest readiness</text>
</svg>'''
    pulse = '''<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="120" viewBox="0 0 1000 120" role="img" aria-label="NOVA learning pulse">
<defs><linearGradient id="g"><stop stop-color="#22d3ee"><animate attributeName="stop-color" values="#22d3ee;#a78bfa;#22d3ee" dur="5s" repeatCount="indefinite"/></stop><stop offset="1" stop-color="#34d399"><animate attributeName="stop-color" values="#34d399;#f59e0b;#34d399" dur="5s" repeatCount="indefinite"/></stop></linearGradient></defs><rect width="1000" height="120" rx="22" fill="#080d25"/><path d="M40 70 H190 L230 32 L285 92 L340 54 H520 L565 25 L625 92 L680 58 H960" fill="none" stroke="url(#g)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="16 10"><animate attributeName="stroke-dashoffset" from="0" to="-52" dur="2.8s" repeatCount="indefinite"/></path><circle cx="565" cy="25" r="7" fill="#fff"><animate attributeName="r" values="5;10;5" dur="1.8s" repeatCount="indefinite"/></circle><text x="500" y="108" text-anchor="middle" fill="#c4b5fd" font-family="Segoe UI,Arial" font-size="16">NOVA managed learning documentation</text></svg>'''
    write_text(assets / "nova-ultimate-banner.svg", banner, changes, "added animated portfolio banner")
    write_text(assets / "nova-folder-pulse.svg", pulse, changes, "added shared animated folder pulse")


def progress_svg(title: str, score: int, good: int, bad: int) -> str:
    primary, secondary, label = status_palette(score)
    width = int(8.4 * score)
    title = html.escape(title[:58])
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="920" height="150" viewBox="0 0 920 150" role="img" aria-label="{title} readiness {score} percent">
<defs><linearGradient id="p"><stop stop-color="{primary}"/><stop offset="1" stop-color="{secondary}"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="920" height="150" rx="22" fill="#0b1029"/><text x="40" y="42" fill="#f8fafc" font-family="Segoe UI,Arial" font-size="23" font-weight="700">{title}</text><text x="880" y="42" text-anchor="end" fill="{secondary}" font-family="Segoe UI,Arial" font-size="24" font-weight="800">{score}% · {label}</text><rect x="40" y="66" width="840" height="22" rx="11" fill="#202846"/><rect x="40" y="66" width="0" height="22" rx="11" fill="url(#p)" filter="url(#glow)"><animate attributeName="width" from="0" to="{width}" dur="1.4s" fill="freeze"/></rect><text x="40" y="122" fill="#86efac" font-family="Segoe UI,Arial" font-size="17">✓ strengths: {good}</text><text x="880" y="122" text-anchor="end" fill="#fca5a5" font-family="Segoe UI,Arial" font-size="17">⚠ improvements: {bad}</text></svg>'''


def find_readmes(directory: Path) -> list[Path]:
    try:
        return [p for p in directory.iterdir() if p.is_file() and p.name.lower() == "readme.md"]
    except OSError:
        return []


def normalize_readme(directory: Path, root: Path, changes: list[Change]) -> Path:
    target = directory / "README.md"
    candidates = find_readmes(directory)
    if target.exists():
        primary = target
    elif candidates:
        primary = max(candidates, key=lambda p: p.stat().st_size)
        move_path(root, primary, target, changes)
        primary = target
    else:
        return target
    for duplicate in find_readmes(directory):
        if duplicate == primary:
            continue
        extra = read_text(duplicate) or ""
        current = read_text(primary) or ""
        if extra.strip() and extra.strip() not in current:
            write_text(primary, current.rstrip() + "\n\n---\n\n" + extra.strip() + "\n", changes, "merged duplicate README content")
        duplicate.unlink()
        changes.append(Change("delete", posix(duplicate.relative_to(root)), "removed duplicate README casing"))
    return primary


def replace_managed(text: str, start: str, end: str, block: str) -> str:
    pattern = re.compile(re.escape(start) + r".*?" + re.escape(end), re.S)
    if pattern.search(text):
        return pattern.sub(block, text, count=1)
    return text


def readme_block(status: FolderStatus, directory: Path, root: Path) -> str:
    assets = root / "assets/readme"
    pulse = posix(os.path.relpath(assets / "nova-folder-pulse.svg", directory))
    progress = posix(os.path.relpath(root / status.progress_asset, directory))
    entries = "\n".join(f"- `{item}`" for item in status.entry_points) or "- No conventional entry point detected; use the nearest parent README for navigation."
    good = "\n".join(f"- ✅ {item}" for item in status.good)
    bad = "\n".join(f"- ⚠️ {item}" for item in status.bad) or "- 🟢 No folder-specific blocker detected by the static checks."
    commands: list[str] = []
    for entry in status.entry_points[:3]:
        suffix = Path(entry).suffix.lower()
        if suffix == ".py": commands.append(f"python {entry}")
        elif suffix in {".html", ".htm"}: commands.append("python -m http.server 8000")
        elif suffix in {".js", ".mjs", ".cjs"}: commands.append(f"node {entry}")
        elif suffix in {".ts", ".tsx"}: commands.append(f"npx tsx {entry}")
        elif suffix == ".sql": commands.append(f"psql -f {entry}")
    command_text = "\n".join(commands) or "# See the nearest runnable source file and parent README."
    return f'''{MANAGED_START}
<div align="center">

<img src="{pulse}" width="100%" alt="Animated NOVA learning pulse">

### {status.title}

<img src="{progress}" width="100%" alt="Readiness status for {status.title}">

**Goal:** {status.goal}

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **{status.score}%** |
| Files | {status.files} |
| Source files | {status.source_files} |
| Test files | {status.tests} |
| Text lines | {status.lines:,} |

### ▶️ Main paths

{entries}

### 🚀 Run

```bash
{command_text}
```

### 🟢 What is already strong

{good}

### 🟠 What to improve next

{bad}

### 🧪 Validation

```bash
python tools/nova_quality_gate.py --repo . --strict
python -m unittest discover -s tests/python -p "test_*.py" -v
node tools/run_node_tests.mjs .
```

> The readiness value is a transparent repository heuristic, not a course grade and not proof that every interactive or external-API exercise was executed.

<sub>Managed by NOVA Ultimate v{VERSION} · {iso_now()}</sub>
{MANAGED_END}'''


def insert_after_intro(text: str, block: str) -> str:
    if not text.strip():
        return block + "\n"
    lines = text.splitlines()
    # Keep an existing top centered hero intact.
    if lines and lines[0].strip().lower().startswith("<div"):
        for i, line in enumerate(lines[:80]):
            if line.strip().lower() == "</div>":
                return "\n".join(lines[: i + 1]) + "\n\n" + block + "\n\n" + "\n".join(lines[i + 1 :]).lstrip()
    for i, line in enumerate(lines[:40]):
        if line.startswith("# "):
            return "\n".join(lines[: i + 1]) + "\n\n" + block + "\n\n" + "\n".join(lines[i + 1 :]).lstrip()
    return block + "\n\n" + text.lstrip()


def forge_readmes(root: Path, mode: str, changes: list[Change]) -> list[FolderStatus]:
    write_shared_assets(root, changes)
    weeks = sorted(p for p in root.iterdir() if p.is_dir() and re.fullmatch(r"Week\d+.*", p.name, re.I))
    directories: list[Path] = []
    for week in weeks:
        directories.append(week)
        directories.extend(p for p in week.rglob("*") if p.is_dir() and not skipped(p, root))
    extras = [
        root / "tools", root / "tests", root / "tests/python", root / "tests/js",
        # Do not generate .github/README.md: GitHub can select it instead of the
        # root README and hide the repository's public portfolio landing page.
        root / ".github/workflows", root / "assets", root / "assets/readme",
    ]
    directories.extend(path for path in extras if path.exists() and path.is_dir())
    directories = sorted(set(directories), key=lambda p: (len(p.relative_to(root).parts), posix(p.relative_to(root)).lower()))
    statuses: list[FolderStatus] = []
    progress_dir = root / "assets/readme/progress"
    progress_dir.mkdir(parents=True, exist_ok=True)
    for directory in directories:
        try:
            if not any(directory.iterdir()):
                continue
        except OSError:
            continue
        readme = normalize_readme(directory, root, changes)
        if mode == "missing" and readme.exists():
            continue
        digest = hashlib.sha1(posix(directory.relative_to(root)).encode()).hexdigest()[:10]
        progress_rel = posix((progress_dir / f"{slugify(directory.name)}-{digest}.svg").relative_to(root))
        status = folder_status(directory, root, progress_rel)
        statuses.append(status)
        write_text(root / progress_rel, progress_svg(status.title, status.score, len(status.good), len(status.bad)), changes, "generated animated folder readiness")
        current = read_text(readme) or f"# {status.title}\n"
        clean = replace_managed(current, MANAGED_START, MANAGED_END, "").strip()
        block = readme_block(status, directory, root)
        updated = insert_after_intro(clean, block)
        write_text(readme, updated, changes, "created or refreshed animated folder README")
    return statuses


def clamp(value: float) -> float:
    return max(0.0, min(100.0, value))


def curriculum_directories(root: Path) -> list[Path]:
    out: list[Path] = []
    for week in (p for p in root.iterdir() if p.is_dir() and re.fullmatch(r"Week\d+.*", p.name, re.I)):
        out.append(week)
        out.extend(p for p in week.rglob("*") if p.is_dir() and not skipped(p, root))
    return out


def possible_secret_count(root: Path) -> int:
    count = 0
    for path in visible_files(root):
        if path.suffix.lower() not in TEXT_EXTENSIONS or path.name in {".env.example", "config.example.js"}:
            continue
        text = read_text(path)
        if not text:
            continue
        for match in SECRET_ASSIGNMENT_RE.finditer(text):
            value = match.group(2).lower()
            if any(word in value for word in ("replace", "example", "placeholder", "changeme", "not-a-real")):
                continue
            count += 1
    return count


def collect_health(root: Path, quality: dict | None = None) -> dict[str, Any]:
    all_files = visible_files(root)
    source = [p for p in all_files if p.suffix.lower() in SOURCE_EXTENSIONS]
    docs = [p for p in all_files if p.suffix.lower() in {".md", ".mdx"}]
    tests = [p for p in all_files if TEST_RE.search(posix(p.relative_to(root)))]
    weeks = sorted(p for p in root.iterdir() if p.is_dir() and re.fullmatch(r"Week\d+.*", p.name, re.I))
    languages = Counter(LANGUAGE_BY_EXT[p.suffix.lower()] for p in source if p.suffix.lower() in LANGUAGE_BY_EXT)
    text_lines = 0
    total_bytes = 0
    python_errors: list[str] = []
    for path in all_files:
        total_bytes += path.stat().st_size
        text = read_text(path)
        if text is not None:
            text_lines += len(text.splitlines())
            if path.suffix.lower() == ".py":
                try:
                    ast.parse(text, filename=posix(path.relative_to(root)))
                except SyntaxError as exc:
                    python_errors.append(f"{posix(path.relative_to(root))}:{exc.lineno} {exc.msg}")
    dirs = [d for d in curriculum_directories(root) if any(d.iterdir())]
    with_readme = sum(1 for d in dirs if any(p.is_file() and p.name.lower() == "readme.md" for p in d.iterdir()))
    readme_coverage = 100.0 if not dirs else 100 * with_readme / len(dirs)
    archives = [p.name for p in root.glob("Week*.zip") if p.is_file()]
    naming = [
        posix(d.relative_to(root)) for d in dirs
        if any(re.search(r"[&+]", part) or part.endswith(" ") or "Challange" in part or "Quizz" in part or "Exercices" in part for part in d.relative_to(root).parts)
    ]
    quality_errors = int((quality or {}).get("counts", {}).get("error", len(python_errors)))
    quality_warnings = int((quality or {}).get("counts", {}).get("warning", 0))
    secrets = possible_secret_count(root)
    ci = (root / ".github/workflows/quality.yml").exists()
    lockfile = (root / "package-lock.json").exists()
    configs = [root / ".editorconfig", root / ".gitignore", root / ".gitattributes", root / "package.json", root / "pyproject.toml"]
    animated = len(list((root / "assets/readme").glob("*.svg"))) if (root / "assets/readme").exists() else 0
    root_readme = (root / "README.md").exists()

    breadth = clamp(60 * min(1, len(weeks) / 6) + 40 * min(1, len(languages) / 6))
    documentation = clamp(readme_coverage * 0.85 + (15 if root_readme else 0))
    structure = clamp(100 - len(archives) * 25 - len(naming) * 4)
    code_health = clamp(100 - len(python_errors) * 14 - secrets * 30 - max(0, quality_errors - len(python_errors)) * 5)
    testing = clamp(20 + min(60, len(tests) * 7) + (20 if (root / "tools/nova_quality_gate.py").exists() else 0))
    tooling = clamp(sum(20 for path in configs if path.exists()))
    automation = (60 if ci else 0) + (40 if lockfile else 0)
    portfolio = clamp((35 if root_readme else 0) + min(35, animated * 10) + (30 if (root / "reports/nova/nova_repo_dashboard.html").exists() else 20))
    categories = {
        "Learning breadth": round(breadth, 1),
        "Documentation": round(documentation, 1),
        "Structure": round(structure, 1),
        "Code health": round(code_health, 1),
        "Testing": round(testing, 1),
        "Tooling": round(tooling, 1),
        "Automation": round(automation, 1),
        "Portfolio": round(portfolio, 1),
    }
    weights = {
        "Learning breadth": 20, "Documentation": 15, "Structure": 15,
        "Code health": 15, "Testing": 15, "Tooling": 10,
        "Automation": 5, "Portfolio": 5,
    }
    readiness = round(sum(categories[name] * weights[name] for name in categories) / 100, 1)
    good: list[str] = []
    bad: list[str] = []
    if len(weeks) >= 6: good.append(f"Six curriculum weeks are present without counting ZIP archives as modules.")
    if readme_coverage >= 99: good.append(f"README coverage is {readme_coverage:.1f}% across curriculum directories.")
    else: bad.append(f"README coverage is {readme_coverage:.1f}%; {len(dirs) - with_readme} folders remain undocumented.")
    if not python_errors: good.append("All Python files pass static syntax parsing.")
    else: bad.append(f"{len(python_errors)} Python syntax error(s) remain.")
    if secrets == 0: good.append("No obvious hardcoded credential assignment remains in the current tree.")
    else: bad.append(f"{secrets} possible credential assignment(s) remain; rotate and remove them.")
    if ci: good.append("GitHub Actions quality workflow is installed with read-only repository access.")
    else: bad.append("GitHub Actions quality workflow is missing.")
    if lockfile: good.append("package-lock.json is present for reproducible npm installs.")
    else: bad.append("package-lock.json is still missing; run npm install before pushing.")
    if tests: good.append(f"{len(tests)} automated test file(s) are discoverable.")
    else: bad.append("No automated test file is discoverable.")
    if not archives: good.append("Redundant Week ZIP archives are absent from the repository root.")
    else: bad.append(f"Redundant archives remain: {', '.join(archives)}")
    if naming: bad.append(f"{len(naming)} shell-sensitive or misspelled curriculum path(s) remain.")
    if quality_errors: bad.append(f"The last whole-repository quality gate reported {quality_errors} error(s).")
    elif quality is not None: good.append("The last whole-repository quality gate reported zero blocking errors.")

    modules = []
    for week in weeks:
        week_files = [p for p in all_files if p.is_relative_to(week)]
        modules.append({
            "name": week.name,
            "files": len(week_files),
            "source": sum(1 for p in week_files if p.suffix.lower() in SOURCE_EXTENSIONS),
            "tests": sum(1 for p in week_files if TEST_RE.search(posix(p.relative_to(root)))),
            "readmes": sum(1 for p in week_files if p.name.lower() == "readme.md"),
            "lines": sum(len((read_text(p) or "").splitlines()) for p in week_files),
        })
    return {
        "tool": {"name": TOOL_NAME, "version": VERSION}, "generated_at": iso_now(),
        "readiness": readiness, "categories": categories, "weights": weights,
        "metrics": {
            "files": len(all_files), "size_bytes": total_bytes, "text_lines": text_lines,
            "source_files": len(source), "documentation_files": len(docs), "test_files": len(tests),
            "week_modules": len(weeks), "curriculum_directories": len(dirs),
            "readme_coverage": round(readme_coverage, 1), "python_syntax_errors": len(python_errors),
            "possible_secrets": secrets, "quality_errors": quality_errors, "quality_warnings": quality_warnings,
            "nonportable_paths": len(naming), "root_archives": len(archives),
        },
        "languages": dict(languages), "modules": modules, "good": good, "bad": bad,
        "python_errors": python_errors, "naming_paths": naming,
        "method": "Weighted repository-readiness heuristic; not a course grade and not proof every interactive or external-API program ran.",
    }


def readiness_svg(health: dict[str, Any]) -> str:
    score = float(health["readiness"])
    primary, secondary, label = status_palette(score)
    categories = list(health["categories"].items())
    rows = []
    for index, (name, value) in enumerate(categories):
        x = 35 + (index % 4) * 235
        y = 230 + (index // 4) * 86
        color, _, _ = status_palette(value)
        rows.append(f'<rect x="{x}" y="{y}" width="210" height="62" rx="12" fill="#131b3b"/><text x="{x+15}" y="{y+25}" fill="#cbd5e1" font-family="Segoe UI,Arial" font-size="14">{html.escape(name)}</text><text x="{x+195}" y="{y+46}" text-anchor="end" fill="{color}" font-family="Segoe UI,Arial" font-size="22" font-weight="800">{value:.0f}%</text>')
    circumference = 2 * 3.14159 * 67
    dash = circumference * score / 100
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="420" viewBox="0 0 1000 420" role="img" aria-label="Repository readiness {score} percent">
<defs><linearGradient id="ring"><stop stop-color="{primary}"/><stop offset="1" stop-color="{secondary}"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="1000" height="420" rx="28" fill="#080d25"/><text x="500" y="45" text-anchor="middle" fill="#f8fafc" font-family="Segoe UI,Arial" font-size="28" font-weight="800">NOVA REPOSITORY HEALTH CENTER</text><circle cx="500" cy="135" r="67" fill="none" stroke="#202846" stroke-width="16"/><circle cx="500" cy="135" r="67" fill="none" stroke="url(#ring)" stroke-width="16" stroke-linecap="round" stroke-dasharray="0 {circumference:.2f}" transform="rotate(-90 500 135)" filter="url(#glow)"><animate attributeName="stroke-dasharray" from="0 {circumference:.2f}" to="{dash:.2f} {circumference:.2f}" dur="1.7s" fill="freeze"/></circle><text x="500" y="130" text-anchor="middle" fill="#fff" font-family="Segoe UI,Arial" font-size="38" font-weight="900">{score:.1f}%</text><text x="500" y="160" text-anchor="middle" fill="{secondary}" font-family="Segoe UI,Arial" font-size="16">{label}</text>{''.join(rows)}<text x="500" y="402" text-anchor="middle" fill="#94a3b8" font-family="Segoe UI,Arial" font-size="13">Green ≥85 · Cyan 70–84 · Amber 50–69 · Red &lt;50 · heuristic, not a course grade</text></svg>'''


def health_markdown(health: dict[str, Any]) -> str:
    category_lines = []
    badge_color = status_palette(float(health["readiness"]))[0].lstrip("#")
    for name, value in health["categories"].items():
        _, _, label = status_palette(value)
        icon = "🟢" if value >= 85 else "🔵" if value >= 70 else "🟠" if value >= 50 else "🔴"
        category_lines.append(f"| {icon} {name} | **{value:.1f}%** | {label} |")
    good = "\n".join(f"- ✅ {item}" for item in health["good"])
    bad = "\n".join(f"- ⚠️ {item}" for item in health["bad"]) or "- 🟢 No current blocker was detected by the static quality gate."
    metrics = health["metrics"]
    return f'''{HEALTH_START}
<div align="center">

<img src="./assets/readme/nova-ultimate-banner.svg" width="100%" alt="Animated NOVA Ultimate banner">

<img src="./assets/readme/nova-readiness-center.svg" width="100%" alt="NOVA repository readiness dashboard">

[![Quality](https://img.shields.io/badge/quality-{urllib.parse.quote(str(health['readiness']) + '%')}-{badge_color}?style=for-the-badge)](reports/nova/nova_repo_dashboard.html)
[![CI](https://img.shields.io/badge/CI-NOVA%20Quality-06b6d4?style=for-the-badge&logo=githubactions)](.github/workflows/quality.yml)
[![Docs](https://img.shields.io/badge/README%20coverage-{metrics['readme_coverage']}%25-8b5cf6?style=for-the-badge)](reports/nova/nova_repo_dashboard.html)
[![Tests](https://img.shields.io/badge/tests-{metrics['test_files']}-f59e0b?style=for-the-badge)](tests/)

</div>

## 🧭 Live Repository Health

| Category | Readiness | State |
|---|---:|---|
{chr(10).join(category_lines)}

| Repository metric | Current value |
|---|---:|
| Overall readiness | **{health['readiness']:.1f}%** |
| Files | {metrics['files']} |
| Source files | {metrics['source_files']} |
| Tests | {metrics['test_files']} |
| Curriculum directories | {metrics['curriculum_directories']} |
| README coverage | **{metrics['readme_coverage']:.1f}%** |
| Blocking quality errors | {metrics['quality_errors']} |
| Possible current-tree secrets | {metrics['possible_secrets']} |

### 🟢 Good now

{good}

### 🔴 / 🟠 Still needs attention

{bad}

> **Interpretation:** {health['method']}
>
> Open the colorful offline dashboard at [`reports/nova/nova_repo_dashboard.html`](reports/nova/nova_repo_dashboard.html).

<sub>Generated by NOVA Ultimate v{VERSION} · {health['generated_at']}</sub>
{HEALTH_END}'''


def update_root_readme(root: Path, health: dict[str, Any], changes: list[Change]) -> None:
    path = root / "README.md"
    current = read_text(path) or "# Fullstack2026\n"
    clean = replace_managed(current, HEALTH_START, HEALTH_END, "").strip()
    block = health_markdown(health)
    updated = insert_after_intro(clean, block)
    write_text(path, updated, changes, "inserted live animated repository health center")
    write_text(root / "assets/readme/nova-readiness-center.svg", readiness_svg(health), changes, "generated animated readiness center")


def dashboard_html(health: dict[str, Any], quality: dict | None) -> str:
    score = health["readiness"]
    primary, _, label = status_palette(score)
    categories = "".join(
        f'''<article class="card category"><div class="row"><strong>{html.escape(name)}</strong><span class="score" style="color:{status_palette(value)[0]}">{value:.1f}%</span></div><div class="bar"><i style="--value:{value}%;--tone:{status_palette(value)[0]}"></i></div><small>{status_palette(value)[2]}</small></article>'''
        for name, value in health["categories"].items()
    )
    metrics = health["metrics"]
    metric_cards = "".join(
        f'<article class="metric"><span>{html.escape(label)}</span><strong>{html.escape(str(value))}</strong></article>'
        for label, value in [
            ("Files", metrics["files"]), ("Source", metrics["source_files"]),
            ("Tests", metrics["test_files"]), ("Text lines", f"{metrics['text_lines']:,}"),
            ("README coverage", f"{metrics['readme_coverage']:.1f}%"),
            ("Quality errors", metrics["quality_errors"]), ("Warnings", metrics["quality_warnings"]),
            ("Current-tree secrets", metrics["possible_secrets"]),
        ]
    )
    good = "".join(f"<li>{html.escape(item)}</li>" for item in health["good"])
    bad = "".join(f"<li>{html.escape(item)}</li>" for item in health["bad"]) or "<li>No static blocker detected.</li>"
    modules = "".join(
        f'''<tr><td>{html.escape(m['name'])}</td><td>{m['files']}</td><td>{m['source']}</td><td>{m['tests']}</td><td>{m['readmes']}</td><td>{m['lines']:,}</td></tr>'''
        for m in health["modules"]
    )
    languages = "".join(f'<span class="pill">{html.escape(name)} · {count}</span>' for name, count in sorted(health["languages"].items(), key=lambda x: (-x[1], x[0])))
    findings = []
    for item in (quality or {}).get("findings", [])[:200]:
        findings.append(
            f'''<tr data-severity="{html.escape(item.get('severity','info'))}"><td><span class="badge {html.escape(item.get('severity','info'))}">{html.escape(item.get('severity','info'))}</span></td><td><code>{html.escape(item.get('code',''))}</code></td><td>{html.escape(item.get('path') or '—')}</td><td>{html.escape(str(item.get('detail','')))}</td></tr>'''
        )
    if not findings:
        findings.append('<tr><td><span class="badge ok">clean</span></td><td><code>clean</code></td><td>—</td><td>No quality finding was recorded.</td></tr>')
    circumference = 2 * 3.14159 * 82
    dash = circumference * score / 100
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NOVA Fullstack2026 Readiness</title>
<style>
:root{{--bg:#050817;--panel:#0b1028;--panel2:#111938;--text:#f8fafc;--muted:#94a3b8;--green:#22c55e;--cyan:#06b6d4;--amber:#f59e0b;--red:#ef4444;--purple:#8b5cf6;--line:#263154}}
*{{box-sizing:border-box}}body{{margin:0;background:radial-gradient(circle at 18% 5%,#271456 0,transparent 35%),radial-gradient(circle at 86% 12%,#073750 0,transparent 31%),var(--bg);color:var(--text);font-family:Inter,Segoe UI,Arial,sans-serif;min-height:100vh}}body:before{{content:"";position:fixed;inset:0;pointer-events:none;background-image:radial-gradient(#fff 1px,transparent 1px);background-size:48px 48px;opacity:.055;animation:drift 28s linear infinite}}@keyframes drift{{to{{background-position:96px 48px}}}}
.container{{width:min(1220px,94vw);margin:auto;padding:38px 0 70px}}header{{text-align:center;padding:38px 20px 30px}}h1{{font-size:clamp(2rem,5vw,4.2rem);margin:.15em 0;background:linear-gradient(90deg,#67e8f9,#c4b5fd,#86efac);-webkit-background-clip:text;color:transparent}}header p{{color:var(--muted);font-size:1.05rem}}.orbit{{width:220px;height:220px;margin:18px auto;position:relative;display:grid;place-items:center}}.orbit svg{{overflow:visible;filter:drop-shadow(0 0 18px {primary}66)}}.orbit .value{{position:absolute;text-align:center}}.orbit .value strong{{font-size:2.7rem;display:block}}.orbit .value span{{color:{primary};font-weight:700}}.legend{{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin:10px}}.legend span,.pill{{background:#111938;border:1px solid var(--line);border-radius:999px;padding:7px 12px;color:#cbd5e1}}.grid{{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}}.card,.metric,.panel{{background:linear-gradient(155deg,#111938dd,#090e23e8);border:1px solid var(--line);border-radius:18px;box-shadow:0 18px 45px #0005}}.card{{padding:18px}}.row{{display:flex;justify-content:space-between;gap:12px;align-items:center}}.score{{font-size:1.35rem;font-weight:900}}.bar{{height:10px;background:#20294a;border-radius:99px;overflow:hidden;margin:14px 0 8px}}.bar i{{display:block;height:100%;width:0;background:var(--tone);border-radius:inherit;animation:fill 1.4s forwards;box-shadow:0 0 14px var(--tone)}}@keyframes fill{{to{{width:var(--value)}}}}small{{color:var(--muted)}}.metrics{{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin:18px 0}}.metric{{padding:18px;text-align:center}}.metric span{{display:block;color:var(--muted);font-size:.87rem}}.metric strong{{display:block;font-size:1.55rem;margin-top:7px}}.twocol{{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin:20px 0}}.panel{{padding:24px}}.panel h2{{margin-top:0}}.good{{border-color:#22c55e77}}.bad{{border-color:#ef444477}}li{{margin:.75em 0;line-height:1.5}}.good li::marker{{color:var(--green)}}.bad li::marker{{color:var(--red)}}table{{width:100%;border-collapse:collapse}}th,td{{padding:12px 10px;border-bottom:1px solid var(--line);text-align:left}}th{{color:#a5f3fc;position:sticky;top:0;background:#101733}}code{{color:#c4b5fd}}.tablewrap{{overflow:auto;max-height:520px;border-radius:14px}}.badge{{display:inline-block;border-radius:999px;padding:4px 9px;font-size:.75rem;font-weight:800;text-transform:uppercase}}.badge.error{{background:#7f1d1d;color:#fecaca}}.badge.warning{{background:#78350f;color:#fde68a}}.badge.info,.badge.ok{{background:#164e63;color:#cffafe}}input,select{{background:#0a1027;border:1px solid var(--line);color:#fff;border-radius:10px;padding:10px 12px;margin:0 8px 12px 0}}footer{{text-align:center;color:var(--muted);padding-top:30px}}@media(max-width:900px){{.grid,.metrics{{grid-template-columns:repeat(2,1fr)}}.twocol{{grid-template-columns:1fr}}}}@media(max-width:520px){{.grid,.metrics{{grid-template-columns:1fr}}th,td{{font-size:.84rem}}}}@media(prefers-reduced-motion:reduce){{*,*:before{{animation:none!important;transition:none!important}}.bar i{{width:var(--value)}}}}
</style></head><body><main class="container"><header><div class="orbit"><svg width="220" height="220" viewBox="0 0 220 220"><circle cx="110" cy="110" r="82" fill="none" stroke="#20294a" stroke-width="17"/><circle cx="110" cy="110" r="82" fill="none" stroke="{primary}" stroke-width="17" stroke-linecap="round" transform="rotate(-90 110 110)" stroke-dasharray="0 {circumference:.2f}"><animate attributeName="stroke-dasharray" from="0 {circumference:.2f}" to="{dash:.2f} {circumference:.2f}" dur="1.7s" fill="freeze"/></circle></svg><div class="value"><strong>{score:.1f}%</strong><span>{label}</span></div></div><h1>NOVA Repository Health Center</h1><p>Fullstack2026 · corrected static analysis · transparent readiness · generated {html.escape(health['generated_at'])}</p><div class="legend"><span>🟢 85–100 Ready</span><span>🔵 70–84 Solid</span><span>🟠 50–69 Developing</span><span>🔴 0–49 Attention</span></div></header>
<section class="grid">{categories}</section><section class="metrics">{metric_cards}</section><section class="twocol"><article class="panel good"><h2>🟢 What is good</h2><ul>{good}</ul></article><article class="panel bad"><h2>🔴 / 🟠 What needs work</h2><ul>{bad}</ul></article></section>
<section class="panel"><h2>🧬 Technology distribution</h2><div class="legend">{languages}</div></section>
<section class="panel"><h2>📚 Week modules</h2><div class="tablewrap"><table><thead><tr><th>Module</th><th>Files</th><th>Source</th><th>Tests</th><th>README</th><th>Lines</th></tr></thead><tbody>{modules}</tbody></table></div></section>
<section class="panel"><h2>🔎 Quality findings</h2><input id="search" placeholder="Search code, path or detail"><select id="severity"><option value="">All severities</option><option>error</option><option>warning</option><option>info</option></select><div class="tablewrap"><table id="findings"><thead><tr><th>State</th><th>Code</th><th>Path</th><th>Detail</th></tr></thead><tbody>{''.join(findings)}</tbody></table></div></section>
<footer>{html.escape(health['method'])}<br>NOVA Ultimate v{VERSION}</footer></main><script>const q=document.querySelector('#search'),s=document.querySelector('#severity'),rows=[...document.querySelectorAll('#findings tbody tr')];function filter(){{const text=q.value.toLowerCase(),sev=s.value;for(const row of rows){{row.hidden=!row.textContent.toLowerCase().includes(text)||(sev&&row.dataset.severity!==sev)}}}}q.addEventListener('input',filter);s.addEventListener('change',filter);</script></body></html>'''


def report_markdown(health: dict[str, Any], quality: dict | None) -> str:
    lines = [
        "# NOVA Ultimate Repository Report", "",
        f"> Generated `{health['generated_at']}` by NOVA Ultimate v{VERSION}.", "",
        f"## Overall readiness: **{health['readiness']:.1f}%**", "",
        health["method"], "", "## Categories", "",
        "| Category | Score | Weight |", "|---|---:|---:|",
    ]
    for name, value in health["categories"].items():
        lines.append(f"| {name} | {value:.1f}% | {health['weights'][name]}% |")
    lines += ["", "## Good", ""] + [f"- ✅ {item}" for item in health["good"]]
    lines += ["", "## Needs attention", ""] + ([f"- ⚠️ {item}" for item in health["bad"]] or ["- No current static blocker."])
    lines += ["", "## Quality gate", ""]
    if quality:
        lines += [
            f"- Status: **{quality.get('status','unknown').upper()}**",
            f"- Errors: {quality.get('counts',{}).get('error',0)}",
            f"- Warnings: {quality.get('counts',{}).get('warning',0)}",
            f"- Files scanned: {quality.get('files_scanned',0)}",
        ]
    else:
        lines.append("- No quality report was loaded.")
    return "\n".join(lines) + "\n"


def write_reports(root: Path, health: dict[str, Any], quality: dict | None, changes: list[Change], commands: list[CommandResult]) -> None:
    output = root / "reports/nova"
    output.mkdir(parents=True, exist_ok=True)
    reports_readme = f"""# NOVA Generated Reports

This folder contains the current offline dashboard, audit, quality gate and update manifest.

- [Open the readiness dashboard](nova_repo_dashboard.html)
- [Read the corrected audit](nova_repo_audit.md)
- [Read the quality report](quality_report.md)
- [Review the update manifest](NOVA_UPDATE_REPORT.md)

Generated by NOVA Ultimate v{VERSION}.
"""
    write_text(output / "README.md", reports_readme, changes, "documented generated report outputs")
    write_text(output / "nova_repo_dashboard.html", dashboard_html(health, quality), changes, "generated colorful offline readiness dashboard")
    write_text(output / "nova_repo_audit.json", json.dumps({"health": health, "quality": quality}, indent=2, ensure_ascii=False), changes, "generated corrected audit JSON")
    write_text(output / "nova_repo_audit.md", report_markdown(health, quality), changes, "generated corrected audit report")
    change_lines = ["# NOVA Ultimate Change Report", "", f"Generated: `{iso_now()}`", "", "## Changed files", "", "| Action | Path | Detail |", "|---|---|---|"]
    for item in changes:
        change_lines.append(f"| {item.kind} | `{item.path}` | {item.detail.replace('|','/')} |")
    change_lines += ["", "## Commands", "", "| Result | Command | Seconds |", "|---|---|---:|"]
    for item in commands:
        state = "PASS" if item.returncode == 0 else "FAIL" if item.returncode is not None else "SKIP"
        change_lines.append(f"| {state} | `{html.escape(item.label)}` | {item.elapsed_seconds:.2f} |")
    write_text(output / "NOVA_UPDATE_REPORT.md", "\n".join(change_lines), changes, "generated update manifest")


def load_quality(root: Path) -> dict | None:
    path = root / "reports/nova/quality_report.json"
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None


def run_quality(root: Path, commands: list[CommandResult], strict: bool = False) -> CommandResult:
    command = [sys.executable, str(root / "tools/nova_quality_gate.py"), "--repo", str(root)]
    if strict:
        command.append("--strict")
    result = run(command, root, 300)
    commands.append(result)
    return result


def run_test_suite(root: Path, commands: list[CommandResult], skip_npm: bool, console: Console) -> None:
    if not skip_npm and shutil.which("npm") and (root / "package.json").exists():
        console.info("Installing root JavaScript tooling and generating package-lock.json…")
        install = run(["npm", "install", "--ignore-scripts", "--no-audit", "--no-fund"], root, 600)
        commands.append(install)
        if install.returncode == 0:
            console.ok("npm install completed; package-lock.json is ready.")
        else:
            console.warn("npm install did not complete. The update remains usable; inspect NOVA_UPDATE_REPORT.md.")
    elif not skip_npm:
        console.warn("npm is unavailable; package-lock and TypeScript execution checks may remain pending.")

    quality = run_quality(root, commands, strict=False)
    console.ok("Whole-repository quality report generated.") if quality.returncode == 0 else console.warn("Quality gate found blockers; dashboard will show them in red.")

    python_tests = run([sys.executable, "-m", "unittest", "discover", "-s", "tests/python", "-p", "test_*.py", "-v"], root, 300)
    commands.append(python_tests)
    if python_tests.returncode == 0:
        console.ok("Python anchor tests passed.")
    else:
        console.warn("One or more Python anchor tests failed; see the generated report.")

    if shutil.which("node"):
        node_tests = run(["node", "tools/run_node_tests.mjs", "."], root, 300)
        commands.append(node_tests)
        if node_tests.returncode == 0:
            console.ok("JavaScript/TypeScript anchor tests passed.")
        else:
            console.warn("One or more JavaScript/TypeScript tests failed; see the generated report.")
    else:
        commands.append(CommandResult("node tools/run_node_tests.mjs .", ["node", "tools/run_node_tests.mjs", "."], None, "", "Node.js unavailable", 0.0))
        console.warn("Node.js is unavailable; JavaScript tests were skipped.")


def write_conflict_report(root: Path, conflicts: list[str], changes: list[Change]) -> None:
    if not conflicts:
        return
    lines = [
        "# NOVA Path Merge Conflicts", "",
        "These paths were preserved because source and destination contained different files at the same relative location.",
        "Resolve them manually in GitHub Desktop or VS Code; no conflicting file was overwritten.", "",
    ] + [f"- `{item}`" for item in conflicts]
    write_text(root / "reports/nova/PATH_CONFLICTS.md", "\n".join(lines), changes, "recorded non-destructive path merge conflicts")


def apply_upgrade(args: argparse.Namespace, console: Console) -> int:
    root = Path(args.repo).expanduser().resolve()
    if not is_repo_root(root):
        console.error(f"Not a Fullstack2026 repository root: {root}")
        return 2
    if not args.yes:
        console.error("Apply mode requires --yes because it changes files. A backup is still created first.")
        return 2

    console.heading("Safety snapshot")
    backup = SnapshotBackup(root, console)
    backup.create()
    changes: list[Change] = []
    commands: list[CommandResult] = []
    conflicts: list[str] = []
    package_tools = Path(__file__).resolve().parent

    try:
        console.heading("Install NOVA v2 infrastructure")
        install_tool_files(root, package_tools, changes)
        write_root_launchers(root, changes)

        if not args.skip_fixes:
            console.heading("Repair syntax and security")
            fixed = fix_python_syntax(root, changes)
            console.ok(f"Repaired {len(fixed)} Python file(s).")
            giphy = sanitize_giphy_key(root, changes)
            currency = sanitize_currency_keys(root, changes)
            console.ok("Removed the known Giphy key literal.") if giphy else console.info("No Giphy literal required changing.")
            console.ok(f"Sanitized {len(currency)} Currency Converter file(s).") if currency else console.info("No Currency Converter literal required changing.")
            write_security_files(root, changes)

            if args.delete_archives:
                console.heading("Remove superseded source archives")
                removed = cleanup_archives(root, changes)
                console.ok(f"Removed {len(removed)} root Week ZIP file(s); the snapshot contains their backup.")

            console.heading("Normalize safe paths")
            _, merge_conflicts = normalize_paths(root, changes)
            conflicts.extend(merge_conflicts)
            console.ok("Safe path normalization completed.")
            if conflicts:
                console.warn(f"Preserved {len(conflicts)} conflicting path(s) for manual review.")

            console.heading("Install repository configuration, CI and tests")
            update_gitignore(root, changes)
            update_gitattributes(root, changes)
            update_eslint(root, changes)
            write_editorconfig(root, changes)
            write_pyproject(root, changes)
            update_package_json(root, changes)
            write_ci(root, changes)
            write_anchor_tests(root, changes)

        if args.readmes != "none":
            console.heading("Forge animated README documentation")
            statuses = forge_readmes(root, args.readmes, changes)
            console.ok(f"Created or refreshed {len(statuses)} curriculum README section(s).")

        write_conflict_report(root, conflicts, changes)

        console.heading("Validate the upgraded repository")
        if args.run_tests:
            run_test_suite(root, commands, args.skip_npm, console)
        else:
            run_quality(root, commands, strict=False)

        quality = load_quality(root)
        health = collect_health(root, quality)
        # First report pass creates the dashboard, which is then included in the final portfolio score.
        write_reports(root, health, quality, changes, commands)
        health = collect_health(root, quality)
        update_root_readme(root, health, changes)
        write_reports(root, health, quality, changes, commands)
        # Re-run static validation after all generated documentation is present.
        final_quality_result = run_quality(root, commands, strict=False)
        quality = load_quality(root)
        health = collect_health(root, quality)
        update_root_readme(root, health, changes)
        write_reports(root, health, quality, changes, commands)

        backup.finalize(changes, commands)
        console.heading("Finished")
        console.ok(f"Readiness: {health['readiness']:.1f}%")
        console.info(f"Files changed/created/deleted: {len(changes)}")
        console.info(f"Dashboard: {root / 'reports/nova/nova_repo_dashboard.html'}")
        console.info(f"Rollback: python tools/nova_ultimate.py --repo . --rollback {backup.id}")
        if final_quality_result.returncode:
            console.warn("The package completed, but the final quality gate still reports blockers. They are visible in red in the dashboard.")
        if args.open_dashboard:
            try:
                webbrowser.open((root / "reports/nova/nova_repo_dashboard.html").as_uri())
            except Exception:
                pass
        return 0
    except Exception as exc:
        try:
            backup.finalize(changes, commands)
        except Exception:
            pass
        console.error(f"Upgrade stopped: {exc}")
        console.warn(f"Restore with: python tools/nova_ultimate.py --repo . --rollback {backup.id}")
        return 1


def audit_repo(args: argparse.Namespace, console: Console) -> int:
    root = Path(args.repo).expanduser().resolve()
    if not is_repo_root(root):
        console.error(f"Not a Fullstack2026 repository root: {root}")
        return 2
    commands: list[CommandResult] = []
    changes: list[Change] = []
    package_quality = Path(__file__).resolve().parent / "nova_quality_gate.py"
    quality_tool = root / "tools/nova_quality_gate.py"
    if quality_tool.exists():
        result = run([sys.executable, str(quality_tool), "--repo", str(root)], root, 300)
    else:
        result = run([sys.executable, str(package_quality), "--repo", str(root)], root, 300)
    commands.append(result)
    quality = load_quality(root)
    health = collect_health(root, quality)
    write_reports(root, health, quality, changes, commands)
    console.ok(f"Audit generated. Readiness: {health['readiness']:.1f}%")
    dashboard = root / "reports/nova/nova_repo_dashboard.html"
    console.info(f"Dashboard: {dashboard}")
    if args.open_dashboard:
        try:
            webbrowser.open(dashboard.as_uri())
        except Exception:
            pass
    return 0


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Apply, audit or roll back the NOVA Ultimate upgrade.")
    parser.add_argument("--repo", default=".", help="Fullstack2026 repository root")
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--apply", action="store_true", help="Apply the reversible upgrade")
    mode.add_argument("--audit", action="store_true", help="Generate reports without source fixes")
    mode.add_argument("--rollback", metavar="ID", help="Restore a backup ID or 'latest'")
    parser.add_argument("--yes", action="store_true", help="Confirm source-changing operations")
    parser.add_argument("--readmes", choices=("all", "missing", "none"), default="all")
    parser.add_argument("--delete-archives", action="store_true", help="Delete root Week ZIPs after snapshot")
    parser.add_argument("--run-tests", action="store_true", help="Install npm tooling and run quality/unit tests")
    parser.add_argument("--skip-npm", action="store_true", help="Do not run npm install")
    parser.add_argument("--skip-fixes", action="store_true", help="Only regenerate docs/reports and installed NOVA files")
    parser.add_argument("--open", dest="open_dashboard", action="store_true")
    parser.add_argument("--no-open", dest="open_dashboard", action="store_false")
    parser.set_defaults(open_dashboard=False)
    parser.add_argument("--no-color", action="store_true")
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    console = Console(not args.no_color)
    console.banner()
    if args.rollback:
        root = Path(args.repo).expanduser().resolve()
        try:
            SnapshotBackup.rollback(root, args.rollback, console)
            return 0
        except Exception as exc:
            console.error(str(exc))
            return 1
    return apply_upgrade(args, console) if args.apply else audit_repo(args, console)


if __name__ == "__main__":
    raise SystemExit(main())
