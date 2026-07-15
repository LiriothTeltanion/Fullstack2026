# 🥈 Exercises XP Gold - Advanced Function Techniques# 🥇 Exercises XP Gold - Advanced Function Techniques# 🥈 XP Gold — Functions (Short & Simple)

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPGold

<img src="../../../../assets/readme/progress/exercises-xpgold-0aa5d263c3.svg" width="100%" alt="Readiness status for Exercises XPGold">

**Goal:** Reinforce the lesson with intermediate scenarios, validation, and stronger edge-case handling.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 770 |

### ▶️ Main paths

- `Week1Python/Day4Functions/Exercises/ExercisesXPGold/xpgoldfunctions.py`

### 🚀 Run

```bash
python Week1Python/Day4Functions/Exercises/ExercisesXPGold/xpgoldfunctions.py
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

**Author:** Kevin Cusnir "Lirioth"  

**Course:** Fullstack Bootcamp 2026  

**Last Updated:** October 19, 2025Three challenging exercises covering age calculation, mathematical series, and statistical simulation with dice.This repo contains a tiny Python script solving **three function-based exercises**:



Three challenging exercises covering age calculation with datetime, mathematical series summation, and statistical simulation with dice rolling.



## 📊 Quick Stats## 📊 Quick Stats1) **⏰ When will I retire?**  



- **⏰ Duration**: 60-90 minutes   - Hard-coded today: **2025-09-16** (as the exercise requests).  

- **🎯 Difficulty**: 🟡 Intermediate

- **📝 Exercises**: 3 advanced challenges- **Difficulty**: 🥈 Intermediate     - `get_age(year, month, day)` returns whole years.  

- **✅ Prerequisites**: ExercisesXP completed

- **🐍 Python Version**: 3.8+- **Time Required**: 60-90 minutes     - `can_retire(gender, dob)` returns **✅ True** if: men **67+**, women **62+**.  

- **📚 Key Topics**: Date calculations, series summation, random simulation, statistics

- **Exercises**: 3 advanced challenges     - Input format for DOB: `yyyy/mm/dd`.

## 🎯 Learning Objectives

- **Concepts**: Date calculations, series summation, random simulation, statistics  

By completing these exercises, you will:

- ✅ Work with date calculations using `datetime` module- **Prerequisites**: ExercisesXP completed2) **🧮 Sum: X + XX + XXX + XXXX**  

- ✅ Implement age-based business logic

- ✅ Use string manipulation for mathematical patterns   - `series_sum(x)` uses string repetition for clarity.

- ✅ Apply random simulation and calculate statistics

- ✅ Validate user input and handle edge cases## 🎓 Learning Objectives

- ✅ Calculate averages from multiple trials

3) **🎲 Double Dice**  

---

- ✅ Work with date calculations using `datetime` module   - `throw_dice()` returns 1..6.  

## 📋 Exercise Breakdown

- ✅ Implement age-based business logic   - `throw_until_doubles()` counts throws until both dice match.  

### Exercise 1: When Will I Retire? ⏰

- ✅ Use string manipulation for mathematical patterns   - `main()` repeats **100** doubles → prints **Total** and **Average** (2 decimals).

**🎯 Objective**: Calculate age and determine retirement eligibility based on gender

- ✅ Apply random simulation and calculate statistics

**Concepts**: `datetime` module, date arithmetic, age calculation, conditional logic

- ✅ Validate user input and handle edge cases---

**Difficulty**: 🟡 Intermediate



**Retirement Rules**:

- **Men**: Retire at age 67## 🚀 Quick Start## 🚀 How to run

- **Women**: Retire at age 62



**Task**:

1. Hard-code today's date as **2025-09-16** (as per exercise requirement)```bash```bash

2. Create `get_age(year, month, day)` function that calculates age in years

3. Create `can_retire(gender, dob)` function that returns `True` if eligiblecd Exercises/ExercisesXPGoldpython3 xpgoldfunctions.py

4. Get user input: gender (m/f) and date of birth (yyyy/mm/dd)

5. Display retirement eligibilitypython xpgoldfunctions.py```



**Expected Output**:```

```

=== Exercise 1 ===- For deterministic tests in Exercise 3, you can uncomment `random.seed(0)`.

Gender (m/f): m

DOB (yyyy/mm/dd): 1960/05/03## 📋 Exercises

You can retire.

---

Gender (m/f): f

DOB (yyyy/mm/dd): 1970/03/15### 1️⃣ When Will I Retire? ⏰

You cannot retire yet.

```Calculate age and retirement eligibility (men: 67, women: 62)## Example session (one possible run)



**Solution Approach**:

```python

