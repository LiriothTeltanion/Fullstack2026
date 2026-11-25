# 🎮 Mini Project - Meme Generator

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/meme-generator-58dea808d6.svg" width="100%" alt="Progress card for Meme Generator">

</div>

A React meme maker. It loads about a hundred popular templates from the free Imgflip API, and I can type top and bottom text, change the size and color, and jump to a random template. The text updates on the image as I type.

## ▶️ How to run

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`. `npm run build` makes a static `dist/` folder that can go on Netlify or Render.

## 🎯 The challenge

| Component | What it does |
|---|---|
| `App` | Fetches `https://api.imgflip.com/get_memes` once in `useEffect`, keeps the templates and the `meme` state (text, size, color, image) |
| `Header` | Title bar |
| `MemeForm` | Controlled inputs: two text fields, a range slider (20 to 72 px) and a color picker. One `handleChange` updates any field by its `name` |
| `MemePreview` | The image with both texts placed on top with `position: absolute` |

`pickRandomImage()` chooses a random template from the list. The meme text uses Impact in capitals with a four-way black `text-shadow`, the classic meme look.

## 🧠 What I learned

- One change handler can serve every input when each input's `name` matches a key in the state object
- `setMeme((current) => ({ ...current, ... }))` keeps the other fields when one changes
- The range input gives a string, so `fontSize` goes through `Number()` before it reaches the style
- I wrapped the image and texts in their own `.meme-frame` so the caption under the image doesn't push the bottom text up
- Downloading the finished meme would need a canvas, and the Imgflip images may block that, so this version only previews it

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 14 Day 7 - Mini-projects - Mini Project
