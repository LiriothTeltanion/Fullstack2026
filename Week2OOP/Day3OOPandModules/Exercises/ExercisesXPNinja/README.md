# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-efd1a61847.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

Two exercises on dunder methods in `exercisesxpninjadunder.py`: temperature classes that convert and compare, and a playful quantum particle.

## ▶️ How to run

```bash
python exercisesxpninjadunder.py
```

```text
>>> Temperature demo
t_c: 25.00 °C | t_f: 77.00 °F | t_k: 298.15 K
ordering: True
delta add/sub: 35.00 °C 15.00 °C
difference Kelvin: 10.0

>>> Quantum demo
Spooky Action at a Distance !!
Particle p1 is now in quantum entanglement with Particle p2
Quantum Interferences!!
p1 spin: 0.5 p2 spin: -0.5
...
```

The spin and the new `x` and `p` values are random, so they change on each run.

## 🎯 The challenge

1. **Temperature** - a base `Temperature` class stores only Kelvin; `Celsius`, `Kelvin` and `Fahrenheit` subclasses print in their own unit and convert with `.to(...)`. `@total_ordering` plus `__eq__` and `__lt__` give every comparison; adding or subtracting a number shifts the temperature, and `t1 - t2` returns the difference in Kelvin
2. **Quantum realm** - a `QuantumParticle` whose `position()`, `momentum()` and `spin()` measurements shake up its state and print `Quantum Interferences!!`; `entangle(other)` links two particles so measuring one spin sets the opposite spin on the other

## 🧠 What I learned

- Storing one canonical unit avoids rounding errors when converting back and forth
- `@total_ordering` writes `<=`, `>` and `>=` from just `__eq__` and `__lt__`
- `self.__class__(...)` returns a new object of the same subclass after an operation
- `__repr__` is worth writing early, because it makes debugging objects much easier

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 3 - OOP and Modules - Exercises XP Ninja
