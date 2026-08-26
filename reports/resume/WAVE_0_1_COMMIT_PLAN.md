# Wave 0–1 GitHub Desktop commit plan

> Status: **PROPOSED — no commit or remote action performed**
> Prepared: `2026-08-24T11:44:32+03:00` (`Asia/Jerusalem`)
> Branch: `chore/resume-foundation-2026-08-23`
> Base: `20f27a7a5fdd0d68a85f892438849d51d6ff82ba`

This plan turns the staged recovery patch into reviewable GitHub Desktop
commits. Select only the listed group, generate the message, compare it with the
ready text, and review the diff before clicking Commit. Do not click **Publish
branch** without an intentional remote-write decision.

## Commit 1 — Recovery baseline

**Summary**

```text
docs(audit): 🧭 record recovery baseline
```

**Files**

- `reports/resume/BASELINE_2026-08-23.md`
- `reports/resume/STRUCTURE_MAP.md`
- `reports/resume/DUPLICATE_ANALYSIS.csv`
- `reports/resume/TEST_COVERAGE_MAP.md`
- `reports/resume/OPEN_WORK_TRIAGE.md`

**Description**

```text
What changed

- Record the verified pre-change repository, structure, collision, test,
  dependency, branch, and pull-request evidence.
- Separate historical NOVA heuristics from runtime and learning evidence.

Why

- Establish a reproducible recovery baseline before canonical path changes.

Verification

- npm ci — PASS: 127 packages installed and 128 audited.
- npm test — PASS at baseline: 4 Node and 12 Python tests.
- NOVA strict no-write gate — PASS: 0 errors and 0 warnings.
- npm run lint — FAIL at baseline: Windows glob matched no files; explicit
  discovery exposed 65 legacy errors.

Known limitations

- Browser, SQL, semantic TypeScript, API, and learning mastery were not proven.

AI assistance

- OpenAI Codex performed repository archaeology and evidence reconciliation.

Creative-Signature: Lirioth Teltanion
```

## Commit 2 — Durable project and commit context

**Summary**

```text
chore(ai): 🤖 add durable project context
```

**Files**

- `AGENTS.md`
- `.ai/**`
- `.learning/**`
- `.github/copilot-instructions.md`
- `.github/INTERNAL_GUIDE.md`
- `.github/pull_request_template.md`
- `CONTRIBUTING.md`
- `reports/resume/WAVE_0_1_COMMIT_PLAN.md`

**Description**

```text
What changed

- Add repository, AI handoff, learning-evidence, and GitHub Desktop guidance.
- Pin English technical communication, Kevin Cusnir's professional identity,
  Lirioth Teltanion's portfolio identity, and the canonical Windows checkout.
- Add truthful commit and pull-request templates with evidence boundaries.

Why

- Give Kevin and future agents one durable, low-friction source of truth.

Verification

- Repository layout tests — PASS.
- Canonical path and remote identity — VERIFIED locally.
- GitHub Desktop Beta 3.6.5-beta1 support for custom instructions — VERIFIED.

Known limitations

- Copilot button entitlement remains account-dependent and UI-unverified.
- No cryptographic commit-signing key is configured.

AI assistance

- OpenAI Codex drafted and validated the repository instructions and templates.

Creative-Signature: Lirioth Teltanion
```

## Commit 3 — Canonical structure recovery

**Summary**

```text
refactor(structure): 🧭 unify canonical paths
```

**Files**

- The staged `R100`, `R095`, and `R092` paths under `Week2OOP/`,
  `Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST/`, and
  `Week5MiniProjectAndTypeScript/`.

**Description**

```text
What changed

- Merge the Week 4 Day 3 and Week 5 case-conflicting trees into canonical paths.
- Preserve True or False, Pokedex, Star Wars, Union Type Validator, and every
  complementary legacy blob.
- Normalize two exact-case navigation filenames.

Why

- Remove Windows/case-sensitive CI ambiguity without discarding student work.

Verification

- Collision accounting — PASS: 65 of 65 files reconciled.
- Hash audit — PASS: 63 exact blobs and 2 intentional README edits.
- Case-fold collision scan — PASS: 0 remaining collisions.

Known limitations

- Structural recovery does not prove browser behavior or assignment mastery.

AI assistance

- OpenAI Codex performed hash-first move planning and verification.

Creative-Signature: Lirioth Teltanion
```

