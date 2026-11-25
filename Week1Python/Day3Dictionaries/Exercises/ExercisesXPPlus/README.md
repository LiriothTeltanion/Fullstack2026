# 📈 Python Practice — Student Grade Summary & Sales Data Analysis

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpplus-677f7b4b10.svg" width="100%" alt="Progress card for Exercises XPPlus">

</div>

Two extra exercises from Day 3: grade summaries with letter grades, and some basic analysis over a list of sales transactions. Everything uses plain dictionaries and lists, no external packages.

## ▶️ How to run

```bash
python exercisesxpplus.py
```

I used Python 3.10+.

## 📚 Exercise 1 — Student Grade Summary

For each student I compute the average and a letter grade, then the class average.

- `avg >= 90` → A, `>= 80` → B, `>= 70` → C, `>= 60` → D, otherwise F
- The thresholds live in `GRADE_THRESHOLDS` and `letter_grade()` walks through them.
- `calculate_student_grades()` returns the averages, the letters and the class average. A student with no scores gets `0.0` and `"N/A"`, so there is no division by zero.

```python
report = calculate_student_grades({"Alice": [88, 92, 100], "Bob": [75, 78, 80]})
print(round(report.class_average, 2))
print(report.letter_grades)  # {'Alice': 'A', 'Bob': 'C'}
```

## 🛒 Exercise 2 — Sales Data Analysis

Each transaction is a dict with `customer_id`, `product`, `price`, `quantity` and `date`. `analyse_sales_data()` does five things:

1. Adds `total_price = price * quantity` and sums totals per product and per customer.
2. Keeps transactions with `total_price > 500`, sorted from highest to lowest.
3. Finds loyal customers (more than one purchase).
4. Computes the average transaction value per product.
5. Finds the most popular product by quantity sold. It returns a list, so ties are kept.

```python
product_totals[record["product"]] = product_totals.get(record["product"], 0.0) + total_price
```

The `.get(key, 0)` pattern is what I used for every counter here.

## 🧠 What I learned

- Building summaries with dictionaries and `.get()` defaults
- Sorting a list of dicts with `key=lambda ...` and `reverse=True`
- Returning a list when there can be a tie instead of picking one value

Next time I'd like to try `collections.Counter` for the counting parts.

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 3 - Exercises XP+
