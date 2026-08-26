# ⚙️ GitHub automation guide

> Remote governance verified: 2026-08-24T21:28:26+03:00
> (`Asia/Jerusalem`).

This internal guide documents the repository automation stored in `.github/`.
The public portfolio entry point is the root [`README.md`](../README.md).

The filename is intentionally **not** `README.md`. GitHub may select
`.github/README.md` instead of the root document on the repository page, which
would hide the twelve-week course overview, audited evidence and project links.

## 🧭 Contents

- [`workflows/quality.yml`](workflows/quality.yml) runs the whole-repository
  quality gate plus the Python and JavaScript/TypeScript anchor tests.
- [`dependabot.yml`](dependabot.yml) checks npm and GitHub Actions dependencies
  monthly.
- [`copilot-instructions.md`](copilot-instructions.md) shapes GitHub Desktop
  Copilot commit summaries and descriptions in professional English.
- [`pull_request_template.md`](pull_request_template.md) provides a truthful,
  evidence-first pull-request handoff.
- The active
  [`Protect main · PR + NOVA CI`](https://github.com/LiriothTeltanion/Fullstack2026/rules/21315698)
  repository ruleset protects the default branch.
- [`SECURITY.md`](../SECURITY.md) routes sensitive reports through GitHub's
  enabled private vulnerability reporting channel.
- [`workflows/README.md`](workflows/README.md) describes the workflow folder.
- [`CHANGELOG.md`](../CHANGELOG.md) records reviewed release-candidate changes
  and honest remaining quality debt.

## 🧪 Local parity

Run the same core checks before proposing a change:

```powershell
npm run format:check
npm run lint
npm run quality
npm test
git diff --check
```

## 🛡️ Remote governance baseline

The `Protect main · PR + NOVA CI` ruleset targets the default branch and is
active.

| Control                   | G1 setting                                             | Reason                                                                          |
| ------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------- |
| Pull request required     | Yes                                                    | Keeps a reviewable audit trail and prevents routine direct pushes.              |
| Required check            | `Syntax, security, docs and tests` from GitHub Actions | Uses the repository's existing deterministic quality gate.                      |
| Required approvals        | `0`                                                    | Avoids deadlocking a solo maintainer who cannot approve their own pull request. |
| Resolve conversations     | Yes                                                    | Prevents merging while actionable review threads remain open.                   |
| Require up-to-date branch | No                                                     | Avoids redundant CI reruns in the first low-friction governance batch.          |
| Force pushes              | Blocked                                                | Preserves published history.                                                    |
| Branch deletion           | Blocked                                                | Protects the default branch.                                                    |
| Administrator bypass      | Pull requests only                                     | Provides a documented recovery route if the required workflow itself breaks.    |

The administrator bypass is a break-glass control, not the normal merge path.
Changing the required job name and changing the ruleset must happen together.
Do not make Netlify, deployment, CodeQL, signed commits, reviews, or merge queue
mandatory until the corresponding workflow and solo-maintainer impact are
separately verified.

Private vulnerability reporting, secret scanning, push protection, and
Dependabot security updates are enabled. These safeguards reduce risk; they do
not prove that the repository has no vulnerability.

## 🪄 GitHub Desktop commit workflow

Use the repository-wide guidance in [`CONTRIBUTING.md`](../CONTRIBUTING.md).
For each cohesive selection, generate or write both a Summary and Description,
review every factual claim, and record failed or unavailable validation rather
than hiding it. GitHub Desktop's History view and Git itself retain the
authoritative commit timestamp and timezone.

## 🔒 Public-landing contract

- Keep the portfolio landing page at `/README.md`.
- Do not create `.github/README.md`.
- Keep workflow permissions read-only unless a reviewed use case requires more.
- Keep `main` behind the active PR and NOVA CI ruleset.
- Do not commit credentials, local `.env` files, generated archives or private
  learning data.

**Repository presentation version:** `1.2.0`
