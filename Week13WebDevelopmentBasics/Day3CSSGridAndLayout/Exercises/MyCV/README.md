# 🧪 Exercise - My CV

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/my-cv-9e6238a45e.svg" width="100%" alt="Progress card for My CV">

</div>

My CV as a web page. The whole sheet is one grid with three named areas (header, side and main), with a separate print layout. The original bootcamp, skills, projects and interests remain visible. The page now includes a local original monogram, a real capture of the Drumset project, linked social icons and an accessible professional-message form.

## ▶️ How to run

From the repository root, serve the files on loopback:

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Open [the CV page](http://127.0.0.1:8000/Week13WebDevelopmentBasics/Day3CSSGridAndLayout/Exercises/MyCV/index.html). JavaScript modules require a local HTTP server; opening the HTML as a file still displays the CV but may block message preparation. No package installation is needed. Press Ctrl+P to see the print layout; page count depends on browser settings.

## 🎯 The challenge

| Area                 | Content                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `header`             | Original KC monogram image, my name and "Full-stack web developer in training"                                                        |
| `side` (dark column) | GitHub and LinkedIn links with local Font Awesome icons, skill chips in a small auto-fill grid, languages                             |
| `main`               | Profile, education (Developers Institute, in progress), projects with an actual Drumset screenshot, interests and message preparation |

On a phone the areas stack (`"header" "side" "main"`). From 760px the template changes to `280px 1fr` with the header across both columns. The `@media print` block keeps the two columns, removes the shadow and lightens the sidebar to save ink.

## Contact flow and privacy

1. Enter your name (1–80 characters) and message (1–2000 characters). Empty or whitespace-only fields show errors and focus the first invalid field.
2. **Prepare message** creates a reviewable plain-text draft. Editing either field invalidates the previous prepared text.
3. **Copy message** uses the browser clipboard only after a click. If access is denied or unavailable, the text is selected for manual copying.
4. **Open Kevin's LinkedIn** opens his public professional profile. Paste and review the message there, then send it yourself if LinkedIn permits messaging.

This static page has no delivery backend, tracking, automatic submission or data collection. Preparing or copying never reports that a message was delivered. The draft is retained only in this tab's `sessionStorage` when the browser allows it, so a reload restores it. **Clear draft** removes this form's stored value. If storage is unavailable, the current fields still work and the page explains the limitation. Avoid sensitive information. JavaScript-disabled browsers retain a direct LinkedIn link.

The form is hidden in print. Image alt text, visible service names, a skip link, focus styles and live status feedback support keyboard and assistive-technology use. See [asset provenance and licenses](assets/README.md).

## Verification

Run the dependency-free helper regression checks from the repository root:

```bash
node --test Week13WebDevelopmentBasics/Day3CSSGridAndLayout/Exercises/MyCV/contact.test.js
```

They exercise whitespace normalization, missing fields, Unicode boundaries and the prepared-message contract. Browser checks additionally cover real form submission, draft restoration, clearing, clipboard success/fallback, storage failure, no-JavaScript fallback, keyboard use and responsive layouts. No real message needs to be sent to test this flow.

## 🧠 What I learned

- Changing only `grid-template-areas` in a media query moved whole sections without touching the HTML
- `repeat(auto-fill, minmax(100px, 1fr))` wraps the skill chips neatly at any width
- A print stylesheet is short to write and makes the page useful as a real CV
- `word-break: break-all` stopped the long GitHub URL from pushing the sidebar wider on small screens

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 13 Day 3 - CSS Grid and Layout - Exercise

Built with AI-assisted tooling; I reviewed, tested and can explain every change.
