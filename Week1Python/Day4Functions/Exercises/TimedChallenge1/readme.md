# ⚡ Timed Challenge #1 - Count Character Occurrence

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Timed Challenge1

<img src="../../../../assets/readme/progress/timed-challenge1-11eb650428.svg" width="100%" alt="Readiness status for Timed Challenge1">

**Goal:** Organize practical exercises with clear goals, execution paths, validation, and improvement guidance.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 172 |

### ▶️ Main paths

- `Week1Python/Day4Functions/Exercises/TimedChallenge1/countoccurence.py`

### 🚀 Run

```bash
python Week1Python/Day4Functions/Exercises/TimedChallenge1/countoccurence.py
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

<sub>Managed by NOVA Ultimate v2.0.0 · 2026-07-15T06:22:49+03:00</sub>
<!-- NOVA:ULTIMATE:END -->

Count how many times a specific character appears in a string (case-sensitive).

## 📊 Quick Stats

- **Difficulty**: 🥉 Beginner  
- **Time Limit**: 5-10 minutes  
- **Concepts**: String iteration, counting, input handling  
- **Prerequisites**: Basic Python syntax

## 🎓 Learning Objectives

- ✅ Iterate through strings efficiently
- ✅ Count occurrences with accumulator pattern
- ✅ Handle edge cases (empty input, EOF)
- ✅ Work under time pressure

## 🚀 Quick Start

```bash
cd Exercises/TimedChallenge1
python countoccurence.py
```

## 📋 Challenge Description

### Input Format
```
Line 1: The string to search
Line 2: The character to count (uses first char if multiple provided)
```

### Examples

**Example 1**:
```
Input:
Programming is cool!
o

Output:
3
```

**Example 2**:
```
Input:
This is a great example
y

Output:
0
```

**Example 3**:
```
Input:
Hello World
l

Output:
3
```

---

## 💡 Solution Approach

### Efficient Implementation
```python
def count_char(s: str, ch: str) -> int:
    """Count occurrences of character in string."""
    target = ch[0] if ch else ''
    return sum(1 for c in s if c == target) if target else 0
```

### Key Points

- **Case-sensitive**: 'A' ≠ 'a'
- **First character only**: If user inputs multiple chars, use first
- **Edge case handling**: Empty string returns 0
- **Efficient**: Uses generator expression with `sum()`

---

## 🔧 Alternative Solutions

### Using count() method
```python
def count_char(s: str, ch: str) -> int:
    return s.count(ch[0]) if ch else 0
```

### Explicit loop (more readable for beginners)
```python
def count_char(s: str, ch: str) -> int:
    if not ch:
        return 0
    target = ch[0]
    count = 0
    for c in s:
        if c == target:
            count += 1
    return count
```

---

## 🎯 Time Challenge Tips

1. ⏱️ **Read carefully**: Understand input format first
2. 🎯 **Simple solution first**: Get it working, then optimize
3. ✅ **Test with examples**: Verify before submitting
4. 🚀 **Use built-ins**: `str.count()` is your friend
5. 🐛 **Handle edge cases**: Empty strings, EOF, etc.

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Wrong count | Check if case-sensitive comparison is correct |
| Index error | Check if `ch` is empty before accessing `ch[0]` |
| EOF error | Wrap `input()` in try-except for EOFError |

---

**Author**: Kevin Cusnir 'Lirioth'  
**Repository**: [Fullstack2026](https://github.com/Lirioth/Fullstack2026)  
**Week 1 Day 4** - Functions - Timed Challenge #1
