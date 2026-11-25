# 💪 Daily Challenge - CSS Animation

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/css-animation-206ecab86f.svg" width="100%" alt="Progress card for CSS Animation">

</div>

A tiny solar system and three loading spinners, animated with CSS only. There's a "Pause animations" checkbox that works without JavaScript, and with reduced motion turned on in the system everything stays still.

## ▶️ How to run

Open [index.html](index.html). Tick **Pause animations** to freeze everything, or turn on "reduce motion" in the OS settings and reload.

## 🎯 The challenge

| Part | Animation |
|---|---|
| Sun | `glow` grows the `box-shadow` back and forth (`alternate`) |
| Three planets | Each `.orbit` is a dashed circle that rotates with `spin`; the planet sits on its top edge, so turning the circle carries it around. Durations are 5s, 10s and 18s |
| Moon | A small orbit inside the blue planet, spinning every 2s |
| Stars | Six `radial-gradient` dots that `twinkle` by fading |
| Loaders | A border spinner (`rotate`), three bouncing dots with `animation-delay`, and a pulse (`scale` + `opacity`) |

The pause uses `body:has(#pause:checked) * { animation-play-state: paused; }`. The reduced-motion block sets `animation: none` on everything.

## 🧠 What I learned

- Rotating a parent and leaving the child still is the easiest way to make something orbit
- `animation-delay` on three identical dots is all a bouncing loader needs
- `:has()` lets a checkbox control the whole page, which used to need JavaScript
- A rotating square is wider at 45 degrees, so the page scrolled sideways on a phone until I gave `.space` `overflow: hidden` and pulled the outer orbit in a little

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 13 Day 5 - Coding Day - Daily Challenge
