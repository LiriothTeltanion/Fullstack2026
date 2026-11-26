# API boundary regression tests

Run `npm test` from this directory's parent. Node's built-in runner substitutes a local fetch fixture, checks URLs and AbortSignal propagation, empty data, malformed JSON, HTTP errors, response shapes and invalid user identifiers. No external service is contacted.

Class mount/update/unmount behavior is exercised separately in the private production-browser verification with intercepted JSONPlaceholder fixtures. That verification covers navigation, retries, empty/error/loading states, cancellation and small viewports. These API unit tests are not a substitute for mounted lifecycle tests.
