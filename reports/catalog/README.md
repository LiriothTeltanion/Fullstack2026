# Structure Reports

## Current catalog (2026-11-26)

- [Canonical exercise catalog](exercise_catalog.md) — 276 exercise folders indexed from Git; a map of the code, not a test result.
- `exercise_catalog_metadata.csv` — versioned structural labels and review-entry hints; semantic titles/goals/technologies are derived conservatively and do not prove runtime or assignment correctness.
- `exercise_catalog.csv` — machine-readable canonical path catalog.
- `file_inventory.csv` — indexed-blob inventory (self-entry intentionally excluded to avoid a recursive hash).
- `tree.txt` — exact-case tree for 2967 Git-indexed files.
- `rename_plan.csv` — unapproved later-wave proposals only.
- `catalog_manifest.json` — generation date, base HEAD, and stable source-index fingerprint.

Generation basis: HEAD `d0f1373f4c7f9adfd21253b68a810aaa72e9cac1` plus the staged source index fingerprint `sha256:228db4e3b731a22098eabe83ff8b0da9475b22f5963ac118d591250e30286a22`.

Regenerate with `python tools/refresh_structure_catalogs.py --repo . --write`; verify drift with `python tools/refresh_structure_catalogs.py --repo . --check`.

## Quality gate

Run `python tools/quality_gate.py --repo . --strict` for the current whole-repository check. It writes `quality_report.md` and `quality_report.json` here as local, unversioned output. A passing gate is not a course grade and does not prove interactive, browser, API, TypeScript-semantic, or SQL behavior.

Earlier versions of the regenerated catalogs remain available through Git history.
