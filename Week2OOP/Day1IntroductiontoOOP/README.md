# 🧱 Day 1 — Introduction to Object-Oriented Programming

<div align="center">

<img src="../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../assets/readme/progress/day1-introductionto-oop-a75d18f2da.svg" width="100%" alt="Progress card for Day1 Introductionto OOP">

</div>

My first day of OOP in Python: writing classes, creating objects from them and giving those objects their own data and methods.

## 📁 What's here

- [Exercises](Exercises/) — XP (cats, dogs, a song printer, a zoo), plus the Gold and Ninja extras
- [Daily Challenge](DailyChallenge/) — Old MacDonald's farm, a `Farm` class that stores animals and prints the farm

## 🚀 How to run

From this folder:

```bash
python Exercises/ExercisesXP/exercisesxp.py
python DailyChallenge/oldmcdonaldsfarm.py
```

## 💡 Key concepts

- A class is a blueprint; each object made from it has its own attributes
- `__init__` sets up a new object, and `self` is the object itself
- Instance methods can read and change the object's state
- Class variables are shared by every instance

```python
class Animal:
    count = 0  # shared by all animals

    def __init__(self, name, age):
        self.name = name
        self.age = age
        Animal.count += 1

    def celebrate_birthday(self):
        self.age += 1
        return f"Happy birthday {self.name}! Now {self.age} years old."

dog = Animal("Buddy", 3)
dog.celebrate_birthday()
print(dog.age, Animal.count)  # 4 1
```

## 🎓 What I learned

Thinking in objects instead of loose functions took a moment, but once I modeled the cats and the zoo as classes the code got easier to read. The most common mistake I made was forgetting `self` as the first parameter of a method.

## 👤 Author

**Kevin "Lirioth" Cusnir**
https://github.com/LiriothTeltanion/Fullstack2026
