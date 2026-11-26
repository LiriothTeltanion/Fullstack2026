# HTTP regression tests

Run `npm test` after `npm ci`. The tests start independent Express instances on loopback with ephemeral ports, send actual HTTP requests, and close every server. They cover the greeting contract, invalid/malformed/oversized bodies, URL-encoded fallback, local assets and the retained users API/rate limit. No credentials or external services are used.
