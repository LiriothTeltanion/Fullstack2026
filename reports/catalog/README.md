# Structure Reports

## Current catalog (2026-11-25)

- [Canonical exercise catalog](exercise_catalog.md) — 276 exercise folders indexed from Git; a map of the code, not a test result.
- `exercise_catalog_metadata.csv` — versioned structural labels and review-entry hints; semantic titles/goals/technologies are derived conservatively and do not prove runtime or assignment correctness.
- `exercise_catalog.csv` — machine-readable canonical path catalog.
- `file_inventory.csv` — indexed-blob inventory (self-entry intentionally excluded to avoid a recursive hash).
- `tree.txt` — exact-case tree for 2922 Git-indexed files.
- `rename_plan.csv` — unapproved later-wave proposals only.
- `catalog_manifest.json` — generation date, base HEAD, and stable source-index fingerprint.

Generation basis: HEAD `119d65bf6bade3ec483c46ded09ed38a3928b5dd` plus the staged source index fingerprint `sha256:1620db0c26cf213fb9fe8fc8bbe4acd501a5a095b4dd76d7b3466565f16677f8`.

Regenerate with `python tools/refresh_structure_catalogs.py --repo . --write`; verify drift with `python tools/refresh_structure_catalogs.py --repo . --check`.

## Quality gate

Run `python tools/quality_gate.py --repo . --strict` for the current whole-repository check. It writes `quality_report.md` and `quality_report.json` here as local, unversioned output. A passing gate is not a course grade and does not prove interactive, browser, API, TypeScript-semantic, or SQL behavior.

Earlier versions of the regenerated catalogs remain available through Git history.
