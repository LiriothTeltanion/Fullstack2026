# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-60b62c5837.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

Four harder function exercises in [xpninjafunctionssingle.py](xpninjafunctionssingle.py): putting a full name together with proper capitals, a Morse code translator that works both ways, a star frame around any number of words, and insertion sort written by hand.

## ▶️ How to run

```bash
python xpninjafunctionssingle.py
```

Each exercise has a short demo function, and they run one after the other:

```
=== Exercise 1: Names ===
John Hooker Lee
Bruce Lee
Bruce O'Connor-Smith Lee
=== Exercise 2: Morse ===
'SOS HELP 123' -> '... --- ... / .... . .-.. .--. / .---- ..--- ...--'
...
=== Exercise 4: Insertion Sort ===
Before: [54, 26, 93, 17, 77, 31, 44, 55, 20]
After:  [17, 20, 26, 31, 44, 54, 55, 77, 93]
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `get_full_name(*, first_name, last_name, middle_name=None)` | Keyword-only arguments. The middle name is optional, and an empty first or last name raises `ValueError`. |
| `smart_cap(name)` | Trims, lowercases and capitalizes each piece around `-` and `'`, so `" o'connor-smith "` becomes `O'Connor-Smith`. |
| `text_to_morse()` / `morse_to_text()` | Letters are separated by a space and words by ` / `. The decode dictionary is the encode one flipped. A character with no Morse code raises `ValueError`. |
| `box_printer(*strings)` | Pads every string to the longest one with `ljust()`, prints the frame and also returns it. |
| `insertion_sort(alist)` | Sorts in place: bigger items slide one step right until the current one fits. |

The box demo prints:

```
******************
* Hello          *
* World          *
* in             *
* reallylongword *
* a              *
* frame          *
******************
```

## 🧠 What I learned

- `*strings` in the parameters lets the caller pass as many words as they want
- Flipping a dictionary with `{v: k for k, v in d.items()}` gave me the decoder for free
- The `*` before the name parameters forces callers to write `first_name=...`, which keeps the order from getting mixed up
- Insertion sort is slow on a reversed list but very quick when the list is already almost sorted

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 4 - Functions - Exercises XP Ninja
