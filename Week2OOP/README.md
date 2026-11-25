# 🏗️ Week 2 — Object-Oriented Programming

<div align="center">

<img src="../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../assets/readme/progress/week2-oop-f3122b8ed5.svg" width="100%" alt="Progress card for Week2 OOP">

</div>

Week 2 of the Developers Institute full-stack bootcamp was all about object-oriented Python: classes, inheritance, modules, dunder methods, files, JSON and a first taste of APIs. Each day folder has its own README with the details.

## 📅 Days

| Day | Topic | What I built |
|-----|-------|--------------|
| [Day 1](Day1IntroductiontoOOP/) | Intro to OOP | Cats, dogs, a song printer, a zoo and Old MacDonald's farm |
| [Day 2](Day2OOPInheritanceEncapsulationPolymorphism/) | Inheritance, encapsulation, polymorphism | Pet hierarchy, dog fights, family tree, a pagination class |
| [Day 3](Day3OOPandModules/) | OOP and modules | Currency with operators, Circle class, translator, user info |
| [Day 4](Day4PythonFileIOJSONandAPI/) | File I/O, JSON and APIs | Sentence generator, menu manager, Giphy calls, text analysis |
| [Day 5](Day5MiniProject/) | Mini projects | Anagram checker, rock-paper-scissors, weather app, card deck, timer module |
| [Remote learning](RemoteLearningOOP/) | Extra practice | Vaccines mini project, air management challenge |

## 🚀 How to run

Every exercise is a standalone script. From the `Week2OOP` folder, for example:

```bash
python Day1IntroductiontoOOP/Exercises/ExercisesXP/exercisesxp.py
python Day5MiniProject/Exercises/AnagramChecker/anagrams.py
python Day5MiniProject/Exercises/RockPaperScissors/rockpaperscissors.py
```

The timer module in Day 5 has tests (it needs `requests`):

```bash
cd Day5MiniProject/DailyChallenge/Modules
pip install -r requirements.txt
python -m unittest discover -s tests
```

## 💡 Key ideas

```python
class Animal:
    def __init__(self, name: str):
        self.name = name

class Dog(Animal):
    def bark(self) -> str:
        return f"{self.name} says woof!"
```

- Classes, `__init__` and instance methods
- Inheritance with `super()` and method overriding
- Properties and setters (the Circle class uses them for radius and diameter)
- Dunder methods like `__str__`, `__add__` and `__lt__`
- Reading and writing files with `with`, and loading/saving JSON

## 🎓 What I learned

OOP finally clicked for me this week. Splitting a program into small classes made the Day 5 projects much easier to keep organized, and writing my own `__add__` and `__lt__` showed me how Python's built-in operators actually work under the hood.

## 👤 Author

**Kevin "Lirioth" Cusnir**
Full-Stack Development Bootcamp, Developers Institute
https://github.com/LiriothTeltanion/Fullstack2026
