# Learning protocol

## Evidence states

Repository evidence uses these ordered states:

1. `missing` — required material is absent.
2. `present` — material exists; execution is not established.
3. `runnable` — a documented command starts/completes in the required environment.
4. `verified` — a bounded requirement passed a reproducible check.
5. `explained` — Kevin can explain the approach, trade-offs, and key code without reading an AI answer.
6. `mastered` — Kevin can reproduce/adapt the concept after spaced review.
7. `portfolio` — verified, explained, documented, accessible, and honestly presented for public review.

Use `unknown` for learning state when evidence is absent. Never infer `explained` or `mastered` from commits, tests, README prose, or AI output.

## NOVA R7 loop

For curriculum logic:

1. **Recall** — Kevin states what he remembers.
2. **Read** — Kevin inspects authenticated Octopus material directly; AI work
   uses explicitly authorized material or Kevin's independently written,
   source-safe summary plus the current solution.
3. **Predict** — predict output/failure before execution.
4. **Run** — execute the smallest relevant command.
5. **Explain** — Kevin explains why the result occurred.
6. **Refactor + Test** — make the smallest justified improvement and add a revealing test.
7. **Record** — save evidence, limits, and next review date.

## Before changing an exercise

- Kevin finds the official requirement directly, then provides an authorized
  source or an independently written source-safe summary; otherwise mark the
  requirement unavailable.
- Identify what the current student solution already demonstrates.
- Preserve the original in Git history.
- Ask one short Spanish prediction/diagnostic question when Kevin is participating live.
- Separate required fixes from optional modernization.
- Prefer a small patch over replacement architecture.
- Add “What Kevin should be able to explain” to substantial project docs in a later docs wave.

## AI role

AI may audit, propose, test, explain, and implement authorized changes. AI must disclose material help, avoid completing a mastery check on Kevin's behalf, and never invent assignment text, course grades, users, metrics, certificates, or impact.
