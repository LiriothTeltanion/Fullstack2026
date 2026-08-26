# Security Policy

> Security reporting and repository safeguards verified:
> 2026-08-24T21:28:26+03:00 (`Asia/Jerusalem`).

## Supported code

Security fixes target the current `main` branch and the latest published
release. Historical learning exercises remain visible for educational evidence,
but they are not maintained as production packages or deployed services unless
a specific project says otherwise.

## Report a vulnerability privately

Use GitHub's
[private vulnerability reporting](https://github.com/LiriothTeltanion/Fullstack2026/security/advisories/new)
channel. Do not disclose an active vulnerability, exploit, credential, private
course record, or personal data in a public issue or pull request.

A useful report includes:

- the affected path, component, or commit;
- clear reproduction steps using non-sensitive sample data;
- the observed and expected behavior;
- the likely impact and any known preconditions; and
- a proposed mitigation, when available.

If the private form is unavailable, open only a non-sensitive public issue
requesting a private contact path. Do not include exploit details.

## Credential handling

- Never commit real `.env` files, `config.js` secrets, API keys, tokens,
  passwords, cookies, private keys, or recovery codes.
- Rotate any credential that was previously committed. Removing the current
  line does not invalidate the credential or erase Git history.
- Browser JavaScript cannot keep a private API secret. Use fixtures for course
  exercises or a reviewed backend boundary for a real application.
- Store CI credentials in GitHub Actions Secrets only when required, and grant
  each workflow the minimum permissions it needs.
- Use obvious placeholders in `.env.example` and other example configuration.

## Repository safeguards

- Secret scanning and push protection are enabled.
- Dependabot security updates are enabled.
- Private vulnerability reporting is enabled.
- The default branch requires a pull request and the
  `Syntax, security, docs and tests` GitHub Actions check.
- GitHub Actions receives read-only repository contents permission from the
  tracked quality workflow.

These controls reduce risk but do not prove that every exercise, dependency, or
historical commit is vulnerability-free. No CodeQL result is claimed unless a
real analysis exists.
