# 💪 Daily Challenge - Advanced Algorithm

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/advanced-algorithm-911e3731b7.svg" width="100%" alt="Progress card for Advanced Algorithm">

</div>

My solution to the two-sum daily challenge: generate 20,000 random numbers and find every pair that adds up to a target (3728 by default). I wrote two versions, a hash-based one in [src/pairs.py](src/pairs.py) and a two-pointer one, so I could compare them. [main.py](main.py) is the command-line runner and [src/demodata.py](src/demodata.py) builds the random list.

## ▶️ How to run

Run it from this folder. The code uses `int | None` type hints, so it needs Python 3.10 or newer.

```bash
python main.py                      # 20,000 numbers, target 3728, hash algorithm
python main.py --seed 42            # same numbers every run
python main.py --algo two-pointer   # use the sorted two-pointer version
python main.py --n 10000 --target 5000 --sample 5
```

Other options: `--low` and `--high` set the number range (0 to 10,000 by default).

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

## 🎯 The challenge

Return the unique value pairs `(a, b)` with `a + b = target` and `a ≤ b`, and also count how many index pairs exist when values repeat. With `[1, 2, 2, 5, 5, 5]` and target 7, `(2, 5)` appears as 2 × 3 = 6 index pairs.

| Function | What it does |
|---|---|
| `make_dataset(n, low, high, seed)` | Builds the random list and returns it with the target. |
| `find_value_pairs_hash(nums, target)` | O(n). Counts every number with `Counter`, then for each unique `a` checks whether `target - a` is there and multiplies the counts. When `a + a = target` it needs at least two copies, and the count is `n × (n - 1) / 2`. Only this version returns the index-pair total. |
| `find_value_pairs_two_pointer(nums, target)` | O(n log n). Sorts a copy, puts one pointer at each end and moves them inward depending on whether the sum is too small or too big. It returns unique value pairs only. |

```python
arr = sorted(nums)
i, j = 0, len(arr) - 1
while i <= j:
    s = arr[i] + arr[j]
    if s == target:
        ...  # save the pair and skip duplicates
    elif s < target:
        i += 1
    else:
        j -= 1
```

With `--seed 42` the two-pointer version finds 1370 pairs instead of 1369: because the loop runs while `i <= j`, a single 1864 is paired with itself as `(1864, 1864)`. Using `i < j` would match the hash version.

## 🧠 What I learned

- Replacing nested loops (O(n²)) with a hash table lookup
- The two-pointer technique on a sorted list, and how one `<=` can change the result
- Counting combinations when values repeat
- Timing code with `time.perf_counter()` and adding options with `argparse`

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 5 - Mini-projects - Daily Challenge
