# 🏋️ Exercises XP - Dictionaries Fundamentals

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XP

<img src="../../../../assets/readme/progress/exercises-xp-285afc1699.svg" width="100%" alt="Readiness status for Exercises XP">

**Goal:** Complete the standard exercises required to master the lesson's core concepts.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 785 |

### ▶️ Main paths

- `Week1Python/Day3Dictionaries/Exercises/ExercisesXP/exercisesxp.py`

### 🚀 Run

```bash
python Week1Python/Day3Dictionaries/Exercises/ExercisesXP/exercisesxp.py
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
**Last Updated:** October 19, 2025

Master essential dictionary operations through four practical exercises covering creation, iteration, nested structures, and multiple indexing strategies.

## 📊 Quick Stats

- **⏰ Duration**: 60-90 minutes
- **🎯 Difficulty**: 🟡 Intermediate
- **📝 Exercises**: 4 comprehensive challenges
- **✅ Prerequisites**: Week 1 Days 1-2 completed
- **🐍 Python Version**: 3.8+
- **📚 Key Topics**: `zip()`, `dict()`, iteration, nested dictionaries, multiple indexing

## 🎯 Learning Objectives

By completing these exercises, you will:
- ✅ Create dictionaries using `zip()` and `dict()` constructor
- ✅ Implement age-based pricing logic with dictionary iteration
- ✅ Navigate complex nested dictionary structures
- ✅ Use essential dictionary methods: `.pop()`, `.update()`, `.items()`, `.setdefault()`
- ✅ Build multiple indexing strategies from the same dataset
- ✅ Apply conditional logic with dictionary data
- ✅ Practice accumulator patterns for calculations

---

## 📋 Exercise Breakdown

### Exercise 1: Build Dictionary from Lists using `zip()`

**🎯 Objective**: Master dictionary creation by pairing two lists together

**Concepts**: `zip()` function, `dict()` constructor, key-value pairing

**Difficulty**: 🟢 Beginner

**Task**: 
Given two separate lists:
- Keys: `['Ten', 'Twenty', 'Thirty']`
- Values: `[10, 20, 30]`

Create a dictionary that pairs them together:
```python
{'Ten': 10, 'Twenty': 20, 'Thirty': 30}
```

**Expected Output**:
```python
{'Ten': 10, 'Twenty': 20, 'Thirty': 30}
```

**Solution Approach**:
```python
def build_dict(keys, values):
    """
    Pair keys and values into a dictionary.
    
    The zip() function pairs elements:
    zip(['a', 'b'], [1, 2]) → [('a', 1), ('b', 2)]
    
    dict() converts pairs to dictionary:
    dict([('a', 1), ('b', 2)]) → {'a': 1, 'b': 2}
    """
    return dict(zip(keys, values))

# Test it
keys = ['Ten', 'Twenty', 'Thirty']
values = [10, 20, 30]
result = build_dict(keys, values)
print(result)  # {'Ten': 10, 'Twenty': 20, 'Thirty': 30}
```

**Key Learning**: `zip()` pairs elements from multiple iterables, making dictionary creation from separate lists very clean!

**Common Mistake to Avoid**:
```python
# ❌ Don't manually loop when zip() is cleaner
result = {}
for i in range(len(keys)):
    result[keys[i]] = values[i]

# ✅ Use zip() - it's Pythonic!
result = dict(zip(keys, values))
```

---

### Exercise 2: Cinemax Family Ticket Calculator

**🎯 Objective**: Calculate total ticket costs using age-based pricing logic

**Concepts**: Dictionary iteration, conditional pricing, accumulator pattern, `.items()`

**Difficulty**: 🟡 Intermediate

**Pricing Rules**:
- **Under 3 years old**: Free ($0)
- **3-12 years old**: Child ticket ($10)
- **Over 12 years old**: Adult ticket ($15)

**Task**:
Given a family dictionary:
```python
family = {
    "Alice": 25,    # Adult
    "Bob": 8,       # Child
    "Charlie": 2,   # Free
    "Diana": 14     # Adult
}
```

Calculate and display:
1. Individual ticket price for each family member
2. Total cost for the entire family

**Expected Output**:
```
Alice pays 15
Bob pays 10
Charlie pays 0
Diana pays 15
Total: 40
```

**Solution Approach**:
```python
def ticket_price(age):
    """Return ticket price based on age."""
    if age < 3:
        return 0
    elif age <= 12:
        return 10
    else:
        return 15

def calculate_family_cost(family):
    """Calculate and display family ticket costs."""
    total = 0
    
    # Iterate through family members
    for name, age in family.items():
        price = ticket_price(age)
        print(f"{name} pays {price}")
        total += price
    
    print(f"Total: {total}")
    return total

