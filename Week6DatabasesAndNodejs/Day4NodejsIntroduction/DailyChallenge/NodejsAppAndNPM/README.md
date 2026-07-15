# Daily Challenge — Node.js Modules, NPM & Files

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Nodejs App And NPM

<img src="../../../../assets/readme/progress/nodejs-app-and-npm-55f394adf0.svg" width="100%" alt="Readiness status for Nodejs App And NPM">

**Goal:** Practice relational modeling, safe queries, joins, constraints, and persistent data workflows.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 12 |
| Source files | 7 |
| Test files | 0 |
| Text lines | 139 |

### ▶️ Main paths

- `Week6DatabasesAndNodejs/Day4NodejsIntroduction/DailyChallenge/NodejsAppAndNPM/package.json`
- `Week6DatabasesAndNodejs/Day4NodejsIntroduction/DailyChallenge/NodejsAppAndNPM/task-1/app.js`
- `Week6DatabasesAndNodejs/Day4NodejsIntroduction/DailyChallenge/NodejsAppAndNPM/task-2/app.js`
- `Week6DatabasesAndNodejs/Day4NodejsIntroduction/DailyChallenge/NodejsAppAndNPM/task-3/app.js`

### 🚀 Run

```bash
node Week6DatabasesAndNodejs/Day4NodejsIntroduction/DailyChallenge/NodejsAppAndNPM/task-1/app.js
node Week6DatabasesAndNodejs/Day4NodejsIntroduction/DailyChallenge/NodejsAppAndNPM/task-2/app.js
```

### 🟢 What is already strong

- ✅ README documentation is generated and repeatable.
- ✅ Contains 7 source file(s) across practical exercises or projects.
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

<sub>Managed by NOVA Ultimate v2.0.0 · 2026-07-15T06:22:49+03:00</sub>
<!-- NOVA:ULTIMATE:END -->

Mini‑project demonstrating:
- A basic CommonJS module
- Using an NPM package (chalk)
- File I/O with `fs`
- A final script that integrates everything

## Setup
```bash
cd daily-challenge
npm install
```

## Run
```bash
# Task 1
node task-1/app.js

# Task 2
node task-2/app.js

# Task 3
node task-3/app.js

# Challenge (integration)
node challenge.js
```
