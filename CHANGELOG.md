# Changelog

Notable repository-presentation, quality-tooling and release changes
are recorded here. Curriculum exercise history remains visible; this changelog
does not reinterpret early work as production-ready code.

## [Unreleased]

- No unreleased changes are recorded yet.

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
