# Security Policy

## Credential handling

- Never commit `.env`, `config.js`, API keys, tokens, or passwords.
- The upgrade removes known literals from the current working tree.
- **Rotate any credential that was previously committed.** Removing the latest line does not invalidate the old key or erase Git history.
- Prefer a small backend proxy for browser projects that require private credentials; browser JavaScript cannot keep a secret from users.
- Store CI credentials in GitHub Actions Secrets and grant the workflow only the permissions it needs.

## Reporting

Open a private security report to the repository owner rather than posting an active credential in a public issue.

_Last updated by NOVA Ultimate v2.0.0._
