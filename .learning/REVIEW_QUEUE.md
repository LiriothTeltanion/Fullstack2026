# Learning review queue

> Updated `2026-09-11T20:19:21+03:00` (`Asia/Jerusalem`). The queue follows
> Kevin's decision to verify existing work chronologically from Week 1 before
> beginning Week 7. Finish one checkpoint and record evidence before expanding it.

## Completed foundation checkpoint — bounded Octopus inventory

- **Status:** a bounded legacy navigation snapshot was completed on
  `2026-08-24T13:41:31+03:00`; automated expansion stopped on
  `2026-08-24T14:07:13.752+03:00` after reviewing the published Octopus policy.
- **Verified scope:** ignored local manifests contain sanitized navigation
  metadata; Git indexes zero private files.
- **Not established:** official prompt fidelity, item state, requirement type,
  attempts, grades, rubrics, submissions, or Kevin's learning state.
- **Boundary:** do not bulk-extract or copy authenticated course material into
  external AI without written Developers Institute authorization.

## 1. Week 1 / Day 1 learning and submission boundary

- **Repository state:** XP 1–9, Gold 1–2, and Ninja 1–5 have bounded requirement
  comparisons and 23 focused passing tests. The Daily Challenge matches the
  official item reviewed read-only on 2026-09-11 and has five focused passing
  tests. Repository behavior and requirement alignment are `VERIFIED`.
- **Kevin task:** predict and explain the key Day 1 behaviors in his own words,
  recreate the Daily Challenge core loop without reading the solution, handle one
  edge case, and submit each packet manually only through its matching Octopus
  item.
- **Daily task:** use the [dated source-safe alignment record](evidence/2026-09-11-week1-day1-daily-challenge-alignment.md)
  as repository evidence; do not treat it as submission or learning evidence.
- **Done when:** Kevin's explanation and independent recreation are recorded
  separately from the 28 passing Day 1 repository tests, matching Octopus
  submissions are manually confirmed, and actual checker or instructor outcomes
  are recorded without inference.
- **Low-energy fallback:** explain the three length branches and one progressive
  prefix example; leave every Octopus item unsubmitted until Kevin is ready.

## 2. Week 1 / Day 2, then Weeks 1–6 chronological verification

- **Order:** Week 1 Day 2 → Day 5, then Weeks 2–6 in course order after the Day 1
  learning and submission boundary is recorded.
- **Per-day loop:** Recall → Kevin reads Octopus → own-words intake → predict →
  run → explain → smallest fix/test → evidence record.
- **Scope rule:** verify one exercise or challenge at a time. A passing anchor
  test does not verify the rest of a day or week.
- **Public visual rule:** add a screenshot, SVG, or short demo only after it shows
  real runnable output and has been reviewed for privacy and accessibility.
- **Done when:** each mapped item clearly distinguishes requirement fidelity,
  repository state, execution evidence, assistance level, and learning state.

## 3. Developers Institute policy clarification before Week 7

- **Time:** 10–20 minutes to request clarification.
- **Kevin task:** ask DI in writing whether external AI may review Kevin-authored
  code, whether original solutions may be public without prompts, what disclosure
  is required, and which materials the educational-content clause covers.
- **Done when:** the written rule is preserved privately and supports a safe Week
  7 implementation workflow.
- **Low-energy fallback:** send only the prepared clarification questions; do not
  open an attempt-sensitive item.

## Known later checkpoints inside the chronological pass

### Week 1 / Day 5 — Tic-Tac-Toe explanation

- Predict one row, one diagonal, and one occupied-move result.
- Explain `parse_move`, `validate_move`, and `check_win` in Kevin's own words.
- Existing bounded evidence: `tests/python/test_tictactoe.py` covers board logic;
  it does not establish full CLI behavior or mastery.

### Week 5 — Union Type Validator

- Explain the difference between a union type and a runtime type guard.
- Resolve the missing Node type dependency deliberately; a transpile-only pass
  does not establish strict compilation.

### Week 6 — SQL assignment authority

- Resolve the current schema/prompt ambiguity using Kevin's own requirement
  summary or explicitly authorized material.
- Record whether the task requires a schema change, query change, or continued
  blocker before editing SQL.

## After Weeks 1–6

Start Week 7 with exactly one selected, source-safe item. Weeks 8–12 and optional
courses may be queued in Kevin's own words, but they remain planning records—not
course progress—until selected, mapped, implemented, verified, and explained.
