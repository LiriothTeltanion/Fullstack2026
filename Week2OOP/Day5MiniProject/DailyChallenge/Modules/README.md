# ⏱️ Daily Challenge: Modules — Page Load Timer (Python)

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/modules-e3d1c33ab5.svg" width="100%" alt="Progress card for Modules">

</div>

Measure how long a webpage takes to fully load — request + full body download — using **requests** and **time**. 🌐🐍

---

## 🧠 What You’ll Practice
- **OOP & Modules** basics (clean module + CLI) 🧩
- **requests** for HTTP 🌍
- **time.perf_counter()** for precise timing ⏲️

---

## ✅ Task
Create a function that returns **the total time** to fetch a webpage — from sending the request until **all bytes** are downloaded. Then test with multiple sites (e.g., google, ynet, imdb).

---

## 🚀 Quickstart

**Requirements:** `Python 3.10+` and `requests`

```bash
pip install requests

# Run default benchmark (Google, Ynet, IMDb, Wikipedia, GitHub)
python cli.py

# Custom targets + attempts + timeout
python cli.py --urls google.com ynet.co.il imdb.com --attempts 3 --timeout 10
```

Optional JSON export:
```bash
python cli.py --urls google.com imdb.com --json-out results.json
```

---

## 🧩 Core Function

- `measure_load_time(url, timeout=15, verify=True)` → returns a dict:
  - `elapsed_s` ⏳ total time
  - `status` 📦 HTTP status code
  - `bytes` 📦 downloaded bytes
  - `ok` ✅ success flag
  - `error` ❌ error (if any)

Under the hood, it performs `GET(..., stream=True)` and reads the **entire** body to be accurate. 🔎

---

## 🧪 Example Output

```text
📊 Page Load Benchmark Results

URL                                |      min |      avg |      max |      σ |   n | samples
----------------------------------------------------------------------------------------------
https://www.google.com             |   0.183s |   0.221s |   0.254s | 0.029s |   3 | 0.183s, 0.226s, 0.254s
   ⚠️  Errors: []
https://www.ynet.co.il             |   0.492s |   0.561s |   0.638s | 0.059s |   3 | 0.492s, 0.553s, 0.638s
   ⚠️  Errors: []
```

*(Your numbers will vary based on network conditions.)* 📶

---

## 🗂️ Structure

```text
page_load_timer_challenge/
├─ timer.py     # ⏱️ Core timing logic (requests + time) with friendly comments
├─ cli.py       # 🖥️ Command-line runner with table output + JSON option
├─ tests/
│  └─ test_timer.py  # 🧪 Unit tests (mocked, no Internet needed)
└─ README.md
```

---

## 📝 Notes
- Neutral commentary and tone; no references to external courses or experience levels. 🤝
- Comments and README include clear emojis to guide reading. ✨
