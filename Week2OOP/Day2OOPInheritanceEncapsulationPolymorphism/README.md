# 🏛️ Day 2 — Inheritance, Encapsulation and Polymorphism

<div align="center">

<img src="../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../assets/readme/progress/day2-oopinheritance-encapsulation-polymorphism-6270e8dcad.svg" width="100%" alt="Progress card for Day2 OOPInheritance Encapsulation Polymorphism">

</div>

Day 2 was about the three big OOP ideas: child classes that reuse a parent, hiding data behind methods, and different classes that answer the same method call in their own way.

## 📁 What's here

- [Exercises](Exercises/)
  - [ExercisesXP](Exercises/ExercisesXP/) — cat breeds and a `Pets` class, dogs that fight, a `PetDog` that learns tricks, and a `Family` of `Person` objects
  - [ExercisesXPGold](Exercises/ExercisesXPGold/) — bank accounts, a minimum-balance account and a simple ATM menu
  - [ExercisesXPNinja](Exercises/ExercisesXPNinja/) — Conway's Game of Life, with a subclass whose grid grows
- [Daily Challenge](DailyChallenge/) — a [`Pagination`](DailyChallenge/Pagination/) class that splits a list into pages

## 🚀 How to run

From this folder:

```bash
python Exercises/ExercisesXP/exercisesxp.py
python Exercises/ExercisesXPGold/exercisesxpgoldinheritance.py
python Exercises/ExercisesXPNinja/exercisesxpninjainheritance.py
python DailyChallenge/Pagination/pagination.py
```

## 💡 Key concepts

```python
class Cat:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def walk(self):
        return f"{self.name} is just walking around"

class Bengal(Cat):
    def sing(self, sounds):
        return sounds

class Pets:
    def __init__(self, animals):
        self.animals = animals

    def walk(self):
        for animal in self.animals:
            print(animal.walk())  # any object with walk() works here
```

- **Inheritance**: a subclass gets everything from its parent and can add or override methods
- **`super()`**: calls the parent's version, usually inside `__init__`
- **Encapsulation**: `_name` means "internal", `__name` is name-mangled; access goes through methods or properties
- **Polymorphism**: `Pets.walk()` doesn't care which cat breed it gets, only that it has `walk()`

## 🎓 What I learned

The `PetDog` exercise showed me how much a subclass gets for free: it reused `bark` and `fight` from `Dog` and only added training, playing and tricks. On the Gold ATM I learned to keep the balance check inside the account class instead of spreading it around the menu code. My most common bug was forgetting to call `super().__init__()` in a child class.

## 👤 Author

**Kevin "Lirioth" Cusnir**
https://github.com/LiriothTeltanion/Fullstack2026
