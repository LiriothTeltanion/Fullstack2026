# Open work triage

> Historical snapshot only. The live governance state and completed conservative
> cleanup are recorded in
> [GitHub Governance Audit — 2026-08-24](GITHUB_GOVERNANCE_AUDIT_2026-08-24.md).
> The original text below is intentionally preserved as pre-cleanup evidence.

> Read-only snapshot: 2026-08-24, using locally visible refs plus `gh pr list`. No branch or PR was merged, closed, deleted, rebased, or pushed.

## Branch inventory

- Local branches: 3 (`main`, `codex/add-a-tailored-.gitignore-file`, and `chore/resume-foundation-2026-08-23`).
- Visible `origin/*` branches excluding the symbolic origin ref: 52.
- Remote branches already ancestors of `main`: 39. These look superseded from commit topology, but no deletion is authorized.
- Local `codex/add-a-tailored-.gitignore-file` is an ancestor of `main` and has no unique commit relative to `main`.
- Three older Codex PR branches retain commits not in `main`; they require content review rather than automatic closure.
- Nine Dependabot branches each retain one update commit relative to `main`.

## Open pull requests

| PR | Branch | Updated | Read-only recommendation |
|---:|---|---|---|
| #51 | `dependabot/npm_and_yarn/js-yaml-4.3.1` | 2026-08-12 | Relevant to one current high advisory; review with the complete tooling update strategy. |
| #50 | `dependabot/github_actions/actions/setup-python-7` | 2026-08-01 | Review independently after Wave 1; do not mix with structure recovery. |
| #49 | `dependabot/npm_and_yarn/multi-f601f89c47` | 2026-07-18 | Most relevant bundled lint/tooling candidate; test against the 65 real lint findings before merge. |
| #48 | `dependabot/npm_and_yarn/eslint-config-prettier-10.1.8` | 2026-07-18 | Coordinate with ESLint/typescript-eslint compatibility. |
| #47 | `dependabot/npm_and_yarn/typescript-7.0.2` | 2026-07-18 | Preview/major tooling change; isolate and validate semantic checks. |
| #46 | `dependabot/npm_and_yarn/typescript-eslint/eslint-plugin-8.64.0` | 2026-07-18 | Review together with parser/ESLint compatibility. |
| #45 | `dependabot/npm_and_yarn/eslint-10.7.0` | 2026-07-18 | Major ESLint migration; requires flat-config/tooling work, not a blind merge. |
| #44 | `dependabot/npm_and_yarn/typescript-eslint/parser-8.64.0` | 2026-07-18 | Review together with plugin/ESLint. |
| #43 | `dependabot/github_actions/actions/setup-node-7` | 2026-07-15 | Review independently after Wave 1. |
| #40 | `codex/update-readme.md-metadata-and-changelog` | 2025-10-09 | Two unique commits; stale public metadata likely conflicts with current v1.1.1 docs. Inspect manually, likely superseded. |
| #2 | `codex/create-readme.md-for-fullstack2026` | 2025-09-26 | One unique README commit; current root README is much newer. Inspect for any unique prose, then likely supersede. |
| #1 | `codex/normalize-folder-naming-conventions` | 2025-09-26 | One unique rename commit spanning several old paths. Do not merge into current structure without a manifest review. |

## Unique-commit notes

- PR #2: `232b27b Rewrite README in English` (README-only).
- PR #1: `595c011 Rename List and Strings script to alphanumeric` (14-path rename/documentation diff from its merge base).
- PR #40: `66a0b31 Update README metadata for October 2025 release` plus merge commit `23d8376` (README-only current diff).
- Each open Dependabot branch has one update commit. The dependency branches overlap and should not be merged independently without compatibility testing.

## Recommended later action

After Wave 1 is reviewed, create a separate dependency/tooling wave that starts from the 65 findings now exposed by deterministic lint discovery, then evaluates the bundled PR #49 and current audit advisories. Remote cleanup remains a separate Kevin-approved action.
