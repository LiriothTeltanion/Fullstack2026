# 💪 Daily Challenge - Page Load Timer

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/modules-e3d1c33ab5.svg" width="100%" alt="Progress card for Modules">

</div>

How long does a page really take to load? This timer uses `requests` and `time` to measure from the moment the request leaves until the last byte of the body has arrived.

## ▶️ How to run

```bash
pip install -r requirements.txt

# Default sites: Google, Ynet, IMDb, Wikipedia, GitHub
python cli.py

# Your own sites, attempts and timeout, with an optional JSON file
python cli.py --urls google.com ynet.co.il imdb.com --attempts 3 --timeout 10 --json-out results.json
```

The output is a table with min, average and max time, the standard deviation, the number of good attempts and each sample. A site that failed gets an `Errors:` line under it. Your numbers will depend on your connection.

## 🎯 The challenge

| Part | What it does |
|---|---|
| `timer.normalize_url(url)` | Puts `https://` in front when the address has no scheme |
| `timer.measure_load_time(url, timeout=15, verify=True)` | Starts `time.perf_counter()`, sends a `GET` with `stream=True`, reads the body in 64 KB chunks and returns `elapsed_s`, `status`, `bytes`, `ok` and `error` |
| `timer.benchmark(urls, attempts=3, ...)` | Several attempts per site, then the times plus min, average, max and standard deviation |
| `cli.py` | `argparse` options, the printed table and the optional JSON report |

A failed request still returns how long it took, with `ok: False` and the error text.

## 🧪 Tests

From the repository root (no internet and no `requests` needed, because the session is faked):

```bash
python -m unittest discover -s tests/python -p "test_timer.py" -v
```

1 test checks the byte count of one measurement and the summary of a two-attempt benchmark. This folder also has its own [`tests/`](tests/) with 2 more tests. Those need `requests` installed and run from this folder with `python -m unittest discover -s tests`.

## 🧠 What I learned

- Without `stream=True` and reading every chunk, I'd only be timing until the headers arrive
- `time.perf_counter()` is made for timing short intervals, unlike the wall clock in `time.time()`
- `timer.py` has no `print` at all, which is what made it easy to test
- `unittest.mock.patch` swaps the real session for a fake one, so the tests never go online

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 5 - Mini-projects - Daily Challenge
