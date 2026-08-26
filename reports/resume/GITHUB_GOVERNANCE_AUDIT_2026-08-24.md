# GitHub Governance Audit — 2026-08-24

- Owner: **Kevin Cusnir**
- Creative signature: **Lirioth Teltanion**
- Repository: [LiriothTeltanion/Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)
- Canonical checkout: `C:\Users\kevin\OneDrive\Escritorio\NovaDev\002_PROJECTS_NEXUS\040_LEARNING_ACADEMY\_042_Fullstack2026`
- Initial evidence timestamp: `2026-08-24T21:45:12+03:00` (`Asia/Jerusalem`)
- Final evidence timestamp: `2026-08-24T22:24:11+03:00` (`Asia/Jerusalem`)

## Executive result

This was a conservative cleanup, not a history rewrite.

- Initial remote state: **53 non-`main` branches** and **11 open pull requests**.
- Deleted: **42 branches whose tips were fully reachable from `main`**.
- Closed and deleted after content comparison: **8 superseded pull requests and
  their branches** (`#1`, `#2`, `#40`, `#44`, `#45`, `#46`, `#48`, and `#49`).
- Preserved from the original inventory: **3 branches with unique required work**
  (`#43`, `#47`, and `#50`).
- Created separately: one tested ESLint migration branch and
  [pull request #55](https://github.com/LiriothTeltanion/Fullstack2026/pull/55).
- Final remote state: **4 non-`main` branches** and **4 open pull requests**.
- `main` was not rewritten, force-pushed, or directly modified during this
  migration batch.

The arithmetic is intentional: **50 of the original 53 non-`main` branches were
removed**, three original unique branches remain, and one new migration branch
was added for review.

## Plain-language glossary

- **Branch:** a movable bookmark pointing to a version of the repository.
  Deleting a branch that is already merged removes the bookmark, not the code
  already stored in `main`.
- **Pull request (PR):** a review proposal asking to bring one branch into
  another branch, normally `main`.
- **Reachable from `main`:** Git can prove that every commit at the branch tip is
  already part of `main`.
- **Unique commit:** a commit identity not present in `main`. It requires content
  review; it is not automatically valuable or automatically obsolete.
- **Superseded:** the old branch's required outcome is already represented by a
  newer implementation or a newer tested PR.
- **Ruleset:** GitHub's safety rail around `main`.
- **NOVA Quality Gate:** the automated checklist that validates security,
  formatting, lint baseline, TypeScript, repository structure, and tests.

## Initial open pull-request inventory and disposition

| PR | Initial branch | Reachability at audit | Final disposition | Evidence |
|---:|---|---|---|---|
| [#1](https://github.com/LiriothTeltanion/Fullstack2026/pull/1) | `codex/normalize-folder-naming-conventions` | One commit not reachable | Closed; branch deleted | Later `main` commits contain the intended normalized paths and an explicit later Todo List refactor. |
| [#2](https://github.com/LiriothTeltanion/Fullstack2026/pull/2) | `codex/create-readme.md-for-fullstack2026` | One commit not reachable | Closed; branch deleted | The early five-week README is fully superseded by the current professional twelve-week README. |
| [#40](https://github.com/LiriothTeltanion/Fullstack2026/pull/40) | `codex/update-readme.md-metadata-and-changelog` | Two commits not reachable | Closed; branch deleted | October 2025 metadata is superseded by the August 2026 v1.2.0 README and complete changelog. |
| [#43](https://github.com/LiriothTeltanion/Fullstack2026/pull/43) | `dependabot/github_actions/actions/setup-node-7` | One unique commit | Preserved | `main` still uses `actions/setup-node@v6`; rebase and test separately. |
| [#44](https://github.com/LiriothTeltanion/Fullstack2026/pull/44) | `dependabot/npm_and_yarn/typescript-eslint/parser-8.64.0` | One unique commit | Closed; branch deleted | Exact parser intent was contained in the coordinated migration. |
| [#45](https://github.com/LiriothTeltanion/Fullstack2026/pull/45) | `dependabot/npm_and_yarn/eslint-10.7.0` | One unique commit | Closed; branch deleted | Exact ESLint intent was contained in the coordinated migration. |
| [#46](https://github.com/LiriothTeltanion/Fullstack2026/pull/46) | `dependabot/npm_and_yarn/typescript-eslint/eslint-plugin-8.64.0` | One unique commit | Closed; branch deleted | Exact plugin intent was contained in the coordinated migration. |
| [#47](https://github.com/LiriothTeltanion/Fullstack2026/pull/47) | `dependabot/npm_and_yarn/typescript-7.0.2` | One unique commit | Preserved and deferred | Current typescript-eslint 8.68.0 documents TypeScript support below 6.1.0. |
| [#48](https://github.com/LiriothTeltanion/Fullstack2026/pull/48) | `dependabot/npm_and_yarn/eslint-config-prettier-10.1.8` | One unique commit | Closed after #55 passed; branch deleted | Tested PR #55 contains the same patched 10.1.8 target inside the complete migration. |
| [#49](https://github.com/LiriothTeltanion/Fullstack2026/pull/49) | `dependabot/npm_and_yarn/multi-f601f89c47` | One unique commit | Closed after #55 passed; branch deleted | Tested PR #55 rebuilds the coordinated migration from current `main` with supported versions and regression checks. |
| [#50](https://github.com/LiriothTeltanion/Fullstack2026/pull/50) | `dependabot/github_actions/actions/setup-python-7` | One unique commit | Preserved | `main` still uses `actions/setup-python@v6`; rebase and test separately. |

Each closed PR received a public evidence comment before closure. None was
closed merely because it was old.

## Fully merged branch inventory

The following **42 branch tips were ancestors of `origin/main`** with zero
commits ahead and zero changed paths. Their associated PRs were already merged,
so the remote branch bookmarks were deleted.

| Merged PR | Deleted branch |
|---:|---|
| #3 | `codex/setup-package.json-and-tsconfig.json` |
| #4 | `codex/consolidate-week3javascriptanddom-folder` |
| #5 | `codex/add-a-tailored-.gitignore-file` |
| #6 | `codex/refactor-scripts-to-use-main-function` |
| #7 | `codex/update-readme.md-for-week-3-javascript` |
| #8 | `codex/rename-liststrings-folder-and-script` |
| #9 | `codex/update-readme-files-for-python-exercises` |
| #10 | `codex/update-readme-files-with-correct-script-names` |
| #11 | `codex/update-readme-run-command-code-blocks` |
| #12 | `codex/update-readmes-to-match-script-content` |
| #13 | `codex/update-readme-for-exercises-tasks` |
| #14 | `codex/update-readme-for-xp-tasks-and-climate-monitoring` |
| #15 | `codex/update-day5-readme-for-anagram-checker` |
| #16 | `codex/update-directory-name-for-consistency` |
| #17 | `codex/rename-files-and-update-imports-and-docs` |
| #18 | `codex/update-readme-formatting-and-references` |
| #19 | `codex/update-readme-opening-line-format` |
| #20 | `codex/add-emoji-and-fix-filename-in-readmes` |
| #21 | `codex/add-emojis-to-readme-titles-and-sections` |
| #22 | `codex/update-readme-for-caesarcipher.py` |
| #23 | `codex/update-readme.md-structure-and-instructions` |
| #24 | `codex/update-readme.md-for-exercises-directory` |
| #25 | `codex/update-readme.md-with-exercises-and-commands` |
| #26 | `codex/add-integer-input-utility-and-update-exercises` |
| #27 | `codex/refactor-build-up-string-script` |
| #28 | `codex/wrap-datetime.strptime-in-try/except` |
| #29 | `codex/refactor-exercisesxp.py-for-main-function` |
| #30 | `codex/translate-and-proofread-week-1-documentation` |
| #31 | `codex/update-readme-with-latest-changes` |
| #32 | `codex/edit-challenges.py-to-sanitize-words` |
| #33 | `codex/refactor-exception-handling-in-tictactoe.py` |
| #34 | `codex/update-xpgoldfunctions.py-for-gender-validation` |
| #35 | `codex/edit-oldmcdonaldsfarm.py-structure` |
| #36 | `codex/review-and-translate-readme-sections` |
| #37 | `codex/decide-on-project-mit-license` |
| #38 | `codex/rename-directories-and-verify-links` |
| #39 | `codex/refactor-event-listeners-with-delegation` |
| #41 | `codex/conduct-full-re-audit-of-repository` |
| #42 | `codex/add-eslint-and-prettier-configuration` |
| #52 | `chore/resume-foundation-2026-08-23` |
| #53 | `chore/finalize-v1.2.0` |
| #54 | `chore/governance-g1-main-protection` |

Four corresponding local merged branch bookmarks were also deleted with the
safe `git branch -d` operation. No force deletion or history rewrite was used.

## Final open PR and branch inventory

| PR | Remote branch | Tip | Ahead / behind `origin/main` | Reason it remains |
|---:|---|---|---:|---|
| [#43](https://github.com/LiriothTeltanion/Fullstack2026/pull/43) | `dependabot/github_actions/actions/setup-node-7` | `04094aa` | 1 ahead / 12 behind | Unique Node action upgrade; needs an isolated rebase/test. |
| [#47](https://github.com/LiriothTeltanion/Fullstack2026/pull/47) | `dependabot/npm_and_yarn/typescript-7.0.2` | `89d74c0` | 1 ahead / 9 behind | Unique TypeScript 7 proposal; currently outside supported parser compatibility. |
| [#50](https://github.com/LiriothTeltanion/Fullstack2026/pull/50) | `dependabot/github_actions/actions/setup-python-7` | `c524789` | 1 ahead / 9 behind | Unique Python action upgrade; needs an isolated rebase/test. |
| [#55](https://github.com/LiriothTeltanion/Fullstack2026/pull/55) | `chore/eslint-10-flat-config` | `f168246` | 1 ahead / 0 behind | New coordinated migration awaiting Kevin's merge decision. |

`main` is the fifth remote branch and remains at `ee650f3` for this audit. Local
`main` and `origin/main` were `0 ahead / 0 behind` before the migration branch
was created.

## Protected-main ruleset

The active lightweight ruleset is
[Protect main · PR + NOVA CI](https://github.com/LiriothTeltanion/Fullstack2026/rules/21315698).

It applies to the default branch and:

- blocks branch deletion and non-fast-forward history rewrites;
- requires changes to arrive through a pull request;
- requires review conversations to be resolved;
- requires the exact status check `Syntax, security, docs and tests` from the
  `NOVA Quality Gate` workflow;
- keeps the approval count at zero for a friction-light solo-learning workflow;
- allows the repository administrator to bypass only through a pull request,
  not through an invisible direct push.

## Separate ESLint migration evidence

Pull request #55 was created from clean current `main` and is not merged by this
audit.

- ESLint `10.9.1`
- `@eslint/js` `10.0.1`
- typescript-eslint `8.68.0`
- TypeScript retained at `5.9.3`
- `eslint-config-prettier` `10.1.8`
- Node.js 24 type definitions aligned with Node.js 24 CI
- `minimatch` `10.2.6` and `brace-expansion` `5.0.9` through supported dependency
  declarations rather than unsafe global major overrides
- `npm audit`: zero vulnerabilities
- formatting: passed
- exact ESLint learning baseline: 65 documented findings across four rules
- TypeScript semantic anchor: passed
- canonical structure: 880 indexed files and 274 directories
- tests: JavaScript 4/4 and Python 30/30
- NOVA no-write gate: zero errors, zero warnings, 1,055 files scanned
- remote required `NOVA Quality Gate`: passed in 24 seconds
- independent read-only review: approved with no blockers

No curriculum source file under `Week*/` changed in this migration.

## Account-setting safety boundary

This repository-governance batch did **not** create, upload, rotate, or expose an
SSH key, GPG key, signing key, password, token, cookie, or Octopus credential.
It also did not enable GitHub Vigilant mode. Commit-signing setup remains a
separate controlled pilot because enabling Vigilant mode before reliable signing
would label ordinary unsigned commits as unverified.

## Remaining controlled work

1. Kevin reviews PR #55 and merges it only if the green diff and explanation are
   acceptable.
2. Rebuild and test the `setup-node@v7` and `setup-python@v7` changes as separate
   one-purpose branches; close their old Dependabot PRs only after green
   replacements exist.
3. Keep TypeScript 7 deferred until the official typescript-eslint support range
   changes, then test it on its own branch.
4. Run a separate public-profile integrity batch for the release-body formatting,
   multilingual Fullstack2026 evidence, pin order, status/privacy choices, and a
   signing pilot.
5. Resume the course chronologically from Week 1 with privacy-safe own-words
   exercise intake, then continue through Week 7 and beyond.

## Reproduction commands

```powershell
git fetch origin --prune
git for-each-ref --format='%(refname:strip=3)' refs/remotes/origin
git rev-list --count origin/main..origin/<branch>
git rev-list --count origin/<branch>..origin/main
gh pr list --state open --limit 100
gh pr view 55 --json state,mergeStateStatus,statusCheckRollup
gh api repos/LiriothTeltanion/Fullstack2026/rulesets/21315698
npm ci --ignore-scripts
npm audit --audit-level=high
npm run format:check
npm run lint:baseline
npm run typecheck:anchor
npm run verify:structure
npm test
python -B tools/nova_quality_gate.py --repo . --strict --no-write
```
