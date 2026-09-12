# Fullstack2026 evidence progress

> Derived from `.learning/course-map.yml` on 2026-09-11. This is an evidence snapshot, not a course grade or completion percentage. The course map wins if this summary drifts.

## State legend

`missing` → `present` → `runnable` → `verified` → `explained` → `mastered` → `portfolio`

`unknown` means there is no current evidence about Kevin's learning state.

## Current week-level truth

| Week | Repository state | Learning state | Verified bounded anchors | Current blocker |
|---|---|---|---|---|
| Week 1 — Python | `present` | `unknown` | Day 1 Exercises XP 1–9, XP Gold 1–2, XP Ninja 1–5, requirement-aligned Daily behavior, Hangman domain logic, and Tic-Tac-Toe domain logic | Most remaining CLI flows, Kevin's independent learning evidence, and Octopus submission outcomes remain unverified. |
| Week 2 — OOP | `present` | `unknown` | Circle behavior; mocked Timer behavior | Most projects/dependencies and interactive flows are unverified. |
| Week 3 — JS/DOM | `present` | `unknown` | None recorded | No browser, keyboard, responsive, or accessibility execution. |
| Week 4 — async JS | `present` | `unknown` | None recorded | Canonical Day 3 structure is recovered; fetch/form behavior remains untested. |
| Week 5 — TS/projects | `present` | `unknown` | None recorded at whole-project level | Browser APIs unverified; strict Union Type Validator compile is blocked. |
| Week 6 — SQL/Node | `present` | `unknown` | Node math `add`/`multiply` helpers | SQL prompt/schema ambiguity, no `psql`, nested dependency gaps. |
| Week 7 — Node.js/React | `present` (scaffold only) | `unknown` | None | Section/activity navigation is privately captured; prompts, rubrics, explicit item state, and submission rules remain uncaptured. |
| Week 8 — React | `present` (scaffold only) | `unknown` | None | Section/activity navigation is privately captured; prompts, rubrics, explicit item state, and submission rules remain uncaptured. |
| Week 9 — Redux | `present` (scaffold only) | `unknown` | None | Section/activity navigation is privately captured; prompts, rubrics, explicit item state, and submission rules remain uncaptured. |
| Week 10 — advanced TS/auth | `present` (scaffold only) | `unknown` | None | Section/activity navigation is privately captured; authentication scope, prompts, rubrics, explicit item state, and submission rules remain uncaptured. |
| Week 11 — final project | `present` (scaffold only) | `unknown` | None | Final-project navigation is privately captured; the brief, rubric, milestones, explicit item state, and submission rules remain uncaptured. |
| Week 12 — final project | `present` (scaffold only) | `unknown` | None | Final-project navigation is privately captured; continuation, rubric, deployment expectations, explicit item state, and submission rules remain uncaptured. |

## Latest bounded checkpoint

- **2026-09-11 · Week 1 / Day 1 / Exercises XP Ninja:** repository behavior `verified` by [`tests/python/test_week1_day1_exercises_xp_ninja.py`](../tests/python/test_week1_day1_exercises_xp_ninja.py) and observed Windows launcher commands, with limitations recorded in [`.learning/evidence/2026-09-11-week1-day1-exercises-xp-ninja.md`](evidence/2026-09-11-week1-day1-exercises-xp-ninja.md).
- **2026-09-11 · Week 1 / Day 1 / Daily Challenge:** official requirement alignment and repository behavior are `verified` by a read-only source comparison plus [`tests/python/test_week1_day1_daily_challenge.py`](../tests/python/test_week1_day1_daily_challenge.py); see the [dated alignment record](evidence/2026-09-11-week1-day1-daily-challenge-alignment.md). Learning and submission outcomes remain `UNVERIFIED`.
- **2026-09-11 · Week 1 / Day 1 / Exercises XP Gold:** repository behavior `verified` by [`tests/python/test_week1_day1_exercises_xp_gold.py`](../tests/python/test_week1_day1_exercises_xp_gold.py), with commands and limitations recorded in [`.learning/evidence/2026-09-11-week1-day1-exercises-xp-gold.md`](evidence/2026-09-11-week1-day1-exercises-xp-gold.md).
- **2026-09-10 · Week 1 / Day 1 / Exercises XP:** repository behavior `verified` by [`tests/python/test_week1_day1_exercises_xp.py`](../tests/python/test_week1_day1_exercises_xp.py), with commands and limitations recorded in [`.learning/evidence/2026-09-10-week1-day1-exercises-xp.md`](evidence/2026-09-10-week1-day1-exercises-xp.md).
- **Learning state:** `unknown`; automated tests do not establish Kevin's independent explanation or reproduction.
- **Platform state:** `unknown`; no Octopus submission, instructor review, or grade is asserted.

## Important limitations

- A week stays `present` even when one bounded project has a verified test.
- For Weeks 7–12, `present` means only that the canonical root and source-boundary README are tracked. It does not mean official coursework content is present.
- Syntax-only success does not make a project `runnable` or `verified`.
- Generated READMEs and NOVA scores are not learning evidence.
- No item is currently marked `explained`, `mastered`, or `portfolio` by this source of truth.
- A read-only authenticated navigation intake on 2026-08-24 captured 34 visible
  course entries, all 69 main-program sections, and 733 visible activity links in
  ignored local manifests. It did not open activity pages or establish completion,
  attempt, grade, rubric, submission, or learning state.
- The legacy metadata capture is frozen. Further automated authenticated
  inspection or copying course material into external AI is paused under the
  current published Octopus policy unless DI grants written permission.
- Official prompt bodies are not comprehensively stored. Assignment-sensitive
  work must use Kevin's independently written summary or material explicitly
  authorized by Developers Institute.

## Update rule

Raise a state only when a dated evidence reference is added under `.learning/evidence/` or points to a reproducible test/session record. Lower or block a state when current evidence contradicts it. Never preserve a green label merely for presentation.
