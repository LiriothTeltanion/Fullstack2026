# 💪 Daily Challenge - Advanced Algorithm

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/advanced-algorithm-911e3731b7.svg" width="100%" alt="Progress card for Advanced Algorithm">

</div>

The two-sum challenge: make 20,000 random numbers and find every pair that adds up to a target, 3728 unless I pass another one. I solved it twice so I could compare: a hash-table version and a two-pointer version, both in [src/pairs.py](src/pairs.py). [main.py](main.py) is the command-line runner and [src/demodata.py](src/demodata.py) builds the random list.

## ▶️ How to run

From this folder, with Python 3.10 or newer (the code uses `int | None`):

```bash
python main.py                      # 20,000 numbers, target 3728, hash algorithm
python main.py --seed 42            # same numbers every run
python main.py --algo two-pointer   # use the sorted two-pointer version
python main.py --n 10000 --target 5000 --sample 5
```

`--low` and `--high` change the range of the numbers, 0 to 10,000 by default.

```
=== Two-Sum Pairs Finder ===
Target: 3728
Numbers: 20000 (range 0..10000)
Algorithm: hash
Unique value pairs found: 1369
Total index-pairs (with multiplicities): 7548
Time: 1.91 ms
Sample pairs:
- 0 and 3728 sum to 3728
- 1 and 3727 sum to 3728
...
```

The time changes a little from run to run.

## 🎯 The challenge

The goal is the list of different value pairs `(a, b)` with `a + b = target` and `a ≤ b`, plus how many index pairs there are when values repeat. In `[1, 2, 2, 5, 5, 5]` with target 7, the pair `(2, 5)` counts as 2 × 3 = 6 index pairs.

| Function | What it does |
|---|---|
| `make_dataset(n, low, high, seed)` | Fills a list with `random.randint(low, high)` and returns it with the target. A seed makes the list repeatable. |
| `find_value_pairs_hash(nums, target)` | O(n). A `Counter` of all values, then for each different `a` I check if `target - a` exists and multiply the two counts. If `a` is exactly half the target it needs at least two copies, and the count is `c × (c - 1) / 2`. Only this version gives the index-pair total. |
| `find_value_pairs_two_pointer(nums, target)` | O(n log n). Sorts a copy, starts one pointer at each end and moves the left one up when the sum is too small and the right one down when it's too big. Returns the value pairs only. |

```python
arr = sorted(nums)
i, j = 0, len(arr) - 1
while i < j:
    s = arr[i] + arr[j]
    if s == target:
        ...  # save the pair and skip duplicates
    elif s < target:
        i += 1
    else:
        j -= 1
```

The loop stops when the pointers meet, so a single 1864 can't pair with itself. With `--seed 42` both versions find the same 1369 pairs.

## 🧠 What I learned

- A `Counter` lookup replaces the inner loop of the O(n²) "check every pair" idea
- Two pointers only work on a sorted list, and the sort is where the n log n comes from
- The loop condition matters: `i <= j` would let one number pair with itself, `i < j` needs two different positions
- Duplicates change the count: 3 copies of the same half-target value make 3 pairs, not 9

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 5 - Mini-projects - Daily Challenge
