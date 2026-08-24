# Changelog

Notable repository-presentation, quality-tooling and release changes
are recorded here. Curriculum exercise history remains visible; this changelog
does not reinterpret early work as production-ready code.

## [Unreleased]

- No unreleased changes are recorded yet.

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