from datetime import date### 2️⃣ Series Sum 🧮```



def get_age(year, month, day):Calculate X + XX + XXX + XXXX (e.g., 3 + 33 + 333 + 3333 = 3702)=== Exercise 1 ===

    """

    Calculate age in complete years from birth date to today.Gender (m/f): m

    

    Args:### 3️⃣ Double Dice 🎲  DOB (yyyy/mm/dd): 1960/05/03

        year (int): Birth year

        month (int): Birth month (1-12)Simulate rolling until doubles, calculate average over 100 trialsYou can retire.

        day (int): Birth day (1-31)

        

    Returns:

        int: Age in complete years## 🔧 Troubleshooting=== Exercise 2 ===

    """

    # Hard-coded today as per exercise requirementEnter a digit X: 3

    today = date(2025, 9, 16)

    birth_date = date(year, month, day)| Issue | Solution |Result: 3702

    

    # Calculate age|-------|----------|

    age = today.year - birth_date.year

    | Date format error | Use 'yyyy/mm/dd' format |=== Exercise 3 ===

    # Adjust if birthday hasn't occurred this year

    if (today.month, today.day) < (birth_date.month, birth_date.day):| Invalid gender | Use 'm' or 'f' only |Total throws: 314

        age -= 1

    | Inconsistent averages | Increase trial count for better accuracy |Average throws to reach doubles: 3.14

    return age

```



def can_retire(gender, dob):---

    """

    Check if person can retire based on age and gender.> Notes:

    

    Args:**Author**: Kevin Cusnir 'Lirioth'  > - The exercise asks to hard-code the current date; in real apps, you’d use `datetime.date.today()`.

        gender (str): 'm' for male, 'f' for female

        dob (str): Date of birth in 'yyyy/mm/dd' format**Repository**: [Fullstack2026](https://github.com/Lirioth/Fullstack2026)  > - Retirement ages used: men 67, women 62 (as stated in the prompt).

        

    Returns:**Week 1 Day 4** - Functions - Exercises XP Gold

        bool: True if can retire, False otherwise
    """
    # Parse date of birth
    year, month, day = map(int, dob.split('/'))
    age = get_age(year, month, day)
    
    # Check retirement eligibility
    if gender.lower() == 'm':
        return age >= 67
    elif gender.lower() == 'f':
        return age >= 62
    else:
        raise ValueError("Gender must be 'm' or 'f'")


# Main execution
gender = input("Gender (m/f): ")
dob = input("DOB (yyyy/mm/dd): ")

if can_retire(gender, dob):
    print("You can retire.")
else:
    print("You cannot retire yet.")
```

**Key Learning Points**:

1. **Date Arithmetic**:
```python
# Creating dates
from datetime import date
birth_date = date(1990, 5, 15)  # May 15, 1990
today = date.today()

# Calculating differences
age_years = today.year - birth_date.year
```

2. **Birthday Adjustment**:
```python
# Person born Dec 25, 1990, today is June 1, 2025
age = 2025 - 1990  # = 35

# But birthday hasn't occurred yet!
# Need to subtract 1 if birthday later in year
if (6, 1) < (12, 25):  # (today month, day) < (birth month, day)
    age -= 1  # age = 34 (correct!)
```

3. **Parsing Date Strings**:
```python
# Input: "1990/05/15"
year, month, day = map(int, "1990/05/15".split('/'))
# year=1990, month=5, day=15
```

**Common Mistakes**:
```python
❌ # Wrong - doesn't account for birthday
age = today.year - birth_date.year

✅ # Correct - adjusts for birthday
age = today.year - birth_date.year
if (today.month, today.day) < (birth_date.month, birth_date.day):
    age -= 1
```

---

### Exercise 2: Series Sum 🧮

**🎯 Objective**: Calculate the sum X + XX + XXX + XXXX using a single digit

**Concepts**: String manipulation, type conversion, mathematical series, loops

**Difficulty**: 🟢 Beginner-Intermediate

**Task**:
Given a digit X (0-9), calculate:
```
X + XX + XXX + XXXX
```

**Examples**:
```
X = 3:
3 + 33 + 333 + 3333 = 3702

X = 5:
5 + 55 + 555 + 5555 = 6170

X = 9:
9 + 99 + 999 + 9999 = 11106
```

**Expected Output**:
```
=== Exercise 2 ===
Enter a digit X: 3
Result: 3702
```

