# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-5c88e8c55d.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

A restaurant menu with Valentine's specials checked by regex, and a Dungeons & Dragons character generator that exports JSON and TXT.

## ▶️ How to run

From this folder:

```bash
python ninjamenueditor.py
python charactersgame.py
```

The character game asks how many players there are, then a name and age for each, and saves `characters.json` and `characters.txt` in the current folder. Without keyboard input it creates two sample characters.

## 🎯 The challenge

1. **Valentine's menu** - [`ninjamenumanager.py`](ninjamenumanager.py) loads [`restaurantmenu.json`](restaurantmenu.json) and [`ninjamenueditor.py`](ninjamenueditor.py) is the menu loop. "Show menu" prints an ASCII heart made of `*` and both menus. A Valentine item is only added if:
   - the first word starts with `V` and connection words like "of" or "the" are lowercase
   - the name has at least two letters `e` and no digits
   - the price matches the pattern `XX,14` (for example `23,14`)

   A valid item is saved to JSON right away.
2. **Dungeons & Dragons** - [`charactersgame.py`](charactersgame.py) rolls each of the six stats with "4d6, drop the lowest". A `Character` class rolls the stats, and a `Game` class asks for the players and writes both export files

## 🧠 What I learned

- `re.compile(r"^\d{2},14$")` plus `fullmatch()` checks a whole price string in one step
- Splitting validation into small rules makes the error hints easy to print
- `dataclasses.asdict()` turns objects into dictionaries that `json.dump` can save

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 4 - File I/O, JSON and APIs - Exercises XP Ninja
