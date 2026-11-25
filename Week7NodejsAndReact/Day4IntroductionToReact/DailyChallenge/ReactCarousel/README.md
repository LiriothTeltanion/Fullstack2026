# 💪 Daily Challenge - React Carousel

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/react-carousel-e189d68837.svg" width="100%" alt="Progress card for React Carousel">

</div>

A destination carousel built with react-responsive-carousel. Four slides (Hong Kong, Macao, Japan and Las Vegas) move with arrows, dots, thumbnails or the keyboard, and they also play on their own.

## ▶️ How to run

```bash
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173).

## 🎯 The challenge

The wrapper in components/Carousel.jsx renders the four destinations with the assignment package.

| Feature | How it works |
|---|---|
| Arrows and keyboard | The package controls slide selection with useKeyboardArrows |
| Wrap-around | infiniteLoop returns from the last slide to the first |
| Thumbnails | renderThumbs supplies the existing destination names |
| Autoplay and pause | autoPlay, interval and stopOnHover configure the package |
| Reduced motion | A media-query effect disables autoplay and sets transition time to zero |

The slides retain the authored gradients and captions from slides.js.

## 🧠 What I learned in the earlier hand-built version

- `(i + slides.length) % slides.length` makes "previous" from the first slide land on the last one
- Returning `clearTimeout` from `useEffect` stops old timers from stacking up
- Restarting the timer on every `index` change means a manual click also resets the countdown
- `aria-hidden` on the slides that are off screen keeps screen readers on the visible one

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 7 Day 4 - Introduction to React - Daily Challenge

## Assignment package · 2026-11-25

The main carousel uses react-responsive-carousel, with Hong Kong, Macao, Japan and Las Vegas. Its stylesheet supplies arrows, swipe navigation and slide indicators. Destination captions and custom thumbnails retain the authored gradients. Autoplay respects reduced-motion preferences. The earlier hand-built carousel is preserved in Git history and the dated private backup.

## Earlier hand-built implementation

`components/Carousel.jsx` keeps one number in state, `index`, and everything else follows from it:

| Feature | How it works |
|---|---|
| Sliding | All slides sit in one row and the row moves with `translateX(-index * 100%)` |
| Arrows and keys | `next()` and `prev()` call `goTo(i)`, which wraps around with `%` |
| Dots and thumbnails | Clicking one calls `goTo(i)`; the active one gets the `active` class |
| Autoplay | A `useEffect` starts a 4-second timer after each change and clears it on cleanup |
| Pause | `onMouseEnter` and `onMouseLeave` switch the `paused` state |

Each slide is a CSS gradient with a caption (from `slides.js`), so there are no image files to download. With reduced motion turned on, the slide changes without the animation.
