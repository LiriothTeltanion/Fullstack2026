# Resume foundation decision log

This log records Wave 0–1 decisions. Repository state and official assignment material outrank generated reports and model memory.

## D-001 — Operate in the real clone

- **Status:** Accepted
- **Decision:** Work in `_042_Fullstack2026`, the only local directory with the expected remote and HEAD.
- **Evidence:** The adjacent `042_Fullstack2026` directory contains only `README_NOVA.md` and no `.git`.
- **Consequence:** No root-directory relocation occurs in Wave 1.

## D-002 — Use one recovery branch and one writer

- **Status:** Accepted
- **Decision:** Use `chore/resume-foundation-2026-08-23`; parallel agents are read-only and the primary agent owns all mutations.
- **Reason:** Prevent conflicting structural edits and keep the diff reviewable.

## D-003 — Canonical curriculum paths

- **Status:** Accepted
- **Canonical Week 4 Day 3:** `Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST`
- **Canonical Week 5 root:** `Week5MiniProjectAndTypeScript`
- **Canonical Week 5 Day 1:** `Day1MiniProject`
- **Canonical spellings:** `DailyChallenge` and `Exercises`
- **Retained spelling:** `Week6DatabasesAndNodejs` in this wave; a `NodeJS` cosmetic rename is unrelated to collision recovery.

## D-004 — Treat the Git index as collision authority

- **Status:** Accepted
- **Decision:** Compare and migrate exact tracked blobs, not only physical Windows directories.
- **Evidence:** Windows merges the case variants physically while the index contains 10 colliding directory groups and 12 unique legacy-path blobs.
- **Method:** Record SHA-256/size/target first; remove legacy index entries and add the same working-tree bytes at canonical paths. Verify pre/post hashes. Avoid the existing whole-directory NOVA move routine.

## D-005 — Preserve all duplicate-tree content

- **Status:** Accepted
- **Decision:** Account for all 65 tracked files in the Week 4/5 collision families. Move 12 unique legacy-path blobs; do not delete a content conflict automatically.
- **Evidence:** `DUPLICATE_ANALYSIS.csv` reports 0 same-relative overlaps, 0 content conflicts, and 0 cross-tree identical blobs.

## D-006 — Keep Wave 1 documentation repairs narrow

- **Status:** Accepted
- **Decision:** Repair canonical paths, active catalogs, and source-of-truth links only. Defer root/week visual rewrite and unsupported completion narratives to Wave 2.
- **Reason:** Structural truth must stabilize before visual polish.

## D-007 — Do not guess the SQL assignment

- **Status:** Accepted; blocker remains
- **Decision:** Leave the Day 2 `email` query unchanged in Wave 1.
- **Evidence:** Day 1 locally defines `customers(id, first_name, last_name)`, but the Day 2 answer adds an unsupported email assumption. No local official assignment prompt was found.
- **Required follow-up:** Compare against the Developers Institute LMS/source prompt. If it asks only to exclude the primary key, select `first_name, last_name`; if it explicitly asks for email, update schema and seed data consistently, then add a regression test.

## D-008 — No dependency migration in the structural wave

- **Status:** Accepted
- **Decision:** Do not merge Dependabot work or add frameworks in Wave 1.
- **Reason:** The Windows-safe ESLint discovery command is repaired in Wave 1, but its 65 existing findings, two development advisories, and missing nested TypeScript install need a focused dependency/tooling wave.

## D-009 — Evidence states and mastery remain separate

- **Status:** Accepted
- **Decision:** Use repository states `missing`, `present`, `runnable`, `verified`, `explained`, `mastered`, and `portfolio`; use `unknown` when learning evidence is absent.
- **Rule:** Automated checks may raise repository evidence to `verified` for a bounded item, but never grant `explained` or `mastered` automatically.

## D-010 — Week 4/5 consolidation completed with zero unaccounted loss