# Test it
family = {"Alice": 25, "Bob": 8, "Charlie": 2, "Diana": 14}
calculate_family_cost(family)
```

**Key Learning**: 
- Use `.items()` to iterate over both keys and values
- Separate pricing logic into its own function (Single Responsibility Principle)
- Accumulator pattern: start with 0, add each price

**Design Pattern Demonstrated**:
```python
# Accumulator Pattern
total = 0                    # Initialize
for item in collection:
    total += calculate(item)  # Accumulate
return total                 # Return result
```

**Alternative Pythonic Approach**:
```python
# Using sum() with generator expression
total = sum(ticket_price(age) for age in family.values())
```

---

### Exercise 3: Zara Brand Nested Dictionary Operations

**🎯 Objective**: Navigate and manipulate complex nested dictionary structures

**Concepts**: Nested dictionaries, `.pop()`, `.update()`, `.setdefault()`, dictionary merging

**Difficulty**: 🟡 Intermediate

**Starting Data**:
```python
brand = {
    'name': 'Zara',
    'creation_date': 1975,
    'creator_name': 'Amancio Ortega',
    'type_of_clothes': ['men', 'women', 'children', 'home'],
    'international_competitors': ['Gap', 'H&M', 'Benetton'],
    'number_stores': 7000,
    'major_color': {
        'France': 'blue',
        'Spain': 'red',
        'US': ['pink', 'green']
    }
}
```

**Tasks**:
1. Change `number_stores` to 2
2. Add key `country_creation` with value "Spain"
3. Check if `international_competitors` key exists, if yes:
   - Add "Desigual" to the list
4. Delete `creation_date` key
5. Print last competitor in list
6. Print major color for US
7. Print total number of keys in dictionary
8. Print all keys
9. Create new dictionary with additional info:
   ```python
   more_on_zara = {
       'creation_date': 1975,
       'number_stores': 10000
   }
   ```
10. Use `.update()` to merge `more_on_zara` into `brand`

**Expected Behavior**:
```python
# After all operations
brand['number_stores']  # → 10000 (from update)
brand['country_creation']  # → "Spain"
'Desigual' in brand['international_competitors']  # → True
'creation_date' in brand  # → True (restored by update)
```

**Solution Approach**:
```python
def update_brand(brand):
    """Apply all transformations to brand dictionary."""
    
    # 1. Change number_stores
    brand['number_stores'] = 2
    
    # 2. Add country_creation
    brand['country_creation'] = "Spain"
    
    # 3. Check and add to competitors
    if 'international_competitors' in brand:
        brand['international_competitors'].append("Desigual")
    
    # Alternative using setdefault (creates if missing)
    # brand.setdefault('international_competitors', []).append("Desigual")
    
    # 4. Delete creation_date
    brand.pop('creation_date', None)  # None = no error if missing
    
    # 5-8. Print information
    print("Last competitor:", brand['international_competitors'][-1])
    print("US colors:", brand['major_color']['US'])
    print("Number of keys:", len(brand))
    print("All keys:", list(brand.keys()))
    
    # 9-10. Merge more_on_zara
    more_on_zara = {
        'creation_date': 1975,
        'number_stores': 10000
    }
    brand.update(more_on_zara)
    
    return brand

# Test it
result = update_brand(brand.copy())  # Use .copy() to preserve original
```

**Key Learnings**:

1. **Accessing Nested Values**:
```python
# Single level
brand['name']  # → 'Zara'

# Nested dictionary
brand['major_color']['US']  # → ['pink', 'green']

# List inside dictionary
brand['type_of_clothes'][0]  # → 'men'
```

2. **Safe Dictionary Operations**:
```python
# ❌ Unsafe - raises KeyError if missing
del brand['missing_key']

# ✅ Safe - no error if missing
brand.pop('missing_key', None)
```

3. **Dictionary Methods Comparison**:
```python
# Adding/Creating
brand['new_key'] = value        # Direct assignment
brand.setdefault('key', [])     # Create if missing, return value

# Removing
del brand['key']                # Error if missing
brand.pop('key')                # Error if missing
brand.pop('key', None)          # Safe - returns None if missing

