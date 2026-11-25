# 🌟 Daily Challenge Gold - User Info

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/user-info-cc666f7b51.svg" width="100%" alt="Progress card for User Info">

</div>

A `UserInfoApp` class that asks for five `Name,Age,Score` records and sorts them by name, then age, then score.

## ▶️ How to run

```bash
python dailychallengegolduserinfo.py
```

With the sample from the prompt (`Tom,19,80`, `John,20,90`, `Jony,17,91`, `Jony,17,93`, `Json,21,85`) it prints:

```text
Sorted: [('John', '20', '90'), ('Jony', '17', '91'), ('Jony', '17', '93'), ('Json', '21', '85'), ('Tom', '19', '80')]
```

If there is no keyboard input, it sorts that same sample instead.

## 🎯 The challenge

| Method | What it does |
|---|---|
| `collect()` | Asks 5 times, splits each line on commas and asks again if the format is wrong or the age or score is not a number |
| `sort_records(records)` | `sorted(records, key=lambda t: (t[0], int(t[1]), int(t[2])))` |

The values stay as strings so the output matches the expected one, but the lambda turns age and score into numbers for sorting.

## 🧠 What I learned

- A lambda that returns a tuple sorts by several fields in order
- Converting to `int` inside the key avoids `"9"` sorting after `"10"`
- Catching `EOFError` lets the script fall back to a demo when nobody is typing

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 3 - OOP and Modules - Daily Challenge Gold
