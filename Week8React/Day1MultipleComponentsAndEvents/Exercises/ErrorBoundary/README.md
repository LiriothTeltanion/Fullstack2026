# 🎮 Mini Project - Error Boundary

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/error-boundary-ff6a97dd05.svg" width="100%" alt="Progress card for Error Boundary">

</div>

A two-column practice demonstrates the difference between a paragraph-level render failure and an explicitly handled event error. The original `BuggyCounter` simulations remain available through **Counter simulations** in the header (`#counters`).

## 🧩 Paragraph recovery practice

- **Get images** requests `https://picsum.photos/v2/list?page=0&limit=2` and displays two photographs with author credits. Loading, request failure and retry have visible states. No API key is needed.
- The right column starts with two paragraphs. One renders a stringified object; **Replace string with object** deliberately makes React try to render the object itself.
- Only that second paragraph is replaced by its error boundary. The first paragraph, controls and image column stay mounted and usable.
- **Restore paragraph** resets both the error boundary and the invalid input. The illustrations remain loaded.
- **Invoke event handler** throws and catches an error inside the handler itself, logs it and displays a status message. React error boundaries do not catch event-handler errors; explicit handling keeps this example usable.
- The reusable class boundary uses `getDerivedStateFromError` for the fallback and `componentDidCatch` for error details and logging. Expand **Details** to inspect the render error and component stack.

The image service uses the public [Lorem Picsum list and image endpoints](https://picsum.photos/). The API request has an eight-second timeout. If the API or a photograph fails, the app displays two original local SVG illustrations and explicitly labels that fallback. If that local feed also fails, an error message and retry remain available. Original illustration provenance is recorded in `public/images/README.md`.

## 🧪 Browser regression checks

Tests use Node's built-in test runner and a Playwright browser driver pinned in the separate `tests` package. This keeps test dependencies independent of the application's Vite configuration.

```bash
npm install
npm run build
npm ci --prefix tests
npm exec --prefix tests -- playwright install chromium
npm test
```

```powershell
# Optional: use an already installed Edge instead of downloading Chromium.
$env:BROWSER_CHANNEL = 'msedge'
npm test
```

The runner launches Playwright Chromium by default. It serves the production build on an ephemeral loopback port, replaces the Picsum API and image responses with offline fixtures, and blocks every other external request. It checks desktop/mobile layout, image loading and failed-request recovery, paragraph isolation/reset, event-handler behavior, both local counter boundary configurations and the original whole-app failure. Expected demonstration errors are asserted rather than treated as unexplained application failures. These deterministic checks do not claim to verify the current availability of the external service. See `tests/README.md`.

Built with AI-assisted tooling; I reviewed, tested and can explain every change.

## 🎮 Preserved counter demo

A `BuggyCounter` throws an error when it reaches 5, and three simulations show what an error boundary catches and how far the crash spreads.

## ▶️ How to run

```bash
npm install
npm run dev
```

Vite prints a local address (usually `http://localhost:5173`); I open it in the browser.

Then I click any counter five times.

## 🎯 The challenge

| Part            | What it does                                                                                                                                                    |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BuggyCounter`  | A button that counts clicks and throws `new Error("I crashed!")` during render at 5                                                                             |
| `ErrorBoundary` | Class component with `componentDidCatch`. It shows a fallback, the error and the component stack in `<details>`, and a "Try again" button that clears the error |
| Simulation 1    | Two counters inside one boundary: when one crashes, both are replaced by the fallback                                                                           |
| Simulation 2    | Each counter has its own boundary: the other one keeps working                                                                                                  |
| Simulation 3    | No boundary in the section, so the error climbs to the boundary around `<App />` in `main.jsx` and the whole page shows "The whole app crashed."                |

## 🧠 What I learned

- Error boundaries are still class components, because hooks have no `componentDidCatch`
- A boundary only protects what is inside it, so where I place it decides how much of the page survives
- They catch errors thrown while rendering, not errors inside event handlers or `fetch` calls
- Resetting the boundary state remounts its children, so the counters start again at 0

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 8 Day 1 - Multiple Components and Events - Mini Project
