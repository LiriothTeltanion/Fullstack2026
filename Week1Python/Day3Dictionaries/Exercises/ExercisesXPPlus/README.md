# ➕ Exercises XP Plus

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpplus-677f7b4b10.svg" width="100%" alt="Progress card for Exercises XPPlus">

</div>

Two bigger dictionary exercises in [exercisesxpplus.py](exercisesxpplus.py). The first turns lists of scores into averages and letter grades. The second takes a list of sales and answers questions like "who bought more than once?" and "which product sold the most units?".

## ▶️ How to run

```bash
python exercisesxpplus.py
```

Shortened output:

```
class average: 84.87
Alice - 93.33 A
Bob - 77.67 C
...
product totals: {'Smartphone': 2150.0, 'Laptop': 2200.0, 'Headphones': 800.0}
customer totals: {1: 1800.0, 2: 2200.0, 3: 1150.0}
...
loyal customers: [1, 2, 3]
most popular: ['Headphones']
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `letter_grade(score)` | Checks `GRADE_THRESHOLDS` from the top: 90 or more is A, then B, C, D at 80, 70, 60, and F below that. |
| `calculate_student_grades(grades)` | Average and letter per student, plus the class average. A student with an empty list gets `0.0` and `"N/A"` instead of a division by zero. |
| `analyse_sales_data(transactions)` | Adds `total_price` to a copy of each sale, then sums per product and per customer, keeps sales over 500 from biggest to smallest, lists customers with more than one purchase, averages each product and finds the product with the most units. |

Every counter in there uses the same `.get()` trick:

```python
product_totals[record["product"]] = product_totals.get(record["product"], 0.0) + total_price
```

The most popular product comes back as a list. With this data it is only `['Headphones']` (4 units), but a tie would keep both names.

## 🧠 What I learned

- `.get(key, 0)` let me count things without first checking if the key exists
- Sorting dictionaries by one field is `sort(key=lambda item: item["total_price"], reverse=True)`
- Copying each sale with `dict(entry)` before adding `total_price` leaves the original data alone
- Returning a list for "most popular" was simpler than deciding which product wins a tie

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 3 - Dictionaries - Exercises XP Plus
