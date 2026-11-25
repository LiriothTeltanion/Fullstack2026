# 🎮 Mini Project - Vaccines

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/mini-project-vaccines-a94241f92f.svg" width="100%" alt="Progress card for Mini Project Vaccines">

</div>

A vaccination queue manager in `vaccines.py`: a `Human` class for each person and a `Queue` class that decides who goes next.

## ▶️ How to run

```bash
python vaccines.py
```

```text
🧾 Initial order: ['Dan', 'Ben', 'Ada', 'Cora', 'Eve']
🔃 After sort_by_age: ['Ben', 'Dan', 'Ada', 'Cora', 'Eve']
🔀 After rearrange_queue: ['Ben', 'Dan', 'Ada', 'Cora', 'Eve']
⏭️ get_next(): Ben
🩸 get_next_blood_type('O'): Ada
📦 Remaining: ['Dan', 'Cora', 'Eve']
```

Cora and Eve are family, but nobody comes after Eve, so `rearrange_queue()` has no one to put between them.

## 🎯 The challenge

**`Human`** has `id_number`, `name`, `age`, `priority` and `blood_type` (`A`, `B`, `AB` or `O`; anything else raises `ValueError`). Part 2 adds a `family` list, and `add_family_member()` links both people to each other.

| `Queue` method | What it does |
|---|---|
| `add_person(person)` | People aged 60 or more, or with priority, go to the front; everyone else goes to the back |
| `find_in_queue(person)` | Returns the position, or `None` |
| `swap(person1, person2)` | Exchanges two people, or raises `ValueError` if one is missing |
| `get_next()` | Removes and returns the first person |
| `get_next_blood_type(blood_type)` | Removes and returns the first person with that blood type |
| `sort_by_age()` | Priority first, then people aged 60 or more, then the rest, keeping the order inside each group |
| `rearrange_queue()` | Part 2: moves people forward so two family members do not stand next to each other when it can be avoided |

Bonus rule: no `list.insert`, `list.pop`, `list.index`, `list.sort` or `sorted`. I used slices, manual loops and three lists joined together instead.

## 🧠 What I learned

- Splitting people into groups and joining the lists is a simple stable sort
- Slicing (`humans[1:]`) can replace `pop(0)` when a method is not allowed
- Two-way links between objects need care so a person is not added twice
- A greedy rule (take the first person who fits) solves most queue reorderings

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Remote Learning - Object-Oriented Programming - Mini Project
