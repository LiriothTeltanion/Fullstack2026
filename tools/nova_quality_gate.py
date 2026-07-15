#!/usr/bin/env python3
"""NOVA repository-wide quality gate for Fullstack2026.

Validates every relevant visible file without executing interactive exercises:
Python/JavaScript/TypeScript syntax, JSON, HTML, CSS, Markdown links, likely
credentials, README coverage, root archives, CI, lockfile and test presence.
"""
from __future__ import annotations

import argparse
import ast
import datetime as dt
import json
import re
import shutil
import subprocess
import sys
import urllib.parse
from dataclasses import asdict, dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable, Sequence

VERSION = "2.0.0"
SKIP_DIRS = {
    ".git", ".nova", "node_modules", "__pycache__", ".pytest_cache",
    ".mypy_cache", ".ruff_cache", ".venv", "venv", "env", "dist",
    "build", "coverage", ".next", ".turbo", "reports",
}
TEXT_EXTENSIONS = {
    ".py", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".html",
    ".htm", ".css", ".json", ".md", ".mdx", ".txt", ".sql", ".yml",
    ".yaml", ".toml", ".ini", ".cfg",
}
SOURCE_EXTENSIONS = {".py", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".html", ".htm", ".css", ".json"}
MARKDOWN_LINK_RE = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
SECRET_PATTERNS = [
    ("private_key", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")),
    ("github_token", re.compile(r"\bgh[pousr]_[A-Za-z0-9_]{30,}\b")),
    ("aws_access_key", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("assignment", re.compile(r"(?i)\b(api[_-]?key|secret|token|password|passwd)\b\s*[:=]\s*['\"]([^'\"\s]{12,})['\"]")),
]
PLACEHOLDERS = {"replace-me", "your-api-key", "your_api_key", "placeholder", "changeme", "not-a-real-key", "example"}


@dataclass
class Finding:
    severity: str
    code: str
    title: str
    detail: str
    path: str | None = None
    line: int | None = None


class HTMLValidator(HTMLParser):
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: set[str] = set()
        self.duplicates: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for key, value in attrs:
            if key.lower() == "id" and value:
                if value in self.ids:
                    self.duplicates.add(value)
                self.ids.add(value)


def iso_now() -> str:
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()


def rel(path: Path, root: Path) -> str:
    return path.relative_to(root).as_posix()


def skip(path: Path, root: Path) -> bool:
    try:
        parts = path.relative_to(root).parts
    except ValueError:
        return True
    return any(part in SKIP_DIRS for part in parts[:-1])


def files(root: Path) -> list[Path]:
    return sorted(
        (p for p in root.rglob("*") if p.is_file() and not p.is_symlink() and not skip(p, root)),
        key=lambda p: rel(p, root).lower(),
    )


def read_text(path: Path) -> str | None:
    try:
        raw = path.read_bytes()
    except OSError:
        return None
    if b"\x00" in raw[:8192]:
        return None
    for enc in ("utf-8-sig", "utf-8", "cp1252"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            pass
    return None


def run(command: Sequence[str], cwd: Path, timeout: int = 90) -> tuple[int, str, str]:
    try:
        result = subprocess.run(list(command), cwd=cwd, text=True, encoding="utf-8", errors="replace", capture_output=True, timeout=timeout, check=False)
        return result.returncode, result.stdout, result.stderr
    except (OSError, subprocess.TimeoutExpired) as exc:
        return 127, "", str(exc)


def placeholder(value: str) -> bool:
    lowered = value.lower().replace("_", "-")
    return any(word in lowered for word in PLACEHOLDERS) or set(value) <= {"x", "X", "0", "1", "-", "_"}


def markdown_findings(path: Path, text: str, root: Path) -> list[Finding]:
    out: list[Finding] = []
    seen: set[str] = set()
    for raw in MARKDOWN_LINK_RE.findall(text):
        target = raw.strip().split()[0].strip("<>")
        if not target or target in seen:
            continue
        seen.add(target)
        low = target.lower()
        if low.startswith(("http://", "https://", "mailto:", "tel:", "data:", "javascript:", "#")):
            continue
        if any(marker in target for marker in ("${", "{{", "}}", "<%", "%>")):
            continue
        clean = urllib.parse.unquote(target.split("#", 1)[0].split("?", 1)[0])
        if not clean:
            continue
        candidate = (path.parent / clean).resolve()
        try:
            candidate.relative_to(root.resolve())
        except ValueError:
            out.append(Finding("warning", "link_escape", "Link leaves repository", target, rel(path, root)))
            continue
        if not candidate.exists():
            out.append(Finding("warning", "link_missing", "Broken local Markdown link", target, rel(path, root)))
    return out


def secret_findings(path: Path, text: str, root: Path) -> list[Finding]:
    relative = rel(path, root)
    lower = relative.lower()
    if lower.endswith((".env.example", "config.example.js")) or "/baseline/" in f"/{lower}/":
        return []
    out: list[Finding] = []
    for name, pattern in SECRET_PATTERNS:
        for match in pattern.finditer(text):
            sample = match.group(2) if match.lastindex and match.lastindex >= 2 else match.group(0)
            if placeholder(sample):
                continue
            out.append(Finding(
                "error", "possible_secret", "Possible committed credential",
                f"Matched {name}. Rotate it and load configuration outside source control.",
                relative, text.count("\n", 0, match.start()) + 1,
            ))
    return out


def css_findings(path: Path, text: str, root: Path) -> list[Finding]:
    clean = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    clean = re.sub(r"'(?:\\.|[^'\\])*'", "''", clean)
    clean = re.sub(r'"(?:\\.|[^"\\])*"', '""', clean)
    balance = 0
    for char in clean:
        if char == "{":
            balance += 1
        elif char == "}":
            balance -= 1
            if balance < 0:
                return [Finding("error", "css_braces", "Unmatched CSS closing brace", "Brace balance became negative.", rel(path, root))]
    return [] if balance == 0 else [Finding("error", "css_braces", "Unmatched CSS opening brace", f"Balance: {balance}", rel(path, root))]


def js_findings(root: Path, source_files: Iterable[Path]) -> list[Finding]:
    selected = [p for p in source_files if p.suffix.lower() in {".js", ".mjs", ".cjs"}]
    if not selected:
        return []
    node = shutil.which("node")
    if not node:
        return [Finding("warning", "node_missing", "Node.js unavailable", "JavaScript checks skipped.")]
    out: list[Finding] = []
    for path in selected:
        code, _, err = run([node, "--check", str(path)], root, 30)
        if code:
            message = next((line.strip() for line in err.splitlines() if "SyntaxError" in line), err.strip()[-600:])
            out.append(Finding("error", "javascript_syntax", "JavaScript syntax error", message or "node --check failed", rel(path, root)))
    return out


def ts_findings(root: Path, source_files: Iterable[Path]) -> list[Finding]:
    selected = [p for p in source_files if p.suffix.lower() in {".ts", ".tsx"}]
    if not selected:
        return []
    node = shutil.which("node")
    helper = root / "tools" / "check_typescript_syntax.mjs"
    if not node:
        return [Finding("warning", "node_missing", "Node.js unavailable", "TypeScript checks skipped.")]
    if not helper.exists():
        return [Finding("warning", "ts_checker_missing", "TypeScript checker missing", "tools/check_typescript_syntax.mjs")]
    code, stdout, stderr = run([node, str(helper), str(root)], root, 180)
    try:
        payload = json.loads(stdout or "{}")
    except json.JSONDecodeError:
        return [Finding("error", "ts_checker_failed", "TypeScript checker failed", (stderr or stdout).strip()[-1000:])]
    if payload.get("missing_typescript"):
        return [Finding("warning", "typescript_missing", "TypeScript package unavailable", "Run npm install; CI installs it from package-lock.json.")]
    out = [
        Finding("error", "typescript_syntax", "TypeScript syntax error", item.get("message", "Diagnostic"), item.get("path"), item.get("line"))
        for item in payload.get("errors", [])
    ]
    if code and not out:
        out.append(Finding("error", "ts_checker_failed", "TypeScript checker failed", stderr.strip()[-1000:]))
    return out


def repository_findings(root: Path) -> list[Finding]:
    out: list[Finding] = []
    for path in root.glob("Week*.zip"):
        if path.is_file():
            out.append(Finding("error", "root_archive", "Redundant source ZIP at repository root", path.name, path.name))
    if not (root / ".github" / "workflows" / "quality.yml").exists():
        out.append(Finding("error", "missing_ci", "NOVA CI workflow missing", ".github/workflows/quality.yml"))
    if (root / "package.json").exists() and not (root / "package-lock.json").exists():
        out.append(Finding("error", "missing_lockfile", "package-lock.json missing", "Run npm install once and commit the lockfile.", "package.json"))
    week_dirs = [p for p in root.iterdir() if p.is_dir() and re.fullmatch(r"Week\d+.*", p.name, re.I)]
    for week in week_dirs:
        dirs = [week, *[d for d in week.rglob("*") if d.is_dir() and not skip(d / "x", root)]]
        for directory in dirs:
            try:
                if not any(directory.iterdir()):
                    continue
            except OSError:
                continue
            if not any(p.is_file() and p.name.lower() == "readme.md" for p in directory.iterdir()):
                out.append(Finding("warning", "missing_readme", "Directory missing README.md", "Run NOVA Readme Forge.", rel(directory, root)))
    if not (root / "tests" / "python").exists():
        out.append(Finding("warning", "missing_python_tests", "Python anchor tests missing", "tests/python"))
    if not (root / "tests" / "js").exists():
        out.append(Finding("warning", "missing_js_tests", "JavaScript anchor tests missing", "tests/js"))
    return out


def write_reports(root: Path, report: dict) -> tuple[Path, Path]:
    output = root / "reports" / "nova"
    output.mkdir(parents=True, exist_ok=True)
    json_path = output / "quality_report.json"
    md_path = output / "quality_report.md"
    json_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    lines = [
        "# NOVA Quality Gate", "",
        f"- **Status:** {report['status'].upper()}",
        f"- **Files scanned:** {report['files_scanned']}",
        f"- **Errors:** {report['counts']['error']}",
        f"- **Warnings:** {report['counts']['warning']}", "",
        "| Severity | Code | Path | Detail |", "|---|---|---|---|",
    ]
    for item in report["findings"]:
        detail = str(item["detail"]).replace("|", "\\|").replace("\n", " ")
        where = (item.get("path") or "—").replace("|", "\\|")
        if item.get("line"):
            where += f":{item['line']}"
        lines.append(f"| {item['severity']} | `{item['code']}` | `{where}` | {detail} |")
    if not report["findings"]:
        lines.append("| info | `clean` | — | No findings. |")
    md_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return json_path, md_path


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="NOVA whole-repository quality gate")
    parser.add_argument("--repo", default=".")
    parser.add_argument("--strict", action="store_true")
    parser.add_argument("--syntax-only", action="store_true")
    parser.add_argument("--no-write", action="store_true")
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    root = Path(args.repo).expanduser().resolve()
    if not root.exists():
        print(f"Repository not found: {root}", file=sys.stderr)
        return 2
    started = dt.datetime.now().timestamp()
    all_files = files(root)
    findings: list[Finding] = []
    for path in all_files:
        ext = path.suffix.lower()
        if ext not in TEXT_EXTENSIONS:
            continue
        text = read_text(path)
        if text is None:
            continue
        relative = rel(path, root)
        if ext == ".py":
            try:
                ast.parse(text, filename=relative)
            except SyntaxError as exc:
                findings.append(Finding("error", "python_syntax", "Python syntax error", exc.msg, relative, exc.lineno))
        elif ext == ".json":
            try:
                json.loads(text)
            except json.JSONDecodeError as exc:
                findings.append(Finding("error", "json_syntax", "Invalid JSON", exc.msg, relative, exc.lineno))
        elif ext in {".html", ".htm"}:
            parser = HTMLValidator()
            try:
                parser.feed(text)
            except Exception as exc:
                findings.append(Finding("error", "html_parse", "HTML parse failure", str(exc), relative))
            if parser.duplicates:
                findings.append(Finding("warning", "duplicate_html_id", "Duplicate HTML ids", ", ".join(sorted(parser.duplicates)[:20]), relative))
        elif ext == ".css":
            findings.extend(css_findings(path, text, root))
        if not args.syntax_only:
            if ext in {".md", ".mdx"}:
                findings.extend(markdown_findings(path, text, root))
            findings.extend(secret_findings(path, text, root))
    findings.extend(js_findings(root, all_files))
    findings.extend(ts_findings(root, all_files))
    if not args.syntax_only:
        findings.extend(repository_findings(root))
    order = {"error": 0, "warning": 1, "info": 2}
    findings.sort(key=lambda f: (order.get(f.severity, 9), f.path or "", f.line or 0, f.code))
    counts = {kind: sum(1 for f in findings if f.severity == kind) for kind in ("error", "warning", "info")}
    report = {
        "tool": {"name": "NOVA Quality Gate", "version": VERSION},
        "generated_at": iso_now(), "repository": str(root),
        "files_scanned": len(all_files),
        "source_files_scanned": sum(1 for p in all_files if p.suffix.lower() in SOURCE_EXTENSIONS),
        "elapsed_seconds": round(dt.datetime.now().timestamp() - started, 3),
        "status": "pass" if counts["error"] == 0 else "fail",
        "counts": counts,
        "findings": [asdict(item) for item in findings],
    }
    if not args.no_write:
        jpath, mpath = write_reports(root, report)
        print(f"Report: {mpath}")
        print(f"JSON:   {jpath}")
    print(f"NOVA QUALITY: {report['status'].upper()} | errors={counts['error']} warnings={counts['warning']} files={len(all_files)}")
    for item in findings[:50]:
        where = f" {item.path}" if item.path else ""
        if item.line:
            where += f":{item.line}"
        print(f"[{item.severity.upper()}] {item.code}{where} — {item.detail}")
    if len(findings) > 50:
        print(f"... {len(findings) - 50} more findings in report.")
    return 1 if args.strict and counts["error"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
