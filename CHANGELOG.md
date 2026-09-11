# Changelog

Notable repository-presentation, quality-tooling and release changes
are recorded here. Curriculum exercise history remains visible; this changelog
does not reinterpret early work as production-ready code.

## [Unreleased]

### Added

- Added source-safe Week 1 Day 1 evidence records and focused regression suites
  for Exercises XP 1–9, XP Gold 1–2, and XP Ninja 1–5.
- Added a separate local-behavior audit and five regression tests for the
  existing Daily Challenge without claiming current official DI alignment.
- Added one accessible, reduced-motion Day 1 evidence map that distinguishes
  verified repository behavior from unverified learning and Octopus state.

### Changed

- Synchronized the root, Week 1, Day 1, Exercises, XP, Gold, Ninja, and Daily
  guides around the same dated evidence boundary while preserving the July 2026
  readiness metrics, explanatory text, and underlying generated assets as
  explicitly historical material.
- Simplified the Ninja implementation to beginner-readable functions, separated
  the terminal and launcher exercises, retained predictions as comments, and
  replaced the fixed attempt cap with a documented blank-line exit.
- Revised the living Day 1 evidence map in place so eight README consumers show
  Ninja as repository-verified and Daily as locally tested but officially
  unverified; learning and Octopus states remain unverified.
- Reworked that shared Day 1 map into a visible twelve-second learning-signal
  sequence with concept waypoints, evidence-card confirmations, and a manual
  next-action cue while preserving a complete reduced-motion static view.
- Removed the ten legacy animated-SVG placements from the five current Day 1
  guides because those older assets do not implement the current accessibility
  and reduced-motion contract; the files and historical text remain preserved.
- Replaced six additional legacy Ninja and Daily image placements with preserved
  asset links inside historical sections, preventing stale heuristic graphics
  from competing with the current evidence map.
- Extended the visual contract to validate manifested nested SVGs, including
  their XML, dimensions, view box, privacy, reduced-motion behavior, and freedom
  from unmanifested SVG companions in the same current consumer guide.
- Added a forward narrative-motion contract so every manifested graphic carries
  an explicit motion classification and narrative assets declare their purpose
  and browser QA instead of regressing to barely perceptible or decorative motion.

- Migrated the root linter from deprecated ESLint 8 configuration to ESLint 10
  flat config with the supported typescript-eslint 8 toolchain.
- Replaced the separate TypeScript parser/plugin declarations with the current
  `typescript-eslint` package and kept the verified 65-finding curriculum
  baseline stable for a later source-aware learning pass.
- Aligned the declared Node.js engine range and Node type definitions with the
  supported ESLint 10 runtime used by the protected Node.js 24 CI job.
- Added a bounded semantic TypeScript check for the strict Union Type Validator
  project and aligned the NOVA generator and repository-contract tests with the
  new toolchain.

### Fixed

- Corrected the Day 1 XP arithmetic explanation to `(99**3) * 8 = 7762392` and
  enforced the supplied strict roller-coaster boundary where 145 cm is not over
  145 cm.
- Made the Day 1 XP Gold season helper reject months outside 1–12 and return the
  exact plain-text season names expected by the supplied exercise behavior.
- Corrected the Ninja text count from 452 formatting-dependent characters to
  445 characters in one continuous logical string and removed decorative console
  output that failed under a Windows CP1252 stream.
- Repaired the Daily Challenge's nondeterministic shuffle doctest so it verifies
  preserved length and characters instead of one random permutation.

### Security

- Resolved `eslint-config-prettier` to the patched 10.1.8 line after reviewing
  the 2025 supply-chain advisory that affected 10.1.6 and 10.1.7.
- Removed the legacy global `minimatch` and `brace-expansion` overrides so the
  ESLint 10 dependency graph receives its declared patched major versions.

### Validation

