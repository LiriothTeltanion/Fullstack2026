# Learning review queue

> Updated `2026-08-24T15:00:38+03:00` (`Asia/Jerusalem`). The queue now follows
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

## 1. Week 1 / Day 1 own-words alignment

- **Time:** 15–30 minutes for the first exercise.
- **Kevin task:** open the first Week 1 / Day 1 item directly in Octopus, close or
  avoid any attempt-sensitive action, and explain the requirement briefly in his
  own words without copying the prompt.
- **Fast command:** `npm run intake -- add`.
- **Repository task:** map the validated summary to the closest existing Week 1
  path, inspect Kevin's current code, predict the result, and run the narrowest
  relevant check.
- **Done when:** one public-safe queue record, one exact repository path, one
  observed result, and one Kevin-authored explanation are recorded without
  raising the learning state beyond the evidence.
- **Low-energy fallback:** provide only a short title, a 1–3 sentence own-words
  summary, and one expected output; do not change code.

## 2. Weeks 1–6 chronological daily verification

- **Order:** Week 1 Day 1 → Day 5, then Weeks 2–6 in course order.
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
