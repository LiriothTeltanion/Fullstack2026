# Meme Generator regression checks

Run `npm test` from the project root. The DOM test mounts the real React components and supplies deterministic API responses. It checks the initial image, class lifecycle request, editable heading overlays, retained size/color controls, random generation, error feedback and abort cleanup. Live API availability and image rendering are checked separately in the browser.

The required `allMemeImgs` class state and `div.meme` overlay structure have
explicit checks. A header regression dispatches an image error and verifies that
the remote reference is replaced by the original SVG with updated alternative
text. A second error leaves the fallback stable instead of retrying endlessly.
The DOM bundle loads SVGs as data URLs and omits CSS; production desktop/mobile
rendering is checked separately using the real Vite output and local API/image
fixtures. No real service or user account is needed by `npm test`.

`classroom-config.test.js` also verifies that a classroom production build is
rejected before the private stylesheet can be read. Browser checks separately
verify that a normal build excludes that file even when it exists locally.