# Merging
brand.update(other_dict)        # Merges, overwrites duplicates
{**brand, **other_dict}         # Creates new merged dict (Python 3.5+)
```

---

### Exercise 4: Disney Characters - Multiple Indexing Strategies

**🎯 Objective**: Build different dictionary mappings from the same data

**Concepts**: Dictionary comprehensions, `enumerate()`, `sorted()`, multiple indexing approaches

**Difficulty**: 🟡 Intermediate

**Starting Data**:
```python
users = ['Mickey', 'Minnie', 'Donald', 'Ariel', 'Pluto']
```

**Tasks**:
Create **THREE different dictionaries** from this list:

1. **Character → Index** (by list order)
   ```python
   {'Mickey': 0, 'Minnie': 1, 'Donald': 2, 'Ariel': 3, 'Pluto': 4}
   ```

2. **Index → Character** (reverse of #1)
   ```python
   {0: 'Mickey', 1: 'Minnie', 2: 'Donald', 3: 'Ariel', 4: 'Pluto'}
   ```

3. **Character → Alphabetical Index**
   ```python
   # After sorting: ['Ariel', 'Donald', 'Mickey', 'Minnie', 'Pluto']
   {'Ariel': 0, 'Donald': 1, 'Mickey': 2, 'Minnie': 3, 'Pluto': 4}
   ```

**Expected Output**:
```python
# Dictionary 1
{'Mickey': 0, 'Minnie': 1, 'Donald': 2, 'Ariel': 3, 'Pluto': 4}

# Dictionary 2
{0: 'Mickey', 1: 'Minnie', 2: 'Donald', 3: 'Ariel', 4: 'Pluto'}

# Dictionary 3
{'Ariel': 0, 'Donald': 1, 'Mickey': 2, 'Minnie': 3, 'Pluto': 4}
```

**Solution Approach**:
```python
def create_disney_dicts(users):
    """Create three different index mappings."""
    
    # Dictionary 1: Character → Index (list order)
    char_to_index = {name: idx for idx, name in enumerate(users)}
    # Or: dict(enumerate(users))  # Won't work - wrong order!
    # Or: {users[i]: i for i in range(len(users))}  # Less Pythonic
    
    # Dictionary 2: Index → Character (reverse of #1)
    index_to_char = {idx: name for idx, name in enumerate(users)}
    # Or: dict(enumerate(users))  # This one DOES work!
    
    # Dictionary 3: Character → Alphabetical Index
    sorted_users = sorted(users)
    char_to_alpha_index = {name: idx for idx, name in enumerate(sorted_users)}
    
    return char_to_index, index_to_char, char_to_alpha_index

# Test it
users = ['Mickey', 'Minnie', 'Donald', 'Ariel', 'Pluto']
d1, d2, d3 = create_disney_dicts(users)

print("Character → Index:", d1)
print("Index → Character:", d2)
print("Character → Alpha Index:", d3)
```

**Key Learnings**:

1. **`enumerate()` Fundamentals**:
```python
# enumerate() returns (index, value) pairs
for idx, name in enumerate(['a', 'b', 'c']):
    print(idx, name)
# Output:
# 0 a
# 1 b
# 2 c
```

2. **Dictionary Comprehension Syntax**:
```python
# Basic pattern
{key_expr: value_expr for item in iterable}

# With enumerate
{name: idx for idx, name in enumerate(list)}  # Name as key
{idx: name for idx, name in enumerate(list)}  # Index as key
```

3. **Alternative Approaches**:
```python
# Method 1: Dictionary comprehension (recommended)
{name: i for i, name in enumerate(users)}

# Method 2: dict() with generator
dict((name, i) for i, name in enumerate(users))

# Method 3: dict() with list of tuples
dict([(name, i) for i, name in enumerate(users)])

# Method 4: Manual loop (not recommended)
result = {}
for i, name in enumerate(users):
    result[name] = i
```

**Why Alphabetical Indexing is Useful**:
```python
# Imagine searching in a phone book
# Original order: Random
# Alphabetical: Binary search possible, human-friendly

# Use case: Quick lookup
if alpha_index['Mickey'] < alpha_index['Pluto']:
    print("Mickey comes before Pluto alphabetically")
```

---

## 🧪 Testing Your Solutions

### Manual Testing in REPL
```python
# Test Exercise 1
>>> keys = ['Ten', 'Twenty', 'Thirty']
>>> values = [10, 20, 30]
>>> build_dict(keys, values)
{'Ten': 10, 'Twenty': 20, 'Thirty': 30}

# Test Exercise 2
>>> family = {"Alice": 25, "Bob": 8, "Charlie": 2, "Diana": 14}
>>> ticket_price(25)
15
>>> ticket_price(8)
10
>>> ticket_price(2)
0

# Test Exercise 3
>>> brand = {'name': 'Zara', 'number_stores': 7000}
>>> brand['number_stores'] = 2
>>> brand['number_stores']
2