## Commit 4 — Giphy credential boundary

**Summary**

```text
fix(security): 🔐 remove tracked Giphy key
```

**Files**

- `Week4AdvAsynchronousJavaScript/Day5FetchAndAsyncAwait/Exercises/ExercisesXP/README.md`
- `Week4AdvAsynchronousJavaScript/Day5FetchAndAsyncAwait/Exercises/ExercisesXP/index.html`
- `Week4AdvAsynchronousJavaScript/Day5FetchAndAsyncAwait/Exercises/ExercisesXP/js/app.js`
- `Week4AdvAsynchronousJavaScript/Day5FetchAndAsyncAwait/Exercises/ExercisesXP/js/config.example.js`

**Description**

```text
What changed

- Replace the tracked Giphy credential with an ignored local configuration.
- Add a safe placeholder and a clear missing-configuration error path.

Why

- Keep credentials outside source control while preserving the learning app.

Verification

- Targeted ESLint — PASS.
- Staged high-confidence secret scan — PASS.

Known limitations

- Browser/API behavior remains unverified.
- The historical credential remains in published Git history and may require
  provider-side rotation.

AI assistance

- OpenAI Codex implemented and reviewed the configuration boundary.

Creative-Signature: Lirioth Teltanion
```

## Commit 5 — Structural regression tooling

**Summary**

```text
test(layout): 🧪 enforce repository contracts
```

**Files**

- `.eslintignore`
- `.prettierignore`
- `.github/workflows/quality.yml`
- `package.json`
- `tests/js/math_helpers.test.mjs`
- `tests/python/_loader.py`
- `tests/python/test_repository_layout.py`
- `tools/nova_ultimate.py`
- `tools/refresh_structure_catalogs.py`
- `tools/validate_repository_structure.py`

**Description**

```text
What changed

- Add exact-index structure, link, catalog, environment, and secret checks.
- Add deterministic catalog generation and CI structural verification.
- Repair Windows ESLint source discovery without weakening its rules.

Why

- Prevent canonical-path regression and false-green repository reports.

Verification

- npm test — PASS: 4 Node tests and current Python suite.
- npm run verify:structure — PASS.
- npm run format:check — PASS.
- NOVA strict no-write gate — PASS.
- npm run lint — FAIL: 65 documented legacy errors remain.

Known limitations

- Semantic TypeScript and SQL runtime validation remain blocked.

AI assistance

- OpenAI Codex implemented the deterministic validators and regression tests.

Creative-Signature: Lirioth Teltanion
```

## Commit 6 — Current canonical evidence

**Summary**

```text
docs(reports): 📊 refresh canonical evidence
```

**Files**

- `reports/nova/**`
- `reports/resume/DECISION_LOG.md`
- `reports/resume/CONSOLIDATION_RESULT.md`

**Description**

```text
What changed

- Regenerate the exact-index inventory, tree, exercise catalog, manifest, and
  rename evidence from the canonical repository state.
- Record the accepted recovery and GitHub Desktop workflow decisions.

Why

- Keep generated evidence aligned with the paths and safeguards in Git.

Verification

- npm run catalogs:check — PASS: all seven outputs are current.
- Independent catalog audit — PASS: 124 families and 158 entry points.
- git diff --cached --check — PASS.

Known limitations

- Catalog goals remain deliberately neutral until assignment-aware Wave 2 work.

AI assistance

- OpenAI Codex generated deterministic evidence and reconciled audit findings.

Creative-Signature: Lirioth Teltanion
```

## Final Desktop review

After all local commits exist, verify History order, authorship, descriptions,
and timestamps. The branch currently has no upstream, so Desktop will display
**Publish branch**. Publishing is a separate remote action and is not part of
this plan without Kevin's explicit decision.