- **Status:** Accepted and executed on 2026-08-24
- **Decision:** Move the 12 complementary legacy-index blobs individually through collision-free temporary paths into the canonical Week 4/5 trees.
- **Evidence:** Canonical counts are 26 Week 4 Day 3 files and 39 Week 5 files, equal to the 23+3 and 30+9 baseline totals. Ten moved blobs retain the exact recorded SHA-256. The two moved project READMEs were then changed deliberately to describe their actual two-file inline implementations, replace incorrect TypeScript goals, and label unverified browser/learning evidence; their original hashes remain recorded in `DUPLICATE_ANALYSIS.csv` and recoverable from base HEAD.
- **Result:** Zero unaccounted mismatches; no student source, HTML, stylesheet, package, TypeScript, or configuration blob was discarded.

## D-011 — Exact-case navigation repairs are structural

- **Status:** Accepted and executed on 2026-08-24
- **Decision:** Rename `TrueOrFalse/index1.html` to the documented `index.html` and `AnagramChecker/readme.md` to canonical `README.md`.
- **Evidence:** Both are Git `R100` renames and repair existing exact-case/local-link assumptions without changing content.

## D-012 — Regenerate, do not patch, July catalogs

- **Status:** Accepted and executed on 2026-08-24
- **Decision:** Replace stale catalog snapshots with deterministic outputs from the exact Git index using `tools/refresh_structure_catalogs.py`.
- **Evidence:** The July inventory omitted 473 current indexed files, retained two deleted ZIP entries, and had 168 mismatched hashes among 376 mappable rows. A string-only repair would have preserved false metadata.
- **Result:** The current catalog, blob inventory, exact-case tree, rename plan, README lineage, and manifest share a stable source-index fingerprint. `--check` fails if generated evidence drifts.

## D-013 — Keep the Wave 1 catalog structural, not editorial

- **Status:** Accepted and executed on 2026-08-24
- **Decision:** Store only exact paths, structural kind/tier labels, and review-entry hints in `exercise_catalog_metadata.csv`. Derive exact-basename titles, unique path slugs, file/inline-markup technologies, and a neutral evidence-boundary goal deterministically.
- **Reason:** The inherited July catalog reused broad week-level prose across unrelated exercises, producing false titles, goals, kinds, and technology claims. A complete prompt-aware editorial review belongs to Wave 2.
- **Result:** The Wave 1 catalog is exhaustive for indexed source ownership and navigation without presenting generated prose as assignment truth, runtime proof, or learning evidence.

## D-014 — Use GitHub Desktop's native commit customization path

- **Status:** Accepted and executed on 2026-08-24T11:44:32+03:00
- **Decision:** Use `.github/copilot-instructions.md` to shape GitHub Desktop
  Copilot Summary and Description output, with `CONTRIBUTING.md` as the human
  fallback and `.github/pull_request_template.md` as the remote review handoff.
- **Evidence:** GitHub Desktop Beta `3.6.5-beta1` is installed and running.
  Current official documentation and the installed implementation support
  repository custom instructions for generated commit messages.
- **Constraint:** Git's `commit.template` is not presented as a Desktop feature;
  Desktop supplies its UI message directly to Git. No strict hook was added
  because it would not prefill the visible fields and could add avoidable
  friction.
- **Identity:** Pin the existing effective author identity locally as Kevin
  Cusnir without publishing the email value. Keep Lirioth Teltanion as a
  clearly labeled `Creative-Signature` portfolio trailer, not a false co-author,
  DCO sign-off, or cryptographic-signature claim.
- **Timestamp rule:** Git author/committer metadata and Desktop History are the
  authoritative commit clock. Use exact ISO 8601 `Asia/Jerusalem` timestamps
  for time-sensitive audits, handoffs, workarounds, and expiry notes; do not add
  stale timestamps to ordinary source comments.
- **Remote boundary:** The current branch has no upstream, so Desktop will show
  `Publish branch`. No publish, push, commit, or account setting change is part
  of this decision without Kevin's explicit authorization.
