# 🎮 Mini Project - Vaccines

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/mini-project-vaccines-a94241f92f.svg" width="100%" alt="Progress card for Mini Project Vaccines">

</div>

Who gets vaccinated next? `vaccines.py` answers that with a `Human` class for each person and a `Queue` class that holds the order and the rules.

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

The demo adds Ada (72), Ben (34, priority), Cora (40), Dan (67) and Eve (25). Ada, Ben and Dan each jump to the front as they arrive, which is why Dan ends up first. Cora and Eve are family, but they're the last two and nobody is left to stand between them, so `rearrange_queue()` keeps them together.

## 🎯 The challenge

**`Human`** has `id_number`, `name`, `age`, `priority` and `blood_type` (`A`, `B`, `AB` or `O`, anything else raises `ValueError`). Part 2 adds a `family` list, and `add_family_member()` adds each person to the other's list.

| `Queue` method | What it does |
|---|---|
| `add_person(person)` | Age 60 or more, or priority, goes to the front. Everyone else goes to the back |
| `find_in_queue(person)` | The position, or `None` |
| `swap(person1, person2)` | Swaps two people, or raises `ValueError` if one isn't in the queue |
| `get_next()` | Takes the first person out and returns them |
| `get_next_blood_type(blood_type)` | Takes out the first person with that blood type |
| `sort_by_age()` | Priority first, then 60 and over, then the rest, keeping the order inside each group |
| `rearrange_queue()` | Part 2: pulls someone forward so two relatives don't stand next to each other, when that's possible |

The bonus rule banned `list.insert`, `list.pop`, `list.index`, `list.sort` and `sorted`. So the queue uses slices, plain loops and three lists added together.

## 🧠 What I learned

- `prio + older + younger` sorts into groups and keeps everyone's order inside each group, all without `sort()`
- `self.humans = self.humans[1:]` does the job of `pop(0)` when `pop` isn't allowed
- `add_family_member()` checks both lists with `is` first, so nobody gets added twice
- `rearrange_queue()` takes the first person who doesn't clash, which works unless the only people left are relatives

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Remote Learning - Object-Oriented Programming - Mini Project
