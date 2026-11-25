# 💉 Mini Project: Vaccines — OOP Queue Manager

Minimal, clean solution with a **Human** class and a **Queue** that manages vaccination order.  
Neutral tone, clear emojis for readability. ✨

---

## 🧠 What’s inside
- `Human` 🧍 — `id_number`, `name`, `age`, `priority`, `blood_type` (`A|B|AB|O`), plus `family` (Part 2).
- `Queue` 🧭 — add, find, swap, get next, get next by blood type, sort by rule, and rearrange to avoid consecutive family members.
- Bonus: no use of `list.insert`, `list.pop`, `list.index`, `list.sort`, or `sorted`. ✅

---

## 🚀 Quickstart

```bash
# Run the tiny demo
python vaccines.py
```

**Demo output (example):**
```
🧾 Initial order: ['Ben', 'Ada', 'Cora', 'Dan', 'Eve']
🔃 After sort_by_age: ['Ben', 'Ada', 'Dan', 'Cora', 'Eve']
🔀 After rearrange_queue: ['Ben', 'Ada', 'Dan', 'Cora', 'Eve']
⏭️ get_next(): Ben
🩸 get_next_blood_type('O'): Ada
📦 Remaining: ['Dan', 'Cora', 'Eve']
```

---

## 🧩 API overview

### `class Human`
- Fields: `id_number: str`, `name: str`, `age: int`, `priority: bool`, `blood_type: str`
- Part 2: `family: list[Human]`, `add_family_member(person)` 🔗
- Validation: blood type must be `A|B|AB|O`, age ≥ 0.

### `class Queue`
- `add_person(person)` → seniors (≥60) or `priority=True` go to the **front**.
- `find_in_queue(person) -> int|None` → manual scan (no `list.index`).
- `swap(p1, p2)` → exchange positions (raises if someone isn’t in queue).
- `get_next() -> Human|None` → returns & removes index 0.
- `get_next_blood_type(bt) -> Human|None` → first with blood type, removed.
- `sort_by_age()` → **priority first**, then **older (≥60)**, then **younger** (stable within groups).
- `rearrange_queue()` → tries to prevent two consecutive members of the same family (greedy; if unavoidable, keeps order progressing).

---

## ✅ Notes
- The implementation focuses on clarity and the specified behaviors.
- Family links are **bi‑directional** when using `add_family_member()`.
