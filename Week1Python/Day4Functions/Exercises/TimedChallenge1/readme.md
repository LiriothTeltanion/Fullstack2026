# ⚡ Timed Challenge #1 - Count Character Occurrence

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
**Repository**: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
**Week 1 Day 4** - Functions - Timed Challenge #1