# Test Exercise 4
>>> users = ['Mickey', 'Minnie', 'Donald']
>>> {name: i for i, name in enumerate(users)}
{'Mickey': 0, 'Minnie': 1, 'Donald': 2}
```

### Test Cases Table

| Exercise | Test Input | Expected Output | Tests |
|----------|-----------|----------------|-------|
| 1 | `['a', 'b'], [1, 2]` | `{'a': 1, 'b': 2}` | Basic zip |
| 1 | `[], []` | `{}` | Empty lists |
| 2 | `age=2` | `0` | Free ticket |
| 2 | `age=10` | `10` | Child ticket |
| 2 | `age=25` | `15` | Adult ticket |
| 3 | Add "Desigual" | In competitors list | List append |
| 3 | `.pop('creation_date')` | Key removed | Dictionary deletion |
| 4 | `['B', 'A']` | `{'B': 0, 'A': 1}` | Original order |
| 4 | `sorted(['B', 'A'])` | `['A', 'B']` | Alphabetical |

---

## 🐛 Common Errors & Solutions

### Error 1: KeyError when accessing dictionary
**What it means**: Trying to access a key that doesn't exist

**Example**:
```python
❌ brand = {'name': 'Zara'}
   print(brand['age'])  # KeyError: 'age'

✅ # Solution 1: Use .get() with default
   print(brand.get('age', 'Unknown'))  # 'Unknown'

✅ # Solution 2: Check first
   if 'age' in brand:
       print(brand['age'])
```

### Error 2: Trying to modify dictionary during iteration
**What it means**: Can't change dictionary size while looping through it

**Example**:
```python
❌ for key in brand:
       if key == 'old':
           del brand[key]  # RuntimeError!

✅ # Solution: Create list of keys first
   for key in list(brand.keys()):
       if key == 'old':
           del brand[key]
```

### Error 3: Confusing .items(), .keys(), .values()
**What it means**: Using wrong method for iteration

**Example**:
```python
❌ for item in brand.values():
       print(item, brand[item])  # Can't index by value!

✅ # Solution: Use .items() for both
   for key, value in brand.items():
       print(key, value)
```

### Error 4: Forgetting dictionaries are mutable
**What it means**: Changing original when you meant to copy

**Example**:
```python
❌ brand2 = brand  # Same object!
   brand2['name'] = 'H&M'
   print(brand['name'])  # 'H&M' - original changed!

✅ # Solution: Use .copy()
   brand2 = brand.copy()
   brand2['name'] = 'H&M'
   print(brand['name'])  # 'Zara' - original preserved
```

---

## 🚀 Running the Code

```bash
# Navigate to directory
cd Day3Dictionaries/Exercises/ExercisesXP

# Run the file
python exercisesxp.py
```

**Expected execution flow**:
1. Each exercise function runs independently
2. Results print to console
3. No errors should occur if implemented correctly

---

## 💡 Extension Challenges

For students who finish early:

1. **Exercise 1 Extension**: Create a function that can merge multiple dictionaries
   ```python
   merge_dicts({'a': 1}, {'b': 2}, {'c': 3})
   # → {'a': 1, 'b': 2, 'c': 3}
   ```

2. **Exercise 2 Extension**: Add group discount logic
   - Families with 4+ members get 10% off total
   
3. **Exercise 3 Extension**: Implement deep copy for nested dictionaries
   - Modify nested value without affecting original

4. **Exercise 4 Extension**: Create reverse lookup
   - Given index, return character in O(1) time

---

## 🎓 Key Takeaways

After completing these exercises, you should understand:

1. **`zip()` is your friend** for pairing lists into dictionaries
2. **`.items()` is essential** for iterating with both keys and values
3. **Nested dictionaries** require careful navigation (check keys exist!)
4. **Dictionary comprehensions** are powerful and Pythonic
5. **Methods matter**: `.pop()`, `.update()`, `.setdefault()` each have specific uses
6. **Always use `.get()` or `in`** to safely access potentially missing keys

---

## 🔗 Navigation

**📚 Week 1 Python**
- [← Day 2 Lists](../../Day2ListsIteratingAndFormattingData/)
- [Next: Exercises Gold →](../ExercisesXPGold/)
- [📖 Week 1 Overview](../../)

**📂 Day 3**
- [Main Concepts](../../README.md)
- [Exercises XP](../ExercisesXP/) ← You are here
- [Exercises XP+](../ExercisesXP+/)
- [Exercises Gold](../ExercisesXPGold/)
- [Daily Challenge](../../DailyChallenge/)

---

**Author:** Kevin Cusnir "Lirioth"  
**Repository:** [Fullstack2026](https://github.com/Lirioth/Fullstack2026)  
**Week 1 Day 3** - Dictionaries - Exercises XP
