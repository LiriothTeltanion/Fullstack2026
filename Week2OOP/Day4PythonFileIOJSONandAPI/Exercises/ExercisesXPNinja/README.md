# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-5c88e8c55d.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

A restaurant menu that only accepts Valentine's specials when they pass a set of regex and spelling rules, and a Dungeons & Dragons character generator that saves its results as JSON and TXT.

## ▶️ How to run

From this folder:

```bash
python ninjamenueditor.py
python charactersgame.py
```

The character game asks how many players, then a name and age for each, and writes `characters.json` and `characters.txt`. Without keyboard input it makes Aria (22) and Borin (35):

```text
=== Character 1 ===
Name: Aria
Age: 22
Strength     : 11
...
```

## 🎯 The challenge

1. **Valentine's menu** - [`ninjamenumanager.py`](ninjamenumanager.py) handles [`restaurantmenu.json`](restaurantmenu.json) and [`ninjamenueditor.py`](ninjamenueditor.py) is the menu loop. "Show menu" draws an ASCII heart out of `*`, then the regular menu and the Valentine specials. A special is accepted only when:
   - the first word starts with a capital `V`, other words start uppercase, and connection words like "of" or "the" stay lowercase
   - the name has at least two letters `e` and no digits
   - the price fits `XX,14`, for example `23,14`

   An accepted special is saved right away; a refused one gets a hint about the rule it broke.
2. **Dungeons & Dragons** - [`charactersgame.py`](charactersgame.py) rolls each of the six abilities with "4d6, drop the lowest". `Character.create()` does the rolling, and `Game` asks for the players and writes both export files

## 🧠 What I learned

- `re.compile(r"^\d{2},14$")` with `fullmatch()` checks the whole price string, so `123,14` fails
- Keeping the name rules in `validate_valentine_name()` let the editor call it again to explain a refusal
- "Drop the lowest" is just sort the four rolls high to low and add the first three
- `dataclasses.asdict()` turned each `Character` into a dict that `json.dump` could save

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 4 - File I/O, JSON and APIs - Exercises XP Ninja
