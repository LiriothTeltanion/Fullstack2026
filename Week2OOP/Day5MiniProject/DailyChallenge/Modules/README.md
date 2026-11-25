# 💪 Daily Challenge - Page Load Timer

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/modules-e3d1c33ab5.svg" width="100%" alt="Progress card for Modules">

</div>

The modules challenge: measure how long a web page takes to load completely, from sending the request until the last byte arrives, with `requests` and `time`.

## ▶️ How to run

```bash
pip install -r requirements.txt

# Default sites: Google, Ynet, IMDb, Wikipedia, GitHub
python cli.py

# Your own sites, attempts and timeout, with an optional JSON file
python cli.py --urls google.com ynet.co.il imdb.com --attempts 3 --timeout 10 --json-out results.json
```

It prints a table with the minimum, average and maximum time, the standard deviation and each sample, plus an `Errors:` line under any site that had failures. The numbers depend on your network.

## 🎯 The challenge

| Part | What it does |
|---|---|
| `timer.normalize_url(url)` | Adds `https://` when the address has no scheme |
| `timer.measure_load_time(url, timeout=15, verify=True)` | Starts `time.perf_counter()`, sends `GET` with `stream=True`, reads the whole body in chunks and returns a dict with `elapsed_s`, `status`, `bytes`, `ok` and `error` |
| `timer.benchmark(urls, attempts=3, ...)` | Runs several attempts per site and keeps the times, min, average, max and standard deviation |
| `cli.py` | Reads the options with `argparse`, prints the table and can save the report as JSON |

## 🧪 Tests

From the repository root (no internet and no `requests` needed, the session is faked):

```bash
python -m unittest discover -s tests/python -p "test_timer.py" -v
```

1 test checks the byte count of one measurement and the summary of a two-attempt benchmark. This folder also has its own [`tests/`](tests/) with 2 more tests; they need `requests` installed and run from this folder with `python -m unittest discover -s tests`.

## 🧠 What I learned

- `stream=True` plus reading every chunk measures the full download, not just the headers
- `time.perf_counter()` is the right clock for measuring short durations
- Keeping the logic in `timer.py` and the printing in `cli.py` makes the logic easy to test
- `unittest.mock.patch` lets me test network code without touching the network

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 5 - Mini-projects - Daily Challenge
