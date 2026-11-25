# 🥷 Exercises XP Ninja - Expert Function Challenges

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-60b62c5837.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

The harder Day 4 set, all in one file: building full names, translating to and from Morse code, printing text inside a star box, and writing insertion sort by hand.

## ▶️ How to run

```bash
python xpninjafunctionssingle.py
```

It runs a short demo for each of the four exercises.

## 📋 The exercises

### 1. Full name builder 🧑‍🤝‍🧑
`get_full_name()` takes keyword-only arguments and an optional middle name. `smart_cap()` fixes the capitalization, including hyphens and apostrophes.

```python
get_full_name(first_name="john", middle_name="hooker", last_name="lee")  # 'John Hooker Lee'
get_full_name(first_name="bruce", last_name="lee")                       # 'Bruce Lee'
smart_cap("o'connor-smith")                                              # "O'Connor-Smith"
```

### 2. Morse code translator 📻
`text_to_morse()` and `morse_to_text()` use two dictionaries (one is the reverse of the other). Letters are separated by spaces and words by ` / `. Unsupported characters raise a `ValueError`.

```python
text_to_morse("SOS HELP 123")
# '... --- ... / .... . .-.. .--. / .---- ..--- ...--'
```

### 3. Box printer ⭐
`box_printer(*strings)` accepts any number of strings, pads them to the longest one, prints the frame and also returns it.

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

### 4. Insertion sort 🧠
`insertion_sort()` sorts the list in place, like sorting cards in your hand: bigger items shift right and the current one drops into its spot.

```
Before: [54, 26, 93, 17, 77, 31, 44, 55, 20]
After:  [17, 20, 26, 31, 44, 54, 55, 77, 93]
```

## 🧠 What I learned

- `*args` lets a function take any number of arguments
- A reversed dictionary (`{v: k for k, v in d.items()}`) gives a two-way lookup
- Keyword-only parameters (after `*`) make calls easier to read
- Insertion sort is O(n²) in the worst case but O(n) when the list is almost sorted

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 4 - Functions - Exercises XP Ninja
