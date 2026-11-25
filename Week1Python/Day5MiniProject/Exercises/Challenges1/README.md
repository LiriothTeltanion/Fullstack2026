# 🧩 Challenges 1

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/challenges1-e9520d5915.svg" width="100%" alt="Progress card for Challenges1">

</div>

Twenty small functions to go over the Week 1 basics again: lists, strings, loops, conditions and a bit of math. They're all in [challengessolutions.py](challengessolutions.py), each with type hints and a one-line docstring.

## ▶️ How to run

```bash
python challengessolutions.py
```

Nothing to install. It runs a quick demo that calls each function once:

```
=== Quick Demo ===
1) insert_at: [1, 99, 2, 3]
2) count_spaces: 6
3) count_case: {'upper': 2, 'lower': 4}
...
20) mask_password: **********
```

## 🎯 The challenge

| # | Function | What it does |
|---|----------|--------------|
| 1 | `insert_at` | Puts an item at a given index |
| 2 | `count_spaces` | Counts the spaces in a string |
| 3 | `count_case` | Counts upper and lower case letters |
| 4 | `my_sum` | Adds up a list without using `sum()` |
| 5 | `find_max` | Finds the biggest number without `max()` |
| 6 | `factorial` | n! |
| 7 | `list_count` | How many times an element shows up |
| 8 | `norm` | Square root of the sum of squares, `[1, 2, 2]` gives 3.0 |
| 9 | `is_mono` | Is the list always going up or always going down? |
| 10 | `longest_word` | The longest word in a list |
| 11 | `split_ints_and_strs` | Splits a mixed list into integers and strings, skipping booleans and floats |
| 12 | `is_palindrome` | Palindrome check that ignores case |
| 13 | `sum_over_k` | Counts the words longer than k |
| 14 | `dict_avg` | Average of a dictionary's values |
| 15 | `common_div` | Common divisors of two numbers (without 1), found through their GCD |
| 16 | `is_prime` | Prime check |
| 17 | `weird_print` | Keeps items where both the index and the value are even |
| 18 | `type_count` | Counts the types of the keyword arguments it receives |
| 19 | `split_like` | My own `str.split()`, including empty pieces when a separator is given |
| 20 | `mask_password` | Replaces every character with `*` |

## 🧠 What I learned

- Writing `my_sum`, `find_max` and `split_like` by hand showed me how much the built-ins do for free
- `isinstance(True, int)` is `True`, so I check for `bool` first in `split_ints_and_strs`
- Getting the GCD first means `common_div` only has to look for divisors of one number
- With a separator, `"a,b,,c,"` splits into five pieces, two of them empty, same as the real `split(",")`

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 5 - Mini-projects - Challenges 1
