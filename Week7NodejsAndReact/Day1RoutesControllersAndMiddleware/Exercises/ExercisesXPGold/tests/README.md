# Blog API regression

Run `npm test` from the parent exercise folder after `npm install`.

The test starts the real Express server on a temporary loopback port, supplies a
fictional authorization key and checks the complete in-memory post lifecycle.
It verifies valid creation timestamps, preservation during updates, trimmed
content, rejected input, authorization and missing records. The child server is
stopped after the test; no external service or database is used.
