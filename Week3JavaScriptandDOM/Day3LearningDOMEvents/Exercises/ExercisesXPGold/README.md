# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-e35a4208fd.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

Three small form exercises. The HTML only has `<div id="root"></div>`; JavaScript builds every section.

## ▶️ How to run

Open `index.html` in a browser (or use `npm run dev` from the repo root).

## 🎯 The challenge

1. **Select a kind of Music** – a `<select>` with Rock and Blues; the script adds `Classic`, selects it by default and shows the chosen value on every `change`.
2. **Delete colors** – the **Select and Remove** button calls `removecolor()`, which removes the selected color and prints `Removed: Red ✅` (or `List is now empty.`).
3. **Shopping list** – `addItem()` pushes the typed item into the `shoppingList` array (the Enter key works too) and `clearAll()` empties it; `render()` redraws the `<ul>` and the item count.

A small `el(tag, props, ...children)` helper creates each element, sets its text, class, attributes and `on...` listeners in one call.

## 🧠 What I learned

- A tiny helper function saves a lot of repeated `createElement` code
- `select.selectedIndex` and `select.remove(index)` edit the options of a list
- Keeping the data in an array and redrawing from it keeps the list in sync
- Functions put on `window` can still be called from the console or from HTML

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 3 - DOM Events - Exercises XP Gold
