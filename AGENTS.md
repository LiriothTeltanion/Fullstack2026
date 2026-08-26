# Fullstack2026 agent contract

## Mission

Preserve Kevin Cusnir's Developers Institute work and Git history while making each bounded change runnable, testable, explainable, accessible, and portfolio-credible. Improve the repository around the learning progression; do not replace that progression with an unrelated AI rewrite.

## Layout

- `Week1Python/` through `Week6DatabasesAndNodejs/`: recovered curriculum source and local assignment documentation.
- `Week7NodejsAndReact/` through `Week12FinalProject/`: trackable week-level scaffolds; official day, assignment, and submission content remains pending source review.
- `tests/`: representative behavior and repository regression tests.
- `tools/`: deterministic local validation and report tooling.
- `reports/nova/`: dated/generated repository heuristics; never treat them as grades.
- `reports/resume/`: evidence and decisions for the current recovery.
- `.ai/`: stable cross-agent context and handoff rules.
- `.learning/`: course map, display-title map, authenticated-intake policy,
  repository evidence, and learning review state.

## Canonical local checkout

- On Kevin's current Windows workstation, the only canonical working clone is
  `C:\Users\kevin\OneDrive\Escritorio\NovaDev\002_PROJECTS_NEXUS\040_LEARNING_ACADEMY\_042_Fullstack2026`.
- The adjacent non-underscore folder and any empty placeholder folders are not
  repository sources. Never redirect work there because a path looks similar.
- Before any mutation, confirm both `git rev-parse --show-toplevel` and
  `git remote get-url origin`. The expected remote is
  `https://github.com/LiriothTeltanion/Fullstack2026.git`.

## Source-of-truth priority

1. Kevin's current request and explicit authorization.
2. The official assignment prompt stored locally or supplied by Kevin.
3. This file and the nearest repository documentation.
4. Current Git index, working tree, tests, and command output.
5. `.learning/course-map.yml` and accepted decisions.
6. Generated reports and model memory.

When sources disagree, preserve the work, record the conflict, and do not guess an assignment requirement.

## Core commands

Run from the repository root on the pinned/available toolchain:

```powershell
npm ci
npm run format:check
npm run lint
python tools/nova_quality_gate.py --repo . --strict --no-write
npm run verify:structure
python -m unittest discover -s tests/python -p "test_*.py" -v
node tools/run_node_tests.mjs .
npm test
git diff --check
```

`verify:structure` checks canonical paths and deterministic catalog drift. Use a nearest nested `package.json`/`tsconfig.json` for package-specific checks. A syntax transpile is not semantic `tsc --noEmit` validation. Record unavailable commands as unavailable, never passed.

## Preservation and learning rules

- Preserve every unique student-authored file and meaningful variant. Hash case-conflicting trees before moving them.
- Use Git-aware, reversible moves. Never overwrite a content conflict or mass-delete generated-looking files.
- Keep beginner solutions visible in history; prefer the smallest assignment-aligned patch.
- Track repository evidence separately from Kevin's understanding.
- Evidence states are `missing`, `present`, `runnable`, `verified`, `explained`, `mastered`, and `portfolio`.
- Automated work may establish `verified` only for the bounded behavior tested. Only Kevin's demonstrated explanation/practice can support `explained` or `mastered`.
- For exercise logic, use Recall → Read → Predict → Run → Explain → Refactor + Test → Record.

## Visual and accessibility contract

- Preserve the NOVA / Blue Obsidian identity: obsidian/navy base, cobalt/electric-blue accents, restrained dark purple, clear hierarchy.
- Use semantic HTML, keyboard-operable controls, visible focus, sufficient contrast, responsive layout, meaningful empty/loading/error/success states, and screen-reader labels.
- Support EN/ES/HE and RTL/LTR when an app's scope requires it.
- Respect `prefers-reduced-motion`; avoid flashing, decorative motion spam, fake screenshots, and nondeterministic generated assets.
- Inspect real browser output for visual changes. README-only motion must remain GitHub-safe.

## Documentation

- Repository-facing engineering text, source comments, commit messages, pull
  requests, agent handoffs, and Kevin-facing explanations for this repository
  are professional English unless Kevin explicitly requests another language.
- Include exact paths and commands. Label `VERIFIED`, `INFERRED`, `PROPOSED`, or `UNVERIFIED` when evidence quality matters.
- Never publish a completion percentage as learning mastery. Put the formula and limitation next to any repository heuristic.
- Keep official assignment text or a reliable source reference distinct from AI summaries.
- Disclose material AI assistance and preserve human-authored reflections.
- Time-sensitive status updates, audit records, and handoffs use ISO 8601 with
  an explicit offset and `Asia/Jerusalem`. Ordinary source comments are not
  timestamped because Git history is their authoritative provenance; timestamp
  a code comment only when its validity genuinely depends on time.

## Security and privacy

- Never commit real `.env` files, API keys, tokens, cookies, passwords, private notes, or local database credentials.
- Keep authenticated Octopus captures under the ignored `.private/` boundary;
  publish only sanitized, Kevin-authored evidence permitted by
  [`.learning/OCTOPUS_INTAKE.md`](.learning/OCTOPUS_INTAKE.md).
- Templates such as `.env.example` and `config.example.js` must contain obvious placeholders only.
- Browser JavaScript cannot keep an API secret; use fixtures or a backend boundary in later production work.
- Do not transmit private course or personal data to external services without explicit authorization.

## Git and PR expectations

- Use one writer per working tree. Read-only agents may audit in parallel.
- Preserve unrelated changes and keep diffs small and coherent.
- Never force-push, rewrite published history, hard reset, clean, merge, push, publish, deploy, close PRs, or delete branches without Kevin's explicit approval.
- Review `git status`, staged/unstaged diffs, rename detection, and final validation before a commit or PR.
- A commit is evidence of a change, not evidence of learning or production impact.
- Follow [`CONTRIBUTING.md`](CONTRIBUTING.md) for GitHub Desktop commit titles,
  descriptions, purposeful emoji, validation evidence, and publishing safety.
- Use `Kevin Cusnir` as the professional Git author. Use `Lirioth Teltanion`
  or `@LiriothTeltanion` as a creative/portfolio identity, not as a false
  co-author or DCO `Signed-off-by` identity.

## Definition of done

A bounded change is done only when:

1. its source requirement and affected paths are known;
2. unique work and unrelated changes are preserved;
3. implementation, documentation, and tests agree;
4. relevant checks ran with exact results and no hidden failure;
5. accessibility/security risks are addressed in proportion to scope;
6. limitations and unverified behavior are explicit;
7. Git diff/status are reviewed and no unauthorized remote action occurred;
8. Kevin has one reproducible next learning action.
