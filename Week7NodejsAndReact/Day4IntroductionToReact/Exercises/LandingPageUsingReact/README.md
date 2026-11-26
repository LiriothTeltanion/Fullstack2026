# 🎮 Mini Project - Landing Page Using React

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/landing-page-using-react-2d98e17ad5.svg" width="100%" alt="Progress card for Landing Page Using React">

</div>

A one-page landing site for "Neon Notes", a made-up study notes app. I built it from six small components so each section of the page is its own file.

## ▶️ How to run

Use Node.js 20.19 or newer within v20, or Node.js 22.12 or newer, matching Vite 7.3.8's engine requirement. Vite 7.3.8 and the React plugin 4.7.0 are pinned in the lockfile.

```bash
npm ci
npm run dev
```

Open the address Vite prints (usually http://localhost:5173).

## 🎯 The challenge

| Component  | What it shows                                                                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Navbar`   | Sticky top bar with the brand and anchor links to the sections                                                                                                   |
| `Hero`     | Big headline with a glowing word and a call to action                                                                                                            |
| `Features` | Three feature cards built from an array, each with one locally bundled Font Awesome SVG                                                                          |
| `Pricing`  | Three plans; the `highlight` flag outlines the middle one                                                                                                        |
| `Contact`  | Local demonstration form using `FormData`: required name/email/message, associated validation errors and an inline completion message; nothing is sent or stored |
| `Footer`   | The year from `new Date().getFullYear()`                                                                                                                         |

The colors are CSS variables in `index.css`, and smooth scrolling is switched off for people who ask for reduced motion.

## Local demo behavior and icons

**Preview demo** validates the fields locally. Name and message must contain a non-space character, and email uses the browser's email validity rules. Errors are visible beside their fields and associated through `aria-describedby`; focus moves to the first invalid field. Entries remain available after errors and after a valid preview. There are no contact requests, email delivery or saved messages.

The three feature icons are imported individually from the official Font Awesome free-solid package and rendered with its React component. SVGs are bundled locally, with no kit, CDN or remote font request. They are decorative (`aria-hidden`) because the adjacent headings already identify each feature. Exact package versions and their integrity values are recorded in `package-lock.json`; use `npm ci` and `npm run build`.

Font Awesome Free icons are licensed under [CC BY 4.0](https://fontawesome.com/license/free); the SVG core and React component use MIT licenses. See [Font Awesome's React guide](https://docs.fontawesome.com/web/use-with/react/add-icons) for individual icon imports.

## 🧠 What I learned

- Splitting a page into components feels like splitting a long HTML file into named parts
- Keeping the cards and plans in arrays means a new plan is one more object, not more JSX
- `FormData` reads the uncontrolled input values; React state holds only the errors and status message
- Anchor links (`href="#pricing"`) still work in React because the sections are real ids on the page

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 7 Day 4 - Introduction to React - Mini Project