- Six focused XP Gold tests verify exact repeated output, all twelve month
  mappings, seasonal boundaries, invalid direct values, interactive retries,
  and exact plain-text season output.
- The XP and XP Gold subtotal passes 16 focused tests: ten for Exercises XP and
  six for XP Gold.
- Seven Ninja tests verify PATH and launcher explanations, ten predicted boolean
  outputs, the normalized text count, case-insensitive A rejection, and strict
  longest-record behavior.
- Five additional tests and six doctest examples protect the existing Daily
  artifact while its official source alignment remains unverified.
- The Day 1 focused checkpoint now contains 23 requirement-aligned XP, Gold, and
  Ninja tests plus 5 local-only Daily regression tests.
- Seven timed browser frames show 1.2712% to 8.6598% pixel change between
  consecutive motion checkpoints; desktop, 390-CSS-pixel mobile, light, dark,
  grayscale, and forced reduced-motion renders remain complete and legible.
- Repository structure passes for 890 indexed files and 275 indexed directories,
  including exact-case links, deterministic catalogs, source-safe intake,
  display titles, privacy, and the expanded visual contract.
- The complete local suite passes 4 JavaScript tests and 65 Python tests (69
  total); `npm audit` reports zero known vulnerabilities; and the strict
  no-write NOVA Quality Gate reports zero errors and zero warnings across 863
  scanned files.

- ESLint 10.9.1 discovers the same 65 inherited findings as the pre-migration
  baseline: 39 explicit `any`, 22 unused variables, three constant conditions,
  and one debugger statement.
- The protected CI workflow now verifies that exact ESLint baseline, formatting,
  dependency audit, and the TypeScript semantic anchor on every pull request.
- A generator regression test keeps the canonical flat config, dependency
  defaults, Node runtime contract, and protected CI workflow synchronized.
- The native TypeScript 7.0.2 CLI with Node.js 24 definitions passes the strict
  semantic anchor without emitting files; ESLint remains isolated on the
  separately pinned TypeScript 6.0.2 compatibility package.

### Known limitations

- TypeScript 7 lint parsing remains deferred because typescript-eslint 8.68.0
  currently documents support for TypeScript versions below 6.1.0; only the
  bounded semantic anchor uses the native TypeScript 7 CLI.

## [1.2.0] - 2026-08-24

### Added

- Extended the canonical learning structure to all twelve course weeks while
  labeling Weeks 7–12 as scaffolds whose official assignment content remains
  pending.
- Added source-of-truth learning maps, progress and review records, AI handoff
  guidance, contribution instructions, a pull-request template, and personalized
  GitHub Desktop commit guidance.
- Added icon-led display titles for infrastructure, Week, and Day/Remote areas
  without placing emoji in physical Git paths.
- Added a standard-library own-words exercise-intake CLI, strict public queue and
  schema, ignored private batch workflow, atomic imports, privacy validation, and
  ten focused tests.
- Added deterministic structure catalogs and validators for exact paths, links,
  private intake exclusion, public-safe queue records, README visuals, and display
  titles.

### Changed

- Consolidated the conflicting Week 4 and Week 5 casing/path variants without
  deleting coursework, and normalized the Anagram Checker README filename.
- Rebuilt the public landing page as the twelve-week NOVA Course Observatory with
  one reduced-motion-safe animated hero, a static evidence map, and a static
  source-backed technology constellation.
- Reordered the learning queue to verify existing work chronologically from Week
  1 through Week 6 before starting Week 7.
- Replaced a tracked external API credential pattern with an ignored local
  configuration boundary and a safe example file.

### Security

- Added compatible transitive overrides for `brace-expansion` `2.1.4` and
  `js-yaml` `4.3.1` after new high-severity development-tool advisories appeared.
- Confirmed that Git indexes zero `.private/` files and that the public repository
  contains no authenticated Octopus prompt, rubric, quiz, score, attempt,
  submission, credential, or profile data.

### Validation

