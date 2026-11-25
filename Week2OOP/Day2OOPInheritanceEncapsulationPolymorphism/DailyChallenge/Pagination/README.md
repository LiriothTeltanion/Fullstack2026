# 💪 Daily Challenge - Pagination

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/pagination-1cf902caf8.svg" width="100%" alt="Progress card for Pagination">

</div>

A `Pagination` class that splits a list into pages of a chosen size and moves between them.

## ▶️ How to run

```bash
python pagination.py
```

The demo pages the alphabet four letters at a time:

```text
['a', 'b', 'c', 'd']
['e', 'f', 'g', 'h']
['y', 'z']
ValueError
ValueError
```

The two `ValueError` lines come from `go_to_page(10)` and `go_to_page(0)`, because there are only 7 pages.

## 🎯 The challenge

| Method | What it does |
|---|---|
| `__init__(items, page_size=10)` | Stores a copy of the items, rejects a page size below 1 and works out `total_pages` with `math.ceil` |
| `get_visible_items()` | Slices the items for the current page |
| `go_to_page(page_num)` | Jumps to a page (counted from 1) or raises `ValueError` if it is out of range |
| `first_page()` / `last_page()` | Jump to the first or last page |
| `next_page()` / `previous_page()` | Move one page, but never past the ends |
| `__str__()` | Prints the visible items one per line |

The four navigation methods return `self`, so calls can be chained: `p.first_page().next_page()`.

## 🧠 What I learned

- Keeping `current_idx` and `total_pages` inside the class means the rest of the code never does page math
- The user counts pages from 1, but the class counts from 0, so I convert in one place
- Raising `ValueError` is clearer than silently staying on the same page
- Returning `self` is all it takes to make methods chainable

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 2 - Inheritance, Encapsulation and Polymorphism - Daily Challenge
