# Pre-Wave 1 test and runtime baseline

> Status: baseline evidence on 2026-08-24. `PASS` means only the listed command/check passed; it is not a course-completion claim.
>
> This is a **VERIFIED historical snapshot before Wave 1 changes**. Current structural checks and executed results are recorded in [`CONSOLIDATION_RESULT.md`](CONSOLIDATION_RESULT.md) and the Wave 1 handoff; counts below are intentionally not rewritten.

## Baseline automation layers

| Layer | Current command | What it proves | What it does not prove |
|---|---|---|---|
| Formatting | `npm run format:check` | Matched JS/TS files follow the configured Prettier style. | Correctness, semantics, HTML/CSS/Python/SQL formatting. |
| ESLint | `npm run lint` | Nothing at baseline because the glob resolves to no files. | Any JS/TS lint health. Explicit enumeration exposes 65 errors. |
| NOVA gate | `python tools/nova_quality_gate.py --repo . --strict --no-write` | Implemented static syntax, basic secrets, Markdown link, HTML/CSS, and repository heuristics pass. | Runtime behavior, SQL execution, browser/a11y, semantic TypeScript, mastery. |
| Python anchors | `python -m unittest discover -s tests/python -p "test_*.py" -v` | Twelve cases around Circle, Hangman, Tic-Tac-Toe, Timer, and repository layout. | The remaining Python curriculum, interactive I/O, all error cases. |
| Node anchors | `node tools/run_node_tests.mjs .` | Four cases: CommonJS math, infrastructure, root ZIP absence, TypeScript syntax transpilation. | Most Node exercises, DOM/browser apps, strict type checking. |
| CI | `.github/workflows/quality.yml` | On push/PR: npm install reproducibility, NOVA, Python anchors, Node anchors on Ubuntu. | Lint, Prettier, Ruff, semantic TypeScript, SQL, browser/a11y, `git diff --check`. |

## Curriculum and project families

| Source path / family | Runtime | Current automated check | Proves | Does not prove | External/manual need | Proposed next test |
|---|---|---|---|---|---|---|
| `Week1Python/Day1...Day4` | Python CLI | NOVA AST parse | Python syntax parses. | Assignment behavior, inputs, outputs, learning. | Manual CLI prompts. | Table-driven tests for one pure function per day. |
| `Week1Python/.../Hangman` | Python CLI/package | `tests/python/test_hangman.py` | Hit/miss/repeat/win and invalid guess behavior in domain logic. | Full CLI, random word source, accessibility of prompts. | Manual replay. | CLI smoke with injected input and deterministic word. |
| `Week1Python/.../TicTacToe` | Python CLI/module | `tests/python/test_tictactoe.py` | Board creation, parsing, move validation, win/tie logic. | Complete two-player flow and presentation. | Manual CLI. | End-to-end scripted game. |
| `Week2OOP/.../Circle` | Python OOP | `tests/python/test_circle.py` | Construction, area, arithmetic, comparison, invalid inputs. | All OOP exercises or Kevin's explanation. | None for anchor logic. | Equality/representation edge cases tied to prompt. |
| `Week2OOP/.../Modules/timer.py` | Python + HTTP | `tests/python/test_timer.py` with fake session | Deterministic response-byte aggregation and benchmark sampling. | Live network behavior, timeout/retry behavior. | Live API optional; offline must remain primary. | Failure/timeout mock tests. |
| Other Week 2 OOP/API projects | Python CLI/API | NOVA AST parse only | Syntax. | Behavior, dependency installation, external APIs. | API keys/network for selected apps. | Pick one portfolio candidate and isolate pure/domain logic. |
| Week 3 DOM/browser exercises | Browser JS/HTML/CSS | NOVA syntax/HTML/CSS checks | Parseable static assets and basic duplicate-id warnings. | Event flows, keyboard use, responsive UI, visual correctness. | Browser + accessibility/manual QA. | One lightweight smoke test for Todo/Coloring/Drumset. |
| Week 4 HTTP/forms/async exercises | Browser JS/TS | NOVA syntax; no behavior tests | Syntax and basic links. | Fetch states, request failures, form behavior, offline reliability. | APIs/network; browser QA. | Mock fetch for one async project plus keyboard/error-state QA. |
| `Week4.../TrueOrFalse` | Browser JS/HTML/CSS | Static gate only | Assets parse after structural recovery. | Correct interaction or expected assignment result. | Browser manual QA. | Smoke test that loads and completes one question flow. |
| Week 5 Currency Converter/Pokédex/Star Wars | Browser + external APIs | Static gate only | HTML/JS syntax and safe config placeholder. | Live API behavior, error/loading/empty states, API stability. | Network/API + browser QA; use fixtures later. | Offline fixtures and one accessible interaction smoke test per featured app. |
| Week 5 standalone TypeScript exercises | TypeScript | Root `transpileModule` syntax check | Syntax transpiles. | Strict semantics, module boundaries, runtime output. | None if made deterministic. | Per-project `tsconfig` or selected strict `tsc --noEmit`. |
| Union Type Validator | TypeScript package | Syntax transpile passes; strict `tsc` fails `TS2688` | Source is present and syntactically parseable. | Package is installable/runnable or semantically valid. | Missing nested install/lock strategy. | Decide workspace vs nested lock, then strict compile and behavior assertions. |
| Week 6 SQL | PostgreSQL | NOVA treats SQL as text; no SQL parser/DB execution | File presence only. | Valid schema/query execution or expected rows. | `psql`/PostgreSQL unavailable locally; `dvdrental` prerequisite. | Resolve official `email` ambiguity, then schema-column regression and containerized/fixture SQL smoke. |
| Week 6 Node math app | Node CommonJS | `tests/js/math_helpers.test.mjs` | `add` and `multiply` exports for representative values. | CLI app, dependency isolation, other Node exercises. | None for pure helper. | Edge cases and app smoke. |
| Other Week 6 Node packages | Node CJS/ESM/npm/fs | Node syntax through NOVA; no package installs | Parseable JavaScript. | Declared dependencies, filesystem side effects, CLI output. | Nested dependencies; some resolve accidentally from root transitive packages. | Validate each package manifest and add offline smoke for modules/fs. |

## False-green and dependency findings

1. ESLint's glob fails before linting. Passing Prettier and NOVA does not compensate for this.
2. TypeScript syntax transpilation is not semantic checking. Strict checks reveal unresolved Node types and additional per-file diagnostics.
3. Nested packages have no lockfiles or root workspace declaration. Some imports can resolve accidentally from root tooling dependencies.
4. Wildcard Python loaders choose the first matching path, so duplicate implementations can be hidden.
5. The historical test-file metric counts documentation/helpers, not only executable test modules.
6. The gate checks Markdown links as warnings, while strict mode fails only on errors.
7. Real `.env` filenames are outside the gate's text-extension allowlist; a dedicated tracked-path check is required.

## Wave 1 testing boundary

Wave 1 should add structural/index/link/catalog/secret regression checks without adding Playwright, Vitest, jsdom, axe, a database, or a monorepo framework. Behavioral expansion, dependency architecture, and browser accessibility belong to later bounded waves.
