# Meme Generator regression checks

Run `npm test` from the project root. The DOM test mounts the real React components and supplies deterministic API responses. It checks the initial image, class lifecycle request, editable heading overlays, retained size/color controls, random generation, error feedback and abort cleanup. Live API availability and image rendering are checked separately in the browser.
