# Fullstack2026 Copilot instructions

> Protocol verified: 2026-08-24T11:44:32+03:00 (`Asia/Jerusalem`).

## Repository identity and truth

- The professional maintainer and Git author is **Kevin Cusnir**.
- The creative and portfolio identity is **Lirioth Teltanion** / **@LiriothTeltanion**.
- Preserve the Developers Institute learning progression and every meaningful
  student-authored variant. Never replace weak evidence with polished claims.
- Repository state and official assignments outrank generated reports, prior
  chats, and model memory.
- Never claim a test, runtime, deployment, metric, learning state, or impact
  unless the selected diff or supplied command evidence proves it.
- Use `PASS`, `FAIL`, `BLOCKED`, `NOT RUN`, or `UNVERIFIED` when the distinction
  matters.

## Language and comments

- Write code identifiers, source comments, engineering documentation, commit
  messages, pull requests, and Fullstack2026 explanations in professional
  English unless Kevin explicitly requests another language.
- Comments explain intent, constraints, invariants, or non-obvious decisions.
  Do not narrate syntax.
- Git records the authoritative time for every commit. Add an ISO 8601
  `Asia/Jerusalem` timestamp only to time-sensitive audits, handoffs,
  workarounds, or expiry notes; never invent a current time.

## GitHub Desktop commit generation

When generating a commit message for GitHub Desktop, always produce both a
Summary and a meaningful Description for nontrivial changes.

Use this Summary shape exactly:

`type(scope): emoji imperative summary`

- Put one purposeful emoji after the Conventional Commit prefix so tooling can
  still parse the type.
- Prefer 50 characters or fewer; never exceed 72 characters.
- Use an imperative outcome and describe only the selected files or lines.
- Allowed types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `build`,
  `ci`, `chore`, and `revert`.
- Useful mappings: `feat` → ✨, `fix` → 🐛, `docs` → 📚, `test` → 🧪,
  `refactor` → ♻️, `perf` → ⚡, `build` → 🏗️, `ci` → 🤖,
  `chore` → 🧹, and security fixes → 🔐.

Use this Description structure:

```text
What changed

- Describe the concrete selected changes.

Why

- Explain the user, learning, security, or maintenance reason.

Verification

- Command — PASS/FAIL/BLOCKED/NOT RUN with the exact known result.

Known limitations

- State remaining risks, unverified behavior, or "None known".

AI assistance

- Describe material assistance accurately, or write "None".

Creative-Signature: Lirioth Teltanion
```

Do not invent issue numbers, versions, timestamps, tests, deployment status,
assignment requirements, course completion, mastery, users, metrics, or impact.
Do not use `Co-authored-by` for Kevin's creative alias. Do not add
`Signed-off-by` unless Kevin intentionally adopts the Developer Certificate of
Origin for that contribution. `Creative-Signature` is portfolio branding, not
a cryptographic signature or contributor attestation.
