# Item creation regression tests

These dependency-free tests run the same creation handler used by the Express items controller. They verify rejected input without persistence, surrounding-whitespace trimming, the 120-character database boundary, astral Unicode, combining sequences and persistence-error forwarding.

Run `npm test` from the parent server directory. The repository's normal JavaScript test command imports these same cases through `tests/js/week12_items.test.mjs`.

The fixture stores synthetic items in memory. These tests do not require PostgreSQL and do not claim to cover database integration or deployment.
