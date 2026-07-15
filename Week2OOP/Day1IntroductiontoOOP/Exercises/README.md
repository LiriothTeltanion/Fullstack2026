# 🏋️ OOP Exercises - Introduction to Classes and Objects

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises

<img src="../../../assets/readme/progress/exercises-3cc599f444.svg" width="100%" alt="Readiness status for Exercises">

**Goal:** Organize practical exercises with clear goals, execution paths, validation, and improvement guidance.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 11 |
| Source files | 3 |
| Test files | 0 |
| Text lines | 1,238 |

### ▶️ Main paths

- `Week2OOP/Day1IntroductiontoOOP/Exercises/ExercisesXP/exercisesxp.py`
- `Week2OOP/Day1IntroductiontoOOP/Exercises/ExercisesXPGold/exercisesxpgold.py`
- `Week2OOP/Day1IntroductiontoOOP/Exercises/ExercisesXPNinja/exercisesxpninja.py`

### 🚀 Run

```bash
python Week2OOP/Day1IntroductiontoOOP/Exercises/ExercisesXP/exercisesxp.py
python Week2OOP/Day1IntroductiontoOOP/Exercises/ExercisesXPGold/exercisesxpgold.py
python Week2OOP/Day1IntroductiontoOOP/Exercises/ExercisesXPNinja/exercisesxpninja.py
```

### 🟢 What is already strong

- ✅ README documentation is generated and repeatable.
- ✅ Contains 3 source file(s) across practical exercises or projects.
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

A comprehensive set of exercises to master the fundamentals of Object-Oriented Programming in Python.

## 📋 What You'll Learn

These exercises cover the essential building blocks of OOP:

### 🏗️ Core Concepts
- **Class Definition**: Creating blueprints for objects
- **Object Instantiation**: Creating instances from classes
- **Instance Methods**: Functions that operate on object data
- **Attributes**: Data stored within objects
- **Constructor**: The `__init__` method for object setup

### 💡 Practical Skills
- Modeling real-world entities as classes
- Organizing code with object-oriented principles
- Understanding the relationship between classes and objects
- Implementing methods that interact with object state

## 🚀 How to Run

```bash
python exercises.py
```

The script demonstrates various OOP concepts through practical examples and interactive exercises.

## 📊 Exercise Overview

### 1️⃣ Basic Class Creation
**🎯 Goal**: Learn to define your first class and create objects
- Create simple classes with attributes
- Understand the difference between class and object
- Practice object instantiation

### 2️⃣ Constructor Methods
**🎯 Goal**: Master the `__init__` method for object initialization
- Initialize objects with starting values
- Use parameters to customize object creation
- Understand the `self` parameter

### 3️⃣ Instance Methods
**🎯 Goal**: Add behavior to your classes
- Create methods that operate on object data
- Return values from methods
- Modify object state through methods

### 4️⃣ Attributes and Properties
**🎯 Goal**: Manage object data effectively
- Work with instance variables
- Access and modify object attributes
- Understand attribute scope and lifetime

### 5️⃣ Class vs Instance Variables
**🎯 Goal**: Distinguish between shared and individual data
- Use class variables for shared data
- Use instance variables for individual object data
- Understand when to use each type

## 🔧 Key Patterns Demonstrated

### 🏗️ Basic Class Template
```python
class ExampleClass:
    # Class variable (shared by all instances)
    class_variable = 0
    
    def __init__(self, parameter1, parameter2):
        # Instance variables (unique to each object)
        self.attribute1 = parameter1
        self.attribute2 = parameter2
        ExampleClass.class_variable += 1
    
    def instance_method(self):
        # Method that operates on instance data
        return f"Processing {self.attribute1}"
    
    def modify_state(self, new_value):
        # Method that changes object state
        self.attribute1 = new_value
```

### 📦 Object Creation and Usage
```python
# Creating objects
obj1 = ExampleClass("value1", "value2")
obj2 = ExampleClass("different", "values")

# Using methods
result = obj1.instance_method()
obj1.modify_state("updated_value")

# Accessing attributes
print(obj1.attribute1)
print(ExampleClass.class_variable)
```

## 💡 Best Practices Learned

### 🎯 Class Design
- **Clear Purpose**: Each class should represent one concept
- **Descriptive Names**: Use nouns for class names (PascalCase)
- **Logical Grouping**: Related data and behavior together
- **Proper Initialization**: Always include `__init__` when needed

### 🔧 Method Design
- **Descriptive Names**: Use verbs for method names (snake_case)
- **Single Responsibility**: Each method should do one thing
- **Consistent Interface**: Similar methods should work similarly
- **Return Values**: Methods should return meaningful results

### 📋 Attribute Management
- **Meaningful Names**: Attributes should clearly indicate their purpose
- **Proper Scope**: Use instance variables for object-specific data
- **Initialization**: Set initial values in `__init__`
- **Validation**: Consider validating input when setting attributes

## 🧪 Testing Your Understanding

After completing the exercises, you should be able to:

### ✅ Fundamental Skills
- [ ] Define a class with multiple attributes
- [ ] Create objects and call their methods
- [ ] Explain the difference between class and instance variables
- [ ] Use `self` correctly in method definitions
- [ ] Initialize objects with different starting values

### ✅ Application Skills
- [ ] Model a real-world entity as a class
- [ ] Create methods that interact with object state
- [ ] Design a class with both data and behavior
- [ ] Understand when objects are useful vs simple variables

## 🔗 Connection to Real Projects

These concepts directly apply to:
- **🎮 Game Development**: Player, Enemy, Item classes
- **💼 Business Applications**: Customer, Order, Product classes
- **📊 Data Processing**: DataProcessor, Analyzer, Reporter classes
- **🌐 Web Development**: User, Session, Request classes

## 🚀 Next Steps

After mastering these exercises:
- **➡️ Move to Day 2**: Learn inheritance and polymorphism
- **🔄 Practice**: Create your own classes for different scenarios
- **📖 Explore**: Look at Python's built-in classes and their methods

---
**⏱️ Time Required**: 2-3 hours  
**🎯 Difficulty**: Beginner  
**💻 Prerequisites**: Basic Python syntax and functions

Start building your object-oriented mindset! 🏗️
