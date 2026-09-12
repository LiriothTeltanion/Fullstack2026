#!/usr/bin/env python3
"""Validate the public README visual contract and its local manifest."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path, PurePosixPath


IMG_TAG_RE = re.compile(r"<img\s+[^>]*>", re.IGNORECASE)
ATTRIBUTE_RE = re.compile(r"(?P<name>[A-Za-z_:][-A-Za-z0-9_:.]*)=[\"'](?P<value>.*?)[\"']")
ANIMATION_RE = re.compile(r"<animate(?:Motion|Transform)?\b|\banimation\s*:", re.IGNORECASE)
UNSAFE_RE = re.compile(
    r"<script\b|<foreignObject\b|javascript:|\bon(?:load|click|error)\s*=|https?://",
    re.IGNORECASE,
)
PRIVATE_VISUAL_RE = re.compile(
    r"octopus\.developers\.institute/courses|WEB_FS|EXPERIENCE POINTS|INSTRUCTOR TEAM|"
    r"COMPLETION RATE|MY PAYMENT|MY ATTENDANCE|MY PLANNING",
    re.IGNORECASE,
)
SVG_NAMESPACE = "{http://www.w3.org/2000/svg}"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def root_image_references(readme: str) -> list[tuple[str, str]]:
    references: list[tuple[str, str]] = []
    for tag in IMG_TAG_RE.findall(readme):
        attributes = {match.group("name").lower(): match.group("value") for match in ATTRIBUTE_RE.finditer(tag)}
        source = attributes.get("src", "")
        if source.startswith(("./", "assets/")):
            references.append((source.removeprefix("./"), attributes.get("alt", "")))
    return references


def html_image_references(markdown: str) -> list[tuple[str, str]]:
    """Return HTML image sources and alt text from one Markdown document."""

    references: list[tuple[str, str]] = []
    for tag in IMG_TAG_RE.findall(markdown):
        attributes = {match.group("name").lower(): match.group("value") for match in ATTRIBUTE_RE.finditer(tag)}
        source = attributes.get("src", "").strip()
        if source:
            references.append((source, attributes.get("alt", "")))
    return references


def validate_manifest_consumers(
    repo: Path,
    manifest_assets: dict[str, dict[str, object]],
    problems: list[str],
) -> None:
    """Keep nested README alt text synchronized with manifested visual truth."""

    excluded_parts = {".git", ".nova", "node_modules", "dist", "build", ".venv"}
    resolved_repo = repo.resolve()
    for markdown_path in repo.rglob("*.md"):
        if any(part in excluded_parts for part in markdown_path.relative_to(repo).parts):
            continue
        markdown_relative = markdown_path.relative_to(repo).as_posix()
        local_references: list[tuple[str, str]] = []
        for source, alt_text in html_image_references(markdown_path.read_text(encoding="utf-8")):
            if source.startswith(("http://", "https://", "data:", "#")):
                continue
            source_path = PurePosixPath(source.replace("\\", "/"))
            if source_path.is_absolute():
                continue
            resolved_asset = markdown_path.parent.joinpath(*source_path.parts).resolve()
            try:
                relative_asset = resolved_asset.relative_to(resolved_repo).as_posix()
            except ValueError:
                continue
            local_references.append((relative_asset, alt_text))

        has_manifested_visual = any(relative in manifest_assets for relative, _ in local_references)
        for relative_asset, alt_text in local_references:
            entry = manifest_assets.get(relative_asset)
            if entry is None:
                if has_manifested_visual and relative_asset.lower().endswith(".svg"):
                    problems.append(
                        "manifested visual consumer references unmanifested SVG: "
                        f"{markdown_relative}: {relative_asset}"
                    )
                continue
            expected_alt = str(entry.get("alt_text", "")).strip()
            actual_alt = alt_text.strip()
            if not actual_alt:
                problems.append(
                    f"manifested visual has empty consumer alt text: {markdown_relative}: {relative_asset}"
                )
            elif expected_alt and actual_alt != expected_alt:
                problems.append(
                    f"manifested visual alt text drift: {markdown_relative}: {relative_asset}"
                )


def validate_svg(
    relative: str,
    path: Path,
    problems: list[str],
    manifest_entry: dict[str, object] | None = None,
) -> bool:
    """Validate one local SVG and return whether it contains animation."""

    text = path.read_text(encoding="utf-8")
    try:
        root = ET.fromstring(text)
    except ET.ParseError as exc:
        problems.append(f"invalid SVG XML: {relative}: {exc}")
        return False

    if root.find(f"{SVG_NAMESPACE}title") is None or root.find(f"{SVG_NAMESPACE}desc") is None:
        problems.append(f"SVG needs title and desc elements: {relative}")

    active_content_text = text.replace("http://www.w3.org/2000/svg", "")
    if UNSAFE_RE.search(active_content_text):
        problems.append(f"SVG contains unsafe or remote active content: {relative}")
    if PRIVATE_VISUAL_RE.search(text):
        problems.append(f"SVG contains private academy dashboard data: {relative}")

    animated = ANIMATION_RE.search(text) is not None
    if animated and "prefers-reduced-motion" not in text:
        problems.append(f"animated SVG lacks reduced-motion behavior: {relative}")

    if manifest_entry is not None:
        if "motion_required" not in manifest_entry:
            problems.append(f"visual manifest must classify motion_required: {relative}")
            motion_required = False
        else:
            motion_required = manifest_entry["motion_required"]

        if not isinstance(motion_required, bool):
            problems.append(f"visual manifest motion_required must be boolean: {relative}")
        elif motion_required:
            if not animated:
                problems.append(f"narrative SVG requires purposeful motion: {relative}")
            for field in ("motion_story", "motion_qa"):
                if not str(manifest_entry.get(field, "")).strip():
                    problems.append(f"narrative SVG is missing {field}: {relative}")

        width = root.get("width", "").strip()
        height = root.get("height", "").strip()
        actual_dimensions = f"{width}x{height}"
        expected_dimensions = str(manifest_entry.get("dimensions", "")).strip()
        if expected_dimensions != actual_dimensions:
            problems.append(
                f"visual manifest dimensions drift: {relative}: "
                f"expected {expected_dimensions!r}, found {actual_dimensions!r}"
            )

        actual_view_box = " ".join(root.get("viewBox", "").split())
        expected_view_box = " ".join(str(manifest_entry.get("view_box", "")).split())
        if expected_view_box != actual_view_box:
            problems.append(
                f"visual manifest viewBox drift: {relative}: "
                f"expected {expected_view_box!r}, found {actual_view_box!r}"
            )

    return animated


def validate(repo: Path) -> list[str]:
    problems: list[str] = []
    readme_path = repo / "README.md"
    manifest_path = repo / "assets/readme/visual_manifest.json"
    if not readme_path.is_file():
        return ["README.md is missing"]
    if not manifest_path.is_file():
        return ["assets/readme/visual_manifest.json is missing"]

    references = root_image_references(readme_path.read_text(encoding="utf-8"))
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest_assets = {entry["path"]: entry for entry in manifest.get("assets", [])}
    animated: list[str] = []

    validate_manifest_consumers(repo, manifest_assets, problems)

    for relative, alt_text in references:
        pure = PurePosixPath(relative)
        if pure.is_absolute() or ".." in pure.parts:
            problems.append(f"README image escapes the repository: {relative}")
            continue
        path = repo.joinpath(*pure.parts)
        if not path.is_file():
            problems.append(f"README image is missing: {relative}")
            continue
        if not alt_text.strip():
            problems.append(f"README content image has empty alt text: {relative}")
        if path.suffix.lower() != ".svg":
            continue

        entry = manifest_assets.get(relative)
        if validate_svg(relative, path, problems, entry):
            animated.append(relative)

        if entry is None:
            problems.append(f"README SVG is missing from the visual manifest: {relative}")
        elif entry.get("sha256") != sha256(path):
            problems.append(f"visual manifest hash drift: {relative}")

    if len(animated) > 1:
        problems.append(f"root README references {len(animated)} animated SVGs; maximum is 1: {animated}")

    for relative, entry in manifest_assets.items():
        pure = PurePosixPath(relative)
        if pure.is_absolute() or ".." in pure.parts:
            problems.append(f"visual manifest path escapes the repository: {relative}")
            continue
        path = repo.joinpath(*pure.parts)
        if not path.is_file():
            problems.append(f"manifest asset is missing: {relative}")
            continue
        if entry.get("sha256") != sha256(path):
            problems.append(f"visual manifest hash drift: {relative}")
        if entry.get("privacy_review") != "passed_no_private_dashboard_data":
            problems.append(f"manifest privacy review is incomplete: {relative}")
        if path.suffix.lower() == ".svg":
            validate_svg(relative, path, problems, entry)

    return sorted(set(problems))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=Path.cwd())
    args = parser.parse_args()
    repo = args.repo.resolve()
    problems = validate(repo)
    if problems:
        print("[FAIL] README visual contract")
        for problem in problems:
            print(f"  - {problem}")
        return 1
    print("[PASS] README visual contract: local assets, manifest, privacy, XML, and motion boundaries")
    return 0


if __name__ == "__main__":
    sys.exit(main())
