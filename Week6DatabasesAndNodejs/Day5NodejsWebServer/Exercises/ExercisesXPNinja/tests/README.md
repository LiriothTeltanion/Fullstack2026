# Quiz regression tests

Run `npm test` from the exercise directory after `npm ci`. Node's built-in runner starts isolated loopback Express instances, submits original fixture answers, and closes each server. Tests cover feedback, exact final scoring, duplicate and stale requests, invalid JSON, browser isolation, restart/expiry/capacity, and ordinary original static-server startup. No external service, real database or credentials are used.
