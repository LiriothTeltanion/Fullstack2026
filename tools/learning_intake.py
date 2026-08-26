#!/usr/bin/env python3
"""Create and validate public-safe, Kevin-authored exercise intake records.

The tool is deliberately local and standard-library only. It has no network,
browser, clipboard, OCR, authentication, submission, or LMS-state capability.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import tempfile
import unicodedata
from datetime import datetime
from pathlib import Path, PurePosixPath
from typing import Any
from zoneinfo import ZoneInfo


SCHEMA_VERSION = 1
TIMEZONE_NAME = "Asia/Jerusalem"
TIMEZONE = ZoneInfo(TIMEZONE_NAME)
QUEUE_RELATIVE = PurePosixPath(".learning/intake/queue.json")
PRIVATE_INTAKE_RELATIVE = PurePosixPath(".private/intake")

WEEK_ROOTS = {
    f"week-{number}": root
    for number, root in enumerate(
        (
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
        ),
        start=1,
    )
}

SOURCE_KEYS = {
    "week_id",
    "public_safe_title",
    "kevin_summary",
    "done_when",
    "item_kind",
    "priority",
    "planned_repository_path",
    "privacy_reviewed",
}
PUBLIC_KEYS = SOURCE_KEYS | {
    "id",
    "queue_state",
    "source_basis",
    "requirement_fidelity",
    "repository_state",
    "learning_state",
    "recorded_at",
}

ITEM_KINDS = {"exercise", "daily_challenge", "project", "review", "unknown"}
PRIORITIES = {"now", "later", "optional"}
QUEUE_STATES = {"queued", "selected", "deferred", "closed"}

FORBIDDEN_CONTENT = (
    ("URL", re.compile(r"(?:https?://|www\.|octopus\.developers\.institute)", re.IGNORECASE)),
    ("HTML", re.compile(r"<[a-z!/][^>]*>", re.IGNORECASE)),
    ("Markdown image", re.compile(r"!\[[^\]]*\]\(")),
    ("base64 payload", re.compile(r"(?:data:[^;]+;base64,|[A-Za-z0-9+/]{96,}={0,2})", re.IGNORECASE)),
    ("email address", re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.IGNORECASE)),
    ("telephone number", re.compile(r"(?<!\w)\+?\d[\d .()\-]{7,}\d(?!\w)")),
    ("credential-like text", re.compile(r"(?:\bgh[pousr]_[A-Za-z0-9]{20,}|\bsk-[A-Za-z0-9_-]{20,}|\bBearer\s+[A-Za-z0-9._-]{12,}|\b(?:cookie|token|password|session)\s*[:=])", re.IGNORECASE)),
)


class IntakeError(ValueError):
    """Raised when an intake value would violate the public-safe contract."""


def now_iso() -> str:
    """Return a second-precision ISO 8601 timestamp for Asia/Jerusalem."""

    return datetime.now(TIMEZONE).replace(microsecond=0).isoformat()


def week_number(week_id: str) -> int:
    if week_id not in WEEK_ROOTS:
        raise IntakeError("week_id must be week-1 through week-12")
    return int(week_id.removeprefix("week-"))


def validate_safe_text(value: Any, field: str, minimum: int, maximum: int) -> str:
    if not isinstance(value, str):
        raise IntakeError(f"{field} must be text")
    normalized = " ".join(value.strip().split())
    if not minimum <= len(normalized) <= maximum:
        raise IntakeError(f"{field} must contain {minimum}–{maximum} characters")
    for label, pattern in FORBIDDEN_CONTENT:
        if pattern.search(normalized):
            raise IntakeError(f"{field} contains forbidden {label.lower()}")
    return normalized


def normalize_done_when(value: Any) -> list[str]:
    if value is None:
        return []
    if not isinstance(value, list) or len(value) > 3:
        raise IntakeError("done_when must be a list with at most three statements")
    return [validate_safe_text(item, "done_when item", 3, 200) for item in value]


def normalize_repository_path(value: Any, week_id: str, *, batch: bool) -> str | None:
    number = week_number(week_id)
    if value in (None, ""):
        return None
    if number >= 7:
        mode = "batch intake" if batch else "intake"
        raise IntakeError(f"Weeks 7–12 {mode} must leave planned_repository_path null")
    if not isinstance(value, str):
        raise IntakeError("planned_repository_path must be text or null")
    if "\\" in value:
        raise IntakeError("planned_repository_path must use repository-relative forward slashes")
    pure = PurePosixPath(value.strip())
    if pure.is_absolute() or not pure.parts or ".." in pure.parts or "." in pure.parts:
        raise IntakeError("planned_repository_path must stay inside the repository")
    if pure.parts[0] != WEEK_ROOTS[week_id]:
        raise IntakeError(f"planned_repository_path must begin with {WEEK_ROOTS[week_id]}")
    return pure.as_posix()


def slugify(value: str) -> str:
    ascii_value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_value.casefold()).strip("-")
    return (slug[:42].rstrip("-") or "exercise")


def stable_id(week_id: str, title: str, summary: str) -> str:
    fingerprint = hashlib.sha256(f"{week_id}\n{title}\n{summary}".encode("utf-8")).hexdigest()[:6]
    return f"w{week_number(week_id):02d}-{slugify(title)}-{fingerprint}"


def path_is_present(path: str | None, repo: Path | None, known_paths: set[str] | None) -> bool:
    if path is None:
        return False
    if known_paths is not None:
        return path in known_paths
    if repo is None:
        return False
    return repo.joinpath(*PurePosixPath(path).parts).exists()


def build_public_record(
    source: dict[str, Any],
    repo: Path,
    *,
    batch: bool = False,
    recorded_at: str | None = None,
) -> dict[str, Any]:
    if not isinstance(source, dict):
        raise IntakeError("each intake item must be a JSON object")
    extras = sorted(set(source) - SOURCE_KEYS)
    if extras:
        raise IntakeError(f"unsupported or private field(s): {', '.join(extras)}")

    week_id = source.get("week_id")
    if not isinstance(week_id, str):
        raise IntakeError("week_id is required")
    week_number(week_id)
    title = validate_safe_text(source.get("public_safe_title"), "public_safe_title", 3, 80)
    summary = validate_safe_text(source.get("kevin_summary"), "kevin_summary", 20, 600)
    done_when = normalize_done_when(source.get("done_when", []))

    item_kind = source.get("item_kind", "unknown")
    if item_kind not in ITEM_KINDS:
        raise IntakeError(f"item_kind must be one of: {', '.join(sorted(ITEM_KINDS))}")
    priority = source.get("priority", "later")
    if priority not in PRIORITIES:
        raise IntakeError(f"priority must be one of: {', '.join(sorted(PRIORITIES))}")
    if source.get("privacy_reviewed") is not True:
        raise IntakeError("privacy_reviewed must be true after Kevin reviews the public-safe boundary")

    planned_path = normalize_repository_path(
        source.get("planned_repository_path"), week_id, batch=batch
    )
    repository_state = "present" if path_is_present(planned_path, repo, None) else "missing"
    return {
        "id": stable_id(week_id, title, summary),
        "week_id": week_id,
        "public_safe_title": title,
        "kevin_summary": summary,
        "done_when": done_when,
        "item_kind": item_kind,
        "priority": priority,
        "queue_state": "queued",
        "planned_repository_path": planned_path,
        "source_basis": "kevin_authored_summary",
        "requirement_fidelity": "unverified",
        "repository_state": repository_state,
        "learning_state": "unknown",
        "privacy_reviewed": True,
        "recorded_at": recorded_at or now_iso(),
    }


def validate_timestamp(value: Any) -> str | None:
    if not isinstance(value, str):
        return "recorded_at must be an ISO 8601 string"
    try:
        parsed = datetime.fromisoformat(value)
    except ValueError:
        return "recorded_at is not valid ISO 8601"
    if parsed.tzinfo is None or parsed.utcoffset() is None:
        return "recorded_at must include a UTC offset"
    expected_offset = parsed.astimezone(TIMEZONE).utcoffset()
    if parsed.utcoffset() != expected_offset:
        return f"recorded_at must use the {TIMEZONE_NAME} offset for that instant"
    return None


def validate_public_record(
    record: Any,
    *,
    repo: Path | None = None,
    known_paths: set[str] | None = None,
) -> list[str]:
    if not isinstance(record, dict):
        return ["item must be a JSON object"]
    problems: list[str] = []
    keys = set(record)
    missing = sorted(PUBLIC_KEYS - keys)
    extras = sorted(keys - PUBLIC_KEYS)
    if missing:
        problems.append(f"missing field(s): {', '.join(missing)}")
    if extras:
        problems.append(f"unsupported or private field(s): {', '.join(extras)}")
    if missing or extras:
        return problems

    try:
        week_id = record["week_id"]
        week_number(week_id)
        title = validate_safe_text(record["public_safe_title"], "public_safe_title", 3, 80)
        summary = validate_safe_text(record["kevin_summary"], "kevin_summary", 20, 600)
        normalize_done_when(record["done_when"])
        planned_path = normalize_repository_path(
            record["planned_repository_path"], week_id, batch=False
        )
    except IntakeError as exc:
        problems.append(str(exc))
        return problems

    if record["id"] != stable_id(week_id, title, summary):
        problems.append("id does not match the deterministic public-safe fingerprint")
    if record["item_kind"] not in ITEM_KINDS:
        problems.append("item_kind is invalid")
    if record["priority"] not in PRIORITIES:
        problems.append("priority is invalid")
    if record["queue_state"] not in QUEUE_STATES:
        problems.append("queue_state is invalid")
    forced = {
        "source_basis": "kevin_authored_summary",
        "requirement_fidelity": "unverified",
        "learning_state": "unknown",
        "privacy_reviewed": True,
    }
    for field, expected in forced.items():
        if record[field] != expected:
            problems.append(f"{field} must remain {expected!r}")
    expected_state = "present" if path_is_present(planned_path, repo, known_paths) else "missing"
    if record["repository_state"] != expected_state:
        problems.append(
            f"repository_state must be {expected_state!r} for planned_repository_path"
        )
    timestamp_problem = validate_timestamp(record["recorded_at"])
    if timestamp_problem:
        problems.append(timestamp_problem)
    return problems


def validate_queue_data(
    data: Any,
    *,
    repo: Path | None = None,
    known_paths: set[str] | None = None,
) -> list[str]:
    if not isinstance(data, dict):
        return ["queue must be a JSON object"]
    if set(data) != {"schema_version", "items"}:
        return ["queue must contain only schema_version and items"]
    problems: list[str] = []
    if data.get("schema_version") != SCHEMA_VERSION:
        problems.append(f"schema_version must be {SCHEMA_VERSION}")
    items = data.get("items")
    if not isinstance(items, list):
        problems.append("items must be a list")
        return problems
    seen: set[str] = set()
    for index, item in enumerate(items, start=1):
        item_problems = validate_public_record(item, repo=repo, known_paths=known_paths)
        problems.extend(f"item {index}: {problem}" for problem in item_problems)
        if isinstance(item, dict) and isinstance(item.get("id"), str):
            if item["id"] in seen:
                problems.append(f"item {index}: duplicate id {item['id']}")
            seen.add(item["id"])
    return problems


def queue_path(repo: Path) -> Path:
    return repo.joinpath(*QUEUE_RELATIVE.parts)


def load_queue(repo: Path) -> dict[str, Any]:
    path = queue_path(repo)
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise IntakeError(f"cannot read {QUEUE_RELATIVE.as_posix()}: {exc}") from exc
    problems = validate_queue_data(data, repo=repo)
    if problems:
        raise IntakeError("queue validation failed:\n- " + "\n- ".join(problems))
    return data


def write_queue(repo: Path, data: dict[str, Any]) -> None:
    path = queue_path(repo)
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    temporary_name: str | None = None
    try:
        with tempfile.NamedTemporaryFile(
            "w", encoding="utf-8", newline="\n", dir=path.parent, delete=False
        ) as temporary:
            temporary.write(payload)
            temporary.flush()
            os.fsync(temporary.fileno())
            temporary_name = temporary.name
        os.replace(temporary_name, path)
    finally:
        if temporary_name and os.path.exists(temporary_name):
            os.unlink(temporary_name)


def resolve_private_path(repo: Path, candidate: Path) -> Path:
    resolved_repo = repo.resolve()
    private_root = resolved_repo.joinpath(*PRIVATE_INTAKE_RELATIVE.parts).resolve()
    resolved = (resolved_repo / candidate).resolve() if not candidate.is_absolute() else candidate.resolve()
    try:
        resolved.relative_to(private_root)
    except ValueError as exc:
        raise IntakeError("batch files must resolve inside .private/intake/") from exc
    return resolved


def load_batch(path: Path) -> list[dict[str, Any]]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise IntakeError(f"cannot read batch file: {exc}") from exc
    if not isinstance(data, dict) or set(data) != {"schema_version", "items"}:
        raise IntakeError("batch must contain only schema_version and items")
    if data["schema_version"] != SCHEMA_VERSION or not isinstance(data["items"], list):
        raise IntakeError(f"batch schema_version must be {SCHEMA_VERSION} and items must be a list")
    return data["items"]


def import_batch(
    repo: Path,
    input_path: Path,
    *,
    apply: bool = False,
    recorded_at: str | None = None,
) -> list[dict[str, Any]]:
    source_path = resolve_private_path(repo, input_path)
    sources = load_batch(source_path)
    queue = load_queue(repo)
    existing_ids = {item["id"] for item in queue["items"]}
    records: list[dict[str, Any]] = []
    for index, source in enumerate(sources, start=1):
        try:
            record = build_public_record(
                source, repo, batch=True, recorded_at=recorded_at
            )
        except IntakeError as exc:
            raise IntakeError(f"batch item {index}: {exc}") from exc
        if record["id"] in existing_ids:
            raise IntakeError(f"batch item {index}: duplicate id {record['id']}")
        existing_ids.add(record["id"])
        records.append(record)
    candidate = {"schema_version": SCHEMA_VERSION, "items": [*queue["items"], *records]}
    problems = validate_queue_data(candidate, repo=repo)
    if problems:
        raise IntakeError("candidate queue validation failed:\n- " + "\n- ".join(problems))
    if apply:
        write_queue(repo, candidate)
    return records


def next_item(data: dict[str, Any]) -> dict[str, Any] | None:
    priority_order = {"now": 0, "later": 1, "optional": 2}
    candidates = [item for item in data["items"] if item["queue_state"] in {"selected", "queued"}]
    if not candidates:
        return None
    return min(
        enumerate(candidates),
        key=lambda pair: (
            0 if pair[1]["queue_state"] == "selected" else 1,
            priority_order[pair[1]["priority"]],
            pair[0],
        ),
    )[1]


def print_json(value: Any) -> None:
    print(json.dumps(value, indent=2, ensure_ascii=False))


def prompt_choice(label: str, allowed: set[str], default: str) -> str:
    rendered = "/".join(sorted(allowed))
    while True:
        value = input(f"{label} [{rendered}] ({default}): ").strip() or default
        if value in allowed:
            return value
        print(f"Choose one of: {rendered}")


def command_add(repo: Path) -> int:
    print("Use only Kevin's own words. Do not paste Octopus prompts, URLs, scores, or private data.\n")
    week_raw = input("Week number [1-12]: ").strip()
    week_id = f"week-{week_raw}"
    source: dict[str, Any] = {
        "week_id": week_id,
        "public_safe_title": input("Short public-safe title: ").strip(),
        "kevin_summary": input("What must the solution do, in your own words: ").strip(),
        "item_kind": prompt_choice("Item kind", ITEM_KINDS, "unknown"),
        "priority": prompt_choice("Your work priority", PRIORITIES, "later"),
    }
    done_when = input("Up to three own-words done checks, separated by | (optional): ").strip()
    source["done_when"] = [part.strip() for part in done_when.split("|") if part.strip()]
    if week_raw.isdigit() and int(week_raw) <= 6:
        path = input("Existing Week path to review (optional): ").strip()
        source["planned_repository_path"] = path or None
    else:
        source["planned_repository_path"] = None
    attestation = input("Type OWN-WORDS to confirm this contains no copied/private course material: ").strip()
    source["privacy_reviewed"] = attestation == "OWN-WORDS"
    record = build_public_record(source, repo)
    print("\nExact public record:\n")
    print_json(record)
    if input("\nType WRITE to add this record, or press Enter to cancel: ").strip() != "WRITE":
        print("Cancelled; no file changed.")
        return 0
    queue = load_queue(repo)
    if any(item["id"] == record["id"] for item in queue["items"]):
        raise IntakeError(f"duplicate id {record['id']}")
    queue["items"].append(record)
    write_queue(repo, queue)
    print(f"Added {record['id']} to {QUEUE_RELATIVE.as_posix()}")
    return 0


def command_template(repo: Path, output: Path | None, force: bool) -> int:
    target = resolve_private_path(repo, output or Path(".private/intake/kevin-batch.json"))
    if target.exists() and not force:
        raise IntakeError(f"template already exists: {target}; use --force to replace it")
    target.parent.mkdir(parents=True, exist_ok=True)
    template = {
        "schema_version": SCHEMA_VERSION,
        "items": [
            {
                "week_id": "week-7",
                "public_safe_title": "",
                "kevin_summary": "",
                "done_when": [],
                "item_kind": "unknown",
                "priority": "later",
                "planned_repository_path": None,
                "privacy_reviewed": True,
            }
        ],
    }
    target.write_text(json.dumps(template, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(f"Created ignored private template: {target}")
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=Path.cwd(), help="repository root")
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("add", help="interactively add one Kevin-authored summary")
    template = subparsers.add_parser("template", help="create an ignored private batch template")
    template.add_argument("--output", type=Path)
    template.add_argument("--force", action="store_true")
    importer = subparsers.add_parser("import", help="preview or atomically apply a private batch")
    importer.add_argument("path", type=Path)
    importer.add_argument("--apply", action="store_true")
    subparsers.add_parser("next", help="print the next public-safe queue item")
    subparsers.add_parser("validate", help="validate the tracked public queue")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    repo = args.repo.expanduser().resolve()
    if not (repo / ".git").exists():
        print(f"[FAIL] Not a repository root: {repo}", file=sys.stderr)
        return 2
    try:
        if args.command == "add":
            return command_add(repo)
        if args.command == "template":
            return command_template(repo, args.output, args.force)
        if args.command == "import":
            records = import_batch(repo, args.path, apply=args.apply)
            print("Exact public record preview:\n")
            print_json(records)
            print(
                f"\n{'Applied' if args.apply else 'Dry run only; no file changed.'} "
                f"{len(records)} validated item(s)."
            )
            return 0
        if args.command == "next":
            item = next_item(load_queue(repo))
            if item is None:
                print("Queue is empty. Add one own-words summary with: npm run intake -- add")
            else:
                print_json(item)
            return 0
        problems = validate_queue_data(load_queue(repo), repo=repo)
        if problems:
            raise IntakeError("\n- ".join(problems))
        print("[PASS] Public-safe exercise intake queue")
        return 0
    except IntakeError as exc:
        print(f"[FAIL] {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
