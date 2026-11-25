# Authentication integration tests

Run npm test. Each case starts an isolated local child server with a synthetic signing value and temporary SQLite file. The tests exercise email confirmation, access/refresh cookies, expiry, replay revocation, simultaneous refreshes, logout, restart persistence and rate limits. They send no real email.