**Solution Approach**:
```python
def series_sum(x):
    """
    Calculate X + XX + XXX + XXXX where X is a digit.
    
    Args:
        x (int): Digit from 0-9
        
    Returns:
        int: Sum of the series
        
    Example:
        >>> series_sum(3)
        3702  # 3 + 33 + 333 + 3333
    """
    # Method 1: String repetition (most readable)
    term1 = int(str(x) * 1)  # "3" → 3
    term2 = int(str(x) * 2)  # "33" → 33
    term3 = int(str(x) * 3)  # "333" → 333
    term4 = int(str(x) * 4)  # "3333" → 3333
    
    return term1 + term2 + term3 + term4
    
    # Method 2: Mathematical formula
    # return x * (1 + 11 + 111 + 1111)
    # return x * 1234
    
    # Method 3: Loop (more flexible for N terms)
    # total = 0
    # for i in range(1, 5):
    #     total += int(str(x) * i)
    # return total


# Main execution
x = int(input("Enter a digit X: "))
result = series_sum(x)
print(f"Result: {result}")
```

**Visual Breakdown**:
```
For X = 3:

Term 1: str(3) * 1 = "3"     → int("3")    = 3
Term 2: str(3) * 2 = "33"    → int("33")   = 33
Term 3: str(3) * 3 = "333"   → int("333")  = 333
Term 4: str(3) * 4 = "3333"  → int("3333") = 3333
                                           ------
                                    Sum =   3702
```

**Alternative Approaches**:

1. **Mathematical Formula**:
```python
# Pattern: X * (1 + 11 + 111 + 1111)
result = x * 1234
```

2. **Flexible Loop** (works for any number of terms):
```python
def series_sum_n_terms(x, n):
    """Calculate X + XX + XXX + ... (n terms)"""
    return sum(int(str(x) * i) for i in range(1, n + 1))

# For 4 terms
series_sum_n_terms(3, 4)  # 3702
```

3. **Mathematical Generation** (no strings):
```python
def generate_term(digit, length):
    """
    Generate XX...X with 'length' repetitions.
    Example: generate_term(3, 4) = 3333
    """
    # 3333 = 3 * 1111
    # 1111 = (10^4 - 1) / 9
    return digit * ((10**length - 1) // 9)

def series_sum_math(x):
    return sum(generate_term(x, i) for i in range(1, 5))
```

**Test Cases**:
| X | Calculation | Result |
|---|-------------|--------|
| 0 | 0 + 00 + 000 + 0000 | 0 |
| 1 | 1 + 11 + 111 + 1111 | 1234 |
| 3 | 3 + 33 + 333 + 3333 | 3702 |
| 5 | 5 + 55 + 555 + 5555 | 6170 |
| 9 | 9 + 99 + 999 + 9999 | 11106 |

---

### Exercise 3: Double Dice 🎲

**🎯 Objective**: Simulate rolling two dice until they match, calculate average attempts over 100 trials

**Concepts**: `random` module, simulation, loops, statistics, averages

**Difficulty**: 🟡 Intermediate

**Task**:
1. Create `throw_dice()` function that returns random number 1-6
2. Create `throw_until_doubles()` that counts throws until both dice match
3. Run 100 trials of `throw_until_doubles()`
4. Calculate and display total throws and average (2 decimal places)

**Expected Output**:
```
=== Exercise 3 ===
Total throws: 314
Average throws to reach doubles: 3.14
```
*Note: Results vary due to randomness*

**Solution Approach**:
```python
import random

def throw_dice():
    """
    Simulate throwing a single die.
    
    Returns:
        int: Random number from 1 to 6
    """
    return random.randint(1, 6)


def throw_until_doubles():
    """
    Throw two dice until they show the same number.
    
    Returns:
        int: Number of throws needed to get doubles
    """
    throws = 0
    
    while True:
        throws += 1
        die1 = throw_dice()
        die2 = throw_dice()
        
        if die1 == die2:
            return throws


def main():
    """Run 100 trials and calculate statistics."""
    trials = 100
    total_throws = 0
    
    # Run simulations
    for _ in range(trials):
        throws = throw_until_doubles()
        total_throws += throws
    
    # Calculate average
    average = total_throws / trials
    
    # Display results
    print(f"Total throws: {total_throws}")
    print(f"Average throws to reach doubles: {average:.2f}")


# Run the simulation
if __name__ == "__main__":
    main()
```

**How It Works**:

1. **Single Trial Example**:
```
Throw 1: Die1=3, Die2=5 → No match, continue
Throw 2: Die1=2, Die2=4 → No match, continue
Throw 3: Die1=6, Die2=6 → MATCH! Return 3
```

2. **100 Trials**:
```
Trial 1: 3 throws
Trial 2: 5 throws
Trial 3: 1 throw (lucky!)
Trial 4: 7 throws
...
Trial 100: 2 throws

Total: 314 throws
Average: 314 / 100 = 3.14 throws per trial
```

