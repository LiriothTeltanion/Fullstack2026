# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-efd1a61847.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

More dunder methods in `exercisesxpninjadunder.py`. One part is a family of temperature classes that convert and compare, the other a just-for-fun quantum particle.

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

The spin and the new `x` and `p` of `p1` are random, so those lines differ between runs.

## 🎯 The challenge

1. **Temperature** - the base class keeps a single number, Kelvin. `Celsius`, `Kelvin` and `Fahrenheit` print in their own unit, and `.to(Fahrenheit)` converts. `@total_ordering` with `__eq__` and `__lt__` gives all six comparisons. A number added or subtracted is a shift in Kelvin, and `t1 - t2` returns the gap as a float
2. **Quantum realm** - every `position()`, `momentum()` or `spin()` call on a `QuantumParticle` randomizes its state and prints `Quantum Interferences!!`. After `entangle(other)`, measuring one particle's spin gives the partner the opposite spin

A trap I left in: `Celsius(25)` means 25 Kelvin, because the constructor expects Kelvin. For a real Celsius value you call `Celsius.from_value(25)`, as the demo does.

## 🧠 What I learned

- With only Kelvin stored, converting back and forth can't drift between units
- `@total_ordering` fills in `<=`, `>` and `>=` once `__eq__` and `__lt__` exist
- `self.__class__(...)` in `__add__` keeps the result a `Celsius` when I start from a `Celsius`
- A good `__repr__`, like `Celsius(298.15 K)`, shows what's inside an object at a glance

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 3 - OOP and Modules - Exercises XP Ninja
