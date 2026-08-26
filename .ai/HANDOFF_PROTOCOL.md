# Cross-agent handoff protocol

## One-writer rule

Only the designated primary writer mutates a working tree. Parallel agents are read-only unless they have an isolated branch/worktree explicitly assigned. The primary writer reconciles conflicts and runs final validation.

## Required handoff

```markdown
# Fullstack2026 handoff

Captured at: YYYY-MM-DDTHH:mm:ss+HH:mm (Asia/Jerusalem)

## Objective and scope
- Requested outcome:
- Explicit exclusions:

## Verified current state
- Repository / branch / HEAD:
- Dirty paths before work:
- Relevant versions:

## Decisions
- Accepted:
- Proposed / needs Kevin:

## Files changed
- Path — reason

## Commands and exact results
| Command | Exit/result | What it proves | Limitation |
|---|---|---|---|

## Preservation evidence
- Moves/hashes/conflicts:
- Unrelated work preserved:

## Learning evidence
- Repository state:
- Kevin learning state:
- Evidence references:

## Risks and blockers
- Verified blockers:
- Unverified assumptions:

## Exact next action
- Command or bounded review checkpoint:
```

## Rules

- Use absolute or repository-relative paths that another agent can resolve.
- Include exact command results; never write “tests pass” without naming them.
- Do not include credentials, raw private data, hidden chain-of-thought, or giant prompt copies.
- Link to source-of-truth files instead of duplicating them.
- Mark changing facts with date/status and ask the next agent to re-verify them.
- Use the exact local hour in `Asia/Jerusalem` for the handoff timestamp; never
  invent or approximate it.