**Statistical Analysis**:

The probability of getting doubles on any single throw:
```
Possible doubles: (1,1), (2,2), (3,3), (4,4), (5,5), (6,6) = 6 outcomes
Total outcomes: 6 × 6 = 36
Probability = 6/36 = 1/6 ≈ 16.67%

Expected value (theoretical average):
E = 1/p = 1/(1/6) = 6 throws

But in practice, you'll see values around 3-4 throws 
because the distribution is geometric.
```

**Enhancements**:

1. **Track Distribution**:
```python
from collections import Counter

def analyze_distribution():
    trials = 1000
    results = [throw_until_doubles() for _ in range(trials)]
    
    print(f"Average: {sum(results) / len(results):.2f}")
    print(f"Min: {min(results)}, Max: {max(results)}")
    
    # Show frequency
    freq = Counter(results)
    for throws, count in sorted(freq.items())[:10]:
        print(f"{throws} throws: {count} times ({count/trials*100:.1f}%)")
```

2. **Deterministic Testing**:
```python
# For testing, set random seed
random.seed(42)  # Same results every time
total = sum(throw_until_doubles() for _ in range(100))
print(f"Total: {total}")  # Always same output with seed=42
```

**Common Mistakes**:
```python
❌ # Wrong - infinite loop if no return
def throw_until_doubles():
    while True:
        if throw_dice() == throw_dice():  # These are DIFFERENT calls!
            break
    # No return statement!

✅ # Correct - store values, compare, return
def throw_until_doubles():
    throws = 0
    while True:
        throws += 1
        die1 = throw_dice()
        die2 = throw_dice()
        if die1 == die2:
            return throws
```

---

## 🧪 Testing Your Solutions

### Manual Testing

```python
# Test Exercise 1
>>> get_age(1990, 5, 15)
35  # Assuming today is after May 15, 2025

>>> can_retire('m', '1955/03/10')
True  # 70 years old, men retire at 67

>>> can_retire('f', '1965/06/20')
False  # 60 years old, women retire at 62

# Test Exercise 2
>>> series_sum(3)
3702
>>> series_sum(1)
1234
>>> series_sum(0)
0

# Test Exercise 3
>>> throw_dice() in range(1, 7)
True  # Result is 1-6

>>> result = throw_until_doubles()
>>> result >= 1
True  # Takes at least 1 throw
```

---

## 🐛 Common Errors & Solutions

### Error 1: Date parsing issues
```python
❌ # Wrong - might raise ValueError
year, month, day = "1990/5/3".split('/')  # Works
date(year, month, day)  # TypeError! They're strings!

✅ # Correct - convert to integers
year, month, day = map(int, "1990/5/3".split('/'))
date(year, month, day)  # Works!
```

### Error 2: String to int conversion
```python
❌ # Wrong - results in string concatenation
result = str(3) * 4  # "3333" (string)
total = result + result  # "33333333" (oops!)

✅ # Correct - convert to int first
result = int(str(3) * 4)  # 3333 (integer)
total = result + result  # 6666 (correct)
```

### Error 3: Comparing different dice throws
```python
❌ # Wrong - each call generates new random number
if throw_dice() == throw_dice():  # DIFFERENT values!

✅ # Correct - store first, then compare
die1 = throw_dice()
die2 = throw_dice()
if die1 == die2:
```

---

## 🚀 Running the Code

```bash
# Navigate to directory
cd Day4Functions/Exercises/ExercisesXPGold

# Run the file
python xpgoldfunctions.py
```

---

## 💡 Extension Challenges

1. **Exercise 1 Extension**: Add validation for future dates
2. **Exercise 2 Extension**: Make it work for any number of terms (user inputs N)
3. **Exercise 3 Extension**: Track and display distribution of results

---

## 🔗 Navigation

**📚 Week 1 Python**
- [← Exercises XP](../ExercisesXP/)
- [Next: Exercises Ninja →](../ExercisesXPNinja/)
- [📖 Week 1 Overview](../../../)

**📂 Day 4**
- [Main Concepts](../../README.md)
- [Exercises XP](../ExercisesXP/)
- [Exercises Gold](../ExercisesXPGold/) ← You are here
- [Exercises Ninja](../ExercisesXPNinja/)
- [Daily Challenge](../../DailyChallenge/)

---

**Author:** Kevin Cusnir "Lirioth"  
**Repository:** [Fullstack2026](https://github.com/Lirioth/Fullstack2026)  
**Week 1 Day 4** - Functions - Exercises XP Gold
