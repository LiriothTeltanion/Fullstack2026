# 🌟 Daily Challenge Gold - User Info

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/user-info-cc666f7b51.svg" width="100%" alt="Progress card for User Info">

</div>

`UserInfoApp` asks for five records like `John,20,90` and sorts them by name, then age, then score.

## ▶️ How to run

```bash
python dailychallengegolduserinfo.py
```

Typing the sample from the prompt (`Tom,19,80`, `John,20,90`, `Jony,17,91`, `Jony,17,93`, `Json,21,85`) gives:

```text
Sorted: [('John', '20', '90'), ('Jony', '17', '91'), ('Jony', '17', '93'), ('Json', '21', '85'), ('Tom', '19', '80')]
```

When there's no keyboard to read from (for example, input from an empty pipe), it says so and sorts that same sample.

## 🎯 The challenge

| Method | What it does |
|---|---|
| `collect()` | Asks 5 times and splits each answer on commas. A wrong number of parts, an empty name or a non-numeric age or score makes it ask again |
| `sort_records(records)` | `sorted(records, key=lambda t: (t[0], int(t[1]), int(t[2])))` |

The tuples keep the age and score as strings, so the printout looks like the expected one. Only the sort key turns them into numbers.

## 🧠 What I learned

- When the lambda returns a tuple, Python compares the first field and only looks at the next one on a tie
- The two `Jony` rows tie on name and age, so the score decides
- `int()` in the key matters: as strings, `"9"` would sort after `"10"`
- Catching `EOFError` gives a fallback demo when nobody is typing

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 3 - OOP and Modules - Daily Challenge Gold
