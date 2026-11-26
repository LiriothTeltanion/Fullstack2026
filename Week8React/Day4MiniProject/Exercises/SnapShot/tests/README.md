# Snap Shot regression tests

Run `npm test` from the [Snap Shot project](../README.md). These tests use the Node.js test runner and synthetic key values. They run offline.

The URL cases check that the text a visitor searches for survives a direct link, including Unicode, literal percent escapes and encoded slashes. The configuration cases cover missing values, the unchanged example key and surrounding whitespace.

Photo-response cases call the real API boundary with a mocked fetch response.
They cover valid photos, empty collections, invalid collection shapes, malformed
records, mixed collections, unreadable JSON and HTTP failures. They preserve
usable records and distinguish an invalid response from a legitimate empty result.
Benign malformed and relative URL fixtures check that image and link URLs are
absolute HTTP/HTTPS addresses, with a valid image URL used for a missing link.
