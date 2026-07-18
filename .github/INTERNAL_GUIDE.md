# ⚙️ GitHub automation guide

This internal guide documents the repository automation stored in `.github/`.
The public portfolio entry point is the root [`README.md`](../README.md).

The filename is intentionally **not** `README.md`. GitHub may select
`.github/README.md` instead of the root document on the repository page, which
would hide the six-week learning overview, audited evidence and project links.

## 🧭 Contents

- [`workflows/quality.yml`](workflows/quality.yml) runs the whole-repository
  quality gate plus the Python and JavaScript/TypeScript anchor tests.
- [`dependabot.yml`](dependabot.yml) checks npm and GitHub Actions dependencies
  monthly.
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

## 🔒 Public-landing contract

- Keep the portfolio landing page at `/README.md`.
- Do not create `.github/README.md`.
- Keep workflow permissions read-only unless a reviewed use case requires more.
- Do not commit credentials, local `.env` files, generated archives or private
  learning data.

**Repository presentation version:** `1.1.0`
