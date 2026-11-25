# 💪 Daily Challenge - Pagination

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/pagination-1cf902caf8.svg" width="100%" alt="Progress card for Pagination">

</div>

Like the page buttons under a search result: `Pagination` takes a list and a page size, shows one page at a time and moves forward, back or straight to a page.

## ▶️ How to run

```bash
python pagination.py
```

The demo pages through the alphabet, four letters per page:

```text
['a', 'b', 'c', 'd']
['e', 'f', 'g', 'h']
['y', 'z']
ValueError
ValueError
```

Both `ValueError` lines are expected. There are only 7 pages, so `go_to_page(10)` and `go_to_page(0)` are refused.

## 🎯 The challenge

| Method | What it does |
|---|---|
| `__init__(items, page_size=10)` | Copies the items, refuses a page size under 1 and gets `total_pages` from `math.ceil` |
| `get_visible_items()` | Returns the slice for the current page |
| `go_to_page(page_num)` | Jumps to a page counted from 1, or raises `ValueError` when it's out of range |
| `first_page()` / `last_page()` | Go to the first or last page |
| `next_page()` / `previous_page()` | Move one page, stopping at the ends |
| `__str__()` | The visible items, one per line |

Those four navigation methods return `self`, which allows chains like `p.first_page().next_page()`.

## 🧠 What I learned

- `math.ceil(26 / 4)` gives 7, so the half-full last page still counts
- People say "page 1" but the class stores index 0, and `go_to_page()` is the only place that converts
- Moving past the last page just stays put, while a bad page number raises an error
- Returning `self` at the end of a method is all chaining needs

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 2 - Inheritance, Encapsulation and Polymorphism - Daily Challenge
