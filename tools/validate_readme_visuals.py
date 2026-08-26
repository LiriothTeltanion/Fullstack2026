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

        text = path.read_text(encoding="utf-8")
        try:
            root = ET.fromstring(text)
        except ET.ParseError as exc:
            problems.append(f"invalid SVG XML: {relative}: {exc}")
            continue
        if root.find(f"{SVG_NAMESPACE}title") is None or root.find(f"{SVG_NAMESPACE}desc") is None:
            problems.append(f"SVG needs title and desc elements: {relative}")
        active_content_text = text.replace("http://www.w3.org/2000/svg", "")
        if UNSAFE_RE.search(active_content_text):
            problems.append(f"SVG contains unsafe or remote active content: {relative}")
        if PRIVATE_VISUAL_RE.search(text):
            problems.append(f"SVG contains private academy dashboard data: {relative}")
        if ANIMATION_RE.search(text):
            animated.append(relative)
            if "prefers-reduced-motion" not in text:
                problems.append(f"animated SVG lacks reduced-motion behavior: {relative}")

        entry = manifest_assets.get(relative)
        if entry is None:
            problems.append(f"README SVG is missing from the visual manifest: {relative}")
        elif entry.get("sha256") != sha256(path):
            problems.append(f"visual manifest hash drift: {relative}")

    if len(animated) > 1:
        problems.append(f"root README references {len(animated)} animated SVGs; maximum is 1: {animated}")

    for relative, entry in manifest_assets.items():
        path = repo.joinpath(*PurePosixPath(relative).parts)
        if not path.is_file():
            problems.append(f"manifest asset is missing: {relative}")
        elif entry.get("sha256") != sha256(path):
            problems.append(f"visual manifest hash drift: {relative}")
        if entry.get("privacy_review") != "passed_no_private_dashboard_data":
            problems.append(f"manifest privacy review is incomplete: {relative}")

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
