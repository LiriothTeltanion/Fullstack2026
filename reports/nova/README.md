# NOVA Reports — Status and Lineage

## Current structural evidence (2026-11-02)

- [Canonical exercise catalog](exercise_catalog.md) — 124 indexed exercise families; runtime and mastery remain unverified.
- `exercise_catalog_metadata.csv` — versioned structural labels and review-entry hints; semantic titles/goals/technologies are derived conservatively and do not prove runtime or assignment correctness.
- `exercise_catalog.csv` — machine-readable canonical path catalog.
- `file_inventory.csv` — indexed-blob inventory (self-entry intentionally excluded to avoid a recursive hash).
- `tree.txt` — exact-case tree for 886 Git-indexed files.
- `rename_plan.csv` — unapproved later-wave proposals only.
- `catalog_manifest.json` — generation date, base HEAD, and stable source-index fingerprint.
- [`../resume/`](../resume/) — Wave 0 baseline, duplicate accounting, decisions, test map, and open-work triage.

Generation basis: HEAD `de5cf161a13c94e6b355e62328818f0592c619c9` plus the staged source index fingerprint `sha256:8d99f06b4db24fcc172479a441175472e3c74cf85c274a46eb35242a2b62fbfa`. The versioned metadata source is included; generated catalog outputs are excluded to avoid self-reference.

Regenerate with `python tools/refresh_structure_catalogs.py --repo . --write`; verify drift with `python tools/refresh_structure_catalogs.py --repo . --check`.

## Quality snapshots

- [Offline readiness dashboard](nova_repo_dashboard.html)
- [NOVA audit](nova_repo_audit.md)
- [Quality gate report](quality_report.md)
- [Stored NOVA command manifest](NOVA_UPDATE_REPORT.md) — check its embedded timestamp before use.

Read each embedded generation timestamp before treating a quality snapshot as current. Static readiness is not a course grade and does not prove interactive, browser, API, TypeScript-semantic, or SQL behavior.

## Superseded narrative snapshots

`README.nova.generated.md`, `next_actions.md`, and `SUMMARY.txt` preserve earlier generated guidance. They are not the current source of truth; use `reports/resume/`, `.learning/`, and the current Git index instead. Earlier versions of the regenerated catalogs remain available through Git history.
