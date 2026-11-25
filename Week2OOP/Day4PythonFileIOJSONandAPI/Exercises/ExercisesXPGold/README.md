# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-f50d6cc9c3.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

A restaurant menu manager saved in JSON, and two exercises with the Giphy API.

## ▶️ How to run

Run both from this folder, because the menu file path is relative:

```bash
python menueditor.py
```

```text
=== Exercise Menu Manager ===
1) Show restaurant menu 🍽️
2) Add an item ➕
3) Remove an item ➖
4) Save & Exit 💾🚪
Choose an option (1-4):
```

The Giphy exercises need `requests` and your own key in the `GIPHY_API_KEY` environment variable (see [`.env.example`](../../../../.env.example)):

```bash
pip install requests
python giphyexercises.py
```

## 🎯 The challenge

1. **Restaurant menu manager** - [`menumanager.py`](menumanager.py) owns the JSON file: it loads [`restaurantmenu.json`](restaurantmenu.json), adds items (an existing name just gets a new price), removes items with `del` and saves. [`menueditor.py`](menueditor.py) is only the menu loop and never touches the file path; changes are written when you pick Save & Exit
2. **Giphy API #1** - `search_hilarious()` builds the URL with f-strings, searches "hilarious" with rating `g`, keeps only GIFs taller than 100 px and returns the first 10 plus the filtered count
3. **Giphy API #2** - `search_or_trending(term)` searches the term you type, and falls back to trending GIFs when the term is empty, the API fails or there are no results

## 🧠 What I learned

- Splitting data code and menu code into two files means each one has a single job
- `with open(...)` together with `json.load` and `json.dump` is all the file handling a menu needs
- Checking `status_code` before calling `.json()` avoids crashes on a bad response
- API keys belong in environment variables, never in the code

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 4 - File I/O, JSON and APIs - Exercises XP Gold
