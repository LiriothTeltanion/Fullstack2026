#!/usr/bin/env python3
"""Validate human-readable display titles without changing stable Git paths."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path


SAFE_PATH_RE = re.compile(r"^[A-Za-z0-9._/-]+$")
DAY_ROOT_RE = re.compile(r"^(?:Day\d+|RemoteLearning)")


def run_git(repo: Path, *args: str) -> bytes:
    result = subprocess.run(
        ["git", *args],
        cwd=repo,
        capture_output=True,
        check=False,
    )
    if result.returncode != 0:
        message = result.stderr.decode("utf-8", errors="replace").strip()
        raise RuntimeError(message or f"git {' '.join(args)} failed")
    return result.stdout


def indexed_paths(repo: Path) -> set[str]:
    return {
        item.decode("utf-8", errors="strict")
        for item in run_git(repo, "ls-files", "-z").split(b"\0")
        if item
    }


def indexed_directories(files: set[str]) -> set[str]:
    directories: set[str] = set()
    for file in files:
        parts = file.split("/")
        for index in range(1, len(parts)):
            directories.add("/".join(parts[:index]))
    return directories


def first_heading(repo: Path, relative: str) -> str | None:
    for line in (repo / relative).read_text(encoding="utf-8").splitlines():
        if line.startswith("# "):
            return line
    return None


def validate_entry(
    entry: dict[str, object],
    directories: set[str],
    errors: list[str],
) -> None:
    path = entry.get("path")
    icon = entry.get("icon")
    title = entry.get("title")
    display_title = entry.get("display_title")

    if not all(isinstance(value, str) and value for value in (path, icon, title, display_title)):
        errors.append(f"display entry has an empty or non-string field: {entry!r}")
        return

    assert isinstance(path, str)
    assert isinstance(icon, str)
    assert isinstance(title, str)
    assert isinstance(display_title, str)

    if path != "." and path not in directories:
        errors.append(f"display path is not indexed: {path}")
    if path != "." and (not path.isascii() or not SAFE_PATH_RE.fullmatch(path)):
        errors.append(f"stable path is not ASCII/shell-safe: {path}")
    if icon in path:
        errors.append(f"display icon leaked into the stable path: {path}")
    if display_title != f"{icon} {title}":
        errors.append(
            f"display title must equal '<icon> <title>' for {path}: {display_title!r}"
        )


def validate(repo: Path) -> list[str]:
    errors: list[str] = []
    manifest_path = repo / ".learning/display-map.json"
    if not manifest_path.is_file():
        return ["missing .learning/display-map.json"]

    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return [f"display map is not valid UTF-8 JSON: {exc}"]

    files = indexed_paths(repo)
    directories = indexed_directories(files)
    weeks = manifest.get("weeks")
    infrastructure = manifest.get("infrastructure")
    policy = manifest.get("policy")

    if not isinstance(weeks, list) or len(weeks) != 12:
        errors.append("display map must define exactly twelve weeks")
        weeks = []
    if not isinstance(infrastructure, list):
        errors.append("display map infrastructure must be a list")
        infrastructure = []
    if not isinstance(policy, dict):
        errors.append("display map policy must be an object")
        policy = {}

    for required_policy in (
        "icons_are_display_only",
        "stable_paths_must_be_ascii",
        "official_assignment_names_must_be_source_backed",
    ):
        if policy.get(required_policy) is not True:
            errors.append(f"display policy must enable {required_policy}")
    if policy.get("physical_paths_renamed") is not False:
        errors.append("display policy must record that physical paths were not renamed")

    root = manifest.get("root")
    if isinstance(root, dict):
        validate_entry(root, directories, errors)
    else:
        errors.append("display map root must be an object")

    display_top_level: set[str] = set()
    for entry in infrastructure:
        if isinstance(entry, dict):
            validate_entry(entry, directories, errors)
            path = entry.get("path")
            if isinstance(path, str):
                display_top_level.add(path)
        else:
            errors.append(f"infrastructure entry must be an object: {entry!r}")

    expected_week_ids = [f"week-{number}" for number in range(1, 13)]
    actual_week_ids: list[str] = []
    week_paths: set[str] = set()
    mapped_day_paths: set[str] = set()

    for week in weeks:
        if not isinstance(week, dict):
            errors.append(f"week entry must be an object: {week!r}")
            continue
        validate_entry(week, directories, errors)
        week_id = week.get("id")
        week_path = week.get("path")
        readme = week.get("readme")
        days = week.get("days")
        if isinstance(week_id, str):
            actual_week_ids.append(week_id)
        if isinstance(week_path, str):
            week_paths.add(week_path)
            display_top_level.add(week_path)
        if not isinstance(readme, str) or readme not in files:
            errors.append(f"week README is not indexed: {readme!r}")
        elif isinstance(week.get("display_title"), str):
            expected_heading = f"# {week['display_title']}"
            if first_heading(repo, readme) != expected_heading:
                errors.append(f"week heading drift: {readme} must start with {expected_heading!r}")
        if not isinstance(days, list):
            errors.append(f"days must be a list for {week_path}")
            continue
        for day in days:
            if not isinstance(day, dict):
                errors.append(f"day entry must be an object: {day!r}")
                continue
            validate_entry(day, directories, errors)
            day_path = day.get("path")
            display_title = day.get("display_title")
            if not isinstance(day_path, str):
                continue
            mapped_day_paths.add(day_path)
            readme_path = f"{day_path}/README.md"
            if readme_path not in files:
                errors.append(f"day README is not indexed: {readme_path}")
            elif isinstance(display_title, str):
                expected_heading = f"# {display_title}"
                if first_heading(repo, readme_path) != expected_heading:
                    errors.append(
                        f"day heading drift: {readme_path} must start with {expected_heading!r}"
                    )

    if actual_week_ids != expected_week_ids:
        errors.append(
            f"week display order must be numeric 1–12: found {actual_week_ids!r}"
        )

    actual_top_level = {path for path in directories if "/" not in path}
    if display_top_level != actual_top_level:
        missing = sorted(actual_top_level - display_top_level)
        extra = sorted(display_top_level - actual_top_level)
        errors.append(
            f"top-level display coverage drift: missing={missing!r} extra={extra!r}"
        )

    actual_day_paths = {
        path
        for path in directories
        if len(path.split("/")) == 2
        and path.split("/", 1)[0] in week_paths
        and DAY_ROOT_RE.match(path.split("/", 1)[1])
    }
    if mapped_day_paths != actual_day_paths:
        missing = sorted(actual_day_paths - mapped_day_paths)
        extra = sorted(mapped_day_paths - actual_day_paths)
        errors.append(f"day display coverage drift: missing={missing!r} extra={extra!r}")

    root_readme = (repo / "README.md").read_text(encoding="utf-8")
    if ".learning/display-map.json" not in root_readme:
        errors.append("root README must link to .learning/display-map.json")

    gitignore = (repo / ".gitignore").read_text(encoding="utf-8")
    if ".private/" not in gitignore.splitlines():
        errors.append(".gitignore must exclude the local .private/ intake workspace")
    if any(path.startswith(".private/") for path in files):
        errors.append("private Octopus intake files must never be indexed")

    return errors


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", default=".", help="Repository root")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    repo = Path(args.repo).resolve()
    try:
        errors = validate(repo)
    except (OSError, RuntimeError, UnicodeError) as exc:
        print(f"[FAIL] display-title validation could not run: {exc}")
        return 1

    if errors:
        for error in errors:
            print(f"[FAIL] {error}")
        print(f"\nDISPLAY TITLE VALIDATION FAILED: {len(errors)} issue(s)")
        return 1

    manifest = json.loads((repo / ".learning/display-map.json").read_text(encoding="utf-8"))
    day_count = sum(len(week["days"]) for week in manifest["weeks"])
    print(
        "[PASS] display-title contract: "
        f"{len(manifest['infrastructure'])} infrastructure roots, "
        f"{len(manifest['weeks'])} weeks, and {day_count} day/remote roots use "
        "readable icon-led labels while stable paths remain unchanged"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
