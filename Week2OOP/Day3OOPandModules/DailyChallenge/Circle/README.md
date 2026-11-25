# 💪 Daily Challenge - Circle

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/circle-97d878cfe4.svg" width="100%" alt="Progress card for Circle">

</div>

A `Circle` class in [`circle.py`](circle.py) that can be built from a radius or a diameter, and that can be added, compared and sorted.

## ▶️ How to run

```bash
python circle.py
```

```text
c1: Circle(r=3.00, d=6.00)
c2: Circle(r=4.00, d=8.00)
c1 area: 28.27
c2 area: 50.27
c3 = c1 + c2: Circle(r=7.00, d=14.00)
c1 > c2: False
c1 == c2: False
sorted by radius: [1.0, 3.0, 4.0, 7.0, 10.0]
```

## 🎯 The challenge

| Part | What it does |
|---|---|
| `__init__(radius=None, diameter=None)` | Takes one of the two; giving both or neither raises `ValueError` |
| `radius` / `diameter` properties | Read and set either one; the setters reject values of 0 or less |
| `area()` | Returns `math.pi * radius ** 2` |
| `__str__` / `__repr__` | Print `Circle(r=3.00, d=6.00)` |
| `__add__` | `c1 + c2` returns a new circle with the two radii added |
| `__eq__`, `__lt__`, `__gt__` | Compare by radius, so `sorted()` and `.sort()` work |

## 🧪 Tests

From the repository root:

```bash
python -m unittest discover -s tests/python -p "test_circle.py" -v
```

3 tests check the radius and diameter, adding and sorting circles, and the errors for invalid values.

## 🧠 What I learned

- A property setter is a good place to validate a value every time it changes
- Storing only the radius and computing the diameter keeps the two from getting out of sync
- `a + b` and `a < b` are just calls to `__add__` and `__lt__`
- With `__lt__` defined, sorting a list of my own objects needs no `key`

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 3 - OOP and Modules - Daily Challenge
