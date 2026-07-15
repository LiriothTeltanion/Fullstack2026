# Daily Challenge — Creating Objects (TypeScript) 🎬🧱

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Daily Challenge

<img src="../../../assets/readme/progress/daily-challenge-615fbaa15b.svg" width="100%" alt="Readiness status for Daily Challenge">

**Goal:** Build resilient asynchronous flows with HTTP requests, loading states, validation, and error handling.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 85 |

### ▶️ Main paths

- `Week4AdvAsynchronousJavaScript/Day2AdvancedObjectMethods/DailyChallenge/VideoObjects.ts`

### 🚀 Run

```bash
npx tsx Week4AdvAsynchronousJavaScript/Day2AdvancedObjectMethods/DailyChallenge/VideoObjects.ts
```

### 🟢 What is already strong

- ✅ README documentation is generated and repeatable.
- ✅ Contains 1 source file(s) across practical exercises or projects.
- ✅ No Python syntax error was detected in this folder tree.
- ✅ A likely runnable entry point was detected.

### 🟠 What to improve next

- ⚠️ No local unit test is present yet; repository-wide syntax checks still cover the sources.

### 🧪 Validation

```bash
python tools/nova_quality_gate.py --repo . --strict
python -m unittest discover -s tests/python -p "test_*.py" -v
node tools/run_node_tests.mjs .
```

> The readiness value is a transparent repository heuristic, not a course grade and not proof that every interactive or external-API exercise was executed.

<sub>Managed by NOVA Ultimate v2.0.0 · 2026-07-15T06:22:48+03:00</sub>
<!-- NOVA:ULTIMATE:END -->

Define a custom **`Video`** class and practice object-oriented basics.

## ✅ What’s inside
- `class Video { title, uploader, time }`
- `.watch()` returns: **“{uploader} watched all {time} seconds of {title}!”**
- Two instances created and used
- Bonus: array of 5 videos → instantiated in a loop

## 📂 Files
- `VideoObjects.ts` — all code in one file with a small demo (guarded).

## ▶️ Run locally
```bash
# Using ts-node
npx ts-node VideoObjects.ts

# Or compile to JS and run
npx tsc VideoObjects.ts
node VideoObjects.js
```

## 🧪 Expected snippet
```
Kevin watched all 420 seconds of Intro to TypeScript!
Lirioth watched all 900 seconds of Advanced Array Methods!
Ada watched all 300 seconds of JS Basics!
Grace watched all 480 seconds of DOM Manipulation!
Linus watched all 660 seconds of Async Patterns!
Tim watched all 540 seconds of Functional JS!
Alex watched all 360 seconds of Testing 101!
```
