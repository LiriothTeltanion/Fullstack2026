# Contributing to Fullstack2026

> Workflow and remote governance verified: 2026-08-24T21:28:26+03:00
> (`Asia/Jerusalem`).

This repository preserves Kevin Cusnir's course progression while building
truthful, reproducible portfolio evidence. Use **Kevin Cusnir** as the
professional Git author and **Lirioth Teltanion** / **@LiriothTeltanion** as the
creative and portfolio identity.

## Canonical Windows checkout

Kevin's canonical local clone is:

```text
C:\Users\kevin\OneDrive\Escritorio\NovaDev\002_PROJECTS_NEXUS\040_LEARNING_ACADEMY\_042_Fullstack2026
```

Before changing files, verify:

```powershell
git rev-parse --show-toplevel
git remote get-url origin
git status --short --branch
```

The expected remote is
`https://github.com/LiriothTeltanion/Fullstack2026.git`. Similar adjacent
folders are placeholders and must not receive repository work.

## Protected `main` branch

The active
[`Protect main · PR + NOVA CI`](https://github.com/LiriothTeltanion/Fullstack2026/rules/21315698)
ruleset makes pull requests the normal path into `main`.

- Every change to `main` must arrive through a pull request.
- `Syntax, security, docs and tests` must pass from GitHub Actions.
- Review conversations must be resolved before merging.
- Force pushes and deletion of `main` are blocked.
- Required approvals are intentionally `0`: this is currently a
  solo-maintainer repository, and a pull-request author cannot approve their
  own work.
- The administrator recovery path can bypass rules only from a pull request.
  It exists for a broken required workflow, not for routine merging.
- G1 does not require the branch to be up to date before merging. This avoids
  unnecessary repeat CI runs while every proposed commit still has to pass the
  required check.

The required job name is a governance contract. If the workflow job is renamed,
update the ruleset in the same controlled change or pull requests will remain
blocked.

## Friction-free GitHub Desktop Beta flow

1. Select `Fullstack2026` and confirm the exact underscore path above.
2. Fetch origin, start from current `main`, and create one focused topic branch,
   such as `learning/week1-day1-checkpoint` or `chore/governance-follow-up`.
3. Confirm the topic branch before selecting files. Do not commit directly on
   `main`.
4. Select only the files or lines that form one cohesive change.
5. Click **Generate commit message with Copilot** when available. Repository
   instructions in `.github/copilot-instructions.md` shape both fields.
6. If the selection changes, regenerate the message. Copilot does not update an
   existing suggestion automatically.
7. Review every claim, especially commands and results. Replace unsupported
   claims with `NOT RUN`, `BLOCKED`, or `UNVERIFIED`.
8. Commit locally and review the commit in **History**.
9. Use **Publish branch** only when the topic branch has no upstream; otherwise
   use **Push origin**. Automated agents require Kevin's explicit approval for
   either remote action.
10. Open a pull request, complete the evidence template, and wait for
    `Syntax, security, docs and tests` to pass.
11. Resolve review conversations and merge on GitHub. Use the documented
    pull-request-only bypass only to recover from a broken required workflow.
12. Return to `main`, fetch/pull the merge, verify the post-merge workflow, and
    create a fresh branch for the next batch.

GitHub Desktop Copilot commit generation requires eligible Copilot access. If
the button is unavailable, copy the format below into the Summary and
Description fields manually.

## Commit format

### Summary

```text
type(scope): emoji imperative summary
```

Prefer 50 characters or fewer and never exceed 72. Use one purposeful emoji.

| Type       | Purpose                              | Suggested emoji |
| ---------- | ------------------------------------ | --------------- |
| `feat`     | New assignment-aligned capability    | ✨              |
| `fix`      | Behavioral or correctness repair     | 🐛              |
| `docs`     | Documentation or evidence            | 📚              |
| `test`     | Tests and verification               | 🧪              |
| `refactor` | Behavior-preserving structure change | ♻️              |
| `perf`     | Measured performance improvement     | ⚡              |
| `build`    | Dependencies or build tooling        | 🏗️              |
| `ci`       | GitHub Actions or automation         | 🤖              |
| `chore`    | Repository maintenance               | 🧹              |
| `revert`   | Explicit rollback                    | ↩️              |

Example:

```text
test(layout): 🧪 enforce canonical paths
```

### Description

```text
What changed

- Describe the concrete selected changes.

Why

- Explain why the change is needed.

Verification

- npm test — PASS: exact result.
- npm run lint — FAIL: exact known blocker.

Known limitations

- State remaining risks or "None known".

AI assistance

- Describe material assistance accurately, or write "None".

Creative-Signature: Lirioth Teltanion
```

Git already records authoritative author and committer timestamps, including
the timezone offset, and GitHub Desktop displays the commit time in History.
Use explicit ISO 8601 `Asia/Jerusalem` timestamps in time-sensitive audits and
handoffs. Do not add stale timestamps to ordinary explanatory code comments.

`Co-authored-by` credits a real additional contributor; it is not an alias or
branding field. `Signed-off-by` is a Developer Certificate of Origin statement,
not a decorative signature. `Creative-Signature` is an ordinary portfolio
trailer and does not claim cryptographic verification. Cryptographic signing is
a separate setup and must not be enabled without a validated GPG or SSH signing
key.

## Validation before committing

Run the checks relevant to the selected change and report failures honestly:

```powershell
npm run format:check
npm run verify:structure
npm test
python -B tools/nova_quality_gate.py --repo . --strict --no-write
npm run lint
git diff --check
git diff --cached --check
git status --short --branch
```

The repository currently has documented legacy lint debt, so a failing lint
run must be recorded rather than hidden. A commit proves that a change was
recorded; it does not prove course mastery, production readiness, or impact.

## Remote safety

Review the complete diff before Commit, Publish branch, Push origin, opening a
pull request, or merging. Direct pushes to `main` are not the normal workflow.
Automated agents must not commit, push, merge, use the administrator bypass,
publish, deploy, close a pull request, delete a branch, or rewrite history
without Kevin's explicit authorization.

Official references:

- [Committing and reviewing changes in GitHub Desktop](https://docs.github.com/en/desktop/making-changes-in-a-branch/committing-and-reviewing-changes-to-your-project-in-github-desktop)
- [Configuring Copilot in GitHub Desktop](https://docs.github.com/en/desktop/configuring-and-customizing-github-desktop/configuring-copilot-in-github-desktop)
- [Working with Git hooks in GitHub Desktop](https://docs.github.com/en/desktop/making-changes-in-a-branch/working-with-git-hooks-in-github-desktop)
