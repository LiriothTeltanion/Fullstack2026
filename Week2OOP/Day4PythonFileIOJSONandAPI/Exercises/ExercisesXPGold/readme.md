# Exercises XP Gold — Classes/Objects + Files + Giphy API 🤹‍♀️

Deliverables (lowercase, no underscores), with **emoji-rich comments**:
- `menumanager.py` — data layer for the Restaurant Menu Manager (JSON I/O + add/remove).
- `menueditor.py` — UI loop that only calls `MenuManager` methods (encapsulation honored).
- `restaurantmenu.json` — seeded with the provided menu.
- `giphyexercises.py` — solutions for Giphy API #1 and #2 (requests + f-strings + filters).

## Exercise 1 — Restaurant Menu Manager
Run the UI:
```bash
python menueditor.py
```
- Shows a small menu, lets you **show**, **add**, **remove**, then **save & exit**.
- The UI knows nothing about the JSON path; `MenuManager` encapsulates file I/O.
- Changes persist to `restaurantmenu.json` when you choose **Save & Exit**.

## Exercise 2 — Giphy API #1
What it does:
- Builds the URL with **f-strings** and variables.
- Fetches `q=hilarious` with `rating=g`.
- Returns JSON when status code = 200.
- Filters GIFs to **height > 100**, returns **length** of that filtered set, and only the **first 10** items.

Try it from the helper demo:
```bash
python giphyexercises.py
```
(The script prints the total filtered count and the first 10 IDs.)

## Exercise 3 — Giphy API #2
From the same `giphyexercises.py`, it will ask for a search term:
- If empty, or if the search yields no results / API error, it returns **trending** GIFs and notes the fallback.
- Uses the provided API key.

---

> All code comments include emojis as requested. Enjoy! ✅