- `npm ci` installs 127 packages from the committed lockfile.
- `npm audit` reports zero known vulnerabilities.
- Structure verification passes for 879 indexed files, 274 indexed directories,
  32 required foundation files, twelve canonical Week roots, deterministic
  catalogs, privacy boundaries, source-safe intake, visuals, and display titles.
- JavaScript tests pass `4/4`; Python tests pass `29/29`.
- The archive-wide Prettier check passes.
- The strict NOVA no-write gate passes with zero errors and zero warnings across
  1,054 scanned files.
- Desktop, 390-pixel overview, grayscale, and reduced-motion README media renders
  were inspected locally in Microsoft Edge.

### Release verification

- Pull request `#52` merged the reviewed candidate tree into `main` without a
  merge-time content change.
- Pull-request CI and the post-merge `main` NOVA Quality Gate completed
  successfully on GitHub.
- The public GitHub README was inspected on desktop and at a 430-pixel mobile
  viewport; all three primary SVGs loaded from `main`, and the quality badge
  reported `passing`.
- Release gate: publish the annotated `v1.2.0` tag and GitHub Release only
  after the release-finalization commit passes the same `main` quality gate.

### Known limitations

- Repository-wide ESLint still reports the same 65 inherited exercise errors;
  these require source-aware chronological review rather than blanket rewrites.
- The root ESLint 8 toolchain is deprecated and needs a separate reviewed major
  migration.
- Weeks 7–12 remain truthful scaffolds, not claims that official assignments,
  submissions, execution evidence, or learning mastery are present.

## [1.1.1] - 2026-07-18

### Security

- Pinned transitive `minimatch` resolution to the patched `9.0.7` or newer
  line, closing the high-severity development-tool ReDoS alerts reported after
  the 1.1.0 publication without changing curriculum runtime behavior.

### Validation

- `npm audit` reports zero known vulnerabilities.
- JavaScript/TypeScript anchor tests, Python tests, Prettier and the NOVA strict
  quality gate remain green.

## [1.1.0] - 2026-07-18

### Fixed

- Restored the root `README.md` as the intended public GitHub landing page by
  replacing the conflicting `.github/README.md` with
  `.github/INTERNAL_GUIDE.md`.
- Updated the NOVA README generator so future documentation runs do not recreate
  the conflicting file.
- Added a repository-contract test covering the public landing page and aligned
  version surfaces.
- Reframed the `92.0%` readiness score and `14` test files as dated audit
  evidence instead of silently presenting the older report as live state.

### Changed

- Synchronized the repository presentation version from `1.0.0` to `1.1.0` in
  `package.json`, `package-lock.json`, the public README and internal guide.
- Applied the existing Prettier configuration to the 40 JavaScript/TypeScript
  files that previously failed the archive-wide formatting check.
- Corrected ESLint environments for browser exercises and CommonJS JavaScript
  without rewriting their learning logic.
- Applied ESLint's safe automatic fixes and removed four unnecessary selector
  escapes without changing their runtime values.

### Validation

- `npm ci` completes from the committed lockfile.
- The NOVA strict no-write quality gate passes with `0` errors and `0` warnings.
- JavaScript/TypeScript anchor tests and Python tests pass.
- The archive-wide Prettier check passes.
- Local README and guide references resolve successfully.
- `git diff --check` passes.

### Honest remaining lint backlog

ESLint now reports **65 errors in 21 files**, reduced from 174 without hiding
real learning debt:

- 39 `@typescript-eslint/no-explicit-any` findings require type-design judgment;
- 22 `@typescript-eslint/no-unused-vars` findings may involve instructional or
  HTML-invoked functions and need exercise-by-exercise review;
- 3 `no-constant-condition` findings may be intentional loop demonstrations;
- 1 `no-debugger` finding belongs to an explicit DevTools debugging exercise.

These findings are intentionally not silenced or mechanically rewritten in the
1.1.0 release.
